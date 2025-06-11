"""
Kubernetes Cluster Health Monitoring DAG

This DAG performs daily health checks on the Kubernetes cluster and alerts
on critical issues. It runs multiple health check scripts in parallel and
stores results for historical tracking.
"""

from __future__ import annotations

import pendulum
import json
from typing import Dict, Any
from airflow.models.dag import DAG
from airflow.providers.cncf.kubernetes.operators.pod import KubernetesPodOperator
from airflow.operators.python import PythonOperator
# from airflow.providers.cncf.kubernetes.utils.pod_manager import PodPhase  # Not needed
from airflow.exceptions import AirflowException
from airflow.models import Variable
from kubernetes.client import models as k8s

# Health check configuration
HEALTH_CHECKS = [
    {
        'name': 'k8s_health_check',
        'script': 'k8s-health-check.sh',
        'description': 'Comprehensive Kubernetes cluster health check',
        'critical': True,
    },
    {
        'name': 'storage_health_check', 
        'script': 'storage-health-check.sh',
        'description': 'Storage and PVC health monitoring',
        'critical': True,
    },
    {
        'name': 'network_monitor',
        'script': 'network-monitor.sh',
        'description': 'Network and ingress health check',
        'critical': False,
    },
    {
        'name': 'flux_deployment_check',
        'script': 'flux-deployment-check.sh',
        'description': 'GitOps deployment status check',
        'critical': True,
    },
]

def alert_on_failure(context: Dict[str, Any]) -> None:
    """
    Alert callback for task failures.
    Sends alerts to the webhook handler for distribution.
    """
    import requests
    from datetime import datetime
    
    task_instance = context['task_instance']
    dag_id = context['dag'].dag_id
    task_id = task_instance.task_id
    execution_date = context['execution_date']
    
    # Find the check configuration
    check_info = next((c for c in HEALTH_CHECKS if c['name'] == task_id), None)
    
    # Prepare alert payload
    alert_payload = {
        'check_name': task_id,
        'dag_id': dag_id,
        'execution_date': str(execution_date),
        'severity': 'critical' if check_info and check_info.get('critical') else 'warning',
        'message': f"Health check '{task_id}' failed in DAG '{dag_id}'",
        'description': check_info.get('description', 'Unknown check') if check_info else 'Unknown check',
        'timestamp': datetime.utcnow().isoformat(),
        'failures': [
            f"Task {task_id} failed at {execution_date}",
            f"Exception: {context.get('exception', 'No exception details')}"
        ]
    }
    
    # Send to webhook handler
    try:
        webhook_url = 'http://airflow-webhook-handler.airflow.svc.cluster.local:8080/'
        response = requests.post(webhook_url, json=alert_payload, timeout=10)
        if response.status_code == 200:
            print(f"Alert sent successfully for {task_id}")
        else:
            print(f"Failed to send alert: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Error sending alert: {e}")
    
    # Still log locally for debugging
    print(f"ALERT: Health check failure in {dag_id}.{task_id} at {execution_date}")
    print(f"Alert payload: {json.dumps(alert_payload, indent=2)}")

def process_health_results(**context) -> Dict[str, Any]:
    """
    Process health check results from all tasks and determine overall health.
    """
    from airflow.models import TaskInstance
    
    results = {}
    overall_health = 'healthy'
    critical_failures = []
    warnings = []
    
    # Get the DAG run and task instances
    dag_run = context['dag_run']
    
    # Gather results from all health check tasks
    for check in HEALTH_CHECKS:
        task_id = check['name']
        try:
            # Get the task instance state
            ti = dag_run.get_task_instance(task_id)
            if ti:
                # Determine health based on task state
                if ti.state == 'success':
                    exit_code = 0
                    status = 'healthy'
                elif ti.state == 'failed':
                    # Check if it was a warning (exit code 1) or critical (exit code 2)
                    # For now, assume failed = critical
                    exit_code = 2
                    status = 'critical'
                else:
                    exit_code = 3
                    status = 'unknown'
                
                results[task_id] = {
                    'exit_code': exit_code,
                    'status': status,
                    'state': ti.state,
                    'critical': check['critical'],
                    'description': check['description']
                }
                
                if status == 'critical' and check['critical']:
                    critical_failures.append(f"{task_id}: {check['description']}")
                    overall_health = 'critical'
                elif status == 'warning':
                    warnings.append(f"{task_id}: {check['description']}")
                    if overall_health == 'healthy':
                        overall_health = 'warning'
        except Exception as e:
            results[task_id] = {
                'exit_code': 3,
                'status': 'error',
                'error': str(e)
            }
            if check['critical']:
                critical_failures.append(f"{task_id}: Failed to get results - {str(e)}")
                overall_health = 'critical'
    
    summary = {
        'timestamp': pendulum.now().to_iso8601_string(),
        'overall_health': overall_health,
        'results': results,
        'critical_failures': critical_failures,
        'warnings': warnings,
    }
    
    # Push summary for downstream tasks
    context['task_instance'].xcom_push(key='health_summary', value=json.dumps(summary))
    
    # Log the summary
    print(f"Health Check Summary: {json.dumps(summary, indent=2)}")
    
    # Alert if critical
    if overall_health == 'critical':
        print(f"ALERT: Critical health issues detected! {len(critical_failures)} critical failures")
        
        # Send summary alert
        import requests
        from datetime import datetime
        
        alert_payload = {
            'check_name': 'cluster_health_summary',
            'dag_id': context['dag'].dag_id,
            'execution_date': str(context['execution_date']),
            'severity': 'critical',
            'message': f"Cluster health check detected {len(critical_failures)} critical failures",
            'description': 'Overall cluster health summary',
            'timestamp': datetime.utcnow().isoformat(),
            'failures': critical_failures + warnings,
            'summary': summary
        }
        
        try:
            webhook_url = 'http://airflow-webhook-handler.airflow.svc.cluster.local:8080/'
            response = requests.post(webhook_url, json=alert_payload, timeout=10)
            if response.status_code == 200:
                print("Summary alert sent successfully")
            else:
                print(f"Failed to send summary alert: {response.status_code}")
        except Exception as e:
            print(f"Error sending summary alert: {e}")
    
    return summary

def create_health_check_task(dag: DAG, check: Dict[str, str]) -> KubernetesPodOperator:
    """
    Create a KubernetesPodOperator for a health check script.
    """
    # Mount scripts from ConfigMap
    volume_mounts = [
        k8s.V1VolumeMount(
            name='health-scripts',
            mount_path='/scripts',
            read_only=True
        )
    ]
    
    volumes = [
        k8s.V1Volume(
            name='health-scripts',
            config_map=k8s.V1ConfigMapVolumeSource(
                name='health-check-scripts-real',
                default_mode=0o755
            )
        )
    ]
    
    # Environment variables
    env_vars = [
        k8s.V1EnvVar(name='HOME', value='/tmp'),  # For kubectl config
    ]
    
    return KubernetesPodOperator(
        task_id=check['name'],
        name=f"health-check-{check['name']}",
        namespace='airflow',
        image='bitnami/kubectl:1.31',
        cmds=['bash'],
        arguments=[f'/scripts/{check["script"]}'],
        volumes=volumes,
        volume_mounts=volume_mounts,
        env_vars=env_vars,
        get_logs=True,
        is_delete_operator_pod=True,
        service_account_name='airflow-health-checker',  # Use the service account we created
        on_failure_callback=alert_on_failure if check['critical'] else None,
        container_resources=k8s.V1ResourceRequirements(
            requests={'memory': '256Mi', 'cpu': '100m'},
            limits={'memory': '512Mi', 'cpu': '500m'}
        ),
        do_xcom_push=True,
    )

# DAG Definition
default_args = {
    'owner': 'platform-team',
    'depends_on_past': False,
    'retries': 1,
    'retry_delay': pendulum.duration(minutes=5),
}

with DAG(
    dag_id='cluster_health_monitoring',
    default_args=default_args,
    description='Daily Kubernetes cluster health monitoring and alerting',
    schedule='0 8 * * *',  # Daily at 8 AM UTC
    start_date=pendulum.datetime(2025, 6, 11, tz='UTC'),
    catchup=False,
    tags=['monitoring', 'health-check', 'critical'],
    doc_md=__doc__,
) as dag:
    
    # Create health check tasks
    health_tasks = []
    for check in HEALTH_CHECKS:
        task = create_health_check_task(dag, check)
        health_tasks.append(task)
    
    # Process results and determine overall health
    process_results = PythonOperator(
        task_id='process_health_results',
        python_callable=process_health_results,
        provide_context=True,
        trigger_rule='all_done',  # Run even if some checks fail
    )
    
    # Store results in ConfigMap for historical tracking
    store_results = KubernetesPodOperator(
        task_id='store_health_results',
        name='store-health-results',
        namespace='airflow',
        image='bitnami/kubectl:1.31',
        cmds=['bash', '-c'],
        arguments=[
            '''
            # Get current date and timestamp
            DATE=$(date +%Y-%m-%d)
            TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)
            
            # Get task statuses from Airflow context
            echo "Storing health check results for $DATE"
            
            # Create health summary
            cat > /tmp/health-summary.json <<EOF
            {
              "timestamp": "$TIMESTAMP",
              "date": "$DATE",
              "checks": {
                "k8s_health_check": "{{ task_instance.xcom_pull(task_ids='k8s_health_check', key='return_value') | default('unknown', true) }}",
                "storage_health_check": "{{ task_instance.xcom_pull(task_ids='storage_health_check', key='return_value') | default('unknown', true) }}",
                "network_monitor": "{{ task_instance.xcom_pull(task_ids='network_monitor', key='return_value') | default('unknown', true) }}",
                "flux_deployment_check": "{{ task_instance.xcom_pull(task_ids='flux_deployment_check', key='return_value') | default('unknown', true) }}"
              },
              "dag_run_id": "{{ run_id }}",
              "execution_date": "{{ ds }}"
            }
            EOF
            
            # Create or update ConfigMap
            kubectl create configmap health-check-$DATE \
                --from-file=summary=/tmp/health-summary.json \
                --from-literal=timestamp="$TIMESTAMP" \
                --from-literal=date="$DATE" \
                --dry-run=client -o yaml | kubectl apply -f -
            
            # Label it for easy querying
            kubectl label configmap health-check-$DATE \
                type=health-check \
                date="$DATE" \
                --overwrite
            
            # Clean up old results (keep last 30 days)
            echo "Cleaning up old health check results..."
            kubectl get configmap -l type=health-check \
                --sort-by='.metadata.creationTimestamp' \
                -o name | head -n -30 | xargs -r kubectl delete || true
            
            echo "Health check results stored successfully"
            '''
        ],
        get_logs=True,
        is_delete_operator_pod=True,
        service_account_name='airflow-health-checker',
        trigger_rule='all_done',
        container_resources=k8s.V1ResourceRequirements(
            requests={'memory': '128Mi', 'cpu': '100m'},
            limits={'memory': '256Mi', 'cpu': '200m'}
        ),
    )
    
    # Set dependencies
    health_tasks >> process_results >> store_results
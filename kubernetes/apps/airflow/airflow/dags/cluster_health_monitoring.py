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
from airflow.providers.cncf.kubernetes.operators.kubernetes_pod import KubernetesPodOperator
from airflow.operators.python import PythonOperator
from airflow.providers.cncf.kubernetes.utils.pod_manager import PodPhase
from airflow.exceptions import AirflowException
from airflow.models import Variable
from kubernetes.client import models as k8s

# Health check configuration
HEALTH_CHECKS = [
    {
        'name': 'k8s_health_check',
        'script': '/scripts/k8s-health-check.ts',
        'description': 'Comprehensive Kubernetes cluster health check',
        'critical': True,
    },
    {
        'name': 'storage_health_check', 
        'script': '/scripts/storage-health-check.ts',
        'description': 'Storage and PVC health monitoring',
        'critical': True,
    },
    {
        'name': 'network_monitor',
        'script': '/scripts/network-monitor.ts',
        'description': 'Network and ingress health check',
        'critical': False,
    },
    {
        'name': 'flux_deployment_check',
        'script': '/scripts/flux-deployment-check.ts',
        'description': 'GitOps deployment status check',
        'critical': True,
    },
]

def alert_on_failure(context: Dict[str, Any]) -> None:
    """
    Alert callback for task failures.
    In production, this would send to Slack/PagerDuty/email.
    """
    task_instance = context['task_instance']
    dag_id = context['dag'].dag_id
    task_id = task_instance.task_id
    execution_date = context['execution_date']
    
    # Log the failure for now - in production, integrate with alerting
    print(f"ALERT: Health check failure in {dag_id}.{task_id} at {execution_date}")
    print(f"Task logs: {context.get('exception', 'No exception details')}")
    
    # TODO: Implement actual alerting
    # Example: send_slack_notification(message)
    # Example: create_pagerduty_incident(severity='critical')

def process_health_results(**context) -> Dict[str, Any]:
    """
    Process health check results from all tasks and determine overall health.
    """
    results = {}
    overall_health = 'healthy'
    critical_failures = []
    warnings = []
    
    # Gather results from all health check tasks
    for check in HEALTH_CHECKS:
        task_id = check['name']
        try:
            # Get task instance and its exit code
            ti = context['task_instance'].xcom_pull(task_ids=task_id, key='return_value')
            if ti:
                exit_code = ti.get('exit_code', 3)
                results[task_id] = {
                    'exit_code': exit_code,
                    'status': 'healthy' if exit_code == 0 else 'warning' if exit_code == 1 else 'critical',
                    'critical': check['critical'],
                    'description': check['description']
                }
                
                if exit_code >= 2 and check['critical']:
                    critical_failures.append(f"{task_id}: {check['description']}")
                    overall_health = 'critical'
                elif exit_code == 1:
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
                critical_failures.append(f"{task_id}: Failed to get results")
                overall_health = 'critical'
    
    summary = {
        'timestamp': pendulum.now().to_iso8601_string(),
        'overall_health': overall_health,
        'results': results,
        'critical_failures': critical_failures,
        'warnings': warnings,
    }
    
    # Push summary for downstream tasks
    context['task_instance'].xcom_push(key='health_summary', value=summary)
    
    # Alert if critical
    if overall_health == 'critical':
        alert_on_failure(context)
    
    return summary

def create_health_check_task(dag: DAG, check: Dict[str, str]) -> KubernetesPodOperator:
    """
    Create a KubernetesPodOperator for a health check script.
    """
    # Configure volume mounts for scripts
    volume_mounts = [
        k8s.V1VolumeMount(
            name='scripts',
            mount_path='/scripts',
            read_only=True
        ),
        k8s.V1VolumeMount(
            name='kubeconfig',
            mount_path='/root/.kube',
            read_only=True
        )
    ]
    
    volumes = [
        k8s.V1Volume(
            name='scripts',
            config_map=k8s.V1ConfigMapVolumeSource(
                name='health-check-scripts'
            )
        ),
        k8s.V1Volume(
            name='kubeconfig',
            secret=k8s.V1SecretVolumeSource(
                secret_name='kubeconfig-secret'
            )
        )
    ]
    
    # Environment variables
    env_vars = [
        k8s.V1EnvVar(name='KUBECONFIG', value='/root/.kube/config'),
        k8s.V1EnvVar(name='FORCE_COLOR', value='0'),  # Disable color output for logs
    ]
    
    return KubernetesPodOperator(
        task_id=check['name'],
        name=f"health-check-{check['name']}",
        namespace='airflow',
        image='denoland/deno:alpine-1.47.0',
        cmds=['sh', '-c'],
        arguments=[
            f'''
            # Install kubectl for scripts that need it
            apk add --no-cache kubectl
            
            # Run the health check script
            deno run --allow-all {check['script']} --json > /tmp/results.json
            EXIT_CODE=$?
            
            # Log results
            echo "Exit code: $EXIT_CODE"
            cat /tmp/results.json
            
            # Push exit code to XCom
            echo "{{\\"exit_code\\": $EXIT_CODE}}" > /airflow/xcom/return.json
            
            # Exit with the script's exit code
            exit $EXIT_CODE
            '''
        ],
        volumes=volumes,
        volume_mounts=volume_mounts,
        env_vars=env_vars,
        get_logs=True,
        is_delete_operator_pod=True,
        on_failure_callback=alert_on_failure if check['critical'] else None,
        resources=k8s.V1ResourceRequirements(
            requests={'memory': '512Mi', 'cpu': '250m'},
            limits={'memory': '1Gi', 'cpu': '500m'}
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
        cmds=['sh', '-c'],
        arguments=[
            '''
            # Get the health summary from XCom
            SUMMARY='{{ ti.xcom_pull(task_ids="process_health_results", key="health_summary") | tojson }}'
            DATE='{{ ds }}'
            
            # Create or update ConfigMap with results
            kubectl create configmap health-check-$DATE \
                --from-literal=summary="$SUMMARY" \
                --from-literal=timestamp="$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
                --dry-run=client -o yaml | kubectl apply -f -
            
            # Label it for easy querying
            kubectl label configmap health-check-$DATE \
                type=health-check \
                overall_health="{{ ti.xcom_pull(task_ids="process_health_results", key="health_summary")["overall_health"] }}" \
                --overwrite
            
            # Clean up old results (keep last 30 days)
            kubectl get configmap -l type=health-check \
                --sort-by='.metadata.creationTimestamp' \
                -o name | head -n -30 | xargs -r kubectl delete
            '''
        ],
        get_logs=True,
        is_delete_operator_pod=True,
        trigger_rule='all_done',
    )
    
    # Set dependencies
    health_tasks >> process_results >> store_results
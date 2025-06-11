"""
Simple Health Check DAG for Testing

A simplified version of the health monitoring DAG to verify basic functionality.
"""

from datetime import datetime, timedelta
from airflow import DAG
from airflow.providers.cncf.kubernetes.operators.pod import KubernetesPodOperator

default_args = {
    'owner': 'platform-team',
    'depends_on_past': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

with DAG(
    dag_id='simple_health_check',
    default_args=default_args,
    description='Simplified health check for testing',
    schedule_interval='@daily',
    start_date=datetime(2025, 6, 11),
    catchup=False,
    tags=['test', 'health-check'],
) as dag:
    
    # Simple echo test
    echo_test = KubernetesPodOperator(
        task_id='echo_health_check',
        name='echo-health-check',
        namespace='airflow',
        image='busybox:latest',
        cmds=['sh', '-c'],
        arguments=['echo "Health check would run here"; date; exit 0'],
        get_logs=True,
        is_delete_operator_pod=True,
    )
    
    # Check cluster nodes
    check_nodes = KubernetesPodOperator(
        task_id='check_nodes',
        name='check-nodes',
        namespace='airflow',
        image='bitnami/kubectl:1.31',
        cmds=['sh', '-c'],
        arguments=['kubectl get nodes -o wide || exit 1'],
        get_logs=True,
        is_delete_operator_pod=True,
        service_account_name='airflow-worker',  # Use existing service account
    )
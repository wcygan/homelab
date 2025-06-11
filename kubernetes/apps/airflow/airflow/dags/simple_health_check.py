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
    
    # Simple date check
    check_date = KubernetesPodOperator(
        task_id='check_date',
        name='check-date',
        namespace='airflow',
        image='busybox:latest',
        cmds=['sh', '-c'],
        arguments=['echo "Current date:"; date; echo "Test completed successfully"'],
        get_logs=True,
        is_delete_operator_pod=True,
    )
    
    # Set task dependency
    echo_test >> check_date
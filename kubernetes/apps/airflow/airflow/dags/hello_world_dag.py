from __future__ import annotations

import pendulum
import logging

from airflow.models.dag import DAG
from airflow.operators.bash import BashOperator
from airflow.operators.python import PythonOperator

def log_test_function():
    """Test function that generates various log levels"""
    logger = logging.getLogger(__name__)

    logger.info("This is an INFO log message from Python task")
    logger.warning("This is a WARNING log message from Python task")
    logger.error("This is an ERROR log message from Python task")

    print("This is a print statement that should appear in logs")
    print("Testing log persistence with multiple lines")
    print("Log timestamp:", pendulum.now().to_iso8601_string())
    
    # Vector sidecar now captures logs immediately
    return "Python task completed successfully"

with DAG(
    dag_id="hello_world",
    schedule="0 * * * *",  # Run hourly at the beginning of the hour
    start_date=pendulum.datetime(2023, 1, 1, tz="UTC"), # Adjust start_date as needed
    catchup=False,
    tags=["example", "logging-test"],
    description="Test DAG for persistent logging verification",
) as dag:

    hello_operator = BashOperator(
        task_id="say_hello",
        bash_command='''
        echo "Hello World!"
        echo "Current date: $(date)"
        echo "Pod hostname: $(hostname)"
        echo "Testing multi-line bash output"
        echo "This should persist in logs even after pod termination"
        # Vector sidecar captures logs immediately
        echo "Task complete"
        ''',
    )

    python_log_test = PythonOperator(
        task_id="python_log_test",
        python_callable=log_test_function,
    )

    # Set task dependencies
    hello_operator >> python_log_test
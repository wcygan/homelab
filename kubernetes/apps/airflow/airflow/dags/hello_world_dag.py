from __future__ import annotations

import pendulum

from airflow.models.dag import DAG
from airflow.operators.bash import BashOperator

with DAG(
    dag_id="hello_world",
    schedule="0 * * * *",  # Run hourly at the beginning of the hour
    start_date=pendulum.datetime(2023, 1, 1, tz="UTC"), # Adjust start_date as needed
    catchup=False,
    tags=["example"],
) as dag:
    hello_operator = BashOperator(
        task_id="say_hello",
        bash_command='echo "Hello World!"',
    )
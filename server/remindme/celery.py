from celery import Celery
from .config import settings

celery_app = Celery(
    'worker', 
    broker=settings.BROKER_URL,
    backend=settings.BROKER_URL
)

celery_app.conf.update(
    task_routes={
        'tasks.*': {'queue': 'default'}
    },
)
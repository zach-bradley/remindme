import logging
import os
from celery import Celery
from .config import settings
from .database import get_db

celery_app = Celery(
    'remindme', 
    broker=os.getenv('CELERY_BROKER_URL', settings.BROKER_URL),
    backend=os.getenv('CELERY_RESULT_BACKEND', settings.BROKER_URL)
)

celery_app.conf.update(
    task_routes={
        'tasks.*': {'queue': 'default'}
    },
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
)

def setup_logging():
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    return logger

setup_logging()

@celery_app.task
def update_user_location(user_id,latitude,longitude):
    from .models.users import UserManager
    db = get_db()
    user_manager = UserManager(db).get_location(user_id)
    celery_app.logger.info(user_manager)
    location = user_manager.get_location(user_id)
    celery_app.logger.info("User location: {}".format(location))
    return
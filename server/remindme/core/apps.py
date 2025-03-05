from django.apps import AppConfig

class UserConfig(AppConfig):
    name = "remindme.core"

    def ready(self):
        return

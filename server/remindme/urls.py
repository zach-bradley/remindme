from django.contrib import admin
from django.urls import re_path, path
from django.conf import settings
from django.conf.urls.static import static
from remindme.core import views as core_views

# from django_otp.admin import OTPAdminSite

# admin.site.__class__ = OTPAdminSite

urlpatterns = [
    path(r"admin/", admin.site.urls),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# These routes should come last, so that the application always falls back
# to the single-page app (SPA).
urlpatterns += [
    re_path(r"^$", core_views.index, name="index"),
    re_path(r"^.*/$", core_views.index, name="index"),
]

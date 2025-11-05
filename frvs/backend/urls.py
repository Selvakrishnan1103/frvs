from django.urls import path
from . import views

urlpatterns = [
    path('', views.facepage, name='facepage'),
]

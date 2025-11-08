from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.get_categories, name='get_categories'),
    path('face_recognition/', views.face_recognition_view, name='face_recognition'),
]


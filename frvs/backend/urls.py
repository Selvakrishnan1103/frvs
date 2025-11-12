from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.get_categories, name='get_categories'),
    path("verify-face/", views.verify_face, name="verify_face"),
]


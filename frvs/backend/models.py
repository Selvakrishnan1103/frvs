from django.db import models


class Category(models.Model):
    student_id = models.CharField(max_length=6, unique=True)
    student_name = models.CharField(max_length=100)
    parent_id = models.CharField(max_length=6, unique=True)
    parent_name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.student_id} - {self.student_name}"
# Create your models here.

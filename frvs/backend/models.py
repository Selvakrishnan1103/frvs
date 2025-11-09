from django.db import models

class Category(models.Model):
    student_id = models.CharField(max_length=6)
    student_name = models.CharField(max_length=100)
    parent_id = models.CharField(max_length=6)
    parent_name = models.CharField(max_length=100)

    # New: store face images
    parent_face = models.URLField(max_length=500)

    class Meta:
        unique_together = ('student_id', 'parent_id')

    def __str__(self):
        return f"{self.student_id} - {self.student_name}"


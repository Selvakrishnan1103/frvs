from django.contrib import admin
from .models import Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('student_id', 'student_name', 'parent_id', 'parent_name', 'parent_face')
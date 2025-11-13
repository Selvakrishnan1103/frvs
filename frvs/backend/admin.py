from django.contrib import admin
from .models import Category
from django.utils.html import format_html

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('student_id', 'student_name', 'parent_id', 'parent_name', 'parent_face', 'delete_button')

    def delete_button(self, obj):
        return format_html(
            '<a class="button" style="color:Green; background-color:LightGray;" href="/admin/backend/category/{}/delete/">Delete</a>',
            obj.pk
        )

    delete_button.short_description = "Delete"

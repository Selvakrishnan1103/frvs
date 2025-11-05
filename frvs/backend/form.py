from django import forms
from .models import Category

class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ['student_id', 'student_name', 'parent_id', 'parent_name']
        widgets = {
            'student_id': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter student ID'}),
            'student_name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter student name'}),
            'parent_id': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter parent ID'}),
            'parent_name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter parent name'}),
        }
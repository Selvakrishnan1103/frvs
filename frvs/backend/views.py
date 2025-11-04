from django.shortcuts import render
from .models import Category
from .form import CategoryForm


def facepage(request):
    if request.method == 'POST':
        form = CategoryForm(request.POST)
        if form.is_valid():
            form.save()
            # Redirect or render a success message
    else:
        form = CategoryForm()
    return render(request, 'backend/post_facepage.html', {'form': form})
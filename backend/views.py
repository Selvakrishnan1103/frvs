from django.http import JsonResponse
from .models import Category

def get_categories(request):
    if request.method == 'GET':
        data = list(Category.objects.values())
        return JsonResponse(data, safe=False)

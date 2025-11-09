from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Category
import face_recognition
import numpy as np

@csrf_exempt
def get_categories(request):
    if request.method == "GET":
        data = list(Category.objects.values())
        return JsonResponse(data, safe=False)

    elif request.method == "POST":
        # Collect text fields
        student_id = request.POST.get("student_id")
        student_name = request.POST.get("student_name")
        parent_id = request.POST.get("parent_id")
        parent_name = request.POST.get("parent_name")

        # Collect image files
        student_face = request.FILES.get("student_face")
        parent_face = request.FILES.get("parent_face")

        # Create record in database
        category = Category.objects.create(
            student_id=student_id,
            student_name=student_name,
            parent_id=parent_id,
            parent_name=parent_name,
            student_face=student_face,
            parent_face=parent_face
        )

        return JsonResponse({"message": "Saved successfully"}, status=201)


@csrf_exempt
def face_recognition_view(request):
    if request.method == "POST":
        # Get uploaded images
        parent_face_file = request.FILES.get("parent_face")
        live_face_file = request.FILES.get("live_face")

        if not parent_face_file or not live_face_file:
            return JsonResponse({"error": "Both parent_face and live_face are required"}, status=400)

        # Load the images into numpy arrays
        parent_image = face_recognition.load_image_file(parent_face_file)
        live_image = face_recognition.load_image_file(live_face_file)

        # Encode (convert face to vector)
        try:
            parent_encoding = face_recognition.face_encodings(parent_image)[0]
            live_encoding = face_recognition.face_encodings(live_image)[0]
        except IndexError:
            return JsonResponse({"error": "No face detected in one of the images"}, status=400)

        # Compare faces
        result = face_recognition.compare_faces([parent_encoding], live_encoding)
        match = bool(result[0])

        if match:
            return JsonResponse({"message": "Faces match ✅", "match": True})
        else:
            return JsonResponse({"message": "Faces do not match ❌", "match": False})

    return JsonResponse({"error": "Invalid method"}, status=405)


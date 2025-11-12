from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import face_recognition
import numpy as np
import json
import base64
import requests
from io import BytesIO
from PIL import Image
from .models import Category


@csrf_exempt
def get_categories(request):
    if request.method == "GET":
        data = list(Category.objects.values())
        return JsonResponse(data, safe=False)

    elif request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        student_id = data.get("studentId")
        student_name = data.get("studentName")
        parent_id = data.get("parentId")
        parent_name = data.get("parentName")
        parent_face = data.get("parentFace")

        print("Data received:", data)
        print("Parent face URL:", parent_face)

        Category.objects.create(
            student_id=student_id,
            student_name=student_name,
            parent_id=parent_id,
            parent_name=parent_name,
            parent_face=parent_face,
        )

        return JsonResponse({"message": "Saved successfully"}, status=201)


@csrf_exempt
def verify_face(request):
    try:
        # Load JSON
        data = json.loads(request.body.decode('utf-8'))
        parent_id = data.get("parentId")
        captured_data = data.get("faceImage")

        if not parent_id or not captured_data:
            return JsonResponse({"error": "Missing parentId or faceImage"}, status=400)

        # Get stored parent image from DB (Base64)
        parent_obj = Category.objects.get(parent_id=parent_id)
        parent_base64 = parent_obj.parent_face

        # Decode base64 images
        parent_bytes = base64.b64decode(parent_base64.split(",")[1])
        captured_bytes = base64.b64decode(captured_data.split(",")[1])

        # Convert to Pillow Image (force RGB)
        parent_img = Image.open(BytesIO(parent_bytes)).convert("RGB")
        captured_img = Image.open(BytesIO(captured_bytes)).convert("RGB")

        # Convert to numpy
        parent_array = np.array(parent_img)
        captured_array = np.array(captured_img)

        print(f"Parent: {parent_img.mode} {parent_array.dtype} {parent_array.shape}")
        print(f"Captured: {captured_img.mode} {captured_array.dtype} {captured_array.shape}")

        # Detect faces
        parent_locations = face_recognition.face_locations(parent_array)
        captured_locations = face_recognition.face_locations(captured_array)

        print("Parent faces found:", len(parent_locations))
        print("Captured faces found:", len(captured_locations))

        if len(parent_locations) == 0:
            return JsonResponse({"error": "No face detected in parent image"}, status=400)
        if len(captured_locations) == 0:
            return JsonResponse({"error": "No face detected in captured image"}, status=400)

        # Encode faces
        parent_encodings = face_recognition.face_encodings(parent_array, known_face_locations=parent_locations)
        captured_encodings = face_recognition.face_encodings(captured_array, known_face_locations=captured_locations)

        parent_encoding = parent_encodings[0]
        captured_encoding = captured_encodings[0]

        # Compare faces
        result = face_recognition.compare_faces([parent_encoding], captured_encoding)
        distance = face_recognition.face_distance([parent_encoding], captured_encoding)[0]
        confidence = round((1 - distance) * 100, 2)

        return JsonResponse({
            "match": result[0],
            "confidence": confidence,
            "message": "✅ Face verified successfully" if result[0] else "❌ Face not matched"
        })

    except Category.DoesNotExist:
        return JsonResponse({"error": "Parent not found"}, status=404)
    except Exception as e:
        print("Face verification error:", e)
        return JsonResponse({"error": str(e)}, status=400)

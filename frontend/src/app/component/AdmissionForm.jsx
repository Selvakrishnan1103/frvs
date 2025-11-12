"use client";

import { useState, useRef } from "react";

export default function AdmissionForm() {
  const [formData, setFormData] = useState({
    studentName: "",
    studentId: "",
    parentName: "",
    parentId: "",
  });

  const [cameraOn, setCameraOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Open the camera
  const openCamera = async () => {
    setCameraOn(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (error) {
      alert("Camera access denied or not available.");
      console.error(error);
    }
  };

  // Capture the photo
  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/png");
    setCapturedImage(imageData);

    // Stop the camera after capture
    const stream = video.srcObject;
    stream.getTracks().forEach((track) => track.stop());
    setCameraOn(false);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!capturedImage) {
    alert("Please capture parent image first!");
    return;
  }

  // 1️⃣ Upload image to Cloudinary
  const cloudName = "denobiomr"; // e.g. "dqwerty123"
  const uploadPreset = "parent_face"; // create this in Cloudinary console

  const formDataCloud = new FormData();
  formDataCloud.append("file", capturedImage);
  formDataCloud.append("upload_preset", uploadPreset);

  let imageUrl = null;

  try {
    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formDataCloud,
      }
    );

    const uploadData = await uploadResponse.json();

    if (!uploadResponse.ok) {
      console.error("Cloudinary error:", uploadData);
      alert("Error uploading image to Cloudinary");
      return;
    }

    imageUrl = uploadData.secure_url;
    console.log("✅ Image uploaded:", imageUrl);
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    alert("Failed to upload image");
    return;
  }

  // 2️⃣ Send all form data (including image URL) to Django backend
  const dataToSend = {
    ...formData,
    parentFace: imageUrl, // Django model stores this URL
  };
  console.log(dataToSend)
  try {
      const response = await fetch("http://127.0.0.1:8000/categories/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errData = await response.json();
        console.error(errData);
        alert("Error saving data in backend!");
        return;
      }

      alert("Form submitted successfully!");
      console.log("✅ Data sent to backend:", dataToSend);
      setCapturedImage(null);
      setFormData({ studentName: "", studentId: "", parentName: "", parentId: "" });
    } catch (err) {
      console.error("Backend error:", err);
      alert("Failed to save data in backend.");
    }
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          Parent & Student Information
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student Name */}
          <div>
            <label className="block font-semibold mb-1">Student Name</label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter student name"
            />
          </div>

          {/* Student ID */}
          <div>
            <label className="block font-semibold mb-1">Student ID</label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter student ID"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Parent Name</label>
            <input
              type="text"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter parent name"
            />
          </div>

          {/* Parent ID */}
          <div>
            <label className="block font-semibold mb-1">Parent ID</label>
            <input
              type="text"
              name="parentId"
              value={formData.parentId}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter parent ID"
            />
          </div>

          {/* Camera Section */}
          <div>
            <label className="block font-semibold mb-1">Parent Image</label>

            {!cameraOn && !capturedImage && (
              <button
                type="button"
                onClick={openCamera}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg shadow-md"
              >
                Open Camera
              </button>
            )}

            {/* Live Camera View */}
            {cameraOn && (
              <div className="mt-3 flex flex-col items-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="rounded-lg border border-gray-300 w-full max-w-md"
                ></video>
                <button
                  type="button"
                  onClick={handleCapture}
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg shadow-md"
                >
                  Capture Image
                </button>
              </div>
            )}

            {/* Captured Image Preview */}
            {capturedImage && (
              <div className="mt-3 flex flex-col items-center">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="rounded-lg border border-gray-300 w-full max-w-md"
                />
                <button
                  type="button"
                  onClick={openCamera}
                  className="mt-3 bg-gray-600 hover:bg-gray-700 text-white py-1 px-4 rounded-lg shadow-md"
                >
                  Retake
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md"
            >
              Save Information
            </button>
          </div>
        </form>

        {/* Hidden Canvas for Capturing Frame */}
        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>
    </div>
  );
}

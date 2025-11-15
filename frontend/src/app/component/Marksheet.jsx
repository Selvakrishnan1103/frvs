"use client";
import { useState, useRef } from "react";

export default function Marksheet() {
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confidence, setConfidence] = useState(null);
  const videoRef = useRef(null);

  // Access webcam
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      alert("Unable to access camera. Please allow permission.");
      console.error(error);
    }
  };

  // Capture one frame and send for verification
  const handleVerify = async () => {
    setLoading(true);
    setVerified(false);
    setConfidence(null);

    await startCamera();

    // Wait for video to initialize properly
    setTimeout(async () => {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/jpeg");

      // Stop camera
      const stream = video.srcObject;
      if (stream) stream.getTracks().forEach((track) => track.stop());

      // Send to Django
      try {
        const res = await fetch("http://127.0.0.1:8000/verify-face/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            parentId: "kt567",
            faceImage: imageData,
          }),
        });

        const data = await res.json();
        setLoading(false);

        if (res.ok && data.verified) {
          setVerified(true);
          setConfidence(data.confidence);
        } else {
          alert(data.error || "❌ Face not matched!");
        }
      } catch (err) {
        setLoading(false);
        console.error(err);
        alert("Verification failed. Please try again.");
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center mb-6">Student Marksheet</h1>

        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="border border-gray-300 p-2">Subject</th>
              <th className="border border-gray-300 p-2">Marks</th>
              <th className="border border-gray-300 p-2">Grade</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2">Mathematics</td>
              <td className="border border-gray-300 p-2">92</td>
              <td className="border border-gray-300 p-2">A+</td>
            </tr>
          </tbody>
        </table>

        {/* Webcam preview */}
        <div className="flex justify-center mt-6">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="rounded-lg shadow-md w-64 h-48 bg-black"
          ></video>
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={handleVerify}
            disabled={loading}
            className={`${
              verified
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white font-semibold py-2 px-6 rounded-lg shadow-md`}
          >
            {loading ? "Verifying..." : verified ? "Verified ✅" : "Verify"}
          </button>
        </div>

        {verified && (
          <p className="text-center text-green-600 mt-3 font-medium">
            Verified successfully! Confidence: {confidence}%
          </p>
        )}
      </div>
    </div>
  );
}

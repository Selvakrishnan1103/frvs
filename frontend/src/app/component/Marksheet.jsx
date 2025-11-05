"use client";

import { useState } from "react";

export default function Marksheet() {
  const [verified, setVerified] = useState(false);

  const handleVerify = () => {
    setVerified(true);
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
            <tr>
              <td className="border border-gray-300 p-2">Science</td>
              <td className="border border-gray-300 p-2">88</td>
              <td className="border border-gray-300 p-2">A</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">English</td>
              <td className="border border-gray-300 p-2">85</td>
              <td className="border border-gray-300 p-2">A</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2">Computer Science</td>
              <td className="border border-gray-300 p-2">95</td>
              <td className="border border-gray-300 p-2">A+</td>
            </tr>
          </tbody>
        </table>

        {/* Verify Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleVerify}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md"
          >
            {verified ? "Verified ✅" : "Verify"}
          </button>
        </div>

        {/* Verification Message */}
        {verified && (
          <p className="text-center text-green-600 mt-3 font-medium">
            Marksheet verified successfully!
          </p>
        )}
      </div>
    </div>
  );
}

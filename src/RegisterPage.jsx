import React from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  return (
    <div
      className="h-screen w-screen flex justify-center items-center bg-cover bg-center relative "
      style={{
        backgroundImage: "url('/image/register.webp')",
      }} // replace with your background
    >
      {/* Blur layer */}
      <div className="absolute inset-0 backdrop-blur-xs"></div>

      <div className="bg-[#CAD3D2]/85 rounded-2xl shadow-[0_5px_10px_rgba(0,0,0,0.6)] p-9 h-145 w-140 text-center relative">
        {/* Title */}
        <h1 className="text-4xl font-bold text-[#155C7F] mb-4">
          নতুন অ্যাকাউন্ট তৈরি করুন
        </h1>
        <p className="text-lg text-[#155C7F] mb-3">
          আপনার প্রয়োজন অনুযায়ী রোল নির্বাচন করুন
        </p>

        {/* Patient Button */}
        <button
          onClick={() => navigate("/patientRegister")}
          className="w-full h-22 text-2xl bg-[#155C7F] text-white py-3 rounded-lg font-semibold hover:bg-[#00214D] transition mb-4"
        >
          রোগী
        </button>
        {/* Patient Button */}
        <button
          onClick={() => navigate("/doctorRegister")}
          className="w-full h-22 text-2xl bg-[#155C7F] text-white py-3 rounded-lg font-semibold hover:bg-[#00214D] transition mb-4"
        >
          ডাক্তার
        </button>
        {/* Patient Button */}
        <button
          onClick={() => navigate("/hospitalRegister")}
          className="w-full h-22 text-2xl bg-[#155C7F] text-white py-3 rounded-lg font-semibold hover:bg-[#00214D] transition mb-4"
        >
          হাসপাতাল ম্যানেজমেন্ট
        </button>
        {/* Patient Button */}
        <button
          onClick={() => navigate("/pharmacyRegister")}
          className="w-full h-22 text-2xl bg-[#155C7F] text-white py-3 rounded-lg font-semibold hover:bg-[#00214D] transition mb-4"
        >
          ফার্মাসি
        </button>
      </div>
    </div>
  );
}

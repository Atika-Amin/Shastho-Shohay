import React from "react";
import { useNavigate } from "react-router-dom";

export default function DoctorRegister() {
  const navigate = useNavigate();
  return (
    <div
      className="h-screen w-screen flex justify-center items-center bg-cover bg-center relative "
      style={{
        backgroundImage: "url('/image/doctorRG.jpg')",
      }} // replace with your background
    >
      {/* Blur layer */}
      <div className="absolute inset-0 backdrop-blur-xs"></div>

      <div className="bg-[#CAD3D2]/85 rounded-2xl shadow-[0_5px_10px_rgba(0,0,0,0.6)] p-9 h-170 w-140 text-center relative">
        {/* Title */}
        <h1 className="text-3xl font-bold text-[#155C7F] mb-4">
          আপনার চিকিৎসক প্রোফাইল তৈরি করুন
        </h1>

        {/* Input fields */}
        <input
          type="text"
          placeholder="আপনার পূর্ণ নাম লিখুন"
          className="w-full h-12 text-lg bg-[#F7F7F7] mb-2 p-5 rounded-lg shadow-xl  focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />
        <input
          type="text"
          placeholder="আপনার ফোন নম্বর লিখুন"
          className="w-full h-12 text-lg bg-[#F7F7F7] mb-2 p-5 rounded-lg shadow-xl  focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />
        <input
          type="email"
          placeholder="আপনার ইমেইল ঠিকানা লিখুন"
          className="w-full h-12 text-lg bg-[#F7F7F7] mb-2 p-5 rounded-lg shadow-xl  focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />
        <input
          type="text"
          placeholder="আপনার বর্তমান ঠিকানা বা অবস্থান লিখুন"
          className="w-full h-12 text-lg bg-[#F7F7F7] mb-2 p-5 rounded-lg shadow-xl  focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />
        <input
          type="text"
          placeholder="আপনার ডিগ্রি (MBBS, FCPS ইত্যাদি) লিখুন"
          className="w-full h-12 text-lg bg-[#F7F7F7] mb-2 p-5 rounded-lg shadow-xl  focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />
        <input
          type="text"
          placeholder="আপনার বিশেষত্ব  লিখুন"
          className="w-full h-12 text-lg bg-[#F7F7F7] mb-2 p-5 rounded-lg shadow-xl  focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />
        <input
          type="text"
          placeholder="আপনার নিবন্ধন নম্বর (BMDC) লিখুন"
          className="w-full h-12 text-lg bg-[#F7F7F7] mb-2 p-5 rounded-lg shadow-xl  focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />

        <input
          type="password"
          placeholder="আপনার পাসওয়ার্ড লিখুন"
          className="w-full h-12 text-lg bg-[#F7F7F7] mb-2 p-5 rounded-lg shadow-xl  focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />
        <input
          type="password"
          placeholder="আপনার পাসওয়ার্ড পুনরায় লিখুন"
          className="w-full h-12 text-lg bg-[#F7F7F7] mb-4 p-5 rounded-lg shadow-xl  focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />

        {/* Login button */}
        <button
          onClick={() => navigate("/login")}
          className="w-full h-14 text-xl bg-[#155C7F] text-white py-3 rounded-lg font-semibold hover:bg-[#00214D] transition mb-4"
        >
          নতুন অ্যাকাউন্ট তৈরি করুন
        </button>
      </div>
    </div>
  );
}

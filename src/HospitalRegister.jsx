import React from "react";
import { useNavigate } from "react-router-dom";

export default function HospitalRegister() {
  const navigate = useNavigate();
  return (
    <div
      className="h-screen w-screen flex justify-center items-center bg-cover bg-center relative "
      style={{
        backgroundImage: "url('/image/hospitalRG.webp')",
      }} // replace with your background
    >
      {/* Blur layer */}
      <div className="absolute inset-0 backdrop-blur-xs"></div>

      <div className="bg-[#CAD3D2]/85 rounded-2xl shadow-[0_5px_10px_rgba(0,0,0,0.6)] p-9 h-170 w-140 text-center relative">
        {/* Title */}
        <h1 className="text-3xl font-bold text-[#155C7F] mb-5">
          হাসপাতালের তথ্য দিয়ে একাউন্ট খুলুন
        </h1>

        {/* Input fields */}
        <input
          type="text"
          placeholder="হাসপাতালের নাম লিখুন"
          className="w-full h-13 text-lg bg-[#F7F7F7] mb-2 p-5 rounded-lg shadow-xl  focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />
        <input
          type="text"
          placeholder="ফোন নম্বর লিখুন"
          className="w-full h-13 text-lg bg-[#F7F7F7] mb-2 p-5 rounded-lg shadow-xl  focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />
        <input
          type="email"
          placeholder="হাসপাতালের ইমেইল ঠিকানা লিখুন"
          className="w-full h-13 text-lg bg-[#F7F7F7] mb-2 p-5 rounded-lg shadow-xl  focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />
        <input
          type="text"
          placeholder="হাসপাতালের বর্তমান ঠিকানা বা অবস্থান লিখুন"
          className="w-full h-13 text-lg bg-[#F7F7F7] mb-2 p-5 rounded-lg shadow-xl  focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />
        <input
          type="text"
          placeholder="ধরণ (Private / Govt / Clinic) লিখুন"
          className="w-full h-13 text-lg bg-[#F7F7F7] mb-2 p-5 rounded-lg shadow-xl  focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />
        <input
          type="text"
          placeholder="হাসপাতালের বেড সংখ্যা লিখুন"
          className="w-full h-13 text-lg bg-[#F7F7F7] mb-2 p-5 rounded-lg shadow-xl  focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />
        <input
          type="password"
          placeholder="আপনার পাসওয়ার্ড লিখুন"
          className="w-full h-13 text-lg bg-[#F7F7F7] mb-2 p-5 rounded-lg shadow-xl  focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />
        <input
          type="password"
          placeholder="আপনার পাসওয়ার্ড পুনরায় লিখুন"
          className="w-full h-13 text-lg bg-[#F7F7F7] mb-4 p-5 rounded-lg shadow-xl  focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />

        {/* Login button */}
        <button
          onClick={() => navigate("/login")}
          className="w-full h-17 text-xl bg-[#155C7F] text-white py-3 rounded-lg font-semibold hover:bg-[#00214D] transition mb-4"
        >
          নতুন অ্যাকাউন্ট তৈরি করুন
        </button>
      </div>
    </div>
  );
}

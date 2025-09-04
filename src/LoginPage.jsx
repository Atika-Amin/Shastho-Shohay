import React from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  return (
    <div
      className="h-screen w-screen flex justify-center items-center bg-cover bg-center relative "
      style={{
        backgroundImage: "url('/image/background.webp')",
      }} // replace with your background
    >
      {/* Blur layer */}
      <div className="absolute inset-0 backdrop-blur-xs"></div>

      <div className="bg-[#CAD3D2]/85 rounded-2xl shadow-[0_5px_10px_rgba(0,0,0,0.6)] p-9 h-145 w-140 text-center relative">
        {/* Title */}
        <h1 className="text-5xl font-bold text-[#155C7F] mb-1">
          আপনাকে স্বাগতম
        </h1>
        <p className="text-lg text-[#3B5C6F] mb-7">
          আপনার স্বাস্থ্যের ডিজিটাল সহায়
        </p>

        {/* Input fields */}
        <input
          type="text"
          placeholder="ব্যবহারকারীর নাম অথবা ইমেইল"
          className="w-full h-15 text-lg bg-[#F7F7F7] mb-3 p-5 rounded-lg shadow-xl  focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />
        <input
          type="password"
          placeholder="আপনার পাসওয়ার্ড দিন"
          className="w-full h-15 text-lg bg-[#F7F7F7] mb-4 p-5 rounded-lg shadow-xl  focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />

        {/* Remember me */}
        <label className="flex items-center text-md text-[#155C7F] mb-4">
          <input type="checkbox" className="mr-2 accent-[#155C7F]" />
          আমাকে মনে রাখুন
        </label>

        {/* Login button */}
        <button className="w-full h-17 text-xl bg-[#155C7F] text-white py-3 rounded-lg font-semibold hover:bg-[#00214D] transition mb-4">
          আপনার একাউন্টে প্রবেশ করুন
        </button>

        {/* Forgot / Register */}
        <p className="text-md text-[#155C7F] mb-4">
          পাসওয়ার্ড ভুলে গেছেন? বা নতুন ব্যবহারকারী?{" "}
          <span
            className="underline font-bold cursor-pointer hover:text-[#00214D]"
            onClick={() => navigate("/register")}
          >
            রেজিস্ট্রেশন করুন
          </span>
        </p>

        <p className="text-lg font-bold text-[#155C7F] mb-2">অথবা</p>
        {/* Social login */}
        <div className="flex gap-3">
          {/* Google login */}
          <button className="flex-1 h-13 bg-[#155C7F] text-white py-2 rounded-lg hover:bg-[#00214D] transition flex items-center justify-center gap-2">
            <img src="/image/google.png" alt="Google" className="w-6 h-6" />
            Google দিয়ে প্রবেশ
          </button>

          {/* Facebook login */}
          <button className="flex-1 h-13 bg-[#155C7F] text-white py-2 rounded-lg hover:bg-[#00214D] transition flex items-center justify-center gap-2">
            <img src="/image/facebook.png" alt="Facebook" className="w-7 h-7" />
            Facebook দিয়ে প্রবেশ
          </button>
        </div>
      </div>
    </div>
  );
}

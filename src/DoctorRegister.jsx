// src/DoctorRegister.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || ""; // e.g. "http://localhost:4000"

export default function DoctorRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    degree: "",
    specialization: "",
    registration_no: "",
    password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // ensure fresh session for a new registration
  useEffect(() => {
    try {
      localStorage.removeItem("auth");
      localStorage.removeItem("token");
      sessionStorage.removeItem("auth");
      sessionStorage.removeItem("token");
    } catch {}
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const pickErrorMessage = (data) => {
    if (data?.error?.formErrors?.formIssue?.length) {
      return data.error.formErrors.formIssue[0];
    }
    if (data?.error?.fieldErrors) {
      const first = Object.values(data.error.fieldErrors)[0];
      if (Array.isArray(first) && first.length) return first[0];
    }
    return data?.error || "Registration failed";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!form.registration_no.trim()) return setErr("নিবন্ধন নম্বর (BMDC) দিন");
    if (form.password.length < 6)
      return setErr("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
    if (form.password !== form.confirm_password)
      return setErr("পাসওয়ার্ড মিলছে না");

    setLoading(true);
    try {
      // send ONLY expected fields to match your server validator
      const payload = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        degree: form.degree,
        specialization: form.specialization,
        registration_no: form.registration_no,
        password: form.password,
      };

      const res = await fetch(`${API}/api/doctor/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const txt = await res.text();
      let data;
      try {
        data = JSON.parse(txt);
      } catch {
        data = { error: txt || "Server error" };
      }

      if (!res.ok) throw new Error(pickErrorMessage(data));

      // success → go to login (or doctor dashboard if you want)
      navigate("/login", { replace: true });
    } catch (e) {
      setErr(e.message || "কিছু ভুল হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen w-screen flex justify-center items-center bg-cover bg-center relative "
      style={{ backgroundImage: "url('/image/doctorRG.jpg')" }}
    >
      <div className="absolute inset-0 backdrop-blur-xs"></div>

      <form
        onSubmit={onSubmit}
        className="bg-[#CAD3D2]/85 rounded-2xl shadow-[0_5px_10px_rgba(0,0,0,0.6)] p-9 h-170 w-140 text-center relative"
      >
        <h1 className="text-3xl font-bold text-[#155C7F] mb-4">
          আপনার চিকিৎসক প্রোফাইল তৈরি করুন
        </h1>

        <input
          name="name"
          type="text"
          placeholder="আপনার পূর্ণ নাম লিখুন"
          value={form.name}
          onChange={onChange}
          required
          maxLength={100}
          className="w-full h-12 text-lg bg-[#F7F7F7] mb-2 p-5 rounded-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />
        <input
          name="phone"
          type="tel"
          placeholder="আপনার ফোন নম্বর লিখুন"
          value={form.phone}
          onChange={onChange}
          required
          maxLength={20}
          pattern="[0-9+\-()\s]{6,}"
          className="w-full h-12 text-lg bg-[#F7F7F7] mb-2 p-5 rounded-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />
        <input
          name="email"
          type="email"
          placeholder="আপনার ইমেইল ঠিকানা লিখুন"
          value={form.email}
          onChange={onChange}
          required
          maxLength={190}
          className="w-full h-12 text-lg bg-[#F7F7F7] mb-2 p-5 rounded-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />
        <input
          name="address"
          type="text"
          placeholder="আপনার বর্তমান ঠিকানা বা অবস্থান লিখুন"
          value={form.address}
          onChange={onChange}
          required
          maxLength={255}
          className="w-full h-12 text-lg bg-[#F7F7F7] mb-2 p-5 rounded-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />
        <input
          name="degree"
          type="text"
          placeholder="আপনার ডিগ্রি (MBBS, FCPS ইত্যাদি)"
          value={form.degree}
          onChange={onChange}
          required
          maxLength={120}
          className="w-full h-12 text-lg bg-[#F7F7F7] mb-2 p-5 rounded-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />
        <input
          name="specialization"
          type="text"
          placeholder="আপনার বিশেষত্ব"
          value={form.specialization}
          onChange={onChange}
          required
          maxLength={120}
          className="w-full h-12 text-lg bg-[#F7F7F7] mb-2 p-5 rounded-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />
        <input
          name="registration_no"
          type="text"
          placeholder="নিবন্ধন নম্বর (BMDC)"
          value={form.registration_no}
          onChange={onChange}
          required
          maxLength={120}
          className="w-full h-12 text-lg bg-[#F7F7F7] mb-2 p-5 rounded-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />
        <input
          name="password"
          type="password"
          placeholder="আপনার পাসওয়ার্ড"
          value={form.password}
          onChange={onChange}
          required
          minLength={6}
          className="w-full h-12 text-lg bg-[#F7F7F7] mb-2 p-5 rounded-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />
        <input
          name="confirm_password"
          type="password"
          placeholder="পাসওয়ার্ড পুনরায় লিখুন"
          value={form.confirm_password}
          onChange={onChange}
          required
          minLength={6}
          className="w-full h-12 text-lg bg-[#F7F7F7] mb-4 p-5 rounded-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 text-xl bg-[#155C7F] text-white py-3 rounded-lg font-semibold hover:bg-[#00214D] transition mb-2 disabled:opacity-60"
        >
          {loading ? "তৈরি হচ্ছে..." : "নতুন অ্যাকাউন্ট তৈরি করুন"}
        </button>

        {err && <p className="text-red-700 text-sm">{err}</p>}
      </form>
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";



export default function HospitalRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    hospital_type: "",
    bed_number: "",
    password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const pickErrorMessage = (data) => {
    if (data?.error?.formErrors?.formIssue?.length)
      return data.error.formErrors.formIssue[0];
    if (data?.error?.fieldErrors) {
      const first = Object.values(data.error.fieldErrors)[0];
      if (Array.isArray(first) && first.length) return first[0];
    }
    return data?.error || "Registration failed";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    // quick validations
    if (!form.hospital_type) return setErr("হাসপাতালের ধরণ নির্বাচন করুন");
    if (
      form.bed_number === "" ||
      isNaN(Number(form.bed_number)) ||
      Number(form.bed_number) < 0
    )
      return setErr("বেড সংখ্যা সঠিকভাবে দিন (০ বা তার বেশি)");
    if (form.password.length < 6)
      return setErr("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
    if (form.password !== form.confirm_password)
      return setErr("পাসওয়ার্ড মিলছে না");

    setLoading(true);
    try {
      const payload = { ...form, bed_number: Number(form.bed_number) };
      const res = await fetch(`/api/hospital/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(pickErrorMessage(data));

      // success → go to login (or your hospital dashboard)
      navigate("/login");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen w-screen flex justify-center items-center bg-cover bg-center relative "
      style={{ backgroundImage: "url('/image/hospitalRG.webp')" }}
    >
      {/* Blur layer */}
      <div className="absolute inset-0 backdrop-blur-xs"></div>

      <form
        onSubmit={onSubmit}
        className="bg-[#CAD3D2]/85 rounded-2xl shadow-[0_5px_10px_rgba(0,0,0,0.6)] p-9 h-170 w-140 text-center relative"
      >
        {/* Title */}
        <h1 className="text-3xl font-bold text-[#155C7F] mb-5">
          হাসপাতালের তথ্য দিয়ে একাউন্ট খুলুন
        </h1>

        <input
          name="name"
          type="text"
          placeholder="হাসপাতালের নাম লিখুন"
          value={form.name}
          onChange={onChange}
          required
          maxLength={150}
          className="w-full h-13 text-lg bg-[#F7F7F7] mb-2 p-5 rounded-lg shadow-xl  focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />
        <input
          name="phone"
          type="tel"
          placeholder="ফোন নম্বর লিখুন"
          value={form.phone}
          onChange={onChange}
          required
          maxLength={20}
          pattern="[0-9+\-()\s]{6,}"
          className="w-full h-13 text-lg bg-[#F7F7F7] mb-2 p-5 rounded-lg shadow-xl  focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />
        <input
          name="email"
          type="email"
          placeholder="হাসপাতালের ইমেইল ঠিকানা লিখুন"
          value={form.email}
          onChange={onChange}
          required
          maxLength={190}
          className="w-full h-13 text-lg bg-[#F7F7F7] mb-2 p-5 rounded-lg shadow-xl  focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />
        <input
          name="address"
          type="text"
          placeholder="হাসপাতালের বর্তমান ঠিকানা বা অবস্থান লিখুন"
          value={form.address}
          onChange={onChange}
          required
          maxLength={255}
          className="w-full h-13 text-lg bg-[#F7F7F7] mb-2 p-5 rounded-lg shadow-xl  focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />

        {/* Type */}
        <select
          name="hospital_type"
          value={form.hospital_type}
          onChange={onChange}
          required
          className="w-full h-13 text-lg bg-[#F7F7F7] mb-2 px-5 rounded-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        >
          <option value="">ধরণ নির্বাচন করুন</option>
          <option value="Private">Private</option>
          <option value="Govt">Govt</option>
          <option value="Clinic">Clinic</option>
        </select>

        {/* Beds */}
        <input
          name="bed_number"
          type="number"
          inputMode="numeric"
          min={0}
          step={1}
          placeholder="হাসপাতালের বেড সংখ্যা লিখুন"
          value={form.bed_number}
          onChange={onChange}
          required
          className="w-full h-13 text-lg bg-[#F7F7F7] mb-2 p-5 rounded-lg shadow-xl  focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />

        <input
          name="password"
          type="password"
          placeholder="আপনার পাসওয়ার্ড লিখুন"
          value={form.password}
          onChange={onChange}
          required
          minLength={6}
          className="w-full h-13 text-lg bg-[#F7F7F7] mb-2 p-5 rounded-lg shadow-xl  focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />
        <input
          name="confirm_password"
          type="password"
          placeholder="আপনার পাসওয়ার্ড পুনরায় লিখুন"
          value={form.confirm_password}
          onChange={onChange}
          required
          minLength={6}
          className="w-full h-13 text-lg bg-[#F7F7F7] mb-4 p-5 rounded-lg shadow-xl  focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full h-17 text-xl bg-[#155C7F] text-white py-3 rounded-lg font-semibold hover:bg-[#00214D] transition mb-2 disabled:opacity-60"
        >
          {loading ? "তৈরি হচ্ছে..." : "নতুন অ্যাকাউন্ট তৈরি করুন"}
        </button>

        {err && <p className="text-red-700 text-sm">{err}</p>}
      </form>
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    role: "patient", // patient | doctor | hospital | pharmacist
    identifier: "", // email or phone
    password: "",
    remember: true,
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const pickErrorMessage = (data) => {
    // Handle Zod flatten or plain string errors coming from backend
    if (data?.error?.formErrors?.formIssue?.length) {
      return data.error.formErrors.formIssue[0];
    }
    if (data?.error?.fieldErrors) {
      const first = Object.values(data.error.fieldErrors)[0];
      if (Array.isArray(first) && first.length) return first[0];
    }
    return data?.error || "লগইন ব্যর্থ হয়েছে";
  };

  const routeForRole = (role) => {
    const map = {
      patient: "/PatientDashboard",
      doctor: "/DoctorDashboard",
      hospital: "/HospitalDashboard",
      pharmacist: "/PharmacyDashboard",
    };
    return map[role] || "/";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!form.identifier.trim() || !form.password) {
      setErr("ইমেইল/ফোন এবং পাসওয়ার্ড দিন");
      return;
    }
    if (!form.role) {
      setErr("রোল নির্বাচন করুন");
      return;
    }


    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: form.role,
          identifier: form.identifier,
          password: form.password,
        }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { error: text || "Server error" };
      }

      if (!res.ok) throw new Error(pickErrorMessage(data));

      const storage = form.remember
        ? window.localStorage
        : window.sessionStorage;
      storage.setItem("auth", JSON.stringify(data)); // { token, user }

      navigate(routeForRole(form.role));
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen w-screen flex justify-center items-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/image/background.webp')" }}
    >
      {/* Blur layer */}
      <div className="absolute inset-0 backdrop-blur-xs"></div>

      <form
        onSubmit={onSubmit}
        className="bg-[#CAD3D2]/85 rounded-2xl shadow-[0_5px_10px_rgba(0,0,0,0.6)] p-9 h-160 w-140 text-center relative"
      >
        {/* Title */}
        <h1 className="text-5xl font-bold text-[#155C7F] mb-1">
          আপনাকে স্বাগতম
        </h1>
        <p className="text-lg text-[#3B5C6F] mb-7">
          আপনার স্বাস্থ্যের ডিজিটাল সহায়
        </p>

        {/* Identifier */}
        <input
          name="identifier"
          type="text"
          placeholder="ইমেইল বা ফোন নম্বর"
          value={form.identifier}
          onChange={onChange}
          className="w-full h-14 text-lg bg-[#F7F7F7] mb-3 p-5 rounded-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />
        {/* Role */}
        <select
          name="role"
          value={form.role}
          onChange={onChange}
          className="w-full h-14 text-lg bg-[#F7F7F7] mb-3 px-5 rounded-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        >
          <option value="" disabled>
            আপনার প্রয়োজন অনুযায়ী রোল নির্বাচন করুন
          </option>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="hospital">Hospital</option>
          <option value="pharmacist">Pharmacist</option>
        </select>

        {/* Password */}
        <input
          name="password"
          type="password"
          placeholder="আপনার পাসওয়ার্ড দিন"
          value={form.password}
          onChange={onChange}
          className="w-full h-14 text-lg bg-[#F7F7F7] mb-4 p-5 rounded-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />

        {/* Remember me */}
        <label className="flex items-center text-md text-[#155C7F] mb-4">
          <input
            name="remember"
            type="checkbox"
            checked={form.remember}
            onChange={onChange}
            className="mr-2 accent-[#155C7F]"
          />
          আমাকে মনে রাখুন
        </label>

        {/* Login button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-17 text-xl bg-[#155C7F] text-white py-3 rounded-lg font-semibold hover:bg-[#00214D] transition mb-4 disabled:opacity-60"
        >
          {loading ? "সাইন ইন হচ্ছে..." : "আপনার একাউন্টে প্রবেশ করুন"}
        </button>

        {/* Error */}
        {err && <p className="text-red-700 text-sm mb-3">{err}</p>}

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

        {/* Social login (placeholders) */}
        <div className="flex gap-3">
          <button
            type="button"
            disabled
            title="Coming soon"
            className="flex-1 h-13 bg-[#155C7F] text-white py-2 rounded-lg hover:bg-[#00214D] transition flex items-center justify-center gap-2 "
          >
            <img src="/image/google.png" alt="Google" className="w-6 h-6" />
            Google দিয়ে প্রবেশ
          </button>

          <button
            type="button"
            disabled
            title="Coming soon"
            className="flex-1 h-13 bg-[#155C7F] text-white py-2 rounded-lg hover:bg-[#00214D] transition flex items-center justify-center gap-2 "
          >
            <img src="/image/facebook.png" alt="Facebook" className="w-7 h-7" />
            Facebook দিয়ে প্রবেশ
          </button>
        </div>
      </form>
    </div>
  );
}

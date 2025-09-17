import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE || ""; // e.g. http://localhost:4000

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    role: "", // patient | doctor | hospital | pharmacist
    identifier: "", // email or phone
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

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

    if (!form.role) return setErr("রোল নির্বাচন করুন");
    if (!form.identifier.trim() || !form.password)
      return setErr("ইমেইল/ফোন এবং পাসওয়ার্ড দিন");

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
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

      // Always reset old sessions and store new auth in localStorage only
      localStorage.removeItem("auth");
      localStorage.removeItem("token");
      sessionStorage.removeItem("auth");
      sessionStorage.removeItem("token");

      localStorage.setItem(
        "auth",
        JSON.stringify({ token: data.token, user: data.user })
      );
      localStorage.setItem("token", data.token); // convenience for old reads

      navigate(routeForRole(form.role), { replace: true });
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
      <div className="absolute inset-0 backdrop-blur"></div>

      <form
        onSubmit={onSubmit}
        className="bg-[#CAD3D2]/85 rounded-2xl shadow-[0_5px_10px_rgba(0,0,0,0.6)] p-9 h-160 w-140 text-center relative"
      >
        <h1 className="text-5xl font-bold text-[#155C7F] mb-1">
          আপনাকে স্বাগতম
        </h1>
        <p className="text-lg text-[#3B5C6F] mb-7">
          আপনার স্বাস্থ্যের ডিজিটাল সহায়
        </p>

        <input
          name="identifier"
          type="text"
          placeholder="ইমেইল বা ফোন নম্বর"
          value={form.identifier}
          onChange={onChange}
          className="w-full h-14 text-lg bg-[#F7F7F7] mb-3 p-5 rounded-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />

        <select
          name="role"
          value={form.role}
          onChange={onChange}
          required
          className="w-full h-14 text-lg bg-[#F7F7F7] mb-3 px-5 rounded-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        >
          <option value="" disabled className="text-gray-500">
            আপনার প্রয়োজন অনুযায়ী রোল নির্বাচন করুন
          </option>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="hospital">Hospital</option>
          <option value="pharmacist">Pharmacist</option>
        </select>

        <input
          name="password"
          type="password"
          placeholder="আপনার পাসওয়ার্ড দিন"
          value={form.password}
          onChange={onChange}
          className="w-full h-14 text-lg bg-[#F7F7F7] mb-4 p-5 rounded-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-[#1D3E56]"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full h-17 text-xl bg-[#155C7F] text-white py-3 rounded-lg font-semibold hover:bg-[#00214D] transition mb-4 disabled:opacity-60"
        >
          {loading ? "সাইন ইন হচ্ছে..." : "আপনার একাউন্টে প্রবেশ করুন"}
        </button>

        {err && <p className="text-red-700 text-sm mb-3">{err}</p>}

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

        <div className="flex gap-3">
          <button
            type="button"
            disabled
            title="Coming soon"
            className="flex-1 h-13 bg-[#155C7F] text-white py-2 rounded-lg hover:bg-[#00214D] transition flex items-center justify-center gap-2"
          >
            <img src="/image/google.png" alt="Google" className="w-6 h-6" />
            Google দিয়ে প্রবেশ
          </button>

          <button
            type="button"
            disabled
            title="Coming soon"
            className="flex-1 h-13 bg-[#155C7F] text-white py-2 rounded-lg hover:bg-[#00214D] transition flex items-center justify-center gap-2"
          >
            <img src="/image/facebook.png" alt="Facebook" className="w-7 h-7" />
            Facebook দিয়ে প্রবেশ
          </button>
        </div>
      </form>
    </div>
  );
}

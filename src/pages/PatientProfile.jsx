// src/pages/PatientProfile.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function PatientProfile() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const fallback = state?.from || "/PatientDashboard";

  // token from session/local
  const rawAuth =
    localStorage.getItem("auth") || sessionStorage.getItem("auth");
  const parsedAuth = rawAuth ? JSON.parse(rawAuth) : null;
  const token = localStorage.getItem("token") || parsedAuth?.token || "";

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);
  const [bimaSaving, setBimaSaving] = useState(false);
  const [snapSaving, setSnapSaving] = useState(false);

  const [form, setForm] = useState({
    id: undefined,
    name: "",
    phone: "",
    email: "",
    address: "",
    blood_group: "",
    avatar_url: "",
  });

  // ---- HEALTH: state ----
  const [health, setHealth] = useState({
    age: "",
    height_cm: "",
    weight_kg: "",
    bp_sys: "",
    bp_dia: "",
  });

  // Insurance/Bima (persisted to server)
  const [bima, setBima] = useState({
    provider: "",
    policy_no: "",
    status: "Active", // Active | Expired | Pending
    valid_till: "", // yyyy-mm-dd
  });

  // Server health history rows
  const [history, setHistory] = useState([]);

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [pwd, setPwd] = useState({ current_password: "", new_password: "" });

  const avatarSrc =
    avatarPreview || form.avatar_url || "/image/avatar-patient.png";

  // ---- HEALTH: derived values ----
  const bmi = useMemo(() => {
    const h = parseFloat(health.height_cm || "");
    const w = parseFloat(health.weight_kg || "");
    if (!h || !w) return null;
    const meters = h / 100;
    const b = w / (meters * meters);
    return Math.round(b * 10) / 10;
  }, [health.height_cm, health.weight_kg]);

  const lastSnapshot = useMemo(() => {
    if (!history?.length) return null;
    const sorted = [...history].sort(
      (a, b) =>
        new Date(b.recorded_at || 0).getTime() -
        new Date(a.recorded_at || 0).getTime()
    );
    return sorted[0];
  }, [history]);

  /* ---------------- Reusable loader: HEALTH HISTORY --------------- */
  const loadHistory = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`/api/patient/health/history?limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.history)) {
        setHistory(data.history);
      } else {
        setMsg(data?.error || "ইতিহাস লোড ব্যর্থ");
      }
    } catch {
      setMsg("নেটওয়ার্ক/সার্ভার সমস্যা (ইতিহাস)");
    }
  }, [token]);

  /* ---------------- Load profile --------------- */
  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    (async () => {
      try {
        const res = await fetch(`/api/patient/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          setMsg("সেশন মেয়াদোত্তীর্ণ। দয়া করে আবার লগইন করুন।");
          navigate("/login", { replace: true });
          return;
        }
        const data = await res.json();
        if (!res.ok) {
          setMsg(data?.error || "প্রোফাইল লোড ব্যর্থ");
        } else {
          setForm((f) => ({ ...f, ...data.profile }));
        }
      } catch {
        setMsg("নেটওয়ার্ক সমস্যা");
      } finally {
        setLoading(false);
      }
    })();
  }, [token, navigate]);

  /* -------- After token ready: load Bima + Health history -------- */
  useEffect(() => {
    if (!token) return;

    const loadBima = async () => {
      try {
        const res = await fetch(`/api/patient/bima`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data?.bima) {
          setBima({
            provider: data.bima.provider || "",
            policy_no: data.bima.policy_no || "",
            status: data.bima.status || "Active",
            valid_till: data.bima.valid_till || "",
          });
        }
      } catch {
        setMsg("নেটওয়ার্ক/সার্ভার সমস্যা (বিমা)");
      }
    };

    loadBima();
    loadHistory(); // <- top-level function
  }, [token, loadHistory]);

  /* ----------------- Handlers ----------------- */
  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onChangeHealth = (e) =>
    setHealth((h) => ({ ...h, [e.target.name]: e.target.value }));

  const onChangeBima = (e) =>
    setBima((b) => ({ ...b, [e.target.name]: e.target.value }));

  const saveProfile = async () => {
    try {
      setSaving(true);
      setMsg("");
      const res = await fetch(`/api/patient/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          address: form.address,
          blood_group: form.blood_group,
        }),
      });
      const data = await res.json();
      if (!res.ok) return setMsg(data?.error || "আপডেট ব্যর্থ");
      setForm((f) => ({ ...f, ...data.profile }));
      setMsg("প্রোফাইল আপডেট হয়েছে ✅");
    } catch {
      setMsg("নেটওয়ার্ক সমস্যা");
    } finally {
      setSaving(false);
    }
  };

  const onPickAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return setMsg("প্রথমে ছবি নির্বাচন করুন");
    try {
      setAvatarSaving(true);
      setMsg("");
      const fd = new FormData();
      fd.append("avatar", avatarFile);
      const res = await fetch(`/api/patient/me/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) return setMsg(data?.error || "ছবি আপলোড ব্যর্থ");
      setForm((f) => ({ ...f, avatar_url: data.avatar_url }));
      setAvatarFile(null);
      setAvatarPreview("");
      setMsg("প্রোফাইল ছবি আপডেট ✅");
    } catch {
      setMsg("নেটওয়ার্ক সমস্যা");
    } finally {
      setAvatarSaving(false);
    }
  };

  const changePassword = async () => {
    if (!pwd.current_password || !pwd.new_password)
      return setMsg("পাসওয়ার্ড দিন");
    try {
      setPwdSaving(true);
      setMsg("");
      const res = await fetch(`/api/patient/me/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pwd),
      });
      const data = await res.json();
      if (!res.ok) return setMsg(data?.error || "পাসওয়ার্ড পরিবর্তন ব্যর্থ");
      setPwd({ current_password: "", new_password: "" });
      setMsg("পাসওয়ার্ড পরিবর্তন হয়েছে ✅");
    } catch {
      setMsg("নেটওয়ার্ক সমস্যা");
    } finally {
      setPwdSaving(false);
    }
  };

  /* ----------------- Bima (Server) ----------------- */
  const saveBima = async () => {
    try {
      setBimaSaving(true);
      setMsg("");
      const res = await fetch(`/api/patient/bima`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bima),
      });
      const data = await res.json();
      if (!res.ok) return setMsg(data?.error || "বিমা তথ্য সংরক্ষণ ব্যর্থ");
      setBima({
        provider: data.bima.provider || "",
        policy_no: data.bima.policy_no || "",
        status: data.bima.status || "Active",
        valid_till: data.bima.valid_till || "",
      });
      setMsg("বিমা তথ্য সংরক্ষিত ✅");
    } catch {
      setMsg("বিমা তথ্য সংরক্ষণ ব্যর্থ");
    } finally {
      setBimaSaving(false);
    }
  };

  /* ------------- Health history (Server) ------------- */
  const addSnapshot = async () => {
    try {
      setSnapSaving(true);
      setMsg("");

      const toNum = (v, { int = false } = {}) => {
        if (v === "" || v === null || v === undefined) return undefined;
        const n = int ? parseInt(v, 10) : Number(v);
        return Number.isFinite(n) ? n : undefined;
      };

      const payload = {
        age: toNum(health.age, { int: true }),
        height_cm: toNum(health.height_cm),
        weight_kg: toNum(health.weight_kg),
        bp_sys: toNum(health.bp_sys, { int: true }),
        bp_dia: toNum(health.bp_dia, { int: true }),
      };

      const res = await fetch(`/api/patient/health/snapshot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { error: text };
      }

      if (!res.ok) {
        const zod = data?.error?.formErrors?.fieldErrors || data?.error;
        setMsg(
          zod
            ? typeof zod === "string"
              ? zod
              : JSON.stringify(zod)
            : `স্ন্যাপশট সংরক্ষণ ব্যর্থ (HTTP ${res.status})`
        );
        return;
      }

      if (!data?.snapshot) {
        setMsg("স্ন্যাপশট সংরক্ষণ ব্যর্থ (invalid response)");
        return;
      }

      // optimistic add
      setHistory((h) => [data.snapshot, ...h].slice(0, 50));

      // refresh from DB
      await loadHistory();

      setMsg("নতুন হেল্থ স্ন্যাপশট সংরক্ষিত ✅");
    } catch {
      setMsg("নেটওয়ার্ক/সার্ভার সমস্যা");
    } finally {
      setSnapSaving(false);
    }
  };

  const deleteSnapshot = async (id) => {
    try {
      const res = await fetch(`/api/patient/health/snapshot/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { error: text };
      }

      if (!res.ok) {
        setMsg(data?.error || `ডিলিট ব্যর্থ (HTTP ${res.status})`);
        return;
      }

      setHistory((h) => h.filter((x) => x.id !== id));
      setMsg("স্ন্যাপশট মুছে ফেলা হয়েছে");
    } catch {
      setMsg("নেটওয়ার্ক/সার্ভার সমস্যা");
    }
  };

  const loadSnapshotIntoForm = (snap) => {
    setHealth((h) => ({
      ...h,
      age: snap.age ?? h.age,
      height_cm: snap.height_cm ?? h.height_cm,
      weight_kg: snap.weight_kg ?? h.weight_kg,
      bp_sys: snap.bp_sys ?? h.bp_sys,
      bp_dia: snap.bp_dia ?? h.bp_dia,
    }));
  };

  const goBack = () => {
    const canGoBack =
      (window.history.state && window.history.state.idx > 0) ||
      window.history.length > 1;
    if (canGoBack) navigate(-1);
    else navigate(fallback, { replace: true });
  };

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-white">
        লোড হচ্ছে…
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#1878A9] via-[#306C8E] via-[#005076] to-[#6B92A4]">
      <header className="sticky top-0 z-30 bg-[#0B3D56]/90 backdrop-blur text-white">
        <div className="mx-auto max-w-8xl px-24 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/image/logo1.png"
              alt="স্বাস্থ্যসহায়"
              className="h-10 w-9"
            />
            <span className="font-bold text-2xl">প্রোফাইল</span>
          </div>
          <button
            onClick={goBack}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20"
          >
            ← ফিরে যান
          </button>
        </div>
      </header>

      {/* Global message banner (fixed overlay with close) */}
      {msg && (
        <div className="fixed top-4 inset-x-0 z-[1000] flex justify-center px-4 pointer-events-none">
          <div className="pointer-events-auto w-full max-w-2xl rounded-xl bg-[#F2F6F8] text-[#0E5F85] shadow-lg ring-1 ring-black/5 p-3 pl-4 pr-2 flex items-start gap-3">
            <div className="flex-1 text-sm sm:text-base">{msg}</div>
            <button
              onClick={() => setMsg("")}
              aria-label="Dismiss message"
              className="shrink-0 rounded-md p-2 hover:bg-[#E5EDF2] text-[#0E5F85] focus:outline-none focus:ring-2 focus:ring-[#0E5F85]/40"
              title="Close"
            >
              {/* Cross icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="w-full py-6">
        <div className="mx-auto max-w-8xl px-24 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar + Account Summary */}
          <div className="bg-white rounded-3xl p-6 shadow ring-1 ring-black/5">
            <h3 className="text-lg font-bold text-[#0E5F85] mb-4">
              প্রোফাইল ছবি ও অ্যাকাউন্ট সারাংশ
            </h3>

            <div className="flex flex-col items-center gap-4">
              <div className="w-48 h-48 rounded-full ring-2 ring-[#0E5F85] overflow-hidden bg-[#F2F6F8]">
                <img
                  src={avatarSrc}
                  className="w-full h-full object-cover"
                  alt="avatar"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="grid grid-cols-1 gap-2 w-full mt-2">
                <div className="text-center">
                  <div className="text-xl font-semibold text-[#0E5F85]">
                    {form.name || "নাম সেট করা নেই"}
                  </div>
                  <div className="text-sm text-[#2C4D5F]">Patient</div>
                </div>

                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="p-3 rounded-xl bg-[#F2F6F8]">
                    <div className="text-[#5B6E7A]">ইমেইল</div>
                    <div className="font-medium break-all">
                      {form.email || "—"}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F2F6F8]">
                    <div className="text-[#5B6E7A]">ফোন</div>
                    <div className="font-medium">{form.phone || "—"}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F2F6F8]">
                    <div className="text-[#5B6E7A]">রক্তের গ্রুপ</div>
                    <div className="font-medium">{form.blood_group || "—"}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F2F6F8]">
                    <div className="text-[#5B6E7A]">বিমা স্ট্যাটাস</div>
                    <div
                      className={`font-medium ${
                        bima.status === "Expired"
                          ? "text-red-600"
                          : bima.status === "Pending"
                          ? "text-yellow-700"
                          : "text-green-700"
                      }`}
                    >
                      {bima.status || "—"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B3D56] text-white hover:bg-[#082e41] cursor-pointer">
                  ছবি নির্বাচন
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onPickAvatar}
                  />
                </label>
                <button
                  disabled={avatarSaving || !avatarFile}
                  onClick={uploadAvatar}
                  className="px-4 py-2 rounded-xl bg-[#1E7AF2] text-white hover:bg-[#1667cf] disabled:opacity-60"
                >
                  {avatarSaving ? "আপলোড হচ্ছে..." : "ছবি আপলোড"}
                </button>
              </div>
            </div>
          </div>

          {/* Details + Password */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow ring-1 ring-black/5">
            <h3 className="text-lg font-bold text-[#0E5F85] mb-4">
              ব্যক্তিগত তথ্য
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-[#2C4D5F]">পূর্ণ নাম</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  className="mt-1 w-full rounded-xl border border-[#C9D7E0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0E5F85]"
                />
              </div>
              <div>
                <label className="text-sm text-[#2C4D5F]">ফোন</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  className="mt-1 w-full rounded-xl border border-[#C9D7E0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0E5F85]"
                />
              </div>
              <div>
                <label className="text-sm text-[#2C4D5F]">ইমেইল</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  className="mt-1 w-full rounded-xl border border-[#C9D7E0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0E5F85]"
                />
              </div>
              <div>
                <label className="text-sm text-[#2C4D5F]">রক্তের গ্রুপ</label>
                <select
                  name="blood_group"
                  value={form.blood_group}
                  onChange={onChange}
                  className="mt-1 w-full rounded-xl border border-[#C9D7E0] px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#0E5F85]"
                >
                  <option value="" disabled>
                    রক্তের গ্রুপ নির্বাচন করুন
                  </option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-[#2C4D5F]">ঠিকানা</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={onChange}
                  className="mt-1 w-full rounded-xl border border-[#C9D7E0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0E5F85]"
                />
              </div>
            </div>

            <div className="mt-5">
              <button
                disabled={saving}
                onClick={saveProfile}
                className="px-5 py-3 rounded-2xl bg-[#0E5F85] text-white hover:bg-[#0c4f70] disabled:opacity-60"
              >
                {saving ? "সেভ হচ্ছে..." : "পরিবর্তন সংরক্ষণ"}
              </button>
            </div>

            <hr className="my-6 border-[#E5EDF2]" />

            <h3 className="text-lg font-bold text-[#0E5F85] mb-3">
              পাসওয়ার্ড পরিবর্তন
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-[#2C4D5F]">
                  বর্তমান পাসওয়ার্ড
                </label>
                <input
                  type="password"
                  value={pwd.current_password}
                  onChange={(e) =>
                    setPwd((p) => ({ ...p, current_password: e.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-[#C9D7E0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0E5F85]"
                />
              </div>
              <div>
                <label className="text-sm text-[#2C4D5F]">
                  নতুন পাসওয়ার্ড
                </label>
                <input
                  type="password"
                  value={pwd.new_password}
                  onChange={(e) =>
                    setPwd((p) => ({ ...p, new_password: e.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-[#C9D7E0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0E5F85]"
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                disabled={pwdSaving}
                onClick={changePassword}
                className="px-5 py-3 rounded-2xl bg-[#E0312D] text-white hover:bg-[#c02825] disabled:opacity-60"
              >
                {pwdSaving ? "আপডেট হচ্ছে..." : "পাসওয়ার্ড পরিবর্তন"}
              </button>
            </div>
          </div>

          {/* Health Summary */}
          <div className="lg:col-span-2 order-2 lg:order-1 bg-white rounded-3xl p-6 shadow ring-1 ring-black/5">
            <h3 className="text-lg font-bold text-[#0E5F85]">
              স্বাস্থ্য সারাংশ (BMI, BP, Age, Weight, Height)
            </h3>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="text-sm text-[#2C4D5F]">বয়স</label>
                <input
                  name="age"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step="1"
                  value={health.age}
                  onChange={onChangeHealth}
                  className="mt-1 w-full rounded-xl border border-[#C9D7E0] px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-[#2C4D5F]">উচ্চতা (cm)</label>
                <input
                  name="height_cm"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  min={0}
                  value={health.height_cm}
                  onChange={onChangeHealth}
                  className="mt-1 w-full rounded-xl border border-[#C9D7E0] px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-[#2C4D5F]">ওজন (kg)</label>
                <input
                  name="weight_kg"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  min={0}
                  value={health.weight_kg}
                  onChange={onChangeHealth}
                  className="mt-1 w-full rounded-xl border border-[#C9D7E0] px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-[#2C4D5F]">BP (Sys)</label>
                <input
                  name="bp_sys"
                  type="number"
                  inputMode="numeric"
                  step="1"
                  min={0}
                  value={health.bp_sys}
                  onChange={onChangeHealth}
                  className="mt-1 w-full rounded-xl border border-[#C9D7E0] px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-[#2C4D5F]">BP (Dia)</label>
                <input
                  name="bp_dia"
                  type="number"
                  inputMode="numeric"
                  step="1"
                  min={0}
                  value={health.bp_dia}
                  onChange={onChangeHealth}
                  className="mt-1 w-full rounded-xl border border-[#C9D7E0] px-3 py-2"
                />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#F2F6F8] text-[#2C4D5F]">
                <div className="text-sm">BMI</div>
                <div className="text-xl font-bold">{bmi ?? "—"}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#F2F6F8] text-[#2C4D5F]">
                <div className="text-sm">BP</div>
                <div className="text-xl font-bold">
                  {health.bp_sys && health.bp_dia
                    ? `${health.bp_sys}/${health.bp_dia}`
                    : "—"}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#F2F6F8] text-[#2C4D5F]">
                <div className="text-sm">Age • Wt • Ht</div>
                <div className="text-xl font-bold">
                  {health.age || "—"} • {health.weight_kg || "—"}kg •{" "}
                  {health.height_cm || "—"}cm
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                disabled={snapSaving}
                onClick={addSnapshot}
                className="px-5 py-2 rounded-xl bg-[#0E5F85] text-white hover:bg-[#0c4f70] disabled:opacity-60"
              >
                {snapSaving ? "সেভ হচ্ছে..." : "স্ন্যাপশট সংরক্ষণ"}
              </button>
              <button
                onClick={() => {
                  setHealth({
                    age: "",
                    height_cm: "",
                    weight_kg: "",
                    bp_sys: "",
                    bp_dia: "",
                  });
                }}
                className="px-5 py-2 rounded-xl bg-[#EBEFF2] text-[#0E5F85] hover:bg-[#E1E7EC]"
              >
                ইনপুট ক্লিয়ার
              </button>
            </div>

            {/* Last recorded */}
            <div className="mt-5">
              <div className="text-sm text-[#2C4D5F]">
                <span className="font-semibold">সর্বশেষ রেকর্ড:</span>{" "}
                {lastSnapshot?.recorded_at
                  ? new Date(lastSnapshot.recorded_at).toLocaleString()
                  : "কিছু সংরক্ষিত নেই"}
              </div>
              {lastSnapshot && (
                <div className="mt-2 grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                  <div className="p-2 rounded-xl bg-[#F2F6F8]">
                    BMI: <b>{lastSnapshot.bmi ?? "—"}</b>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F2F6F8]">
                    BP:{" "}
                    <b>
                      {lastSnapshot.bp_sys}/{lastSnapshot.bp_dia}
                    </b>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F2F6F8]">
                    Age: <b>{lastSnapshot.age ?? "—"}</b>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F2F6F8]">
                    Wt: <b>{lastSnapshot.weight_kg ?? "—"} kg</b>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F2F6F8]">
                    Ht: <b>{lastSnapshot.height_cm ?? "—"} cm</b>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bima / Insurance */}
          <div className="order-1 lg:order-2 bg-white rounded-3xl p-6 shadow ring-1 ring-black/5">
            <h3 className="text-lg font-bold text-[#0E5F85]">বিমা তথ্য</h3>
            <div className="mt-4 grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm text-[#2C4D5F]">
                  বিমা প্রদানকারী
                </label>
                <input
                  name="provider"
                  value={bima.provider}
                  onChange={onChangeBima}
                  className="mt-1 w-full rounded-xl border border-[#C9D7E0] px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-[#2C4D5F]">পলিসি নম্বর</label>
                <input
                  name="policy_no"
                  value={bima.policy_no}
                  onChange={onChangeBima}
                  className="mt-1 w-full rounded-xl border border-[#C9D7E0] px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-[#2C4D5F]">স্ট্যাটাস</label>
                <select
                  name="status"
                  value={bima.status}
                  onChange={onChangeBima}
                  className="mt-1 w-full rounded-xl border border-[#C9D7E0] px-3 py-2 bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-[#2C4D5F]">
                  বৈধতা (তারিখ পর্যন্ত)
                </label>
                <input
                  type="date"
                  name="valid_till"
                  value={bima.valid_till}
                  onChange={onChangeBima}
                  className="mt-1 w-full rounded-xl border border-[#C9D7E0] px-3 py-2"
                />
              </div>
            </div>

            <div className="mt-4">
              <button
                disabled={bimaSaving}
                onClick={saveBima}
                className="px-5 py-2 rounded-xl bg-[#0E5F85] text-white hover:bg-[#0c4f70] disabled:opacity-60"
              >
                {bimaSaving ? "সেভ হচ্ছে..." : "বিমা তথ্য সংরক্ষণ"}
              </button>
            </div>
          </div>

          {/* History Table */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-6 shadow ring-1 ring-black/5">
            <h3 className="text-lg font-bold text-[#0E5F85] mb-3">
              স্বাস্থ্য ইতিহাস (BMI, BP, Age, Weight, Height)
            </h3>

            {history?.length ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="text-left text-[#5B6E7A]">
                    <tr>
                      <th className="py-2 pr-3">সময়</th>
                      <th className="py-2 pr-3">BMI</th>
                      <th className="py-2 pr-3">BP</th>
                      <th className="py-2 pr-3">Age</th>
                      <th className="py-2 pr-3">Wt (kg)</th>
                      <th className="py-2 pr-3">Ht (cm)</th>
                      <th className="py-2 pr-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...history]
                      .sort(
                        (a, b) =>
                          new Date(b.recorded_at) - new Date(a.recorded_at)
                      )
                      .slice(0, 20)
                      .map((h) => (
                        <tr key={h.id} className="border-t border-[#EEF2F5]">
                          <td className="py-2 pr-3">
                            {new Date(h.recorded_at).toLocaleString()}
                          </td>
                          <td className="py-2 pr-3">{h.bmi ?? "—"}</td>
                          <td className="py-2 pr-3">
                            {h.bp_sys && h.bp_dia
                              ? `${h.bp_sys}/${h.bp_dia}`
                              : "—"}
                          </td>
                          <td className="py-2 pr-3">{h.age ?? "—"}</td>
                          <td className="py-2 pr-3">{h.weight_kg ?? "—"}</td>
                          <td className="py-2 pr-3">{h.height_cm ?? "—"}</td>
                          <td className="py-2 pr-3 whitespace-nowrap">
                            <button
                              onClick={() => loadSnapshotIntoForm(h)}
                              className="px-2 py-1 rounded-lg bg-[#0E5F85] text-white hover:bg-[#0c4f70] mr-2"
                              title="Load into form to edit"
                            >
                              লোড
                            </button>
                            <button
                              onClick={() => deleteSnapshot(h.id)}
                              className="px-2 py-1 rounded-lg bg-[#E0312D] text-white hover:bg-[#c02825]"
                            >
                              ডিলিট
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-sm text-[#2C4D5F]">
                এখনো কোনো স্ন্যাপশট সংরক্ষণ করা হয়নি।
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="bg-[#0B3D56] text-white text-center text-sm py-4 px-4">
        © ২০২৫ স্বাস্থ্যসহায় — সব তথ্য কেবল সহায়ক।
      </footer>
    </div>
  );
}

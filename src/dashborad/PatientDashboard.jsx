// src/dashborad/PatientDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);

  // NEW: avatar + name
  const [avatarUrl, setAvatarUrl] = useState("");
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    // read from either localStorage or sessionStorage (depending on "remember me")
    const rawAuth =
      localStorage.getItem("auth") || sessionStorage.getItem("auth");
    const parsed = rawAuth ? JSON.parse(rawAuth) : null;
    const token = localStorage.getItem("token") || parsed?.token || "";

    // set a fallback name from auth payload if present
    if (parsed?.user?.name) setDisplayName(parsed.user.name);

    if (!token) return; // not logged in – keep defaults

    (async () => {
      try {
        const res = await fetch("/api/patient/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return; // ignore errors, keep defaults
        const data = await res.json();
        setAvatarUrl(data?.profile?.avatar_url || "");
        if (data?.profile?.name) setDisplayName(data.profile.name);
      } catch {
        // ignore network errors – keep defaults
      }
    })();
  }, []);

  const avatarSrc = avatarUrl || "/image/avatar-patient.png";

  // NEW: logout handler
  const handleLogout = () => {
    try {
      localStorage.removeItem("auth");
      localStorage.removeItem("token");
      sessionStorage.removeItem("auth");
      sessionStorage.removeItem("token");
    } catch {}
    navigate("/", { replace: true }); // go to Landing Page
  };

  return (
    <div className="font-sans text-gray-800 bg-gradient-to-r from-[#1878A9] via-[#306C8E] via-[#005076] to-[#6B92A4]">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#1878A9] via-[#306C8E] via-[#005076] to-[#6B92A4] text-white">
        <div className="mx-auto max-w-8xl px-24 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src="/image/logo1.png"
              alt="স্বাস্থ্যসহায়"
              className="h-10 w-9"
            />
            <span className="font-bold text-3xl">স্বাস্থ্যসহায়</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="relative p-2 rounded-full hover:bg-white/10"
              aria-label="Notifications"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 006 14h12a1 1 0 00.707-1.707L18 11.586V8a6 6 0 00-6-6z" />
                <path d="M8 15a4 4 0 008 0H8z" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 px-1.5 py-0.5 text-[10px] font-medium bg-red-600 text-white rounded-full">
                3
              </span>
            </button>

            {/* Logout (icon button) */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-white/10"
              aria-label="লগ আউট"
              title="লগ আউট"
            >
              {/* lucide 'log-out' style SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>

            {/* UPDATED: profile icon uses fetched avatar_url */}
            <div
              role="button"
              tabIndex={0}
              onClick={() =>
                navigate("/patientprofile", {
                  state: { from: "/PatientDashboard" },
                })
              }
              onKeyDown={(e) =>
                e.key === "Enter" &&
                navigate("/patientprofile", {
                  state: { from: "/PatientDashboard" },
                })
              }
              className="w-9 h-9 rounded-full ring-2 ring-blue-400 overflow-hidden cursor-pointer"
              title={displayName || "প্রোফাইল"}
            >
              <img
                className="w-9 h-9 object-cover"
                src={avatarSrc}
                alt="profile"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      {/* FULL-WIDTH OUTER BOX */}
      <div className="w-full bg-[#E6EAEE]/70 py-3 md:py-4">
        {/* Centered container for the inner card */}
        <div className="flex-1 mx-auto max-w-8xl px-24">
          {/* Inner card */}
          <section className="rounded-3xl px-6 py-8 md:px-10 md:py-10 text-white bg-[#0E5F85] ring-1 ring-white/10 text-center shadow-xl">
            <h1 className="text-4xl md:text-4xl font-extrabold leading-tight">
              স্বাস্থ্যসহায়ে আপনাকে স্বাগতম, হামিম{" "}
              <span className="align-middle">👋</span>
            </h1>
            <p className="mt-2 text-md text-white/90">
              আপনার স্বাস্থ্যের জন্য আজকে কীভাবে সাহায্য করতে পারি?
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-10">
              <button
                onClick={() => setChatOpen(true)}
                className="px-10 py-4 text-lg rounded-2xl bg-[#0B3D56] hover:bg-[#082e41] shadow-md"
              >
                AI উপসর্গ পরীক্ষা
              </button>
              <button
                onClick={() => navigate("/doctors")}
                className="px-10 py-4  text-lg rounded-2xl bg-[#1E7AF2] hover:bg-[#1667cf] shadow-md"
              >
                ডাক্তার খুঁজুন
              </button>
              <button
                onClick={() => navigate("/emergency")}
                className="px-10 py-4 text-lg rounded-2xl bg-[#E0312D] hover:bg-[#c02825] shadow-md"
              >
                জরুরি সাহায্যতা
              </button>
            </div>
          </section>
        </div>
      </div>

      <main className="flex-1 mx-auto max-w-8xl px-24 py-6">
        {/* Welcome / CTA panel */}
        {/* FULL-WIDTH OUTER BOX (band) */}

        {/* Quick stats */}
        <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "সক্রিয় প্রেসক্রিপশন", value: "02" },
            { label: "বুকড অ্যাপয়েন্টমেন্ট", value: "01" },
            { label: "শেষ স্বাস্থ্য পরীক্ষা", value: "জুলাই ২০২৫" },
            { label: "বিমা স্ট্যাটাস", value: "সক্রিয়" },
          ].map((k, i) => (
            <div
              key={i}
              className="bg-[#CAD3D2] rounded-2xl p-5 text-center shadow ring-1 ring-black/5"
            >
              <div className="text-[#2C4D5F] text-sm">{k.label}</div>
              <div className="text-2xl font-extrabold mt-1 text-[#0E5F85]">
                {k.value}
              </div>
            </div>
          ))}
        </section>

        {/* Symptom checker (full width like mockup) */}
        <section className="mt-6">
          <div className="bg-[#CAD3D2] rounded-3xl p-5 md:p-6 shadow ring-1 ring-black/5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#0E5F85]">
                AI উপসর্গ পরীক্ষা
              </h3>
              <button className="text-sm px-4 py-1.5 rounded-full bg-white text-[#0E5F85] ring-1 ring-[#0E5F85]/20 hover:bg-[#eef6fb]">
                ইতিহাস
              </button>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <input
                className="flex-1 h-14 rounded-2xl border border-[#0E5F85] bg-white px-4 focus:outline-none focus:ring-2 focus:ring-[#0E5F85]"
                placeholder="আপনার উপসর্গ লিখুন (যেমন: বুকে ব্যথা, মাথা ঘোরা)"
                aria-label="উপসর্গ"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setChatOpen(true)}
                  className="px-5 h-14 rounded-2xl bg-[#0B3D56] text-white hover:bg-[#082e41]"
                >
                  বিশ্লেষণ করুন
                </button>
              </div>
            </div>

            <div className="mt-5 text-sm text-[#2C4D5F]">
              <p className="font-semibold">প্রাইমারি রেজাল্ট (ডেমো):</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>সম্ভাব্য রোগ: এঞ্জাইনা / অ্যাসিডিটি</li>
                <li>প্রস্তাবিত: ইসিজি টেস্ট • পানি পান • স্ট্রেস কমানো</li>
                <li>নিকটস্থ বিশেষজ্ঞ: কার্ডিওলজিস্ট (ম্যাপ দেখুন)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Doctor search + Prescription */}
        <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Doctor search (left column in mockup) */}
          <div className="bg-[#CAD3D2] rounded-3xl p-5 shadow ring-1 ring-black/5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#0E5F85]">
                ডাক্তার খুঁজুন
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#2C4D5F]">ম্যাপ</span>
                <button
                  onClick={() => navigate("/doctors/map")}
                  className="px-3 py-1 rounded-full bg-[#EBEFF2] hover:bg-[#E1E7EC]"
                >
                  যান
                </button>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <input
                className="flex-1 rounded-xl border border-[#0E5F85] bg-[#F8FAFB] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#306C8E]"
                placeholder="বিশেষজ্ঞ / এলাকা"
              />
              <button className="px-4 py-2 rounded-xl bg-[#1E7AF2] text-white hover:bg-[#1667cf]">
                খুঁজুন
              </button>
            </div>

            <ul className="mt-4 space-y-3 text-sm">
              {/* Card 1 */}
              <li className="p-3 rounded-2xl border border-[#0E5F85] bg-[#F8FAFB] hover:bg-white transition">
                <div className="flex items-center gap-3">
                  <img
                    src="/image/doc1.png"
                    className="w-10 h-10 rounded-full object-cover"
                    alt=""
                  />
                  <div className="flex-1">
                    <div className="font-semibold">
                      ডা. নুসরাত জাহান • নিউরোলজি
                    </div>
                    <div className="text-[#2C4D5F]">
                      বিপি হাসপাতাল • ১.৪ কিমি • ⭐ 4.8
                    </div>
                  </div>
                </div>
              </li>
              {/* Card 2 */}
              <li className="p-3 rounded-2xl border border-[#0E5F85] bg-[#F8FAFB] hover:bg-white transition">
                <div className="flex items-center gap-3">
                  <img
                    src="/image/doc2.png"
                    className="w-10 h-10 rounded-full object-cover"
                    alt=""
                  />
                  <div className="flex-1">
                    <div className="font-semibold">
                      ডা. তানভীর হাসান • মেডিসিন
                    </div>
                    <div className="text-[#2C4D5F]">
                      স্কয়ার হাসপাতাল • ২.১ কিমি • ⭐ 4.6
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Prescription + medicines (right column in mockup) */}
          <div className="bg-[#CAD3D2] rounded-3xl p-5 shadow ring-1 ring-black/5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#0E5F85]">
                প্রেসক্রিপশন ও ওষুধ
              </h3>
              <button className="text-sm px-3 py-1 rounded-full bg-[#EBEFF2] hover:bg-[#E1E7EC]">
                ইতিহাস
              </button>
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="sm:col-span-2 border-2 border-dashed rounded-2xl p-4 text-sm text-center cursor-pointer hover:bg-[#F8FAFB]">
                <input type="file" className="hidden" />
                <div className="font-medium">প্রেসক্রিপশন আপলোড করুন</div>
                <div className="text-[#2C4D5F]">ছবি / PDF</div>
              </label>
              <button className="px-4 py-2 rounded-xl bg-[#0B3D56] text-white hover:bg-[#082e41]">
                দাম তুলনা
              </button>
            </div>

            <div className="mt-4 text-sm text-[#2C4D5F] grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl border bg-[#F2F6F8]">
                <div className="font-semibold">Omeprazole 20mg</div>
                <div>বিকল্প: Omez, Ocid, Omidon</div>
                <div>দাম: ৳৬–৳১২ • নিকটস্থ ফার্মেসি: ০.৮ কিমি</div>
              </div>
              <div className="p-3 rounded-2xl border bg-[#F2F6F8]">
                <div className="font-semibold">Atorvastatin 10mg</div>
                <div>বিকল্প: Lipitor, Atorva</div>
                <div>দাম: ৳১২–৳২২ • নিকটস্থ ফার্মেসি: ১.২ কিমি</div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom row: Records / Tips / Activity */}
        <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Medical records */}
          <div className="bg-[#CAD3D2] rounded-3xl p-5 shadow ring-1 ring-black/5">
            <h3 className="text-lg font-bold text-[#0E5F85]">
              মেডিক্যাল রেকর্ডস
            </h3>
            <ul className="mt-3 space-y-3 text-sm">
              {[
                { t: "রক্ত পরীক্ষা রিপোর্ট", d: "১২ জুলাই ২০২৫" },
                { t: "ইমেজিং রিপোর্ট", d: "০২ জুন ২০২৫" },
              ].map((r, i) => (
                <li
                  key={i}
                  className="p-3 rounded-2xl border bg-[#F8FAFB] flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{r.t}</div>
                    <div className="text-[#2C4D5F]">{r.d}</div>
                  </div>
                  <button
                    className="p-2 rounded-xl bg-white ring-1 ring-black/10 hover:bg-[#EEF4F8]"
                    title="Download"
                  >
                    ⬇
                  </button>
                </li>
              ))}
            </ul>
            <button className="mt-3 px-4 py-2 rounded-xl bg-[#0B3D56] text-white hover:bg-[#082e41]">
              নতুন রিপোর্ট যোগ করুন
            </button>
          </div>

          {/* Health tips */}
          <div className="bg-[#CAD3D2] rounded-3xl p-5 shadow ring-1 ring-black/5">
            <h3 className="text-lg font-bold text-[#0E5F85]">স্বাস্থ্য টিপস</h3>
            <ul className="mt-3 list-disc list-inside text-sm text-[#2C4D5F] space-y-1">
              <li>প্রতিদিন অন্তত ৮ গ্লাস পানি পান করুন।</li>
              <li>দিনে ১০ মিনিট হাঁটা বা হালকা ব্যায়াম করুন।</li>
              <li>ফল-সবজি বেশি খান, প্রক্রিয়াজাত খাবার কমান।</li>
              <li>রাতে ৭–৮ ঘণ্টা ঘুম নিশ্চিত করুন।</li>
            </ul>
          </div>

          {/* Recent activity */}
          <div className="bg-[#CAD3D2] rounded-3xl p-5 shadow ring-1 ring-black/5">
            <h3 className="text-lg font-bold text-[#0E5F85]">
              সাম্প্রতিক কার্যকলাপ
            </h3>
            <ul className="mt-3 text-sm text-[#2C4D5F] space-y-3">
              <li className="p-3 rounded-2xl border bg-[#F8FAFB]">
                ডা. রাইমেন-এর সাথে অ্যাপয়েন্টমেন্ট কনফার্ম • ০৩ আগস্ট ২০২৫ •
                ০৫:৩০ AM
              </li>
              <li className="p-3 rounded-2xl border bg-[#F8FAFB]">
                প্রেসক্রিপশন আপলোড • ২৮ আগস্ট ২০২৫ • ০৫:২০ PM
              </li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0B3D56] text-white text-center text-sm py-4 px-4">
        © ২০২৫ স্বাস্থ্যসহায় — সব তথ্য কেবল সহায়ক। সঠিক চিকিৎসার জন্য নিবন্ধিত
        চিকিৎসকের পরামর্শ নিন।
      </footer>

      {/* Floating emergency button */}
      <button
        onClick={() => navigate("/emergency")}
        className="fixed bottom-6 right-6 shadow-xl rounded-full px-5 py-3 bg-[#E0312D] text-white font-semibold hover:bg-[#c02825]"
        aria-label="জরুরি সাহায্য"
      >
        🚨 জরুরি সাহায্যতা
      </button>

      {/* Chat drawer (optional)
      <AISuggestionChat
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        onMinimize={() => setChatOpen(false)}
      /> */}
    </div>
  );
}

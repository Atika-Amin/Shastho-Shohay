import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AISuggestionChat from "./AISuggestionChat"; // <-- adjust path if needed

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1878A9] via-[#306C8E] to-[#005076] text-gray-800">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-blue-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/image/logo.png" alt="স্বাস্থ্যসহায়" className="h-8" />
            <div className="font-bold">স্বাস্থ্যসহায়</div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="relative p-2 rounded-full hover:bg-blue-800"
              aria-label="Notifications"
            >
              {/* Bell icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M12 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 006 14h12a1 1 0 00.707-1.707L18 11.586V8a6 6 0 00-6-6z" />
                <path d="M8 15a4 4 0 008 0H8z" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-medium leading-none text-white bg-red-600 rounded-full">
                3
              </span>
            </button>
            <img
              src="/images/avatar-patient.png"
              alt="profile"
              className="w-9 h-9 rounded-full ring-2 ring-blue-500 object-cover"
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Greeting + Quick Actions */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl p-6 text-white shadow bg-gradient-to-r from-[#1878A9] via-[#306C8E] to-[#005076]">
            <h1 className="text-2xl sm:text-3xl font-semibold">
              হ্যালো, হামিম 👋
            </h1>
            <p className="mt-1 text-white/90">
              আপনার স্বাস্থ্যের জন্য আজ কীভাবে সাহায্য করতে পারি?
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => setChatOpen(true)} // <-- opens chat
                className="px-4 py-2 bg-blue-700 text-white rounded-xl shadow hover:bg-blue-800"
              >
                🩺 AI উপসর্গ পরীক্ষা
              </button>
              <button
                onClick={() => navigate("/doctors")}
                className="px-4 py-2 bg-blue-500 text-white rounded-xl shadow hover:bg-blue-600"
              >
                👨‍⚕️ ডাক্তার খুঁজুন
              </button>
              <button
                onClick={() => navigate("/emergency")}
                className="px-4 py-2 bg-red-600 text-white rounded-xl shadow hover:bg-red-700"
              >
                🚑 জরুরি সাহাযতা
              </button>
            </div>
          </div>

          {/* Next appointment card */}
          <div className="bg-white rounded-2xl p-5 shadow border border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">পরবর্তী অ্যাপয়েন্টমেন্ট</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                বুকড
              </span>
            </div>
            <div className="mt-3 text-sm text-gray-700 space-y-1">
              <div className="font-medium">ডা. রাহিম উদ্দিন • কার্ডিওলজি</div>
              <div>তারিখ: ০৩ সেপ্টেম্বর ২০২৫, ৫:৩০ PM</div>
              <div>স্থান: ঢাকা সিটি মেডিক্যাল, ধানমন্ডি</div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="px-3 py-2 text-sm rounded-lg bg-blue-700 text-white hover:bg-blue-800">
                রিস্কেডিউল
              </button>
              <button className="px-3 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200">
                ভিডিও কল টেস্ট
              </button>
            </div>
          </div>
        </section>

        {/* KPI / Quick Stats */}
        <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "সক্রিয় প্রেসক্রিপশন", value: 2 },
            { label: "বুকড অ্যাপয়েন্টমেন্ট", value: 1 },
            { label: "শেষ স্বাস্থ্য পরীক্ষা", value: "জুলাই ২০২৫" },
            { label: "বিমা স্ট্যাটাস", value: "সক্রিয়" },
          ].map((k, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-4 shadow border border-gray-100 text-center"
            >
              <div className="text-sm text-gray-500">{k.label}</div>
              <div className="text-xl font-semibold mt-1 text-[#005076]">
                {k.value}
              </div>
            </div>
          ))}
        </section>

        {/* Core grid (Emergency card removed; Symptom checker full width) */}
        <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Symptom checker */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-5 shadow border border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">🩺 AI উপসর্গ পরীক্ষা</h3>
              <button className="text-sm px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200">
                ইতিহাস
              </button>
            </div>
            <div className="mt-3">
              <label className="block text-sm text-gray-600 mb-1">
                আপনার উপসর্গ লিখুন (যেমন: বুকে ব্যথা, মাথা ঘোরা)
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  className="flex-1 border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1878A9]"
                  placeholder="উপসর্গ টাইপ করুন..."
                  aria-label="উপসর্গ"
                />
                <button
                  onClick={() => setChatOpen(true)} // <-- opens chat
                  className="px-5 py-2 bg-blue-700 text-white rounded-xl hover:bg-blue-800"
                >
                  বিশ্লেষণ করুন
                </button>
              </div>
              <div className="mt-4 text-sm text-gray-700">
                <p className="font-medium">প্রাইমারি রেজাল্ট (ডেমো):</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>সম্ভাব্য রোগ: এঞ্জাইনা / অ্যাসিডিটি</li>
                  <li>প্রস্তাবিত: ইসিজি টেস্ট • পানি পান • স্ট্রেস কমানো</li>
                  <li>নিকটস্থ বিশেষজ্ঞ: কার্ডিওলজিস্ট (ম্যাপ দেখুন)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Medicine Period */}
        <section className="mt-6">
          <div className="bg-white rounded-2xl p-5 shadow border border-gray-100">
            <h3 className="font-semibold mb-3">⏳ ওষুধ সেবন সময়কাল</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600">
                  <th className="p-2 text-left">ওষুধের নাম</th>
                  <th className="p-2 text-left">ডোজ</th>
                  <th className="p-2 text-left">শুরুর তারিখ</th>
                  <th className="p-2 text-left">শেষ তারিখ</th>
                  <th className="p-2 text-left">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-2">Omeprazole 20mg</td>
                  <td className="p-2">১ ট্যাব • দিনে ২ বার</td>
                  <td className="p-2">১০ আগস্ট ২০২৫</td>
                  <td className="p-2">২৪ আগস্ট ২০২৫</td>
                  <td className="p-2 text-green-600 font-medium">✔ সম্পন্ন</td>
                </tr>
                <tr className="border-t">
                  <td className="p-2">Atorvastatin 10mg</td>
                  <td className="p-2">১ ট্যাব • রাতে</td>
                  <td className="p-2">১৫ আগস্ট ২০২৫</td>
                  <td className="p-2">চলমান</td>
                  <td className="p-2 text-blue-600 font-medium">⏳ চলমান</td>
                </tr>
                <tr className="border-t">
                  <td className="p-2">Vitamin D3</td>
                  <td className="p-2">১ ক্যাপসুল • সপ্তাহে ১ বার</td>
                  <td className="p-2">০১ আগস্ট ২০২৫</td>
                  <td className="p-2">০১ নভেম্বর ২০২৫</td>
                  <td className="p-2 text-orange-600 font-medium">🔔 চলমান</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Doctors + Prescriptions */}
        <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Find doctor */}
          <div className="bg-white rounded-2xl p-5 shadow border border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">👨‍⚕️ ডাক্তার খুঁজুন</h3>
              <button
                onClick={() => navigate("/doctors/map")}
                className="text-sm px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                ম্যাপ
              </button>
            </div>
            <div className="mt-3 flex gap-2">
              <input
                className="flex-1 border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#306C8E]"
                placeholder="বিশেষজ্ঞ/এলাকা"
                aria-label="ডাক্তারের বিশেষজ্ঞ বা এলাকা"
              />
              <button className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600">
                সার্চ
              </button>
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="p-3 rounded-xl border hover:bg-gray-50">
                <div className="font-medium">ডা. নুসরাত জাহান • নিউরোলজি</div>
                <div className="text-gray-600">
                  বিপি হাসপাতাল • ১.৪ কিমি • ⭐ 4.8
                </div>
              </li>
              <li className="p-3 rounded-xl border hover:bg-gray-50">
                <div className="font-medium">ডা. তানভীর হাসান • মেডিসিন</div>
                <div className="text-gray-600">
                  স্কয়ার হাসপাতাল • ২.১ কিমি • ⭐ 4.6
                </div>
              </li>
            </ul>
          </div>

          {/* Prescriptions */}
          <div className="bg-white rounded-2xl p-5 shadow border border-gray-100 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">💊 প্রেসক্রিপশন ও ওষুধ</h3>
              <button className="text-sm px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200">
                ইতিহাস
              </button>
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="sm:col-span-2 border-2 border-dashed rounded-xl p-4 text-sm text-center cursor-pointer hover:bg-gray-50">
                <input type="file" className="hidden" />
                <div className="font-medium">প্রেসক্রিপশন আপলোড করুন</div>
                <div className="text-gray-500">ছবি / PDF</div>
              </label>
              <button className="px-4 py-2 rounded-xl bg-blue-700 text-white hover:bg-blue-800">
                দাম তুলনা করুন
              </button>
            </div>
            <div className="mt-4 text-sm text-gray-700">
              <p className="font-medium">উদাহরণ ফলাফল:</p>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border bg-gray-50">
                  <div className="font-medium">Omeprazole 20mg</div>
                  <div className="text-gray-600">
                    বিকল্প: Omez, Ocid, Omidon
                  </div>
                  <div className="text-gray-600">
                    দাম: ৳৬–৳১২ • নিকটস্থ ফার্মেসি: ০.৮ কিমি
                  </div>
                </div>
                <div className="p-3 rounded-xl border bg-gray-50">
                  <div className="font-medium">Atorvastatin 10mg</div>
                  <div className="text-gray-600">বিকল্প: Lipitor, Atorva</div>
                  <div className="text-gray-600">
                    দাম: ৳১২–৳২২ • নিকটস্থ ফার্মেসি: ১.২ কিমি
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer line */}
      <footer className="bg-blue-900 text-white text-center text-sm py-4 px-4">
        © ২০২৫ স্বাস্থ্যসহায় | সব তথ্য কেবল সহায়ক হিসেবে প্রদান করা হয়। সঠিক
        চিকিৎসার জন্য সর্বদা নিবন্ধিত চিকিৎসকের পরামর্শ নিন।
      </footer>

      {/* Floating Emergency Button */}
      <button
        onClick={() => navigate("/emergency")}
        className="fixed bottom-6 right-6 shadow-xl rounded-full px-5 py-3 bg-red-600 text-white font-semibold hover:bg-red-700"
        aria-label="জরুরি সাহায্য"
      >
        🚨 জরুরি
      </button>

      {/* AI Chat Drawer */}
      <AISuggestionChat
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        onMinimize={() => setChatOpen(false)}
      />
    </div>
  );
}


import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const whyRef = useRef(null); // for "Why Use" section
  const scrollToWhy = () => {
    if (whyRef.current) {
      whyRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };


  return (
    <div className="font-sans text-gray-800 bg-gradient-to-r from-[#1878A9] via-[#306C8E] via-[#005076] to-[#6B92A4]">
      {/* Navbar */}
      <header className="text-[#CAD3D2] px-6 py-4 flex justify-between items-center max-w-8xl mx-auto px-24">
        <div className="flex items-center space-x-2">
          <img
            src="/image/logo1.png"
            alt="স্বাস্থ্যসহায়"
            className="h-10 w-9"
          />
          <span className="font-bold text-3xl">স্বাস্থ্যসহায়</span>
        </div>
        <nav className="hidden md:flex space-x-7 text-md font-medium ">
          <a
            href="#"
            className="transition transform hover:-translate-y-1 hover:shadow-4xl hover:text-white duration-300"
            onClick={() => navigate("/")}
          >
            হোম
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault(); // stops page from jumping
              scrollToWhy(); // smooth scroll
            }}
            className="transition transform hover:-translate-y-1 hover:shadow-4xl hover:text-white duration-300"
          >
            আমাদের সম্পর্কে
          </a>
          <a
            href="#"
            className="transition transform hover:-translate-y-1 hover:shadow-4xl hover:text-white duration-300"
            onClick={() => navigate("/login")}
          >
            AI পরামর্শ
          </a>
          <a
            href="#"
            className="transition transform hover:-translate-y-1 hover:shadow-4xl hover:text-white duration-300"
            onClick={() => navigate("/login")}
          >
            জরুরি সাহাযতা
          </a>
          <a
            href="#"
            className="transition transform hover:-translate-y-1 hover:shadow-4xl hover:text-white duration-300"
          >
            যোগাযোগ
          </a>
        </nav>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate("/login")}
            className="bg-[#00214D] px-5 py-2 font-medium rounded-full shadow-[0_5px_10px_rgba(0,0,0,0.4)] hover:-translate-y-1 hover:shadow-lg hover:bg-[#003580] transition duration-300"
          >
            লগইন
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-[#00214D] px-5 py-2 font-medium rounded-full shadow-[0_5px_10px_rgba(0,0,0,0.4)] hover:-translate-y-1 hover:shadow-lg hover:bg-[#003580] transition duration-300"
          >
            রেজিস্টার
          </button>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative bg-cover bg-center h-[700px] flex items-center"
        style={{
          backgroundImage: "url('/image/hero4.jpeg')",
        }}
      >
        <div className="absolute inset-0 bg-[#155C7F]/"></div>
        <div className="relative z-10 max-w-8xl  px-24">
          <h1 className="text-6xl font-bold leading-snug text-black ">
            আপনার হাতের মুঠোয় <br />
            <span className="text-8xl text-[#155C7F] ">স্বাস্থ্য সহায়তা</span>
          </h1>
          <p className="mt-4 text-black text-lg">
            AI ভিত্তিক স্বাস্থ্য পরামর্শ, ডাক্তার খোঁজ ও জরুরি সাহাযতা, যেকোনো
            সময়, যেকোনো জায়গায়
          </p>
          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-[#155C7F] text-[#CAD3D2] text-lg px-7 py-2 rounded-full shadow-[0_5px_10px_rgba(0,0,0,0.4)] hover:-translate-y-1 hover:shadow-4xl hover:bg-[#003580] transition duration-300"
            >
              শুরু করুন
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-[#155C7F] text-[#CAD3D2] text-lg px-5 py-2 rounded-full shadow-[0_5px_10px_rgba(0,0,0,0.4)] hover:-translate-y-1 hover:shadow-4xl hover:bg-[#003580] transition duration-300"
            >
              জরুরি সাহাযতা
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-8">
        <div className="max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-24">
          <div className="bg-[#CAD3D2] p-6 rounded-lg text-center shadow-[0_5px_10px_rgba(0,0,0,0.4)] hover:-translate-y-1 hover:shadow-2xl hover:bg-white transition duration-300">
            <h3 className="font-bold text-3xl mb-2">AI পরামর্শ</h3>
            <p className="text-lg">উপসর্গ দিন, AI বলবে সম্ভাব্য রোগ ও করণীয়</p>
          </div>
          <div className="bg-[#CAD3D2] p-6 rounded-lg text-center shadow-[0_5px_10px_rgba(0,0,0,0.4)] hover:-translate-y-1 hover:shadow-2xl hover:bg-white transition duration-300">
            <h3 className="font-bold text-3xl mb-2">ডাক্তার খুঁজুন</h3>
            <p className="text-lg">নিকটস্থ ডাক্তার খুঁজুন ও সেবা নিন</p>
          </div>
          <div className="bg-[#CAD3D2] p-6 rounded-lg shadow-[0_5px_10px_rgba(0,0,0,0.4)] text-center hover:-translate-y-1 hover:shadow-2xl hover:bg-white transition duration-300">
            <h3 className="font-bold text-3xl mb-2">জরুরি সাহাযতা</h3>
            <p className="text-lg">জরুরি অবস্থায় প্রাথমিক চিকিৎসা নিন</p>
          </div>
        </div>
      </section>

      {/* Why Use */}
      <section ref={whyRef} className="py-12">
        <div className="max-w-8xl mx-auto px-24">
          <h2 className="text-4xl text-[#CAD3D2] font-bold mb-10 text-center">
            কেন স্বাস্থ্যসহায় ব্যবহার করবেন ?
          </h2>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-14">
            <div className="flex-1">
              <img
                src="/image/why.webp"
                alt="why"
                className="rounded-lg w-full h-115 object-cover shadow-md"
              />
            </div>
            <div className="flex-1">
              <ul className="text-left text-2xl text-[#CAD3D2] list-disc list-inside space-y-4">
                <li>
                  ২৪/৭ যেকোনো সময়ের জন্য নির্ভরযোগ্য AI ভিত্তিক স্বাস্থ্য
                  পরামর্শ সেবা
                </li>
                <li>নিকটস্থ ও অভিজ্ঞ ডাক্তার সহজেই খুঁজে পাওয়ার সুবিধা</li>
                <li>
                  জরুরি অবস্থায় প্রাথমিক চিকিৎসা গ্রহণের জন্য নির্ভুল উপায়
                </li>
                <li>সহজে ব্যবহারযোগ্য ও সবার জন্য বন্ধুত্বপূর্ণ প্ল্যাটফর্ম</li>
                <li>বিশ্বস্ত ও যাচাইকৃত স্বাস্থ্য তথ্যের সম্পূর্ণ নিশ্চয়তা</li>
                <li>
                  রোগ নির্ণয়ের জন্য দ্রুত ও বুদ্ধিমত্তাপূর্ণ উপসর্গ বিশ্লেষণ
                  ব্যবস্থা
                </li>
                <li>ঔষধ সম্পর্কে নির্ভরযোগ্য, হালনাগাদ ও বিস্তারিত তথ্য</li>
                <li>অনলাইন ডাক্তার চ্যাট ও উচ্চমানের ভিডিও কলের সুবিধা</li>
                <li>
                  স্বাস্থ্য রিপোর্ট নিরাপদে সংরক্ষণ ও সহজে শেয়ার করার সুযোগ
                </li>
                <li>বাংলা ভাষায় সহজবোধ্য ও ব্যবহারকারী বান্ধব অভিজ্ঞতা</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12">
        <div className="max-w-8xl mx-auto px-24 text-center">
          <h2 className="text-4xl text-[#CAD3D2] font-bold mb-10">
            আপনার ভূমিকা অনুযায়ী সুবিধা কী ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#CAD3D2] p-3 rounded-lg shadow-[0_5px_10px_rgba(0,0,0,0.4)] text-center">
              <img
                src="/image/patient.jpg"
                alt="patient"
                className="rounded mb-4 w-full h-45 object-cover"
              />
              <h3 className="font-bold text-2xl list-disc list-inside inline-block text-left">
                রোগী
              </h3>
              <ul className="list-disc list-outside text-gray-700 mt-2 space-y-2 text-left pl-5">
                <li>নিজের চিকিৎসা ইতিহাস সংরক্ষণ</li>
                <li>উপসর্গ দিলে তাৎক্ষণিক AI স্বাস্থ্য পরামর্শ</li>
                <li>নিকটস্থ ডাক্তার খুঁজে অ্যাপয়েন্টমেন্ট বুকিং</li>
              </ul>
            </div>

            <div className="bg-[#CAD3D2] p-3 rounded-lg shadow-[0_5px_10px_rgba(0,0,0,0.4)]">
              <img
                src="/image/doctor.jpg"
                alt="doctor"
                className="rounded mb-4 w-full h-45 object-cover"
              />
              <h3 className="font-bold text-2xl">ডাক্তার</h3>
              <ul className="list-disc list-outside text-gray-700 mt-2 space-y-2 text-left pl-5">
                <li>রোগীর উপসর্গ, রিপোর্ট ও চিকিৎসা</li>
                <li>ভিডিও বা অডিও কলে সরাসরি রোগীর সাথে যোগাযোগ</li>
              </ul>
            </div>

            <div className="bg-[#CAD3D2] p-3 rounded-lg shadow-[0_5px_10px_rgba(0,0,0,0.4)]">
              <img
                src="/image/hospital.jpeg"
                alt="hospital"
                className="rounded mb-4 w-full h-45 object-cover"
              />
              <h3 className="font-bold text-2xl">হাসপাতাল</h3>
              <ul className="list-disc list-outside text-gray-700 mt-2 space-y-1 text-left pl-5">
                <li>বেড ও আইসিইউ স্ট্যাটাস রিয়েল-টাইম আপডেট</li>
                <li>জরুরি রোগী রিকোয়েস্ট ম্যানেজমেন্ট</li>
                <li>অ্যাম্বুলেন্স ও রিসোর্স ট্র্যাকিং সিস্টেম</li>
              </ul>
            </div>
            <div className="bg-[#CAD3D2] p-3 rounded-lg shadow-[0_5px_10px_rgba(0,0,0,0.4)]">
              <img
                src="/image/pharmacy.jpg"
                alt="admin"
                className="rounded mb-4 w-full h-45"
              />
              <h3 className="font-bold text-2xl">ফার্মাসিস্ট</h3>
              <ul className="list-disc list-outside text-gray-700 mt-2 space-y-1 text-left pl-5">
                <li>প্রেসক্রিপশন অনুযায়ী ওষুধের স্টক আপডেট</li>
                <li>কাছাকাছি গ্রাহকদের ওষুধ ডেলিভারি লোকেশন দেখা</li>
                <li>বিকল্প ব্র্যান্ড ও দাম তুলনা সুবিধা</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-[#CAD3D2] py-12">
        <div className="max-w-8xl mx-auto px-24 text-center">
          <h2 className="text-4xl text-[#155C7F] font-bold mb-8">
            কিভাবে ব্যবহার করবেন ?
          </h2>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Step 1 */}
            <div className="bg-[#155C7F] p-6 rounded-lg shadow-[0_5px_10px_rgba(0,0,0,0.4)] flex flex-col items-center w-70">
              <img
                src="/image/step1.png"
                alt="step1"
                className="w-16 h-16 mb-4"
              />
              <h3 className="text-[#CAD3D2] text-2xl font-bold mb-2 text-center">
                ওয়েবসাইটে প্রবেশ করুন
              </h3>
              <p className="text-[#CAD3D2] text-center text-sm">
                এখনই ব্রাউজার খুলুন এবং নির্দিষ্ট ওয়েবসাইটে যান
              </p>
            </div>

            {/* Arrow */}
            <div className="hidden md:block text-6xl font-bold text-[#155C7F]">
              →
            </div>

            {/* Step 2 */}
            <div className="bg-[#155C7F] p-6 rounded-lg shadow-[0_5px_10px_rgba(0,0,0,0.4)] flex flex-col items-center w-70">
              <img
                src="/image/step2.png"
                alt="step2"
                className="w-20 h-16 mb-4"
              />
              <h3 className="text-[#CAD3D2] text-2xl font-bold mb-2 text-center">
                রেজিস্ট্রেশন করুন
              </h3>
              <p className="text-[#CAD3D2] text-center text-sm">
                আপনার নাম, ফোন ও প্রয়োজনীয় অন্যান্য তথ্য দিন
              </p>
            </div>

            {/* Arrow */}
            <div className="hidden md:block text-6xl font-bold text-[#155C7F]">
              →
            </div>

            {/* Step 3 */}
            <div className="bg-[#155C7F] p-6 rounded-lg shadow-[0_5px_10px_rgba(0,0,0,0.4)] flex flex-col items-center w-70">
              <img
                src="/image/step3.png"
                alt="step3"
                className="w-17 h-15 mb-4"
              />
              <h3 className="text-[#CAD3D2] text-2xl font-bold mb-2 text-center">
                সেবা নির্বাচন করুন
              </h3>
              <p className="text-[#CAD3D2] text-center text-sm">
                AI পরামর্শ, ডাক্তার খোঁজা বা জরুরি সহায়তা
              </p>
            </div>

            {/* Arrow */}
            <div className="hidden md:block text-6xl font-bold text-[#155C7F]">
              →
            </div>

            {/* Step 4 */}
            <div className="bg-[#155C7F] p-6 rounded-lg shadow-[0_5px_10px_rgba(0,0,0,0.4)] flex flex-col items-center w-70">
              <img
                src="/image/step4.png"
                alt="step4"
                className="w-17 h-15 mb-4"
              />
              <h3 className="text-[#CAD3D2] text-2xl font-bold mb-2 text-center">
                স্বাস্থ্য সহায়তা নিন
              </h3>
              <p className="text-[#CAD3D2] text-center text-sm">
                AI ফলাফল দেখুন বা লাইভ ডাক্তার পরামর্শ নিন
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12">
        <div className="max-w-8xl mx-auto px-24 text-center">
          <h2 className="text-4xl text-[#CAD3D2] font-bold mb-2 ">
            আমাদের ব্যবহারকারীদের অভিজ্ঞতা
          </h2>
          <p className="text-sm text-[#CAD3D2] font-medium mb-8">
            স্বাস্থ্যসহায় কিভাবে মানুষকে সাহায্য করছে, শুনুন তাদের মুখে
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#CAD3D2] p-5 rounded-lg shadow-[0_5px_10px_rgba(0,0,0,0.4)] flex items-start">
              {/* User Profile Icon */}
              <img
                src="/image/pp1.png"
                alt="User Icon"
                className="w-10 h-10 rounded-full mr-2 object-cover object-center"
              />

              {/* Testimonial Text */}
              <div>
                <p className="font-bold text-left">
                  "স্বাস্থ্যসহায় আমার জীবন বাঁচিয়েছে। হঠাৎ রাতে প্রচণ্ড বুকে
                  ব্যথা শুরু হলে আমি ওয়েবসাইটে গিয়ে জরুরি সহায়তা দিই AI আমাকে
                  তাত্ক্ষণিক CPR এর নির্দেশনা দেয় এবং কাছের হাসপাতালের
                  অ্যাম্বুলেন্স পাঠায় কয়েক মিনিটের মধ্যেই চিকিৎসা শুরু হয় আজ আমি
                  বেঁচে আছি শুধু স্বাস্থ্যসহায়-এর কারণে"
                </p>
                <span className="block mt-2 text-left">— আব্দুল হক, বগুড়া</span>
              </div>
            </div>

            <div className="bg-[#CAD3D2] p-5 rounded-lg shadow-[0_5px_10px_rgba(0,0,0,0.4)] flex items-start">
              {/* User Profile Icon */}
              <img
                src="/image/pp2.png"
                alt="User Icon"
                className="w-10 h-10 rounded-full mr-2 object-cover object-center"
              />

              {/* Testimonial Text */}
              <div>
                <p className="font-bold text-left">
                  "দ্রুত ডাক্তার পেয়ে গিয়েছিলাম। গ্রামের হাসপাতালে ডাক্তার ছিল
                  না, কিন্তু স্বাস্থ্যসহায়-এ উপসর্গ লিখে সঙ্গে সঙ্গে নিকটস্থ
                  একজন বিশেষজ্ঞ ডাক্তারের নাম, নম্বর ও ভিডিও কল অপশন পাই। কয়েক
                  মিনিটের মধ্যেই চিকিৎসা শুরু হয় এত দ্রুত সাহায্য আগে কখনো
                  পাইনি"
                </p>
                <span className="block mt-2 text-left">
                  — লায়লা আক্তার, ফরিদপুর
                </span>
              </div>
            </div>
            <div className="bg-[#CAD3D2] p-5 rounded-lg shadow-[0_5px_10px_rgba(0,0,0,0.4)] flex items-start">
              {/* User Profile Icon */}
              <img
                src="/image/pp3.png"
                alt="User Icon"
                className="w-10 h-10 rounded-full mr-2 object-cover object-center"
              />

              {/* Testimonial Text */}
              <div>
                <p className="font-bold text-left">
                  "AI এর পরামর্শে দ্রুত চিকিৎসা শুরু করতে পেরেছি। মাথা ঘোরা আর
                  বমি হলে স্বাস্থ্যসহায় জানায় এটা স্ট্রোকের লক্ষণ হতে পারে এবং
                  করণীয় দেখায়। অ্যাম্বুলেন্স পাঠিয়ে সময়মতো হাসপাতালে পৌঁছাই, বড়
                  বিপদ এড়ানো গেছে।"
                </p>
                <span className="block mt-2 text-left">
                  — জাফর মিয়া, সিলেট
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b  from-[#07486B] to-[#00364D] text-[#CAD3D2] py-10">
        <h2 className="text-3xl text-[#CAD3D2] text-center font-bold mb-8 ">
          স্বাস্থ্যসহায় – আপনার পাশে সবসময়
        </h2>
        <div className="max-w-8xl mx-auto px-30 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* যোগাযোগ */}
          <div>
            <h3 className="text-2xl font-bold mb-4">যোগাযোগ</h3>
            <p>
              📞 <span className="font-semibold">ফোন:</span> +880 1234-567890
            </p>
            <p>
              📧 <span className="font-semibold">ইমেইল:</span>{" "}
              info@swastiyosohay.com
            </p>
            <p>
              🏠 <span className="font-semibold">ঠিকানা:</span> ১২৩, ঢাকা,
              বাংলাদেশ
            </p>
          </div>
          {/* গুরুত্বপূর্ণ লিংক */}
          <div>
            <h3 className="text-2xl font-bold mb-4">গুরুত্বপূর্ণ লিংক</h3>
            <ul className="space-y-2">
              <li>🛡️ গোপনীয়তা নীতি</li>
              <li>📜 শর্তাবলী</li>
            </ul>
          </div>
          {/* আমাদের সাথে যুক্ত থাকুন */}
          <div>
            <h3 className="text-2xl font-bold mb-4">আমাদের সাথে যুক্ত থাকুন</h3>
            <div className="flex justify-center md:justify-start space-x-4 text-2xl">
              {/* Facebook */}
              <a href="#" className="hover:scale-110 transition">
                <svg
                  className="w-10 h-10 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1 .9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 3h-1.9v7A10 10 0 0 0 22 12" />
                </svg>
              </a>
              {/* Twitter */}
              <a href="#" className="hover:scale-110 transition">
                <svg
                  className="w-10 h-10  text-sky-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.46 6c-.77.35-1.6.59-2.46.69a4.3 4.3 0 0 0 1.88-2.37c-.84.5-1.77.85-2.76 1.05a4.28 4.28 0 0 0-7.3 3.9A12.14 12.14 0 0 1 3.16 4.9a4.28 4.28 0 0 0 1.32 5.71 4.2 4.2 0 0 1-1.94-.54v.06a4.28 4.28 0 0 0 3.43 4.19 4.3 4.3 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.97A8.6 8.6 0 0 1 2 19.54a12.14 12.14 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.18-.01-.35-.02-.53A8.72 8.72 0 0 0 22.46 6z" />
                </svg>
              </a>
              {/* YouTube */}
              <a href="#" className="hover:scale-110 transition">
                <svg
                  className="w-10 h-10  text-red-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.6 3.2H4.4A3.4 3.4 0 0 0 1 6.6v10.8a3.4 3.4 0 0 0 3.4 3.4h15.2a3.4 3.4 0 0 0 3.4-3.4V6.6a3.4 3.4 0 0 0-3.4-3.4zM10 15.5v-7l6 3.5-6 3.5z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* নিচের কপিরাইট বার */}
        <div className="text-center mt-10 text-sm text-gray-300 border-t border-gray-600 pt-4">
          কপিরাইট © 2025 <span className="font-semibold">স্বাস্থ্যসহায়</span> |
          সর্বস্বত্ব সংরক্ষিত
        </div>
      </footer>
    </div>
  );
}

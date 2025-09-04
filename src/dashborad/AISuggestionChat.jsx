import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/** Professional, full-page AI chat for symptom suggestions */
export default function AISuggestionChatPage() {
  const navigate = useNavigate();

  // ---------------- State ----------------
  const [messages, setMessages] = useState([
    {
      id: "sys-welcome",
      role: "system",
      time: Date.now() - 1000 * 60 * 5,
      content:
        "স্বাগতম! আমি আপনার উপসর্গ বুঝে সম্ভাব্য কারণ ও করণীয় সাজেস্ট করবো। মনে রাখবেন—এটি চিকিৎসা পরামর্শ নয়।",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");
  const [attached, setAttached] = useState(null); // { name, size } (demo)
  const endRef = useRef(null);
  const fileInputRef = useRef(null);

  const quickPrompts = useMemo(
    () => [
      "বুকে চাপ ও শ্বাসকষ্ট",
      "জ্বর ৩ দিন, গলা ব্যথা",
      "মাথা ঘোরা ও বমিভাব",
      "কাশি ও বুক জ্বালা",
    ],
    []
  );

  // -------------- Effects --------------
  useEffect(() => {
    const to = setTimeout(
      () => endRef.current?.scrollIntoView({ behavior: "smooth" }),
      40
    );
    return () => clearTimeout(to);
  }, []);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // -------------- Helpers --------------
  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const groupByDay = useMemo(() => {
    const days = [];
    let current = null;
    for (const m of messages) {
      const d = new Date(m.time);
      const key = d.toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      });
      if (!current || current.label !== key) {
        current = { label: key, items: [] };
        days.push(current);
      }
      current.items.push(m);
    }
    return days;
  }, [messages]);

  const emergencyRegex = /(হার্ট|স্ট্রোক|অজ্ঞান|শ্বাসকষ্ট|বুকে চাপ)/i;

  // -------------- Actions --------------
  const onSend = (text) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed) return;
    setError("");
    const now = Date.now();

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", time: now, content: trimmed },
    ]);
    setInput("");
    setIsTyping(true);

    // Simulate AI (replace with real API later)
    const flagged = emergencyRegex.test(trimmed);
    setTimeout(() => {
      const blocks = [
        makeSummaryCard(),
        ...(flagged ? [makeRedFlagCard()] : []),
        makeNextStepsCard(),
        makeTabbedAdviceCard(),
        makeDoctorsCard(),
      ];
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "ai",
          time: Date.now(),
          type: "cards",
          blocks,
        },
      ]);
      setIsTyping(false);
    }, 900);
  };

  const onAttachPick = () => fileInputRef.current?.click();
  const onAttachFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAttached({ name: file.name, size: file.size });
  };
  const onRemoveAttach = () => setAttached(null);

  const charCount = input.length;
  const maxChars = 1000;
  const charsLeft = Math.max(0, maxChars - charCount);
  const sendDisabled = !input.trim() || charCount > maxChars;

  // -------------- Render --------------
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1878A9] via-[#306C8E] to-[#005076]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-blue-900/95 backdrop-blur text-white border-b border-white/10">
        <div className="mx-auto max-w-6xl h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="px-2 py-1 rounded hover:bg-blue-800"
              aria-label="ফিরে যান"
              title="ফিরে যান"
            >
              ⬅️
            </button>
            <div>
              <div className="font-semibold leading-5">AI উপসর্গ পরীক্ষা</div>
              <div className="text-[12px] text-blue-100">
                তথ্য শুধুমাত্র সহায়ক; এটি ডাক্তারি পরামর্শ নয়।
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("ভিডিও কল UI (ডেমো)")}
              className="text-xs sm:text-sm px-3 py-1.5 rounded bg-blue-500 hover:bg-blue-600"
            >
              👨‍⚕️ ভিডিও কল
            </button>
            <button
              onClick={() => navigate("/emergency")}
              className="text-xs sm:text-sm px-3 py-1.5 rounded bg-red-600 hover:bg-red-700"
            >
              🚨 জরুরি সাহাযতা
            </button>
          </div>
        </div>
      </header>

      {/* Chat shell */}
      <main className="flex-1 px-3 sm:px-4">
        <div className="mx-auto max-w-3xl my-4 sm:my-6 bg-white/85 backdrop-blur rounded-none sm:rounded-2xl shadow-xl border border-white/30">
          {/* Quick prompts */}
          <div className="px-4 sm:px-5 py-3 bg-gray-50 border-b border-gray-200 rounded-t-2xl">
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((q) => (
                <button
                  key={q}
                  onClick={() => onSend(q)}
                  className="text-sm px-3 py-1 rounded-full bg-white border border-gray-200 hover:bg-gray-100"
                >
                  {q}
                </button>
              ))}
              <button
                onClick={onAttachPick}
                className="ml-auto text-sm px-3 py-1 rounded-full bg-white border border-gray-200 hover:bg-gray-100"
              >
                📎 প্রেসক্রিপশন / রিপোর্ট
              </button>
              <input
                ref={fileInputRef}
                onChange={onAttachFile}
                type="file"
                className="hidden"
              />
            </div>
            {attached && (
              <div className="mt-2 flex items-center gap-3 text-sm">
                <span className="px-2 py-1 rounded bg-blue-50 text-blue-700">
                  {attached.name} ({Math.round(attached.size / 1024)} KB)
                </span>
                <button
                  onClick={onRemoveAttach}
                  className="text-red-600 hover:underline"
                >
                  মুছুন
                </button>
              </div>
            )}
          </div>

          {/* Error toast */}
          {error && (
            <div className="mx-4 mt-3 rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
              {error}
            </div>
          )}

          {/* Messages */}
          <div
            className="px-4 sm:px-5 py-4 bg-gray-50 rounded-b-none sm:rounded-b-2xl overflow-y-auto"
            style={{ height: "min(70vh, 560px)" }}
            aria-live="polite"
          >
            {/* Day groups */}
            {groupByDay.map((day) => (
              <div key={day.label} className="mb-5">
                <DaySeparator label={day.label} />
                {day.items.map((m) =>
                  m.role === "system" ? (
                    <SystemNotice
                      key={m.id}
                      time={formatTime(m.time)}
                      text={m.content}
                    />
                  ) : m.role === "user" ? (
                    <UserBubble
                      key={m.id}
                      time={formatTime(m.time)}
                      text={m.content}
                    />
                  ) : m.type === "cards" ? (
                    <AIBubble key={m.id} time={formatTime(m.time)}>
                      {m.blocks.map((b, i) => (
                        <div key={b?.key || i} className="mb-3 last:mb-0">
                          {b}
                        </div>
                      ))}
                    </AIBubble>
                  ) : (
                    <AIBubble key={m.id} time={formatTime(m.time)}>
                      <p className="text-sm text-gray-800">{m.content}</p>
                    </AIBubble>
                  )
                )}

                {/* Typing */}
                {isTyping && (
                  <AIBubble time="">
                    <TypingDots />
                  </AIBubble>
                )}
              </div>
            ))}

            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-3 bg-white rounded-b-2xl">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={1}
                maxLength={2000}
                placeholder="আপনার উপসর্গ লিখুন…"
                aria-label="উপসর্গ বার্তা"
                className="flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1878A9]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (!sendDisabled) onSend();
                  }
                }}
              />
              <button
                onClick={() => alert("ভয়েস ইনপুট UI (ডেমো)")}
                className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                aria-label="ভয়েস"
                title="ভয়েস"
              >
                🎙️
              </button>
              <button
                onClick={() => onSend()}
                disabled={sendDisabled}
                className={`px-4 py-2 rounded-lg text-white ${
                  sendDisabled
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-700 hover:bg-blue-800"
                }`}
                aria-label="পাঠান"
                title="পাঠান"
              >
                পাঠান
              </button>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-[11px] text-gray-500">
                ⚠️ তীব্র বুকে ব্যথা, ঠান্ডা ঘাম, বা শ্বাসকষ্ট হলে জরুরি সহায়তা
                নিন।
              </p>
              <span className="text-[11px] text-gray-500">
                {charsLeft} অক্ষর বাকি
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white text-center text-sm py-3">
        © ২০২৫ স্বাস্থ্যসহায় | সব তথ্য কেবল সহায়ক হিসেবে প্রদান করা হয়। সঠিক
        চিকিৎসার জন্য সর্বদা নিবন্ধিত চিকিৎসকের পরামর্শ নিন।
      </footer>
    </div>
  );
}

/* ---------------- Presentational Components ---------------- */

function DaySeparator({ label }) {
  return (
    <div className="relative my-3 text-center">
      <span className="inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full border border-gray-200 shadow-sm">
        {label}
      </span>
    </div>
  );
}

function SystemNotice({ text, time }) {
  return (
    <div className="mb-3 flex justify-center">
      <div className="max-w-[90%]">
        <div className="rounded-xl bg-blue-50 border border-blue-100 px-3 py-2 text-xs text-blue-900 text-center shadow-sm">
          {text}
        </div>
        {time && (
          <div className="text-[11px] text-center text-gray-500 mt-1">
            {time}
          </div>
        )}
      </div>
    </div>
  );
}

function UserBubble({ text, time }) {
  return (
    <div className="mb-3 flex justify-end">
      <div className="max-w-[75%] text-right">
        <div className="flex items-start justify-end gap-2">
          <div className="rounded-2xl bg-blue-700 text-white px-4 py-2 shadow text-left">
            <p className="text-sm whitespace-pre-wrap">{text}</p>
          </div>
          <div
            className="h-8 w-8 rounded-full ring-2 ring-blue-500 overflow-hidden select-none flex items-center justify-center bg-blue-100 text-blue-700 font-semibold"
            aria-hidden
          >
            আপনি
          </div>
        </div>
        <div className="text-[11px] text-gray-500 mt-1">{time}</div>
      </div>
    </div>
  );
}

function AIBubble({ children, time }) {
  return (
    <div className="mb-3 flex justify-start">
      <div className="max-w-[80%]">
        <div className="flex items-start gap-2">
          <div
            className="h-8 w-8 rounded-full ring-2 ring-blue-500 overflow-hidden select-none flex items-center justify-center bg-white"
            aria-hidden
            title="AI সহায়তা"
          >
            🩺
          </div>
          <div className="rounded-2xl bg-white border border-gray-200 px-4 py-3 shadow-sm">
            {children}
          </div>
        </div>
        {time && <div className="text-[11px] text-gray-500 mt-1">{time}</div>}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 text-[#1878A9] px-1 py-0.5">
      <span className="animate-bounce">•</span>
      <span className="animate-bounce [animation-delay:0.1s]">•</span>
      <span className="animate-bounce [animation-delay:0.2s]">•</span>
    </div>
  );
}

/* ---------------- Reusable Card Primitives ---------------- */

function Card({ title, children }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {title && (
        <div className="px-3 py-2 border-b border-gray-100 font-medium text-gray-900">
          {title}
        </div>
      )}
      <div className="px-3 py-3">{children}</div>
    </div>
  );
}

function Pill({ children, tone = "default" }) {
  const toneMap = {
    default: "bg-blue-50 text-blue-700",
    warn: "bg-orange-50 text-orange-700",
    danger: "bg-red-50 text-red-700",
    success: "bg-green-50 text-green-700",
  };
  return (
    <span
      className={`text-xs px-2 py-1 rounded-full ${
        toneMap[tone] || toneMap.default
      }`}
    >
      {children}
    </span>
  );
}

/* ---------------- AI Card Builders (Demo UI) ---------------- */

function makeSummaryCard() {
  return (
    <Card key="summary" title="📋 প্রাথমিক বিশ্লেষণ">
      <div className="flex flex-wrap gap-2 mb-2">
        <Pill>সম্ভাব্য: অ্যাসিডিটি</Pill>
        <Pill>সম্ভাব্য: এঞ্জাইনা</Pill>
        <Pill>বিশ্বাসযোগ্যতা: মাঝারি</Pill>
      </div>
      <p className="text-sm text-gray-700">
        আপনার বর্ণনা অনুযায়ী লক্ষণগুলো অ্যাসিডিটি বা এঞ্জাইনার সাথে মিল থাকতে
        পারে। এগুলো সাধারণ দিকনির্দেশনা—সুনির্দিষ্ট রোগনির্ণয়ের জন্য ডাক্তারের
        পরামর্শ নিন।
      </p>
    </Card>
  );
}

function makeRedFlagCard() {
  return (
    <Card key="redflags" title="⚠️ সতর্কতা">
      <div className="text-sm text-red-700">
        তীব্র, চেপে ধরার মতো বুকে ব্যথা, ঠান্ডা ঘাম, বমি বমি ভাব বা শ্বাসকষ্ট
        বাড়লে তাৎক্ষণিকভাবে{" "}
        <span className="font-semibold">জরুরি সাহাযতা</span> নিন।
      </div>
    </Card>
  );
}

function makeNextStepsCard() {
  return (
    <Card key="nextsteps" title="✅ পরবর্তী করণীয়">
      <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
        <li>৫–১০ মিনিট বিশ্রাম নিন, টাইট জামা খুলুন।</li>
        <li>পানি/ORS অল্প অল্প করে পান করুন।</li>
        <li>ব্যথা বাড়লে নড়াচড়া কমান এবং সাহায্য চান।</li>
      </ul>
    </Card>
  );
}

function makeTabbedAdviceCard() {
  return (
    <Card key="tabs" title="Self-care • Tests • Diet">
      <div className="flex flex-wrap gap-2 mb-2">
        <Pill>Overview</Pill>
        <Pill>Tests</Pill>
        <Pill>Self-care</Pill>
        <Pill>Diet</Pill>
      </div>
      <div className="text-sm text-gray-700">
        <p className="mb-1">
          <span className="font-medium">Tests:</span> ECG, Troponin, CBC
          (প্রয়োজনে)।
        </p>
        <p className="mb-1">
          <span className="font-medium">Self-care:</span> বিশ্রাম, হালকা খাবার;
          OTC অ্যান্টাসিড (ডাক্তারের পরামর্শে)।
        </p>
        <p>
          <span className="font-medium">Diet:</span> মশলাদার/তেলচর্বি কম, বেশি
          পানি।
        </p>
      </div>
    </Card>
  );
}

function makeDoctorsCard() {
  return (
    <Card key="doctors" title="নিকটস্থ বিশেষজ্ঞ">
      <ul className="text-sm text-gray-800 space-y-2">
        <li className="p-2 rounded-lg border hover:bg-gray-50">
          <div className="font-medium">ডা. নুসরাত জাহান • কার্ডিওলজি</div>
          <div className="text-gray-600">বিপি হাসপাতাল • ১.৪ কিমি • ⭐ 4.8</div>
          <div className="mt-2 flex gap-2">
            <button className="px-3 py-1 rounded-lg bg-blue-700 text-white hover:bg-blue-800 text-xs">
              বুক করুন
            </button>
            <button className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs">
              ম্যাপ
            </button>
          </div>
        </li>
        <li className="p-2 rounded-lg border hover:bg-gray-50">
          <div className="font-medium">ডা. তানভীর হাসান • মেডিসিন</div>
          <div className="text-gray-600">
            স্কয়ার হাসপাতাল • ২.১ কিমি • ⭐ 4.6
          </div>
          <div className="mt-2 flex gap-2">
            <button className="px-3 py-1 rounded-lg bg-blue-700 text-white hover:bg-blue-800 text-xs">
              বুক করুন
            </button>
            <button className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs">
              ম্যাপ
            </button>
          </div>
        </li>
      </ul>
    </Card>
  );
}

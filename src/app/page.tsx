"use client";

import { useEffect, useRef, useState } from "react";

type Rule = { intent: string; keywords: string[]; reply: string };
type Message = { id: number; sender: "user" | "bot"; text: string };

const rules: Rule[] = [
  {
    intent: "fee",
    keywords: ["fee", "fees", "tuition", "challan", "payment", "scholarship", "cost"],
    reply:
      "Fee details depend on your program and semester. Please check the official UOS website or visit the accounts office for the current fee structure and due dates.",
  },
  {
    intent: "admission",
    keywords: ["admission", "apply", "application", "merit", "eligibility", "enroll", "enrol"],
    reply:
      "Admissions are announced on the official UOS website before each semester. You will need your academic transcripts, CNIC/B-Form and passport-size photographs.",
  },
  {
    intent: "library",
    keywords: ["library", "book", "books", "borrow", "journal", "reading room"],
    reply:
      "The library offers books, journals and a reading area. You need a valid student ID card to borrow books. Hours are generally 8:00 AM to 4:00 PM, Monday to Friday.",
  },
  {
    intent: "hostel",
    keywords: ["hostel", "accommodation", "dorm", "dormitory", "residence", "boarding"],
    reply:
      "Hostel facilities are available for eligible students, subject to seat availability. Please contact the hostel office for the application form, rules and charges.",
  },
  {
    intent: "timing",
    keywords: ["timing", "timings", "time", "schedule", "hours", "open", "close", "office hours"],
    reply:
      "University offices are generally open from 8:00 AM to 4:00 PM, Monday to Friday. Class schedules vary by department, so please check your department notice board.",
  },
];

const GREETING =
  "Hello! Welcome to the UOS Helpdesk Bot. I can help you with fee, admission, timing, library and hostel questions. How can I help you today?";

const FALLBACK =
  "Sorry, I couldn't understand that. Please try asking about fee, admission, timing, library or hostel.";

function getReply(input: string): string {
  const text = input.toLowerCase().replace(/\s+/g, " ").trim();
  for (const rule of rules) {
    if (rule.keywords.some((k) => text.includes(k.toLowerCase()))) {
      return rule.reply;
    }
  }
  return FALLBACK;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, sender: "bot", text: GREETING },
  ]);
  const [input, setInput] = useState("");
  const nextId = useRef(1);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = { id: nextId.current++, sender: "user", text };
    const botMsg: Message = { id: nextId.current++, sender: "bot", text: getReply(text) };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="flex h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-lg">
        <header className="bg-blue-600 px-4 py-3 text-center text-lg font-semibold text-white">
          UOS Helpdesk Bot
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                  m.sender === "user"
                    ? "rounded-br-sm bg-blue-600 text-white"
                    : "rounded-bl-sm border border-gray-200 bg-white text-gray-800"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="flex gap-2 border-t border-gray-200 bg-white p-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder="Type your question..."
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-800 outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSend}
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
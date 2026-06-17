'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function AIChat() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
  console.log("Chat open:", open);
}, [open]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Hello! I am CarePulse AI. How can I help you with patients, appointments, inventory, billing, or reports today?',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  async function sendMessage() {
    if (!message.trim() || loading) return;

    const userMessage = message;

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: userMessage,
      },
    ]);

    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
  messages: [
    ...messages,
    {
      role: 'user',
      content: userMessage,
    },
  ],
}),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            data.reply ||
            'Sorry, I could not generate a response.',
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'An error occurred while contacting CarePulse AI.',
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <>
      {/* FLOATING BUTTON */}
      <button
  onClick={() => setOpen(!open)}
  className="
    fixed bottom-6 right-6 z-[9999]
    h-16 w-16
    rounded-full
    bg-blue-600
    hover:bg-blue-700
    text-white
    shadow-xl
    flex items-center justify-center
    transition
  "
>
  {open ? <X size={28} /> : <Bot size={28} />}
</button>

      {/* CHAT WINDOW */}
      {open && (
        <div
          className="
            fixed bottom-24 right-6 z-[100]
            w-[95vw] sm:w-[420px]
            h-[650px]
            max-h-[80vh]
            bg-white
            border border-slate-200
            rounded-3xl
            shadow-2xl
            overflow-hidden
            flex flex-col
          "
        >
          {/* HEADER */}
          <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles size={20} />
              <div>
                <h3 className="font-bold">
                  CarePulse AI
                </h3>
                <p className="text-xs text-white/80">
                  Healthcare Assistant
                </p>
              </div>
            </div>

            <button onClick={() => setOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* QUICK ACTIONS */}
          <div className="p-3 border-b border-slate-100 flex flex-wrap gap-2">
            <button
              onClick={() =>
                setMessage('Generate a patient summary')
              }
              className="px-3 py-1 rounded-full bg-slate-100 text-sm"
            >
              Patient Summary
            </button>

            <button
              onClick={() =>
                setMessage('Show inventory insights')
              }
              className="px-3 py-1 rounded-full bg-slate-100 text-sm"
            >
              Inventory
            </button>

            <button
              onClick={() =>
                setMessage('Generate a report')
              }
              className="px-3 py-1 rounded-full bg-slate-100 text-sm"
            >
              Reports
            </button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === 'user'
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 px-4 py-3 rounded-2xl text-sm text-slate-500">
                  CarePulse AI is thinking...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div className="border-t border-slate-200 p-4">
            <div className="flex gap-3">
              <input
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage();
                  }
                }}
                placeholder="Ask CarePulse AI..."
                className="
                  flex-1
                  px-4 py-3
                  border border-slate-200
                  rounded-2xl
                  outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

              <button
                onClick={sendMessage}
                disabled={loading}
                className="
                  h-12 w-12
                  rounded-2xl
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  flex items-center justify-center
                "
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
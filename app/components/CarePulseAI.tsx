'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, User } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function CarePulseAI({ onClose }: { onClose?: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am CarePulse AI. How can I help you with patients, appointments, inventory, billing, or reports today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const SUGGESTIONS = ['Patient Summary', 'Inventory Insights', 'Daily Reports'];

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Network error. Unable to reach the database." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 w-[380px] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-[100] animate-in slide-in-from-bottom-10 h-[600px]">
      
      {/* HEADER */}
      <div className="bg-[#5A00E5] p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <Sparkles size={20} />
          <div>
            <h3 className="font-bold text-sm leading-tight">CarePulse AI</h3>
            <p className="text-[10px] text-white/80">Healthcare Assistant</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="hover:bg-white/20 p-1.5 rounded-lg transition">
            <X size={18} />
          </button>
        )}
      </div>

      {/* SUGGESTION CHIPS */}
      <div className="p-3 border-b border-slate-100 flex gap-2 overflow-x-auto scrollbar-hide bg-slate-50">
        {SUGGESTIONS.map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => sendMessage(suggestion)}
            className="whitespace-nowrap px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-full text-xs font-medium transition"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 p-4 overflow-y-auto bg-white space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div 
              className={`max-w-[85%] p-3 text-sm rounded-2xl whitespace-pre-wrap ${
                msg.role === 'user' 
                  ? 'bg-[#5A00E5] text-white rounded-tr-sm' 
                  : 'bg-slate-100 text-slate-700 rounded-tl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start">
            <div className="bg-slate-100 text-slate-500 p-3 rounded-2xl rounded-tl-sm text-sm flex gap-1 items-center">
              <span className="animate-bounce">•</span>
              <span className="animate-bounce delay-100">•</span>
              <span className="animate-bounce delay-200">•</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <form 
          onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask CarePulse AI..."
            className="flex-1 px-4 py-3 border border-slate-200 rounded-full text-sm outline-none focus:border-[#5A00E5] focus:ring-1 focus:ring-[#5A00E5] transition"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-11 w-11 bg-[#5A00E5] hover:bg-[#4A00C5] disabled:opacity-50 text-white rounded-full flex items-center justify-center transition shadow-md"
          >
            <Send size={18} className="ml-1" />
          </button>
        </form>
      </div>

    </div>
  );
}
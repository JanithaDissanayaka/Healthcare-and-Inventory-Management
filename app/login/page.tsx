"use client";

import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  HeartPulse, 
  Mail, 
  Lock, 
  ShieldCheck, 
  ArrowRight,
  Loader2
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);

    // Simulate a brief network request for premium UX feedback
    setTimeout(() => {
      // Set auth cookie
      document.cookie = "auth-token=loggedIn; path=/";

      // Redirect to dashboard
      router.push("/");
    }, 800);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950 p-4 font-sans relative overflow-hidden">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-emerald-900/20 w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">

        {/* Brand Header */}
        <div className="text-center mb-10">
          <div className="mx-auto h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-5 border border-emerald-100 shadow-inner">
            <HeartPulse className="text-emerald-600" size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">CarePulse</h1>
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-1.5">
            Healthcare & Inventory
          </p>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-slate-800">
              Welcome back
            </h2>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Authenticate to access the clinical dashboard
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form className="space-y-5" onSubmit={handleLogin}>
          
          {/* Email Input */}
          <div className="group">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-emerald-600 transition-colors">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                defaultValue="admin@carepulse.health"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-emerald-300 hover:bg-white text-sm font-medium text-slate-900 outline-none transition-all focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white shadow-sm"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="group">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider group-focus-within:text-emerald-600 transition-colors">
                Password
              </label>
              <a href="#" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                Forgot?
              </a>
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                defaultValue="********"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-emerald-300 hover:bg-white text-sm font-medium text-slate-900 outline-none transition-all focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white shadow-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl mt-4 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isAuthenticating ? (
              <>
                <Loader2 size={18} className="animate-spin text-emerald-400" />
                Authenticating...
              </>
            ) : (
              <>
                Secure Sign In <ArrowRight size={18} className="text-slate-400" />
              </>
            )}
          </button>
        </form>

        {/* Security Footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400">
          <ShieldCheck size={14} className="text-emerald-500" />
          Protected by 256-bit AES encryption
        </div>
      </div>
    </main>
  );
}
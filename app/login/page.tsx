import React from 'react';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      {/* Login Card */}
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-700">Care</h1>
          <p className="text-sm text-gray-500">Healthcare & Inventory Management</p>
          <h2 className="text-xl font-semibold text-gray-800 mt-6">Welcome back</h2>
          <p className="text-gray-500 text-sm">Sign in to your account to continue</p>
        </div>

        {/* Login Form */}
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input
              type="email"
              defaultValue="admin@carepulse.health"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              defaultValue="********"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-600">
              <input type="checkbox" className="mr-2 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
              Remember me
            </label>
            <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
          >
            Sign in to CarePulse →
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-400">
          Protected by 256-bit encryption
        </div>
      </div>
    </main>
  );
}
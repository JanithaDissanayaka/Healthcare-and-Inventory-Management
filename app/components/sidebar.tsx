'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Data configuration
const navSections = [
  {
    category: "MAIN",
    items: [{ name: "Dashboard", href: "/" }],
  },
  {
    category: "CLINICAL",
    items: [
      { name: "Patients", href: "/patients" },
      { name: "Doctors", href: "/doctors" },
      { name: "Appointments", href: "/appointments" },
      { name: "Treatments", href: "/treatments" },
      { name: "Prescriptions", href: "/prescriptions" },
    ],
  },
  {
    category: "OPERATIONS",
    items: [
      { name: "Inventory", href: "/inventory" },
      { name: "Suppliers", href: "/suppliers" },
      { name: "Billing", href: "/billing" },
      { name: "Reports", href: "/reports" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  // Helper to render icons based on name
  const renderIcon = (name: string, isActive: boolean) => {
    const iconClass = isActive ? "h-5 w-5 mr-3 text-emerald-950" : "h-5 w-5 mr-3 text-emerald-500";
    
    // Simple SVG Switch logic
    switch (name) {
      case "Patients": return <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
      case "Dashboard": return <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" /></svg>;
      case "Appointments": return <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
      case "Treatments": return <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
      case "Prescriptions": return <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1H9L8 4zm5.5 5.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>;
      case "Inventory": return <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
      case "Suppliers": return <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      default: return <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 6h16M4 12h16M4 18h7" /></svg>;
    }
  };

  return (
    <aside className="w-64 min-h-screen flex flex-col bg-slate-950 border-r border-slate-800 text-sm">
      
      {/* Branding */}
      <div className="flex items-center gap-3 p-6 pb-2">
        <div className="h-10 w-10 bg-emerald-500 rounded-lg flex items-center justify-center">
          <svg className="h-6 w-6 text-emerald-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">CarePulse</h1>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            System Online
          </div>
        </div>
      </div>

      <div className="border-b border-slate-800 mx-6 mb-6"></div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-6 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.category}>
            <h3 className="px-3 mb-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              {section.category}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`group flex items-center px-3 py-2.5 rounded-lg transition-colors
                        ${isActive 
                          ? 'bg-emerald-600 text-emerald-950 font-semibold' 
                          : 'text-gray-400 hover:bg-slate-900 hover:text-white'
                        }`}
                    >
                      {renderIcon(item.name, isActive)}
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ml-2
                          ${item.badgeColor === "teal" ? 'bg-emerald-400/20 text-emerald-300' : 'bg-red-500/10 text-red-400'}`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-b border-slate-800 mx-6 mt-6"></div>

      {/* Footer */}
      <div className="p-6 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-emerald-950 text-sm">
          DR
        </div>
        <div>
          <div className="font-semibold text-white">Dr. Admin</div>
          <div className="text-xs text-gray-500">System Administrator</div>
        </div>
      </div>
    </aside>
  );
}
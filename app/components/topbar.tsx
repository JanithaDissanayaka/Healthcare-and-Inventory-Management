'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import React, { useEffect, useState, useRef } from 'react';

import {
  Search,
  Bell,
  Plus,
  ChevronRight,
  Inbox,
} from 'lucide-react';

type NotificationItem = {
  ID: number;
  TITLE: string;
  MESSAGE: string;
  STATUS: string;
};

export default function Topbar() {
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Live Notification States
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Configuration map matching pathname routes
  const pageConfig: Record<
    string,
    { title: string; breadcrumb: string; btnText: string; btnHref: string; }
  > = {
    '/': { title: 'Dashboard', breadcrumb: 'CarePulse / Overview', btnText: 'Add Patient', btnHref: '/patients/add' },
    '/dashboard': { title: 'Dashboard', breadcrumb: 'CarePulse / Overview', btnText: 'Add Patient', btnHref: '/patients/add' },
    '/patients': { title: 'Patients', breadcrumb: 'CarePulse / Patients', btnText: 'New Patient', btnHref: '/patients/add' },
    '/doctors': { title: 'Doctors', breadcrumb: 'CarePulse / Doctors', btnText: 'Add Doctor', btnHref: '/doctors/add' },
    '/appointments': { title: 'Appointments', breadcrumb: 'CarePulse / Appointments', btnText: 'New Appointment', btnHref: '/appointments/add' },
    '/inventory': { title: 'Inventory', breadcrumb: 'CarePulse / Inventory', btnText: 'Add Item', btnHref: '/inventory/add' },
    '/suppliers': { title: 'Suppliers', breadcrumb: 'CarePulse / Suppliers', btnText: 'Add Supplier', btnHref: '/suppliers/add' },
    '/billing': { title: 'Billing', breadcrumb: 'CarePulse / Billing', btnText: 'New Invoice', btnHref: '/billing/add' },
    '/reports': { title: 'Reports', breadcrumb: 'CarePulse / Reports', btnText: 'Generate Report', btnHref: '/reports/add' },
  };

  const current = pageConfig[pathname] || pageConfig['/'];

  // Fetch real alerts on load
  useEffect(() => {
    async function getAlerts() {
      try {
        const res = await fetch('/api/notifications');
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
        }
      } catch (error) {
        console.error("Failed to load notifications", error);
      }
    }
    getAlerts();

    // Close menu when clicking outside component area
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClearCount = () => {
    setIsOpen(!isOpen);
    setUnreadCount(0); // Soft clear badge count on notification view toggle
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200">
      <div className="px-6 lg:px-8 py-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          
          {/* LEFT SECTION */}
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <span>CarePulse</span>
              <ChevronRight size={14} />
              <span className="text-slate-700 font-medium">{current.title}</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">{current.title}</h1>
            <p className="text-slate-500 mt-1">Manage your healthcare system efficiently.</p>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-4">
            
            {/* INPUT SEARCH */}
            <div className="relative hidden md:block">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Search..."
                className="w-[260px] pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>

            {/* NOTIFICATION HUB */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleClearCount}
                className="relative h-12 w-12 rounded-2xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition"
              >
                <Bell size={20} className="text-slate-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
                )}
              </button>

              {/* DROPDOWN BOX MODAL */}
              {isOpen && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <h3 className="font-bold text-slate-900">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-slate-400 gap-2">
                        <Inbox size={24} />
                        <p className="text-sm">No new requests or alerts</p>
                      </div>
                    ) : (
                      notifications.map((item) => (
                        <div key={item.ID} className="border-b border-slate-50 px-4 py-3 last:border-0 hover:bg-slate-50 transition rounded-xl">
                          <p className="text-xs font-bold text-emerald-600 mb-0.5">{item.TITLE}</p>
                          <p className="text-sm text-slate-700 font-medium leading-relaxed">{item.MESSAGE}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ACTION REDIRECT BUTTON */}
            <Link
              href={current.btnHref}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-5 py-3 rounded-2xl font-semibold shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02]"
            >
              <Plus size={18} />
              {current.btnText}
            </Link>

          </div>
        </div>
      </div>
    </header>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarDays,
  Boxes,
  Truck,
  CreditCard,
  FileBarChart2,
  ChevronRight,
  HeartPulse,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  
  // Dynamic metrics state hooks
  const [appointmentBadge, setAppointmentBadge] = useState<string>('');
  const [inventoryBadge, setInventoryBadge] = useState<string>('');
  const [systemHealth, setSystemHealth] = useState<string>('Initializing systems...');
  const [performance, setPerformance] = useState<number>(92);

  // Fetch dynamic database flags on component mount
  useEffect(() => {
    async function fetchBadges() {
      try {
        const res = await fetch('/api/sidebar-metrics');
        if (res.ok) {
          const data = await res.json();
          setAppointmentBadge(data.appointmentsCount > 0 ? String(data.appointmentsCount) : '');
          setInventoryBadge(data.lowStockCount > 0 ? String(data.lowStockCount) : '');
          setSystemHealth(data.systemHealth);
          setPerformance(data.performance);
        }
      } catch (error) {
        console.error("Error reading sidebar badge statuses:", error);
        setSystemHealth("Network Error");
        setPerformance(0);
      }
    }
    fetchBadges();
  }, [pathname]);

  const handleLogout = () => {
    const doubleCheck = confirm("Are you sure you want to log out of CarePulse?");
    if (doubleCheck) {
      // Clear local session storage keys here if applicable
      router.push('/login'); 
    }
  };

  const handleOpenSettings = () => {
    alert("CarePulse Dental System Configuration:\n\nOracle Container Target: Localhost\nPort: 1521\nSchema Context: XEPDB1\n\nProfile modification tools are available inside Doctor/User admin modules.");
  };

  const navSections = [
    {
      category: 'MAIN',
      items: [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
      ],
    },
    {
      category: 'CLINICAL',
      items: [
        { name: 'Patients', href: '/patients', icon: Users },
        { name: 'Doctors', href: '/doctors', icon: Stethoscope },
        { name: 'Appointments', href: '/appointments', icon: CalendarDays, badge: appointmentBadge, danger: false },
      ],
    },
    {
      category: 'OPERATIONS',
      items: [
        { name: 'Inventory', href: '/inventory', icon: Boxes, badge: inventoryBadge, danger: true },
        { name: 'Suppliers', href: '/suppliers', icon: Truck },
        { name: 'Billing', href: '/billing', icon: CreditCard },
        { name: 'Reports', href: '/reports', icon: FileBarChart2 },
      ],
    },
  ];

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#020817] border-b border-slate-800 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HeartPulse className="text-emerald-400" size={24} />
          <h1 className="text-white font-bold text-lg">CarePulse</h1>
        </div>
        <button onClick={() => setOpen(true)} className="text-white">
          <Menu size={28} />
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      {open && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-50" onClick={() => setOpen(false)} />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside
        className={`
          fixed top-0 left-0 z-[60] w-[290px] h-screen bg-[#020817] border-r border-slate-800
          flex flex-col transition-transform duration-300
          lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 lg:hidden border-b border-slate-800">
          <h2 className="text-white text-xl font-bold">CarePulse</h2>
          <button onClick={() => setOpen(false)} className="text-white">
            <X size={26} />
          </button>
        </div>

        {/* SCROLLABLE LINKS CONTENT */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          
          {/* BRAND GRADIENT BANNER */}
          <div className="p-6">
            <div className="bg-blue-600 rounded-3xl p-5 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center">
                  <HeartPulse className="text-white" size={28} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">CarePulse</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`h-2 w-2 rounded-full animate-pulse ${performance > 0 ? 'bg-green-300' : 'bg-red-500'}`}></div>
                    <span className="text-sm text-white/80">System Connected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DYNAMIC NAVIGATION GROUPS */}
          <nav className="px-4 space-y-8">
            {navSections.map((section) => (
              <div key={section.category}>
                <div className="px-4 mb-3 text-[11px] font-bold tracking-[0.2em] text-slate-500">
                  {section.category}
                </div>

                <ul className="space-y-2">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={`
                            group flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all duration-300
                            ${isActive
                                  ? 'bg-blue-600 text-white border-transparent shadow-md'
                                  : 'border-transparent text-slate-400 hover:bg-slate-900 hover:border-slate-800 hover:text-white'
                            }
                          `}
                        >
                          <div
                            className={`
                              h-11 w-11 rounded-xl flex items-center justify-center
                              ${isActive ? 'bg-white/20' : 'bg-slate-900 group-hover:bg-slate-800'}
                            `}
                          >
                            <Icon size={20} />
                          </div>

                          <div className="flex-1 font-medium">{item.name}</div>

                          {item.badge ? (
                            <div
                              className={`
                                min-w-[24px] h-6 px-2 rounded-full text-xs font-bold flex items-center justify-center
                                ${item.danger
                                  ? 'bg-red-500/20 text-red-400 animate-pulse'
                                  : 'bg-emerald-500/20 text-emerald-400'
                                }
                              `}
                            >
                              {item.badge}
                            </div>
                          ) : (
                            <ChevronRight
                              size={18}
                              className={isActive ? 'text-white' : 'text-slate-600 group-hover:text-slate-400'}
                            />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* PERFORMANCE MONITOR & SYSTEM HEALTH */}
          <div className="p-6">
            <div className="mb-6 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-800 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-semibold">System Health</h3>
                  <p className={`text-sm mt-1 font-medium ${performance > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {systemHealth}
                  </p>
                </div>
                <div className={`h-3 w-3 rounded-full animate-pulse ${performance > 0 ? 'bg-green-400' : 'bg-red-500'}`}></div>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${performance}%` }}
                ></div>
              </div>
              <div className="text-xs text-slate-400 mt-2">
                {performance > 0 ? `${performance}% Oracle Container Response` : "Oracle Container Disconnected"}
              </div>
            </div>

            {/* ADMIN MODULE CONTROL SECTION */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  DR
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">Dr. Admin</h3>
                  <p className="text-sm text-slate-400 mt-1">System Administrator</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <button 
                  onClick={handleOpenSettings}
                  className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 transition text-slate-300 text-sm font-medium"
                >
                  <Settings size={16} />
                  Settings
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 transition text-red-400 text-sm font-medium"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>

          </div>
        </div>
      </aside>
    </>
  );
}
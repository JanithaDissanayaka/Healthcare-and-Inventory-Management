'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarDays,
  ClipboardPlus,
  Pill,
  Boxes,
  Truck,
  CreditCard,
  FileBarChart2,
  ChevronRight,
  HeartPulse,
  Settings,
  LogOut,
} from 'lucide-react';

const navSections = [
  {
    category: 'MAIN',
    items: [
      {
        name: 'Dashboard',
        href: '/',
        icon: LayoutDashboard,
      },
    ],
  },

  {
    category: 'CLINICAL',
    items: [
      {
        name: 'Patients',
        href: '/patients',
        icon: Users,
      },

      {
        name: 'Doctors',
        href: '/doctors',
        icon: Stethoscope,
      },

      {
        name: 'Appointments',
        href: '/appointments',
        icon: CalendarDays,
        badge: '',
      },

      
    ],
  },

  {
    category: 'OPERATIONS',
    items: [
      {
        name: 'Inventory',
        href: '/inventory',
        icon: Boxes,
        badge: '',
        danger: true,
      },

      {
        name: 'Suppliers',
        href: '/suppliers',
        icon: Truck,
      },

      {
        name: 'Billing',
        href: '/billing',
        icon: CreditCard,
      },

      {
        name: 'Reports',
        href: '/reports',
        icon: FileBarChart2,
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* SIDEBAR */}
      <aside
        className="
          hidden lg:flex
          w-[290px]
          min-h-screen
          bg-[#020817]
          border-r border-slate-800
          flex-col
          justify-between
          fixed left-0 top-0
          z-50
        "
      >
        {/* TOP */}
        <div>
          {/* LOGO */}
          <div className="p-6">
            <div
              className="
                bg-gradient-to-br
                from-emerald-500
                to-cyan-500
                rounded-3xl
                p-5
                shadow-xl
                shadow-emerald-500/10
              "
            >
              <div className="flex items-center gap-4">
                <div
                  className="
                    h-14 w-14
                    rounded-2xl
                    bg-white/20
                    backdrop-blur-xl
                    flex items-center justify-center
                  "
                >
                  <HeartPulse className="text-white" size={28} />
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-white">
                    CarePulse
                  </h1>

                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-2 w-2 rounded-full bg-green-300 animate-pulse"></div>

                    <span className="text-sm text-white/80">
                      Healthcare System Online
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SEARCH */}
          <div className="px-6 mb-6">
            <div
              className="
                bg-slate-900
                border border-slate-800
                rounded-2xl
                px-4 py-3
                flex items-center gap-3
              "
            >
              <svg
                className="h-5 w-5 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35m1.85-5.65a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                />
              </svg>

              <input
                type="text"
                placeholder="Search..."
                className="
                  bg-transparent
                  outline-none
                  text-sm
                  text-white
                  placeholder:text-slate-500
                  w-full
                "
              />
            </div>
          </div>

          {/* NAVIGATION */}
          <nav className="px-4 space-y-8 overflow-y-auto">
            {navSections.map((section) => (
              <div key={section.category}>
                <div
                  className="
                    px-4 mb-3
                    text-[11px]
                    font-bold
                    tracking-[0.2em]
                    text-slate-500
                  "
                >
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
                          className={`
                            group
                            flex items-center
                            gap-4
                            px-4 py-3.5
                            rounded-2xl
                            transition-all duration-300
                            border

                            ${
                              isActive
                                ? `
                                  bg-gradient-to-r
                                  from-emerald-500
                                  to-cyan-500
                                  text-white
                                  border-transparent
                                  shadow-lg
                                  shadow-emerald-500/20
                                `
                                : `
                                  border-transparent
                                  text-slate-400
                                  hover:bg-slate-900
                                  hover:border-slate-800
                                  hover:text-white
                                `
                            }
                          `}
                        >
                          <div
                            className={`
                              h-11 w-11
                              rounded-xl
                              flex items-center justify-center
                              transition-all

                              ${
                                isActive
                                  ? 'bg-white/20'
                                  : 'bg-slate-900 group-hover:bg-slate-800'
                              }
                            `}
                          >
                            <Icon size={20} />
                          </div>

                          <div className="flex-1">
                            <div className="font-medium">
                              {item.name}
                            </div>
                          </div>

                          {/* BADGE */}
                          {item.badge && (
                            <div
                              className={`
                                min-w-[24px]
                                h-6
                                px-2
                                rounded-full
                                text-xs
                                font-bold
                                flex items-center justify-center

                                ${
                                  item.danger
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'bg-white/20 text-white'
                                }
                              `}
                            >
                              {item.badge}
                            </div>
                          )}

                          {!item.badge && (
                            <ChevronRight
                              size={18}
                              className={`
                                transition-transform
                                ${
                                  isActive
                                    ? 'text-white'
                                    : 'text-slate-600 group-hover:text-slate-400'
                                }
                              `}
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
        </div>

        {/* BOTTOM */}
        <div className="p-6">
          {/* SYSTEM STATUS */}
          <div
            className="
              mb-6
              rounded-3xl
              bg-gradient-to-r
              from-slate-900
              to-slate-800
              border border-slate-800
              p-5
            "
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold">
                  System Health
                </h3>

                <p className="text-slate-400 text-sm mt-1">
                  All services operational
                </p>
              </div>

              <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse"></div>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
              <div className="w-[92%] h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"></div>
            </div>

            <div className="text-xs text-slate-400 mt-2">
              92% server performance
            </div>
          </div>

          {/* PROFILE */}
          <div
            className="
              bg-slate-900
              border border-slate-800
              rounded-3xl
              p-4
            "
          >
            <div className="flex items-center gap-4">
              <div
                className="
                  h-14 w-14
                  rounded-2xl
                  bg-gradient-to-br
                  from-emerald-500
                  to-cyan-500
                  flex items-center justify-center
                  text-white
                  font-bold
                  text-lg
                "
              >
                DR
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-white">
                  Dr. Admin
                </h3>

                <p className="text-sm text-slate-400 mt-1">
                  System Administrator
                </p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="grid grid-cols-2 gap-3 mt-5">
              <button
                className="
                  flex items-center justify-center gap-2
                  py-3
                  rounded-2xl
                  bg-slate-800
                  hover:bg-slate-700
                  transition
                  text-slate-300
                  text-sm
                  font-medium
                "
              >
                <Settings size={16} />
                Settings
              </button>

              <button
                className="
                  flex items-center justify-center gap-2
                  py-3
                  rounded-2xl
                  bg-red-500/10
                  hover:bg-red-500/20
                  transition
                  text-red-400
                  text-sm
                  font-medium
                "
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT FIX */}
      <main className="lg:ml-[290px] min-h-screen bg-slate-50">
        {/* Your dashboard/pages render here */}
      </main>
    </>
  );
}
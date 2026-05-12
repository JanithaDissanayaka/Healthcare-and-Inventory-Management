'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

import {
  Search,
  Bell,
  Plus,
  ChevronRight,
} from 'lucide-react';

export default function Topbar() {
  const pathname = usePathname();

  const pageConfig: Record<
    string,
    {
      title: string;
      breadcrumb: string;
      btnText: string;
      btnHref: string;
    }
  > = {
    '/': {
      title: 'Dashboard',
      breadcrumb: 'CarePulse / Overview',
      btnText: 'Add Patient',
      btnHref: '/patients/add',
    },

    '/dashboard': {
      title: 'Dashboard',
      breadcrumb: 'CarePulse / Overview',
      btnText: 'Add Patient',
      btnHref: '/patients/add',
    },

    '/patients': {
      title: 'Patients',
      breadcrumb: 'CarePulse / Patients',
      btnText: 'New Patient',
      btnHref: '/patients/add',
    },

    '/doctors': {
      title: 'Doctors',
      breadcrumb: 'CarePulse / Doctors',
      btnText: 'Add Doctor',
      btnHref: '/doctors/add',
    },

    '/appointments': {
      title: 'Appointments',
      breadcrumb: 'CarePulse / Appointments',
      btnText: 'New Appointment',
      btnHref: '/appointments/add',
    },

    '/prescriptions': {
      title: 'Prescriptions',
      breadcrumb: 'CarePulse / Prescriptions',
      btnText: 'New Prescription',
      btnHref: '/prescriptions/add',
    },

    '/inventory': {
      title: 'Inventory',
      breadcrumb: 'CarePulse / Inventory',
      btnText: 'Add Item',
      btnHref: '/inventory/add',
    },

    '/suppliers': {
      title: 'Suppliers',
      breadcrumb: 'CarePulse / Suppliers',
      btnText: 'Add Supplier',
      btnHref: '/suppliers/add',
    },

    '/billing': {
      title: 'Billing',
      breadcrumb: 'CarePulse / Billing',
      btnText: 'New Invoice',
      btnHref: '/billing/add',
    },

    '/reports': {
      title: 'Reports',
      breadcrumb: 'CarePulse / Reports',
      btnText: 'Generate Report',
      btnHref: '/reports/add',
    },
  };

  const current =
    pageConfig[pathname] || pageConfig['/'];

  return (
    <header
      className="
        sticky top-0 z-40
        bg-white/80
        backdrop-blur-xl
        border-b border-slate-200
      "
    >
      <div className="px-6 lg:px-8 py-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* LEFT */}
          <div>
            {/* BREADCRUMB */}
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <span>CarePulse</span>

              <ChevronRight size={14} />

              <span className="text-slate-700 font-medium">
                {current.title}
              </span>
            </div>

            {/* TITLE */}
            <h1 className="text-3xl font-bold text-slate-900">
              {current.title}
            </h1>

            <p className="text-slate-500 mt-1">
              Manage your healthcare system efficiently.
            </p>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            {/* SEARCH */}
            <div className="relative hidden md:block">
              <Search
                size={18}
                className="
                  absolute
                  left-4 top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="search"
                placeholder="Search..."
                className="
                  w-[260px]
                  pl-11 pr-4 py-3
                  rounded-2xl
                  border border-slate-200
                  bg-slate-50
                  text-sm
                  outline-none
                  focus:ring-2
                  focus:ring-emerald-500
                  focus:border-transparent
                  transition
                "
              />
            </div>

            {/* NOTIFICATION */}
            <button
              className="
                relative
                h-12 w-12
                rounded-2xl
                border border-slate-200
                bg-white
                flex items-center justify-center
                hover:bg-slate-50
                transition
              "
            >
              <Bell
                size={20}
                className="text-slate-600"
              />

              <span
                className="
                  absolute top-2 right-2
                  h-2.5 w-2.5
                  rounded-full
                  bg-red-500
                "
              ></span>
            </button>

            {/* BUTTON */}
            <Link
              href={current.btnHref}
              className="
                inline-flex items-center gap-2
                bg-gradient-to-r
                from-emerald-500
                to-cyan-500
                hover:from-emerald-600
                hover:to-cyan-600
                text-white
                px-5 py-3
                rounded-2xl
                font-semibold
                shadow-lg
                shadow-emerald-500/20
                transition-all duration-300
                hover:scale-[1.02]
              "
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
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link'; // 1. Import Link

export default function Topbar() {
  const pathname = usePathname();

  // 1. Added 'btnHref' to each configuration
  const pageConfig: Record<string, { title: string; breadcrumb: string; btnText: string; btnHref: string }> = {
    '/dashboard': { 
      title: 'Dashboard', 
      breadcrumb: 'CarePulse / Overview', 
      btnText: '+ New Patient', 
      btnHref: '/patients/add' 
    },
    '/doctors': { 
      title: 'Doctors', 
      breadcrumb: 'CarePulse / Doctors', 
      btnText: '+ Add Doctor', 
      btnHref: '/doctors/add' 
    },
    '/appointments': { 
      title: 'Appointments', 
      breadcrumb: 'CarePulse / Appointments', 
      btnText: '+ New Appointment', 
      btnHref: '/appointments/new' 
    },
    '/prescriptions': { 
      title: 'Prescriptions', 
      breadcrumb: 'CarePulse / Prescriptions', 
      btnText: '+ New Prescription', 
      btnHref: '/prescriptions/new' 
    },
    '/inventory': { 
      title: 'Inventory', 
      breadcrumb: 'CarePulse / Inventory', 
      btnText: '+ Add Item', 
      btnHref: '/inventory/add' 
    },
    '/suppliers': { 
      title: 'Suppliers', 
      breadcrumb: 'CarePulse / Suppliers', 
      btnText: '+ Add Supplier', 
      btnHref: '/suppliers/add' 
    },
    '/billing': { 
      title: 'Billing', 
      breadcrumb: 'CarePulse / Billing', 
      btnText: '+ New Invoice', 
      btnHref: '/billing/add' 
    },
    '/reports': { 
      title: 'Reports', 
      breadcrumb: 'CarePulse / Reports', 
      btnText: '+ Generate Report', 
      btnHref: '/reports/add' 
    },
  };

  const current = pageConfig[pathname] || pageConfig['/dashboard'];

  return (
    <header className="flex justify-between items-center mb-8 bg-white p-6 border-b border-slate-200">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{current.title}</h1>
        <p className="text-sm text-slate-500">{current.breadcrumb}</p>
      </div>

      <div className="flex gap-4 items-center">
        {/* ... Search and Bell icon remain the same ... */}
        <div className="relative">
          <input type="search" placeholder="Search..." className="pl-4 pr-10 py-2 border border-slate-300 rounded-lg w-64 focus:ring-2 focus:ring-emerald-500 outline-none" />
          <svg className="absolute right-3 top-2.5 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <button className="p-2 border border-slate-300 rounded-lg text-slate-500 hover:bg-slate-50">
           <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        {/* 2. Changed <button> to <Link> */}
        <Link 
          href={current.btnHref} 
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
        >
          {current.btnText}
        </Link>
      </div>
    </header>
  );
}
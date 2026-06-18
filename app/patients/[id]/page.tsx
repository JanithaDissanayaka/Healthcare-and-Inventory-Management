'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  User, 
  CalendarDays, 
  Phone, 
  MapPin, 
  VenusAndMars,
  ActivitySquare,
  ShieldCheck
} from 'lucide-react';

type Patient = {
  PATIENT_ID: number;
  NAME: string;
  DOB: string;
  GENDER: string;
  PHONE: string;
  ADDRESS: string;
};

export default function PatientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  // Safely unwrap the params promise for Next.js app router
  const unwrappedParams = React.use(params);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await fetch(`/api/patients/${unwrappedParams.id}`);
        const data = await res.json();
        setPatient(data);
      } catch (error) {
        console.error("Failed to fetch patient", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [unwrappedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-black text-slate-900">Patient Not Found</h2>
        <Link href="/patients" className="mt-4 text-emerald-600 font-bold hover:underline">Return to Directory</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-8">
      
      <div className="mb-6">
        <Link href="/patients" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">
          <ArrowLeft size={16} /> Back to Directory
        </Link>
      </div>

      <div className="max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* PROFILE HEADER */}
        <div className="bg-slate-900 px-8 py-8 flex items-center gap-6">
          <div className="h-24 w-24 rounded-3xl bg-emerald-500 flex items-center justify-center text-white text-4xl font-black shadow-lg border-4 border-slate-800">
            {patient.NAME.charAt(0)}
          </div>
          <div className="text-white">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black">{patient.NAME}</h1>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1">
                <ShieldCheck size={14} /> Active
              </span>
            </div>
            <p className="text-slate-400 font-mono mt-1 text-sm">Patient ID: #{patient.PATIENT_ID}</p>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="p-8">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
            <ActivitySquare size={18} /> Demographics & Contact
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm text-cyan-600"><User size={20} /></div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</p>
                <p className="text-base font-bold text-slate-900 mt-1">{patient.NAME}</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm text-amber-600"><CalendarDays size={20} /></div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date of Birth</p>
                <p className="text-base font-bold text-slate-900 mt-1">{patient.DOB?.split('T')[0]}</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm text-pink-600"><VenusAndMars size={20} /></div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gender</p>
                <p className="text-base font-bold text-slate-900 mt-1">{patient.GENDER}</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm text-emerald-600"><Phone size={20} /></div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</p>
                <p className="text-base font-bold text-slate-900 mt-1">{patient.PHONE}</p>
              </div>
            </div>

            <div className="md:col-span-2 p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600"><MapPin size={20} /></div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Address</p>
                <p className="text-base font-bold text-slate-900 mt-1">{patient.ADDRESS}</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
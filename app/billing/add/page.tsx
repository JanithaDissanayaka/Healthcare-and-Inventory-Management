'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Wallet,
  User,
  CalendarDays,
  Plus,
  Trash2,
  Save,
  Receipt,
  Scissors, // Used as a proxy for clinical dental procedures
} from 'lucide-react';

type InvoiceItem = {
  description: string;
  amount: number;
};

type PatientEntry = {
  PATIENT_ID: number;
  NAME: string;
};

// Preset catalog of common Sri Lankan Dental Hospital procedures for quick reference
const DENTAL_PROCEDURES = [
  { label: "Dental Consultation & Diagnostics", price: 1500 },
  { label: "Scaling & Polishing (Full Mouth)", price: 3500 },
  { label: "Composite (Tooth Colored) Filling", price: 4000 },
  { label: "Root Canal Therapy (RCT) - Anterior", price: 12000 },
  { label: "Simple Tooth Extraction", price: 2500 },
  { label: "Surgical Extraction (Impacted Wisdom Tooth)", price: 18000 },
  { label: "Digital Dental X-Ray (Periapical/OPG)", price: 12000 },
  { label: "Orthodontic (Braces) Monthly Adjustment", price: 5000 },
  { label: "Acrylic Partial Denture", price: 8000 },
];

export default function AddBillingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [patientList, setPatientList] = useState<PatientEntry[]>([]);

  // Form Fields State
  const [patient, setPatient] = useState('');
  const [billingDate, setBillingDate] = useState('');
  const [status, setStatus] = useState('Pending');
  
  // Set the first item to a standard dental consultation checkup as a smart default
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: 'Dental Consultation & Diagnostics', amount: 1500 }
  ]);

  // Fetch registered patients for the selection box dropdown list
  useEffect(() => {
    async function loadPatients() {
      try {
        const res = await fetch('/api/patients');
        if (res.ok) {
          const data = await res.json();
          setPatientList(data.patients || []);
        }
      } catch (err) {
        console.error("Could not populate patient selections:", err);
      }
    }
    loadPatients();
  }, []);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [items]);

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      [field]: field === 'amount' ? Number(value) : value,
    };
    setItems(updated);
  };

  // Helper to auto-fill description and price if they choose a common preset option
  const handleSelectPreset = (index: number, procedureLabel: string) => {
    const found = DENTAL_PROCEDURES.find(p => p.label === procedureLabel);
    if (found) {
      const updated = [...items];
      updated[index] = {
        description: found.label,
        amount: found.price
      };
      setItems(updated);
    }
  };

  const addItem = () => setItems([...items, { description: '', amount: 0 }]);
  const removeItem = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient || !billingDate) {
      alert("Please fill in patient name and billing dates before processing.");
      return;
    }
    setLoading(true);

    try {
      const payload = { patient, billingDate, status, total, items };
      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('Dental Invoice created successfully inside Oracle database');
        router.push('/billing');
      } else {
        const err = await res.json();
        alert(`Failed: ${err.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('Error creating dental invoice record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm max-w-6xl mx-auto overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-white border-b border-slate-200 px-8 py-7 relative">
          <div className="absolute right-10 top-6 h-24 w-24 rounded-full bg-cyan-50"></div>
          <div className="relative flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center">
              <Receipt className="text-cyan-600" size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">CarePulse Dental Billing</h2>
              <p className="text-slate-500 mt-2 text-base">Generate itemized invoices for dental treatments, surgeries, and orthodontic procedures.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 lg:p-10 space-y-10">
          
          {/* PATIENT LOOKUPS */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <User size={18} className="text-cyan-600" />
              <h3 className="text-lg font-bold text-slate-900">Patient Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Select Patient</label>
                <select
                  value={patient}
                  onChange={(e) => setPatient(e.target.value)}
                  required
                  className="w-full px-4 py-4 rounded-2xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900"
                >
                  <option value="">-- Choose Registered Patient --</option>
                  {patientList.map(p => (
                    <option key={p.PATIENT_ID} value={p.PATIENT_ID}>{p.NAME} (ID: #{p.PATIENT_ID})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Treatment Date</label>
                <input
                  type="date"
                  value={billingDate}
                  onChange={(e) => setBillingDate(e.target.value)}
                  required
                  className="w-full px-4 py-4 rounded-2xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900"
                />
              </div>
            </div>
          </section>

          {/* DYNAMIC LINE ITEM APPENDERS */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Scissors className="text-cyan-600" size={18} />
                <h3 className="text-lg font-bold text-slate-900">Dental Operations & Procedures</h3>
              </div>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-cyan-50 hover:bg-cyan-100 text-cyan-700 font-semibold transition"
              >
                <Plus size={18} /> Add Treatment Row
              </button>
            </div>

            <div className="space-y-5">
              {items.map((item, index) => (
                <div key={index} className="p-5 rounded-3xl border border-slate-200 bg-slate-50">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                    
                    {/* QUICK PRESET DROPDOWN */}
                    <div className="md:col-span-3">
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Quick Select Template</label>
                      <select
                        onChange={(e) => handleSelectPreset(index, e.target.value)}
                        className="w-full px-4 py-4 rounded-2xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                        defaultValue=""
                      >
                        <option value="">-- Custom Entry --</option>
                        {DENTAL_PROCEDURES.map((p, pIdx) => (
                          <option key={pIdx} value={p.label}>{p.label} (Rs. {p.price})</option>
                        ))}
                      </select>
                    </div>

                    {/* DESCRIPTION FIELD */}
                    <div className="md:col-span-5">
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Service Description</label>
                      <input
                        type="text"
                        value={item.description}
                        required
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        placeholder="e.g. Lower Left Molar Filling, Orthodontic Retainers"
                        className="w-full px-4 py-4 rounded-2xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>

                    {/* AMOUNT FIELD */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Amount (LKR)</label>
                      <input
                        type="number"
                        value={item.amount || ''}
                        required
                        onChange={(e) => updateItem(index, 'amount', e.target.value)}
                        placeholder="0.00"
                        className="w-full px-4 py-4 rounded-2xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>

                    {/* REMOVE ITEM BUTTON */}
                    <div className="md:col-span-2">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold transition"
                      >
                        <Trash2 size={18} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* INVOICE SUMMARY COST BOX */}
          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-sm text-slate-500">Calculated Dental Total (Rs.)</p>
                <h2 className="text-5xl font-bold text-cyan-600 mt-3">Rs. {total.toFixed(2)}</h2>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Invoice Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-4 rounded-2xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900"
                >
                  <option value="Draft">Draft / Treatment Planned</option>
                  <option value="Pending">Pending Payment</option>
                  <option value="Paid">Settled / Paid</option>
                </select>
              </div>
            </div>
          </section>

          {/* SUBMIT BUTTON ACTIONS */}
          <div className="flex flex-col md:flex-row gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-3 bg-cyan-600 hover:bg-cyan-700 text-white py-4 rounded-2xl font-semibold transition disabled:opacity-70"
            >
              <Save size={20} /> {loading ? 'Registering Invoices...' : 'Save and Issue Dental Invoice'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/billing')}
              className="px-8 py-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
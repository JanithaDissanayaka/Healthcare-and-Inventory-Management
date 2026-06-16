'use client';

import React, { useEffect, useState } from 'react';
import {
  DollarSign,
  FileText,
  Send,
  CheckCircle2,
  Receipt,
  Wallet,
  AlertTriangle,
  Search,
} from 'lucide-react';
import StatusBadge from "@/app/components/StatusBadge";

type Invoice = {
  ID: number;
  PATIENT_NAME: string;
  AMOUNT: number;
  STATUS: string;
  BILLING_DATE: string;
};

export default function BillingPage() {
  const [metrics, setMetrics] = useState({ totalInvoices: 0, paidInvoices: 0, overdueInvoices: 0 });
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadBillingData() {
      try {
        const res = await fetch('/api/billing');
        if (res.ok) {
          const data = await res.json();
          setMetrics({
            totalInvoices: data.totalInvoices,
            paidInvoices: data.paidInvoices,
            overdueInvoices: data.overdueInvoices
          });
          setInvoices(data.invoices || []);
          if (data.invoices && data.invoices.length > 0) {
            setSelectedInvoice(data.invoices[0]); // Default focus on latest item
          }
        }
      } catch (error) {
        console.error("Failed to sync billing dataset:", error);
      }
    }
    loadBillingData();
  }, []);

  const filteredInvoices = invoices.filter(inv => 
    inv.PATIENT_NAME?.toLowerCase().includes(search.toLowerCase()) ||
    String(inv.ID).includes(search)
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      {/* TOP METRICS CONTENT GRID */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="bg-white border-b border-slate-200 px-8 py-7 relative">
          <div className="absolute right-10 top-6 h-24 w-24 rounded-full bg-emerald-50"></div>
          <div className="absolute right-24 top-14 h-14 w-14 rounded-full bg-cyan-50"></div>
          <div className="relative flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <Wallet className="text-emerald-600" size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Billing & Payments</h2>
              <p className="text-slate-500 mt-2 text-base">Manage hospital invoices, patient billing, and Sri Lankan health transactions.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 lg:p-8">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Invoices</p>
                <h2 className="text-4xl font-bold text-slate-900 mt-3">{metrics.totalInvoices}</h2>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <Receipt className="text-emerald-600" size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Paid Invoices</p>
                <h2 className="text-4xl font-bold text-emerald-600 mt-3">{metrics.paidInvoices}</h2>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="text-emerald-600" size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pending Outstandings</p>
                <h2 className="text-4xl font-bold text-red-600 mt-3">{metrics.overdueInvoices}</h2>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-red-100 flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED LEDGER GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Invoice Statement</h2>
              <p className="text-slate-500 mt-1">Billing breakdowns and processing actions</p>
            </div>
            {selectedInvoice && <StatusBadge status={selectedInvoice.STATUS} />}
          </div>

          <div className="p-8">
            {selectedInvoice ? (
              <>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 mb-8">
                  <div className="flex items-center justify-between flex-wrap gap-6">
                    <div>
                      <p className="text-sm text-slate-500">Invoice Reference</p>
                      <h3 className="text-xl font-bold text-slate-900 mt-2">#INV-2026-{selectedInvoice.ID}</h3>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Patient Registry</p>
                      <h3 className="text-lg font-semibold text-slate-900 mt-2">{selectedInvoice.PATIENT_NAME}</h3>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Issued Date</p>
                      <h3 className="text-md font-medium text-slate-700 mt-2">{selectedInvoice.BILLING_DATE}</h3>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-900 text-white mb-8">
                  <div>
                    <p className="text-slate-300 text-sm">Total Due Balance</p>
                    <h2 className="text-4xl font-bold mt-2">LKR {Number(selectedInvoice.AMOUNT).toFixed(2)}</h2>
                  </div>
                  <DollarSign size={42} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-semibold transition">
                    <CheckCircle2 size={20} /> Clear Processing (Mark Paid)
                  </button>
                  <button className="flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-4 rounded-2xl font-semibold transition">
                    <Send size={20} /> Dispatch Invoice Receipt
                  </button>
                </div>
              </>
            ) : (
              <p className="text-slate-400 text-center py-12">Select an invoice from the sidebar panel to view processing breakdowns.</p>
            )}
          </div>
        </div>

        {/* SIDE PANEL LIST SEARCH */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900">Recent Ledgers</h3>
            <div className="relative mt-4">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or reference ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
            {filteredInvoices.map((inv) => (
              <div
                key={inv.ID}
                onClick={() => setSelectedInvoice(inv)}
                className={`p-4 rounded-2xl border transition cursor-pointer ${selectedInvoice?.ID === inv.ID ? 'bg-slate-50 border-emerald-500' : 'border-slate-100 hover:bg-slate-50'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-bold text-slate-900">#INV-2026-{inv.ID}</div>
                    <div className="text-sm text-slate-500 mt-1">{inv.PATIENT_NAME}</div>
                    <div className="mt-2"><StatusBadge status={inv.STATUS} /></div>
                  </div>
                  <div className="text-right">
                    <div className="text-md font-bold text-slate-900">Rs. {inv.AMOUNT}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
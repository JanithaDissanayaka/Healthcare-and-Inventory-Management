'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  FileText,
  Printer,
  CheckCircle2,
  Receipt,
  Wallet,
  AlertTriangle,
  Search,
  X,
  HeartPulse,
  Sparkles,
  Send,
  RefreshCw,
  TrendingUp,
  CreditCard,
  Bot
} from 'lucide-react';

// --- TYPES MATCHING YOUR DB SCHEMA ---
type Invoice = {
  ID: number;
  PATIENT_NAME: string;
  AMOUNT: number;
  STATUS: 'Paid' | 'Pending' | 'Overdue' | string;
  BILLING_DATE: string;
};

type InvoiceItem = {
  ITEM_ID: number;
  DESCRIPTION: string;
  AMOUNT: number;
};

type BillingMetrics = {
  totalInvoices: number;
  paidInvoices: number;
  overdueInvoices: number;
  totalRevenue: number;
};

// --- PREMIUM INLINE STATUS BADGE ---
const StatusBadge = ({ status }: { status: string }) => {
  const isPaid = status === 'Paid';
  const isPending = status === 'Pending';
  const isOverdue = status === 'Overdue';

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
      isPaid ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm shadow-emerald-100' :
      isPending ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm shadow-amber-100' :
      isOverdue ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-sm shadow-rose-100 animate-pulse' :
      'bg-slate-50 text-slate-700 border-slate-200'
    }`}>
      {(isPending || isOverdue) && (
        <span className={`h-1.5 w-1.5 rounded-full ${isPending ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
      )}
      {status}
    </span>
  );
};

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [metrics, setMetrics] = useState<BillingMetrics>({ totalInvoices: 0, paidInvoices: 0, overdueInvoices: 0, totalRevenue: 0 });
  
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState(false);
  
  // AI Chat State
  const [aiChatOpen, setAiChatOpen] = useState(false);

  // --- CORE DATA FETCHING ---
  const fetchBillingData = async () => {
    try {
      const res = await fetch('/api/billing');
      const data = await res.json();
      
      const loadedInvoices = data.invoices || [];
      setInvoices(loadedInvoices);
      
      const revenue = loadedInvoices
        .filter((i: Invoice) => i.STATUS === 'Paid')
        .reduce((sum: number, inv: Invoice) => sum + inv.AMOUNT, 0);

      setMetrics({
        totalInvoices: data.totalInvoices || loadedInvoices.length,
        paidInvoices: data.paidInvoices || loadedInvoices.filter((i: Invoice) => i.STATUS === 'Paid').length,
        overdueInvoices: data.overdueInvoices || loadedInvoices.filter((i: Invoice) => i.STATUS !== 'Paid').length,
        totalRevenue: revenue
      });

      if (!selectedInvoice && loadedInvoices.length > 0) {
        handleSelectInvoice(loadedInvoices[0]);
      }
    } catch (error) {
      console.error("Failed to load billing data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillingData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectInvoice = async (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setLoadingItems(true);
    
    try {
      const res = await fetch(`/api/billing/${invoice.ID}`);
      const data = await res.json();
      setInvoiceItems(data.items || []);
    } catch (error) {
      console.error("Failed to load invoice items", error);
      setInvoiceItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  const markAsPaid = async () => {
    if (!selectedInvoice) return;
    setUpdatingPayment(true);
    
    try {
      await fetch(`/api/billing/${selectedInvoice.ID}`, { method: 'PUT' });
      
      const updatedInvoice = { ...selectedInvoice, STATUS: 'Paid' as const };
      setSelectedInvoice(updatedInvoice);
      
      await fetchBillingData();
    } catch (error) {
      console.error("Failed to process payment", error);
    } finally {
      setUpdatingPayment(false);
    }
  };

  const filteredInvoices = invoices.filter(inv => 
    (inv.PATIENT_NAME || '').toLowerCase().includes(search.toLowerCase()) ||
    String(inv.ID).includes(search)
  );

  // Dynamic Avatar Color
  const getAvatarColor = (name: string) => {
    const colors = ['bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-blue-500', 'bg-indigo-500'];
    if (!name) return colors[0];
    return colors[name.charCodeAt(0) % colors.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <div className="relative h-16 w-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="font-bold tracking-widest uppercase text-sm animate-pulse">Syncing Financial Ledger...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 lg:p-8 font-sans print:p-0 print:bg-white relative">
      <div className="print:hidden">
        
        {/* HEADER STRIP */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 bg-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-900/10 relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-emerald-500/20 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs uppercase tracking-widest mb-3 border border-emerald-500/20">
              <Wallet size={14} /> Financial Operations
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">Billing & Checkout</h1>
            <p className="text-slate-400 text-sm mt-2 font-medium max-w-xl">
              Manage hospital invoices, process patient checkout payments, and monitor revenue ledgers.
            </p>
          </div>
          <div className="relative z-10 flex gap-3 mt-4 lg:mt-0 flex-wrap">
            <div className="px-6 py-4 rounded-2xl bg-white/10 text-white font-bold text-sm flex items-center gap-3 backdrop-blur-md border border-white/10">
              <TrendingUp size={20} className="text-emerald-400" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Total Revenue</p>
                <p className="text-lg">Rs. {metrics.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Invoices</p>
              <h2 className="text-3xl font-black text-slate-900 mt-1">{metrics.totalInvoices}</h2>
              <p className="text-xs font-bold text-slate-500 mt-2 flex items-center gap-1"><Receipt size={14} /> Issued Records</p>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center"><FileText size={28} /></div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Paid & Settled</p>
              <h2 className="text-3xl font-black text-emerald-600 mt-1">{metrics.paidInvoices}</h2>
              <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1"><CheckCircle2 size={14} /> Cleared Balances</p>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><CheckCircle2 size={28} /></div>
          </div>

          <div className={`bg-white rounded-3xl border p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between ${metrics.overdueInvoices > 0 ? 'border-rose-200 bg-rose-50/10' : 'border-slate-200'}`}>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Pending / Due</p>
              <h2 className={`text-3xl font-black mt-1 ${metrics.overdueInvoices > 0 ? 'text-rose-600' : 'text-slate-900'}`}>{metrics.overdueInvoices}</h2>
              <p className={`text-xs font-bold mt-2 flex items-center gap-1 ${metrics.overdueInvoices > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                {metrics.overdueInvoices > 0 ? <AlertTriangle size={14} className="animate-pulse" /> : <Wallet size={14} />} 
                {metrics.overdueInvoices > 0 ? 'Awaiting Payment' : 'All Accounts Settled'}
              </p>
            </div>
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${metrics.overdueInvoices > 0 ? 'bg-rose-100 text-rose-600' : 'bg-slate-50 text-slate-600'}`}>
              <CreditCard size={28} />
            </div>
          </div>
        </div>

        {/* TWO-COLUMN MASTER-DETAIL LAYOUT */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          
          {/* LEFT PANEL: INVOICE LIST (Master) */}
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[700px]">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Receipt className="text-emerald-600" size={20} /> Ledger History
              </h3>
              <div className="relative mt-4">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Patient or INV#..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
              {filteredInvoices.length === 0 ? (
                <div className="text-center text-slate-400 py-10 flex flex-col items-center">
                  <Search size={32} className="mb-3 opacity-20" />
                  <p className="font-bold text-sm">No ledgers match search.</p>
                </div>
              ) : (
                filteredInvoices.map((inv) => (
                  <div
                    key={inv.ID}
                    onClick={() => handleSelectInvoice(inv)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                      selectedInvoice?.ID === inv.ID 
                        ? 'bg-emerald-50/50 border-emerald-300 shadow-sm' 
                        : 'bg-white border-slate-100 hover:border-emerald-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-white font-black shrink-0 ${getAvatarColor(inv.PATIENT_NAME)}`}>
                          {inv.PATIENT_NAME ? inv.PATIENT_NAME.charAt(0).toUpperCase() : 'P'}
                        </div>
                        <div className="min-w-0 pr-2">
                          <h4 className={`text-sm font-bold truncate transition-colors ${selectedInvoice?.ID === inv.ID ? 'text-emerald-900' : 'text-slate-900 group-hover:text-emerald-700'}`}>
                            {inv.PATIENT_NAME || 'Unknown'}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">#INV-2026-{inv.ID}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-black text-slate-900">Rs. {inv.AMOUNT}</p>
                        <div className="mt-1"><StatusBadge status={inv.STATUS} /></div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT PANEL: INVOICE DETAILS (Detail) */}
          <div className="xl:col-span-2 bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[700px]">
            {selectedInvoice ? (
              <>
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Invoice Statement</h2>
                    <p className="text-slate-500 text-xs mt-1 font-semibold">Itemized breakdown & payment processing</p>
                  </div>
                  <StatusBadge status={selectedInvoice.STATUS} />
                </div>

                <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                  
                  {/* Summary Block */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 mb-8 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                      <div className="sm:pr-6">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Reference</p>
                        <h3 className="text-lg font-black text-slate-900 mt-1 font-mono">#INV-2026-{selectedInvoice.ID}</h3>
                      </div>
                      <div className="sm:px-6 pt-4 sm:pt-0">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Billed To</p>
                        <h3 className="text-lg font-black text-slate-900 mt-1 truncate">{selectedInvoice.PATIENT_NAME || 'Unknown Patient'}</h3>
                      </div>
                      <div className="sm:pl-6 pt-4 sm:pt-0">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date Issued</p>
                        <h3 className="text-lg font-bold text-slate-700 mt-1">{selectedInvoice.BILLING_DATE}</h3>
                      </div>
                    </div>
                  </div>

                  {/* Line Items */}
                  <div className="mb-8">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Service Breakdown</h4>
                    <div className="bg-slate-50/50 border border-slate-200 rounded-2xl overflow-hidden">
                      {loadingItems ? (
                        <div className="p-8 text-center text-slate-400 text-sm animate-pulse font-medium">Fetching line items...</div>
                      ) : invoiceItems.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-sm font-medium">No itemized details attached to this record.</div>
                      ) : (
                        <table className="w-full text-left text-sm">
                          <thead className="bg-slate-100/50 border-b border-slate-200">
                            <tr>
                              <th className="py-3 px-4 font-bold text-slate-500">Description</th>
                              <th className="py-3 px-4 font-bold text-slate-500 text-right">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {invoiceItems.map((item) => (
                              <tr key={item.ITEM_ID} className="hover:bg-white transition-colors">
                                <td className="py-4 px-4 font-semibold text-slate-700 flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                    <FileText size={14} />
                                  </div>
                                  {item.DESCRIPTION}
                                </td>
                                <td className="py-4 px-4 font-black text-slate-900 text-right font-mono">
                                  Rs. {Number(item.AMOUNT).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>

                  {/* Action & Total Area */}
                  <div className="mt-auto">
                    <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-6 sm:p-8 rounded-[2rem] text-white mb-6 transition-colors shadow-lg relative overflow-hidden ${selectedInvoice.STATUS === 'Paid' ? 'bg-emerald-600 shadow-emerald-600/20' : 'bg-slate-900 shadow-slate-900/20'}`}>
                      <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
                      <div className="relative z-10">
                        <p className="text-white/70 text-sm font-bold uppercase tracking-widest">{selectedInvoice.STATUS === 'Paid' ? 'Balance Cleared' : 'Total Due Balance'}</p>
                        <h2 className="text-4xl sm:text-5xl font-black mt-1 font-mono tracking-tight">LKR {Number(selectedInvoice.AMOUNT).toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                      </div>
                      {selectedInvoice.STATUS === 'Paid' && (
                        <div className="relative z-10 mt-4 sm:mt-0 bg-white/20 p-3 rounded-2xl backdrop-blur-sm border border-white/20">
                          <CheckCircle2 size={40} className="text-white" />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        onClick={markAsPaid}
                        disabled={updatingPayment || selectedInvoice.STATUS === 'Paid'}
                        className="w-full py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
                      >
                        {updatingPayment ? <RefreshCw size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                        {updatingPayment ? "Processing..." : selectedInvoice.STATUS === 'Paid' ? "Invoice Settled" : "Process Payment"}
                      </button>
                      <button
                        onClick={() => setShowReceiptModal(true)}
                        className="w-full py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98] bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
                      >
                        <Printer size={18} /> View & Print Receipt
                      </button>
                    </div>
                  </div>

                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                <Receipt size={48} className="mb-4 opacity-20" />
                <h3 className="text-xl font-black text-slate-900">No Invoice Selected</h3>
                <p className="text-sm font-medium mt-1 max-w-sm">Select an invoice from the ledger on the left to view detailed billing statements and process payments.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- RECEIPT PRINT MODAL --- */}
      {showReceiptModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 print:static print:p-0 print:bg-white">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 print:shadow-none print:border-0 print:rounded-none">
            
            <div className="p-6 pb-0 flex justify-end print:hidden">
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition flex items-center gap-2">
                  <Printer size={16} /> Print
                </button>
                <button onClick={() => setShowReceiptModal(false)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-500 transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="px-10 pb-10 pt-6">
              <div className="text-center mb-8">
                <div className="h-16 w-16 mx-auto rounded-full bg-slate-900 text-white flex items-center justify-center mb-4">
                  <HeartPulse size={32} />
                </div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">CarePulse</h2>
                <p className="text-xs uppercase font-bold text-slate-400 tracking-widest mt-1">Medical Receipt</p>
              </div>

              <div className="space-y-4 font-mono text-sm">
                <div className="flex justify-between border-b border-dashed border-slate-300 pb-4">
                  <span className="text-slate-500">Receipt No:</span>
                  <span className="font-bold text-slate-900">#REC-{selectedInvoice.ID}</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-slate-300 pb-4">
                  <span className="text-slate-500">Patient:</span>
                  <span className="font-bold text-slate-900 text-right">{selectedInvoice.PATIENT_NAME}</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-slate-300 pb-4">
                  <span className="text-slate-500">Date:</span>
                  <span className="font-bold text-slate-900">{selectedInvoice.BILLING_DATE}</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-slate-300 pb-4">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-slate-900 uppercase">{selectedInvoice.STATUS}</span>
                </div>

                <div className="pt-4 pb-2">
                  <span className="text-slate-500 mb-2 block">Services Rendered:</span>
                  {invoiceItems.length === 0 ? (
                    <div className="text-center py-2 text-slate-400 text-xs">No itemized breakdown</div>
                  ) : (
                    invoiceItems.map((item) => (
                      <div key={item.ITEM_ID} className="flex justify-between items-start mb-2">
                        <span className="text-slate-900 pr-4">{item.DESCRIPTION}</span>
                        <span className="font-bold text-slate-900 shrink-0">{Number(item.AMOUNT).toFixed(2)}</span>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex justify-between items-end pt-4 border-t-2 border-slate-900">
                  <span className="font-sans text-xs font-bold uppercase tracking-wider text-slate-500">Total</span>
                  <span className="text-xl font-black text-slate-900">Rs. {Number(selectedInvoice.AMOUNT).toFixed(2)}</span>
                </div>
              </div>

              <div className="text-center text-xs text-slate-400 pt-8 mt-8 border-t border-dashed border-slate-300">
                <p className="font-medium text-slate-600">Thank you for choosing CarePulse.</p>
                <p className="mt-1 font-mono text-[10px]">System generated statement.</p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- POLISHED AI WIDGET --- */}
      <div className="print:hidden">
        {!aiChatOpen && (
          <button 
            onClick={() => setAiChatOpen(true)}
            className="fixed bottom-8 right-8 h-16 w-16 bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(139,92,246,0.4)] hover:scale-110 active:scale-95 transition-transform z-50 group border border-white/20"
          >
            <Bot size={28} className="group-hover:animate-pulse" />
          </button>
        )}

        {aiChatOpen && (
          <CarePulseAI 
            onClose={() => setAiChatOpen(false)}
            revenue={metrics.totalRevenue}
            pendingPayments={metrics.overdueInvoices}
          />
        )}
      </div>
    </div>
  );
}

// --- REFINED AI CHAT COMPONENT ---
type Message = { role: 'user' | 'assistant'; content: string; };

function CarePulseAI({ onClose, revenue = 0, pendingPayments = 0 }: any) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am CarePulse AI. I am currently monitoring the Billing & Checkout module. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const SUGGESTIONS = ['Revenue Report', 'Pending Invoices', 'Daily Summary'];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const processAIResponse = (text: string) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes("report") || lowerText.includes("revenue") || lowerText.includes("summary")) {
      return `**Financial Report:**\nTotal collected revenue processed so far is **Rs. ${revenue.toLocaleString()}**.\n\nThere are currently **${pendingPayments}** outstanding invoices that require settlement.`;
    } else if (lowerText.includes("pending") || lowerText.includes("due") || lowerText.includes("overdue")) {
      if (pendingPayments === 0) return "Great news! There are currently no pending or overdue payments. All accounts are settled.";
      return `**Pending Invoices:**\nThere are **${pendingPayments}** invoices awaiting payment. Filter the ledger on the left to follow up.`;
    }
    return "I am monitoring the live billing tables. You can ask me for a **Revenue Report** or check on **Pending Invoices**.";
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: processAIResponse(text) }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 w-[380px] bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-white/50 overflow-hidden flex flex-col z-[100] animate-in slide-in-from-bottom-10 h-[600px]">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 p-5 flex items-center justify-between text-white relative overflow-hidden shrink-0">
        <div className="absolute -right-4 -top-4 h-24 w-24 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/20 shadow-inner">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-black text-base leading-tight">CarePulse AI</h3>
            <p className="text-[10px] text-white/80 font-bold uppercase tracking-widest mt-0.5">Financial Agent</p>
          </div>
        </div>
        <button onClick={onClose} className="relative z-10 hover:bg-white/20 p-2 rounded-full transition active:scale-95">
          <X size={18} />
        </button>
      </div>

      {/* Suggestion Chips */}
      <div className="p-3 border-b border-slate-100 flex gap-2 overflow-x-auto scrollbar-none bg-slate-50/50 shrink-0">
        {SUGGESTIONS.map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => sendMessage(suggestion)}
            className="whitespace-nowrap px-4 py-2 bg-white border border-slate-200 hover:border-violet-500 hover:text-violet-700 text-slate-600 rounded-xl text-xs font-bold transition shadow-sm active:scale-95"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-5 overflow-y-auto bg-slate-50/50 space-y-5 scrollbar-thin">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div 
              className={`max-w-[85%] p-4 text-sm rounded-2xl whitespace-pre-wrap shadow-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-violet-600 text-white rounded-br-sm' 
                  : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start">
            <div className="bg-white border border-slate-200 shadow-sm text-violet-500 p-4 rounded-2xl rounded-bl-sm text-sm flex gap-1.5 items-center">
              <span className="h-2 w-2 bg-violet-400 rounded-full animate-bounce"></span>
              <span className="h-2 w-2 bg-violet-400 rounded-full animate-bounce delay-100"></span>
              <span className="h-2 w-2 bg-violet-400 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-100 bg-white shrink-0">
        <form 
          onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
          className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full p-1 focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500 transition-all"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask CarePulse AI..."
            className="flex-1 px-4 py-2.5 bg-transparent text-sm outline-none placeholder:text-slate-400 font-medium"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-10 w-10 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 text-white rounded-full flex items-center justify-center transition-colors shadow-sm shrink-0 active:scale-95"
          >
            <Send size={16} className="ml-0.5" />
          </button>
        </form>
      </div>

    </div>
  );
}
'use client';

import React, { useEffect, useState } from 'react';
import {
  DollarSign,
  FileText,
  Printer,
  CheckCircle2,
  Receipt,
  Wallet,
  AlertTriangle,
  Search,
  X,
  HeartPulse
} from 'lucide-react';
import StatusBadge from "@/app/components/StatusBadge";

type Invoice = {
  ID: number;
  PATIENT_NAME: string;
  AMOUNT: number;
  STATUS: string;
  BILLING_DATE: string;
};

type InvoiceItem = {
  ITEM_ID: number;
  DESCRIPTION: string;
  AMOUNT: number;
};

export default function BillingPage() {
  const [metrics, setMetrics] = useState({ totalInvoices: 0, paidInvoices: 0, overdueInvoices: 0 });
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [search, setSearch] = useState('');
  const [loadingItems, setLoadingItems] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState(false);

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
        if (data.invoices && data.invoices.length > 0 && !selectedInvoice) {
          handleSelectInvoice(data.invoices[0]);
        }
      }
    } catch (error) {
      console.error("Failed to sync billing dataset:", error);
    }
  }

  useEffect(() => {
    loadBillingData();
  }, []);

  // Fetch individual line items whenever a different invoice is selected
  async function handleSelectInvoice(invoice: Invoice) {
    setSelectedInvoice(invoice);
    setLoadingItems(true);
    setInvoiceItems([]);
    try {
      const res = await fetch(`/api/billing/${invoice.ID}`);
      if (res.ok) {
        const data = await res.json();
        setInvoiceItems(data.items || []);
      }
    } catch (err) {
      console.error("Error pulling sub-line charges:", err);
    } finally {
      setLoadingItems(false);
    }
  }

  // Update Status to Paid inside the Database
  async function markAsPaid() {
    if (!selectedInvoice) return;
    setUpdatingPayment(true);
    try {
      const res = await fetch(`/api/billing/${selectedInvoice.ID}`, { method: 'PUT' });
      if (res.ok) {
        alert(`Invoice #INV-2026-${selectedInvoice.ID} marked as PAID.`);
        // Refresh local views
        const updatedInvoice = { ...selectedInvoice, STATUS: 'Paid' };
        setSelectedInvoice(updatedInvoice);
        setInvoices(prev => prev.map(inv => inv.ID === selectedInvoice.ID ? updatedInvoice : inv));
        await loadBillingData();
      } else {
        alert("Failed to update transaction state.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingPayment(false);
    }
  }

  const filteredInvoices = invoices.filter(inv => 
    inv.PATIENT_NAME?.toLowerCase().includes(search.toLowerCase()) ||
    String(inv.ID).includes(search)
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8 print:p-0 print:bg-white">
      {/* HIDE ON PRINT ELEMENT WRAPPERS */}
      <div className="print:hidden">
        {/* TOP METRICS CONTENT GRID */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="bg-white border-b border-slate-200 px-8 py-7 relative">
            <div className="absolute right-10 top-6 h-24 w-24 rounded-full bg-emerald-50"></div>
            <div className="relative flex items-center gap-5">
              <div className="h-16 w-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <Wallet className="text-emerald-600" size={28} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Billing & Payments</h2>
                <p className="text-slate-500 mt-2 text-base">Manage hospital invoices, track patient checkouts, and handle payments.</p>
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
                <p className="text-slate-500 mt-1">Itemized service breakdowns</p>
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

                  {/* LIVE LINE ITEMS CONTAINER */}
                  <div className="space-y-4 mb-8">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Service Breakdown</h4>
                    {loadingItems ? (
                      <p className="text-slate-400 text-sm animate-pulse">Loading service charges...</p>
                    ) : invoiceItems.length === 0 ? (
                      <p className="text-slate-400 text-sm">No individual line item details mapped to this record.</p>
                    ) : (
                      invoiceItems.map((item) => (
                        <div key={item.ITEM_ID} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50/50 transition">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                              <FileText className="text-emerald-600" size={16} />
                            </div>
                            <span className="text-slate-700 font-medium text-sm">{item.DESCRIPTION}</span>
                          </div>
                          <span className="font-bold text-slate-900 text-md">Rs. {Number(item.AMOUNT).toFixed(2)}</span>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-900 text-white mb-8">
                    <div>
                      <p className="text-slate-300 text-sm">Total Due Balance</p>
                      <h2 className="text-4xl font-bold mt-2">LKR {Number(selectedInvoice.AMOUNT).toFixed(2)}</h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={markAsPaid}
                      disabled={updatingPayment || selectedInvoice.STATUS.toUpperCase() === 'PAID'}
                      className="flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-semibold transition disabled:opacity-50 disabled:hover:bg-emerald-600"
                    >
                      <CheckCircle2 size={20} /> {updatingPayment ? "Processing..." : selectedInvoice.STATUS.toUpperCase() === 'PAID' ? "Invoice Already Paid" : "Mark as Paid"}
                    </button>
                    <button
                      onClick={() => setShowReceiptModal(true)}
                      className="flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-4 rounded-2xl font-semibold transition"
                    >
                      <Printer size={20} /> View & Print Receipt
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-slate-400 text-center py-12">Select an invoice from the side panel to view processing breakdowns.</p>
              )}
            </div>
          </div>

          {/* SIDE PANEL LIST SEARCH */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-fit">
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
                  onClick={() => handleSelectInvoice(inv)}
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

      {/* RENDER MODAL: CAREPULSE PRINT RECEIPT VIEW */}
      {showReceiptModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 print:static print:p-0 print:bg-white">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden p-8 print:border-0 print:shadow-none print:p-0">
            
            {/* HIDE BUTTONS FROM PHYSICAL PRINT OUT COPIES */}
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4 print:hidden">
              <h3 className="font-bold text-slate-900 text-xl">Receipt Preview</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-emerald-700 transition shadow-sm"
                >
                  <Printer size={16} /> Print Receipt
                </button>
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 transition"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* RECEIPT FORM LAYOUT STRUCTURE */}
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                    <HeartPulse size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black tracking-tight text-slate-900">CarePulse</h2>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Healthcare Systems</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Receipt Number</div>
                  <div className="font-extrabold text-slate-900 mt-0.5">#REC-2026-{selectedInvoice.ID}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-4 text-sm">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Billed To</span>
                  <p className="font-bold text-slate-800 mt-1">{selectedInvoice.PATIENT_NAME}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Sri Lankan Resident Registry</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Transaction Date</span>
                  <p className="font-semibold text-slate-800 mt-1">{selectedInvoice.BILLING_DATE}</p>
                  <div className="mt-2 inline-block">
                    <StatusBadge status={selectedInvoice.STATUS} />
                  </div>
                </div>
              </div>

              {/* ITEMIZED LEDGER MATRICES */}
              <div>
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-3">Service Description</th>
                      <th className="py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceItems.map((item) => (
                      <tr key={item.ITEM_ID} className="border-b border-slate-100 text-slate-700">
                        <td className="py-3.5 font-medium">{item.DESCRIPTION}</td>
                        <td className="py-3.5 text-right font-semibold text-slate-900">Rs. {Number(item.AMOUNT).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* TOTAL DUE SHEET OVERVIEW */}
              <div className="flex justify-end pt-4">
                <div className="w-52 border-t-2 border-slate-900 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between font-bold text-slate-900 text-lg">
                    <span>Grand Total:</span>
                    <span>Rs. {Number(selectedInvoice.AMOUNT).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* FOOTER */}
              <div className="text-center text-xs text-slate-400 border-t border-slate-100 pt-6 mt-6">
                <p className="font-medium">Thank you for choosing CarePulse Medical Center.</p>
                <p className="text-[10px] text-slate-400 mt-1">This is a system-generated statement. No physical signature required.</p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
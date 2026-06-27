'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  Sparkles,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Clock3,
  Stethoscope,
  LogOut,
  RefreshCw,
  CreditCard,
  Receipt,
  HeartPulse,
  X,
  ChevronRight
} from 'lucide-react';

// --- TYPES ---
type DashboardStats = {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  totalRevenue: number;
};

type Doctor = {
  ID: number;
  NAME: string;
  SPECIALIZATION: string;
};

type Appointment = {
  APPOINTMENT_ID: number;
  PATIENT_NAME: string;
  DOCTOR_NAME: string;
  APPOINTMENT_DATE: string;
  STATUS: string;
};

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

type Patient = {
  PATIENT_ID?: number;
  patient_id?: number;
  NAME?: string;
  name?: string;
};

const STATUS_COLORS = {
  Occupied: 'bg-cyan-500 text-white shadow-cyan-500/20 shadow-lg',
  Available: 'bg-emerald-100 text-emerald-700',
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [chairFilter, setChairFilter] = useState<'All' | 'Available' | 'Occupied'>('All');

  // Modal States
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // --- CORE DATA FETCHING ---
  const fetchAllData = async () => {
    setIsSyncing(true);
    try {
      const [dashRes, docRes, apptRes, billRes, patRes] = await Promise.all([
        fetch('/api/dashboard'),
        fetch('/api/doctors'),
        fetch('/api/appointments'),
        fetch('/api/billing'),
        fetch('/api/patients')
      ]);

      const dashData = await dashRes.json();
      const docData = await docRes.json();
      const apptData = await apptRes.json();
      const billData = await billRes.json();
      const patData = await patRes.json();

      setStats(dashData);
      setDoctors(docData.doctorsList || []);
      setAppointments(apptData.appointments || []);
      setInvoices(billData.invoices || []);
      setPatients(patData.patients || []);
    } catch (error) {
      console.error("Database sync failed:", error);
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // --- DATABASE ACTIONS ---
  const handleCompleteAndBill = async (appointment: Appointment) => {
    try {
      await fetch(`/api/appointments/${appointment.APPOINTMENT_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED' }),
      });

      const matchedPatient = patients.find(p => 
        p.name?.toLowerCase() === appointment.PATIENT_NAME?.toLowerCase() ||
        p.NAME?.toLowerCase() === appointment.PATIENT_NAME?.toLowerCase()
      );
      const patientIdToBill = matchedPatient ? (matchedPatient.PATIENT_ID || matchedPatient.patient_id) : 1;

      await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient: patientIdToBill,
          billingDate: new Date().toISOString().split('T')[0],
          total: 12500,
          status: 'Pending',
          items: [
            { description: `Clinical Operation - ${appointment.DOCTOR_NAME}`, amount: 12500 }
          ]
        })
      });

      fetchAllData();
    } catch (error) {
      console.error("Workflow failed to complete appointment", error);
    }
  };

  const handleInitiatePayment = async (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowReceiptModal(true);
    setInvoiceItems([]); 
    try {
      const res = await fetch(`/api/billing/${invoice.ID}`);
      const data = await res.json();
      setInvoiceItems(data.items || []);
    } catch (error) {
      console.error("Failed to load invoice items", error);
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedInvoice) return;
    setIsProcessingPayment(true);
    try {
      await fetch(`/api/billing/${selectedInvoice.ID}`, {
        method: 'PUT',
      });
      setShowReceiptModal(false);
      setSelectedInvoice(null);
      fetchAllData(); 
    } catch (error) {
      console.error("Failed to process payment", error);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // --- DATA MAPPING ---
  const pendingAppointments = appointments.filter(a => a.STATUS?.toUpperCase() === 'PENDING');
  
  const chairs = doctors.map((doc, index) => {
    const docAppointments = pendingAppointments.filter(
      a => a.DOCTOR_NAME?.trim().toLowerCase() === doc.NAME?.trim().toLowerCase()
    );
    
    const activePatient = docAppointments.length > 0 ? docAppointments[0] : null;
    const remainingQueue = docAppointments.slice(1);

    return {
      chairId: index + 1,
      chairName: `Operatory 0${index + 1}`,
      doctor: doc,
      activePatient,
      status: activePatient ? 'Occupied' : 'Available',
      remainingQueue
    };
  });

  const globalWaitQueue = chairs.flatMap(c => c.remainingQueue);
  const pendingBillingQueue = invoices.filter(inv => inv.STATUS?.toLowerCase() === 'pending');

  const filteredChairs = chairs.filter(chair => {
    if (chairFilter === 'All') return true;
    return chair.status === chairFilter;
  });

  // --- LOADING STATE ---
  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <div className="relative h-16 w-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
            <RefreshCw size={32} className="animate-spin text-emerald-500" />
          </div>
          <p className="font-bold tracking-widest uppercase text-sm animate-pulse">Syncing Clinic Systems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 lg:p-8 font-sans">
      
      {/* HEADER STRIP */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 bg-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-900/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs uppercase tracking-widest mb-3 border border-cyan-500/20">
            <Sparkles size={14} /> Live Clinical Operations
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">CarePulse Dental Hospital</h1>
          <p className="text-slate-400 text-sm mt-2 font-medium max-w-xl">
            Real-time synchronization active. Queues automatically reflect uncompleted operations and outstanding invoices.
          </p>
        </div>
        <div className="relative z-10 flex gap-3 mt-4 lg:mt-0">
          <button 
            onClick={fetchAllData} 
            className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all flex items-center gap-2 backdrop-blur-md border border-white/10 active:scale-95"
          >
            <RefreshCw size={18} className={isSyncing ? "animate-spin" : ""} /> 
            {isSyncing ? "Syncing..." : "Sync Database"}
          </button>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <MetricCard title="Total Patients" value={stats.totalPatients} icon={<UserCheck size={20} />} mainIcon={<Users size={28} />} theme="cyan" subtext="DB Registry" />
        <MetricCard title="Pending Bills" value={pendingBillingQueue.length} icon={<CreditCard size={20} />} mainIcon={<ClipboardList size={28} />} theme="rose" subtext="Unpaid Invoices" alert={pendingBillingQueue.length > 0} />
        <MetricCard title="Wait Queue" value={globalWaitQueue.length} icon={<Clock3 size={20} />} mainIcon={<AlertCircle size={28} />} theme="amber" subtext="Pending Intake" />
        <MetricCard title="Total Revenue" value={`${(stats.totalRevenue / 1000).toFixed(1)}k`} icon={<CheckCircle2 size={20} />} mainIcon={<span className="font-black text-lg">Rs.</span>} theme="emerald" subtext="Settled Cash Flow" />
      </div>

      {/* MAIN LAYOUT GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        
        {/* LEFT: OPERATORY MATRIX */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Live Operatory Status</h2>
              <p className="text-slate-500 text-sm mt-1">Releasing a patient generates an invoice in the Billing Queue.</p>
            </div>
            
            <div className="flex bg-white p-1.5 rounded-2xl items-center self-start sm:self-auto border border-slate-200 shadow-sm">
              {(['All', 'Available', 'Occupied'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setChairFilter(filter)}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                    chairFilter === filter 
                      ? 'bg-slate-900 text-white shadow-md' 
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredChairs.length === 0 ? (
              <div className="col-span-2 bg-white border border-dashed border-slate-300 rounded-3xl py-12 flex flex-col items-center justify-center text-slate-400">
                <AlertCircle size={40} className="mb-3 opacity-20" />
                <p className="font-bold">No operatories match this filter.</p>
              </div>
            ) : filteredChairs.map((chair) => (
              <div 
                key={chair.chairId} 
                className={`p-6 rounded-3xl flex flex-col justify-between gap-6 transition-all duration-300 relative group ${
                  chair.status === 'Available' 
                    ? 'bg-transparent border-2 border-dashed border-slate-200 hover:border-emerald-300' 
                    : 'bg-white border-2 border-transparent ring-1 ring-slate-100 shadow-xl shadow-slate-200/40'
                }`}
              >
                {/* Chair Header */}
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 items-center">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${chair.status === 'Available' ? 'bg-slate-100 text-slate-400' : 'bg-cyan-50 text-cyan-600'}`}>
                      <Stethoscope size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-lg leading-tight">{chair.chairName}</h4>
                      <p className="text-sm font-semibold text-slate-500 mt-0.5">Dr. {chair.doctor.NAME}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${STATUS_COLORS[chair.status as keyof typeof STATUS_COLORS]}`}>
                    {chair.status}
                  </span>
                </div>

                {/* Patient Display Area */}
                <div className={`p-5 rounded-2xl transition-all ${chair.status === 'Available' ? 'bg-slate-50/50' : 'bg-slate-50 border border-slate-100'}`}>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Patient</p>
                  <p className={`text-lg font-black truncate ${chair.status === 'Available' ? 'text-slate-300 italic' : 'text-slate-900'}`}>
                    {chair.activePatient ? chair.activePatient.PATIENT_NAME : 'Ready for Intake...'}
                  </p>
                  {chair.activePatient && (
                    <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-500 shadow-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                      In Progress (ID: #{chair.activePatient.APPOINTMENT_ID})
                    </div>
                  )}
                </div>

                {/* Action Area */}
                <div>
                  {chair.status === 'Occupied' && chair.activePatient ? (
                    <button
                      onClick={() => handleCompleteAndBill(chair.activePatient!)}
                      className="w-full py-3.5 rounded-2xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      Discharge & Bill <ChevronRight size={16} />
                    </button>
                  ) : (
                    <div className="w-full py-3.5 rounded-2xl text-sm font-bold bg-slate-100/50 text-slate-400 text-center border border-slate-100">
                      Awaiting Patient Assignment
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: SIDEBAR WIDGETS */}
        <div className="space-y-8 flex flex-col">
          
          {/* WAITING QUEUE */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden max-h-[400px]">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-xl"><Users size={20} /></div>
                  <h3 className="font-black text-slate-900">Wait Queue</h3>
                </div>
                <span className="bg-slate-900 text-white font-bold px-3 py-1 rounded-full text-xs">
                  {globalWaitQueue.length}
                </span>
              </div>
            </div>
            
            <div className="overflow-y-auto p-4 space-y-2 flex-1">
              {globalWaitQueue.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10">
                  <UserCheck size={32} className="mb-3 opacity-20" />
                  <p className="font-bold text-sm">The waiting room is empty.</p>
                </div>
              ) : (
                globalWaitQueue.map((patient, idx) => (
                  <div key={patient.APPOINTMENT_ID} className="p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all flex items-center gap-4 group">
                    <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-400 font-black text-xs flex items-center justify-center shrink-0 group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors">
                      {idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="text-sm font-bold text-slate-900 truncate">{patient.PATIENT_NAME}</h5>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5 truncate">For: Dr. {patient.DOCTOR_NAME}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* BILLING QUEUE */}
          <div className="bg-white rounded-3xl border border-rose-100 shadow-sm shadow-rose-100/50 flex flex-col overflow-hidden max-h-[400px]">
            <div className="p-6 border-b border-rose-50 bg-rose-50/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-100 text-rose-600 rounded-xl"><Receipt size={20} /></div>
                  <h3 className="font-black text-slate-900">Checkout / Billing</h3>
                </div>
                <span className="bg-rose-500 text-white font-bold px-3 py-1 rounded-full text-xs shadow-sm">
                  {pendingBillingQueue.length} Due
                </span>
              </div>
            </div>
            
            <div className="overflow-y-auto p-4 space-y-3 flex-1">
              {pendingBillingQueue.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10">
                  <CheckCircle2 size={32} className="mb-3 opacity-20 text-emerald-500" />
                  <p className="font-bold text-sm">All accounts settled.</p>
                </div>
              ) : (
                pendingBillingQueue.map((invoice) => (
                  <div key={invoice.ID} className="p-5 rounded-2xl bg-white border border-rose-100 shadow-sm flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 pr-2">
                        <h5 className="text-sm font-bold text-slate-900 truncate">{invoice.PATIENT_NAME || `Patient #${invoice.ID}`}</h5>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Inv: #{invoice.ID}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-black text-slate-900">Rs. {invoice.AMOUNT?.toLocaleString() || 12500}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleInitiatePayment(invoice)}
                      className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white text-xs font-bold rounded-xl transition-colors active:scale-95"
                    >
                      Settle Payment
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      {/* DASHBOARD RECEIPT MODAL */}
      {showReceiptModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 pb-0 flex justify-end">
              <button onClick={() => setShowReceiptModal(false)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Receipt Body */}
            <div className="px-10 pb-10">
              <div className="text-center mb-8">
                <div className="h-16 w-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
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

                <div className="pt-4 pb-2">
                  <span className="text-slate-500 mb-2 block">Services Rendered:</span>
                  {invoiceItems.length === 0 ? (
                    <div className="text-center py-4 text-slate-300 animate-pulse">Loading items...</div>
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
                  <span className="font-sans text-xs font-bold uppercase tracking-wider text-slate-500">Total Due</span>
                  <span className="text-xl font-black text-slate-900">Rs. {Number(selectedInvoice.AMOUNT).toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-10">
                <button
                  onClick={handleConfirmPayment}
                  disabled={isProcessingPayment}
                  className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 active:scale-[0.98] transition-all disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {isProcessingPayment ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={18} />
                  )}
                  {isProcessingPayment ? "Processing..." : "Confirm Payment"}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// --- HELPER COMPONENT FOR METRIC CARDS ---
function MetricCard({ title, value, icon, mainIcon, theme, subtext, alert = false }: any) {
  const themeStyles = {
    cyan: 'bg-cyan-50 text-cyan-600',
    rose: 'bg-rose-50 text-rose-600',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  };

  return (
    <div className={`bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden`}>
      {alert && (
        <span className="absolute top-0 right-0 w-2 h-2 m-6 rounded-full bg-rose-500 animate-pulse"></span>
      )}
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{title}</span>
          <h3 className="text-4xl font-black text-slate-900 mt-2 tracking-tight">{value}</h3>
          <p className={`text-xs font-bold flex items-center gap-1.5 mt-3 ${theme === 'emerald' ? 'text-emerald-600' : 'text-slate-500'}`}>
            <span className="opacity-70">{icon}</span> {subtext}
          </p>
        </div>
        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${themeStyles[theme as keyof typeof themeStyles]}`}>
          {mainIcon}
        </div>
      </div>
    </div>
  );
}
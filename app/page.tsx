'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  Users,
  Activity,
  Sparkles,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Clock3,
  PieChart as PieIcon,
  X,
  Stethoscope,
  ShieldAlert,
  LogOut,
  RefreshCw,
  UserPlus,
  CreditCard,
  Receipt
} from 'lucide-react';
import {
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

type TreatmentNode = { name: string; value: number; };

type ChairStatus = { 
  chairId: number; 
  chair: string; 
  activePatientId: number | null;
  patientName: string; 
  status: 'Occupied' | 'Available' | 'Sanitizing'; 
  procedure: string; 
  timer: number; 
};

// Strict Patient Tracking: Flow goes Waiting -> In Treatment -> Pending Payment -> Completed
type PatientRecord = { 
  id: number; 
  name: string; 
  condition: string; 
  waitTime: number; 
  status: 'Waiting' | 'In Treatment' | 'Pending Payment' | 'Completed';
  cost: number;
};

type DoctorOnDuty = { 
  id: number; 
  name: string; 
  specialty: string; 
  chairId: number; 
};

type DynamicStats = {
  checkedInToday: number;
  dailyRevenue: number;
  treatmentBreakdown: TreatmentNode[];
  chairUtilization: ChairStatus[];
  patientRegistry: PatientRecord[];
};

const STATUS_COLORS = {
  Occupied: 'bg-cyan-500 text-white',
  Available: 'bg-emerald-500 text-white',
  Sanitizing: 'bg-amber-500 text-white animate-pulse'
};

const METRIC_COLORS = ['#06B6D4', '#10B981', '#6366F1', '#F59E0B'];

// Automated Pricing Engine based on procedure
const PROCEDURE_COSTS: Record<string, number> = {
  'Orthodontics': 15000,
  'Endodontics': 25000,
  'Oral Surgery': 35000,
  'General Hygiene': 8000
};

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DynamicStats>({
    checkedInToday: 0, 
    dailyRevenue: 0,
    treatmentBreakdown: [], 
    chairUtilization: [],
    patientRegistry: []
  });

  const [doctors] = useState<DoctorOnDuty[]>([
    { id: 1, name: 'Dr. Amara Silva', specialty: 'Orthodontics', chairId: 1 },
    { id: 2, name: 'Dr. Jason Vance', specialty: 'Endodontics', chairId: 2 },
    { id: 3, name: 'Dr. Priya Nair', specialty: 'Oral Surgery', chairId: 3 },
    { id: 4, name: 'Dr. Liam Carter', specialty: 'General Hygiene', chairId: 4 }
  ]);
  
  const [chairFilter, setChairFilter] = useState<'All' | 'Available' | 'Occupied' | 'Sanitizing'>('All');
  const [showAlert, setShowAlert] = useState(true);
  
  const walkInCounter = useRef(1);

  // AUTOMATION ENGINE: Background Queue Processing & Timers
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => {
        let chairs = [...prev.chairUtilization];
        let registry = prev.patientRegistry.map(p => ({...p})); 
        let stateChanged = false;

        // 1. Process Chair Timers
        chairs = chairs.map(chair => {
          if (chair.status === 'Sanitizing') {
            stateChanged = true;
            if (chair.timer > 0) {
              return { ...chair, timer: chair.timer - 1 };
            } else {
              return { ...chair, status: 'Available', activePatientId: null, patientName: 'N/A', procedure: 'Ready for Intake', timer: 0 };
            }
          }
          if (chair.status === 'Occupied') {
            stateChanged = true;
            return { ...chair, timer: chair.timer + 1 };
          }
          return chair;
        });

        // 2. Increase wait times for patients STILL in the waiting queue
        registry = registry.map(p => {
          if (p.status === 'Waiting') {
            stateChanged = true;
            return { ...p, waitTime: p.waitTime + 1 };
          }
          return p;
        });

        // 3. STRICT AUTO-ASSIGNMENT LOGIC
        chairs.forEach((chair, index) => {
          if (chair.status === 'Available') {
            const assignedDoctor = doctors.find(d => d.chairId === chair.chairId);
            
            if (assignedDoctor) {
              const waitingPatient = registry.find(p => p.status === 'Waiting' && p.condition === assignedDoctor.specialty);
              
              if (waitingPatient) {
                stateChanged = true;
                waitingPatient.status = 'In Treatment';
                
                chairs[index] = {
                  ...chair,
                  status: 'Occupied',
                  activePatientId: waitingPatient.id,
                  patientName: waitingPatient.name,
                  procedure: waitingPatient.condition,
                  timer: 0
                };
              }
            }
          }
        });

        if (stateChanged) {
          return { ...prev, chairUtilization: chairs, patientRegistry: registry };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [doctors]);

  // Initial Data Load Setup
  useEffect(() => {
    setMetrics({
      checkedInToday: 24,
      dailyRevenue: 145000,
      treatmentBreakdown: [
        { name: 'Orthodontics', value: 35 },
        { name: 'Endodontics', value: 25 },
        { name: 'General Hygiene', value: 20 },
        { name: 'Oral Surgery', value: 15 }
      ],
      chairUtilization: [
        { chairId: 1, chair: 'Dental Chair 01', activePatientId: 100, patientName: 'Kusal Perera', status: 'Occupied', procedure: 'Orthodontics', timer: 120 },
        { chairId: 2, chair: 'Dental Chair 02', activePatientId: null, patientName: 'N/A', status: 'Available', procedure: 'Ready for Intake', timer: 0 },
        { chairId: 3, chair: 'Dental Chair 03', activePatientId: null, patientName: 'N/A', status: 'Sanitizing', procedure: 'Cleaning Room', timer: 4 },
        { chairId: 4, chair: 'Dental Chair 04', activePatientId: 101, patientName: 'J. Horowitz', status: 'Occupied', procedure: 'General Hygiene', timer: 450 }
      ],
      patientRegistry: [
        { id: 100, name: 'Kusal Perera', condition: 'Orthodontics', waitTime: 0, status: 'In Treatment', cost: PROCEDURE_COSTS['Orthodontics'] },
        { id: 101, name: 'J. Horowitz', condition: 'General Hygiene', waitTime: 0, status: 'In Treatment', cost: PROCEDURE_COSTS['General Hygiene'] },
        { id: 102, name: 'Sarah Mitchell', condition: 'Endodontics', waitTime: 300, status: 'Waiting', cost: PROCEDURE_COSTS['Endodontics'] },
        { id: 103, name: 'David Chen', condition: 'Oral Surgery', waitTime: 120, status: 'Waiting', cost: PROCEDURE_COSTS['Oral Surgery'] },
        { id: 99, name: 'Emma Wilson', condition: 'Orthodontics', waitTime: 45, status: 'Pending Payment', cost: PROCEDURE_COSTS['Orthodontics'] }
      ]
    });
  }, []);

  // Action: Release Patient to Billing
  const handleManualRelease = (chairId: number, patientIdToRelease: number | null) => {
    setMetrics(prev => {
      const updatedChairs = prev.chairUtilization.map(c => 
        c.chairId === chairId 
          ? { ...c, status: 'Sanitizing' as const, activePatientId: null, patientName: 'N/A', procedure: 'Manual Sanitization Cycle', timer: 5 } 
          : c
      );

      // Move patient to Billing queue
      const updatedRegistry = prev.patientRegistry.map(p => 
        p.id === patientIdToRelease 
          ? { ...p, status: 'Pending Payment' as const } 
          : p
      );

      return {
        ...prev,
        chairUtilization: updatedChairs,
        patientRegistry: updatedRegistry
      };
    });
  };

  // Action: Process Payment and Discharge Patient
  const handleProcessPayment = (patientId: number, amount: number) => {
    setMetrics(prev => ({
      ...prev,
      dailyRevenue: prev.dailyRevenue + amount,
      patientRegistry: prev.patientRegistry.map(p => 
        p.id === patientId ? { ...p, status: 'Completed' as const } : p
      )
    }));
  };

  // Walk-in Simulator
  const addRandomPatient = () => {
    const conditions = ['Orthodontics', 'Endodontics', 'Oral Surgery', 'General Hygiene'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const uniqueId = Date.now();
    const generatedName = `Walk-in #${walkInCounter.current}`;
    walkInCounter.current += 1;
    
    setMetrics(prev => ({
      ...prev,
      checkedInToday: prev.checkedInToday + 1,
      patientRegistry: [
        ...prev.patientRegistry, 
        { 
          id: uniqueId, 
          name: generatedName, 
          condition: randomCondition, 
          waitTime: 0, 
          status: 'Waiting',
          cost: PROCEDURE_COSTS[randomCondition]
        }
      ]
    }));
  };

  const filteredChairs = metrics.chairUtilization.filter(chair => {
    if (chairFilter === 'All') return true;
    return chair.status === chairFilter;
  });

  const activeWaitingQueue = metrics.patientRegistry.filter(p => p.status === 'Waiting');
  const pendingPayments = metrics.patientRegistry.filter(p => p.status === 'Pending Payment');

  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-8">
      
      {/* ALERTS STRIP */}
      {showAlert && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500 rounded-xl text-white">
              <ShieldAlert size={28} />
            </div>
            <div>
              <p className="text-base font-bold text-slate-900">Auto-Assignment Active</p>
              <p className="text-sm text-slate-600">Releasing a patient sends them directly to the <b>Billing Queue</b> for final checkout.</p>
            </div>
          </div>
          <button onClick={() => setShowAlert(false)} className="text-slate-400 hover:text-slate-600 p-2">
            <X size={24} />
          </button>
        </div>
      )}

      {/* OPERATIONS HEADER STRIP */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 lg:p-8 text-white border border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm uppercase tracking-widest">
            <Sparkles size={20} /> Clinic Operations Overview
          </div>
          <h1 className="text-3xl lg:text-4xl font-black mt-2">CarePulse Dental Hospital</h1>
          <p className="text-slate-400 text-base mt-1">Smart Auto-Routing Enabled. One Doctor Per Chair.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={addRandomPatient} className="px-6 py-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm transition flex items-center gap-2 shadow-sm">
            <UserPlus size={20} /> Simulate Walk-in
          </button>
        </div>
      </div>

      {/* OPERATIONAL COUNTERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Intake Flow</span>
            <h3 className="text-4xl font-black text-slate-900 mt-2">{metrics.checkedInToday}</h3>
            <p className="text-sm text-emerald-600 font-bold flex items-center gap-1 mt-2">
              <UserCheck size={20} /> Checked In Today
            </p>
          </div>
          <div className="h-16 w-16 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center"><Users size={32} /></div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Chair Usage</span>
            <h3 className="text-4xl font-black text-slate-900 mt-2">
              {metrics.chairUtilization.filter(c => c.status === 'Occupied').length} / 4
            </h3>
            <p className="text-sm text-cyan-600 font-bold flex items-center gap-1 mt-2">
              <Activity size={20} /> Active Operators
            </p>
          </div>
          <div className="h-16 w-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><ClipboardList size={32} /></div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Wait Queue</span>
            <h3 className="text-4xl font-black text-amber-600 mt-2">{activeWaitingQueue.length}</h3>
            <p className="text-sm text-amber-600 font-bold flex items-center gap-1 mt-2">
              <Clock3 size={20} /> Pending Assignment
            </p>
          </div>
          <div className="h-16 w-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center"><AlertCircle size={32} /></div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Daily Yield</span>
            <h3 className="text-4xl font-black text-emerald-600 mt-2">{(metrics.dailyRevenue / 1000).toFixed(1)}k</h3>
            <p className="text-sm text-slate-400 font-bold flex items-center gap-1 mt-2">
              <CheckCircle2 size={20} /> Settled Cash Flow
            </p>
          </div>
          <div className="h-16 w-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm">LKR</div>
        </div>
      </div>

      {/* MAIN MONITOR BLOCKS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        
        {/* CHAIR ALLOCATION MATRIX */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 lg:p-8 shadow-sm h-fit">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Operatory Room Status</h2>
              <p className="text-slate-500 text-sm mt-1">Assignment is automatic. Manual intervention is required to <b>Release</b> chairs.</p>
            </div>
            
            <div className="flex bg-slate-100 p-1.5 rounded-xl items-center self-start sm:self-auto overflow-x-auto max-w-full">
              {(['All', 'Available', 'Occupied', 'Sanitizing'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setChairFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition whitespace-nowrap ${
                    chairFilter === filter 
                      ? 'bg-white text-slate-900 shadow-md' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filteredChairs.map((chair) => {
              const assignedDoc = doctors.find(d => d.chairId === chair.chairId);

              return (
                <div 
                  key={chair.chairId} 
                  className={`p-6 rounded-2xl border-2 flex flex-col justify-between gap-5 transition relative ${
                    chair.status === 'Available' ? 'bg-emerald-50/40 border-emerald-200' : 
                    chair.status === 'Sanitizing' ? 'bg-amber-50/40 border-amber-200' :
                    'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-slate-900 text-lg">{chair.chair}</h4>
                      <p className="text-xs font-bold text-slate-500 flex items-center gap-1 mt-0.5">
                        <Stethoscope size={14} /> {assignedDoc?.name} ({assignedDoc?.specialty})
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${STATUS_COLORS[chair.status]}`}>
                        {chair.status}
                      </span>
                      {chair.status !== 'Available' && (
                        <span className="text-xs bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded-md font-mono font-bold flex items-center gap-1.5 shadow-sm">
                          {chair.status === 'Sanitizing' ? <RefreshCw size={14} className="animate-spin text-amber-500" /> : <Clock3 size={14} className="text-cyan-500" />}
                          {chair.timer}s
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Current Patient</p>
                    <p className={`text-lg font-black mt-1 ${chair.status === 'Available' ? 'text-slate-300 italic' : 'text-slate-900'}`}>
                      {chair.patientName}
                    </p>
                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Procedure / Condition</p>
                      <p className={`text-sm font-bold mt-0.5 ${chair.status === 'Available' ? 'text-slate-300' : 'text-cyan-600'}`}>
                        {chair.procedure}
                      </p>
                    </div>
                  </div>

                  <div className="h-12 flex items-end">
                    {chair.status === 'Occupied' ? (
                      <button
                        onClick={() => handleManualRelease(chair.chairId, chair.activePatientId)}
                        className="w-full py-3 rounded-xl text-sm font-black bg-rose-500 text-white hover:bg-rose-600 shadow-md transition flex items-center justify-center gap-2"
                      >
                        <LogOut size={20} /> Release to Billing
                      </button>
                    ) : chair.status === 'Sanitizing' ? (
                      <div className="w-full py-3 rounded-xl text-sm font-black bg-amber-100 text-amber-700 text-center flex items-center justify-center gap-2">
                        <RefreshCw size={20} className="animate-spin" /> Sanitizing Room...
                      </div>
                    ) : (
                      <div className="w-full py-3 rounded-xl text-sm font-black bg-emerald-100 text-emerald-700 text-center">
                        Waiting for matching patient...
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SIDEBAR WIDGETS */}
        <div className="space-y-6 flex flex-col">
          
          {/* BILLING & CHECKOUT QUEUE */}
          <div className="bg-white rounded-3xl border border-emerald-200 p-6 shadow-sm flex flex-col max-h-[350px]">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="text-emerald-500" size={24} />
                  <h3 className="text-xl font-black text-slate-900">Billing & Checkout</h3>
                </div>
                <span className="bg-emerald-100 text-emerald-700 font-bold px-2 py-1 rounded-lg text-xs">
                  {pendingPayments.length} Due
                </span>
              </div>
              <p className="text-slate-500 text-sm mt-1">Collect payments from discharged patients.</p>
            </div>
            
            <div className="space-y-3 overflow-y-auto pr-2 flex-1">
              {pendingPayments.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 py-6">
                  <Receipt size={40} className="mb-2 opacity-50" />
                  <p className="font-bold">All settled!</p>
                  <p className="text-xs">No pending checkouts.</p>
                </div>
              ) : (
                pendingPayments.map((patient) => (
                  <div key={patient.id} className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 flex flex-col gap-3 animate-in fade-in slide-in-from-right-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-sm font-bold text-slate-900">{patient.name}</h5>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">{patient.condition}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-emerald-600">Rs. {patient.cost.toLocaleString()}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleProcessPayment(patient.id, patient.cost)}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={16} /> Process Payment
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* LIVE WAITING QUEUE */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col max-h-[350px]">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="text-amber-500" size={24} />
                  <h3 className="text-xl font-black text-slate-900">Waiting Queue</h3>
                </div>
                <span className="bg-amber-100 text-amber-700 font-bold px-2 py-1 rounded-lg text-xs">
                  {activeWaitingQueue.length} Pending
                </span>
              </div>
            </div>
            
            <div className="space-y-3 overflow-y-auto pr-2 flex-1">
              {activeWaitingQueue.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 py-6">
                  <UserCheck size={40} className="mb-2 opacity-50" />
                  <p className="font-bold">Queue is empty!</p>
                </div>
              ) : (
                activeWaitingQueue.map((patient) => (
                  <div key={patient.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between animate-in fade-in slide-in-from-right-4">
                    <div>
                      <h5 className="text-sm font-bold text-slate-900">{patient.name}</h5>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-100 text-cyan-800">
                        Needs: {patient.condition}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Wait Time</p>
                      <p className="text-sm font-mono font-bold text-amber-600">{patient.waitTime}s</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
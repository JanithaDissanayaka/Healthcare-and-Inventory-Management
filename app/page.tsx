import React from 'react';
import Sidebar from "./components/sidebar";

// --- Reusable Stat Card Component ---
const StatCard = ({ title, value, trend, color }: { title: string, value: string, trend: string, color: string }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <div className="text-sm font-medium text-slate-500 mb-1">{title}</div>
    <div className="text-3xl font-bold text-slate-900 mb-2">{value}</div>
    <div className={`text-sm font-medium ${color}`}>↑ {trend}</div>
  </div>
);

export default function DashboardPage() {
  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      

      {/* KPI Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="TOTAL PATIENTS" value="2,481" trend="12% this month" color="text-emerald-600" />
        <StatCard title="TODAY'S APPOINTMENTS" value="37" trend="8 from yesterday" color="text-emerald-600" />
        <StatCard title="LOW STOCK ALERTS" value="6" trend="Needs reorder" color="text-amber-600" />
        <StatCard title="REVENUE (MONTH)" value="$84k" trend="23% vs last" color="text-emerald-600" />
      </section>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Spans 2 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Visits Chart */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-4">Patient Visits (This Week)</h2>
            <div className="h-48 flex items-end gap-2">
              {[40, 30, 45, 60, 80, 50, 30].map((h, i) => (
                <div key={i} className="flex-1 bg-emerald-100 rounded-t-sm hover:bg-emerald-500 transition-colors" style={{ height: `${h}%` }}></div>
              ))}
            </div>
          </div>

          {/* Appointments Table */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold text-slate-900">Today's Appointments</h2>
              <button className="text-emerald-600 text-sm">View all →</button>
            </div>
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-slate-100">
                {['08:30 Sarah Mitchell', '09:15 James Horowitz', '10:00 Priya Nair'].map((item, i) => (
                  <tr key={i} className="py-4">
                    <td className="py-3 font-medium text-slate-700">{item.split(' ')[0]}</td>
                    <td className="py-3 font-semibold">{item.split(' ').slice(1).join(' ')}</td>
                    <td className="py-3 text-right"><span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Confirmed</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Spans 1 */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-4">Quick Stats</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between"><span>Inpatients today</span> <span className="font-bold">14</span></li>
              <li className="flex justify-between"><span>Surgeries scheduled</span> <span className="font-bold">3</span></li>
              <li className="flex justify-between"><span>Prescriptions issued</span> <span className="font-bold">89</span></li>
            </ul>
          </div>

          {/* Inventory Alerts */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-4">Inventory Alerts</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1"><span>Amoxicillin 500mg</span> <span>12 left</span></div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-[60%]"></div></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1"><span>Insulin (Rapid)</span> <span>8 left</span></div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-red-500 w-[20%]"></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
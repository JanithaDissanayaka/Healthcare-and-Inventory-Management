
import StatusBadge from "@/app/components/StatusBadge";

const recentInvoices = [
  { id: "#INV-0420", patient: "J. Horowitz", amount: "$640", status: "Paid" },
  { id: "#INV-0419", patient: "P. Nair", amount: "$280", status: "Paid" },
  { id: "#INV-0418", patient: "R. Alvarez", amount: "$3,200", status: "Pending" },
  { id: "#INV-0417", patient: "E. Clarke", amount: "$195", status: "Paid" },
  { id: "#INV-0416", patient: "K. Thompson", amount: "$520", status: "Overdue" },
];

export default function BillingPage() {
  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Invoice Details */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Invoice #INV-2025-0421</h2>
              <p className="text-slate-500 mt-1">Patient: <span className="font-semibold text-slate-800">Sarah Mitchell · #P-00124</span></p>
            </div>
            <StatusBadge status="Pending" />
          </div>

          <div className="space-y-4 mb-8">
            {/* Invoice Line Items */}
            {[
              { label: "Consultation fee", val: "$120.00" },
              { label: "Cardiology procedure", val: "$850.00" },
              { label: "Medication (Amlodipine)", val: "$34.50" },
              { label: "Lab tests (lipid panel)", val: "$210.00" },
              { label: "Insurance deductible", val: "-$400.00", isNegative: true },
            ].map((item, i) => (
              <div key={i} className="flex justify-between py-3 border-b border-slate-50">
                <span className="text-slate-600">{item.label}</span>
                <span className={`font-medium ${item.isNegative ? 'text-emerald-600' : 'text-slate-900'}`}>{item.val}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-lg font-bold text-slate-900 mb-8">
            <span>Total Due</span>
            <span className="text-2xl">$814.50</span>
          </div>

          <div className="flex gap-4">
            <button className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700">Mark as Paid</button>
            <button className="flex-1 bg-white border border-slate-300 py-3 rounded-lg font-semibold text-slate-700 hover:bg-slate-50">Send Invoice</button>
          </div>
        </div>

        {/* Right Side: Recent Invoices List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 mb-4">Recent Invoices</h3>
          <div className="space-y-4">
            {recentInvoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer">
                <div>
                  <div className="text-sm font-semibold text-slate-900">{inv.id}</div>
                  <div className="text-xs text-slate-500">{inv.patient}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-900">{inv.amount}</div>
                  <div className="mt-1"><StatusBadge status={inv.status} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
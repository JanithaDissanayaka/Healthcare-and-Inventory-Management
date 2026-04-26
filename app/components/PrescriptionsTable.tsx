import StatusBadge from './StatusBadge';

export default function PrescriptionsTable({ prescriptions }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {["RX ID", "PATIENT", "MEDICATION", "DOSAGE", "DURATION", "PRESCRIBED BY", "STATUS"].map((h) => (
              <th key={h} className="p-4 font-semibold text-slate-600 uppercase tracking-wider text-xs">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {(prescriptions ?? []).map((p) => (
            <tr key={p.rxId} className="hover:bg-slate-50 transition-colors">
              <td className="p-4 text-slate-500 font-mono">{p.rxId}</td>
              <td className="p-4 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-xs text-indigo-700">
                  {p.initials}
                </div>
                <span className="font-semibold text-slate-900">{p.patientName}</span>
              </td>
              <td className="p-4 text-slate-700">{p.medication}</td>
              <td className="p-4 text-slate-600">{p.dosage}</td>
              <td className="p-4 text-slate-600">{p.duration}</td>
              <td className="p-4 text-slate-600">{p.doctor}</td>
              <td className="p-4">
                <StatusBadge status={p.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
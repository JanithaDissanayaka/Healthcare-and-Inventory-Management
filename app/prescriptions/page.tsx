export default function PatientsTable({ patients }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="p-4 font-semibold text-slate-600">PATIENT</th>
            <th className="p-4 font-semibold text-slate-600">ID</th>
            <th className="p-4 font-semibold text-slate-600">AGE</th>
            <th className="p-4 font-semibold text-slate-600">CONDITION</th>
            <th className="p-4 font-semibold text-slate-600">DOCTOR</th>
            <th className="p-4 font-semibold text-slate-600">LAST VISIT</th>
            <th className="p-4 font-semibold text-slate-600">STATUS</th>
            <th className="p-4 font-semibold text-slate-600"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {patients.map((p) => (
            <tr key={p.id} className="hover:bg-slate-50">
              <td className="p-4">
                <div className="font-semibold text-slate-900">{p.name}</div>
                <div className="text-slate-500 text-xs">{p.email}</div>
              </td>
              <td className="p-4 text-slate-600">{p.id}</td>
              <td className="p-4 text-slate-600">{p.age}</td>
              <td className="p-4 text-slate-600">{p.condition}</td>
              <td className="p-4 text-slate-600">{p.doctor}</td>
              <td className="p-4 text-slate-600">{p.lastVisit}</td>
              <td className="p-4">
                <StatusBadge status={p.status} />
              </td>
              <td className="p-4 text-emerald-600 font-medium cursor-pointer hover:underline">
                View →
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
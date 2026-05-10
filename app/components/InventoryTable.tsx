import StatusBadge from './StatusBadge';
import StockLevelBar from './StockLevelBar';

export default function InventoryTable({ items }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {["ITEM", "CATEGORY", "QUANTITY", "UNIT", "EXPIRY", "SUPPLIER", "STOCK LEVEL", "STATUS"].map((h) => (
              <th key={h} className="p-4 font-semibold text-slate-600 uppercase tracking-wider text-xs">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {(items ?? []).map((item) => (
            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
              <td className="p-4 font-semibold text-slate-900">{item.name}</td>
              <td className="p-4 text-slate-600">{item.category}</td>
              <td className="p-4 text-slate-600">{item.quantity}</td>
              <td className="p-4 text-slate-600">{item.unit}</td>
              <td className="p-4 text-slate-600">{item.expiry}</td>
              <td className="p-4 text-slate-600">{item.supplier}</td>
              <td className="p-4 flex items-center gap-2">
                <StockLevelBar status={item.status} />
                <span className="text-xs font-medium text-slate-500">{item.status}</span>
              </td>
              <td className="p-4">
                <StatusBadge status={item.status === 'Critical' ? 'Reorder' : 'In Stock'} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
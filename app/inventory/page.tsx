
import InventoryTable from "@/app/components/InventoryTable";

const inventoryData = [
  { id: 1, name: "Amoxicillin 500mg", category: "Antibiotics", quantity: 12, unit: "Capsule", expiry: "Jun 2025", supplier: "MedPharma Ltd", status: "Critical" },
  { id: 2, name: "Insulin Rapid 100U", category: "Hormones", quantity: 8, unit: "Vial", expiry: "Mar 2026", supplier: "BioMed Supplies", status: "Critical" },
  { id: 3, name: "Surgical Gloves (L)", category: "PPE", quantity: 45, unit: "Box", expiry: "Dec 2026", supplier: "SafeGear Co.", status: "Low" },
  { id: 4, name: "IV Saline 500ml", category: "IV Fluids", quantity: 68, unit: "Bag", expiry: "Sep 2026", supplier: "FluidCare Inc.", status: "OK" },
  { id: 5, name: "Paracetamol 500mg", category: "Analgesics", quantity: 320, unit: "Strip", expiry: "Jan 2027", supplier: "MedPharma Ltd", status: "Good" },
];

export default function InventoryPage() {
  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Items</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">412</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Low Stock</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">6</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expiring Soon</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">14</div>
        </div>
      </div>

      <InventoryTable items={inventoryData} />
    </div>
  );
}
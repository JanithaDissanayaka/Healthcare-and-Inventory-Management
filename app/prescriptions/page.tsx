
import PrescriptionsTable from "@/app/components/PrescriptionsTable";

const prescriptions = [
  { rxId: "#RX-2401", patientName: "Sarah Mitchell", initials: "SM", medication: "Amlodipine", dosage: "5mg once daily", duration: "30 days", doctor: "Dr. Patel", status: "Active" },
  { rxId: "#RX-2398", patientName: "James Horowitz", initials: "JH", medication: "Metformin", dosage: "500mg twice daily", duration: "90 days", doctor: "Dr. Chen", status: "Active" },
  { rxId: "#RX-2390", patientName: "Priya Nair", initials: "PN", medication: "Salbutamol Inhaler", dosage: "2 puffs as needed", duration: "60 days", doctor: "Dr. Wong", status: "Active" },
  { rxId: "#RX-2381", patientName: "Emma Clarke", initials: "EC", medication: "Betamethasone cream", dosage: "Apply twice daily", duration: "14 days", doctor: "Dr. Singh", status: "Pending" },
  { rxId: "#RX-2370", patientName: "Kevin Thompson", initials: "KT", medication: "Sumatriptan", dosage: "50mg as needed", duration: "30 days", doctor: "Dr. Patel", status: "Completed" },
];

export default function PrescriptionsPage() {
  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Prescriptions</h2>
        <p className="text-sm text-slate-500">89 issued this week</p>
      </div>

      <PrescriptionsTable prescriptions={prescriptions} />
    </div>
  );
}
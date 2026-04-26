export default function StatusBadge({ status }: { status: string }) {
  const styles = {
    Active: "bg-emerald-100 text-emerald-700",
    Pending: "bg-amber-100 text-amber-700",
    Completed: "bg-slate-100 text-slate-600",
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || "bg-gray-100"}`}>
      {status}
    </span>
  );
}
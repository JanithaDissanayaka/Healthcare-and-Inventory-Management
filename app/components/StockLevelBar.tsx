export default function StockLevelBar({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    Critical: "bg-red-500 w-1/4",
    Low: "bg-amber-500 w-2/4",
    OK: "bg-emerald-500 w-3/4",
    Good: "bg-emerald-500 w-full",
  };

  return (
    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${colorMap[status] || "bg-slate-300"}`} />
    </div>
  );
}
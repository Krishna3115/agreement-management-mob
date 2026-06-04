import React, { useEffect, useState } from "react";
import { reportApi } from "../../../services/fieldservice";
import { BarChart3, Box, Loader2 } from "lucide-react";

const PRIMARY = "#008d5b";
type Period = "today" | "week" | "month";

export default function FieldReports() {
  const [period, setPeriod] = useState<Period>("today");
  const [sp, setSp] = useState<any[]>([]);
  const [containers, setContainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = (p: Period) => {
    setLoading(true);
    Promise.all([
      reportApi.salespeopleRange(p).catch(() => []),
      reportApi.containers().catch(() => []),
    ]).then(([s, c]) => { setSp(s); setContainers(c); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(period); }, [period]);

  const labels: Record<Period, string> = { today: "Today", week: "This Week", month: "This Month" };

  // Grand totals across all salespeople for the period
  const grand = sp.reduce((acc, r) => ({
    sold: acc.sold + Number(r.totalSold || 0),
    collected: acc.collected + Number(r.totalCollected || 0),
    pending: acc.pending + Number(r.totalPending || 0),
    expense: acc.expense + Number(r.totalExpense || 0),
  }), { sold: 0, collected: 0, pending: 0, expense: 0 });

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="px-5 pt-6 pb-8 text-white rounded-b-[28px]" style={{ background: PRIMARY }}>
        <h1 className="text-2xl font-bold">Field Reports</h1>
        <p className="text-white/80 text-sm mt-1">Owner overview</p>
      </div>

      <div className="p-4 space-y-4">

        {/* Period filter */}
        <div className="flex bg-slate-100 rounded-2xl p-1">
          {(["today", "week", "month"] as Period[]).map((o) => (
            <button key={o} onClick={() => setPeriod(o)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${period === o ? "text-white" : "text-slate-500"}`}
              style={period === o ? { background: PRIMARY } : {}}>
              {labels[o]}
            </button>
          ))}
        </div>

        {/* Grand total band */}
        <div className="grid grid-cols-4 gap-2">
          <Mini label="Sold" v={grand.sold} c="#2563eb" />
          <Mini label="Collected" v={grand.collected} c="#059669" />
          <Mini label="Pending" v={grand.pending} c="#d97706" />
          <Mini label="Expense" v={grand.expense} c="#dc2626" />
        </div>

        {/* Per-salesperson */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <h2 className="font-bold flex items-center gap-2 mb-3">
            <BarChart3 size={18} color={PRIMARY} /> {labels[period]} by Salesperson
          </h2>
          {loading && <div className="flex justify-center py-4"><Loader2 className="animate-spin text-emerald-600" size={20} /></div>}
          {!loading && sp.length === 0 && <p className="text-xs text-slate-400">No data</p>}
          {sp.map((r: any) => (
            <div key={r.salesperson} className="p-3 rounded-2xl bg-slate-50 mb-2">
              <div className="flex justify-between items-center">
                <div className="font-semibold text-sm">{r.salesperson}</div>
                <div className="text-[10px] text-slate-400">{r.invoiceCount} sales</div>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-2 text-center text-xs">
                <div><p className="text-slate-400">Sold</p><p className="font-bold text-blue-600">{r.totalSold}</p></div>
                <div><p className="text-slate-400">Collected</p><p className="font-bold text-emerald-600">{r.totalCollected}</p></div>
                <div><p className="text-slate-400">Pending</p><p className="font-bold text-amber-600">{r.totalPending}</p></div>
                <div><p className="text-slate-400">Expense</p><p className="font-bold text-red-500">{r.totalExpense}</p></div>
              </div>
              <div className="text-right text-xs mt-2 font-bold" style={{ color: PRIMARY }}>Net: {r.net}</div>
            </div>
          ))}
        </div>

        {/* Containers (all-time stock + realized) */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <h2 className="font-bold flex items-center gap-2 mb-3"><Box size={18} color={PRIMARY} /> Container Stock & Realized</h2>
          {containers.map((c: any) => (
            <div key={c.containerNo} className="p-3 rounded-2xl bg-slate-50 mb-2">
              <div className="flex justify-between">
                <span className="font-semibold text-sm">{c.containerNo}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${c.status === "FINISHED" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>{c.status}</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Received {String(c.totalReceivedQty)} · Sold {String(c.totalSoldQty)} · Remaining {String(c.totalRemainingQty)}
              </div>
              <div className="text-sm font-bold mt-1" style={{ color: PRIMARY }}>Realized: {String(c.realizedAmount)}</div>
            </div>
          ))}
        </div>

        
      </div>
    </div>
  );
}

function Mini({ label, v, c }: { label: string; v: number; c: string }) {
  return (
    <div className="bg-white rounded-2xl p-2 text-center shadow-sm">
      <p className="text-[9px] text-slate-400">{label}</p>
      <p className="font-bold text-sm" style={{ color: c }}>{v.toFixed(0)}</p>
    </div>
    
  );
}

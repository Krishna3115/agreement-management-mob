import React, { useEffect, useState } from "react";
import {
  salespersonApi, containerApi, settlementApi,
  containerExpenseApi, ownerExtraApi,
} from "../../services/fieldservice";
import {
  Wallet, Box, Receipt, Users, Loader2, Plus, CheckCircle2,
  AlertTriangle, TrendingUp,
} from "lucide-react";

const PRIMARY = "#008d5b";
type Tab = "settle" | "containerExp" | "expenses" | "detail";

export default function AdminFieldOps() {
  const [tab, setTab] = useState<Tab>("settle");

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="px-5 pt-6 pb-8 text-white rounded-b-[28px]" style={{ background: PRIMARY }}>
        <h1 className="text-2xl font-bold">Field Operations</h1>
        <p className="text-white/80 text-sm mt-1">Settlements · Expenses · Clarity</p>
      </div>

      <div className="px-4 -mt-4">
        <div className="bg-white rounded-2xl p-1 shadow-sm flex text-xs font-semibold">
          <TabBtn active={tab === "settle"} onClick={() => setTab("settle")} label="Cash Settle" />
          <TabBtn active={tab === "containerExp"} onClick={() => setTab("containerExp")} label="Container Exp" />
          <TabBtn active={tab === "expenses"} onClick={() => setTab("expenses")} label="All Expenses" />
          <TabBtn active={tab === "detail"} onClick={() => setTab("detail")} label="By Person" />
        </div>
      </div>

      <div className="p-4">
        {tab === "settle" && <SettleTab />}
        {tab === "containerExp" && <ContainerExpTab />}
        {tab === "expenses" && <AllExpensesTab />}
        {tab === "detail" && <SalespersonDetailTab />}
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, label }: any) {
  return (
    <button onClick={onClick}
      className={`flex-1 py-2 rounded-xl transition ${active ? "text-white" : "text-slate-500"}`}
      style={active ? { background: PRIMARY } : {}}>
      {label}
    </button>
  );
}

// ════════════ CASH SETTLEMENT ════════════
function SettleTab() {
  const [people, setPeople] = useState<string[]>([]);
  const [salesperson, setSalesperson] = useState("");
  const [expected, setExpected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => { salespersonApi.list().then(setPeople).catch(() => {}); }, []);

  useEffect(() => {
    if (!salesperson) { setExpected(null); setHistory([]); return; }
    settlementApi.expected(salesperson).then((d) => setExpected(Number(d.expectedAmount || 0))).catch(() => setExpected(null));
    settlementApi.bySalesperson(salesperson).then(setHistory).catch(() => setHistory([]));
  }, [salesperson]);

  const sub = Number(submitted || 0);
  const diff = expected != null ? sub - expected : 0;

  const save = async () => {
    if (!salesperson) { alert("Select salesperson"); return; }
    if (!submitted) { alert("Enter submitted amount"); return; }
    setSaving(true);
    try {
      await settlementApi.record({ salesperson, submittedAmount: sub, note });
      alert("Settlement recorded");
      setSubmitted(""); setNote("");
      settlementApi.bySalesperson(salesperson).then(setHistory).catch(() => {});
    } catch (e: any) { alert(e?.response?.data?.message || "Failed"); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-4 mt-3">
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
        <h2 className="font-bold flex items-center gap-2"><Wallet size={18} color={PRIMARY} /> Record Daily Cash</h2>

        <select className="w-full border rounded-2xl p-3 text-sm" value={salesperson} onChange={(e) => setSalesperson(e.target.value)}>
          <option value="">Select Salesperson</option>
          {people.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        {expected != null && (
          <div className="rounded-2xl p-4 space-y-2" style={{ background: "#f0fdf4" }}>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Expected (collected today)</span>
              <span className="font-bold text-emerald-700">{expected.toFixed(2)}</span>
            </div>
          </div>
        )}

        <input type="number" className="w-full border rounded-2xl p-3 text-sm" placeholder="Amount submitted by salesperson"
          value={submitted} onChange={(e) => setSubmitted(e.target.value)} />

        {expected != null && submitted !== "" && (
          <div className={`rounded-2xl p-3 text-sm flex items-center justify-between ${diff < 0 ? "bg-red-50" : "bg-blue-50"}`}>
            <span className="flex items-center gap-2">
              {diff < 0 ? <AlertTriangle size={16} className="text-red-500" /> : <CheckCircle2 size={16} className="text-blue-600" />}
              {diff < 0 ? "Shortfall" : diff > 0 ? "Excess" : "Matches exactly"}
            </span>
            <span className={`font-bold ${diff < 0 ? "text-red-600" : "text-blue-700"}`}>{diff.toFixed(2)}</span>
          </div>
        )}

        <input className="w-full border rounded-2xl p-3 text-sm" placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />

        <button onClick={save} disabled={saving}
          className="w-full py-3 rounded-2xl text-white font-semibold flex justify-center gap-2" style={{ background: PRIMARY }}>
          {saving ? <Loader2 className="animate-spin" size={16} /> : "Save Settlement"}
        </button>
      </div>

      {history.length > 0 && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-bold mb-3">Settlement History — {salesperson}</h3>
          {history.map((s) => (
            <div key={s.id} className="p-3 rounded-2xl bg-slate-50 mb-2">
              <div className="flex justify-between text-sm">
                <span>{s.settlementDate}</span>
                <span className="font-semibold">Submitted {Number(s.submittedAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Expected {Number(s.expectedAmount).toFixed(2)}</span>
                <span className={Number(s.difference) < 0 ? "text-red-600 font-semibold" : "text-emerald-600 font-semibold"}>
                  Diff {Number(s.difference).toFixed(2)}
                </span>
              </div>
              {s.note && <div className="text-[11px] text-slate-400 mt-1">{s.note}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ════════════ CONTAINER EXPENSE ════════════
function ContainerExpTab() {
  const [containers, setContainers] = useState<any[]>([]);
  const [containerId, setContainerId] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [list, setList] = useState<any[]>([]);

  const loadContainers = () => containerApi.all().then(setContainers).catch(() => {});
  useEffect(() => { loadContainers(); }, []);
  useEffect(() => {
    if (!containerId) { setList([]); return; }
    containerExpenseApi.forContainer(Number(containerId)).then(setList).catch(() => setList([]));
  }, [containerId]);

  const save = async () => {
    if (!containerId || !description.trim() || !amount) { alert("Fill all fields"); return; }
    setSaving(true);
    try {
      await containerExpenseApi.add({ containerId: Number(containerId), description, amount: Number(amount) });
      setDescription(""); setAmount("");
      containerExpenseApi.forContainer(Number(containerId)).then(setList).catch(() => {});
      alert("Container expense added");
    } catch (e: any) { alert(e?.response?.data?.message || "Failed"); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-4 mt-3">
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
        <h2 className="font-bold flex items-center gap-2"><Box size={18} color={PRIMARY} /> Container Expense</h2>
        <select className="w-full border rounded-2xl p-3 text-sm" value={containerId} onChange={(e) => setContainerId(e.target.value)}>
          <option value="">Select Container</option>
          {containers.map((c) => <option key={c.id} value={c.id}>{c.containerNo}</option>)}
        </select>
        <input className="w-full border rounded-2xl p-3 text-sm" placeholder="Description (e.g. DPW charges)" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="number" className="w-full border rounded-2xl p-3 text-sm" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <button onClick={save} disabled={saving}
          className="w-full py-3 rounded-2xl text-white font-semibold flex justify-center gap-2" style={{ background: PRIMARY }}>
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />} Add Expense
        </button>
      </div>

      {containerId && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-bold mb-3">Expenses for this container</h3>
          {list.length === 0 && <p className="text-xs text-slate-400">None yet</p>}
          {list.map((e) => (
            <div key={e.id} className="flex justify-between text-sm py-2 border-b last:border-0">
              <span>{e.description}<span className="text-[10px] text-slate-400 ml-2">{e.expenseDate}</span></span>
              <span className="font-semibold text-red-500">{e.amount}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ════════════ ALL EXPENSES (combined) ════════════
function AllExpensesTab() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    ownerExtraApi.allExpenses().then(setList).catch(() => setList([])).finally(() => setLoading(false));
  }, []);

  const total = list.reduce((s, e) => s + Number(e.amount || 0), 0);

  return (
    <div className="space-y-4 mt-3">
      <div className="bg-white rounded-2xl p-3 text-center shadow-sm">
        <p className="text-[10px] text-slate-400">Total Expenses (all)</p>
        <p className="font-bold text-lg text-red-500">{total.toFixed(2)}</p>
      </div>
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
        <h2 className="font-bold flex items-center gap-2 mb-3"><Receipt size={18} color={PRIMARY} /> All Expenses</h2>
        {loading && <div className="flex justify-center py-4"><Loader2 className="animate-spin text-emerald-600" size={20} /></div>}
        {!loading && list.length === 0 && <p className="text-xs text-slate-400">No expenses recorded</p>}
        {list.map((e, i) => (
          <div key={i} className="flex justify-between items-start text-sm py-2 border-b last:border-0">
            <div>
              <span className={`text-[9px] px-2 py-0.5 rounded-full mr-2 ${e.type === "CONTAINER" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
                {e.type === "CONTAINER" ? "Container" : "Salesperson"}
              </span>
              {e.description}
              <div className="text-[10px] text-slate-400 mt-0.5">{e.source} · {e.date}</div>
            </div>
            <span className="font-semibold text-red-500">{e.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════ SALESPERSON DETAIL ════════════
function SalespersonDetailTab() {
  const [people, setPeople] = useState<string[]>([]);
  const [username, setUsername] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { salespersonApi.list().then(setPeople).catch(() => {}); }, []);
  useEffect(() => {
    if (!username) { setData(null); return; }
    setLoading(true);
    ownerExtraApi.salespersonDetail(username).then(setData).catch(() => setData(null)).finally(() => setLoading(false));
  }, [username]);

  return (
    <div className="space-y-4 mt-3">
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
        <h2 className="font-bold flex items-center gap-2"><Users size={18} color={PRIMARY} /> Salesperson Detail</h2>
        <select className="w-full border rounded-2xl p-3 text-sm" value={username} onChange={(e) => setUsername(e.target.value)}>
          <option value="">Select Salesperson</option>
          {people.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {loading && <div className="flex justify-center py-4"><Loader2 className="animate-spin text-emerald-600" size={20} /></div>}

      {data && (
        <>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white rounded-2xl p-3 text-center shadow-sm"><p className="text-[10px] text-slate-400">Sold</p><p className="font-bold text-blue-600">{Number(data.totalSold).toFixed(0)}</p></div>
            <div className="bg-white rounded-2xl p-3 text-center shadow-sm"><p className="text-[10px] text-slate-400">Collected</p><p className="font-bold text-emerald-600">{Number(data.totalCollected).toFixed(0)}</p></div>
            <div className="bg-white rounded-2xl p-3 text-center shadow-sm"><p className="text-[10px] text-slate-400">Pending</p><p className="font-bold text-amber-600">{Number(data.totalPending).toFixed(0)}</p></div>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
            <h3 className="font-bold mb-3 flex items-center gap-2"><TrendingUp size={16} color={PRIMARY} /> Sell History ({(data.invoices || []).length})</h3>
            {(data.invoices || []).map((i: any) => (
              <div key={i.id} className="p-3 rounded-2xl bg-slate-50 mb-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-sm">{i.buyer?.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">{String(i.paymentMode).replace(/_/g, " ")}</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">{i.invoiceNo} · {i.invoiceDate}</div>
                <div className="text-xs text-slate-500">Total {i.grandTotal} · Paid {i.amountPaid} · Pending {i.amountPending}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
            <h3 className="font-bold mb-3">Expenses ({(data.expenses || []).length})</h3>
            {(data.expenses || []).map((e: any) => (
              <div key={e.id} className="flex justify-between text-sm py-2 border-b last:border-0">
                <span>{e.description}<span className="text-[10px] text-slate-400 ml-2">{e.expenseDate}</span></span>
                <span className="font-semibold text-red-500">{e.amount}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

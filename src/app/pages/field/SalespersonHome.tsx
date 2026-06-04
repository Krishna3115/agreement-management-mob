import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  buyerApi, containerApi, fieldInvoiceApi, paymentApi, expenseApi,
} from "../../../services/fieldservice";
import {
  UserPlus, ShoppingCart, Wallet, Receipt, Plus, Loader2, Mail,
  Download, Trash2, LogOut, TrendingUp, CheckCircle2, History, Package,
} from "lucide-react";

const PRIMARY = "#008d5b";
const PRIMARY_DARK = "#00663f";
type Tab = "sell" | "buyer" | "payments" | "history";
type Period = "today" | "week" | "month";

// Shared premium style tokens
const CARD =
  "bg-white rounded-[26px] p-5 border border-slate-100 shadow-[0_10px_40px_-12px_rgba(0,80,50,0.18)]";
const INPUT =
  "w-full rounded-2xl px-4 py-3 text-sm bg-slate-50 border border-slate-200/80 outline-none transition focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 placeholder:text-slate-400";
const LABEL = "text-[11px] font-semibold uppercase tracking-wider text-slate-400";

export default function SalespersonHome() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("sell");

  const logout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_role");
    navigate("/login");
  };

  const titles: Record<Tab, string> = {
    sell: "New Sale", buyer: "Buyers", payments: "Payments", history: "History",
  };

  return (
    <div className="min-h-screen pb-28" style={{ background: "linear-gradient(180deg,#eefaf3 0%,#f6f9f7 22%,#f8fafc 100%)" }}>
      {/* ── Premium header ── */}
      <div
        className="relative overflow-hidden text-white"
        style={{
          background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_DARK} 100%)`,
          borderBottomLeftRadius: 34, borderBottomRightRadius: 34,
          paddingTop: "calc(env(safe-area-inset-top,0) + 1.6rem)",
        }}
      >
        {/* glow accents */}
        <div className="absolute -top-16 -right-10 w-52 h-52 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle,#9bffd0,transparent 70%)" }} />
        <div className="absolute -bottom-20 -left-8 w-48 h-48 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle,#ffffff,transparent 70%)" }} />

        <div className="relative px-5 pb-7">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/70 text-[11px] font-medium tracking-wide uppercase">Exponab Field</p>
              <h1 className="text-2xl font-bold leading-tight mt-0.5">{titles[tab]}</h1>
            </div>
            <button onClick={logout}
              className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center active:scale-95 transition border border-white/10">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 -mt-3 relative z-10">
        {tab === "sell" && <SellTab />}
        {tab === "buyer" && <BuyerTab />}
        {tab === "payments" && <PaymentsTab />}
        {tab === "history" && <HistoryTab />}
      </div>

      {/* ── Floating glass nav ── */}
      <div className="fixed bottom-0 left-0 right-0 px-4"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom,0) + 0.6rem)" }}>
        <div className="mx-auto max-w-md bg-white/90 backdrop-blur-xl border border-slate-200/70 rounded-[24px] shadow-[0_8px_30px_-6px_rgba(0,60,40,0.25)] flex justify-around py-2.5">
          <NavBtn active={tab === "sell"} onClick={() => setTab("sell")} icon={<ShoppingCart size={20} />} label="Sell" />
          <NavBtn active={tab === "buyer"} onClick={() => setTab("buyer")} icon={<UserPlus size={20} />} label="Buyers" />
          <NavBtn active={tab === "payments"} onClick={() => setTab("payments")} icon={<Wallet size={20} />} label="Payments" />
          <NavBtn active={tab === "history"} onClick={() => setTab("history")} icon={<History size={20} />} label="History" />
        </div>
      </div>
    </div>
  );
}

function NavBtn({ active, onClick, icon, label }: any) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 px-3 transition active:scale-90">
      <div className="flex items-center justify-center w-11 h-9 rounded-2xl transition"
        style={active ? { background: "rgba(0,141,91,0.12)", color: PRIMARY } : { color: "#94a3b8" }}>
        {icon}
      </div>
      <span className="text-[10px] font-bold tracking-wide" style={{ color: active ? PRIMARY : "#94a3b8" }}>{label}</span>
    </button>
  );
}

// Section heading with icon chip
function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <h2 className="font-bold text-slate-800 flex items-center gap-2.5 text-[15px]">
      <span className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,141,91,0.12)", color: PRIMARY }}>{icon}</span>
      {children}
    </h2>
  );
}

function PrimaryButton({ onClick, disabled, loading, children }: any) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex justify-center items-center gap-2 transition active:scale-[0.98] disabled:opacity-60 shadow-[0_8px_20px_-6px_rgba(0,141,91,0.6)]"
      style={{ background: `linear-gradient(135deg,${PRIMARY},${PRIMARY_DARK})` }}>
      {loading ? <Loader2 className="animate-spin" size={16} /> : children}
    </button>
  );
}

function PeriodTabs({ value, onChange }: { value: Period; onChange: (p: Period) => void }) {
  const opts: Period[] = ["today", "week", "month"];
  const labels: Record<Period, string> = { today: "Today", week: "This Week", month: "This Month" };
  return (
    <div className="flex bg-white border border-slate-200/70 rounded-2xl p-1 shadow-sm">
      {opts.map((o) => (
        <button key={o} onClick={() => onChange(o)}
          className="flex-1 py-2.5 rounded-xl text-xs font-bold transition active:scale-95"
          style={value === o
            ? { background: `linear-gradient(135deg,${PRIMARY},${PRIMARY_DARK})`, color: "#fff", boxShadow: "0 6px 14px -6px rgba(0,141,91,0.7)" }
            : { color: "#64748b" }}>
          {labels[o]}
        </button>
      ))}
    </div>
  );
}

// ════════════════════ SELL TAB ════════════════════
function SellTab() {
  const [buyers, setBuyers] = useState<any[]>([]);
  const [containers, setContainers] = useState<any[]>([]);
  const [buyerId, setBuyerId] = useState("");
  const [vatMode, setVatMode] = useState<"WITH_VAT" | "WITHOUT_VAT">("WITHOUT_VAT");
  const [paymentMode, setPaymentMode] = useState<"CASH" | "CREDIT" | "HALF_CASH_HALF_CREDIT">("CASH");
  const [cashPortion, setCashPortion] = useState("");
  const [lines, setLines] = useState<any[]>([]);
  const [draft, setDraft] = useState({ stockId: "", quantity: "", ratePerBox: "" });
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState<any>(null);

  const loadData = () => {
    buyerApi.all().then(setBuyers).catch(() => {});
    containerApi.all().then(setContainers).catch(() => {});
  };
  useEffect(() => { loadData(); }, []);

  const stockOptions: any[] = [];
  containers.forEach((c) => (c.stocks || []).forEach((s: any) => {
    const remaining = Number(s.receivedQty) - Number(s.soldQty);
    if (remaining > 0) stockOptions.push({ stockId: s.id, label: `${c.containerNo} · ${s.productName} (${remaining} left)` });
  }));

  const addLine = () => {
    if (!draft.stockId || !draft.quantity || !draft.ratePerBox) { alert("Select product, qty and rate"); return; }
    const opt = stockOptions.find((o) => String(o.stockId) === String(draft.stockId));
    setLines([...lines, { stockId: Number(draft.stockId), label: opt?.label, quantity: Number(draft.quantity), ratePerBox: Number(draft.ratePerBox) }]);
    setDraft({ stockId: "", quantity: "", ratePerBox: "" });
  };

  const subtotal = lines.reduce((s, l) => s + l.quantity * l.ratePerBox, 0);
  const vat = vatMode === "WITH_VAT" ? subtotal * 0.05 : 0;
  const grand = subtotal + vat;

  const generate = async () => {
    if (!buyerId) { alert("Select a buyer"); return; }
    if (lines.length === 0) { alert("Add at least one item"); return; }
    setSaving(true);
    try {
      const inv = await fieldInvoiceApi.create({
        buyerId: Number(buyerId), vatMode, paymentMode,
        cashPortion: paymentMode === "HALF_CASH_HALF_CREDIT" ? Number(cashPortion || 0) : undefined,
        items: lines.map((l) => ({ stockId: l.stockId, quantity: l.quantity, ratePerBox: l.ratePerBox })),
      });
      setCreated(inv); setLines([]); setBuyerId(""); setCashPortion(""); loadData();
    } catch (e: any) { alert(e?.response?.data?.message || e?.message || "Failed"); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-4">
      <div className={CARD + " space-y-4"}>
        <SectionTitle icon={<ShoppingCart size={16} />}>New Sale</SectionTitle>

        <div>
          <label className={LABEL}>Buyer</label>
          <select className={INPUT + " mt-1.5"} value={buyerId} onChange={(e) => setBuyerId(e.target.value)}>
            <option value="">Select Buyer</option>
            {buyers.map((b) => <option key={b.id} value={b.id}>{b.name}{b.companyName ? ` (${b.companyName})` : ""}</option>)}
          </select>
        </div>

        {/* Add product */}
        <div className="rounded-2xl p-4 space-y-2.5 border border-dashed border-emerald-200" style={{ background: "linear-gradient(135deg,#f0fdf6,#f7fdfb)" }}>
          <p className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: PRIMARY }}>
            <Package size={13} /> Add product from container
          </p>
          <select className={INPUT + " bg-white"} value={draft.stockId}
            onChange={(e) => setDraft({ ...draft, stockId: e.target.value })}>
            <option value="">Select container · product</option>
            {stockOptions.map((o) => <option key={o.stockId} value={o.stockId}>{o.label}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" className={INPUT + " bg-white"} placeholder="Quantity"
              value={draft.quantity} onChange={(e) => setDraft({ ...draft, quantity: e.target.value })} />
            <input type="number" className={INPUT + " bg-white"} placeholder="Rate / box"
              value={draft.ratePerBox} onChange={(e) => setDraft({ ...draft, ratePerBox: e.target.value })} />
          </div>
          <button onClick={addLine}
            className="w-full py-2.5 rounded-xl text-sm font-bold flex justify-center items-center gap-2 transition active:scale-95 border-2"
            style={{ borderColor: PRIMARY, color: PRIMARY, background: "#fff" }}>
            <Plus size={15} /> Add to invoice
          </button>
        </div>

        {/* Line items */}
        {lines.length > 0 && (
          <div className="space-y-2">
            {lines.map((l, i) => (
              <div key={i} className="flex justify-between items-center p-3.5 rounded-2xl text-sm border border-emerald-100"
                style={{ background: "linear-gradient(135deg,#ecfdf3,#f6fefb)" }}>
                <div className="min-w-0">
                  <div className="font-bold text-slate-800 truncate">{l.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{l.quantity} × {l.ratePerBox} = <span className="font-semibold" style={{ color: PRIMARY }}>{(l.quantity * l.ratePerBox).toFixed(2)}</span></div>
                </div>
                <button onClick={() => setLines(lines.filter((_, x) => x !== i))}
                  className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center active:scale-90 transition shrink-0 ml-2"><Trash2 size={15} /></button>
              </div>
            ))}
          </div>
        )}

        {/* VAT */}
        <div>
          <label className={LABEL}>VAT</label>
          <div className="grid grid-cols-2 gap-2 mt-1.5">
            {(["WITHOUT_VAT", "WITH_VAT"] as const).map((m) => (
              <button key={m} onClick={() => setVatMode(m)}
                className="py-2.5 rounded-xl text-sm font-bold transition active:scale-95"
                style={vatMode === m
                  ? { background: `linear-gradient(135deg,${PRIMARY},${PRIMARY_DARK})`, color: "#fff", boxShadow: "0 6px 14px -6px rgba(0,141,91,0.6)" }
                  : { background: "#f1f5f9", color: "#64748b" }}>
                {m === "WITHOUT_VAT" ? "Without VAT" : "With VAT (5%)"}
              </button>
            ))}
          </div>
        </div>

        {/* Payment mode */}
        <div>
          <label className={LABEL}>Payment Mode</label>
          <select className={INPUT + " mt-1.5"} value={paymentMode} onChange={(e) => setPaymentMode(e.target.value as any)}>
            <option value="CASH">Cash</option>
            <option value="CREDIT">Credit (Udhar)</option>
            <option value="HALF_CASH_HALF_CREDIT">Half Cash + Half Credit</option>
          </select>
          {paymentMode === "HALF_CASH_HALF_CREDIT" && (
            <input type="number" className={INPUT + " mt-2"} placeholder="Cash amount paid now"
              value={cashPortion} onChange={(e) => setCashPortion(e.target.value)} />
          )}
        </div>

        {/* Totals */}
        <div className="rounded-2xl p-4 space-y-2 text-sm text-white" style={{ background: `linear-gradient(135deg,${PRIMARY},${PRIMARY_DARK})` }}>
          <div className="flex justify-between text-white/80"><span>Subtotal</span><span className="font-semibold text-white">{subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-white/80"><span>VAT</span><span className="font-semibold text-white">{vat.toFixed(2)}</span></div>
          <div className="flex justify-between items-center border-t border-white/20 pt-2 mt-1">
            <span className="font-semibold">Grand Total</span>
            <span className="font-extrabold text-xl">{grand.toFixed(2)}</span>
          </div>
        </div>

        <PrimaryButton onClick={generate} disabled={saving} loading={saving}>Generate Invoice</PrimaryButton>
      </div>

      {created && (
        <div className={CARD.replace("border-slate-100", "border-emerald-200") + " space-y-3"}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "rgba(0,141,91,0.12)", color: PRIMARY }}><CheckCircle2 size={22} /></div>
            <div>
              <h3 className="font-bold text-slate-800">Invoice created</h3>
              <p className="text-xs text-slate-500">{created.invoiceNo}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => fieldInvoiceApi.downloadPdf(created.id)}
              className="flex-1 py-2.5 rounded-2xl bg-slate-100 text-slate-700 text-sm font-bold flex justify-center items-center gap-2 active:scale-95 transition"><Download size={15} /> Download</button>
            <button onClick={async () => { try { await fieldInvoiceApi.sendMail(created.id); alert("Sent to buyer email"); } catch (e: any) { alert(e?.response?.data?.message || "Email failed"); } }}
              className="flex-1 py-2.5 rounded-2xl text-white text-sm font-bold flex justify-center items-center gap-2 active:scale-95 transition" style={{ background: `linear-gradient(135deg,${PRIMARY},${PRIMARY_DARK})` }}><Mail size={15} /> Email Buyer</button>
          </div>
          <button onClick={() => setCreated(null)} className="w-full py-2 text-slate-400 text-sm font-semibold">Done</button>
        </div>
      )}
    </div>
  );
}

// ════════════════════ BUYER TAB ════════════════════
function BuyerTab() {
  const [buyers, setBuyers] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", companyName: "", mobile: "", email: "", address: "" });
  const [saving, setSaving] = useState(false);
  const load = () => buyerApi.all().then(setBuyers).catch(() => {});
  useEffect(() => { load(); }, []);
  const save = async () => {
    if (!form.name.trim()) { alert("Buyer name required"); return; }
    setSaving(true);
    try { await buyerApi.add(form); setForm({ name: "", companyName: "", mobile: "", email: "", address: "" }); load(); alert("Buyer added"); }
    catch (e: any) { alert(e?.response?.data?.message || "Failed"); } finally { setSaving(false); }
  };
  return (
    <div className="space-y-4">
      <div className={CARD + " space-y-3"}>
        <SectionTitle icon={<UserPlus size={16} />}>Add Buyer</SectionTitle>
        <input className={INPUT} placeholder="Buyer Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className={INPUT} placeholder="Company Name (optional)" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
        <input className={INPUT} placeholder="Mobile No." value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
        <input className={INPUT} placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <textarea className={INPUT + " resize-none h-20"} placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <PrimaryButton onClick={save} disabled={saving} loading={saving}><Plus size={16} /> Add Buyer</PrimaryButton>
      </div>
      <div className={CARD}>
        <div className="flex items-center justify-between mb-3">
          <SectionTitle icon={<UserPlus size={16} />}>All Buyers</SectionTitle>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "rgba(0,141,91,0.1)", color: PRIMARY }}>{buyers.length}</span>
        </div>
        <div className="space-y-2">
          {buyers.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No buyers yet</p>}
          {buyers.map((b) => (
            <div key={b.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shrink-0" style={{ background: `linear-gradient(135deg,${PRIMARY},${PRIMARY_DARK})` }}>
                {b.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-sm text-slate-800 truncate">{b.name}</div>
                <div className="text-xs text-slate-500 truncate">{[b.companyName, b.mobile].filter(Boolean).join(" · ") || "—"}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ════════════════════ PAYMENTS TAB ════════════════════
function PaymentsTab() {
  const [buyers, setBuyers] = useState<any[]>([]);
  const [buyerId, setBuyerId] = useState("");
  const [pending, setPending] = useState<any>(null);
  const [loadingPending, setLoadingPending] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"CASH" | "NETBANKING">("CASH");
  const [referenceId, setReferenceId] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { buyerApi.all().then(setBuyers).catch(() => {}); }, []);

  useEffect(() => {
    if (!buyerId) { setPending(null); return; }
    setLoadingPending(true);
    buyerApi.pending(Number(buyerId))
      .then(setPending)
      .catch(() => setPending(null))
      .finally(() => setLoadingPending(false));
  }, [buyerId]);

  const totalPending = pending ? Number(pending.totalPending || 0) : 0;
  const payNow = Number(amount || 0);
  const remainingAfter = Math.max(0, totalPending - payNow);
  const paymentType = payNow >= totalPending && totalPending > 0 ? "FULL" : "PARTIAL";

  const submit = async () => {
    if (!buyerId) { alert("Select buyer"); return; }
    if (payNow <= 0) { alert("Enter amount"); return; }
    setSaving(true);
    try {
      await paymentApi.collect({
        buyerId: Number(buyerId), amount: payNow,
        paymentType, method,
        referenceId: method === "NETBANKING" ? referenceId : undefined,
      });
      alert("Payment recorded");
      setAmount(""); setReferenceId("");
      const fresh = await buyerApi.pending(Number(buyerId));
      setPending(fresh);
    } catch (e: any) { alert(e?.response?.data?.message || "Failed"); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-4">
      <div className={CARD + " space-y-3"}>
        <SectionTitle icon={<Wallet size={16} />}>Collect Payment</SectionTitle>

        <select className={INPUT} value={buyerId} onChange={(e) => setBuyerId(e.target.value)}>
          <option value="">Select Buyer</option>
          {buyers.map((b) => <option key={b.id} value={b.id}>{b.name}{b.companyName ? ` (${b.companyName})` : ""}</option>)}
        </select>

        {loadingPending && (
          <div className="flex items-center gap-2 text-sm text-slate-500 p-3"><Loader2 className="animate-spin" size={14} /> Loading balance…</div>
        )}

        {pending && !loadingPending && (
          <div className="rounded-2xl p-4 space-y-2 border border-emerald-100" style={{ background: "linear-gradient(135deg,#f0fdf6,#f7fdfb)" }}>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Total Billed</span><span className="font-bold text-slate-700">{Number(pending.totalBilled).toFixed(2)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Total Paid</span><span className="font-bold text-emerald-600">{Number(pending.totalPaid).toFixed(2)}</span></div>
            <div className="flex justify-between items-center border-t border-emerald-100 pt-2 mt-1">
              <span className="font-bold text-slate-700">Total Pending</span>
              <span className="font-extrabold text-lg text-amber-600">{totalPending.toFixed(2)}</span>
            </div>
          </div>
        )}

        {pending && pending.pendingInvoices && pending.pendingInvoices.length > 0 && (
          <div className="space-y-1.5">
            <p className={LABEL}>Unpaid Invoices</p>
            {pending.pendingInvoices.map((inv: any) => (
              <div key={inv.invoiceId} className="flex justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-600">{inv.invoiceNo} · {inv.invoiceDate}</span>
                <span className="font-bold text-amber-600">{Number(inv.amountPending).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}

        {buyerId && totalPending === 0 && !loadingPending && (
          <div className="text-sm text-emerald-600 font-bold p-3 rounded-2xl bg-emerald-50 flex items-center gap-2"><CheckCircle2 size={16} /> No pending balance — fully paid</div>
        )}

        <input type="number" className={INPUT} placeholder="Amount received now"
          value={amount} onChange={(e) => setAmount(e.target.value)} />

        {payNow > 0 && totalPending > 0 && (
          <div className="rounded-2xl p-3.5 text-sm space-y-1.5 border border-blue-100 bg-blue-50">
            <div className="flex justify-between"><span className="text-slate-500">Paying now</span><span className="font-bold text-slate-700">{payNow.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Remaining after</span><span className="font-bold text-amber-600">{remainingAfter.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">This is a</span><span className="font-extrabold" style={{ color: PRIMARY }}>{paymentType} payment</span></div>
          </div>
        )}

        <select className={INPUT} value={method} onChange={(e) => setMethod(e.target.value as any)}>
          <option value="CASH">Cash</option>
          <option value="NETBANKING">Net Banking</option>
        </select>
        {method === "NETBANKING" && (
          <input className={INPUT} placeholder="Reference ID" value={referenceId} onChange={(e) => setReferenceId(e.target.value)} />
        )}

        <PrimaryButton onClick={submit} disabled={saving} loading={saving}>Submit Payment</PrimaryButton>
      </div>
    </div>
  );
}

// ════════════════════ HISTORY TAB ════════════════════
function HistoryTab() {
  const [period, setPeriod] = useState<Period>("today");
  const [invoices, setInvoices] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expForm, setExpForm] = useState({ description: "", amount: "" });
  const [savingExp, setSavingExp] = useState(false);

  const load = (p: Period) => {
    setLoading(true);
    Promise.all([
      fieldInvoiceApi.range(p).catch(() => []),
      expenseApi.range(p).catch(() => []),
    ]).then(([inv, exp]) => { setInvoices(inv); setExpenses(exp); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(period); }, [period]);

  const totalSold = invoices.reduce((s, i) => s + Number(i.grandTotal || 0), 0);
  const totalCollected = invoices.reduce((s, i) => s + Number(i.amountPaid || 0), 0);
  const totalPending = invoices.reduce((s, i) => s + Number(i.amountPending || 0), 0);
  const totalExp = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);

  const addExpense = async () => {
    if (!expForm.description.trim() || !expForm.amount) { alert("Fill description + amount"); return; }
    setSavingExp(true);
    try { await expenseApi.add({ description: expForm.description, amount: Number(expForm.amount) }); setExpForm({ description: "", amount: "" }); load(period); }
    catch (e: any) { alert(e?.response?.data?.message || "Failed"); } finally { setSavingExp(false); }
  };

  return (
    <div className="space-y-4">
      <PeriodTabs value={period} onChange={setPeriod} />

      <div className="grid grid-cols-2 gap-2.5">
        <SummaryCard label="Sold" value={totalSold} color="#2563eb" />
        <SummaryCard label="Collected" value={totalCollected} color="#059669" />
        <SummaryCard label="Pending" value={totalPending} color="#d97706" />
        <SummaryCard label="Expenses" value={totalExp} color="#dc2626" />
      </div>

      <div className="rounded-[22px] p-4 text-center text-white shadow-[0_10px_30px_-10px_rgba(0,141,91,0.6)]" style={{ background: `linear-gradient(135deg,${PRIMARY},${PRIMARY_DARK})` }}>
        <p className="text-[11px] text-white/70 uppercase tracking-wider font-semibold">Net (Sold − Expenses)</p>
        <p className="font-extrabold text-2xl mt-1">{(totalSold - totalExp).toFixed(2)}</p>
      </div>

      <div className={CARD + " space-y-3"}>
        <SectionTitle icon={<Receipt size={16} />}>Add Expense</SectionTitle>
        <input className={INPUT} placeholder="Description"
          value={expForm.description} onChange={(e) => setExpForm({ ...expForm, description: e.target.value })} />
        <input type="number" className={INPUT} placeholder="Amount"
          value={expForm.amount} onChange={(e) => setExpForm({ ...expForm, amount: e.target.value })} />
        <PrimaryButton onClick={addExpense} disabled={savingExp} loading={savingExp}><Plus size={16} /> Add Expense</PrimaryButton>
      </div>

      <div className={CARD}>
        <div className="flex items-center justify-between mb-3">
          <SectionTitle icon={<TrendingUp size={16} />}>Sales</SectionTitle>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "rgba(0,141,91,0.1)", color: PRIMARY }}>{invoices.length}</span>
        </div>
        {loading && <div className="flex justify-center py-4"><Loader2 className="animate-spin text-emerald-600" size={20} /></div>}
        {!loading && invoices.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No sales in this period</p>}
        <div className="space-y-2">
          {invoices.map((i) => (
            <div key={i.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-slate-800">{i.buyer?.name}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">{String(i.paymentMode).replace(/_/g, " ")}</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">{i.invoiceNo} · {i.invoiceDate}</div>
              <div className="flex gap-3 text-xs mt-2">
                <span className="text-slate-500">Total <b className="text-slate-700">{i.grandTotal}</b></span>
                <span className="text-emerald-600">Paid <b>{i.amountPaid}</b></span>
                <span className="text-amber-600">Pending <b>{i.amountPending}</b></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={CARD}>
        <div className="flex items-center justify-between mb-3">
          <SectionTitle icon={<Receipt size={16} />}>Expenses</SectionTitle>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-500">{expenses.length}</span>
        </div>
        {!loading && expenses.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No expenses in this period</p>}
        {expenses.map((e) => (
          <div key={e.id} className="flex justify-between items-center text-sm py-2.5 border-b border-slate-100 last:border-0">
            <span className="text-slate-600">{e.description}<span className="text-[10px] text-slate-400 ml-2">{e.expenseDate}</span></span>
            <span className="font-bold text-red-500">{e.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_6px_20px_-10px_rgba(0,0,0,0.15)]">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full" style={{ background: color }} />
        <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">{label}</p>
      </div>
      <p className="font-extrabold text-xl mt-1" style={{ color }}>{value.toFixed(0)}</p>
    </div>
  );
}

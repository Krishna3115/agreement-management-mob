import React, { useEffect, useState } from "react";
import { containerApi, containerDocApi } from "../../../services/fieldservice";
import { Box, Plus, Loader2, Trash2, FileText, Upload, Eye, Package } from "lucide-react";

const PRIMARY = "#008d5b";
const PRIMARY_DARK = "#00663f";

const CARD =
  "bg-white rounded-[26px] p-5 border border-slate-100 shadow-[0_10px_40px_-12px_rgba(0,80,50,0.18)]";
const INPUT =
  "w-full rounded-2xl px-4 py-3 text-sm bg-slate-50 border border-slate-200/80 outline-none transition focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 placeholder:text-slate-400";

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <h2 className="font-bold text-slate-800 flex items-center gap-2.5 text-[15px]">
      <span className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,141,91,0.12)", color: PRIMARY }}>{icon}</span>
      {children}
    </h2>
  );
}

export default function ManageContainers() {
  const [containers, setContainers] = useState<any[]>([]);
  const [containerNo, setContainerNo] = useState("");
  const [notes, setNotes] = useState("");
  const [stocks, setStocks] = useState<any[]>([]);
  const [draft, setDraft] = useState({ productName: "", receivedQty: "", receivedValue: "" });
  const [saving, setSaving] = useState(false);

  const load = () => containerApi.all().then(setContainers).catch(() => {});
  useEffect(() => { load(); }, []);

  const addStock = () => {
    if (!draft.productName.trim() || !draft.receivedQty) { alert("Product + qty required"); return; }
    setStocks([...stocks, {
      productName: draft.productName,
      receivedQty: Number(draft.receivedQty),
      receivedValue: draft.receivedValue ? Number(draft.receivedValue) : undefined,
    }]);
    setDraft({ productName: "", receivedQty: "", receivedValue: "" });
  };

  const save = async () => {
    if (!containerNo.trim()) { alert("Container No required"); return; }
    if (stocks.length === 0) { alert("Add at least one product"); return; }
    setSaving(true);
    try {
      await containerApi.add({ containerNo, notes, stocks });
      setContainerNo(""); setNotes(""); setStocks([]);
      load();
      alert("Container saved");
    } catch (e: any) { alert(e?.response?.data?.message || "Failed"); }
    finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: "linear-gradient(180deg,#eefaf3 0%,#f6f9f7 22%,#f8fafc 100%)" }}>
      {/* HEADER */}
      <div className="relative overflow-hidden px-5 pt-7 pb-8 text-white"
        style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_DARK} 100%)`, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}>
        <div className="pointer-events-none absolute -top-16 -right-10 w-52 h-52 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle,#9bffd0,transparent 70%)" }} />
        <div className="pointer-events-none absolute -bottom-20 -left-8 w-48 h-48 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle,#ffffff,transparent 70%)" }} />
        <div className="relative">
          <p className="text-white/70 text-[11px] font-medium tracking-wide uppercase">Exponab</p>
          <h1 className="text-2xl font-bold leading-tight mt-0.5">Material Received</h1>
          <p className="text-white/80 text-sm mt-1">Containers, stock & documents</p>
        </div>
      </div>

      <div className="p-4 space-y-4 -mt-3 relative z-10">
        {/* NEW CONTAINER */}
        <div className={CARD + " space-y-3"}>
          <SectionTitle icon={<Box size={16} />}>New Container</SectionTitle>
          <input className={INPUT} placeholder="Container No. (e.g. OTPU 6691934)"
            value={containerNo} onChange={e => setContainerNo(e.target.value)} />
          <input className={INPUT} placeholder="Notes (optional)"
            value={notes} onChange={e => setNotes(e.target.value)} />

          <div className="rounded-2xl p-4 space-y-2.5 border border-dashed border-emerald-200" style={{ background: "linear-gradient(135deg,#f0fdf6,#f7fdfb)" }}>
            <p className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: PRIMARY }}>
              <Package size={13} /> Add product received
            </p>
            <input className={INPUT + " bg-white"} placeholder="Product name"
              value={draft.productName} onChange={e => setDraft({ ...draft, productName: e.target.value })} />
            <div className="grid grid-cols-2 gap-2">
              <input type="number" className={INPUT + " bg-white"} placeholder="Received qty (boxes)"
                value={draft.receivedQty} onChange={e => setDraft({ ...draft, receivedQty: e.target.value })} />
              <input type="number" className={INPUT + " bg-white"} placeholder="Cost value (owner)"
                value={draft.receivedValue} onChange={e => setDraft({ ...draft, receivedValue: e.target.value })} />
            </div>
            <button onClick={addStock}
              className="w-full py-2.5 rounded-xl text-sm font-bold flex justify-center items-center gap-2 transition active:scale-95 border-2"
              style={{ borderColor: PRIMARY, color: PRIMARY, background: "#fff" }}>
              <Plus size={15} /> Add product
            </button>
          </div>

          {stocks.length > 0 && (
            <div className="space-y-2">
              {stocks.map((s, i) => (
                <div key={i} className="flex justify-between items-center p-3.5 rounded-2xl text-sm border border-emerald-100"
                  style={{ background: "linear-gradient(135deg,#ecfdf3,#f6fefb)" }}>
                  <span className="font-bold text-slate-800">{s.productName} · {s.receivedQty} boxes</span>
                  <button onClick={() => setStocks(stocks.filter((_, x) => x !== i))}
                    className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center active:scale-90 transition"><Trash2 size={15} /></button>
                </div>
              ))}
            </div>
          )}

          <button onClick={save} disabled={saving}
            className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex justify-center items-center gap-2 transition active:scale-[0.98] disabled:opacity-60 shadow-[0_8px_20px_-6px_rgba(0,141,91,0.6)]"
            style={{ background: `linear-gradient(135deg,${PRIMARY},${PRIMARY_DARK})` }}>
            {saving ? <Loader2 className="animate-spin" size={16} /> : "Save Container"}
          </button>
        </div>

        {/* ALL CONTAINERS */}
        <div className={CARD}>
          <div className="flex items-center justify-between mb-3">
            <SectionTitle icon={<Box size={16} />}>All Containers</SectionTitle>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "rgba(0,141,91,0.1)", color: PRIMARY }}>{containers.length}</span>
          </div>

          {containers.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No containers yet</p>}

          {containers.map(c => (
            <div key={c.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-2.5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-slate-800">{c.containerNo}</span>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${c.status === "FINISHED" ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-700"}`}>
                  {c.status}
                </span>
              </div>
              {(c.stocks || []).map((s: any) => (
                <div key={s.id} className="text-xs text-slate-500 mt-1.5 flex justify-between">
                  <span>{s.productName}</span>
                  <span className="font-semibold text-slate-700">{Number(s.receivedQty) - Number(s.soldQty)} / {s.receivedQty} left</span>
                </div>
              ))}
              <ContainerDocs containerId={c.id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Per-container document upload + list ───────────────────────────
function ContainerDocs({ containerId }: { containerId: number }) {
  const [docs, setDocs] = useState<any[]>([]);
  const [docName, setDocName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () => containerDocApi.list(containerId).then(setDocs).catch(() => {});
  useEffect(() => { load(); }, [containerId]);

  const upload = async () => {
    if (!docName.trim() || !file) { alert("Enter document name and choose a file"); return; }
    setBusy(true);
    try {
      await containerDocApi.upload(containerId, docName, file);
      setDocName(""); setFile(null);
      load();
    } catch (e: any) { alert(e?.response?.data?.message || "Upload failed"); }
    finally { setBusy(false); }
  };

  return (
    <div className="mt-3 border-t border-slate-200 pt-3">
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
        <FileText size={12} /> Port Documents
      </p>

      <div className="space-y-2 mb-2">
        <input className="w-full rounded-xl px-3 py-2 text-xs bg-white border border-slate-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          placeholder="Document name (e.g. Bill of Lading)"
          value={docName} onChange={(e) => setDocName(e.target.value)} />
        <input type="file" accept="application/pdf,image/*"
          className="w-full text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700"
          onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button onClick={upload} disabled={busy}
          className="w-full py-2 rounded-xl text-xs font-bold flex justify-center items-center gap-2 transition active:scale-95 text-white"
          style={{ background: `linear-gradient(135deg,${PRIMARY},${PRIMARY_DARK})` }}>
          {busy ? <Loader2 className="animate-spin" size={12} /> : <Upload size={12} />} Upload Document
        </button>
      </div>

      {docs.length === 0 && <p className="text-[10px] text-slate-400">No documents uploaded</p>}
      {docs.map((d) => (
        <div key={d.id} className="flex justify-between items-center text-xs py-2 border-b border-slate-100 last:border-0">
          <span className="truncate flex-1 text-slate-600">{d.docName} <span className="text-slate-400">({d.fileName})</span></span>
          <button onClick={() => containerDocApi.open(d.id)}
            className="ml-2 flex items-center gap-1 font-bold px-2.5 py-1 rounded-lg transition active:scale-90"
            style={{ background: "rgba(0,141,91,0.1)", color: PRIMARY }}>
            <Eye size={12} /> View
          </button>
        </div>
      ))}
    </div>
  );
}

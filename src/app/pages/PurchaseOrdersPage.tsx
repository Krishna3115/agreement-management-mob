import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Loader2,
  Eye,
  X,
  Mail,
  Trash2,
  Package,
  Ship,
  CreditCard,
  Calendar,
  MapPin,
  Truck,
  FileText,
  DollarSign,
} from "lucide-react";
import api from "../../services/api";
import {
  purchaseOrderService,
  PurchaseOrder,
  PurchaseOrderItem,
} from "../../services/purchaseOrderService";

type Customer = { id: number; companyName: string };

const PRIMARY = "#008d5b";

const CURRENCIES = [
  { value: "USD", label: "USD" },
  { value: "AED", label: "AED" },
  { value: "INR", label: "INR" },
  { value: "EUR", label: "EUR" },
];

const INCOTERMS = [
  "CIF Dubai", "FOB", "CFR", "EXW", "DAP", "DDP", "CIP", "CPT",
];

const TRANSPORT_MODES = [
  "Sea Freight", "Air Freight", "Road Freight", "Rail Freight",
];

const emptyForm = {
  exporterId: "",
  poDate: new Date().toISOString().slice(0, 10),
  countryOfOrigin: "",
  destinationPort: "",
  incoterms: "CIF Dubai",
  transportMode: "Sea Freight",
  commodity: "",
  quality: "Export Quality – Suitable for Human Consumption",
  packaging: "",
  totalQuantity: "",
  priceNote: "As per Invoice",
  currency: "USD",
  exchangeRate: "" as string | number,
  paymentTerms: "100% TT (Telegraphic Transfer)",
  items: [] as PurchaseOrderItem[],
};

const statusStyle = (status?: string) => {
  switch ((status ?? "").toUpperCase()) {
    case "SENT":      return { bg: "#dbeafe", color: "#1e40af", label: "Sent" };
    case "APPROVED":  return { bg: "#dcfce7", color: "#166534", label: "Approved" };
    case "REJECTED":  return { bg: "#fee2e2", color: "#991b1b", label: "Rejected" };
    case "DRAFT":     return { bg: "#f1f5f9", color: "#475569", label: "Draft" };
    default:          return { bg: "#f1f5f9", color: "#475569", label: status || "Created" };
  }
};

export default function PurchaseOrdersPage() {

  const [data, setData] = useState<PurchaseOrder[]>([]);
  const [companies, setCompanies] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sendingId, setSendingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<PurchaseOrder | null>(null);
  const [openCreate, setOpenCreate] = useState(false);

  const [form, setForm] = useState(emptyForm);

  const [item, setItem] = useState<PurchaseOrderItem>({
    commodity: "",
    quantity: 0,
    unit: "BAGS",
    unitPrice: 0,
  });

  const fetchPOs = async () => {
    setLoading(true);
    try {
      const list = await purchaseOrderService.getAll();
      setData(list);
    } catch (err) {
      console.error("PO fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await api.get("/api/companies");
      const payload = res.data?.data ?? res.data ?? [];
      setCompanies(Array.isArray(payload) ? payload : []);
    } catch (err) {
      console.error("Companies fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchPOs();
    fetchCompanies();
  }, []);

  const addItem = () => {
    if (!item.commodity.trim()) {
      alert("Description is required");
      return;
    }
    setForm((prev) => ({ ...prev, items: [...prev.items, item] }));
    setItem({ commodity: "", quantity: 0, unit: "BAGS", unitPrice: 0 });
  };

  const removeItem = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));
  };

  const savePO = async () => {
    if (!form.exporterId) { alert("Please select a supplier"); return; }
    if (!form.commodity.trim()) { alert("Commodity is required"); return; }
    if (form.items.length === 0) { alert("Add at least one item"); return; }

    setSaving(true);
    try {
      await purchaseOrderService.create({
        ...form,
        exporterId: Number(form.exporterId),
        exchangeRate:
          form.exchangeRate === "" ? null : Number(form.exchangeRate),
      });
      setOpenCreate(false);
      setForm(emptyForm);
      fetchPOs();
    } catch (err: any) {
      console.error("PO create failed:", err);
      alert(err?.response?.data?.message || err?.message || "PO create failed");
    } finally {
      setSaving(false);
    }
  };

  const sendPOEmail = async (po: PurchaseOrder) => {
    setSendingId(po.id);
    try {
      await purchaseOrderService.sendMail(po.id);
      alert("Purchase Order email sent to supplier");
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || "Email failed");
    } finally {
      setSendingId(null);
    }
  };

  const filtered = data.filter(
    (po) =>
      (po.companyName ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (po.poNumber ?? "").toLowerCase().includes(search.toLowerCase()) ||
      ((po as any).commodity ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20" style={{ background: 'linear-gradient(180deg,#eefaf3 0%,#f6f9f7 22%,#f8fafc 100%)' }}>

      {/* HEADER */}
      <div
        className="relative overflow-hidden px-5 pt-7 pb-8 text-white"
        style={{
          background: 'linear-gradient(135deg, #008d5b 0%, #00663f 100%)',
          borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
        }}
      >
        <div className="pointer-events-none absolute -top-16 -right-10 w-52 h-52 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle,#9bffd0,transparent 70%)' }} />
        <div className="pointer-events-none absolute -bottom-20 -left-8 w-48 h-48 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle,#ffffff,transparent 70%)' }} />

        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-white/70 text-[11px] font-medium tracking-wide uppercase">Exponab</p>
            <h1 className="text-2xl font-bold leading-tight mt-0.5">Purchase Orders</h1>
            <p className="text-white/80 text-sm mt-1">
              {data.length} POs · send to suppliers
            </p>
          </div>
          <button
            onClick={() => setOpenCreate(true)}
            className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg active:scale-95 transition"
          >
            <Plus size={22} color={PRIMARY} />
          </button>
        </div>

        <div className="relative mt-5">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by supplier, PO no., or commodity..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 text-slate-700"
          />
        </div>
      </div>

      {/* ─── LIST OF PO CARDS (EXPANDED) ─── */}
      <div className="p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-emerald-600" size={24} />
          </div>
        ) : (
          <>
            {filtered.length === 0 && (
              <div className="bg-white rounded-3xl p-10 text-center shadow-sm">
                <p className="text-slate-500 text-sm">No Purchase Orders</p>
              </div>
            )}

            {filtered.map((po) => {
              const st = statusStyle(po.status);
              const anyPo = po as any;
              const commodity     = anyPo.commodity;
              const totalQuantity = anyPo.totalQuantity;
              const currency      = anyPo.currency || "USD";
              const grandTotal    = po.grandTotal;
              const itemsCount    = po.items?.length ?? 0;

              return (
                <div
                  key={po.id}
                  className="bg-white rounded-3xl border border-slate-100 shadow-[0_10px_40px_-12px_rgba(0,80,50,0.18)] overflow-hidden"
                >
                  {/* TOP BAR: PO# + status + date */}
                  <div className="px-5 pt-4 pb-3 border-b border-slate-100 flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                        style={{ background: "#e6f6f0" }}
                      >
                        <FileText size={18} color={PRIMARY} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-800 text-sm truncate">
                          PO #{po.poNumber ?? po.id}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <Calendar size={10} />
                          {po.poDate || "—"}
                        </div>
                      </div>
                    </div>

                    <span
                      className="px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap"
                      style={{ background: st.bg, color: st.color }}
                    >
                      {st.label}
                    </span>
                  </div>

                  {/* BODY: supplier + product + shipment + amount */}
                  <div className="px-5 py-3 space-y-3">

                    {/* Supplier */}
                    <div className="flex items-start gap-2">
                      <Ship size={14} className="text-slate-400 mt-0.5 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                          Supplier
                        </p>
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {po.companyName || "—"}
                        </p>
                      </div>
                    </div>

                    {/* Commodity + total qty */}
                    {(commodity || totalQuantity) && (
                      <div className="flex items-start gap-2">
                        <Package size={14} className="text-slate-400 mt-0.5 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                            Commodity
                          </p>
                          <p className="text-sm text-slate-700 truncate">
                            {commodity || "—"}
                            {totalQuantity && (
                              <span className="text-slate-400">  ·  {totalQuantity}</span>
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Route */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 rounded-xl p-2.5">
                        <div className="flex items-center gap-1 text-[9px] text-slate-400 uppercase tracking-wider mb-1">
                          <MapPin size={10} />
                          Origin
                        </div>
                        <p className="text-xs font-semibold text-slate-700 truncate">
                          {po.countryOfOrigin || "—"}
                        </p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-2.5">
                        <div className="flex items-center gap-1 text-[9px] text-slate-400 uppercase tracking-wider mb-1">
                          <MapPin size={10} />
                          Destination
                        </div>
                        <p className="text-xs font-semibold text-slate-700 truncate">
                          {po.destinationPort || "—"}
                        </p>
                      </div>
                    </div>

                    {/* Incoterms + Transport */}
                    <div className="flex gap-2 text-[10px]">
                      {po.incoterms && (
                        <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 font-semibold">
                          {po.incoterms}
                        </span>
                      )}
                      {po.transportMode && (
                        <span className="px-2 py-1 rounded-md bg-purple-50 text-purple-700 font-semibold flex items-center gap-1">
                          <Truck size={10} />
                          {po.transportMode}
                        </span>
                      )}
                      <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 font-semibold">
                        {itemsCount} item{itemsCount !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* Grand Total */}
                    {grandTotal != null && (
                      <div
                        className="rounded-xl p-3 flex items-center justify-between"
                        style={{ background: "#f0fdf4" }}
                      >
                        <div className="flex items-center gap-2">
                          <DollarSign size={14} color={PRIMARY} />
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                            Grand Total
                          </span>
                        </div>
                        <p className="font-bold text-sm" style={{ color: PRIMARY }}>
                          {currency} {grandTotal}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* ACTIONS */}
                  <div className="px-5 pb-4 flex gap-2">
                    <button
                      onClick={() => setSelected(po)}
                      className="flex-1 py-2 rounded-2xl bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2"
                    >
                      <Eye size={14} />
                      View Details
                    </button>

                    <button
                      onClick={() => sendPOEmail(po)}
                      disabled={sendingId === po.id}
                      className="flex-1 py-2 rounded-2xl text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                      style={{ background: 'linear-gradient(135deg,#008d5b,#00663f)' }}
                    >
                      {sendingId === po.id ? (
                        <Loader2 className="animate-spin" size={14} />
                      ) : (
                        <Mail size={14} />
                      )}
                      Send Email
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* ───── CREATE MODAL (unchanged from before) ───── */}
      {openCreate && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-5">
          <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto shadow-2xl">

            <div
              className="px-5 py-5 text-white rounded-t-3xl flex justify-between items-center sticky top-0 z-10"
              style={{ background: 'linear-gradient(135deg,#008d5b,#00663f)' }}
            >
              <h2 className="font-bold text-lg">Create Purchase Order</h2>
              <button onClick={() => setOpenCreate(false)}
                      className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">

              <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 font-semibold text-sm text-slate-700">
                  <Ship size={16} color={PRIMARY} /> Supplier & Date
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Supplier (Exporter) *</label>
                  <select className="w-full border rounded-2xl p-3 text-sm bg-white"
                          value={form.exporterId}
                          onChange={(e) => setForm({ ...form, exporterId: e.target.value })}>
                    <option value="">Select supplier</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>{c.companyName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">PO Date</label>
                  <input type="date" className="w-full border rounded-2xl p-3 text-sm bg-white"
                         value={form.poDate}
                         onChange={(e) => setForm({ ...form, poDate: e.target.value })} />
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 font-semibold text-sm text-slate-700">
                  <Ship size={16} color={PRIMARY} /> Shipment Details
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input className="border p-3 rounded-2xl text-sm bg-white"
                         placeholder="Country of Origin"
                         value={form.countryOfOrigin}
                         onChange={(e) => setForm({ ...form, countryOfOrigin: e.target.value })} />
                  <input className="border p-3 rounded-2xl text-sm bg-white"
                         placeholder="Destination Port"
                         value={form.destinationPort}
                         onChange={(e) => setForm({ ...form, destinationPort: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select className="border p-3 rounded-2xl text-sm bg-white"
                          value={form.incoterms}
                          onChange={(e) => setForm({ ...form, incoterms: e.target.value })}>
                    {INCOTERMS.map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                  <select className="border p-3 rounded-2xl text-sm bg-white"
                          value={form.transportMode}
                          onChange={(e) => setForm({ ...form, transportMode: e.target.value })}>
                    {TRANSPORT_MODES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 font-semibold text-sm text-slate-700">
                  <Package size={16} color={PRIMARY} /> Product Details
                </div>
                <input className="border p-3 rounded-2xl text-sm w-full bg-white"
                       placeholder="Commodity (e.g. Fresh Watermelon) *"
                       value={form.commodity}
                       onChange={(e) => setForm({ ...form, commodity: e.target.value })} />
                <input className="border p-3 rounded-2xl text-sm w-full bg-white"
                       placeholder="Quality"
                       value={form.quality}
                       onChange={(e) => setForm({ ...form, quality: e.target.value })} />
                <input className="border p-3 rounded-2xl text-sm w-full bg-white"
                       placeholder="Packaging (e.g. 15 kg Mesh Bag)"
                       value={form.packaging}
                       onChange={(e) => setForm({ ...form, packaging: e.target.value })} />
                <div className="grid grid-cols-2 gap-2">
                  <input className="border p-3 rounded-2xl text-sm bg-white"
                         placeholder="Total Quantity (28500 KG)"
                         value={form.totalQuantity}
                         onChange={(e) => setForm({ ...form, totalQuantity: e.target.value })} />
                  <input className="border p-3 rounded-2xl text-sm bg-white"
                         placeholder="Price Note"
                         value={form.priceNote}
                         onChange={(e) => setForm({ ...form, priceNote: e.target.value })} />
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 font-semibold text-sm text-slate-700">
                  <CreditCard size={16} color={PRIMARY} /> Pricing
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select className="border p-3 rounded-2xl text-sm bg-white"
                          value={form.currency}
                          onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                    {CURRENCIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                  <input type="number" step="0.0001"
                         className="border p-3 rounded-2xl text-sm bg-white"
                         placeholder={form.currency === "USD" ? "1 USD = ? AED (optional)" : "Exchange rate (optional)"}
                         value={form.exchangeRate}
                         onChange={(e) => setForm({ ...form, exchangeRate: e.target.value })} />
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 font-semibold text-sm text-slate-700">
                  <CreditCard size={16} color={PRIMARY} /> Payment Method
                </div>
                <input className="border p-3 rounded-2xl text-sm w-full bg-white"
                       placeholder="e.g. 100% TT (Telegraphic Transfer)"
                       value={form.paymentTerms}
                       onChange={(e) => setForm({ ...form, paymentTerms: e.target.value })} />
                <p className="text-[10px] text-slate-500">
                  Standard commission & delivery terms are added automatically.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 font-semibold text-sm text-slate-700">
                  <Package size={16} color={PRIMARY} /> Pricing Items
                </div>
                <input className="border p-3 rounded-2xl text-sm w-full bg-white"
                       placeholder="Description (e.g. Fresh Watermelon)"
                       value={item.commodity}
                       onChange={(e) => setItem({ ...item, commodity: e.target.value })} />
                <div className="grid grid-cols-3 gap-2">
                  <input className="border p-3 rounded-2xl text-sm bg-white" placeholder="Qty" type="number"
                         value={item.quantity || ""}
                         onChange={(e) => setItem({ ...item, quantity: Number(e.target.value) })} />
                  <input className="border p-3 rounded-2xl text-sm bg-white" placeholder="Unit"
                         value={item.unit}
                         onChange={(e) => setItem({ ...item, unit: e.target.value })} />
                  <input className="border p-3 rounded-2xl text-sm bg-white" placeholder="Price/Unit" type="number"
                         value={item.unitPrice || ""}
                         onChange={(e) => setItem({ ...item, unitPrice: Number(e.target.value) })} />
                </div>
                <button onClick={addItem}
                        className="w-full bg-slate-200 py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2">
                  <Plus size={14} /> Add Item
                </button>

                {form.items.length > 0 && (
                  <div className="space-y-2 pt-2">
                    {form.items.map((it, i) => (
                      <div key={i} className="flex justify-between items-start gap-2 text-sm p-3 rounded-2xl bg-white border">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-800 truncate">{it.commodity}</div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {it.quantity} {it.unit} × {it.unitPrice} {form.currency}
                          </div>
                        </div>
                        <button onClick={() => removeItem(i)} className="text-red-500 p-1">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={savePO} disabled={saving}
                      className="w-full mt-3 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2"
                      style={{ background: 'linear-gradient(135deg,#008d5b,#00663f)' }}>
                {saving ? <Loader2 className="animate-spin" size={16} /> : "Save Purchase Order"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───── DETAIL MODAL (full PO view) ───── */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-5">
          <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto shadow-2xl">

            <div
              className="px-5 py-5 text-white rounded-t-3xl flex justify-between items-start sticky top-0 z-10"
              style={{ background: 'linear-gradient(135deg,#008d5b,#00663f)' }}
            >
              <div>
                <h2 className="font-bold text-lg">
                  PO #{selected.poNumber ?? selected.id}
                </h2>
                <p className="text-white/80 text-xs mt-0.5">
                  {selected.poDate}
                </p>
              </div>
              <button onClick={() => setSelected(null)}
                      className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">

              {/* Supplier */}
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                  Supplier
                </p>
                <p className="font-semibold text-slate-800">
                  {selected.companyName ?? "—"}
                </p>
              </div>

              {/* Product details */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                  Product
                </p>
                <Row label="Commodity"    value={(selected as any).commodity} />
                <Row label="Quality"      value={(selected as any).quality} />
                <Row label="Packaging"    value={(selected as any).packaging} />
                <Row label="Total Qty"    value={(selected as any).totalQuantity} />
                <Row label="Price Note"   value={(selected as any).priceNote} />
              </div>

              {/* Shipment */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                  Shipment
                </p>
                <Row label="Origin"      value={selected.countryOfOrigin} />
                <Row label="Destination" value={selected.destinationPort} />
                <Row label="Incoterms"   value={selected.incoterms} />
                <Row label="Transport"   value={selected.transportMode} />
              </div>

              {/* Pricing */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                  Pricing
                </p>
                <Row label="Currency"      value={(selected as any).currency} />
                <Row label="Exchange Rate" value={(selected as any).exchangeRate} />
                <Row label="Payment"       value={selected.paymentTerms} />
                <Row label="Grand Total"
                     value={
                       selected.grandTotal != null
                         ? `${(selected as any).currency || "USD"} ${selected.grandTotal}`
                         : "—"
                     } />
              </div>

              {/* Items */}
              {selected.items && selected.items.length > 0 && (
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">
                    Items ({selected.items.length})
                  </p>
                  <div className="space-y-2">
                    {selected.items.map((it, i) => (
                      <div key={i} className="bg-white rounded-xl p-3 border border-slate-100">
                        <div className="font-semibold text-sm text-slate-800">
                          {it.commodity}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {it.quantity} {it.unit} × {it.unitPrice}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => sendPOEmail(selected)}
                disabled={sendingId === selected.id}
                className="w-full py-3 rounded-2xl text-white font-semibold flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg,#008d5b,#00663f)' }}
              >
                {sendingId === selected.id ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Mail size={16} />
                )}
                Send PO Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper for the detail modal rows
function Row({ label, value }: { label: string; value?: any }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex justify-between items-start gap-3 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-800 font-semibold text-right">{String(value)}</span>
    </div>
  );
}

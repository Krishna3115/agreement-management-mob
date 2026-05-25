import React, { useEffect, useState } from "react";
import { Plus, Search, Loader2, Eye, X } from "lucide-react";
import api from "../../services/api";

type Item = {
  commodity: string;
  quantity: number;
  unit: string;
  unitPrice: number;
};

type PurchaseOrder = {
  id: number;
  poNumber?: string;
  companyName?: string;
  totalAmount?: number;
  status?: string;
  countryOfOrigin?: string;
  destinationPort?: string;
  incoterms?: string;
  paymentTerms?: string;
  items?: Item[];
};

const PRIMARY = "#008d5b";

export default function PurchaseOrdersPage() {
  const [data, setData] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<PurchaseOrder | null>(null);
  const [openCreate, setOpenCreate] = useState(false);

  const [form, setForm] = useState({
    exporterId: 1,
    countryOfOrigin: "",
    destinationPort: "",
    incoterms: "",
    paymentTerms: "",
    items: [] as Item[],
  });

  const [item, setItem] = useState<Item>({
    commodity: "",
    quantity: 0,
    unit: "",
    unitPrice: 0,
  });

  // FETCH
  const fetchPOs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/purchase-orders");
      const payload = res.data?.data ?? res.data;
      setData(Array.isArray(payload) ? payload : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPOs();
  }, []);

  // ADD ITEM
  const addItem = () => {
    if (!item.commodity) return;

    setForm((prev) => ({
      ...prev,
      items: [...prev.items, item],
    }));

    setItem({ commodity: "", quantity: 0, unit: "", unitPrice: 0 });
  };

  // SAVE
  const savePO = async () => {
    try {
      await api.post("/api/purchase-orders", form);

      setOpenCreate(false);

      setForm({
        exporterId: 1,
        countryOfOrigin: "",
        destinationPort: "",
        incoterms: "",
        paymentTerms: "",
        items: [],
      });

      fetchPOs();
    } catch (err) {
      console.error("PO create failed:", err);
    }
  };

  const filtered = data.filter(
    (po) =>
      (po.companyName ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (po.poNumber ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      {/* ================= HEADER (Companies style) ================= */}
      <div className="bg-white rounded-2xl shadow p-5 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Purchase Orders
          </h1>
          <p className="text-sm text-slate-500">
            Manage all purchase orders in one place
          </p>
        </div>

        <button
          onClick={() => setOpenCreate(true)}
          className="px-4 py-2 text-white rounded-xl flex items-center gap-2 shadow"
          style={{ background: PRIMARY }}
        >
          <Plus size={16} /> Create PO
        </button>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="bg-white rounded-2xl shadow p-4 mb-5">
        <div className="flex items-center gap-2 border rounded-xl px-3 py-2">
          <Search size={18} className="text-gray-400" />
          <input
            className="w-full outline-none"
            placeholder="Search by company or PO number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ================= LIST (Companies-style cards) ================= */}
      {loading ? (
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="animate-spin" />
          Loading...
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((po) => (
            <div
              key={po.id}
              className="bg-white rounded-2xl shadow p-5 flex justify-between items-center hover:shadow-md transition"
            >
              <div>
                <div className="font-semibold text-slate-800">
                  PO #{po.poNumber ?? po.id}
                </div>
                <div className="text-sm text-slate-500">
                  {po.companyName}
                </div>
              </div>

              <button
                onClick={() => setSelected(po)}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200"
              >
                <Eye size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ================= CREATE MODAL ================= */}
      {openCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg p-6 rounded-2xl space-y-3 shadow-xl">

            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg">Create Purchase Order</h2>
              <button onClick={() => setOpenCreate(false)}>
                <X />
              </button>
            </div>

            <input
              className="border p-2 w-full rounded-lg"
              placeholder="Country"
              onChange={(e) =>
                setForm({ ...form, countryOfOrigin: e.target.value })
              }
            />

            <input
              className="border p-2 w-full rounded-lg"
              placeholder="Destination Port"
              onChange={(e) =>
                setForm({ ...form, destinationPort: e.target.value })
              }
            />

            <input
              className="border p-2 w-full rounded-lg"
              placeholder="Incoterms"
              onChange={(e) =>
                setForm({ ...form, incoterms: e.target.value })
              }
            />

            <hr />

            <h3 className="font-semibold">Add Item</h3>

            <input
              className="border p-2 w-full rounded-lg"
              placeholder="Commodity"
              value={item.commodity}
              onChange={(e) =>
                setItem({ ...item, commodity: e.target.value })
              }
            />

            <input
              className="border p-2 w-full rounded-lg"
              placeholder="Qty"
              type="number"
              onChange={(e) =>
                setItem({ ...item, quantity: Number(e.target.value) })
              }
            />

            <input
              className="border p-2 w-full rounded-lg"
              placeholder="Unit"
              onChange={(e) =>
                setItem({ ...item, unit: e.target.value })
              }
            />

            <input
              className="border p-2 w-full rounded-lg"
              placeholder="Unit Price"
              type="number"
              onChange={(e) =>
                setItem({ ...item, unitPrice: Number(e.target.value) })
              }
            />

            <button
              onClick={addItem}
              className="w-full bg-gray-100 py-2 rounded-lg"
            >
              Add Item
            </button>

            <button
              onClick={savePO}
              className="w-full text-white py-3 rounded-xl font-semibold"
              style={{ background: PRIMARY }}
            >
              Save Purchase Order
            </button>
          </div>
        </div>
      )}

      {/* ================= DETAIL MODAL ================= */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl">

            <h2 className="font-bold text-lg mb-3">
              PO #{selected.poNumber ?? selected.id}
            </h2>

            <div className="space-y-1 text-sm text-slate-700">
              <div><b>Company:</b> {selected.companyName}</div>
              <div><b>Status:</b> {selected.status}</div>
              <div><b>Country:</b> {selected.countryOfOrigin}</div>
              <div><b>Port:</b> {selected.destinationPort}</div>
              <div><b>Incoterms:</b> {selected.incoterms}</div>
            </div>

            <button
              onClick={() => setSelected(null)}
              className="mt-5 w-full py-2 border rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
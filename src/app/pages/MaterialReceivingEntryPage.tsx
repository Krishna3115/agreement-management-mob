import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Plus, Loader2, PackageCheck, Calendar } from 'lucide-react';

type Company = {
  id: number;
  companyName: string;
};

type PO = {
  id: number;
  poNumber: string;
  companyName: string;
};

type Item = {
  description: string;
  quantity: number;
  rate: number;
};

export default function MaterialReceivingPage() {
  const PRIMARY = '#008d5b';

  const [mode, setMode] = useState<'WITH_PO' | 'WITHOUT_PO' | ''>('');

  const [companies, setCompanies] = useState<Company[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PO[]>([]);

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    companyId: '',
    purchaseOrderId: '',
    receivedDate: '',
    items: [] as Item[],
  });

  const [item, setItem] = useState<Item>({
    description: '',
    quantity: 0,
    rate: 0,
  });

  // LOAD DATA
  useEffect(() => {
    const fetchCompanies = async () => {
      const res = await api.get('/api/companies');
      setCompanies(res.data?.data ?? res.data);
    };

    const fetchPOs = async () => {
      const res = await api.get('/api/purchase-orders');
      setPurchaseOrders(res.data?.data ?? res.data);
    };

    fetchCompanies();
    fetchPOs();
  }, []);

  // ADD ITEM
  const addItem = () => {
    if (!item.description) return;

    setForm(prev => ({
      ...prev,
      items: [...prev.items, item],
    }));

    setItem({ description: '', quantity: 0, rate: 0 });
  };

  // SAVE
  const save = async () => {
    if (!mode) {
      alert('Select WITH PO or WITHOUT PO');
      return;
    }

    setSaving(true);

    try {
      await api.post('/api/material-receiving', {
        ...form,
        status: mode,
      });

      alert('GRN Saved Successfully');

      setForm({
        companyId: '',
        purchaseOrderId: '',
        receivedDate: '',
        items: [],
      });

      setMode('');
    } catch (err) {
      console.error(err);
      alert('Failed to save GRN');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">

      {/* HEADER (LIKE COMPANIES PAGE STYLE) */}
      <div className="px-5 pt-6 pb-10 rounded-b-[32px] text-white shadow-lg"
        style={{ background: PRIMARY }}
      >
        <div className="flex items-center gap-3">
          <PackageCheck size={28} />
          <div>
            <h1 className="text-2xl font-bold">Material Receiving</h1>
            <p className="text-white/80 text-sm">
              GRN Entry (With PO / Without PO)
            </p>
          </div>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="px-4 -mt-6">

        <div className="bg-white rounded-3xl shadow-xl p-5 space-y-6">

          {/* MODE SELECT */}
          <div>
            <h2 className="text-sm font-semibold text-slate-600 mb-3">
              Select Entry Type
            </h2>

            <div className="flex gap-3">
              {['WITH_PO', 'WITHOUT_PO'].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m as any)}
                  className={`px-5 py-2 rounded-full border text-sm font-medium transition ${
                    mode === m ? 'text-white shadow-md' : 'text-slate-600'
                  }`}
                  style={{
                    background: mode === m ? PRIMARY : 'white',
                  }}
                >
                  {m === 'WITH_PO' ? 'With PO' : 'Without PO'}
                </button>
              ))}
            </div>
          </div>

          {/* SELECTORS */}
          {mode && (
            <div className="grid md:grid-cols-2 gap-4">

              {mode === 'WITH_PO' && (
                <select
                  className="w-full p-3 border rounded-2xl focus:ring-2 focus:ring-green-500"
                  value={form.purchaseOrderId}
                  onChange={(e) =>
                    setForm({ ...form, purchaseOrderId: e.target.value })
                  }
                >
                  <option value="">Select Purchase Order</option>
                  {purchaseOrders.map((po) => (
                    <option key={po.id} value={po.id}>
                      {po.poNumber} - {po.companyName}
                    </option>
                  ))}
                </select>
              )}

              {mode === 'WITHOUT_PO' && (
                <select
                  className="w-full p-3 border rounded-2xl focus:ring-2 focus:ring-green-500"
                  value={form.companyId}
                  onChange={(e) =>
                    setForm({ ...form, companyId: e.target.value })
                  }
                >
                  <option value="">Select Company</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.companyName}
                    </option>
                  ))}
                </select>
              )}

              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="date"
                  className="w-full pl-10 p-3 border rounded-2xl focus:ring-2 focus:ring-green-500"
                  value={form.receivedDate}
                  onChange={(e) =>
                    setForm({ ...form, receivedDate: e.target.value })
                  }
                />
              </div>

            </div>
          )}

          {/* ITEM ENTRY CARD */}
          {mode && (
            <div className="bg-slate-50 rounded-2xl p-4 space-y-3 border">

              <h3 className="font-semibold text-slate-700">
                Add Items
              </h3>

              <div className="grid md:grid-cols-3 gap-3">

                <input
                  className="p-3 border rounded-xl"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) =>
                    setItem({ ...item, description: e.target.value })
                  }
                />

                <input
                  type="number"
                  className="p-3 border rounded-xl"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) =>
                    setItem({ ...item, quantity: Number(e.target.value) })
                  }
                />

                <input
                  type="number"
                  className="p-3 border rounded-xl"
                  placeholder="Rate"
                  value={item.rate}
                  onChange={(e) =>
                    setItem({ ...item, rate: Number(e.target.value) })
                  }
                />

              </div>

              <button
                onClick={addItem}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium shadow-md hover:opacity-90"
                style={{ background: PRIMARY }}
              >
                <Plus size={16} />
                Add Item
              </button>
            </div>
          )}

          {/* TABLE */}
          {form.items.length > 0 && (
            <div className="rounded-2xl border overflow-hidden">

              <table className="w-full text-sm">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-left">Qty</th>
                    <th className="p-3 text-left">Rate</th>
                    <th className="p-3 text-left">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {form.items.map((it, i) => (
                    <tr key={i} className="border-t hover:bg-slate-50">
                      <td className="p-3">{it.description}</td>
                      <td className="p-3">{it.quantity}</td>
                      <td className="p-3">{it.rate}</td>
                      <td className="p-3 font-semibold text-green-600">
                        {it.quantity * it.rate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          )}

          {/* SAVE BUTTON */}
          {mode && (
            <button
              onClick={save}
              disabled={saving}
              className="w-full py-3 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 shadow-lg"
              style={{ background: PRIMARY }}
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Saving GRN...
                </>
              ) : (
                'Save GRN Entry'
              )}
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import {
  Plus,
  Loader2,
  Eye,
  User,
  FileText,
  Package,
  CheckCircle2,
} from 'lucide-react';

type Customer = {
  id: number;
  companyName: string;
};

type Item = {
  articleName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatPercent: number;
};

export default function SalesOrderPage() {
  const PRIMARY = '#008d5b';

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [saving, setSaving] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  const [form, setForm] = useState({
    customerId: '',
    procurementType: 'WITHOUT_PO',
    taxMode: 'MANUAL_VAT',
    notes: '',
    items: [] as Item[],
  });

  const [item, setItem] = useState<Item>({
    articleName: '',
    description: '',
    quantity: 0,
    unitPrice: 0,
    vatPercent: 0,
  });

  // =========================
  // FETCH CUSTOMERS
  // =========================
  const fetchCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const res = await api.get('/api/companies');
      const payload = res.data?.data ?? res.data?.content ?? res.data ?? [];
      setCustomers(Array.isArray(payload) ? payload : []);
    } catch (err) {
      console.error(err);
      setCustomers([]);
    } finally {
      setLoadingCustomers(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // =========================
  // ADD ITEM
  // =========================
  const addItem = () => {
    if (!item.articleName) return;

    setForm((prev) => ({
      ...prev,
      items: [...prev.items, item],
    }));

    setItem({
      articleName: '',
      description: '',
      quantity: 0,
      unitPrice: 0,
      vatPercent: 0,
    });
  };

  // =========================
  // SAVE ORDER
  // =========================
  const saveOrder = async () => {
    if (!form.customerId || form.items.length === 0) {
      alert('Select customer and add items');
      return;
    }

    setSaving(true);

    try {
      const res = await api.post('/api/sales-reports', form);
      setCreatedOrder(res.data?.data ?? res.data);

      setForm({
        customerId: '',
        procurementType: 'WITHOUT_PO',
        taxMode: 'MANUAL_VAT',
        notes: '',
        items: [],
      });
    } catch (err) {
      console.error(err);
      alert('Failed to create sales order');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">

      {/* HEADER (like CompaniesPage) */}
      <div
        className="px-5 pt-6 pb-8 rounded-b-[28px] text-white"
        style={{ background: PRIMARY }}
      >
        <h1 className="text-2xl font-bold">Sales Order</h1>
        <p className="text-white/80 text-sm mt-1">
          Create and manage sales orders smoothly
        </p>
      </div>

      <div className="p-4 space-y-4">

        {/* CUSTOMER CARD */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 font-semibold mb-3">
            <User size={18} color={PRIMARY} />
            Customer
          </div>

          <select
            className="w-full border rounded-2xl p-4 text-sm focus:ring-2 focus:ring-emerald-600"
            value={form.customerId}
            onChange={(e) =>
              setForm({ ...form, customerId: e.target.value })
            }
          >
            <option value="">
              {loadingCustomers ? 'Loading...' : 'Select Customer'}
            </option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.companyName}
              </option>
            ))}
          </select>
        </div>

        {/* CONFIG CARD */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 font-semibold mb-3">
            <FileText size={18} color={PRIMARY} />
            Configuration
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select
              className="border rounded-2xl p-3 text-sm"
              value={form.procurementType}
              onChange={(e) =>
                setForm({ ...form, procurementType: e.target.value })
              }
            >
              <option>WITHOUT_PO</option>
              <option>WITH_PO</option>
            </select>

            <select
              className="border rounded-2xl p-3 text-sm"
              value={form.taxMode}
              onChange={(e) =>
                setForm({ ...form, taxMode: e.target.value })
              }
            >
              <option>MANUAL_VAT</option>
              <option>AUTO_VAT</option>
            </select>
          </div>

          <textarea
            className="w-full mt-3 border rounded-2xl p-3 text-sm"
            placeholder="Notes..."
            value={form.notes}
            onChange={(e) =>
              setForm({ ...form, notes: e.target.value })
            }
          />
        </div>

        {/* ITEM CARD */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 font-semibold mb-3">
            <Package size={18} color={PRIMARY} />
            Add Items
          </div>

          <div className="space-y-3">

            <input
              className="w-full border rounded-2xl p-3 text-sm"
              placeholder="Article Name"
              value={item.articleName}
              onChange={(e) =>
                setItem({ ...item, articleName: e.target.value })
              }
            />

            <input
              className="w-full border rounded-2xl p-3 text-sm"
              placeholder="Description"
              value={item.description}
              onChange={(e) =>
                setItem({ ...item, description: e.target.value })
              }
            />

            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                className="border rounded-2xl p-3 text-sm"
                placeholder="Qty"
                onChange={(e) =>
                  setItem({ ...item, quantity: Number(e.target.value) })
                }
              />

              <input
                type="number"
                className="border rounded-2xl p-3 text-sm"
                placeholder="Price"
                onChange={(e) =>
                  setItem({ ...item, unitPrice: Number(e.target.value) })
                }
              />

              <input
                type="number"
                className="border rounded-2xl p-3 text-sm"
                placeholder="VAT"
                onChange={(e) =>
                  setItem({ ...item, vatPercent: Number(e.target.value) })
                }
              />
            </div>

            <button
              onClick={addItem}
              className="w-full py-3 rounded-2xl text-white flex items-center justify-center gap-2 shadow-md"
              style={{ background: PRIMARY }}
            >
              <Plus size={16} />
              Add Item
            </button>
          </div>
        </div>

        {/* ITEM LIST */}
        {form.items.length > 0 && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 font-semibold mb-3">
              <CheckCircle2 size={18} color={PRIMARY} />
              Items Added
            </div>

            <div className="space-y-2">
              {form.items.map((it, i) => (
                <div
                  key={i}
                  className="flex justify-between text-sm p-3 rounded-2xl bg-slate-50"
                >
                  <span>{it.articleName}</span>
                  <span>Qty: {it.quantity}</span>
                  <span className="font-semibold">
                    ₹{it.unitPrice}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* FLOATING ACTION */}
      <div className="fixed bottom-6 left-0 right-0 px-5">
        <button
          onClick={saveOrder}
          disabled={saving}
          className="w-full py-4 text-white rounded-2xl flex justify-center items-center gap-2 shadow-xl"
          style={{ background: PRIMARY }}
        >
          {saving ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Creating...
            </>
          ) : (
            'Create Sales Order'
          )}
        </button>
      </div>

      {/* MODAL */}
      {createdOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl">

            <div className="flex items-center gap-2 font-bold">
              <Eye size={18} /> Order Created
            </div>

            <div className="mt-4 text-sm space-y-2 text-slate-600">
              <div>ID: {createdOrder.id}</div>
              <div>Total: {createdOrder.totalAmount}</div>
              <div>Tax: {createdOrder.taxAmount}</div>
            </div>

            <button
              onClick={() => setCreatedOrder(null)}
              className="mt-5 w-full py-3 text-white rounded-2xl"
              style={{ background: PRIMARY }}
            >
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
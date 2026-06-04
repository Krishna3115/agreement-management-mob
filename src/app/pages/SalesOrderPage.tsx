import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../../services/api';
import { salesReportService } from '../../services/salesReportService';
import {
  Plus,
  Loader2,
  User,
  FileText,
  Package,
  CheckCircle2,
  Trash2,
  Receipt,
  Mail,
  Paperclip,
  X,
  Container,
  ListChecks,
} from 'lucide-react';

type Customer = {
  id: number;
  companyName: string;
};

// articleName removed — backend still accepts it (sent as empty string for compatibility)
type Item = {
  articleName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatPercent: number;
};

type Expense = {
  description: string;
  quantity: number;
  unitRate: number;
};

const PRIMARY = '#008d5b';

const VAT_OPTIONS = [
  { value: 'WITHOUT_VAT',  label: 'Without VAT' },
  { value: 'VAT_INCLUDED', label: 'VAT Included (₹100 → ₹95 + ₹5)' },
  { value: 'MANUAL_VAT',   label: 'Manual VAT (added on top)' },
];

const PROCUREMENT_OPTIONS = [
  { value: 'WITHOUT_PO', label: 'Without PO (material received directly)' },
  { value: 'WITH_PO',    label: 'With PO' },
];

// ─── 15 STANDARD EXPENSE NAMES ─────────────────────────────────────
// Keep in sync with backend PdfLayoutBuilder.STANDARD_EXPENSES.
const STANDARD_EXPENSES: string[] = [
  'DO CHARGES',
  'BILL OF ENTRY',
  'DPW CHARGES',
  'TRANSPORTATION',
  'TOKEN CHARGES',
  'DOCUMENT CLEARING CHARGES',
  'ZAJEL COURIER CHARGES',
  'MOFA INVOICE ATTESTATION',
  'INSPECTION',
  'DECLARATION AMENDMENT CHARGES',
  'VAT',
  'TASHRIYA PARKING & PLUG IN',
  'UNLOADING / HAMALI',
  'COMMISSION',
  'LOCAL TRANSPORT',
];

type StdRow = {
  description: string;
  checked: boolean;
  quantity: number;
  unitRate: number;
};

export default function SalesOrderPage() {

  const navigate = useNavigate();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [createdReport, setCreatedReport] = useState<any>(null);

  const [pickedFiles, setPickedFiles] = useState<File[]>([]);

  const [form, setForm] = useState({
    customerId: '',
    procurementType: 'WITHOUT_PO',
    taxMode: 'WITHOUT_VAT',
    containerNumber: '',
    notes: '',
    items: [] as Item[],
  });

  // Working draft of an item (no articleName field shown anymore)
  const [item, setItem] = useState<Item>({
    articleName: '',
    description: '',
    quantity: 0,
    unitPrice: 0,
    vatPercent: 0,
  });

  const [stdExpenses, setStdExpenses] = useState<StdRow[]>(
    STANDARD_EXPENSES.map((name) => ({
      description: name,
      checked: false,
      quantity: 1,
      unitRate: 0,
    }))
  );

  const [customExpenses, setCustomExpenses] = useState<Expense[]>([]);
  const [customExpense, setCustomExpense] = useState<Expense>({
    description: '',
    quantity: 1,
    unitRate: 0,
  });

  // =========================
  // FETCH CUSTOMERS
  // =========================
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoadingCustomers(true);
      try {
        const res = await api.get('/api/companies');
        const payload =
          res.data?.data ?? res.data?.content ?? res.data ?? [];
        setCustomers(Array.isArray(payload) ? payload : []);
      } catch (err) {
        console.error('Customer fetch failed:', err);
        setCustomers([]);
      } finally {
        setLoadingCustomers(false);
      }
    };
    fetchCustomers();
  }, []);

  // =========================
  // ITEMS
  // =========================
  const addItem = () => {
    if (!item.description.trim()) {
      alert('Description is required');
      return;
    }
    // Derive articleName from the first non-blank line of the description
    // so the backend always receives a valid value without showing the field.
    const firstLine = item.description
      .split(/\r?\n/)
      .map((s) => s.trim())
      .find((s) => s.length > 0) || 'ITEM';

    const itemToAdd: Item = {
      ...item,
      articleName: firstLine,
    };

    setForm((prev) => ({ ...prev, items: [...prev.items, itemToAdd] }));

    setItem({
      articleName: '',
      description: '',
      quantity: 0,
      unitPrice: 0,
      vatPercent: 0,
    });
  };

  const removeItem = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));
  };

  // =========================
  // STANDARD EXPENSE CHECKLIST
  // =========================
  const toggleStd = (idx: number) => {
    setStdExpenses((prev) =>
      prev.map((row, i) =>
        i === idx ? { ...row, checked: !row.checked } : row
      )
    );
  };

  const updateStd = (
    idx: number,
    field: 'quantity' | 'unitRate',
    value: number
  ) => {
    setStdExpenses((prev) =>
      prev.map((row, i) =>
        i === idx ? { ...row, [field]: value } : row
      )
    );
  };

  // =========================
  // CUSTOM EXPENSES
  // =========================
  const addCustomExpense = () => {
    if (!customExpense.description.trim()) {
      alert('Description is required');
      return;
    }
    setCustomExpenses((prev) => [...prev, customExpense]);
    setCustomExpense({ description: '', quantity: 1, unitRate: 0 });
  };

  const removeCustomExpense = (idx: number) => {
    setCustomExpenses((prev) => prev.filter((_, i) => i !== idx));
  };

  // =========================
  // SAVE
  // =========================
  const saveReport = async () => {

    if (!form.customerId) {
      alert('Please select a customer');
      return;
    }
    if (!form.containerNumber.trim()) {
      alert('Container No. is required');
      return;
    }
    if (form.items.length === 0) {
      alert('Add at least one item');
      return;
    }

    const expenses: Expense[] = [
      ...stdExpenses
        .filter((row) => row.checked)
        .map((row) => ({
          description: row.description,
          quantity: row.quantity,
          unitRate: row.unitRate,
        })),
      ...customExpenses,
    ];

    setSaving(true);
    try {
      const payload = {
        ...form,
        customerId: Number(form.customerId),
        expenses,
      };
      const created = await salesReportService.create(payload);
      setCreatedReport(created);
    } catch (err: any) {
      console.error('Sales report create failed:', err);
      alert(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to create sales report'
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // SEND EMAIL
  // =========================
  const sendPlain = async () => {
    if (!createdReport?.id) return;
    setSending(true);
    try {
      await salesReportService.sendMail(createdReport.id);
      alert('Sales Report email sent successfully');
      resetAfterSend();
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Email failed');
    } finally {
      setSending(false);
    }
  };

  const sendWithAttachments = async () => {
    if (!createdReport?.id) return;
    if (pickedFiles.length === 0) {
      alert('Pick at least one PDF to attach');
      return;
    }
    setSending(true);
    try {
      await salesReportService.sendMailWithAttachments(
        createdReport.id,
        pickedFiles
      );
      alert('Sales Report email sent with attachments merged');
      resetAfterSend();
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Email failed');
    } finally {
      setSending(false);
    }
  };

  const resetAfterSend = () => {
    setCreatedReport(null);
    setPickedFiles([]);
    setForm({
      customerId: '',
      procurementType: 'WITHOUT_PO',
      taxMode: 'WITHOUT_VAT',
      containerNumber: '',
      notes: '',
      items: [],
    });
    setStdExpenses(
      STANDARD_EXPENSES.map((name) => ({
        description: name,
        checked: false,
        quantity: 1,
        unitRate: 0,
      }))
    );
    setCustomExpenses([]);
    navigate('/sales-reports');
  };

  // =========================
  // FILE PICKER
  // =========================
  const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list) return;
    const accepted: File[] = [];
    for (let i = 0; i < list.length; i++) {
      const f = list[i];
      const isPdf =
        f.type === 'application/pdf' ||
        f.name.toLowerCase().endsWith('.pdf');
      if (!isPdf) {
        alert(`Skipped non-PDF file: ${f.name}`);
        continue;
      }
      accepted.push(f);
    }
    setPickedFiles((prev) => [...prev, ...accepted]);
    e.target.value = '';
  };

  const removePicked = (idx: number) =>
    setPickedFiles((prev) => prev.filter((_, i) => i !== idx));

  // ─────────────────────── RENDER ───────────────────────
  return (
    <div className="min-h-screen pb-32" style={{ background: 'linear-gradient(180deg,#eefaf3 0%,#f6f9f7 22%,#f8fafc 100%)' }}>

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

        <div className="relative">
          <p className="text-white/70 text-[11px] font-medium tracking-wide uppercase">Exponab</p>
          <h1 className="text-2xl font-bold leading-tight mt-0.5">Create Sales Report</h1>
          <p className="text-white/80 text-sm mt-1">
            Sales Order / Sales Report
          </p>
        </div>
      </div>

      <div className="p-4 space-y-4">

        {/* CUSTOMER */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_10px_40px_-12px_rgba(0,80,50,0.18)]">
          <div className="flex items-center gap-2 font-semibold mb-3">
            <User size={18} color={PRIMARY} />
            Customer *
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

        {/* CONTAINER NO. */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_10px_40px_-12px_rgba(0,80,50,0.18)]">
          <div className="flex items-center gap-2 font-semibold mb-3">
            <Container size={18} color={PRIMARY} />
            Container No. *
          </div>
          <input
            className="w-full border rounded-2xl p-4 text-sm focus:ring-2 focus:ring-emerald-600"
            placeholder="e.g. OTPU 6691934"
            value={form.containerNumber}
            onChange={(e) =>
              setForm({ ...form, containerNumber: e.target.value })
            }
          />
        </div>

        {/* CONFIG */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_10px_40px_-12px_rgba(0,80,50,0.18)]">
          <div className="flex items-center gap-2 font-semibold mb-3">
            <FileText size={18} color={PRIMARY} />
            Configuration
          </div>

          <label className="block text-xs text-slate-500 mb-1 mt-2">
            Procurement Type
          </label>
          <select
            className="w-full border rounded-2xl p-3 text-sm"
            value={form.procurementType}
            onChange={(e) =>
              setForm({ ...form, procurementType: e.target.value })
            }
          >
            {PROCUREMENT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <label className="block text-xs text-slate-500 mb-1 mt-3">
            Tax Mode
          </label>
          <select
            className="w-full border rounded-2xl p-3 text-sm"
            value={form.taxMode}
            onChange={(e) =>
              setForm({ ...form, taxMode: e.target.value })
            }
          >
            {VAT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <label className="block text-xs text-slate-500 mb-1 mt-3">
            Notes
          </label>
          <textarea
            className="w-full border rounded-2xl p-3 text-sm"
            placeholder="Internal notes..."
            value={form.notes}
            onChange={(e) =>
              setForm({ ...form, notes: e.target.value })
            }
          />
        </div>

        {/* ADD ITEM — articleName removed */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_10px_40px_-12px_rgba(0,80,50,0.18)]">
          <div className="flex items-center gap-2 font-semibold mb-3">
            <Package size={18} color={PRIMARY} />
            Add Item
          </div>

          <div className="space-y-3">

            <label className="block text-xs text-slate-500">
              Description of Goods *
            </label>
            <textarea
              className="w-full border rounded-2xl p-3 text-sm"
              rows={3}
              placeholder={`e.g.\nGRAPES\nGreen seedless\nPremium grade`}
              value={item.description}
              onChange={(e) =>
                setItem({ ...item, description: e.target.value })
              }
            />
            <p className="text-[10px] text-slate-400 -mt-1">
              💡 Each new line becomes a bullet point in the PDF
            </p>

            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                className="border rounded-2xl p-3 text-sm"
                placeholder="Qty"
                value={item.quantity || ''}
                onChange={(e) =>
                  setItem({ ...item, quantity: Number(e.target.value) })
                }
              />
              <input
                type="number"
                className="border rounded-2xl p-3 text-sm"
                placeholder="Unit Price"
                value={item.unitPrice || ''}
                onChange={(e) =>
                  setItem({ ...item, unitPrice: Number(e.target.value) })
                }
              />
              <input
                type="number"
                className="border rounded-2xl p-3 text-sm"
                placeholder="VAT %"
                value={item.vatPercent || ''}
                onChange={(e) =>
                  setItem({ ...item, vatPercent: Number(e.target.value) })
                }
              />
            </div>

            <button
              onClick={addItem}
              className="w-full py-3 rounded-2xl text-white flex items-center justify-center gap-2 shadow-md"
              style={{ background: 'linear-gradient(135deg,#008d5b,#00663f)' }}
            >
              <Plus size={16} />
              Add Item
            </button>
          </div>
        </div>

        {/* ITEMS LIST — show description (first line) instead of articleName */}
        {form.items.length > 0 && (
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_10px_40px_-12px_rgba(0,80,50,0.18)]">
            <div className="flex items-center gap-2 font-semibold mb-3">
              <CheckCircle2 size={18} color={PRIMARY} />
              Items ({form.items.length})
            </div>
            <div className="space-y-2">
              {form.items.map((it, i) => {
                const firstLine =
                  it.description.split(/\r?\n/).find((s) => s.trim().length > 0)
                  || 'Item';
                const extraLines = it.description
                  .split(/\r?\n/)
                  .filter((s) => s.trim().length > 0)
                  .slice(1);

                return (
                  <div
                    key={i}
                    className="flex justify-between items-start gap-2 text-sm p-3 rounded-2xl bg-slate-50"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-800 truncate">
                        {firstLine}
                      </div>
                      {extraLines.length > 0 && (
                        <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                          + {extraLines.length} more line{extraLines.length > 1 ? 's' : ''}
                        </div>
                      )}
                      <div className="text-xs text-slate-500 mt-0.5">
                        Qty {it.quantity} × {it.unitPrice}
                        {it.vatPercent ? ` · VAT ${it.vatPercent}%` : ''}
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(i)}
                      className="text-red-500 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── STANDARD EXPENSES CHECKLIST ─── */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_10px_40px_-12px_rgba(0,80,50,0.18)]">
          <div className="flex items-center gap-2 font-semibold mb-1">
            <ListChecks size={18} color={PRIMARY} />
            Standard Expenses
          </div>
          <p className="text-[11px] text-slate-500 mb-4">
            Tick the ones that apply to this shipment. Unticked items will be skipped.
          </p>

          <div className="space-y-2">
            {stdExpenses.map((row, i) => (
              <div
                key={i}
                className={`rounded-2xl p-3 border ${
                  row.checked
                    ? 'border-emerald-200 bg-emerald-50'
                    : 'border-slate-100 bg-slate-50'
                }`}
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={row.checked}
                    onChange={() => toggleStd(i)}
                    className="w-5 h-5 accent-emerald-600"
                  />
                  <span className="flex-1 text-sm font-semibold text-slate-800">
                    {i + 1}. {row.description}
                  </span>
                </label>

                {row.checked && (
                  <div className="grid grid-cols-2 gap-2 mt-3 pl-8">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        className="w-full border rounded-xl p-2 text-sm bg-white"
                        value={row.quantity || ''}
                        onChange={(e) =>
                          updateStd(i, 'quantity', Number(e.target.value))
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">
                        Unit Rate
                      </label>
                      <input
                        type="number"
                        className="w-full border rounded-xl p-2 text-sm bg-white"
                        value={row.unitRate || ''}
                        onChange={(e) =>
                          updateStd(i, 'unitRate', Number(e.target.value))
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ─── CUSTOM EXPENSES ─── */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_10px_40px_-12px_rgba(0,80,50,0.18)]">
          <div className="flex items-center gap-2 font-semibold mb-1">
            <Receipt size={18} color={PRIMARY} />
            Additional Expenses (one-time)
          </div>
          <p className="text-[11px] text-slate-500 mb-3">
            Anything not in the 15 standard items. Not saved for future reports.
          </p>

          <div className="space-y-3">
            <input
              className="w-full border rounded-2xl p-3 text-sm"
              placeholder="Description"
              value={customExpense.description}
              onChange={(e) =>
                setCustomExpense({ ...customExpense, description: e.target.value })
              }
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                className="border rounded-2xl p-3 text-sm"
                placeholder="Qty"
                value={customExpense.quantity || ''}
                onChange={(e) =>
                  setCustomExpense({
                    ...customExpense,
                    quantity: Number(e.target.value),
                  })
                }
              />
              <input
                type="number"
                className="border rounded-2xl p-3 text-sm"
                placeholder="Unit Rate"
                value={customExpense.unitRate || ''}
                onChange={(e) =>
                  setCustomExpense({
                    ...customExpense,
                    unitRate: Number(e.target.value),
                  })
                }
              />
            </div>
            <button
              onClick={addCustomExpense}
              className="w-full py-3 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add Custom Expense
            </button>
          </div>

          {customExpenses.length > 0 && (
            <div className="space-y-2 mt-4">
              {customExpenses.map((ex, i) => (
                <div
                  key={i}
                  className="flex justify-between items-start gap-2 text-sm p-3 rounded-2xl bg-blue-50 border border-blue-100"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-800 truncate">
                      {ex.description}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {ex.quantity} × {ex.unitRate}
                    </div>
                  </div>
                  <button
                    onClick={() => removeCustomExpense(i)}
                    className="text-red-500 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FLOATING SAVE BUTTON */}
      <div className="fixed bottom-20 left-0 right-0 px-5">
        <button
          onClick={saveReport}
          disabled={saving}
          className="w-full py-4 text-white rounded-2xl flex justify-center items-center gap-2 shadow-xl"
          style={{ background: 'linear-gradient(135deg,#008d5b,#00663f)' }}
        >
          {saving ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Creating...
            </>
          ) : (
            'Create Sales Report'
          )}
        </button>
      </div>

      {/* POST-CREATE MODAL */}
      {createdReport && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-5">
          <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto shadow-2xl">

            <div
              className="px-5 py-5 text-white rounded-t-3xl"
              style={{ background: 'linear-gradient(135deg,#008d5b,#00663f)' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={22} />
                  <div>
                    <h3 className="font-bold">Report Created</h3>
                    <p className="text-xs text-white/80">
                      #{createdReport.reportNumber}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setCreatedReport(null)}
                  className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-2xl p-3">
                  <p className="text-xs text-slate-400">Grand Total</p>
                  <p className="font-bold text-blue-600">
                    {createdReport.currencySymbol || 'AED'} {createdReport.grandTotal}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-3">
                  <p className="text-xs text-slate-400">Final Payable</p>
                  <p className="font-bold text-emerald-600">
                    {createdReport.currencySymbol || 'AED'} {createdReport.finalPayable}
                  </p>
                </div>
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Paperclip size={16} color={PRIMARY} />
                  <p className="text-sm font-semibold">
                    Attach extra PDFs (optional)
                  </p>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  Packing list, BL, COO etc. — merged into one PDF
                </p>

                <label className="block">
                  <input
                    type="file"
                    accept="application/pdf"
                    multiple
                    onChange={onPickFiles}
                    className="hidden"
                  />
                  <div className="cursor-pointer text-center py-3 rounded-xl bg-slate-100 text-sm font-semibold">
                    + Choose PDF files
                  </div>
                </label>

                {pickedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {pickedFiles.map((f, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center text-xs bg-white border rounded-xl px-3 py-2"
                      >
                        <span className="truncate flex-1">{f.name}</span>
                        <button
                          onClick={() => removePicked(i)}
                          className="text-red-500 ml-2"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={sendPlain}
                  disabled={sending}
                  className="w-full py-3 rounded-2xl text-white font-semibold flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg,#008d5b,#00663f)' }}
                >
                  {sending ? <Loader2 className="animate-spin" size={16} /> : <Mail size={16} />}
                  Send Email (without attachments)
                </button>

                <button
                  onClick={sendWithAttachments}
                  disabled={sending || pickedFiles.length === 0}
                  className="w-full py-3 rounded-2xl bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {sending ? <Loader2 className="animate-spin" size={16} /> : <Paperclip size={16} />}
                  Send Email + Merged PDFs ({pickedFiles.length})
                </button>

                <button
                  onClick={resetAfterSend}
                  className="w-full py-3 rounded-2xl border text-slate-600 font-semibold"
                >
                  Skip — go to list
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

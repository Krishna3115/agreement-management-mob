import React, { useState, useEffect, useCallback } from 'react';
import {
  Building2,
  Plus,
  Search,
  X,
  MapPin,
  User,
  ChevronRight,
  Loader2,
  RefreshCw,
  Mail,
  Phone,
  FileText,
  PackageCheck,
  Receipt,
  ClipboardList,
} from 'lucide-react';

import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Company } from '../data/mockData';
import api from '../../services/api';

// ─────────────────────────────────────────────────────────
// THEME
// ─────────────────────────────────────────────────────────
const PRIMARY = '#008d5b';

// ─────────────────────────────────────────────────────────
// STATUS CONFIG
// ─────────────────────────────────────────────────────────
const getStatusCfg = (status: string) => {
  const map: Record<string, { label: string; color: string }> = {
    REGISTERED: {
      label: 'Registered',
      color: 'bg-slate-100 text-slate-600',
    },

    QUOTATION_SENT: {
      label: 'Proposal Sent',
      color: 'bg-yellow-100 text-yellow-700',
    },

    AGREEMENT_SENT: {
      label: 'PO Sent',
      color: 'bg-orange-100 text-orange-700',
    },

    AGREEMENT_SIGNED: {
      label: 'Material Received',
      color: 'bg-green-100 text-green-700',
    },

    INVOICED: {
      label: 'Sales Generated',
      color: 'bg-emerald-100 text-emerald-700',
    },

    ACTIVE: {
      label: 'Active',
      color: 'bg-blue-100 text-blue-700',
    },

    INACTIVE: {
      label: 'Inactive',
      color: 'bg-red-100 text-red-700',
    },
  };

  return (
    map[status] ?? {
      label: status,
      color: 'bg-slate-100 text-slate-600',
    }
  );
};

// ─────────────────────────────────────────────────────────
// STATES
// ─────────────────────────────────────────────────────────
const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
];

// ─────────────────────────────────────────────────────────
// FORM
// ─────────────────────────────────────────────────────────
const emptyForm = {
  companyName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  country: 'India',
  pincode: '',
  gstNumber: '',
  contactPersonName: '',
  contactPersonPhone: '',
};

type CompanyForm = typeof emptyForm;

const inputCls =
  'w-full px-4 py-3 text-sm border border-slate-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600';

const selectCls =
  'w-full px-4 py-3 text-sm border border-slate-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600';

// ─────────────────────────────────────────────────────────
// FIELD COMPONENT
// ─────────────────────────────────────────────────────────
function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────
function sanitizeEmail(email: string) {
  return email.replace(/^mailto:/i, '').trim();
}

function sanitizePhone(phone: string) {
  return phone.replace(/\s+/g, '').trim();
}

function validateStep(step: number, form: CompanyForm): string | null {
  if (step === 0) {
    if (!form.companyName.trim())
      return 'Company name is required.';

    if (!form.email.trim())
      return 'Email address is required.';

    if (!form.phone.trim())
      return 'Phone number is required.';
  }

  if (step === 1) {
    if (!form.address.trim())
      return 'Address is required.';

    if (!form.city.trim())
      return 'City is required.';

    if (!form.state.trim())
      return 'State is required.';
  }

  if (step === 2) {
    if (!form.contactPersonName.trim())
      return 'Contact person name is required.';

    if (!form.contactPersonPhone.trim())
      return 'Contact phone is required.';
  }

  return null;
}

// ─────────────────────────────────────────────────────────
// COMPANY DETAIL MODAL
// ─────────────────────────────────────────────────────────
function CompanyDetailModal({
  company,
  onClose,
}: {
  company: Company;
  onClose: () => void;
}) {
  const navigate = useNavigate();

  const cfg = getStatusCfg(company.status);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-5">
      <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto shadow-2xl">

        {/* HEADER */}
        <div
          className="px-5 py-5 text-white"
          style={{ background: PRIMARY }}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-3">
                <Building2 size={24} />
              </div>

              <h2 className="text-xl font-bold">
                {company.companyName}
              </h2>

              <div
                className={`inline-flex mt-2 px-3 py-1 rounded-full text-xs font-semibold ${cfg.color}`}
              >
                {cfg.label}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-4">

          <div className="bg-slate-50 rounded-2xl p-4 space-y-4">

            <div className="flex gap-3">
              <Mail size={16} className="text-slate-400 mt-0.5" />

              <div>
                <p className="text-xs text-slate-400 mb-1">
                  Email
                </p>

                <p className="text-sm text-slate-700">
                  {company.email}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Phone size={16} className="text-slate-400 mt-0.5" />

              <div>
                <p className="text-xs text-slate-400 mb-1">
                  Phone
                </p>

                <p className="text-sm text-slate-700">
                  {company.phone}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <MapPin size={16} className="text-slate-400 mt-0.5" />

              <div>
                <p className="text-xs text-slate-400 mb-1">
                  Address
                </p>

                <p className="text-sm text-slate-700">
                  {company.address}, {company.city}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <User size={16} className="text-slate-400 mt-0.5" />

              <div>
                <p className="text-xs text-slate-400 mb-1">
                  Contact Person
                </p>

                <p className="text-sm text-slate-700">
                  {company.contactPersonName}
                </p>
              </div>
            </div>

            {company.gstNumber && (
              <div>
                <p className="text-xs text-slate-400 mb-1">
                  GST Number
                </p>

                <p className="text-sm font-medium text-slate-700">
                  {company.gstNumber}
                </p>
              </div>
            )}
          </div>

          {/* ACTIONS */}
          <div className="grid grid-cols-2 gap-3">

            <button
              onClick={() => navigate('/proposals')}
              className="rounded-2xl border border-slate-200 p-4 flex flex-col items-center gap-2 hover:bg-slate-50"
            >
              <ClipboardList size={20} color={PRIMARY} />

              <span className="text-xs font-medium">
                Proposal
              </span>
            </button>

            <button
              onClick={() => navigate('/purchase-orders')}
              className="rounded-2xl border border-slate-200 p-4 flex flex-col items-center gap-2 hover:bg-slate-50"
            >
              <FileText size={20} color={PRIMARY} />

              <span className="text-xs font-medium">
                Purchase Order
              </span>
            </button>

            <button
              onClick={() => navigate('/material-receiving')}
              className="rounded-2xl border border-slate-200 p-4 flex flex-col items-center gap-2 hover:bg-slate-50"
            >
              <PackageCheck size={20} color={PRIMARY} />

              <span className="text-xs font-medium">
                Material
              </span>
            </button>

            <button
              onClick={() => navigate('/sales-reports')}
              className="rounded-2xl border border-slate-200 p-4 flex flex-col items-center gap-2 hover:bg-slate-50"
            >
              <Receipt size={20} color={PRIMARY} />

              <span className="text-xs font-medium">
                Sales Report
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// REGISTER MODAL
// ─────────────────────────────────────────────────────────
function RegisterSheet({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (company: Company) => void;
}) {
  const [form, setForm] = useState<CompanyForm>(emptyForm);

  const [step, setStep] = useState(0);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const setField = (k: keyof CompanyForm, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
  };

  const handleNext = () => {
    const err = validateStep(step, form);

    if (err) {
      setError(err);
      return;
    }

    setError(null);

    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    const err = validateStep(step, form);

    if (err) {
      setError(err);
      return;
    }

    setSaving(true);

    try {
      const payload = {
        companyName: form.companyName.trim(),
        email: sanitizeEmail(form.email),
        phone: sanitizePhone(form.phone),
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        country: form.country.trim(),
        pincode: form.pincode.trim(),
        gstNumber: form.gstNumber.trim(),
        contactPersonName: form.contactPersonName.trim(),
        contactPersonPhone: sanitizePhone(
          form.contactPersonPhone
        ),
      };

      const response = await api.post(
        '/api/companies/register',
        payload
      );

      const data = response.data;

      if (data.success) {
        onSave(data.data);
        onClose();
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Failed to register company.'
      );
    } finally {
      setSaving(false);
    }
  };

  const steps = ['Company', 'Address', 'Contact'];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-5">
      <div className="w-full sm:max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[95vh] flex flex-col">

        {/* HEADER */}
        <div
          className="px-5 py-5 text-white"
          style={{ background: PRIMARY }}
        >
          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-xl font-bold">
                Register Company
              </h2>

              <p className="text-sm text-white/80 mt-1">
                Step {step + 1} of {steps.length}
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* STEPS */}
        <div className="px-5 pt-5">
          <div className="flex gap-2">
            {steps.map((s, i) => (
              <div key={s} className="flex-1">
                <div
                  className={`h-2 rounded-full ${
                    i <= step
                      ? 'bg-emerald-600'
                      : 'bg-slate-200'
                  }`}
                />

                <p className="text-[11px] text-slate-500 mt-1">
                  {s}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mx-5 mt-4 p-3 rounded-2xl bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* FORM */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* STEP 1 */}
          {step === 0 && (
            <>
              <Field label="Company Name" required>
                <input
                  value={form.companyName}
                  onChange={(e) =>
                    setField('companyName', e.target.value)
                  }
                  className={inputCls}
                  placeholder="ABC Pvt Ltd"
                />
              </Field>

              <Field label="Email" required>
                <input
                  value={form.email}
                  onChange={(e) =>
                    setField('email', e.target.value)
                  }
                  className={inputCls}
                  placeholder="company@email.com"
                />
              </Field>

              <Field label="Phone" required>
                <input
                  value={form.phone}
                  onChange={(e) =>
                    setField('phone', e.target.value)
                  }
                  className={inputCls}
                  placeholder="9876543210"
                />
              </Field>

              <Field label="GST Number (Optional)">
                <input
                  value={form.gstNumber}
                  onChange={(e) =>
                    setField(
                      'gstNumber',
                      e.target.value.toUpperCase()
                    )
                  }
                  className={inputCls}
                  placeholder="27AAACT0000A1Z5"
                />
              </Field>
            </>
          )}

          {/* STEP 2 */}
          {step === 1 && (
            <>
              <Field label="Address" required>
                <textarea
                  rows={3}
                  value={form.address}
                  onChange={(e) =>
                    setField('address', e.target.value)
                  }
                  className={`${inputCls} resize-none`}
                />
              </Field>

              <Field label="City" required>
                <input
                  value={form.city}
                  onChange={(e) =>
                    setField('city', e.target.value)
                  }
                  className={inputCls}
                />
              </Field>

              <Field label="State" required>
                <select
                  value={form.state}
                  onChange={(e) =>
                    setField('state', e.target.value)
                  }
                  className={selectCls}
                >
                  <option value="">
                    Select State
                  </option>

                  {INDIAN_STATES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
            </>
          )}

          {/* STEP 3 */}
          {step === 2 && (
            <>
              <Field label="Contact Person Name" required>
                <input
                  value={form.contactPersonName}
                  onChange={(e) =>
                    setField(
                      'contactPersonName',
                      e.target.value
                    )
                  }
                  className={inputCls}
                />
              </Field>

              <Field label="Contact Phone" required>
                <input
                  value={form.contactPersonPhone}
                  onChange={(e) =>
                    setField(
                      'contactPersonPhone',
                      e.target.value
                    )
                  }
                  className={inputCls}
                />
              </Field>
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-5 border-t border-slate-100 flex gap-3">

          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 font-semibold"
            >
              Back
            </button>
          )}

          {step < 2 ? (
            <button
              onClick={handleNext}
              className="flex-1 py-3 rounded-2xl text-white font-semibold"
              style={{ background: PRIMARY }}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 py-3 rounded-2xl text-white font-semibold flex items-center justify-center gap-2"
              style={{ background: PRIMARY }}
            >
              {saving ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                'Register Company'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────
export default function CompaniesPage() {
  const { addCompany } = useApp();

  const [companies, setCompanies] = useState<Company[]>([]);

  const [loading, setLoading] = useState(false);

  const [fetchError, setFetchError] = useState<
    string | null
  >(null);

  const [search, setSearch] = useState('');

  const [showForm, setShowForm] = useState(false);

  const [viewCompany, setViewCompany] =
    useState<Company | null>(null);

  // ─────────────────────────────────────────────────────────
  // FETCH
  // ─────────────────────────────────────────────────────────
  const fetchCompanies = useCallback(async () => {
    setLoading(true);

    setFetchError(null);

    try {
      const res = await api.get('/api/companies');

      const json = res.data;

      const list: Company[] = Array.isArray(json)
        ? json
        : Array.isArray(json?.data)
        ? json.data
        : [];

      setCompanies(list);
    } catch (err: any) {
      setFetchError(
        err?.message || 'Failed to fetch companies.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // ─────────────────────────────────────────────────────────
  // FILTER
  // ─────────────────────────────────────────────────────────
  const filtered = companies.filter((c) => {
    const term = search.toLowerCase();

    return (
      c.companyName?.toLowerCase().includes(term) ||
      c.city?.toLowerCase().includes(term) ||
      c.contactPersonName
        ?.toLowerCase()
        .includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-24">

      {/* HEADER */}
      <div
        className="px-4 pt-5 pb-6 rounded-b-[30px]"
        style={{ background: PRIMARY }}
      >
        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold text-white">
              Companies
            </h1>

            <p className="text-white/80 text-sm mt-1">
              {companies.length} registered companies
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg"
          >
            <Plus size={22} color={PRIMARY} />
          </button>
        </div>

        {/* SEARCH */}
        <div className="relative mt-5">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* ERROR */}
      {fetchError && (
        <div className="m-4 p-4 bg-red-50 text-red-600 rounded-2xl text-sm">
          {fetchError}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2
            size={24}
            className="animate-spin text-emerald-600"
          />
        </div>
      )}

      {/* LIST */}
      <div className="p-4 space-y-3">

        {filtered.map((c) => {
          const cfg = getStatusCfg(c.status);

          return (
            <button
              key={c.id}
              onClick={() => setViewCompany(c)}
              className="w-full bg-white rounded-3xl p-4 shadow-sm border border-slate-100 active:scale-[0.99]"
            >
              <div className="flex gap-4">

                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                  style={{
                    background: '#e6f6f0',
                  }}
                >
                  <Building2
                    size={22}
                    color={PRIMARY}
                  />
                </div>

                <div className="flex-1 min-w-0 text-left">

                  <div className="flex items-start justify-between gap-2">

                    <div>
                      <h3 className="text-sm font-bold text-slate-800 truncate">
                        {c.companyName}
                      </h3>

                      <p className="text-xs text-slate-400 mt-1">
                        {c.email}
                      </p>
                    </div>

                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-semibold ${cfg.color}`}
                    >
                      {cfg.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">

                    <div className="flex items-center gap-1">
                      <User size={12} />

                      {c.contactPersonName}
                    </div>

                    <div className="flex items-center gap-1">
                      <MapPin size={12} />

                      {c.city}
                    </div>
                  </div>
                </div>

                <ChevronRight
                  size={18}
                  className="text-slate-300 shrink-0 mt-5"
                />
              </div>
            </button>
          );
        })}

        {!loading && filtered.length === 0 && (
          <div className="bg-white rounded-3xl p-10 text-center">

            <Building2
              size={40}
              className="mx-auto text-slate-200 mb-3"
            />

            <p className="text-slate-400 text-sm">
              No companies found
            </p>
          </div>
        )}
      </div>

      {/* FLOATING REFRESH */}
      <button
        onClick={fetchCompanies}
        className="fixed bottom-24 right-5 w-14 h-14 rounded-full shadow-2xl text-white flex items-center justify-center"
        style={{ background: PRIMARY }}
      >
        <RefreshCw size={20} />
      </button>

      {/* MODALS */}
      {showForm && (
        <RegisterSheet
          onClose={() => setShowForm(false)}
          onSave={(company) => {
            addCompany(company);
            fetchCompanies();
          }}
        />
      )}

      {viewCompany && (
        <CompanyDetailModal
          company={viewCompany}
          onClose={() => setViewCompany(null)}
        />
      )}
    </div>
  );
}
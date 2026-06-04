import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Leaf,
  Globe2,
  Truck,
  FileText,
  Building2,
  Ship,
  PackageCheck,
  FileSpreadsheet,
  ChevronRight,
  Box,
  Users,
  BarChart3,
  ShoppingCart,
  Wallet,
} from 'lucide-react';
import { getAllCompanies } from '../../services/companyService';
import { salesReportService } from '../../services/salesReportService';
import { purchaseOrderService } from '../../services/purchaseOrderService';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Good Morning', emoji: '🌤️' };
  if (hour < 17) return { text: 'Good Afternoon', emoji: '☀️' };
  return { text: 'Good Evening', emoji: '🌙' };
}

function getDate() {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// ─── DATA ──────────────────────────────────────────────────────────
// 'key' maps each card to a live count fetched from the backend.
const STATS = [
  {
    key: 'companies',
    label: 'Client Companies',
    desc: 'Registered import/export partners',
    icon: Building2,
    iconColor: '#008d5b',
    iconBg: 'rgba(0,141,91,0.12)',
    path: '/companies',
  },
  {
    key: 'salesReports',
    label: 'Sales Reports',
    desc: 'Generated with VAT & pricing',
    icon: FileText,
    iconColor: '#c89b3c',
    iconBg: 'rgba(224,176,48,0.12)',
    path: '/sales-reports',
  },
  {
    key: 'purchaseOrders',
    label: 'Purchase Orders',
    desc: 'POs sent to suppliers',
    icon: Ship,
    iconColor: '#197bff',
    iconBg: 'rgba(25,123,255,0.12)',
    path: '/purchase-orders',
  },
];

const WORKFLOW = [
  { label: 'Add Client Company Details',         path: '/companies' },
  { label: 'Create Purchase Order (Optional)',   path: '/purchase-orders' },
  { label: 'Generate Sales Order',               path: '/sales-orders' },
  { label: 'Create VAT / Non-VAT Sales Reports', path: '/sales-reports' },
  { label: 'Upload & Merge PDF Attachments',     path: '/sales-reports' },
  { label: 'Generate Final Export Documents',    path: '/sales-reports' },
];

const OPS = [
  {
    icon: Building2,
    title: 'Client Company Management',
    desc: 'Register and manage international agro companies',
    path: '/companies',
  },
  {
    icon: Truck,
    title: 'Purchase & Sales Orders',
    desc: 'Generate and share trade documents instantly',
    path: '/purchase-orders',
  },
  {
    icon: FileSpreadsheet,
    title: 'Sales Report Generation',
    desc: 'VAT calculations, pricing & quantity management',
    path: '/sales-orders',
  },
  {
    icon: Globe2,
    title: 'Global Trade Workflow',
    desc: 'Manage export/import operations worldwide',
    path: '/sales-reports',
  },
  {
  icon: Wallet,                 // import { Wallet } from 'lucide-react'
  title: 'Field Operations',
  desc: 'Cash settlement, container expenses & clarity',
  path: '/field/operations',
  color: '#dc2626',
  bg: 'rgba(220,38,38,0.12)',
},

];

// ─── NEW: FIELD SALES / INVOICE MODULE CARDS ───────────────────────
const FIELD_MODULES = [
  {
    icon: Box,
    title: 'Material Received',
    desc: 'Record containers & stock received',
    path: '/field/containers',
    color: '#197bff',
    bg: 'rgba(25,123,255,0.12)',
  },
  {
    icon: Users,
    title: 'Manage Salespeople',
    desc: 'Create & manage field-sales logins',
    path: '/field/salespeople',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.12)',
  },
  {
    icon: BarChart3,
    title: 'Field Sales Reports',
    desc: 'Sales, expenses & container stock',
    path: '/field/reports',
    color: '#008d5b',
    bg: 'rgba(0,141,91,0.12)',
  },
  {
    icon: ShoppingCart,
    title: 'Field Sales Panel',
    desc: 'Open the salesperson invoicing panel',
    path: '/field/sales',
    color: '#c89b3c',
    bg: 'rgba(224,176,48,0.12)',
  },
];

// ─── COMPONENT ──────────────────────────────────────────────────────
export default function DashboardPage() {
  const greeting = getGreeting();
  const navigate = useNavigate();
  const [, setVisible] = useState(false);

  // Live counts for the stat cards (null = still loading)
  const [counts, setCounts] = useState<{ [k: string]: number | null }>({
    companies: null,
    salesReports: null,
    purchaseOrders: null,
  });

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Fetch real counts from the backend
  useEffect(() => {
    const safeLen = (v: any) => (Array.isArray(v) ? v.length : 0);

    getAllCompanies()
      .then((d) => setCounts((c) => ({ ...c, companies: safeLen(d) })))
      .catch(() => setCounts((c) => ({ ...c, companies: 0 })));

    salesReportService.getAll()
      .then((d) => setCounts((c) => ({ ...c, salesReports: safeLen(d) })))
      .catch(() => setCounts((c) => ({ ...c, salesReports: 0 })));

    purchaseOrderService.getAll()
      .then((d) => setCounts((c) => ({ ...c, purchaseOrders: safeLen(d) })))
      .catch(() => setCounts((c) => ({ ...c, purchaseOrders: 0 })));
  }, []);

  return (
    <div className="dashboard-root">

      {/* ─── INLINE STYLES (animations + safe area + responsive) ─── */}
      <style>{`
        .dashboard-root {
          min-height: 100%;
          background: linear-gradient(160deg, #f4fff7 0%, #eef7ef 40%, #f7f3e8 100%);
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          position: relative;
          overflow-x: hidden;
          padding-top: env(safe-area-inset-top, 0);
          padding-bottom: calc(env(safe-area-inset-bottom, 0) + 1rem);
          padding-left: env(safe-area-inset-left, 0);
          padding-right: env(safe-area-inset-right, 0);
        }

        .dashboard-inner {
          padding: 1rem;
          max-width: 1300px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        @media (min-width: 640px)  { .dashboard-inner { padding: 1.5rem; } }
        @media (min-width: 1024px) { .dashboard-inner { padding: 2rem; } }

        .blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }
        .blob-1 {
          top: -80px; right: -80px;
          width: 220px; height: 220px;
          background: radial-gradient(circle, rgba(0,128,72,0.12) 0%, transparent 70%);
          animation: pulse 8s ease-in-out infinite;
        }
        // .blob-2 {
        //   bottom: -100px; left: -100px;
        //   width: 200px; height: 200px;
        //   background: radial-gradient(circle, rgba(180,145,60,0.14) 0%, transparent 70%);
        //   animation: pulse 10s ease-in-out infinite;
        // }
        @media (min-width: 640px) {
          .blob-1 { width: 300px; height: 300px; }
          .blob-2 { width: 260px; height: 260px; }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.15); opacity: 0.7; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        .fade-up-1 { animation: fadeUp 0.6s ease forwards; opacity: 0; animation-delay: 0.10s; }
        .fade-up-2 { animation: fadeUp 0.6s ease forwards; opacity: 0; animation-delay: 0.25s; }
        .fade-up-3 { animation: fadeUp 0.6s ease forwards; opacity: 0; animation-delay: 0.40s; }
        .fade-up-4 { animation: fadeUp 0.6s ease forwards; opacity: 0; animation-delay: 0.55s; }
        .fade-up-5 { animation: fadeUp 0.6s ease forwards; opacity: 0; animation-delay: 0.70s; }
        .fade-up-6 { animation: fadeUp 0.6s ease forwards; opacity: 0; animation-delay: 0.85s; }

        .gold-shimmer {
          background: linear-gradient(90deg, #c89b3c, #f0d47a, #c89b3c, #f7df97);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 5s linear infinite;
        }

        .greeting-label {
          color: #6c8c71;
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin: 0 0 0.25rem 0;
          font-weight: 600;
        }
        .greeting-date {
          color: #93a08f;
          font-size: 0.68rem;
          letter-spacing: 0.08em;
          margin: 0;
        }

        .brand-row {
          margin-top: 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .brand-bar {
          width: 4px;
          height: 44px;
          border-radius: 20px;
          background: linear-gradient(180deg, #008d5b, #e2be61);
        }
        .brand-title {
          color: #0a5a3d;
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0;
          line-height: 1.1;
        }
        .brand-subtitle {
          font-size: 1.05rem;
          font-weight: 700;
          margin: 0;
        }
        .brand-tag {
          margin-top: 0.6rem;
          color: #7f7f65;
          letter-spacing: 0.14em;
          font-size: 0.65rem;
          text-transform: uppercase;
          padding-left: 0.65rem;
          font-weight: 600;
        }

        @media (min-width: 640px) {
          .brand-bar      { width: 5px; height: 52px; }
          .brand-title    { font-size: 2rem; }
          .brand-subtitle { font-size: 1.4rem; }
          .brand-tag      { font-size: 0.74rem; }
        }

        .status-badge {
          background: rgba(0,141,91,0.1);
          border: 1px solid rgba(0,141,91,0.15);
          color: #0a7a4e;
          padding: 0.55rem 0.85rem;
          border-radius: 0.85rem;
          font-weight: 600;
          font-size: 0.75rem;
          white-space: nowrap;
        }
        @media (min-width: 640px) {
          .status-badge { font-size: 0.85rem; padding: 0.8rem 1rem; border-radius: 1rem; }
        }

        .divider-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin: 1.4rem 0;
        }
        @media (min-width: 640px) { .divider-row { margin: 2rem 0; } }
        .divider-line {
          flex: 1;
          height: 1px;
        }

        /* Section heading */
        .section-title {
          font-size: 0.8rem;
          font-weight: 800;
          color: #0a5a3d;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin: 0 0 0.9rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        @media (min-width: 640px) { .section-title { font-size: 0.9rem; } }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        @media (min-width: 640px)  { .stats-grid { gap: 1rem; grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (min-width: 1024px) { .stats-grid { gap: 1.25rem; grid-template-columns: repeat(4, minmax(0, 1fr)); } }

        .stat-card {
          background: #ffffff;
          border-radius: 1.1rem;
          padding: 1rem;
          border: 1px solid #e8eee9;
          width: 100%;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          display: flex;
          flex-direction: column;
        }
        @media (min-width: 640px) { .stat-card { padding: 1.3rem; border-radius: 1.2rem; } }
        @media (min-width: 1024px) { .stat-card { padding: 1.5rem; border-radius: 1.3rem; } }

        .stat-card:active { transform: scale(0.98); }
        @media (hover: hover) {
          .stat-card:hover { transform: translateY(-4px); box-shadow: 0 14px 40px rgba(0,0,0,0.08); }
        }

        .stat-icon-wrap {
          width: 40px; height: 40px;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.65rem;
        }
        @media (min-width: 640px) {
          .stat-icon-wrap { width: 52px; height: 52px; border-radius: 1rem; margin-bottom: 1rem; }
        }
        .stat-label {
          color: #8d8d75;
          font-size: 0.62rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin: 0 0 0.3rem 0;
        }
        @media (min-width: 640px) {
          .stat-label { font-size: 0.72rem; letter-spacing: 0.12em; margin-bottom: 0.45rem; }
        }
        .stat-value {
          font-size: 1.5rem;
          color: #123524;
          margin: 0;
          font-weight: 800;
        }
        @media (min-width: 640px) { .stat-value { font-size: 2rem; } }
        .stat-desc {
          color: #7f8a7d;
          font-size: 0.72rem;
          margin-top: 0.35rem;
          line-height: 1.4;
        }
        @media (min-width: 640px) {
          .stat-desc { font-size: 0.82rem; margin-top: 0.5rem; }
        }

        /* NEW: field module cards (4-up grid, action style) */
        .field-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        @media (min-width: 1024px) { .field-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; } }

        .field-card {
          background: #ffffff;
          border-radius: 1.1rem;
          padding: 1rem;
          border: 1px solid #e8eee9;
          width: 100%;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        @media (min-width: 640px) { .field-card { padding: 1.3rem; border-radius: 1.2rem; } }
        .field-card:active { transform: scale(0.98); }
        @media (hover: hover) {
          .field-card:hover { transform: translateY(-4px); box-shadow: 0 14px 40px rgba(0,0,0,0.08); }
        }
        .field-icon {
          width: 44px; height: 44px;
          border-radius: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .field-title { margin: 0; font-weight: 700; font-size: 0.9rem; color: #123524; }
        .field-desc  { margin: 0; font-size: 0.72rem; color: #7f8a7d; line-height: 1.4; }

        .main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 1rem;
        }
        @media (min-width: 1024px) {
          .main-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.5rem; }
        }

        .ops-card {
          background: linear-gradient(135deg, #006b44 0%, #059669 100%);
          border-radius: 1.25rem;
          padding: 1.25rem;
          position: relative;
          overflow: hidden;
          color: #ffffff;
          box-shadow: 0 14px 40px rgba(0,107,68,0.18);
        }
        @media (min-width: 640px)  { .ops-card { padding: 1.5rem;  border-radius: 1.5rem; } }
        @media (min-width: 1024px) { .ops-card { padding: 1.8rem; } }
        .ops-blob {
          position: absolute;
          top: -50px; right: -50px;
          width: 180px; height: 180px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.12), transparent);
          pointer-events: none;
        }
        .ops-eyebrow {
          color: #f0d47a;
          font-size: 0.65rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin: 0 0 1rem 0;
          font-weight: 700;
          position: relative;
          z-index: 1;
        }
        @media (min-width: 640px) { .ops-eyebrow { font-size: 0.72rem; letter-spacing: 0.18em; margin-bottom: 1.2rem; } }

        .ops-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          position: relative;
          z-index: 1;
        }
        @media (min-width: 640px) { .ops-list { gap: 1rem; } }

        .ops-item {
          display: flex;
          gap: 0.85rem;
          align-items: flex-start;
          background: transparent;
          border: none;
          padding: 0;
          width: 100%;
          text-align: left;
          color: inherit;
          font-family: inherit;
          cursor: pointer;
          border-radius: 0.85rem;
          transition: background 0.2s ease;
        }
        .ops-item:active { background: rgba(255,255,255,0.06); }
        @media (hover: hover) {
          .ops-item:hover { background: rgba(255,255,255,0.08); }
        }
        .ops-icon {
          width: 38px; height: 38px;
          border-radius: 0.75rem;
          background: rgba(255,255,255,0.14);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        @media (min-width: 640px) { .ops-icon { width: 42px; height: 42px; border-radius: 0.9rem; } }
        .ops-title  { margin: 0; font-weight: 700; font-size: 0.85rem; }
        .ops-desc   { margin-top: 0.25rem; color: #d5f0e2; font-size: 0.72rem; line-height: 1.5; }
        @media (min-width: 640px) {
          .ops-title { font-size: 0.92rem; }
          .ops-desc  { font-size: 0.78rem; line-height: 1.6; margin-top: 0.3rem; }
        }

        .workflow-card {
          background: rgba(255,255,255,0.78);
          border-radius: 1.25rem;
          padding: 1.25rem;
          border: 1px solid rgba(0,0,0,0.05);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        @media (min-width: 640px)  { .workflow-card { padding: 1.5rem;  border-radius: 1.5rem; } }
        @media (min-width: 1024px) { .workflow-card { padding: 1.8rem; } }

        .workflow-eyebrow {
          color: #8f8a6f;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          margin: 0 0 0.85rem 0;
          font-weight: 700;
        }
        @media (min-width: 640px) {
          .workflow-eyebrow { font-size: 0.72rem; letter-spacing: 0.18em; margin-bottom: 1rem; }
        }

        .workflow-list { display: flex; flex-direction: column; gap: 0.65rem; }
        @media (min-width: 640px) { .workflow-list { gap: 1rem; } }

        .workflow-step {
          display: flex;
          gap: 0.85rem;
          align-items: center;
          padding: 0.75rem 0.85rem;
          border-radius: 0.85rem;
          background: #f7faf7;
          border: 1px solid #edf1ed;
          width: 100%;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }
        @media (min-width: 640px) {
          .workflow-step { padding: 0.9rem 1rem; border-radius: 1rem; gap: 1rem; }
        }
        .workflow-step:active { transform: scale(0.99); }
        @media (hover: hover) {
          .workflow-step:hover {
            background: #ecf5ec;
            transform: translateX(4px);
            box-shadow: 0 4px 12px rgba(0,141,91,0.1);
          }
        }
        .workflow-num {
          min-width: 30px; height: 30px;
          border-radius: 50%;
          background: linear-gradient(135deg, #008d5b, #0dcf84);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 700;
          font-size: 0.78rem;
          flex-shrink: 0;
        }
        @media (min-width: 640px) { .workflow-num { min-width: 34px; height: 34px; font-size: 0.82rem; } }
        .workflow-text {
          margin: 0;
          color: #234130;
          font-size: 0.82rem;
          font-weight: 600;
          flex: 1;
        }
        @media (min-width: 640px) { .workflow-text { font-size: 0.88rem; } }
        .workflow-chevron { color: #234130; opacity: 0.4; flex-shrink: 0; }

        .footer-note {
          margin-top: 1.25rem;
          padding: 0.85rem;
          border-radius: 1rem;
          background: linear-gradient(135deg, rgba(200,155,60,0.1), rgba(0,141,91,0.08));
        }
        @media (min-width: 640px) {
          .footer-note { margin-top: 1.5rem; padding: 1rem; }
        }
        .footer-text {
          margin: 0;
          color: #5f614f;
          font-size: 0.74rem;
          line-height: 1.65;
        }
        @media (min-width: 640px) { .footer-text { font-size: 0.82rem; line-height: 1.7; } }
      `}</style>

      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <div className="dashboard-inner">

        {/* ─── GREETING ─── */}
        <div className="fade-up-1">
          <p className="greeting-label">{greeting.emoji} {greeting.text}</p>
          <p className="greeting-date">{getDate()}</p>
        </div>

        {/* ─── BRAND HEADER ─── */}
        <div className="fade-up-2 brand-row">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
              <div className="brand-bar" />
              <div>
                <h1 className="brand-title">Exponab</h1>
                <h2 className="brand-subtitle gold-shimmer">General Trading LLC</h2>
              </div>
            </div>
            <p className="brand-tag">Agriculture • Import • Export • Global Trading</p>
          </div>

          <div className="status-badge">Dubai Operations Active 🌍</div>
        </div>

        {/* ─── DIVIDER ─── */}
        <div className="fade-up-3 divider-row">
          <div className="divider-line" style={{ background: 'linear-gradient(90deg, transparent, #d8b763)' }} />
          <Leaf size={18} color="#0c8a58" />
          <div className="divider-line" style={{ background: 'linear-gradient(90deg, #d8b763, transparent)' }} />
        </div>

        {/* ─── STAT CARDS ─── */}
        <div className="fade-up-4 stats-grid">
          {STATS.map((s, i) => (
            <button key={i} onClick={() => navigate(s.path)} className="stat-card">
              <div className="stat-icon-wrap" style={{ background: s.iconBg }}>
                <s.icon color={s.iconColor} size={22} />
              </div>
              <p className="stat-label">{s.label}</p>
              <h2 className="stat-value">{counts[s.key] === null ? '…' : counts[s.key]}</h2>
              <p className="stat-desc">{s.desc}</p>
            </button>
          ))}
        </div>

        {/* ─── NEW: FIELD SALES / INVOICE MODULE ─── */}
        <div className="fade-up-5" style={{ marginBottom: '0.5rem' }}>
          <p className="section-title">
            <ShoppingCart size={16} color="#008d5b" />
            Field Sales &amp; Invoice Module
          </p>
        </div>

        <div className="fade-up-5 field-grid">
          {FIELD_MODULES.map((m, i) => (
            <button key={i} onClick={() => navigate(m.path)} className="field-card">
              <div className="field-icon" style={{ background: m.bg }}>
                <m.icon color={m.color} size={22} />
              </div>
              <p className="field-title">{m.title}</p>
              <p className="field-desc">{m.desc}</p>
            </button>
          ))}
        </div>

        {/* ─── MAIN GRID ─── */}
        <div className="main-grid">

          {/* LEFT - OPERATIONS */}
          <div className="fade-up-6 ops-card">
            <div className="ops-blob" />
            <p className="ops-eyebrow">Business Operations</p>
            <div className="ops-list">
              {OPS.map((item, i) => (
                <button key={i} className="ops-item" onClick={() => navigate(item.path)}>
                  <div className="ops-icon">
                    <item.icon size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="ops-title">{item.title}</p>
                    <p className="ops-desc">{item.desc}</p>
                  </div>
                  <ChevronRight size={16} style={{ opacity: 0.6, flexShrink: 0 }} />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT - WORKFLOW */}
          <div className="fade-up-6 workflow-card">
            <p className="workflow-eyebrow">Platform Workflow</p>

            <div className="workflow-list">
              {WORKFLOW.map((step, i) => (
                <button key={i} onClick={() => navigate(step.path)} className="workflow-step">
                  <div className="workflow-num">{i + 1}</div>
                  <p className="workflow-text">{step.label}</p>
                  <ChevronRight size={16} className="workflow-chevron" />
                </button>
              ))}
            </div>

            <div className="footer-note">
              <p className="footer-text">
                Exponab General Trading LLC manages agricultural import and export
                operations from Dubai with smart sales reports, document generation,
                invoice management, quotation workflows, and international trade tracking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

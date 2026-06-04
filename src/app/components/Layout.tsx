import React from 'react';
import { NavLink, useNavigate, Outlet, useLocation } from 'react-router';
import {
  LayoutDashboard, Building2, FileText, FileCheck, Receipt,
  Bell, User, Leaf,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const PRIMARY = '#008d5b';
const PRIMARY_DARK = '#00663f';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/companies', label: 'Companies', icon: Building2 },
  { to: '/quotations', label: 'Quotes', icon: FileText },
  { to: '/agreements', label: 'Agreements', icon: FileCheck },
  { to: '/invoices', label: 'Invoices', icon: Receipt },
];

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/companies': 'Companies',
  '/quotations': 'Quotations',
  '/purchase-orders': 'Purchase Orders',
  '/agreements': 'Agreements',
  '/invoices': 'Invoices',
  '/sales-reports': 'Sales Reports',
  '/sales-orders': 'Sales Order',
  '/price-list': 'Price List',
  '/material-receiving': 'Material Receiving',
};

export default function Layout() {
  const { logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const title = pageTitles[location.pathname] ?? 'Exponab';

  return (
    <div className="flex flex-col h-screen overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#eefaf3 0%,#f6f9f7 22%,#f8fafc 100%)' }}>

      {/* Top Header */}
      <header
        className="shrink-0 relative overflow-hidden flex items-center justify-between px-4 pt-safe text-white"
        style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_DARK} 100%)`, height: 60 }}
      >
        {/* subtle glow */}
        <div className="pointer-events-none absolute -top-10 right-10 w-32 h-32 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle,#9bffd0,transparent 70%)' }} />

        <div className="relative flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center border border-white/20"
            style={{ background: 'rgba(255,255,255,0.15)' }}>
            <Leaf size={16} className="text-emerald-100" />
          </div>
          <div className="leading-tight">
            <p className="text-[9px] text-white/60 uppercase tracking-wider font-semibold">Exponab</p>
            <span className="text-white text-sm font-bold">{title}</span>
          </div>
        </div>

        <div className="relative flex items-center gap-2">
          <button className="relative w-9 h-9 flex items-center justify-center rounded-full bg-white/15 active:bg-white/25 transition">
            <Bell size={16} className="text-white" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-300 rounded-full border border-emerald-900"></span>
          </button>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15 active:bg-white/25 transition"
          >
            <User size={15} className="text-white" />
          </button>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav
        className="shrink-0 fixed bottom-0 left-0 right-0 z-40 pb-safe px-3"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom,0) + 0.5rem)' }}
      >
        <div className="mx-auto max-w-md bg-white/90 backdrop-blur-xl border border-slate-200/70 rounded-[24px] shadow-[0_8px_30px_-6px_rgba(0,60,40,0.25)]">
          <div className="flex items-center h-16">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className="flex-1 flex flex-col items-center justify-center gap-1 py-2 transition active:scale-90"
              >
                {({ isActive }) => (
                  <>
                    <div className="w-11 h-8 flex items-center justify-center rounded-2xl transition-all"
                      style={isActive ? { background: 'rgba(0,141,91,0.12)', color: PRIMARY } : { color: '#94a3b8' }}>
                      <Icon size={18} />
                    </div>
                    <span className="text-[10px] font-bold leading-none"
                      style={{ color: isActive ? PRIMARY : '#94a3b8' }}>{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}

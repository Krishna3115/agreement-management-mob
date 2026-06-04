import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  User, Lock, Eye, EyeOff, AlertCircle, ChevronRight, Loader2,
  Leaf, Truck, Globe,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const PRIMARY = '#008d5b';
const PRIMARY_DARK = '#00663f';

export default function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await login(username, password);
    setLoading(false);
    if (ok) {
      const role = localStorage.getItem('user_role');
      if (role === 'SALESPERSON') navigate('/field/sales');
      else navigate('/');
    } else {
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen lg:flex relative overflow-hidden"
      style={{ background: `linear-gradient(150deg, ${PRIMARY_DARK} 0%, #064e3b 45%, ${PRIMARY} 100%)` }}>

      {/* ambient glow blobs (visible on all sizes) */}
      <div className="pointer-events-none absolute -top-32 -right-24 w-[420px] h-[420px] rounded-full blur-3xl opacity-30"
        style={{ background: 'radial-gradient(circle,#5eead4,transparent 70%)' }} />
      <div className="pointer-events-none absolute -bottom-40 -left-24 w-[360px] h-[360px] rounded-full blur-3xl opacity-20"
        style={{ background: 'radial-gradient(circle,#bbf7d0,transparent 70%)' }} />

      {/* ════════════ LEFT / BRAND PANEL (desktop) ════════════ */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative px-12">
        <div className="relative z-10 max-w-md">
          <div className="w-20 h-20 mb-7 rounded-3xl flex items-center justify-center border border-white/20 backdrop-blur"
            style={{ background: 'rgba(255,255,255,0.1)' }}>
            <Leaf size={38} className="text-emerald-200" />
          </div>
          <h1 className="text-white text-5xl font-extrabold tracking-tight">Exponab</h1>
          <p className="text-emerald-200/80 text-xs uppercase tracking-[5px] mt-3 mb-10">
            Agriculture • Export • Import
          </p>

          <div className="space-y-3">
            <Feature icon={<Truck size={20} />} title="Global Agro Trade" desc="Manage export & import shipments efficiently" />
            <Feature icon={<Leaf size={20} />} title="Farm Produce Tracking" desc="Track agricultural goods from farm to port" />
            <Feature icon={<Globe size={20} />} title="International Markets" desc="Connect with global buyers & suppliers" />
          </div>
        </div>
      </div>

      {/* ════════════ RIGHT / FORM PANEL ════════════ */}
      <div className="relative z-10 w-full lg:w-[480px] flex flex-col min-h-screen lg:min-h-0">

        {/* Mobile brand hero (premium, replaces the lost left panel) */}
        <div className="lg:hidden relative pt-14 pb-10 px-6 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-[26px] flex items-center justify-center border border-white/20 backdrop-blur-xl shadow-lg"
            style={{ background: 'rgba(255,255,255,0.12)' }}>
            <Leaf size={36} className="text-emerald-200" />
          </div>
          <h1 className="text-white text-3xl font-extrabold tracking-tight">Exponab</h1>
          <p className="text-emerald-200/80 text-[10px] uppercase tracking-[4px] mt-2">
            Agriculture • Export • Import
          </p>
        </div>

        {/* Form card — sheet on mobile, full panel on desktop */}
        <div className="flex-1 bg-white rounded-t-[34px] lg:rounded-none shadow-[0_-10px_40px_-12px_rgba(0,0,0,0.3)] lg:shadow-none flex flex-col justify-center px-6 sm:px-8 lg:px-12 py-10">
          <div className="w-full max-w-sm mx-auto">

            {/* little grab handle on mobile */}
            <div className="lg:hidden w-12 h-1.5 rounded-full bg-slate-200 mx-auto mb-8" />

            <h2 className="text-2xl font-extrabold text-slate-800">Welcome Back</h2>
            <p className="text-slate-500 text-sm mt-1 mb-7">
              Sign in to manage your agricultural trade platform
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Username</label>
                <div className="relative mt-1.5">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm outline-none transition focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    placeholder="Enter username"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Password</label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm outline-none transition focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    placeholder="Enter password"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-bold text-sm transition active:scale-[0.98] disabled:opacity-60 shadow-[0_10px_24px_-8px_rgba(0,141,91,0.7)]"
                style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DARK})` }}>
                {loading
                  ? <><Loader2 className="animate-spin" size={16} /> Signing in…</>
                  : <>Sign In <ChevronRight size={16} /></>}
              </button>
            </form>

            <p className="text-center text-[11px] text-slate-400 mt-8">
              © {new Date().getFullYear()} Exponab General Trading L.L.C.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex gap-3 p-4 rounded-2xl border border-white/10 backdrop-blur transition hover:bg-white/10"
      style={{ background: 'rgba(255,255,255,0.06)' }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-emerald-200 shrink-0"
        style={{ background: 'rgba(255,255,255,0.1)' }}>{icon}</div>
      <div>
        <p className="text-white text-sm font-bold">{title}</p>
        <p className="text-emerald-100/60 text-xs mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Scale,
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ChevronRight,
  Loader2,
  Leaf,
  Truck,
  Globe
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
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
      navigate('/');
    } else {
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-green-950 via-emerald-900 to-green-800">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden px-12">

        {/* decorative circles */}
        <div className="absolute -top-40 -right-40 w-[400px] h-[400px] rounded-full bg-green-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[300px] h-[300px] rounded-full bg-yellow-500/10 blur-3xl" />

        <div className="relative z-10 text-center max-w-md">

          {/* Logo */}
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-green-500/20 border border-green-300/20 flex items-center justify-center">
            <Leaf size={42} className="text-green-300" />
          </div>

          <h1 className="text-white text-4xl font-bold mb-2 tracking-wide">
            Exponab
          </h1>

          <p className="text-green-200 text-sm uppercase tracking-[4px] mb-10">
            Agriculture • Export • Import
          </p>

          {/* Features */}
          <div className="space-y-4 text-left">

            <div className="flex gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
              <Truck className="text-green-300" />
              <div>
                <p className="text-white text-sm font-semibold">Global Agro Trade</p>
                <p className="text-slate-300 text-xs">Manage export & import shipments efficiently</p>
              </div>
            </div>

            <div className="flex gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
              <Leaf className="text-green-300" />
              <div>
                <p className="text-white text-sm font-semibold">Farm Produce Tracking</p>
                <p className="text-slate-300 text-xs">Track agricultural goods from farm to port</p>
              </div>
            </div>

            <div className="flex gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
              <Globe className="text-green-300" />
              <div>
                <p className="text-white text-sm font-semibold">International Markets</p>
                <p className="text-slate-300 text-xs">Connect with global buyers & suppliers</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex flex-col w-full lg:w-[480px] bg-white lg:rounded-none rounded-t-3xl">

        {/* Mobile header */}
        <div className="lg:hidden flex flex-col items-center justify-center pt-16 pb-8 bg-gradient-to-r from-green-900 to-emerald-800">
          <Leaf className="text-green-300 mb-3" size={40} />
          <h1 className="text-white text-xl font-bold">
            Exponab Agriculture Trade
          </h1>
        </div>

        {/* Form */}
        <div className="flex-1 flex flex-col justify-center px-6 lg:px-10 py-10">

          <h2 className="text-2xl font-bold text-slate-800 mb-1">
            Welcome Back
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            Sign in to manage your agricultural trade platform
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Username */}
            <div>
              <label className="text-xs text-slate-500 font-medium">Username</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Enter username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-slate-500 font-medium">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium transition"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <ChevronRight size={16} />
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
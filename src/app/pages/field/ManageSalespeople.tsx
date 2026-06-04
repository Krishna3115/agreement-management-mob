import React, { useEffect, useState } from "react";
import { salespersonApi } from "../../../services/fieldservice";
import { UserPlus, Plus, Loader2 } from "lucide-react";

const PRIMARY = "#008d5b";

export default function ManageSalespeople() {
  const [list, setList] = useState<string[]>([]);
  const [form, setForm] = useState({ username:"", password:"" });
  const [saving, setSaving] = useState(false);

  const load = () => salespersonApi.list().then(setList).catch(()=>{});
  useEffect(()=>{ load(); }, []);

  const save = async () => {
    if (!form.username.trim() || !form.password.trim()) { alert("Username + password required"); return; }
    setSaving(true);
    try {
      await salespersonApi.create(form.username, form.password);
      setForm({ username:"", password:"" });
      load();
      alert("Salesperson account created");
    } catch(e:any){ alert(e?.response?.data?.message || "Failed"); }
    finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="px-5 pt-6 pb-8 text-white rounded-b-[28px]" style={{background:PRIMARY}}>
        <h1 className="text-2xl font-bold">Salespeople</h1>
        <p className="text-white/80 text-sm mt-1">Create field-sales logins</p>
      </div>
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
          <h2 className="font-bold flex items-center gap-2"><UserPlus size={18} color={PRIMARY}/> New Salesperson</h2>
          <input className="w-full border rounded-2xl p-3 text-sm" placeholder="Username"
            value={form.username} onChange={e=>setForm({...form,username:e.target.value})}/>
          <input className="w-full border rounded-2xl p-3 text-sm" placeholder="Password" type="text"
            value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
          <button onClick={save} disabled={saving}
            className="w-full py-3 rounded-2xl text-white font-semibold flex justify-center gap-2" style={{background:PRIMARY}}>
            {saving ? <Loader2 className="animate-spin" size={16}/> : <Plus size={16}/>} Create Account
          </button>
        </div>
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <h2 className="font-bold mb-3">Active Salespeople ({list.length})</h2>
          {list.map(u=>(
            <div key={u} className="p-3 rounded-2xl bg-slate-50 text-sm font-semibold mb-2">{u}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

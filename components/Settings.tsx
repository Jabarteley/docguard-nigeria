
import React from 'react';
import { Shield, User, Bell, Database, Key, Globe, Leaf, Check } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-extrabold text-emerald-950 tracking-tight">System Settings</h1>
        <p className="text-emerald-600/80 mt-1 font-medium italic">Configure your DocGuard environment and compliance preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="space-y-2">
          {[
            { label: 'General', icon: Globe, active: true },
            { label: 'Account', icon: User },
            { label: 'Security', icon: Shield },
            { label: 'Notifications', icon: Bell },
            { label: 'Database', icon: Database },
            { label: 'API Keys', icon: Key },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                item.active 
                ? 'bg-[#008751] text-white shadow-lg shadow-emerald-900/10' 
                : 'text-emerald-900/40 hover:bg-emerald-50 hover:text-[#008751]'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </aside>

        <div className="md:col-span-3 space-y-8">
          <section className="bg-white p-8 rounded-[32px] border border-emerald-100 shadow-sm space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 text-[#008751] rounded-2xl flex items-center justify-center">
                <Globe size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-emerald-950 tracking-tight">Regional Preferences</h3>
                <p className="text-xs text-emerald-600/50 font-medium">Compliance jurisdiction and tax settings.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-emerald-950 uppercase tracking-widest ml-1">Default Jurisdiction</label>
                <select className="w-full p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-sm font-bold text-emerald-900 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all">
                  <option>Nigeria (LMA Standards)</option>
                  <option>Ghana (LMA Africa)</option>
                  <option>Kenya (LMA East Africa)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-emerald-950 uppercase tracking-widest ml-1">Tax Engine Year</label>
                <input type="number" defaultValue={2024} className="w-full p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-sm font-bold text-emerald-900 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all" />
              </div>
            </div>

            <div className="pt-6 border-t border-emerald-50">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-emerald-950">Auto-Perfection (CAC)</h4>
                  <p className="text-xs text-emerald-600/60 font-medium">Enable RPA robot to automatically initiate filing upon execution.</p>
                </div>
                <div className="w-12 h-6 bg-[#008751] rounded-full relative p-1 cursor-pointer">
                  <div className="absolute right-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#0a2e1f] p-8 rounded-[32px] text-white overflow-hidden relative group">
            <Leaf size={180} className="absolute -bottom-10 -right-10 text-emerald-900/40 group-hover:scale-110 transition-transform pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-950/40">
                  <Check size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight">Subscription Plan</h3>
                  <p className="text-xs text-emerald-400 font-medium">DocGuard Enterprise Tier</p>
                </div>
              </div>
              <p className="text-sm text-emerald-100/70 font-medium leading-relaxed max-w-md">
                Your institution is currently on the Enterprise Tier. You have unlimited LMA document generation and 100 free CAC RPA filings per month.
              </p>
              <button className="px-6 py-3 bg-white text-emerald-950 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-xl active:scale-95">
                Upgrade Plan
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;

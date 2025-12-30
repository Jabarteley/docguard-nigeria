
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
// Added BarChart3 to the imports from lucide-react to resolve the 'Cannot find name' error
import { Download, Filter, Calendar, BarChart3, TrendingUp } from 'lucide-react';

const Analytics: React.FC = () => {
  const turnaroundData = [
    { name: 'Jan', manual: 42, docGuard: 6 },
    { name: 'Feb', manual: 45, docGuard: 5 },
    { name: 'Mar', manual: 38, docGuard: 4 },
    { name: 'Apr', manual: 40, docGuard: 5 },
    { name: 'May', manual: 44, docGuard: 5 },
  ];

  const registrationData = [
    { name: 'Successful', value: 92, color: '#008751' },
    { name: 'Errors Detected', value: 5, color: '#f59e0b' },
    { name: 'Rejected', value: 3, color: '#f43f5e' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-emerald-100 text-[#008751] rounded-lg">
              <TrendingUp size={20} />
            </div>
            <h1 className="text-3xl font-extrabold text-emerald-950 tracking-tight">Efficacy Analytics</h1>
          </div>
          <p className="text-emerald-600/70 font-medium">Tracking the 85% optimization of the Nigerian credit documentation cycle.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-emerald-100 rounded-xl text-xs font-black uppercase tracking-widest text-emerald-900 hover:bg-emerald-50 transition-all shadow-sm">
            <Filter size={18} className="text-emerald-500" /> Filter View
          </button>
          <button className="flex items-center gap-2 px-8 py-3 bg-[#0a2e1f] text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-emerald-900 shadow-xl shadow-emerald-950/20 transition-all active:scale-95">
            <Download size={18} /> Export Intelligence
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-emerald-100 shadow-xl shadow-emerald-900/5">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="font-extrabold text-lg text-emerald-950 tracking-tight">Turnaround Cycle Time</h3>
              <p className="text-xs text-emerald-600/50 font-bold uppercase tracking-widest mt-1">Average Days to Completion</p>
            </div>
            <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest">
              <span className="flex items-center gap-2 text-slate-300">
                <div className="w-2.5 h-2.5 rounded bg-slate-100 shadow-inner"></div> Manual Path
              </span>
              <span className="flex items-center gap-2 text-[#008751]">
                <div className="w-2.5 h-2.5 rounded bg-[#008751] shadow-lg shadow-emerald-900/20"></div> DocGuard
              </span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={turnaroundData}>
                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#64748b', fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#64748b', fontWeight: 'bold'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '12px' }}
                  cursor={{ fill: 'transparent' }}
                />
                <Bar dataKey="manual" fill="#f8fafc" radius={[6, 6, 0, 0]} barSize={24} />
                <Bar dataKey="docGuard" fill="#008751" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-emerald-100 shadow-xl shadow-emerald-900/5">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="font-extrabold text-lg text-emerald-950 tracking-tight">Filing Precision Health</h3>
              <p className="text-xs text-emerald-600/50 font-bold uppercase tracking-widest mt-1">Automated CAC Form Validation Rate</p>
            </div>
          </div>
          <div className="h-80 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={registrationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {registrationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black text-emerald-950 tracking-tighter">92%</span>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Accuracy</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {registrationData.map((item) => (
              <div key={item.name} className="flex flex-col items-center p-3 rounded-xl bg-emerald-50/30 border border-emerald-50">
                <div className="w-2.5 h-2.5 rounded-full mb-2" style={{ backgroundColor: item.color }}></div>
                <p className="text-sm font-black text-emerald-950">{item.value}%</p>
                <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest mt-0.5 text-center">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#0a2e1f] to-[#008751] rounded-3xl p-12 text-white relative overflow-hidden shadow-2xl shadow-emerald-900/40">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-10 pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-8 tracking-tight">Macro Commercial Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { val: '₦1.2B', label: 'Lender Risk Mitigated' },
              { val: '83%', label: 'Cycle Cost Reduction' },
              { val: '2.4k', label: 'Human Hours Saved' },
              { val: '0.00', label: 'Filing Penalties' }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col">
                <p className="text-5xl font-black tracking-tighter mb-2">{stat.val}</p>
                <p className="text-[10px] text-emerald-300 font-black uppercase tracking-[0.2em]">{stat.label}</p>
                <div className="w-8 h-1 bg-emerald-400 mt-4 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
        <BarChart3 className="absolute -bottom-16 -right-16 text-emerald-950 opacity-20 transform -rotate-12" size={340} />
      </div>
    </div>
  );
};

export default Analytics;

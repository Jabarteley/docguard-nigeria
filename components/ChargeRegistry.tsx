
import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Cpu,
  Globe,
  ShieldCheck,
  ExternalLink,
  Loader2,
  Lock,
  Camera,
  Activity,
  Search,
  CheckCircle2,
  Clock,
  FileText
} from 'lucide-react';
import { RPAActivity } from '../types';

interface Filing {
  id: string;
  entity: string;
  rcNumber: string;
  type: string;
  submissionDate: string;
  status: 'Pending' | 'Submitted' | 'Perfected';
}

const MOCK_FILINGS: Filing[] = [
  { id: 'CAC-2024-001', entity: 'Dangote Refinery Ltd', rcNumber: 'RC-112938', type: 'Form 8 (Particulars of Charge)', submissionDate: '2024-10-15', status: 'Perfected' },
  { id: 'CAC-2024-002', entity: 'Zenith Bank Plc', rcNumber: 'RC-99221', type: 'Form 3 (Return of Allotment)', submissionDate: '2024-11-02', status: 'Submitted' },
  { id: 'CAC-2024-003', entity: 'Globacom Limited', rcNumber: 'RC-55210', type: 'Form 8 (Particulars of Charge)', submissionDate: '2024-11-20', status: 'Pending' },
];

const ChargeRegistry: React.FC = () => {
  const [isBotActive, setIsBotActive] = useState(false);
  const [logs, setLogs] = useState<RPAActivity[]>([]);
  const [progress, setProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const logEndRef = useRef<HTMLDivElement>(null);

  const filteredFilings = MOCK_FILINGS.filter(f =>
    f.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.rcNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addLog = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36),
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    }]);
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    // Listen for RPA updates from Electron Main Process
    if (window.electron) {
      const handleUpdate = (_event: any, data: any) => {
        addLog(data.message, data.type);
        setProgress(data.progress);
        if (data.progress === 100) {
          setIsBotActive(false);
          // Native Notification
          window.electron.showNotification('RPA Completed', 'CAC Filing successfully perfected for Dangote Refinery Ltd.');
        }
      };
      window.electron.onRPAUpdate(handleUpdate);
      return () => {
        window.electron.offRPAUpdate(handleUpdate);
      };
    }
  }, []);

  const startAutomatedFiling = async () => {
    setIsBotActive(true);
    setLogs([]);
    setProgress(0);

    if (window.electron) {
      // Native Electron Mode
      await window.electron.startRPA({
        ref: 'CAC-CHG-2024-9912',
        entity: 'Dangote Refinery Ltd'
      });
    } else {
      // Web Fallback Mode (Demo)
      const steps = [
        { msg: "Initializing Web Demo Mode...", type: 'info', p: 5 },
        { msg: "Connecting to CAC Portal Simulation...", type: 'info', p: 30 },
        { msg: "Uploading Particulars of Charge...", type: 'success', p: 60 },
        { msg: "PERFECTION SUCCESS (Web Simulation)...", type: 'success', p: 100 },
      ];
      let currentStep = 0;
      const interval = setInterval(() => {
        if (currentStep < steps.length) {
          addLog(steps[currentStep].msg, steps[currentStep].type as any);
          setProgress(steps[currentStep].p);
          currentStep++;
        } else {
          clearInterval(interval);
          setIsBotActive(false);
        }
      }, 1500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-emerald-100 text-[#008751] rounded-lg">
              <Cpu size={20} />
            </div>
            <h1 className="text-3xl font-extrabold text-emerald-950 tracking-tight">CAC Portal RPA</h1>
          </div>
          <p className="text-emerald-600/70 font-medium">Native Robot performing official charge registration & perfection.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-900 border border-emerald-100 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-100 transition-all">
            <Lock size={16} /> Secure Portal
          </button>
          {!isBotActive ? (
            <button
              onClick={startAutomatedFiling}
              className="flex items-center gap-2 px-8 py-3 bg-[#008751] text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-emerald-700 shadow-xl shadow-emerald-900/20 transition-all active:scale-95"
            >
              <Activity size={18} className="animate-pulse" />
              Ignite RPA Bot
            </button>
          ) : (
            <button className="flex items-center gap-2 px-8 py-3 bg-slate-200 text-slate-500 rounded-xl text-xs font-black uppercase tracking-[0.2em] cursor-not-allowed">
              <Loader2 size={18} className="animate-spin" />
              Bot Operating
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Terminal/Log View */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#051a12] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,135,81,0.15)] border border-emerald-900/40 relative">
            <div className="bg-[#0a2e1f] px-6 py-4 flex items-center justify-between border-b border-emerald-900/50">
              <div className="flex items-center gap-3">
                <Terminal size={16} className="text-emerald-400" />
                <span className="text-[10px] font-black text-emerald-500/80 uppercase tracking-[0.3em]">GuardBot Engine v3.2.0-NATIVE</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-emerald-900/50"></div>)}
              </div>
            </div>

            <div className="h-[500px] overflow-y-auto p-8 font-mono text-sm space-y-3 custom-scrollbar-dark selection:bg-emerald-500/30">
              {logs.length === 0 && !isBotActive && (
                <div className="h-full flex flex-col items-center justify-center text-emerald-900/30">
                  <Cpu size={64} className="mb-6 opacity-20" />
                  <p className="font-bold tracking-widest uppercase text-xs">Awaiting Command Link...</p>
                </div>
              )}
              {logs.map((log) => (
                <div key={log.id} className="animate-in fade-in slide-in-from-left-2 duration-300 flex gap-4">
                  <span className="text-emerald-700/50 shrink-0">[{log.timestamp}]</span>{' '}
                  <span className={`font-black uppercase tracking-tighter shrink-0 ${log.type === 'success' ? 'text-emerald-400' :
                    log.type === 'error' ? 'text-rose-400' :
                      'text-emerald-500/60'
                    }`}>
                    {log.type}:
                  </span>{' '}
                  <span className="text-emerald-100 font-medium">{log.message}</span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>

            {isBotActive && (
              <div className="px-8 py-5 bg-[#0a2e1f] border-t border-emerald-900/50">
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Portal Submission Flow</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">{progress}% COMPLETE</span>
                </div>
                <div className="w-full bg-emerald-950 h-2 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-8 rounded-2xl border border-emerald-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#008751] flex items-center justify-center shadow-inner">
                <ShieldCheck size={32} />
              </div>
              <div>
                <p className="font-black text-emerald-950 text-lg tracking-tight">Perfection Shield ACTIVE</p>
                <p className="text-sm text-emerald-600/60 font-medium">Automatic 90-day CAMA deadline tracking & early filing warnings.</p>
              </div>
            </div>
            <button className="text-[10px] font-black text-[#008751] uppercase tracking-[0.2em] hover:underline px-4 py-2 bg-emerald-50 rounded-lg">View Policy</button>
          </div>
        </div>

        {/* Sidebar: Config */}
        <div className="space-y-8">
          <div className="bg-white border border-emerald-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 bg-emerald-50/50 border-b border-emerald-100 font-black text-[10px] uppercase tracking-[0.2em] text-emerald-900/40">
              Active Filing Payload
            </div>
            <div className="p-6 space-y-6">
              {[
                { label: 'Target Entity', val: 'Dangote Refinery Ltd' },
                { label: 'Security Value', val: '$50,000,000.00' },
                { label: 'Form Type', val: 'CAC Form 8 (Particulars)' }
              ].map(item => (
                <div key={item.label}>
                  <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1 block">{item.label}</label>
                  <p className="text-sm font-bold text-emerald-950">{item.val}</p>
                </div>
              ))}
              <div className="pt-4 border-t border-emerald-50 flex flex-col gap-3">
                <button
                  onClick={() => window.electron?.openExternal('https://search.cac.gov.ng')}
                  className="flex items-center justify-between w-full text-[10px] font-black text-[#008751] uppercase tracking-widest hover:text-emerald-800 transition-colors bg-emerald-50 px-3 py-2 rounded-lg"
                >
                  <span>Stamped Deed</span>
                  <ExternalLink size={14} />
                </button>
                <button
                  onClick={() => window.electron?.openExternal('https://dashboard.guaranty.ng')}
                  className="flex items-center justify-between w-full text-[10px] font-black text-[#008751] uppercase tracking-widest hover:text-emerald-800 transition-colors bg-emerald-50 px-3 py-2 rounded-lg"
                >
                  <span>Board Resolution</span>
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-emerald-950 rounded-2xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(0,135,81,0.2),transparent)]"></div>
            <h4 className="font-black text-emerald-400 text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-2 relative z-10">
              <Camera size={16} />
              Screenshot Hub
            </h4>
            <p className="text-xs text-emerald-100/60 mb-6 leading-relaxed relative z-10 font-medium">
              Real-time audit captures of every interaction with the CAC portal for compliance verification.
            </p>
            <div className="bg-white/5 h-40 rounded-xl border border-white/10 flex items-center justify-center text-emerald-800 relative z-10 group-hover:border-[#008751]/30 transition-all">
              <Globe size={48} className="opacity-20 animate-pulse" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-emerald-100">
            <h4 className="text-emerald-950 font-black text-xs uppercase tracking-widest mb-6">Network Health</h4>
            <div className="space-y-4">
              {[
                { label: 'CAC Portal', val: '240ms', color: 'emerald' },
                { label: 'NCR API', val: 'Operational', color: 'emerald' },
                { label: 'Daily Cap', val: '12 / 100', color: 'slate' }
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-emerald-900/40 uppercase tracking-widest">{item.label}</span>
                  <span className={`text-[11px] font-black text-${item.color}-600 uppercase`}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white border border-emerald-100 rounded-2xl shadow-sm overflow-hidden animate-in slide-in-from-bottom-8 mt-8">
        <div className="p-5 bg-emerald-50/50 border-b border-emerald-100 flex items-center justify-between">
          <div className="font-black text-[10px] uppercase tracking-[0.2em] text-emerald-900/40 flex items-center gap-2">
            <FileText size={14} />
            Filing History
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
            <input
              type="text"
              placeholder="Filter by Entity or RC..."
              className="pl-9 pr-4 py-2 bg-white border border-emerald-100 rounded-lg text-xs font-bold text-emerald-950 focus:ring-2 focus:ring-[#008751] outline-none w-64 uppercase placeholder:normal-case"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-emerald-50 bg-emerald-50/20">
                <th className="px-6 py-4 font-black text-[10px] uppercase tracking-widest text-emerald-900/40">Reference ID</th>
                <th className="px-6 py-4 font-black text-[10px] uppercase tracking-widest text-emerald-900/40">Entity</th>
                <th className="px-6 py-4 font-black text-[10px] uppercase tracking-widest text-emerald-900/40">Filing Type</th>
                <th className="px-6 py-4 font-black text-[10px] uppercase tracking-widest text-emerald-900/40">Date</th>
                <th className="px-6 py-4 font-black text-[10px] uppercase tracking-widest text-emerald-900/40 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
              {filteredFilings.map(filing => (
                <tr key={filing.id} className="hover:bg-emerald-50/30 transition-colors group">
                  <td className="px-6 py-4 font-mono text-emerald-600 text-xs">{filing.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-emerald-950">{filing.entity}</div>
                    <div className="text-[10px] text-emerald-500 font-mono">{filing.rcNumber}</div>
                  </td>
                  <td className="px-6 py-4 text-emerald-700 font-medium">{filing.type}</td>
                  <td className="px-6 py-4 text-emerald-600/60 font-medium">{filing.submissionDate}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${filing.status === 'Perfected' ? 'bg-[#008751]/10 text-[#008751]' :
                      filing.status === 'Submitted' ? 'bg-amber-50 text-amber-600' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                      {filing.status === 'Perfected' && <CheckCircle2 size={12} />}
                      {filing.status === 'Submitted' && <Loader2 size={12} className="animate-spin" />}
                      {filing.status === 'Pending' && <Clock size={12} />}
                      {filing.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ChargeRegistry;

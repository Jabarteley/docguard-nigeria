
import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  ChevronRight,
  FileSearch,
  Zap,
  RefreshCcw,
  Loader2
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { LoanStatus, Loan } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { analyzePortfolioRisks } from '../services/geminiService';

// Mock Data for Charts
const volumeData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

const portfolioData = [
  { name: 'Secured Term', value: 400 },
  { name: 'Unsecured', value: 300 },
  { name: 'Syndicated', value: 300 },
  { name: 'Trade Finance', value: 200 },
];

const COLORS = ['#008751', '#059669', '#10b981', '#34d399'];

const Dashboard: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // AI State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [riskAnalysis, setRiskAnalysis] = useState<{ summary: string; severity: 'LOW' | 'MEDIUM' | 'HIGH' } | null>(null);

  const [stats, setStats] = useState([
    { label: 'Active Loan Pipelines', value: '0', change: '+0%', icon: TrendingUp, color: '#008751' },
    { label: 'Pending Registrations', value: '0', change: '0 Critical', icon: Clock, color: '#f59e0b' },
    { label: 'Completed Perfections', value: '0', change: '+0%', icon: CheckCircle2, color: '#10b981' },
    { label: 'Risk Flags', value: '0', change: '0%', icon: AlertCircle, color: '#e11d48' },
  ]);

  const fetchRiskAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const risks = [
        { days: 5, entity: 'Ibeto Cement', task: 'CAC Charge Registration', val: 94 },
        { days: 15, entity: 'Innoson Motors', task: 'STMA Filing (NCR)', val: 75 },
        { days: 42, entity: 'MainOne Facility', task: 'Shared Security Deed', val: 45 }
      ];
      const result = await analyzePortfolioRisks(risks);
      setRiskAnalysis(result);
    } catch (err) {
      console.error("AI Analysis failed", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fetchStats = async () => {
    if (!isSupabaseConfigured) return;

    try {
      // Real DB aggregation
      const { count: activeCount } = await supabase.from('loans').select('*', { count: 'exact', head: true });
      const { count: pendingCount } = await supabase.from('loans').select('*', { count: 'exact', head: true }).neq('status', 'Completed');
      const { count: completedCount } = await supabase.from('loans').select('*', { count: 'exact', head: true }).eq('status', 'Completed');

      setStats([
        { label: 'Active Loan Pipelines', value: (activeCount || 0).toString(), change: '+12%', icon: TrendingUp, color: '#008751' },
        { label: 'Pending Registrations', value: (pendingCount || 0).toString(), change: '8 Critical', icon: Clock, color: '#f59e0b' },
        { label: 'Completed Perfections', value: (completedCount || 124).toString(), change: '+24%', icon: CheckCircle2, color: '#10b981' },
        { label: 'Risk Flags', value: '3', change: '-20%', icon: AlertCircle, color: '#e11d48' },
      ]);
    } catch (e) {
      console.error("Stats fetch failed", e);
    }
  };

  const fetchLoans = async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('loans')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;

        if (data && data.length > 0) {
          setLoans(data.map((l: any) => ({
            id: l.id,
            borrowerName: l.borrower_name,
            amount: l.amount,
            currency: l.currency,
            status: l.status as LoanStatus,
            cacRegistrationStatus: l.cac_registration_status as any,
            deadline: l.deadline,
            type: l.type as any
          })));
        } else {
          setLoans(getFallbackData());
        }
      } else {
        setLoans(getFallbackData());
      }
      await fetchStats();
    } catch (err) {
      console.error("Fetch loans failed:", err);
      setLoans(getFallbackData());
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackData = (): Loan[] => [
    { id: 'LD-2024-001', borrowerName: 'Dangote Refinery Ltd', amount: 50000000, currency: 'USD', status: LoanStatus.PERFECTION, cacRegistrationStatus: 'In Progress', deadline: '2024-05-15', type: 'Secured' },
    { id: 'LD-2024-002', borrowerName: 'MTN Nigeria Communications', amount: 2500000000, currency: 'NGN', status: LoanStatus.NEGOTIATION, cacRegistrationStatus: 'Pending', deadline: '2024-06-20', type: 'Secured' },
    { id: 'LD-2024-003', borrowerName: 'Flutterwave Inc', amount: 15000000, currency: 'USD', status: LoanStatus.DRAFT, cacRegistrationStatus: 'Pending', deadline: '2024-07-01', type: 'Unsecured' },
    { id: 'LD-2024-004', borrowerName: 'Access Holdings Plc', amount: 100000000, currency: 'NGN', status: LoanStatus.COMPLETED, cacRegistrationStatus: 'Completed', deadline: '2024-04-10', type: 'Secured' },
  ];

  useEffect(() => {
    fetchLoans();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-emerald-950 tracking-tight">Portfolio Overview</h1>
          <p className="text-emerald-600/80 mt-1 font-medium italic">Empowering secure credit expansion across the Federation.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchLoans}
            disabled={isLoading}
            className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-all disabled:opacity-50"
          >
            <RefreshCcw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <div className="px-4 py-2 bg-emerald-100/50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 flex items-center gap-2">
            <Zap size={14} className="text-emerald-600" />
            {isSupabaseConfigured ? 'DOCGUARD CLOUD ACTIVE' : 'DEMO MODE'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="group bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-emerald-50 group-hover:bg-[#008751]/10 transition-colors" style={{ color: stat.color }}>
                <stat.icon size={26} />
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 uppercase tracking-wider">
                {stat.change}
              </span>
            </div>
            <h3 className="text-emerald-900/50 text-xs font-bold uppercase tracking-widest">{stat.label}</h3>
            <p className="text-3xl font-black text-emerald-950 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-emerald-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-extrabold text-emerald-950 text-lg">Loan Origination Volume</h3>
              <p className="text-xs text-emerald-600/60 font-bold uppercase tracking-widest">6-Month Trend (₦ Billion)</p>
            </div>
            <button className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors">
              <ArrowUpRight size={18} />
            </button>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#008751" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#008751" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ecfdf5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#065f46' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#065f46' }} dx={-10} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  labelStyle={{ color: '#064e3b', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="value" stroke="#008751" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-emerald-100 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="font-extrabold text-emerald-950 text-lg">Portfolio Composition</h3>
            <p className="text-xs text-emerald-600/60 font-bold uppercase tracking-widest">By Facility Type</p>
          </div>
          <div className="flex-1 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="absolute bottom-0 right-0 p-4 space-y-2">
              {portfolioData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wide">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-emerald-50 flex items-center justify-between bg-emerald-50/20">
            <div>
              <h2 className="font-extrabold text-xl text-emerald-950">Active Documentation</h2>
              <p className="text-xs text-emerald-600/60 mt-1 font-medium uppercase tracking-widest">Syndicated & Single Credit Facilities</p>
            </div>
            <button className="text-[#008751] text-xs font-black uppercase tracking-widest hover:text-emerald-800 flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-emerald-50 transition-all">
              Full Pipeline <ChevronRight size={16} />
            </button>
          </div>
          <div className="overflow-x-auto flex-1 relative min-h-[200px]">
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10">
                <Loader2 size={32} className="text-emerald-600 animate-spin" />
              </div>
            )}
            <table className="w-full text-left">
              <thead className="bg-emerald-50/40 text-emerald-900/40 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-5">Entity / Ref ID</th>
                  <th className="px-8 py-5">Amount (Nominal)</th>
                  <th className="px-8 py-5">Stage</th>
                  <th className="px-8 py-5">CAC Perfection</th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50/60">
                {loans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-emerald-50/30 transition-colors cursor-pointer group">
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-emerald-950 group-hover:text-[#008751] transition-colors">{loan.borrowerName}</p>
                      <p className="text-[10px] font-mono text-emerald-500 mt-1">{loan.id}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm text-emerald-900 font-extrabold tracking-tight">
                        <span className="text-xs font-normal text-emerald-500 mr-1">{loan.currency}</span>
                        {loan.amount.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-emerald-600/50 uppercase font-bold mt-1 tracking-tighter">{loan.type} Facility</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${loan.status === LoanStatus.COMPLETED ? 'bg-emerald-100 text-emerald-700' :
                          loan.status === LoanStatus.PERFECTION ? 'bg-[#008751]/10 text-[#008751]' :
                            'bg-slate-100 text-slate-600'
                        }`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2.5 h-2.5 rounded-full ring-2 ring-white ${loan.cacRegistrationStatus === 'Completed' ? 'bg-emerald-500' :
                            loan.cacRegistrationStatus === 'In Progress' ? 'bg-blue-500' :
                              'bg-slate-300'
                          }`}></div>
                        <span className="text-[11px] font-bold text-emerald-900/60">{loan.cacRegistrationStatus}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="w-8 h-8 rounded-lg border border-emerald-100 flex items-center justify-center text-emerald-200 group-hover:text-[#008751] group-hover:border-[#008751]/20 transition-all">
                        <ArrowUpRight size={18} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[#0a2e1f] text-white rounded-2xl p-8 shadow-xl shadow-emerald-950/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <FileSearch size={120} />
          </div>
          <h2 className="font-extrabold text-xl mb-8 flex items-center gap-3">
            Deadline Guardian
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          </h2>

          <div className="space-y-8 relative z-10">
            {/* AI Risk Header */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 mb-6 transition-all duration-500">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={14} className="text-yellow-400" />
                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-100">AI Risk Assessment</span>
              </div>
              <p className="text-xs text-white/90 leading-relaxed font-medium">
                {riskAnalysis ? riskAnalysis.summary : "System calibrating. Click audit to run analysis..."}
              </p>
              {riskAnalysis && (
                <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${riskAnalysis.severity === 'HIGH' ? 'bg-rose-500/20 text-rose-200 ring-1 ring-rose-500/50' : 'bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-500/50'
                  }`}>
                  {riskAnalysis.severity} Severity
                </div>
              )}
            </div>

            {[
              { days: 5, entity: 'Ibeto Cement', task: 'CAC Charge Registration', color: 'rose', val: 94 },
              { days: 15, entity: 'Innoson Motors', task: 'STMA Filing (NCR)', color: 'amber', val: 75 },
              { days: 42, entity: 'MainOne Facility', task: 'Shared Security Deed', color: 'emerald', val: 45 },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center font-black text-sm shrink-0 shadow-lg`}>
                  <span className={`text-${item.color}-400`}>{item.days < 10 ? `0${item.days}` : item.days}</span>
                  <span className="text-[8px] uppercase text-white/40 tracking-[0.2em]">Days</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white tracking-tight">{item.entity}</p>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-0.5">{item.task}</p>
                  <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full bg-${item.color}-500 transition-all duration-1000`}
                      style={{ width: `${item.val}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={fetchRiskAnalysis}
            disabled={isAnalyzing}
            className="w-full mt-10 py-4 bg-[#008751] text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-emerald-950/40 hover:bg-emerald-500 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={16} /> Running Compliance Model...
              </span>
            ) : "Audit All Deadlines"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

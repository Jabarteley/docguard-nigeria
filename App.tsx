
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  ShieldCheck, 
  UserCheck, 
  BarChart3, 
  Settings as SettingsIcon,
  Bell,
  Search,
  User as UserIcon,
  Leaf,
  LogOut,
  Loader2
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import DocBuilder from './components/DocBuilder';
import ChargeRegistry from './components/ChargeRegistry';
import KYCOrchestrator from './components/KYCOrchestrator';
import Analytics from './components/Analytics';
import Login from './components/Login';
import Settings from './components/Settings';
import { supabase, isSupabaseConfigured } from './lib/supabase';

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#0a2e1f]">
        <div className="text-center">
          <Loader2 className="animate-spin text-emerald-500 mx-auto mb-4" size={48} />
          <p className="text-emerald-100 font-black tracking-widest uppercase text-xs">Initializing DocGuard...</p>
        </div>
      </div>
    );
  }

  // If not logged in and not on login page, redirect to login
  if (!session && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  // If logged in and on login page, redirect to dashboard
  if (session && location.pathname === '/login') {
    return <Navigate to="/" replace />;
  }

  // Simple layout for login page
  if (location.pathname === '/login') {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    );
  }

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'LMA Doc Builder', path: '/docs', icon: FileText },
    { name: 'CAC Registry', path: '/registry', icon: ShieldCheck },
    { name: 'KYC Orchestrator', path: '/kyc', icon: UserCheck },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  const userEmail = session?.user?.email || 'Admin User';
  const userInitial = userEmail.charAt(0).toUpperCase();

  return (
    <div className="flex h-screen bg-[#fcfdfc] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-68 bg-[#0a2e1f] text-white flex flex-col shadow-2xl border-r border-emerald-900/20">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#008751] rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-950/40 transform hover:rotate-3 transition-transform">
              <Leaf size={24} className="text-white fill-current" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight block leading-none text-white">DocGuard</span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.2em] mt-1">Nigeria</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 mt-2 px-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                  ? 'bg-[#008751] text-white shadow-lg shadow-emerald-950/40 translate-x-1' 
                  : 'text-emerald-100/60 hover:bg-emerald-800/30 hover:text-white'
                }`}
              >
                <Icon size={20} className={`${isActive ? 'text-white' : 'text-emerald-500 group-hover:text-emerald-300'}`} />
                <span className="font-semibold text-sm tracking-wide">{item.name}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]"></div>}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-emerald-800/30 space-y-2">
          <Link
            to="/settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              location.pathname === '/settings' ? 'bg-emerald-800/50 text-white' : 'text-emerald-100/60 hover:text-white hover:bg-emerald-800/20'
            }`}
          >
            <SettingsIcon size={20} className="text-emerald-500" />
            <span className="font-medium text-sm">Settings</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-emerald-100/60 hover:text-rose-400 hover:bg-rose-950/20 rounded-xl w-full transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[120px] -z-10 opacity-30 pointer-events-none"></div>
        
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-emerald-100 flex items-center justify-between px-10 z-20 sticky top-0">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600/50" size={18} />
            <input 
              type="text" 
              placeholder="Search loans, borrowers, or filings..." 
              className="w-full pl-12 pr-6 py-2.5 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl text-sm focus:ring-2 focus:ring-[#008751] focus:bg-white outline-none transition-all placeholder:text-emerald-900/30"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 text-emerald-900/60 hover:bg-emerald-50 rounded-xl transition-all hover:scale-105 active:scale-95"
              >
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-emerald-100 p-4 z-50 animate-in fade-in zoom-in duration-200">
                  <div className="flex items-center justify-between mb-4 px-2">
                    <h4 className="font-black text-xs uppercase tracking-widest text-emerald-950">Notifications</h4>
                    <span className="text-[10px] font-bold text-[#008751] bg-emerald-50 px-2 py-1 rounded-md">3 New</span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                    <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 group cursor-pointer hover:bg-emerald-50">
                      <p className="text-xs font-bold text-emerald-900">Charge Registered Successfully</p>
                      <p className="text-[10px] text-emerald-600/70 mt-1">Ref: CAC-CHG-9912 for Dangote Refinery Ltd</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-emerald-50 group cursor-pointer hover:bg-emerald-50">
                      <p className="text-xs font-bold text-emerald-900">Deadline Warning</p>
                      <p className="text-[10px] text-amber-600 mt-1">Ibeto Cement filing due in 5 days!</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-emerald-50 group cursor-pointer hover:bg-emerald-50">
                      <p className="text-xs font-bold text-emerald-900">KYC Flag Detected</p>
                      <p className="text-[10px] text-rose-600 mt-1">Credit utilization alert for MTN Nigeria</p>
                    </div>
                  </div>
                  <button className="w-full mt-4 py-2 text-[10px] font-black text-[#008751] uppercase tracking-widest hover:bg-emerald-50 rounded-xl transition-all">
                    View All Activity
                  </button>
                </div>
              )}
            </div>

            <div className="h-10 w-px bg-emerald-100/80 mx-1"></div>
            <div className="flex items-center gap-4 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-emerald-950 group-hover:text-[#008751] transition-colors">{userEmail.split('@')[0]}</p>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">DocGuard Professional</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-[#008751] flex items-center justify-center text-white font-bold shadow-md transform group-hover:scale-110 transition-transform">
                {userInitial}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/docs" element={<DocBuilder />} />
            <Route path="/registry" element={<ChargeRegistry />} />
            <Route path="/kyc" element={<KYCOrchestrator />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default App;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Lock, Mail, Loader2, ArrowRight, ShieldCheck, Gavel } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Ensure you have been registered on the backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a2e1f] p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-800/20 rounded-full blur-[120px] -z-0"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-950/40 rounded-full blur-[100px] -z-0"></div>

      <div className="w-full max-w-lg relative z-10">
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-emerald-900/10">
          <div className="p-10 md:p-14">
            <div className="flex flex-col items-center mb-10">
              <div className="w-16 h-16 bg-[#008751] rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-900/20 mb-6 transform hover:rotate-6 transition-transform cursor-pointer">
                <Leaf size={32} className="text-white fill-current" />
              </div>
              <h1 className="text-3xl font-black text-emerald-950 tracking-tight">Welcome Back</h1>
              <p className="text-emerald-600/60 font-medium text-center mt-2 max-w-xs">Secure login to Nigeria's leading loan documentation infrastructure.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold animate-in fade-in slide-in-from-top-2">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-emerald-950 uppercase tracking-[0.2em] ml-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600/40" size={20} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-emerald-950 focus:ring-4 focus:ring-[#008751]/10 focus:border-[#008751] outline-none transition-all placeholder:text-emerald-900/20 font-medium"
                    placeholder="name@bank.com.ng"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-2">
                  <label className="text-[10px] font-black text-emerald-950 uppercase tracking-[0.2em]">Password</label>
                  <button type="button" className="text-[10px] font-black text-[#008751] uppercase tracking-widest hover:underline">Forgot?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600/40" size={20} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-emerald-950 focus:ring-4 focus:ring-[#008751]/10 focus:border-[#008751] outline-none transition-all placeholder:text-emerald-900/20 font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full py-5 bg-[#008751] text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/20 hover:bg-emerald-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Access Portal
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="bg-emerald-50/50 p-8 border-t border-emerald-100 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-[#008751]" size={16} />
              <span className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest leading-none mt-0.5">NDPR COMPLIANT</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-200"></div>
            <div className="flex items-center gap-2">
              <Gavel className="text-[#008751]" size={16} />
              <span className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest leading-none mt-0.5">LMA CERTIFIED</span>
            </div>
          </div>
        </div>
        
        <p className="text-center mt-8 text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">
          DocGuard Nigeria v1.0 • Built for Nigerian Banks
        </p>
      </div>
    </div>
  );
};

export default Login;

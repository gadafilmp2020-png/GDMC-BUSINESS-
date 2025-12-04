import React, { useState } from 'react';
import { Fingerprint, Lock, Mail, ArrowRight, User as UserIcon, CheckCircle, Loader2 } from 'lucide-react';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      if (email && password) {
        onLogin();
      }
    } else {
      // Sign Up Flow
      if (email && password && fullName) {
        setStatus('submitting');
        // Simulate network request delay
        setTimeout(() => {
          setStatus('success');
        }, 1500);
      }
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[100px]" />

        <div className="relative z-10 w-full max-w-md p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl text-center">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Registration Pending</h2>
          <div className="space-y-4 text-slate-300 mb-8">
            <p>
              Your account request has been successfully submitted for review.
            </p>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-white/5 text-sm">
              <p className="mb-2 text-slate-400">Confirmation sent to:</p>
              <p className="text-cyan-400 font-medium font-mono">Network Administrator</p>
            </div>
            <p className="text-sm text-slate-400">
              You will receive an activation link once your position in the binary tree is confirmed.
            </p>
          </div>
          <button 
            onClick={() => { setStatus('idle'); setIsLogin(true); }}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-lg transition-all border border-white/10"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[100px]" />

      <div className="relative z-10 w-full max-w-md p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 mb-4 shadow-lg shadow-cyan-500/20">
            <Fingerprint className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Nexus 2025</h1>
          <p className="text-slate-400 mt-2">Binary Network Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-600 transition-all"
                  placeholder="John Doe"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-600 transition-all"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-600 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={status === 'submitting'}
            className="w-full group bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {status === 'submitting' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Submit Application'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setStatus('idle'); }}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            {isLogin ? "Join the Network? Apply Now" : "Already a member? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
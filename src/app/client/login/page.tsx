'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { UserCircle, Key, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ClientLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (email && password) {
      try {
        const res = await fetch('/api/client/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (data.success) {
          localStorage.setItem('isClientLoggedIn', 'true');
          localStorage.setItem('clientEmail', email);
          router.push('/client/dashboard');
        } else {
          setIsLoading(false);
          setError(data.message?.toUpperCase() || 'ACCESS DENIED: INVALID CREDENTIALS');
        }
      } catch (err) {
        console.error("Login Error:", err);
        setIsLoading(false);
        setError('SERVER CONNECTION FAILED');
      }
    } else {
      setIsLoading(false);
      setError('ACCESS DENIED: MISSING INPUT');
    }
  };

  return (
    <main className="min-h-screen bg-primary-deep flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -ml-64 -mt-64" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent-amber/5 rounded-full blur-[120px] -mr-64 -mb-64" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-12 max-w-md w-full relative z-10 p-12 border-l-4 border-accent-amber"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-black text-slate-500 hover:text-white uppercase tracking-widest mb-12 transition-colors">
          <ArrowLeft size={14} /> Back to Gateway
        </Link>

        <div className="mb-12">
          <div className="w-12 h-12 bg-accent-amber rounded-xl flex items-center justify-center font-black text-primary-deep mb-6 shadow-[0_0_20px_rgba(245,158,11,0.3)]">DG</div>
          <h2 className="text-4xl font-black tracking-tighter uppercase mb-2 leading-none">Terminal <br /><span className="text-accent-amber not-italic italic">Access</span></h2>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none border-l-2 border-accent-amber pl-4">Industrial Logistics Interface</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-accent-amber uppercase tracking-widest leading-relaxed">Authorized Intelligence Email</label>
            <div className="relative">
              <UserCircle size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                required 
                type="email" 
                className="input-field pl-12" 
                placeholder="operator@company.com" 
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-accent-amber uppercase tracking-widest leading-relaxed">Access Authorization Key</label>
            <div className="relative">
               <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
               <input 
                required 
                type="password" 
                className="input-field pl-12" 
                placeholder="••••••••" 
                value={password}
                onChange={e => setPassword(e.target.value)}
               />
            </div>
          </div>

          {error && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest text-center animate-pulse">{error}</p>}

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-primary w-full justify-center group py-5 rounded-2xl"
          >
            {isLoading ? 'ESTABLISHING HANDSHAKE...' : 'INITIALIZE INTERFACE'}
            {!isLoading && <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-all" />}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-6 text-center">
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              No established identity? <Link href="/client/register" className="text-accent-amber hover:underline">Register New Entity</Link>
            </p>
            <Link href="/services/initiation" className="text-xs font-black text-white hover:text-accent-amber uppercase tracking-widest transition-all block">
              + ACTIVATE NEW PROJECT TENDER
            </Link>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <ShieldCheck size={14} />
            <p className="text-[8px] font-black uppercase tracking-widest">
              DG-CORE QUANTUM ENCRYPTED
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}

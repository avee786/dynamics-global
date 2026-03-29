'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldAlert, Key, Globe2, UserCheck, ArrowRight, Home } from 'lucide-react';
import Link from 'next/link';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('isLoggedIn', 'true');
        router.push('/admin');
      } else {
        setIsLoading(false);
        setError(data.message?.toUpperCase() || 'ACCESS DENIED: INVALID CREDENTIALS');
      }
    } catch(err) {
      console.error("Admin Login Fetch Error", err);
      setIsLoading(false);
      setError('SYSTEM ERROR: UNABLE TO CONNECT TO SECURITY LAYER');
    }
  };

  return (
    <main className="h-screen w-full bg-primary-deep flex items-center justify-center p-6 bg-gradient-radial from-slate-900 to-primary-deep">
      <div className="absolute top-12 left-12">
        <Link href="/" className="flex items-center gap-3 text-slate-500 hover:text-white transition-all font-black uppercase text-[10px] tracking-widest">
           <Home size={16} /> Dashboard Home
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-panel w-full max-w-lg p-12 border-l-4 border-accent-amber relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Globe2 size={120} className="text-white" />
        </div>

        <div className="mb-12">
           <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-accent-amber/10 rounded-lg text-accent-amber">
                 <ShieldAlert size={28} />
              </div>
              <div>
                 <h2 className="text-3xl font-black tracking-tighter">CONTROL ACCESS</h2>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Level 5 Security Gateway</p>
              </div>
           </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-accent-amber uppercase tracking-widest">Operational Username</label>
              <div className="relative">
                 <UserCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                 <input 
                  required 
                  type="text" 
                  className="input-field pl-12" 
                  placeholder="Employee-ID" 
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                 />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-accent-amber uppercase tracking-widest">Command Key</label>
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

           {error && <p className="text-xs font-black text-red-500 uppercase tracking-widest text-center animate-pulse">{error}</p>}

           <button type="submit" className="btn-primary w-full justify-center group">
              INITIALIZE INTERFACE <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-all" />
           </button>
        </form>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-4 text-center">
           <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">
              Authorized personnel only. All access attempts are logged and monitored by corporate security in Rajasthan HQ.
           </p>
           <div className="flex gap-4 opacity-50 text-[10px] font-black text-slate-500">
              <span>Encryp: AES-256</span>
              <span>Protocol: JWT-LS</span>
           </div>
        </div>
      </motion.div>
    </main>
  );
}

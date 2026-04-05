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
    
    // Create a controller to abort the fetch if it takes too long
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn(">>> [LOGIN] Fetch timed out after 60s");
      controller.abort();
    }, 60000); // 60 second timeout

    try {
      console.log(">>> Sending login request for:", username);
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log(">>> Response status:", res.status);
      const data = await res.json();

      if (data.success) {
        console.log(">>> Login success! Redirecting...");
        // Store JWT token + auth flag
        localStorage.setItem('isLoggedIn', 'true');
        if (data.token) localStorage.setItem('token', data.token);
        router.push('/admin');
      } else {
        setIsLoading(false);
        setError(data.message?.toUpperCase() || 'ACCESS DENIED: CONTACT COMMAND CENTER');
      }
    } catch(err: any) {
      clearTimeout(timeoutId);
      console.error("Admin Login Error:", err);
      setIsLoading(false);
      if (err.name === 'AbortError') {
        setError('CONNECTION TIMEOUT: DATABASE RESPONSE DELAYED');
      } else {
        setError('SYSTEM ERROR: UNABLE TO CONTACT SECURITY GATEWAY');
      }
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

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-primary w-full justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
            >
               {isLoading ? (
                 <>
                   <span className="w-5 h-5 border-2 border-primary-deep/30 border-t-primary-deep rounded-full animate-spin mr-2" />
                   INITIALIZING...
                 </>
               ) : (
                 <>
                   INITIALIZE INTERFACE <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-all" />
                 </>
               )}
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

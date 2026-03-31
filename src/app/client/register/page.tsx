'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Building2, Mail, Lock, User, ShieldCheck, ChevronRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    company: '',
    name: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/client/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('isClientLoggedIn', 'true');
        localStorage.setItem('clientEmail', formData.email);
        localStorage.setItem('clientCompany', formData.company);
        router.push('/client');
      } else {
        alert(`Registration failed: ${data.message}`);
      }
    } catch (err) {
      console.error("Registration Request Error:", err);
      alert('Error during registration. Please check console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-primary-deep flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-amber/5 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -ml-64 -mb-64" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-12 max-w-md w-full relative z-10"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-black text-slate-500 hover:text-white uppercase tracking-widest mb-12 transition-colors">
          <ArrowLeft size={14} /> Back to Gateway
        </Link>

        <div className="mb-12">
          <div className="w-12 h-12 bg-accent-amber rounded-xl flex items-center justify-center font-black text-primary-deep mb-6">DG</div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Initialize <br /><span className="text-accent-amber not-italic italic">Client Account</span></h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none border-l-2 border-accent-amber pl-4">Industrial Grade Security Layer</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Authorized Representative</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                required
                className="input-field pl-12" 
                placeholder="Full Name"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Registered Company Entity</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                required
                className="input-field pl-12" 
                placeholder="Company Name"
                value={formData.company}
                onChange={e => setFormData({...formData, company: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Corporate Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="email" 
                required
                className="input-field pl-12" 
                placeholder="corporate@email.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Secure Credentials</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="password" 
                required
                className="input-field pl-12" 
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn-primary w-full justify-center py-5 rounded-2xl group"
            >
              {isSubmitting ? 'ESTABLISHING PROTOCOL...' : 'FINALIZE REGISTRATION'}
              {!isSubmitting && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        </form>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            Already established? <Link href="/client/login" className="text-accent-amber hover:underline">Return to Terminal</Link>
          </p>
          <div className="flex items-center gap-2 text-emerald-500/40">
            <ShieldCheck size={14} />
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">256-Bit Encrypted Protocol</span>
          </div>
        </div>
      </motion.div>
    </main>
  );
}

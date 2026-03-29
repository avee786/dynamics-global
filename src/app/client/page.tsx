'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Download, 
  CreditCard, 
  Activity, 
  History, 
  TrendingUp, 
  LogOut, 
  ChevronRight, 
  Shield,
  Target,
  Database,
  Cpu,
  Globe,
  AlertCircle,
  FileSignature,
  Layers,
  Zap,
  Briefcase
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ClientDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [user, setUser] = useState({ email: '', company: '' });
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isClientLoggedIn') === 'true';
      if (!isLoggedIn) {
        router.push('/client/login');
      } else {
        setAuthorized(true);
        const email = localStorage.getItem('clientEmail') || '';
        const company = localStorage.getItem('clientCompany') || 'Test Corp';
        setUser({ email, company });
        fetchData(email, company);
      }
    };
    checkAuth();
  }, [router]);

  const fetchData = async (email: string, company: string) => {
    try {
      const [projRes, reqRes, payRes] = await Promise.all([
        fetch('/api/data/projects'),
        fetch('/api/data/requests'),
        fetch('/api/data/payments')
      ]);
      const [projData, reqData, payData] = await Promise.all([
        projRes.json(), 
        reqRes.json(), 
        payRes.json()
      ]);
      
      // Filter projects by company name
      const filteredProjects = projData.filter((p: any) => 
        p.client?.toLowerCase() === company.toLowerCase()
      );

      // Filter requests by email
      const filteredRequests = reqData.filter((r: any) => 
        r.corporateEmail?.toLowerCase() === email.toLowerCase()
      );

      setProjects(filteredProjects);
      setRequests(filteredRequests);
      setPayments(payData.filter((pay: any) => pay.id.includes('2024') || pay.amount.includes('1.2M')));
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('isClientLoggedIn');
    localStorage.removeItem('clientEmail');
    localStorage.removeItem('clientCompany');
    router.push('/client/login');
  };

  if (!authorized || loading) return (
    <div className="h-screen w-full bg-primary-deep flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
         <div className="w-16 h-16 border-4 border-white/5 border-t-accent-amber rounded-full animate-spin" />
         <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Decrypting Profile...</p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-primary-deep text-white pb-32">
      {/* Cinematic Client Header */}
      <header className="max-w-7xl mx-auto px-8 py-20 flex flex-col md:flex-row justify-between items-end gap-12 border-b border-white/5 mb-20 relative">
         <div className="absolute top-0 right-0 w-[800px] h-[300px] bg-accent-amber/[0.03] blur-[150px] -mr-64 pointer-events-none" />
         
         <div className="relative z-10">
            <div className="flex items-center gap-4 text-accent-amber mb-8 overflow-hidden">
               <motion.div initial={{ x: -100 }} animate={{ x: 0 }} className="w-12 h-[2px] bg-accent-amber/30" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
                  <Shield size={14} /> Authenticated Intelligence Hub
               </span>
            </div>
            <motion.h1 
               initial={{ opacity: 0, y: 20 }} 
               animate={{ opacity: 1, y: 0 }}
               className="text-5xl md:text-7xl lg:text-9xl italic font-black tracking-tighter uppercase leading-[0.85] break-words"
            >
               {user.company.split(' ')[0]} <br /><span className="text-accent-amber not-italic">Portal</span>
            </motion.h1>
            <div className="mt-12 flex items-center gap-6">
               <div className="flex items-center gap-3 py-2 px-4 bg-white/5 rounded-full border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{user.email}</span>
               </div>
               <div className="px-4 py-2 bg-accent-amber/10 border border-accent-amber/20 rounded-full text-[10px] font-black text-accent-amber uppercase tracking-widest">
                  Secure ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
               </div>
            </div>
         </div>
         
         <button onClick={logout} className="px-10 py-5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:text-red-500 hover:border-red-500/20 transition-all flex items-center gap-3 relative z-10 group">
            Terminate Session <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
         </button>
      </header>

      <div className="max-w-7xl mx-auto px-8 grid grid-cols-12 gap-16">
        {/* Main Content: Tracking & Tenders */}
        <div className="col-span-12 lg:col-span-8 space-y-20">
          
          {/* 1. Tender Status Flow (Pending Requests) */}
          <section className="space-y-10">
             <div className="flex items-center justify-between border-l-4 border-blue-500 pl-8">
                <div>
                   <h3 className="text-4xl font-black tracking-tighter uppercase italic">Tender <span className="text-blue-500 not-italic">Evaluations</span></h3>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2">Phase 1: Technical Verification Stream</p>
                </div>
                <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-500">
                   <FileSignature size={32} />
                </div>
             </div>

             {requests.length === 0 ? (
               <div className="glass-panel p-20 flex flex-col items-center justify-center border-dashed border-2 border-white/5 opacity-50">
                  <Layers size={48} className="text-slate-700 mb-6" />
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600">No active tender submissions detected</p>
                  <button onClick={() => router.push('/services/initiation')} className="mt-8 text-xs font-black text-accent-amber hover:underline uppercase tracking-widest">Submit New Tender Request +</button>
               </div>
             ) : (
               <div className="space-y-6">
                  {requests.map((req, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      className="glass-panel p-10 border-white/5 hover:border-blue-500/20 transition-all relative overflow-hidden group"
                    >
                       <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
                          <div className="md:col-span-5 space-y-4">
                             <div className="flex items-center gap-3">
                                <span className="text-[9px] font-black py-1 px-3 bg-blue-500 text-white rounded-full uppercase tracking-widest">{req.id}</span>
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Submitted: {new Date(req.timestamp).toLocaleDateString()}</span>
                             </div>
                             <h4 className="text-2xl font-black uppercase tracking-tight leading-none group-hover:text-blue-400 transition-colors">{req.projectType || req.industry}</h4>
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{req.siteLocation} • Site Analysis In Progress</p>
                          </div>
                          
                          <div className="md:col-span-4 border-l border-white/5 pl-8 space-y-4">
                             <div className="flex items-center gap-3">
                                <Clock size={16} className="text-accent-amber" />
                                <div>
                                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">ETA Assessment</p>
                                   <p className="text-sm font-black text-white italic">72 Business Hours</p>
                                </div>
                             </div>
                             <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                   initial={{ width: '10%' }} 
                                   animate={{ width: '45%' }} 
                                   className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                                />
                             </div>
                             <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Current Status: {req.status}</p>
                          </div>

                          <div className="md:col-span-3 flex justify-end">
                             <button className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all flex flex-col items-center gap-2">
                                <FileText size={20} className="text-slate-400" />
                                <span className="text-[8px] font-black uppercase tracking-widest">Review Pack</span>
                             </button>
                          </div>
                       </div>
                       <div className="absolute -right-8 -bottom-8 opacity-[0.02] rotate-12 group-hover:scale-110 transition-transform">
                          <FileSignature size={200} />
                       </div>
                    </motion.div>
                  ))}
               </div>
             )}
          </section>

          {/* 2. Live Deployment Logistics (Active Projects) */}
          <section className="space-y-10">
             <div className="flex items-center justify-between border-l-4 border-accent-amber pl-8">
                <div>
                   <h3 className="text-4xl font-black tracking-tighter uppercase italic">Active <span className="text-accent-amber not-italic">Deployments</span></h3>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2">Phase 2: Operational Infrastructure Stream</p>
                </div>
                <div className="p-4 bg-accent-amber/10 rounded-2xl text-accent-amber">
                   <Zap size={32} className="animate-pulse" />
                </div>
             </div>

             <div className="space-y-8">
                {projects.map((p, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: idx * 0.1 }}
                    className="glass-panel p-12 group border-white/5 hover:bg-white/[0.01] transition-all"
                  >
                     <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                        <div className="md:col-span-8 space-y-10">
                           <div className="flex items-start gap-8">
                              <div className="w-20 h-20 bg-accent-amber/10 rounded-3xl flex items-center justify-center text-accent-amber border border-accent-amber/20 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                                 <Package size={40} />
                              </div>
                              <div className="space-y-2">
                                 <span className="text-[10px] font-black text-accent-amber tracking-[0.5em] uppercase block">{p.id}</span>
                                 <h4 className="text-4xl font-black tracking-tighter uppercase leading-none group-hover:text-white transition-colors">{p.title}</h4>
                                 <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Mission Active</span>
                                 </div>
                              </div>
                           </div>
                           
                           <div className="grid grid-cols-3 gap-8 pt-4">
                              <div className="space-y-3">
                                 <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-2">
                                    <MapPin size={12} className="text-accent-amber" /> Localization
                                 </p>
                                 <p className="text-sm font-bold text-slate-300 uppercase leading-none">{p.location || 'Global Ops'}</p>
                              </div>
                              <div className="space-y-3">
                                 <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-2">
                                    <Briefcase size={12} className="text-accent-amber" /> Valuation
                                 </p>
                                 <p className="text-sm font-black text-white italic tracking-tighter leading-none">{p.budget}</p>
                              </div>
                              <div className="space-y-3">
                                 <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-2">
                                    <Clock size={12} className="text-accent-amber" /> Duration
                                 </p>
                                 <p className="text-sm font-bold text-slate-400 font-mono italic leading-none">{p.duration || '24 MO'}</p>
                              </div>
                           </div>

                           {/* Logistic Tracking Bar */}
                           <div className="pt-8">
                              <div className="flex justify-between items-end mb-4">
                                 <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Master Protocol Real-Time Completion</span>
                                 <span className="text-lg font-black text-accent-amber italic tracking-tighter">{p.progress}</span>
                              </div>
                              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                 <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: p.progress }}
                                    className="h-full bg-accent-amber shadow-[0_0_20px_rgba(245,158,11,0.6)]"
                                 />
                              </div>
                              <div className="flex justify-between mt-3">
                                 <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Initiation</span>
                                 <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest text-right">Handover</span>
                              </div>
                           </div>
                        </div>

                        <div className="md:col-span-4 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/5 pt-10 md:pt-0 md:pl-12">
                           <div className="space-y-8">
                              <div className="space-y-2">
                                 <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Infrastructure Status</p>
                                 <p className="text-2xl font-black text-white uppercase tracking-tighter">{p.status}</p>
                              </div>
                              <div className="space-y-2">
                                 <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Commencement</p>
                                 <p className="text-sm font-bold text-slate-400 font-mono italic">{p.startDate}</p>
                              </div>
                           </div>

                           <div className="space-y-4 pt-16">
                              <button 
                                 onClick={async () => {
                                   try {
                                     const resp = await fetch('/api/generate-pdf', {
                                       method: 'POST',
                                       headers: {
                                         'Content-Type': 'application/json',
                                         'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
                                       },
                                       body: JSON.stringify({ projectId: p._id || p.id })
                                     });
                                     if (!resp.ok) throw new Error('PDF generation failed');
                                     const blob = await resp.blob();
                                     const url = window.URL.createObjectURL(blob);
                                     const link = document.createElement('a');
                                     link.href = url;
                                     link.setAttribute('download', `DG_Contract_${p._id || p.id}.pdf`);
                                     document.body.appendChild(link);
                                     link.click();
                                     link.parentNode?.removeChild(link);
                                     window.URL.revokeObjectURL(url);
                                   } catch (e) {
                                     alert('Unable to download contract. Please try again.');
                                   }
                                 }}
                                 className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-[9px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:text-accent-amber hover:bg-accent-amber/5 transition-all group/btn"
                              >
                                 DOWNLOAD CONTRACT <Download size={16} className="group-hover/btn:translate-y-0.5 transition-transform" />
                              </button>
                              <button className="btn-primary w-full py-5 text-[9px] group justify-center shadow-[0_0_40px_rgba(245,158,11,0.1)] rounded-2xl tracking-[0.4em]">
                                 TRACK LIVE REQUISITION <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                              </button>
                           </div>
                        </div>
                     </div>
                  </motion.div>
                ))}
             </div>
          </section>
        </div>

        {/* Intelligence Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-16">
          
          {/* Valuations Module */}
          <div className="glass-panel p-12 bg-accent-amber/[0.03] border-accent-amber/10 overflow-hidden relative shadow-2xl">
             <div className="relative z-10">
                <div className="flex items-center gap-3 text-accent-amber mb-12">
                   <TrendingUp size={28} />
                   <span className="text-[10px] font-black uppercase tracking-[0.5em]">Valuation Architecture</span>
                </div>
                <div className="space-y-12">
                   <div>
                      <p className="text-7xl font-black tracking-tighter mb-2 italic">₹180 Cr</p>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Total Aggregated Asset Scale</p>
                   </div>
                   <div className="pt-12 border-t border-white/5 grid grid-cols-2 gap-12">
                      <div className="space-y-2">
                         <p className="text-4xl font-black text-white italic">12</p>
                         <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] leading-tight">Project <br />Units</p>
                      </div>
                      <div className="space-y-2">
                         <p className="text-4xl font-black text-white italic">04</p>
                         <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] leading-tight">Settled <br />Events</p>
                      </div>
                   </div>
                </div>
             </div>
             <div className="absolute -right-12 -bottom-12 opacity-[0.05] rotate-12 scale-150 text-accent-amber">
                <TrendingUp size={300} />
             </div>
          </div>

          {/* Ledger Flow */}
          <div className="glass-panel p-12 relative border-white/5">
             <div className="flex items-center justify-between mb-12">
                <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-white flex items-center gap-4">
                   <History size={24} className="text-accent-amber" /> Ledger Stream
                </h3>
             </div>
             <div className="space-y-10">
                {payments.length === 0 ? (
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest text-center py-10">Historical logs are sterile</p>
                ) : (
                  payments.map((pay, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-pointer border-b border-white/5 pb-8 last:border-0 last:pb-0">
                       <div className="space-y-2">
                          <p className="text-[11px] font-extrabold group-hover:text-accent-amber transition-colors uppercase tracking-tight leading-none">{pay.description}</p>
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">{pay.date} • {pay.id}</p>
                       </div>
                       <div className="text-right space-y-2">
                          <p className="text-base font-black text-white italic tracking-tighter leading-none">{pay.amount}</p>
                          <span className={cn(
                             "text-[9px] font-black uppercase tracking-[0.2em] py-1 px-3 rounded-full border",
                             pay.status === 'Paid' ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' : 'border-accent-amber/20 text-accent-amber bg-accent-amber/5'
                          )}>
                             {pay.status}
                          </span>
                       </div>
                    </div>
                  ))
                )}
             </div>
             <button className="w-full mt-12 py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:text-accent-amber hover:border-accent-amber/30 transition-all flex items-center justify-center gap-3">
                Protocol Archive Export <Download size={14} />
             </button>
          </div>

          {/* Security & Support Grid */}
          <div className="grid grid-cols-1 gap-6">
             <div className="p-10 bg-gradient-to-br from-white/[0.03] to-transparent rounded-[2.5rem] border border-white/5 flex flex-col gap-6">
                <div className="w-16 h-16 rounded-2xl bg-primary-deep flex items-center justify-center text-accent-amber border border-white/10 shadow-xl">
                   <Globe size={32} />
                </div>
                <div>
                   <p className="text-[11px] font-black text-white uppercase tracking-[0.4em] mb-2">Regional Support</p>
                   <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest leading-relaxed">Dedicated regional engineer assigned to your infrastructure stream available 24/7.</p>
                </div>
                <button className="mt-4 text-[10px] font-black text-accent-amber hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors">
                   CONNECT TO HQ <ChevronRight size={12} />
                </button>
             </div>

             <div className="p-10 bg-primary-deep rounded-[2.5rem] border border-white/5 flex items-center gap-8 shadow-inner overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:rotate-45 transition-transform">
                   <Shield size={80} />
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-700 shrink-0">
                   <Shield size={24} />
                </div>
                <div className="relative z-10">
                   <p className="text-[11px] font-black text-white uppercase tracking-[0.4em]">AES-256 Vault</p>
                   <p className="text-[9px] text-slate-700 font-bold uppercase tracking-widest leading-none mt-1">Industrial Logistics Decryption Engine Active</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}

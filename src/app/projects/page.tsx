'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, IndianRupee, Calendar, ChevronRight, CheckCircle2, Clock, AlertCircle, Package } from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetch('/api/data/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => console.error('Data acquisition failed', err));
  }, []);

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) return (
    <div className="h-[60vh] w-full flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-white/5 border-t-accent-amber rounded-full animate-spin" />
    </div>
  );

  return (
    <main className="pb-32">
       {/* Hero Section */}
       <section className="max-w-7xl mx-auto px-8 py-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20">
             <div className="max-w-2xl">
                <div className="flex items-center gap-3 text-accent-amber mb-6">
                   <div className="w-12 h-[2px] bg-accent-amber/30" />
                   <span className="text-xs font-black uppercase tracking-[0.4em]">Operations Ledger</span>
                </div>
                <h1 className="section-title italic">Strategic <span className="text-accent-amber not-italic">Portfolio</span></h1>
                <p className="text-xl text-slate-400 font-medium leading-relaxed">
                   A definitive record of industrial scale and operational efficiency. 
                   Explore {projects.length} strategic missions deployed across global economic sectors.
                </p>
             </div>
             
             <div className="flex flex-col sm:flex-row gap-4 items-center bg-white/5 p-4 rounded-3xl border border-white/5 backdrop-blur-xl">
                <div className="relative w-full sm:w-80">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                   <input 
                    type="text" 
                    placeholder="Search Location or Module..." 
                    className="input-field pl-12 py-3 text-sm border-transparent bg-white/2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                   />
                </div>
                <div className="flex gap-2">
                   {['All', 'Ongoing', 'Completed'].map((f) => (
                     <button 
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        filter === f ? 'bg-accent-amber text-primary-deep' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                     >
                       {f}
                     </button>
                   ))}
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
             <AnimatePresence mode="popLayout">
                {filteredProjects.map((p, i) => (
                  <motion.div 
                    layout
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
                    className="glass-panel group hover:border-accent-amber/40 transition-all p-8 md:p-12 flex flex-col lg:flex-row justify-between items-center gap-12"
                  >
                     <div className="flex flex-col md:flex-row gap-10 items-center flex-1">
                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 shadow-2xl ${
                          p.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' : 
                          p.status === 'Ongoing' ? 'bg-accent-amber/10 text-accent-amber' : 'bg-blue-500/10 text-blue-500'
                        }`}>
                           <Package size={36} />
                        </div>
                        
                        <div className="text-center md:text-left space-y-2">
                           <div className="flex items-center gap-3 justify-center md:justify-start">
                              <span className="text-[10px] font-black text-accent-amber uppercase tracking-widest opacity-80">{p.id}</span>
                              <div className="w-1 h-1 rounded-full bg-slate-700" />
                              <div className="flex items-center gap-2">
                                 <div className={`w-2 h-2 rounded-full ${p.status === 'Completed' ? 'bg-emerald-500' : p.status === 'Ongoing' ? 'bg-accent-amber' : 'bg-blue-500'} animate-pulse`} />
                                 <span className="text-[10px] font-black text-white uppercase tracking-widest">{p.status}</span>
                              </div>
                           </div>
                           <h3 className="text-4xl tracking-tight group-hover:text-accent-amber transition-colors leading-none">{p.title}</h3>
                           <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Client: {p.client || 'Strategic Partnership'}</p>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 md:grid-cols-3 gap-12 w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-white/5 pt-12 lg:pt-0 lg:pl-12">
                        <div className="space-y-2">
                           <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-2">
                              <MapPin size={12} className="text-accent-amber" /> Geography
                           </p>
                           <p className="text-base font-bold text-slate-300">{p.location || 'Global Expansion'}</p>
                        </div>
                        <div className="space-y-2">
                           <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-2">
                              <IndianRupee size={12} className="text-accent-amber" /> Valuation
                           </p>
                           <p className="text-base font-bold text-slate-300">{p.budget || 'TBD'}</p>
                        </div>
                        <div className="space-y-2 hidden md:block">
                           <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-2">
                              <Calendar size={12} className="text-accent-amber" /> Timeframe
                           </p>
                           <p className="text-base font-bold text-slate-300">{p.duration || p.startDate || 'LTSC Contract'}</p>
                        </div>
                     </div>

                     <div className="shrink-0 hidden lg:block">
                        <motion.button whileHover={{ rotate: 45, backgroundColor: 'var(--accent-amber)', color: '#000' }} className="p-6 bg-white/5 border border-white/5 rounded-full text-slate-400 transition-colors">
                           <ChevronRight size={32} />
                        </motion.button>
                     </div>
                  </motion.div>
                ))}
             </AnimatePresence>
          </div>
       </section>
    </main>
  );
}

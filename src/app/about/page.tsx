'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { leadership, globalPartners } from '@/data/siteData';
import { Target, Users, Globe, Shield, ChevronRight } from 'lucide-react';

export default function About() {
  return (
    <main className="pb-32">
       {/* Hero Section */}
       <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <h1 className="text-5xl md:text-7xl lg:text-9xl font-black uppercase tracking-tighter mb-8 break-words leading-none">ENGINEERING <span className="text-accent-amber">EXCELLENCE</span></h1>
             <p className="text-xl text-slate-400 max-w-3xl leading-relaxed font-medium">
                Dynamics Global is a premier industrial solutions provider, specializing in large-scale mining, 
                infrastructure, and logistics operations. Our mission is to bridge the gap between complex 
                industrial requirements and high-efficiency execution.
             </p>
          </motion.div>
       </section>

       {/* Values Grid */}
       <section className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20 md:mb-32">
          {[
            { label: 'Strategic Vision', icon: Target, desc: 'Long-term industrial planning' },
            { label: 'Global Network', icon: Globe, desc: 'Partnerships across 4 continents' },
            { label: 'Operational Safety', icon: Shield, desc: 'Grade-A security protocols' },
            { label: 'Elite Workforce', icon: Users, desc: '100+ specialized operators' },
          ].map((v, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className="glass-panel p-8 text-center border-white/5 hover:border-accent-amber/20 transition-all">
               <v.icon className="mx-auto mb-4 text-accent-amber" size={32} />
               <h4 className="text-sm font-black uppercase tracking-widest mb-2">{v.label}</h4>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
       </section>
      
      {/* CEO Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-20 md:mb-32">
        <div className="glass-panel p-6 sm:p-12 lg:p-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative h-[400px] md:h-[600px] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl group border border-white/5">
            <Image 
              src="/images/ceo1.png" 
              alt={leadership.owner.name} 
              fill 
              className="object-cover object-top group-hover:scale-105 transition-transform duration-1000 saturate-50 contrast-125"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/80 via-transparent to-transparent" />
          </div>
          <div className="space-y-6 md:space-y-8">
            <div>
               <span className="text-accent-amber text-[10px] md:text-xs font-black tracking-[0.3em] uppercase mb-4 block">Executive Leadership</span>
               <h2 className="text-4xl md:text-6xl font-black mb-2 uppercase tracking-tighter leading-none">{leadership.owner.name}</h2>
               <p className="text-lg md:text-xl font-bold text-slate-400 tracking-wider uppercase italic">{leadership.owner.role}</p>
            </div>
            
            <p className="text-slate-500 font-bold border-l-4 border-accent-amber pl-6 italic">
              &quot;{leadership.owner.experience}&quot;
            </p>
            
            <p className="text-lg text-slate-300 leading-relaxed font-medium">
              {leadership.owner.bio}
            </p>
          </div>
        </div>
      </section>

      {/* Partners section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-20 md:mb-32">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 border-b border-white/5 pb-8 gap-4">
            <div>
               <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter break-words">GLOBAL <span className="text-accent-amber">PARTNERSHIPS</span></h2>
               <p className="text-slate-500 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-widest mt-2">Strategic Alliances Across Key Economic Hubs</p>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {globalPartners.map((p, index) => (
              <motion.div key={index} whileHover={{ y: -5 }} className="glass-card flex items-center justify-between group">
                <div>
                   <p className="text-accent-amber font-black text-[10px] tracking-[0.3em] uppercase mb-2">{p.country}</p>
                   <h4 className="text-2xl mb-1">{p.company}</h4>
                   <p className="text-sm text-slate-400 font-medium">{p.name} • {p.role}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent-amber group-hover:text-primary-deep transition-all">
                   <ChevronRight size={24} />
                </div>
              </motion.div>
            ))}
         </div>
      </section>
    </main>
  );
}

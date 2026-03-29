'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Building2, 
  Globe2, 
  Truck, 
  HardHat, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  ChevronRight,
  Target,
  Database,
  Cpu,
  Star,
  Quote,
  Users,
  Briefcase,
  TrendingUp,
  Award,
  Warehouse
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const [logoError, setLogoError] = useState(false);

  const stats = [
    { label: 'Asset Valuation', value: '₹8.5+ Cr', icon: TrendingUp },
    { label: 'Global Projects', value: '70+', icon: Building2 },
    { label: 'Workers', value: '20+', icon: Globe2 },
    { label: 'Operational Hubs', value: '', icon: Database }
  ];

  const partners = [
    "RIO TINTO", "ADANI GROUP", "BECHTEL", "CATERPILLAR", "LOGITRANS USA", "NEOM AUTHORITY"
  ];

  const testimonials = [
    {
      quote: "Dynamics Global transformed our logistics infrastructure in the Gobi project. Their precision deployment is unmatched.",
      author: "Marcus Chen",
      role: "Operations Director, Northern Steel",
      avatar: "MC"
    },
    {
      quote: "Strategic partnership with DG allowed us to scale our mining operations across 3 continents in record time.",
      author: "Sarah Jenkins",
      role: "VP Infrastructure, Global Mining Corp",
      avatar: "SJ"
    }
  ];

  return (
    <main className="min-h-screen bg-primary-deep text-white overflow-hidden">
      
      {/* --- CINEMATIC HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Multi-layer cinematic background */}
        <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
          <Image
            src="/images/mining.png"
            alt="Mining Infrastructure"
            fill
            className="object-cover object-center scale-110"
            priority
          />
          {/* Dark overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-deep via-primary-deep/90 to-primary-deep/40 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-deep via-transparent to-primary-deep/60 z-10" />
        </motion.div>

        {/* Animated amber glow orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-accent-amber/10 blur-[150px] rounded-full"
          />
          <motion.div
            animate={{ y: [0, -30, 0], opacity: [0.05, 0.12, 0.05] }}
            transition={{ duration: 9, repeat: Infinity, delay: 2 }}
            className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full"
          />
          {/* Diagonal accent line */}
          <div className="absolute top-0 left-[40%] w-px h-full bg-gradient-to-b from-transparent via-accent-amber/20 to-transparent" />
        </div>

        {/* Main hero content */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT: Brand Identity + CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="flex flex-col items-start gap-8"
          >
            {/* Live status badge */}
            <div className="flex items-center gap-3 px-3 md:px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl w-fit max-w-[90vw]">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-amber opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-amber" />
              </span>
              <span className="text-[8px] md:text-[9px] font-black tracking-widest md:tracking-[0.4em] uppercase text-slate-300 break-words leading-tight">Master Infrastructure Protocol v3.0  —  Live</span>
            </div>

            {/* Official Logo */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <Image
                src="/logo.png"
                alt="Dynamics Global"
                width={380}
                height={100}
                className="object-contain w-auto h-24 md:h-28 drop-shadow-[0_0_40px_rgba(245,158,11,0.3)]"
                priority
                unoptimized
              />
            </motion.div>

            {/* Headline */}
            <div>
              <p className="text-[10px] font-black tracking-[0.5em] uppercase text-accent-amber mb-3">Engineering Global Infrastructure</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-white">
                Building the World's
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-amber to-orange-300">
                  Industrial Backbone
                </span>
                <br />
                <span className="text-slate-500 text-3xl md:text-4xl">Since 2021.</span>
              </h1>
            </div>

            {/* Tagline */}
            <p className="max-w-lg text-slate-400 text-base md:text-lg leading-relaxed border-l-4 border-accent-amber pl-6">
              From deep-core mining to hyperscale logistics, we architect the physical foundations of international economic expansion across India, UAE, USA & beyond.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
              <Link
                href="/services/initiation"
                className="btn-primary group py-5 px-10 text-sm shadow-[0_0_40px_rgba(245,158,11,0.25)]"
              >
                START A PROJECT <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform ml-3" />
              </Link>
              <Link
                href="/client/login"
                className="px-8 py-5 bg-white/5 border border-white/10 rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 hover:border-accent-amber/30 transition-all flex items-center gap-3"
              >
                CLIENT PORTAL <ChevronRight size={16} className="text-accent-amber" />
              </Link>
            </div>

            {/* Quick stats strip */}
            <div className="flex items-center gap-8 pt-4 border-t border-white/5 w-full">
              {stats.slice(0, 3).map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.15 }}
                  className="flex flex-col"
                >
                  <span className="text-xl md:text-2xl font-black tracking-tighter text-white">{s.value}</span>
                  <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em]">{s.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: Feature card panel */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
            className="hidden lg:flex flex-col gap-5"
          >
            {[
              { title: "Mining Operations", desc: "Open-pit & underground extractions at scale", icon: "⛏️", stat: "50+ Sites" },
              { title: "Infrastructure Build", desc: "Highways, bridges, industrial earthmoving", icon: "🏗️", stat: "₹8.5+ Cr" },
              { title: "Global Logistics", desc: "Heavy-haul fleet across India, UAE & USA", icon: "🌐", stat: "4 Regions" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.15 }}
                whileHover={{ x: 6 }}
                className="glass-panel p-6 flex items-center gap-5 border-white/5 hover:border-accent-amber/30 transition-all group cursor-default"
              >
                <div className="text-3xl shrink-0">{item.icon}</div>
                <div className="flex-1">
                  <p className="font-black text-sm uppercase tracking-widest text-white group-hover:text-accent-amber transition-colors">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-accent-amber font-black text-sm">{item.stat}</p>
                </div>
              </motion.div>
            ))}

            {/* Bottom trust badge */}
            <div className="glass-panel p-5 border-accent-amber/20 bg-accent-amber/5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-accent-amber/20 flex items-center justify-center shrink-0">
                <span className="text-accent-amber text-lg">✓</span>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-white">ISO 9001:2015 Certified</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Grade-A Safety & Quality Standards globally</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          style={{ opacity }}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
        >
          <span className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-500">Scroll to Explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-accent-amber to-transparent" />
        </motion.div>
      </section>

      {/* --- TRUSTED LOGO STRIP --- */}
      <section className="py-20 border-y border-white/5 bg-white/[0.01]">
         <div className="max-w-7xl mx-auto px-8 overflow-hidden">
            <p className="text-center text-[9px] font-black uppercase tracking-[1em] text-slate-600 mb-12">Global Industrial Alliances</p>
            <div className="flex flex-wrap justify-center items-center gap-x-20 gap-y-12 opacity-30 grayscale contrast-125">
               {partners.map((p, i) => (
                 <span key={i} className="text-2xl md:text-4xl font-black tracking-tighter hover:grayscale-0 hover:opacity-100 transition-all cursor-default">{p}</span>
               ))}
            </div>
         </div>
      </section>

      {/* --- STRATEGIC CAPABILITIES --- */}
      <section className="py-40 relative">
         <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col md:flex-row items-end justify-between gap-12 mb-32">
               <div>
                  <div className="flex items-center gap-3 text-accent-amber mb-6">
                    <Database size={24} />
                    <span className="font-black tracking-[0.5em] text-[10px] uppercase">Service Architecture</span>
                  </div>
                  <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-none italic">Turnkey <br /><span className="text-accent-amber not-italic">Capacities</span></h2>
               </div>
               <p className="max-w-md text-slate-500 font-bold uppercase text-[11px] tracking-widest leading-relaxed text-right">
                  We consolidate complex industrial requirements into a singular managed stream of operational excellence.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-12">
               {[
                 { title: 'Mining Infrastructure', icon: Building2, image: '/images/mining.png', code: 'PRO-01', desc: 'Deep-core extraction setup and master site infrastructure.' },
                 { title: 'Mega Construction', icon: HardHat, image: '/images/construction.png', code: 'PRO-02', desc: 'Civil engineering for SEZs, industrial plants, and utility grids.' },
                 { title: 'Global Logistics', icon: Truck, image: '/images/logistics.png', code: 'PRO-03', desc: 'Secure heavy-haul multimodal transport networks.' },
                 { title: 'Warehouse Solutions', icon: Warehouse, image: '/images/logistics.png', code: 'PRO-04', desc: 'State-of-the-art warehousing and cold-chain storage across strategic hubs.' },
               ].map((service, i) => (
                 <motion.div 
                   key={i}
                   whileHover={{ y: -16 }}
                   className="group relative h-[480px] md:h-[600px] xl:h-[700px] overflow-hidden rounded-[2rem] glass-panel p-0 border-white/5"
                 >
                   <Image src={service.image} alt={service.title} fill className="object-cover object-center grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 opacity-40 md:opacity-30" />
                   <div className="absolute inset-0 bg-gradient-to-t from-primary-deep via-primary-deep/60 to-transparent mix-blend-multiply" />
                   <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/90 via-primary-deep/40 to-transparent" />
                   
                   <div className="absolute top-8 left-8 flex items-center justify-between w-[calc(100%-4rem)]">
                      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent-amber">{service.code}</span>
                      <div className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/20 group-hover:border-accent-amber group-hover:text-accent-amber transition-all">
                         <ChevronRight size={18} />
                      </div>
                   </div>

                   <div className="absolute bottom-0 left-0 w-full p-8 xl:p-12 space-y-6">
                      <service.icon className="text-accent-amber mb-2" size={48} />
                      <h3 className="text-3xl xl:text-4xl font-black uppercase tracking-tight leading-none italic">{service.title}</h3>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider leading-relaxed pr-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                         {service.desc}
                      </p>
                      <Link href={`/services/initiation?type=${encodeURIComponent(service.title)}`} className="btn-primary w-full justify-center py-4 uppercase text-[10px] tracking-[0.4em]">
                         Initialize Protocol
                      </Link>
                   </div>
                 </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* --- GLOBAL IMPACT STATS --- */}
      <section className="py-40 bg-white/[0.01] overflow-hidden relative">
         <div className="absolute -left-64 top-0 w-[1000px] h-[1000px] bg-accent-amber/[0.02] blur-[200px] rounded-full" />
         <div className="max-w-7xl mx-auto px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
               <div className="space-y-12">
                  <div className="flex items-center gap-4 text-accent-amber">
                     <Award size={32} />
                     <span className="text-[10px] font-black uppercase tracking-[0.6em]">Corporate Stature</span>
                  </div>
                  <h2 className="text-5xl lg:text-7xl xl:text-8xl font-black tracking-tighter uppercase leading-[0.9]">The Scale <br />of <span className="text-accent-amber italic">Impact</span></h2>
                 {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-16 pt-12 border-t border-white/5">
                     <div className="space-y-4">
                        <p className="text-5xl md:text-7xl font-black tracking-tighter italic text-white">₹180 Cr</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Managed Operational Budget</p>
                     </div>
                     <div className="space-y-4">
                        <p className="text-5xl md:text-7xl font-black tracking-tighter italic text-white">45K+</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Tons of Deployed Assets</p>
                     </div>
                  </div>*/}
               </div>

               <div className="grid grid-cols-1 gap-8">
                  {testimonials.map((t, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.02 }}
                      className="glass-panel p-12 bg-white/[0.01] border-white/10 relative"
                    >
                       <Quote className="absolute top-8 right-8 text-accent-amber opacity-20" size={40} />
                       <div className="flex items-center gap-2 mb-8 text-accent-amber">
                          {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                       </div>
                       <p className="text-2xl font-medium text-slate-300 italic mb-10 leading-relaxed pr-10">
                         &quot;{t.quote}&quot;
                       </p>
                       <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-accent-amber rounded-full flex items-center justify-center text-primary-deep font-black text-xl italic">{t.avatar}</div>
                          <div>
                             <p className="font-black text-white uppercase tracking-widest text-sm">{t.author}</p>
                             <p className="text-[10px] font-bold text-accent-amber uppercase tracking-widest">{t.role}</p>
                          </div>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* --- FINAL CALL TO ACTION --- */}
      <section className="py-40 md:py-60 relative overflow-hidden bg-primary-deep">
         <Image src="/images/logistics.png" alt="Logistics" fill className="object-cover object-center grayscale opacity-[0.05] scale-125" />
         <div className="max-w-5xl mx-auto px-8 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
               <h2 className="text-5xl md:text-7xl lg:text-8xl font-black mb-12 uppercase tracking-tighter leading-none italic">Secure Your <br /><span className="text-accent-amber not-italic">Infrastructure</span></h2>
               <p className="text-slate-400 max-w-2xl mx-auto mb-20 text-xl md:text-2xl font-medium leading-relaxed">
                  Join the network of elite asset owners who rely on Dynamics Global for multi-phase industrial deployment excellence.
               </p>
               <div className="flex flex-col md:flex-row items-center justify-center gap-10">
                  <Link href="/services/initiation" className="btn-primary py-8 px-16 text-sm group tracking-[0.5em] shadow-[0_0_80px_rgba(245,158,11,0.3)]">
                     SUBMIT TENDER <ArrowRight className="ml-4 group-hover:translate-x-2 transition-transform" />
                  </Link>
                  <Link href="/about" className="text-[11px] font-black uppercase tracking-[0.5em] text-white hover:text-accent-amber transition-colors">
                     Review Stature Dossier
                  </Link>
               </div>
            </motion.div>
         </div>
      </section>

      {/* --- FOOTER ARCHITECTURE --- */}
      <footer className="py-20 border-t border-white/5">
         <div className="max-w-7xl mx-auto px-8 flex flex-col lg:flex-row justify-between items-center gap-12 text-center lg:text-left">
            <div className="flex items-center gap-4 shrink-0">
               {!logoError ? (
                 <Image 
                   src="/logo.png" 
                   alt="Dynamics Global Logo" 
                   width={180} 
                   height={48} 
                   className="object-contain"
                   onError={() => setLogoError(true)}
                 />
               ) : (
                 <>
                   <div className="w-12 h-12 bg-accent-amber rounded-xl flex items-center justify-center font-black text-primary-deep shadow-2xl">DG</div>
                   <div className="flex flex-col text-left">
                      <span className="text-2xl font-black tracking-tighter text-white uppercase">DYNAMICS <span className="text-accent-amber">GLOBAL</span></span>
                      <span className="text-[8px] font-black text-slate-500 tracking-[0.6em] uppercase">Industrial Infrastructure HQ</span>
                   </div>
                 </>
               )}
            </div>
            
            <div className="flex flex-wrap justify-center lg:justify-end items-center gap-6 lg:gap-12 text-[9px] font-black text-slate-500 uppercase tracking-widest">
               <Link href="/privacy" className="hover:text-white transition-colors">Privacy Protocol</Link>
               <Link href="/terms" className="hover:text-white transition-colors">Legal Framework</Link>
               <Link href="/contact" className="hover:text-white transition-colors">HQ Uplink</Link>
            </div>
            
            <div className="text-[9px] font-black text-slate-700 uppercase tracking-widest">
               © 2026 DYNAMICS GLOBAL OPERATIONS GROUP
            </div>
         </div>
      </footer>
    </main>
  );
}

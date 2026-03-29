'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, FolderCheck, Cpu, LogOut, ChevronDown, UserCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useRouter } from 'next/navigation';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isClientLoggedIn, setIsClientLoggedIn] = useState(false);
  const [clientEmail, setClientEmail] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    // Check auth state
    const loggedIn = localStorage.getItem('isClientLoggedIn') === 'true';
    setIsClientLoggedIn(loggedIn);
    setClientEmail(localStorage.getItem('clientEmail') || '');

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isClientLoggedIn');
    localStorage.removeItem('clientEmail');
    setIsClientLoggedIn(false);
    setShowDropdown(false);
    router.push('/');
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-[1000] p-6 lg:p-8 transition-all duration-500 ${scrolled ? 'py-4' : 'py-8'}`}>
      <div className={cn(
        "max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8 px-4 md:px-8 border transition-all duration-500 rounded-3xl md:rounded-full py-4",
        scrolled ? "bg-primary-deep/80 backdrop-blur-2xl border-white/10 shadow-2xl" : "bg-white/5 backdrop-blur-md border-white/5"
      )}>
        <Link href="/" className="flex items-center gap-4 group shrink-0">
          {!logoError ? (
            <Image 
              src="/logo.png" 
              alt="Dynamics Global Logo" 
              width={220} 
              height={60} 
              className="object-contain h-14 w-auto transition-transform group-hover:scale-105"
              priority
              unoptimized
              onError={() => setLogoError(true)}
            />
          ) : (
            <>
              <div className="w-10 h-10 bg-accent-amber rounded-xl flex items-center justify-center font-black text-primary-deep transition-transform group-hover:rotate-12 shadow-[0_0_20px_rgba(245,158,11,0.3)]">DG</div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter text-white font-outfit uppercase">DYNAMICS <span className="text-accent-amber">GLOBAL</span></span>
                <span className="text-[8px] font-black text-slate-500 tracking-[0.5em] uppercase opacity-70">Industrial Infrastructure</span>
              </div>
            </>
          )}
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:gap-12">
           <div className="hidden lg:flex flex-wrap items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <Link href="/about" className="hover:text-accent-amber transition-colors">About</Link>
              <Link href="/services" className="hover:text-accent-amber transition-colors">Services</Link>
              <Link href="/projects" className="hover:text-accent-amber transition-colors">Projects</Link>
              <Link href="/services/initiation" className="text-accent-amber hover:text-white transition-colors underline-offset-4 decoration-accent-amber/30 decoration-2">Tenders</Link>
           </div>
           
           <div className="w-[1px] h-6 bg-white/10 hidden lg:block" />
           
           <div className="flex items-center gap-4">
              {isClientLoggedIn ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center gap-3"
                  >
                    <UserCircle size={14} className="text-accent-amber" /> 
                    <span className="max-w-[100px] truncate">{clientEmail.split('@')[0]}</span>
                    <ChevronDown size={12} className={cn("transition-transform", showDropdown && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 md:left-1/2 md:-translate-x-1/2 mt-4 w-56 glass-panel p-2 shadow-2xl z-[1001] bg-primary-deep/95 backdrop-blur-3xl border-white/10 max-w-[calc(100vw-2rem)]"
                      >
                        <Link 
                          href="/client/dashboard" 
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        >
                          <LayoutDashboard size={14} /> My Dashboard
                        </Link>
                        <Link 
                          href="/client/dashboard#projects" 
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        >
                          <FolderCheck size={14} /> Active Projects
                        </Link>
                        <div className="h-[1px] bg-white/5 my-2" />
                        <button 
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500/70 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all"
                        >
                          <LogOut size={14} /> Terminate Session
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/client/login" className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center gap-2">
                   <Cpu size={14} className="text-accent-amber" /> Client Area
                </Link>
              )}
              
              <Link href="/admin" className="px-6 py-2 bg-accent-amber text-primary-deep rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                 <LayoutDashboard size={14} /> HQ
              </Link>
           </div>
        </div>
      </div>
    </nav>
  );
}

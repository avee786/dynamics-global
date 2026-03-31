'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, FolderCheck, Cpu, LogOut, ChevronDown, UserCircle, Menu, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useRouter } from 'next/navigation';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/contact', label: 'Contact' },
  { href: '/services/initiation', label: 'Tenders', highlight: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isClientLoggedIn, setIsClientLoggedIn] = useState(false);
  const [clientEmail, setClientEmail] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    const loggedIn = localStorage.getItem('isClientLoggedIn') === 'true';
    setIsClientLoggedIn(loggedIn);
    setClientEmail(localStorage.getItem('clientEmail') || '');

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 1024) setMobileMenuOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isClientLoggedIn');
    localStorage.removeItem('clientEmail');
    setIsClientLoggedIn(false);
    setShowDropdown(false);
    setMobileMenuOpen(false);
    router.push('/');
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className={`fixed top-0 left-0 right-0 w-full z-[1000] transition-all duration-500 ${scrolled ? 'py-3 px-4 md:px-6' : 'py-4 px-4 md:px-8'}`}>
        <div className={cn(
          "max-w-7xl mx-auto flex flex-row justify-between items-center px-4 md:px-8 border transition-all duration-500 rounded-2xl md:rounded-full py-3",
          scrolled ? "bg-primary-deep/90 backdrop-blur-2xl border-white/10 shadow-2xl" : "bg-black/40 backdrop-blur-md border-white/10"
        )}>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0 z-10" onClick={() => setMobileMenuOpen(false)}>
            {!logoError ? (
              <Image
                src="/logo.png"
                alt="Dynamics Global Logo"
                width={180}
                height={48}
                className="object-contain h-10 md:h-12 w-auto transition-transform group-hover:scale-105"
                priority
                unoptimized
                onError={() => setLogoError(true)}
              />
            ) : (
              <>
                <div className="w-9 h-9 shrink-0 bg-accent-amber rounded-xl flex items-center justify-center font-black text-primary-deep text-sm shadow-[0_0_20px_rgba(245,158,11,0.3)]">DG</div>
                <div className="flex flex-col">
                  <span className="text-base md:text-lg font-black tracking-tighter text-white uppercase font-outfit">DYNAMICS <span className="text-accent-amber">GLOBAL</span></span>
                  <span className="text-[7px] font-black text-slate-500 tracking-widest uppercase opacity-70 hidden sm:block">Industrial Infrastructure</span>
                </div>
              </>
            )}
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={link.highlight
                  ? "text-accent-amber hover:text-white transition-colors"
                  : "hover:text-accent-amber transition-colors"}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="w-px h-5 bg-white/10" />
            {isClientLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-3 group focus:outline-none"
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-amber to-orange-500 flex items-center justify-center font-black text-primary-deep text-sm shadow-[0_0_20px_rgba(245,158,11,0.3)] group-hover:scale-105 transition-transform border-2 border-white/10 group-hover:border-accent-amber/50">
                      {clientEmail ? clientEmail.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-primary-deep rounded-full shadow-lg" />
                  </div>
                  <ChevronDown size={14} className={cn("text-slate-500 transition-transform hidden sm:block", showDropdown && "rotate-180")} />
                </button>
                
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-60 glass-panel p-2 shadow-2xl z-[1001] bg-primary-deep/95 backdrop-blur-3xl border border-white/10 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-white/5 mb-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Authenticated User</p>
                        <p className="text-[11px] font-black text-white truncate">{clientEmail}</p>
                      </div>
                      
                      <Link href="/client" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                        <LayoutDashboard size={14} /> My Dashboard
                      </Link>
                      <Link href="/client#projects" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                        <FolderCheck size={14} /> Active Projects
                      </Link>
                      <div className="h-px bg-white/5 my-2" />
                      <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500/70 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all">
                        <LogOut size={14} /> Terminate Session
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/client/login" className="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center gap-2">
                <Cpu size={13} className="text-accent-amber shrink-0" /> Client Area
              </Link>
            )}
            <Link href="/admin" className="px-5 py-2 bg-accent-amber text-primary-deep rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <LayoutDashboard size={13} className="shrink-0" /> HQ
            </Link>
          </div>

          {/* Mobile Right Side: CTA + Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <Link href="/client/login" className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-wider text-white hover:bg-white/10 transition-all flex items-center gap-1.5">
              <Cpu size={12} className="text-accent-amber shrink-0" /> Client
            </Link>
            <Link href="/admin" className="px-3 py-1.5 bg-accent-amber text-primary-deep rounded-full text-[9px] font-black uppercase tracking-wider hover:scale-105 transition-all flex items-center gap-1.5">
              <LayoutDashboard size={12} className="shrink-0" /> HQ
            </Link>
            {/* Hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="ml-1 w-9 h-9 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-Down Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[998] lg:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed top-20 left-4 right-4 z-[999] lg:hidden bg-primary-deep/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-4 space-y-1">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center w-full px-5 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all",
                      link.highlight
                        ? "text-accent-amber hover:bg-accent-amber/10"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="h-px bg-white/5 my-2" />

                {isClientLoggedIn ? (
                  <>
                    <Link href="/client" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 w-full px-5 py-4 rounded-xl text-sm font-black uppercase tracking-widest text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                      <LayoutDashboard size={16} className="text-accent-amber" /> My Dashboard
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-5 py-4 rounded-xl text-sm font-black uppercase tracking-widest text-red-400 hover:text-red-500 hover:bg-red-500/5 transition-all">
                      <LogOut size={16} /> Sign Out
                    </button>
                  </>
                ) : (
                  <Link href="/client/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 w-full px-5 py-4 rounded-xl text-sm font-black uppercase tracking-widest text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                    <Cpu size={16} className="text-accent-amber" /> Client Area
                  </Link>
                )}
              </div>

              {/* Bottom amber bar accent */}
              <div className="h-1 w-full bg-gradient-to-r from-transparent via-accent-amber/60 to-transparent" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

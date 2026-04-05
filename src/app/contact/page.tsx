'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin, Phone, Mail, Globe, ArrowRight, Send,
  Building2, Clock, CheckCircle2, ExternalLink,
  Shield, MessageSquare, ChevronRight, Zap, Share2
} from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', message: '', service: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setSubmitted(true);
      } else {
        alert(data.message || 'Transmission failed. Contact HQ directly.');
      }
    } catch (err) {
      console.error('Contact Form Error:', err);
      alert('System Error: Unable to reach security gateway.');
    } finally {
      setLoading(false);
    }
  };

  const contactPoints = [
    {
      icon: MapPin,
      label: 'Headquarters',
      value: 'Rajasthan, India',
      sub: 'Industrial Logistics HQ',
      color: 'text-accent-amber',
      bg: 'bg-accent-amber/10',
    },
    {
      icon: Mail,
      label: 'Business Email',
      value: 'info@dynamicsglobal.in',
      sub: 'Response within 24hrs',
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      href: 'mailto:info@dynamicsglobal.in',
    },
    {
      icon: Phone,
      label: 'Direct Line',
      value: '+91 99500 94707',
      sub: 'Mon–Sat, 9AM–7PM IST',
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      href: 'tel:+919950094707',
    },
    {
      icon: Globe,
      label: 'Global Operations',
      value: 'India · UAE · USA · China',
      sub: '4 active international hubs',
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
    },
  ];

  const services = ['Mining Infrastructure', 'Mega Construction', 'Global Logistics', 'Warehouse Solutions', 'Other'];

  return (
    <main className="min-h-screen bg-primary-deep text-white overflow-x-hidden">

      {/* ── HERO HEADER ── */}
      <section className="relative py-24 md:py-40 overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-accent-amber/5 rounded-full blur-[180px] -ml-64 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-3 text-accent-amber mb-6">
              <div className="w-8 h-px bg-accent-amber/50" />
              <span className="text-[10px] font-black uppercase tracking-[0.6em]">Contact · HQ Uplink</span>
            </div>
            <h1 className="text-5xl sm:text-7xl lg:text-[9rem] font-black tracking-tighter uppercase leading-none mb-6">
              Let's <br /><span className="text-accent-amber italic">Connect</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl font-medium leading-relaxed border-l-4 border-accent-amber/40 pl-6">
              Whether you have a tender, a partnership, or simply want to know what Dynamics Global can do for your next industrial project — we're here.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CONTACT GRID ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

        {/* ───── LEFT PANEL ───── */}
        <div className="lg:col-span-5 space-y-10">

          {/* CEO Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="glass-panel p-0 overflow-hidden border-white/5 relative"
          >
            {/* Top amber stripe */}
            <div className="h-1 w-full bg-gradient-to-r from-accent-amber via-orange-400 to-transparent" />

            <div className="p-8 md:p-10 flex flex-col sm:flex-row items-start gap-8">
              {/* Photo */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-[0_0_40px_rgba(245,158,11,0.15)]">
                <Image
                  src="/images/ceo1.png"
                  alt="Piyush Khatri – Founder & CEO"
                  fill
                  className="object-cover object-top"
                  sizes="144px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/50 to-transparent" />
              </div>

              {/* Info */}
              <div className="space-y-4 flex-1">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-[0.5em] text-accent-amber block mb-1">Executive Leadership</span>
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-none">Piyush Khatri</h2>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic mt-1">Founder & CEO</p>
                </div>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  10+ years driving large-scale industrial projects and international partnerships across India, UAE, and the USA.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                    className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-400 transition-all text-slate-500">
                    <ExternalLink size={16} />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                    className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-sky-500/10 hover:border-sky-500/30 hover:text-sky-400 transition-all text-slate-500">
                    <Share2 size={16} />
                  </a>
                  <a href="mailto:piyush@dynamicsglobal.in"
                    className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-accent-amber/10 hover:border-accent-amber/30 hover:text-accent-amber transition-all text-slate-500">
                    <Mail size={16} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Points */}
          <div className="space-y-4">
            {contactPoints.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
              >
                {c.href ? (
                  <a href={c.href} className="glass-panel p-5 border-white/5 hover:border-accent-amber/20 transition-all flex items-center gap-5 group cursor-pointer block">
                    <div className={`w-12 h-12 rounded-2xl ${c.bg} flex items-center justify-center shrink-0 ${c.color}`}>
                      <c.icon size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600 mb-0.5">{c.label}</p>
                      <p className={`font-black text-base ${c.color} truncate`}>{c.value}</p>
                      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{c.sub}</p>
                    </div>
                    <ChevronRight size={16} className="text-slate-700 group-hover:text-accent-amber group-hover:translate-x-1 transition-all shrink-0" />
                  </a>
                ) : (
                  <div className="glass-panel p-5 border-white/5 flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl ${c.bg} flex items-center justify-center shrink-0 ${c.color}`}>
                      <c.icon size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600 mb-0.5">{c.label}</p>
                      <p className={`font-black text-base ${c.color}`}>{c.value}</p>
                      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{c.sub}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Map embed placeholder with gradient */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-panel overflow-hidden border-white/5 relative h-56 rounded-2xl"
          >
            <iframe
              title="Dynamics Global HQ Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1823609.095729!2d72.68984!3d27.024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c3c0000000001%3A0x1!2sRajasthan%2C+India!5e0!3m2!1sen!2sin!4v1700000000000"
              width="100%"
              height="220"
              style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(1.1) brightness(0.4)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-deep via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-amber animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-accent-amber">Rajasthan, India · HQ Active</span>
            </div>
          </motion.div>

          {/* Credentials strip */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Shield, label: 'ISO 9001:2015', sub: 'Certified' },
              { icon: Building2, label: '70+ Projects', sub: 'Delivered' },
              { icon: Clock, label: '24/7 Support', sub: 'Available' },
            ].map((b, i) => (
              <div key={i} className="glass-panel p-4 text-center border-white/5">
                <b.icon className="mx-auto mb-2 text-accent-amber" size={20} />
                <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">{b.label}</p>
                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1">{b.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ───── RIGHT PANEL: FORM ───── */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="glass-panel border-white/5 overflow-hidden"
          >
            {/* Form header */}
            <div className="p-8 md:p-10 border-b border-white/5 bg-gradient-to-r from-accent-amber/5 to-transparent">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent-amber rounded-2xl flex items-center justify-center font-black text-primary-deep shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                  <MessageSquare size={22} />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight">Send a Secure Message</h3>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Encrypted · Direct to HQ</p>
                </div>
              </div>
            </div>

            {submitted ? (
              <div className="p-12 md:p-20 flex flex-col items-center justify-center text-center gap-8 min-h-[500px]">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center"
                >
                  <CheckCircle2 size={40} className="text-emerald-400" />
                </motion.div>
                <div>
                  <h3 className="text-3xl font-black uppercase tracking-tight mb-2">Transmission Received</h3>
                  <p className="text-slate-400 font-medium">Your message has been securely delivered to Dynamics Global HQ. We typically respond within 24 business hours.</p>
                </div>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', company: '', email: '', phone: '', message: '', service: '' }); }}
                  className="btn-primary py-4 px-10 text-sm"
                >
                  Send Another Message <ArrowRight size={18} className="ml-2" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
                {/* Row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">Full Name *</label>
                    <input
                      required name="name" value={form.name} onChange={handleChange}
                      placeholder="Your name"
                      className="input-field w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">Company / Organisation</label>
                    <input
                      name="company" value={form.company} onChange={handleChange}
                      placeholder="Company name"
                      className="input-field w-full"
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">Email Address *</label>
                    <input
                      required type="email" name="email" value={form.email} onChange={handleChange}
                      placeholder="you@company.com"
                      className="input-field w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">Phone Number</label>
                    <input
                      type="tel" name="phone" value={form.phone} onChange={handleChange}
                      placeholder="+91 99500 94707"
                      className="input-field w-full"
                    />
                  </div>
                </div>

                {/* Service */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">Area of Interest</label>
                  <select name="service" value={form.service} onChange={handleChange} className="input-field w-full">
                    <option value="">Select a service sector</option>
                    {services.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">Message / Project Brief *</label>
                  <textarea
                    required name="message" value={form.message} onChange={handleChange}
                    rows={5} placeholder="Describe your project or inquiry..."
                    className="input-field w-full resize-none"
                  />
                </div>

                {/* Privacy note */}
                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                  <Shield size={12} className="text-accent-amber shrink-0" />
                  All submissions are encrypted and kept strictly confidential.
                </p>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center py-5 text-sm shadow-[0_0_50px_rgba(245,158,11,0.2)] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-primary-deep/40 border-t-primary-deep rounded-full animate-spin mr-3" />
                      TRANSMITTING TO HQ...
                    </>
                  ) : (
                    <>SEND MESSAGE <Send size={18} className="ml-3" /></>
                  )}
                </button>

                {/* Quick links */}
                <div className="pt-4 border-t border-white/5 flex flex-wrap items-center gap-4">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Quick Access:</span>
                  <Link href="/services/initiation" className="text-[9px] font-black uppercase tracking-widest text-accent-amber hover:text-white transition-colors flex items-center gap-1">
                    <Zap size={10} /> Submit Tender
                  </Link>
                  <Link href="/client/login" className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                    <ArrowRight size={10} /> Client Portal
                  </Link>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
}

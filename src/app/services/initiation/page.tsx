'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  FileCheck, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  CheckCircle2, 
  Globe,
  Database,
  Briefcase,
  FileBox,
  AlertCircle,
  FileSignature
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function InitiationFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialType = searchParams.get('type') || 'Mining Operations';

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    // Step 1: Entity Information
    companyName: '',
    registrationId: '',
    industry: initialType,
    headquarters: '',
    
    // Step 2: Authorized Personnel
    primaryContact: '',
    corporateEmail: '',
    phone: '',
    role: '',

    // Step 3: Project Scope & Location
    siteLocation: '',
    coordinates: '',
    projectType: initialType,
    workDescription: '',

    // Step 4: Commercial Details
    timeline: '24 Months',
    budgetRange: '5M - 20M',
    paymentTerms: 'Milestone Based',

    // Step 5: Legal & Documentation
    fileUrl: '',
    fileName: '',
    complianceAgreed: false
  });

  const steps = [
    { id: 1, label: 'Entity Profile', icon: Building2 },
    { id: 2, label: 'Signatory', icon: Briefcase },
    { id: 3, label: 'Mission Scope', icon: MapPin },
    { id: 4, label: 'Commercials', icon: Database },
    { id: 5, label: 'Submission', icon: FileSignature },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const data = new FormData();
    data.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: data });
      const result = await res.json();
      if (result.success) {
        setFormData({ ...formData, fileUrl: result.fileUrl, fileName: result.fileName });
        setError('');
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (err) {
      setError('System Error: Payload verification failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.fileUrl) {
      setError('CRITICAL: Technical documentation is mandatory for tender submission.');
      return;
    }
    
    setIsSubmitting(true);
    const requestData = {
      id: `TDR-${Date.now().toString().slice(-6)}`,
      ...formData,
      status: 'Pending',
      timestamp: new Date().toISOString()
    };

    try {
      await fetch('/api/data/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      setSuccess(true);
    } catch (err) {
      setError('Transmission Error: Gateway timeout');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-8">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel p-16 max-w-2xl border-t-4 border-emerald-500">
          <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} className="text-emerald-500" />
          </div>
          <h1 className="text-5xl font-black mb-4 uppercase tracking-tighter">Tender Logged</h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            Your official tender submission has been encrypted and assigned Reference ID: <span className="text-white font-mono font-black italic">REQ-{Date.now().toString().slice(-4)}</span>. 
            Our regional evaluation board will review the documentation within 12 business hours.
          </p>
          <div className="flex gap-4 justify-center">
             <button onClick={() => router.push('/client')} className="btn-primary">
                VIEW SUBMISSION STATUS
             </button>
             <button onClick={() => router.push('/')} className="px-8 py-4 bg-white/5 border border-white/10 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                EXIT TERMINAL
             </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 pb-32">
      <header className="mb-20 pt-16 border-b border-white/5 pb-12">
         <div className="flex items-center gap-3 text-accent-amber mb-6">
            <FileBox size={24} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Tender Submission Protocol 2.1</span>
         </div>
         <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter uppercase leading-none">Official <br /><span className="text-accent-amber not-italic">Tender</span></h1>
      </header>

      <div className="grid grid-cols-12 gap-20">
        {/* Progress Matrix */}
        <div className="col-span-12 lg:col-span-3 space-y-12">
          <nav className="space-y-4">
            {steps.map((s) => (
              <div key={s.id} className={cn(
                "flex items-center gap-6 p-4 rounded-2xl transition-all border",
                step === s.id ? "bg-accent-amber/5 border-accent-amber/20 text-white" : 
                step > s.id ? "bg-white/[0.02] border-white/5 text-slate-500" : "border-transparent text-slate-700"
              )}>
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                  step === s.id ? "bg-accent-amber text-primary-deep shadow-[0_0_15px_rgba(245,158,11,0.3)]" : 
                  step > s.id ? "bg-white/10 text-white" : "bg-white/5"
                )}>
                  <s.icon size={18} />
                </div>
                <div>
                   <p className="text-[8px] font-black uppercase tracking-widest opacity-50 mb-0.5">Phase 0{s.id}</p>
                   <p className="text-[10px] font-black uppercase tracking-widest leading-none">{s.label}</p>
                </div>
              </div>
            ))}
          </nav>

          <div className="glass-panel p-8 bg-blue-500/5 border-blue-500/10">
             <AlertCircle className="text-blue-500 mb-4" size={24} />
             <h4 className="text-xs font-black uppercase tracking-widest mb-2">Legal Notice</h4>
             <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase tracking-wider">
                All data transmitted through this portal is subject to Non-Disclosure Agreements (NDA) under Dynamics Global infrastructure policy.
             </p>
          </div>
        </div>

        {/* Main Interface Area */}
        <div className="col-span-12 lg:col-span-9">
          <div className="glass-panel p-12 min-h-[500px] flex flex-col justify-between border-white/5">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="st1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="col-span-2 space-y-3">
                      <label className="text-[9px] font-black text-accent-amber uppercase tracking-widest">Registered Entity Name (Full Legal Name)</label>
                      <input type="text" className="input-field py-5 text-lg" placeholder="e.g., Rio Tinto Global Operations" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-accent-amber uppercase tracking-widest">Business License / Tax Registration ID</label>
                      <input type="text" className="input-field" placeholder="Tax/Corp ID" value={formData.registrationId} onChange={e => setFormData({...formData, registrationId: e.target.value})} />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-accent-amber uppercase tracking-widest">Industry Classification</label>
                      <select className="input-field" value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})}>
                        <option>Mining Operations</option>
                        <option>Heavy Construction</option>
                        <option>Global Logistics</option>
                        <option>Warehouse Infrastructure</option>
                      </select>
                    </div>
                    <div className="col-span-2 space-y-3">
                      <label className="text-[9px] font-black text-accent-amber uppercase tracking-widest">Corporate Headquarters Address</label>
                      <input type="text" className="input-field" placeholder="Primary Operations Base" value={formData.headquarters} onChange={e => setFormData({...formData, headquarters: e.target.value})} />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="st2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="col-span-2 space-y-3">
                      <label className="text-[9px] font-black text-accent-amber uppercase tracking-widest">Primary Contact Person (Authorized Signatory)</label>
                      <input type="text" className="input-field py-5 text-lg" placeholder="Full Legal Name" value={formData.primaryContact} onChange={e => setFormData({...formData, primaryContact: e.target.value})} />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-accent-amber uppercase tracking-widest">Direct Corporate Email</label>
                      <input type="email" className="input-field" placeholder="operator@company.com" value={formData.corporateEmail} onChange={e => setFormData({...formData, corporateEmail: e.target.value})} />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-accent-amber uppercase tracking-widest">Encrypted Direct Line</label>
                      <input type="tel" className="input-field" placeholder="+X (XXX) XXX-XXXX" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
                    <div className="col-span-2 space-y-3">
                      <label className="text-[9px] font-black text-accent-amber uppercase tracking-widest">Executive Role / Designation</label>
                      <input type="text" className="input-field" placeholder="e.g. Director of Global Infrastructure" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="st3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="col-span-2 space-y-3">
                      <label className="text-[9px] font-black text-accent-amber uppercase tracking-widest">Primary Work Location (Site Region)</label>
                      <input type="text" className="input-field" placeholder="Region / Province / Country" value={formData.siteLocation} onChange={e => setFormData({...formData, siteLocation: e.target.value})} />
                    </div>
                    <div className="col-span-2 space-y-3">
                      <label className="text-[9px] font-black text-accent-amber uppercase tracking-widest">Site Coordinates (Lat, Long)</label>
                      <input type="text" className="input-field" placeholder="e.g. 24.5712, 73.6915" value={formData.coordinates} onChange={e => setFormData({...formData, coordinates: e.target.value})} />
                    </div>
                    <div className="col-span-2 space-y-3">
                       <label className="text-[9px] font-black text-accent-amber uppercase tracking-widest">Detailed Scope of Work & Requirements</label>
                       <textarea rows={8} className="input-field resize-none leading-relaxed" placeholder="Provide a comprehensive technical summary of required machinery, manpower, logistical constraints, and infrastructure goals..." value={formData.workDescription} onChange={e => setFormData({...formData, workDescription: e.target.value})} />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="st4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-accent-amber uppercase tracking-widest">Operational Timeline (Months)</label>
                      <select className="input-field" value={formData.timeline} onChange={e => setFormData({...formData, timeline: e.target.value})}>
                        <option>12 Months</option>
                        <option>24 Months</option>
                        <option>36 Months</option>
                        <option>60 Months+</option>
                        <option>Indefinite Project</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-accent-amber uppercase tracking-widest">Budget Valuation LTSC (USD Equivalent)</label>
                      <select className="input-field" value={formData.budgetRange} onChange={e => setFormData({...formData, budgetRange: e.target.value})}>
                        <option>1M - 5M</option>
                        <option>5M - 20M</option>
                        <option>20M - 50M</option>
                        <option>50M - 200M</option>
                        <option>200M+</option>
                      </select>
                    </div>
                    <div className="col-span-2 space-y-3">
                      <label className="text-[9px] font-black text-accent-amber uppercase tracking-widest">Proposed Settlement Structure</label>
                      <div className="grid grid-cols-3 gap-4">
                         {['Milestone Based', 'Annually (LTSC)', 'Advance Settlement'].map((opt) => (
                           <button 
                            key={opt}
                            onClick={() => setFormData({...formData, paymentTerms: opt})}
                            className={cn(
                              "p-4 border text-[10px] font-black uppercase tracking-widest transition-all rounded-xl",
                              formData.paymentTerms === opt ? "bg-accent-amber text-primary-deep border-accent-amber" : "bg-white/5 border-white/5 text-slate-500 hover:border-white/10"
                            )}
                           >
                             {opt}
                           </button>
                         ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div key="st5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                  <div className="glass-panel p-10 bg-white/[0.01] border-dashed border-2 border-white/10">
                    <div className="flex items-center gap-6 mb-10">
                      <div className="p-5 bg-accent-amber/10 rounded-2xl">
                        <FileCheck className="text-accent-amber" size={40} />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black italic uppercase tracking-tight">Technical Tender Pack</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Upload Mandatory Project RFP / Site Data Pack (PDF/ZIP)</p>
                      </div>
                    </div>

                    <div className="relative">
                      <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                      <div className={cn(
                        "border-2 border-dashed rounded-[2rem] p-16 flex flex-col items-center transition-all bg-white/[0.01]",
                        isUploading ? "border-accent-amber" : formData.fileUrl ? "border-emerald-500/30" : "border-white/5 hover:border-white/10"
                      )}>
                        {formData.fileName ? (
                          <div className="flex flex-col items-center gap-4">
                            <div className="p-4 bg-emerald-500/10 rounded-full">
                               <CheckCircle2 className="text-emerald-500" size={32} />
                            </div>
                            <span className="text-sm font-black text-emerald-500 tracking-tight uppercase italic">{formData.fileName}</span>
                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Ready for Transmission</span>
                          </div>
                        ) : isUploading ? (
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-white/5 border-t-accent-amber rounded-full animate-spin mb-6" />
                            <span className="text-[10px] font-black uppercase text-accent-amber tracking-[0.3em]">Scrubbing Payload...</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="text-slate-700 mb-6" size={56} />
                            <p className="font-black text-base uppercase tracking-[0.3em] mb-2">Transmit Data Pack</p>
                            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Maximum Secure Payload: 25.0 MB</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <label className="flex items-start gap-6 p-6 rounded-[1.5rem] bg-white/[0.02] border border-white/5 hover:border-accent-amber/10 transition-all cursor-pointer group">
                    <input type="checkbox" className="mt-1 w-6 h-6 rounded-lg accent-accent-amber bg-white/5 border-white/10" checked={formData.complianceAgreed} onChange={e => setFormData({...formData, complianceAgreed: e.target.checked})} />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-relaxed group-hover:text-slate-200">
                      I officially verify that all submitted documentation is accurate and legally binding. I authorize Dynamics Global to perform a Stage-1 technical feasibility study on the provided coordinates and scope. All transmissions are subject to the Master Service Agreement.
                    </span>
                  </label>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-12">
               {error && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-[10px] font-black uppercase tracking-widest">
                    <AlertCircle size={16} /> {error}
                 </motion.div>
               )}

               <div className="flex gap-4 border-t border-white/5 pt-12">
                  {step > 1 && (
                    <button 
                      onClick={() => setStep(step - 1)}
                      className="px-12 py-5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 transition-all text-slate-500 hover:text-white"
                    >
                      <ChevronLeft size={18} /> BACK PHASE
                    </button>
                  )}
                  
                  {step < 5 ? (
                    <button 
                      onClick={() => setStep(step + 1)}
                      className="btn-primary flex-1 justify-center group rounded-full text-[10px] tracking-[0.3em]"
                    >
                      CONTINUE PROTOCOL <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <button 
                      disabled={!formData.complianceAgreed || isSubmitting || isUploading}
                      onClick={handleSubmit}
                      className={cn(
                        "btn-primary flex-1 justify-center rounded-full text-[10px] tracking-[0.5em]",
                        (!formData.complianceAgreed || isSubmitting || isUploading) && "opacity-30 cursor-not-allowed grayscale"
                      )}
                    >
                      {isSubmitting ? "ENCRYPTING & TRANSMITTING..." : "FINALIZE TENDER SUBMISSION"}
                    </button>
                  )}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InitiationPage() {
  return (
    <main className="min-h-screen bg-primary-deep text-white">
      <Suspense fallback={<div className="h-[60vh] flex items-center justify-center"><div className="w-12 h-12 border-4 border-white/10 border-t-accent-amber rounded-full animate-spin" /></div>}>
        <InitiationFormContent />
      </Suspense>
    </main>
  );
}

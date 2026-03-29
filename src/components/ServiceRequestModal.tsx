'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, CheckCircle, ArrowRight, ShieldCheck, Briefcase, IndianRupee, MapPin } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ModalProps {
  service: string | null;
  onClose: () => void;
}

export default function ServiceRequestModal({ service, onClose }: ModalProps) {
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    clientName: '',
    email: '',
    phone: '',
    projectType: service || 'Mining',
    budgetRange: '1M - 5M',
    location: '',
    description: '',
    timeline: '12 Months',
    fileUrl: '',
    fileName: ''
  });

  if (!service) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const data = new FormData();
    data.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data
      });
      const result = await res.json();
      if (result.success) {
        setFormData({ ...formData, fileUrl: result.fileUrl, fileName: result.fileName });
      } else {
        alert(result.error || 'Upload failed');
      }
    } catch (err) {
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Map existing formData to match the Project Mongoose model
    const requestData = {
      companyName: formData.companyName,
      clientName: formData.clientName,
      email: formData.email,
      phone: formData.phone || "N/A", // Form doesn't ask for phone natively, so provide fallback
      projectType: formData.projectType,
      budget: formData.budgetRange,
      location: formData.location,
      description: formData.description,
    };

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      
      const result = await res.json();
      
      if (!res.ok || !result.success) {
        throw new Error(result.error || result.message || 'Failed to submit request');
      }

      alert('Request submitted successfully');
      
      // Reset form on success
      setFormData({
        companyName: '',
        clientName: '',
        email: '',
        phone: '',
        projectType: service || 'Mining',
        budgetRange: '1M - 5M',
        location: '',
        description: '',
        timeline: '12 Months',
        fileUrl: '',
        fileName: ''
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setStep(1);
      }, 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-primary-deep/90 backdrop-blur-2xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-8 border-b border-white/10 flex justify-between items-start bg-white/5">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-accent-amber/10 border border-accent-amber/20 text-accent-amber text-[10px] font-black tracking-widest rounded-full uppercase">
                Step 0{step} / 03
              </span>
              <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase">
                Service ID: {service.toUpperCase()}
              </span>
            </div>
            <h2 className="text-3xl font-black tracking-tight">PROJECT INITIATION</h2>
            <p className="text-slate-400 text-sm">Industrial Deployment Specification Form</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
          {success ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle size={80} className="text-emerald-500 mb-6" />
              <h3 className="text-3xl font-black mb-2">TRANSMISSION SECURE</h3>
              <p className="text-slate-400 max-w-md">Your project request has been logged into the Dynamics Global infrastructure. Corporate review typically completes within 4-6 hours.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-accent-amber tracking-widest uppercase">Registered Entity (Company)</label>
                      <input required type="text" className="input-field" placeholder="e.g. Rio Tinto Global" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-accent-amber tracking-widest uppercase">Primary Signatory</label>
                      <input required type="text" className="input-field" placeholder="Full Legal Name" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-accent-amber tracking-widest uppercase">Corporate Email</label>
                      <input required type="email" className="input-field" placeholder="operator@company.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div className="col-span-2 mt-4">
                      <button type="button" onClick={() => setStep(2)} className="btn-primary w-full justify-center group">
                        PROCEED TO SPECIFICATIONS <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-accent-amber tracking-widest uppercase">Valuation Range</label>
                      <select className="input-field appearance-none cursor-pointer" value={formData.budgetRange} onChange={e => setFormData({...formData, budgetRange: e.target.value})}>
                        <option value="50 Lakhs - 1.5 Cr">₹50,00,000 - ₹1,50,00,000</option>
                        <option value="1.5 Cr - 5 Cr">₹1,50,00,000 - ₹5,00,00,000</option>
                        <option value="5 Cr - 15 Cr">₹5,00,00,000 - ₹15,00,00,000</option>
                        <option value="15 Cr+">₹15,00,00,000+</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-accent-amber tracking-widest uppercase">Engagement Timeline</label>
                      <select className="input-field appearance-none cursor-pointer" value={formData.timeline} onChange={e => setFormData({...formData, timeline: e.target.value})}>
                        <option value="12 Months">12 Months (Pilot)</option>
                        <option value="24 Months">24 Months (Full Deployment)</option>
                        <option value="60 Months">60 Months (LTSC)</option>
                      </select>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-accent-amber tracking-widest uppercase">Geographic Deployment</label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input required type="text" className="input-field pl-12" placeholder="Country / Region / Coordinate Site" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                      </div>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-accent-amber tracking-widest uppercase">Technical Requirement Summary</label>
                      <textarea required rows={4} className="input-field resize-none" placeholder="Details of excavation, logistics or construction requirements..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                    </div>
                    <div className="col-span-2 flex gap-4 mt-4">
                      <button type="button" onClick={() => setStep(1)} className="px-8 py-3 bg-white/5 border border-white/10 rounded font-black tracking-widest uppercase hover:bg-white/10 transition-colors">Back</button>
                      <button type="button" onClick={() => setStep(3)} className="btn-primary flex-1 justify-center group">
                        PROCEED TO VERIFICATION <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                    <div className="p-6 bg-accent-amber/5 border border-accent-amber/10 rounded-lg">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-accent-amber/10 rounded-full">
                          <ShieldCheck className="text-accent-amber" size={24} />
                        </div>
                        <div>
                          <h4 className="font-black text-sm uppercase tracking-wider">Operational Documentation</h4>
                          <p className="text-slate-400 text-xs">PDF, PNG, or DOCX accepted (Max 10MB)</p>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        <div className={cn(
                          "border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-colors",
                          isUploading ? "border-accent-amber bg-accent-amber/5" : "border-white/10 hover:border-white/20"
                        )}>
                          {formData.fileName ? (
                            <div className="flex items-center gap-2 text-emerald-500 font-bold">
                              <CheckCircle size={20} /> {formData.fileName}
                            </div>
                          ) : isUploading ? (
                            <div className="flex flex-col items-center">
                              <div className="w-12 h-12 border-4 border-slate-500 border-t-accent-amber rounded-full animate-spin mb-4" />
                              <span className="text-xs font-black uppercase text-accent-amber tracking-widest">Encrypting Upload...</span>
                            </div>
                          ) : (
                            <>
                              <Upload className="text-slate-500 mb-3" size={32} />
                              <p className="text-sm font-bold text-slate-400">Drag files or click to browse</p>
                              <p className="text-[10px] text-slate-600 mt-1 uppercase font-black tracking-widest">Site Survey or RFP Document</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                       <label className="flex items-start gap-3 cursor-pointer group">
                          <input required type="checkbox" className="mt-1 w-4 h-4 rounded border-white/10" />
                          <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">
                            I hereby authorize Dynamics Global to conduct industrial feasibility studies on the provided site data. All information submitted is compliant with international corporate governance.
                          </span>
                       </label>
                    </div>

                    <div className="flex gap-4">
                      <button type="button" onClick={() => setStep(2)} className="px-8 py-3 bg-white/5 border border-white/10 rounded font-black tracking-widest uppercase hover:bg-white/10 transition-colors">Back</button>
                      <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 justify-center group relative overflow-hidden">
                        {isSubmitting ? "Submitting..." : "SUBMIT OFFICIAL REQUEST"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

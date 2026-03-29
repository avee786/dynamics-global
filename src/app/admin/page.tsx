'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Download, 
  Search, 
  Filter,
  IndianRupee,
  Briefcase,
  Users,
  ChevronRight,
  LogOut,
  Target,
  Globe,
  Database,
  XCircle,
  CreditCard,
  BarChart,
  Activity,
  Send,
  Shield,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('projects');
  const [editingProject, setEditingProject] = useState<any>(null);
  
  // Deployment Modal State
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [deployRequest, setDeployRequest] = useState<any>(null);
  const [deployForm, setDeployForm] = useState({
    budget: '',
    scope: '',
    milestones: [
      { desc: 'Project Initiation & Mobilisation', pct: '30%', status: 'Due on Signing' },
      { desc: 'Mid-Phase Completion', pct: '40%', status: 'Due at Milestone' },
      { desc: 'Final Delivery & Handover', pct: '30%', status: 'Due on Completion' }
    ]
  });

  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (!isLoggedIn) {
        router.push('/admin/login');
      } else {
        setAuthorized(true);
        fetchData();
      }
    };
    checkAuth();
  }, [router]);

  const fetchData = async () => {
    try {
      const [projRes, reqRes] = await Promise.all([
        fetch('/api/data/projects'),
        fetch('/api/data/requests')
      ]);
      const [projData, reqData] = await Promise.all([projRes.json(), reqRes.json()]);
      setProjects(projData);
      setRequests(reqData);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const openDeployModal = (request: any) => {
    setDeployRequest(request);
    setDeployForm({
       budget: request.budgetRange || '',
       scope: request.workDescription || request.description || '',
       milestones: [
          { desc: 'Project Initiation & Mobilisation', pct: '30%', status: 'Due on Signing' },
          { desc: 'Mid-Phase Completion', pct: '40%', status: 'Due at Milestone' },
          { desc: 'Final Delivery & Handover', pct: '30%', status: 'Due on Completion' }
       ]
    });
    setIsDeployModalOpen(true);
  };

  const finalizeDeployment = async () => {
     if (!deployRequest) return;
     setLoading(true);
     
     const newProject = {
       id: `PRJ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
       title: `${deployRequest.projectType || deployRequest.industry} - ${deployRequest.companyName}`,
       client: deployRequest.companyName,
       status: 'Ongoing',
       budget: deployForm.budget,
       location: deployRequest.siteLocation || 'GLOBAL Hub',
       startDate: new Date().toISOString().split('T')[0],
       progress: '5%',
       summary: deployForm.scope,
       duration: deployRequest.timeline,
       milestones: deployForm.milestones
     };

     try {
       // 1. Add to projects
       await fetch('/api/data/projects', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(newProject)
       });
       
       // 2. Remove from requests (Update status to 'Approved')
       await fetch('/api/data/requests', {
         method: 'PATCH',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ id: deployRequest.id, updates: { status: 'Approved' } })
       });

       setIsDeployModalOpen(false);
       await fetchData();
       
       // Trigger PDF generation
       generatePDF(newProject);
     } catch (err) {
       console.error('Deployment failed:', err);
       alert('Deployment failed');
     } finally {
       setLoading(false);
     }
  };

  const handleReject = async (request: any) => {
    if (!confirm('Are you sure you want to reject this tender submission?')) return;
    try {
      await fetch('/api/data/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: request.id, updates: { status: 'Rejected' } })
      });
      fetchData();
    } catch (err) {
      alert('Rejection failed');
    }
  };

  const updateProjectStatus = async (projectId: string, newStatus: string) => {
    const progressMap: any = {
      'Ongoing': '25%',
      'In Review': '50%',
      'Final Phase': '80%',
      'Completed': '100%'
    };

    try {
      await fetch('/api/data/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: projectId, 
          updates: { 
            status: newStatus, 
            progress: progressMap[newStatus] || '5%' 
          } 
        })
      });
      fetchData();
    } catch (err) {
      alert('Status update failed');
    }
  };

  const generatePDF = async (project: any) => {
    try {
      const resp = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`, // Prepped for JWT
        },
        body: JSON.stringify({ projectId: project._id || project.id })
      });

      if (!resp.ok) {
        throw new Error('Failed to assemble PDF from backend');
      }

      // Convert stream response into Blob
      const blob = await resp.blob();
      
      // Create a temporary hidden DOM link to prompt Download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `DG_Agreement_PRJ_${project._id || project.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup DOM
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Download Interrupted', e);
      alert('Unable to connect to internal PDF microservice.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/admin/login');
  };

  if (!authorized || loading) return (
    <div className="h-[60vh] w-full flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-white/5 border-t-accent-amber rounded-full animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen flex bg-primary-deep text-white">
      {/* Sidebar: Tactical Overview */}
      <aside className="w-80 border-r border-white/5 bg-white/[0.01] backdrop-blur-3xl p-10 flex flex-col fixed inset-y-8 left-8 h-[calc(100vh-4rem)] rounded-[2.5rem] z-50">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-amber/10 border border-accent-amber/20 rounded-full mb-4">
             <div className="w-1.5 h-1.5 rounded-full bg-accent-amber animate-pulse" />
             <span className="text-[8px] font-black text-accent-amber uppercase tracking-widest">Master Terminal</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic leading-none">Dynamics <br /><span className="text-accent-amber not-italic">HQ</span></h1>
        </div>

        <nav className="flex-1 space-y-4 font-outfit">
          {[
            { id: 'projects', icon: LayoutDashboard, label: 'Asset Ledger' },
            { id: 'requests', icon: PlusCircle, label: 'Tender Stream' },
            { id: 'clients', icon: Users, label: 'Entity Matrix' },
            { id: 'payments', icon: CreditCard, label: 'Settlements' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all",
                activeTab === item.id ? "bg-accent-amber text-primary-deep shadow-2xl" : "text-slate-500 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-12 flex items-center gap-4 px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-red-500/60 hover:text-red-500 hover:bg-red-500/5 rounded-2xl transition-all"
        >
          <LogOut size={18} />
          End Session
        </button>
      </aside>

      {/* Main Command Area */}
      <section className="flex-1 ml-[26rem] px-16 pb-32">
        <header className="mb-20 pt-16">
           <div className="flex justify-between items-end mb-16">
              <div>
                 <div className="flex items-center gap-3 text-accent-amber mb-6">
                    <Target size={24} />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em]">HQ Operational Hub v2.1</span>
                 </div>
                 <h2 className="text-7xl font-black tracking-tighter uppercase italic">{activeTab} <span className="text-accent-amber not-italic">Matrix</span></h2>
              </div>
              
              <div className="flex gap-4 items-center bg-white/[0.02] p-3 rounded-2xl border border-white/10">
                 <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="text" 
                      placeholder="SCAN ARCHIVES..." 
                      className="bg-transparent pl-12 pr-6 py-2 text-[10px] font-black uppercase tracking-widest outline-none border-0 focus:ring-0 w-64"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                 </div>
                 <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-slate-500">
                    <Filter size={18} />
                 </button>
              </div>
           </div>

           {/* Core Health Metrics */}
           <div className="grid grid-cols-4 gap-8">
              {[
                { label: 'Cumulative LTSC', value: '₹8.5+ Cr', icon: IndianRupee, color: 'text-emerald-500' },
                { label: 'Active Missions', value: projects.filter(p => p.status === 'Ongoing').length, icon: Activity, color: 'text-accent-amber' },
                { label: 'Awaiting Assessment', value: requests.filter(r => r.status === 'Pending').length, icon: AlertCircle, color: 'text-blue-500' },
                { label: 'Validated Success', value: projects.filter(p => p.status === 'Completed').length, icon: CheckCircle2, color: 'text-emerald-400' },
              ].map((stat, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="glass-panel p-10 hover:border-accent-amber/30 transition-all group relative overflow-hidden"
                >
                   <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <div className={cn("p-4 bg-white/5 rounded-2xl shadow-inner", stat.color)}>
                            <stat.icon size={26} />
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                      </div>
                      <p className="text-4xl font-black mb-1 group-hover:text-white transition-colors tracking-tighter">{stat.value}</p>
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">{stat.label}</p>
                   </div>
                   <div className="absolute -right-6 -bottom-6 opacity-[0.03] rotate-12 group-hover:scale-125 group-hover:opacity-[0.05] transition-all">
                      <stat.icon size={150} />
                   </div>
                </motion.div>
              ))}
           </div>
        </header>

        {/* Dynamic Matrix View */}
        <AnimatePresence mode="wait">
          {activeTab === 'projects' && (
            <motion.div key="projects" initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="glass-panel p-0 overflow-hidden border-white/5 shadow-2xl">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/[0.03] border-b border-white/10 text-[10px] font-black tracking-[0.4em] text-slate-500 uppercase italic">
                      <th className="px-12 py-10">Deployment Record</th>
                      <th>Phase Status</th>
                      <th>Regional Hub</th>
                      <th>Budget LTSC</th>
                      <th className="px-12 text-right">Admin Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-inter">
                    {projects.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase())).map((p, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.01] transition-colors group">
                        <td className="px-12 py-10">
                           <div className="flex items-center gap-6">
                              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-600 group-hover:text-accent-amber border border-white/5 transition-colors">
                                 <PlusCircle size={20} />
                              </div>
                              <div>
                                 <p className="font-extrabold text-base mb-1 group-hover:text-accent-amber transition-colors uppercase tracking-tight">{p.title}</p>
                                 <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest leading-none italic">{p.client} • {p.id}</p>
                              </div>
                           </div>
                        </td>
                        <td>
                           <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                 <div className={`w-2 h-2 rounded-full ${p.status === 'Completed' ? 'bg-emerald-500' : p.status === 'Ongoing' ? 'bg-accent-amber' : 'bg-blue-500'} animate-pulse`} />
                                 <select 
                                   value={p.status} 
                                   onChange={(e) => updateProjectStatus(p.id, e.target.value)}
                                   className="bg-transparent text-[10px] font-black uppercase tracking-widest text-slate-300 border-none outline-none focus:ring-0 cursor-pointer hover:text-white"
                                 >
                                    <option className="bg-primary-deep text-white">Ongoing</option>
                                    <option className="bg-primary-deep text-white">In Review</option>
                                    <option className="bg-primary-deep text-white">Final Phase</option>
                                    <option className="bg-primary-deep text-white">Completed</option>
                                 </select>
                              </div>
                              <div className="h-1 w-24 bg-white/10 rounded-full overflow-hidden">
                                 <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: p.progress || '5%' }} 
                                    className="h-full bg-accent-amber/50" 
                                 />
                              </div>
                           </div>
                        </td>
                        <td className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{p.location || 'GLOBAL Hub'}</td>
                        <td className="text-xs font-black text-slate-200 tracking-tight font-mono">{p.budget || '₹1.2 Cr LTSC'}</td>
                        <td className="px-12 text-right">
                           <div className="flex items-center justify-end gap-2">
                              <button 
                               onClick={() => generatePDF(p)}
                               className="p-4 bg-white/5 hover:bg-accent-amber/10 rounded-2xl text-slate-600 hover:text-accent-amber transition-all border border-white/5"
                               title="Generate Master Protocol PDF"
                              >
                                <FileText size={20} />
                              </button>
                              <button 
                               className="p-4 bg-white/5 hover:bg-emerald-500/10 rounded-2xl text-slate-600 hover:text-emerald-500 transition-all border border-white/5"
                               title="View Detailed Logs"
                              >
                                <Activity size={20} />
                              </button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </motion.div>
          )}

          {activeTab === 'requests' && (
            <motion.div key="requests" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              {requests.filter(r => r.status === 'Pending').length === 0 ? (
                <div className="glass-panel py-40 flex flex-col items-center justify-center border-dashed border-2 border-white/5 opacity-50 grayscale transition-all hover:opacity-100">
                   <AlertCircle size={80} className="mb-8 opacity-20 text-blue-500" />
                   <h4 className="text-2xl font-black uppercase tracking-tighter text-white">Operational Silence</h4>
                   <p className="font-black uppercase tracking-[0.5em] text-[10px] text-slate-600 mt-2">No active tender submissions in the stream</p>
                </div>
              ) : (
                requests.filter(r => r.status === 'Pending').map((req, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-12 grid grid-cols-12 gap-12 items-center hover:bg-white/[0.02] transition-all border-l-8 border-blue-500 relative overflow-hidden"
                  >
                    <div className="col-span-12 md:col-span-4 relative z-10">
                      <div className="flex items-center gap-3 mb-6">
                         <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest border border-blue-500/30 px-3 py-1 rounded-full bg-blue-500/5">{req.id}</span>
                         <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Awaiting HQ Command</span>
                      </div>
                      <h4 className="text-4xl font-black mb-1 tracking-tighter uppercase leading-none text-white italic">{req.companyName}</h4>
                      <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase">{req.primaryContact || req.clientName} • {req.corporateEmail || req.email}</p>
                    </div>
                    
                    <div className="col-span-6 md:col-span-3 space-y-4 border-l border-white/5 pl-10 relative z-10">
                       <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Mission Class</p>
                       <p className="font-extrabold text-base tracking-tight text-white uppercase italic">{req.projectType || req.industry}</p>
                       <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase">
                          <Globe size={14} className="text-accent-amber" /> {req.siteLocation || 'TBD'}
                       </div>
                    </div>

                    <div className="col-span-6 md:col-span-3 space-y-4 border-l border-white/5 pl-10 relative z-10">
                       <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Budget LTSC</p>
                       <p className="font-black text-base tracking-tighter text-emerald-500 uppercase italic font-mono">{req.budgetRange}</p>
                       <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          <Clock size={14} className="text-accent-amber" /> {req.timeline || 'TBD'}
                       </div>
                    </div>

                    <div className="col-span-12 md:col-span-2 flex flex-col justify-end gap-4 relative z-10">
                      <button 
                        onClick={() => openDeployModal(req)}
                        className="btn-primary py-4 px-6 text-[10px] tracking-[0.3em] font-black uppercase whitespace-nowrap shadow-2xl rounded-2xl justify-center"
                      >
                         DEPLOY PROJECT
                      </button>
                      <button 
                         onClick={() => handleReject(req)}
                         className="px-6 py-4 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-red-500 transition-all flex items-center justify-center gap-2"
                      >
                         <XCircle size={16} /> REJECT
                      </button>
                    </div>
                    
                    <div className="absolute -right-12 -bottom-12 opacity-[0.02] rotate-12 group-hover:rotate-0 transition-transform">
                       <Globe size={240} />
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Deployment Modal */}
      <AnimatePresence>
        {isDeployModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeployModalOpen(false)}
              className="absolute inset-0 bg-primary-deep/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="glass-panel w-full max-w-4xl p-12 border-l-4 border-accent-amber relative z-10 max-h-[90vh] overflow-y-auto"
            >
               <div className="flex justify-between items-start mb-12">
                  <div>
                    <h2 className="text-4xl font-black tracking-tighter uppercase italic">Finalize <span className="text-accent-amber">Agreement</span></h2>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2 border-l-2 border-accent-amber pl-4">Review mission parameters before mobilization</p>
                  </div>
                  <button 
                    onClick={() => setIsDeployModalOpen(false)}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all"
                  >
                    <XCircle size={24} className="text-slate-400" />
                  </button>
               </div>

               <div className="grid grid-cols-12 gap-12">
                  <div className="col-span-12 md:col-span-8 space-y-10">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-accent-amber uppercase tracking-widest block">Operational Scope of Work</label>
                        <textarea 
                          value={deployForm.scope}
                          onChange={(e) => setDeployForm({...deployForm, scope: e.target.value})}
                          rows={6}
                          className="input-field min-h-[150px] resize-none text-sm font-medium leading-relaxed"
                          placeholder="Detailed mission description..."
                        />
                     </div>

                     <div className="space-y-6">
                        <label className="text-[10px] font-black text-accent-amber uppercase tracking-widest block">Strategic Payment Milestones</label>
                        {deployForm.milestones.map((m, idx) => (
                           <div key={idx} className="flex gap-4 items-center bg-white/5 p-4 rounded-xl border border-white/5">
                              <div className="flex-1">
                                 <input 
                                   value={m.desc}
                                   onChange={(e) => {
                                      const newM = [...deployForm.milestones];
                                      newM[idx].desc = e.target.value;
                                      setDeployForm({...deployForm, milestones: newM});
                                   }}
                                   className="bg-transparent border-none text-[10px] font-bold text-white w-full uppercase"
                                 />
                                 <input 
                                   value={m.status}
                                   onChange={(e) => {
                                      const newM = [...deployForm.milestones];
                                      newM[idx].status = e.target.value;
                                      setDeployForm({...deployForm, milestones: newM});
                                   }}
                                   className="bg-transparent border-none text-[8px] font-black text-slate-500 w-full uppercase tracking-tighter"
                                 />
                              </div>
                              <input 
                                value={m.pct}
                                onChange={(e) => {
                                   const newM = [...deployForm.milestones];
                                   newM[idx].pct = e.target.value;
                                   setDeployForm({...deployForm, milestones: newM});
                                }}
                                className="w-16 bg-accent-amber/10 border border-accent-amber/20 text-accent-amber text-center font-black rounded p-2"
                              />
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="col-span-12 md:col-span-4 space-y-8">
                     <div className="bg-white/5 p-8 rounded-2xl border border-white/5 space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Client Identity</label>
                           <p className="text-xl font-black text-white italic">{deployRequest?.companyName}</p>
                        </div>
                        <div className="space-y-2 border-t border-white/5 pt-6">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Project Budget (LTSC)</label>
                           <div className="relative">
                              <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-amber" size={20} />
                              <input 
                                value={deployForm.budget}
                                onChange={(e) => setDeployForm({...deployForm, budget: e.target.value})}
                                className="input-field pl-12 text-2xl font-black text-accent-amber italic"
                              />
                           </div>
                        </div>
                        <div className="space-y-4 border-t border-white/5 pt-6">
                           <div className="flex items-center gap-3 text-slate-400">
                             <MapPin size={16} /> <span className="text-[10px] font-bold uppercase">{deployRequest?.siteLocation}</span>
                           </div>
                           <div className="flex items-center gap-3 text-slate-400">
                             <Clock size={16} /> <span className="text-[10px] font-bold uppercase">{deployRequest?.timeline}</span>
                           </div>
                        </div>
                     </div>

                     <button 
                       onClick={finalizeDeployment}
                       className="btn-primary w-full py-6 group justify-center text-sm"
                     >
                        FINALIZE & DEPLOY <Send size={20} className="ml-3 group-hover:translate-x-2 transition-all" />
                     </button>
                     <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest text-center mt-4">
                        Proceeding will generate a legally binding PDF agreement and establish project tracking.
                     </p>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

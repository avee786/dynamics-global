'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Target, Shield, Zap } from 'lucide-react';

export default function Services() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const services = [
    {
      title: "MINING OPERATIONS",
      description: "Comprehensive open-pit and underground mining solutions, including excavation, material handling, and site-specific engineering for large-scale minerals extraction.",
      image: "/images/mining.png",
      capabilities: ["Surface Mining", "Crushing & Screening", "Tailings Management", "Mineral Exploration"]
    },
    {
      title: "INFRASTRUCTURE & CONSTRUCTION",
      description: "End-to-end management of large-scale infrastructure projects including highways, industrial roads, bridges, and foundation earthwork.",
      image: "/images/construction.png",
      capabilities: ["Roadwork & Bridges", "Steel Plant Support", "Earth Moving Services", "Site Preparation"]
    },
    {
      title: "GLOBAL LOGISTICS & TRANSPORT",
      description: "Managing complex supply chain networks and heavy-duty transport fleets across international borders with specialized handling for industrial materials.",
      image: "/images/logistics.png",
      capabilities: ["Heavy Transport Fleet", "Warehouse Automation", "Supply Chain Management", "Port Operations"]
    }
  ];

  return (
    <main className="py-10 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h2 className="section-title text-4xl md:text-5xl lg:text-7xl">Industrial <span className="text-accent-amber">Capabilities</span></h2>
        
        <div className="space-y-16 md:space-y-24 mt-12 md:mt-20">
          {services.map((s, index) => (
            <div key={index} className={`flex flex-col-reverse ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-10 md:gap-16 items-center`}>
              <div className="flex-1 space-y-8">
                <div className="flex items-center gap-4 text-accent-amber mb-2">
                  {index === 0 ? <Target size={24} /> : index === 1 ? <Shield size={24} /> : <Zap size={24} />}
                  <span className="text-xs font-black uppercase tracking-[0.3em]">Module 0{index + 1}</span>
                </div>
                <h3 className="text-3xl sm:text-4xl md:text-5xl uppercase tracking-tighter italic font-black">{s.title}</h3>
                <p className="text-base md:text-lg text-slate-400 leading-relaxed font-medium">
                  {s.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                  {s.capabilities.map((c, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-300">
                      <ChevronRight size={16} className="text-accent-amber" /> {c.toUpperCase()}
                    </div>
                  ))}
                </div>
                
                <Link 
                  href={`/services/initiation?type=${encodeURIComponent(s.title)}`}
                  className="btn-primary"
                >
                  PROJECT INITIATION <ArrowRight size={18} />
                </Link>
              </div>

              <div className="w-full lg:w-[500px]">
                <div className="relative h-[300px] md:h-[500px] rounded-[2rem] md:rounded-3xl overflow-hidden glass-panel p-0 group">
                  <Image src={s.image} alt={s.title} fill className="object-cover object-center opacity-80 group-hover:scale-105 transition-transform duration-1000 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-8 left-8">
                    <div className="text-[10px] font-black uppercase tracking-widest text-accent-amber mb-2 opacity-70">Operational Status</div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Deployment Ready
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import API from '../api';
import type { Client } from '../types';

export default function OurClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const leftMarqueeRef = useRef<HTMLDivElement>(null);
  const rightMarqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    API.get('/clients?active=true')
      .then(({ data }) => {
        const list = data?.data || data;
        setClients(Array.isArray(list) ? list : []);
      })
      .catch((err) => console.error('Failed to fetch clients:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || clients.length === 0) return;

    const ctx = gsap.context(() => {
      const leftMarquee = leftMarqueeRef.current;
      const rightMarquee = rightMarqueeRef.current;

      const leftCount = Math.ceil(clients.length / 2);
      const rightCount = clients.length - leftCount;

      // Calculate duration dynamically to maintain constant speed
      const leftDuration = Math.max(leftCount * 4, 10);
      const rightDuration = Math.max(rightCount * 4, 10);

      if (leftMarquee) {
        gsap.to(leftMarquee, {
          xPercent: -50,
          duration: leftDuration,
          ease: 'none',
          repeat: -1,
        });
      }

      if (rightMarquee) {
        gsap.to(rightMarquee, {
          xPercent: -50,
          duration: rightDuration,
          ease: 'none',
          repeat: -1,
        });
      }
    });

    return () => ctx.revert();
  }, [loading, clients]);

  if (loading || clients.length === 0) return null;

  // Split clients into two groups for balance
  const leftCount = Math.ceil(clients.length / 2);
  const leftClients = clients.slice(0, leftCount);
  const rightClients = clients.slice(leftCount);

  return (
    <section className="py-24 md:py-32 bg-[#2A3F5C] text-white overflow-hidden relative">
      {/* Background decoration elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/10 w-[400px] h-[400px] bg-[#d4af37]/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/10 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h3 className="text-[#d4af37] uppercase tracking-widest text-sm font-bold mb-4">Our Network</h3>
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-wider">Our Clients</h2>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          
          {/* Left Column (Horizontal Marquee) */}
          <div className="col-span-1 lg:col-span-3 overflow-hidden relative bg-[#1D2B42]/50 border border-white/5 py-8 px-4 rounded-2xl shadow-xl">
            {/* Fade overlays */}
            <div className="absolute left-0 inset-y-0 w-8 bg-gradient-to-r from-[#1D2B42]/90 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 inset-y-0 w-8 bg-gradient-to-l from-[#1D2B42]/90 to-transparent z-10 pointer-events-none"></div>
            
            <div ref={leftMarqueeRef} className="flex gap-16 whitespace-nowrap w-max">
              {[...leftClients, ...leftClients].map((client, index) => (
                <span key={index} className="text-white text-lg md:text-xl font-semibold tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] flex-shrink-0"></span>
                  {client.name}
                </span>
              ))}
            </div>
          </div>

          {/* Center Column (Premium Image) */}
          <div className="col-span-1 lg:col-span-6 flex items-center justify-center">
            <div className="relative w-full h-[320px] md:h-[420px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop"
                alt="Luxury Estate Design"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1D2B42]/70 via-transparent to-transparent"></div>
            </div>
          </div>

          {/* Right Column (Horizontal Marquee) */}
          <div className="col-span-1 lg:col-span-3 overflow-hidden relative bg-[#1D2B42]/50 border border-white/5 py-8 px-4 rounded-2xl shadow-xl">
            {/* Fade overlays */}
            <div className="absolute left-0 inset-y-0 w-8 bg-gradient-to-r from-[#1D2B42]/90 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 inset-y-0 w-8 bg-gradient-to-l from-[#1D2B42]/90 to-transparent z-10 pointer-events-none"></div>

            <div ref={rightMarqueeRef} className="flex gap-16 whitespace-nowrap w-max">
              {[...rightClients, ...rightClients].map((client, index) => (
                <span key={index} className="text-white text-lg md:text-xl font-semibold tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] flex-shrink-0"></span>
                  {client.name}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

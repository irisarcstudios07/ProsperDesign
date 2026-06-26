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
      const leftDuration = Math.max(leftCount * 4.5, 12);
      const rightDuration = Math.max(rightCount * 4.5, 12);

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

  const renderHorizontalList = (list: Client[]) => (
    <div className="flex gap-16 px-4">
      {list.map((c) => (
        <span
          key={c._id}
          className="text-white text-lg md:text-xl font-semibold tracking-wider flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] flex-shrink-0"></span>
          {c.name}
        </span>
      ))}
    </div>
  );

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

        {/* Marquee Rows Container */}
        <div className="flex flex-col gap-8 max-w-5xl mx-auto">
          
          {/* Top Row Horizontal Marquee */}
          <div className="w-full overflow-hidden relative bg-[#1D2B42]/50 border border-white/5 py-6 rounded-2xl shadow-xl">
            {/* Fade overlays */}
            <div className="absolute left-0 inset-y-0 w-16 bg-gradient-to-r from-[#1D2B42]/90 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-[#1D2B42]/90 to-transparent z-10 pointer-events-none"></div>
            
            <div ref={leftMarqueeRef} className="flex whitespace-nowrap w-max">
              {renderHorizontalList(leftClients)}
              {renderHorizontalList(leftClients)}
            </div>
          </div>

          {/* Bottom Row Horizontal Marquee */}
          <div className="w-full overflow-hidden relative bg-[#1D2B42]/50 border border-white/5 py-6 rounded-2xl shadow-xl">
            {/* Fade overlays */}
            <div className="absolute left-0 inset-y-0 w-16 bg-gradient-to-r from-[#1D2B42]/90 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-[#1D2B42]/90 to-transparent z-10 pointer-events-none"></div>

            <div ref={rightMarqueeRef} className="flex whitespace-nowrap w-max">
              {renderHorizontalList(rightClients)}
              {renderHorizontalList(rightClients)}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

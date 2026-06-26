import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import API from '../api';
import type { Client } from '../types';

export default function OurClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const mobileTopRef = useRef<HTMLDivElement>(null);
  const mobileBottomRef = useRef<HTMLDivElement>(null);

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
      // 1. Desktop Vertical Marquees
      if (leftColRef.current) {
        const leftItems = leftColRef.current.children[0] as HTMLElement;
        if (leftItems) {
          const totalHeight = leftItems.offsetHeight;
          const speed = 35; // pixels per second
          const duration = totalHeight / speed;

          gsap.to(leftColRef.current, {
            y: -totalHeight,
            ease: 'none',
            repeat: -1,
            duration: duration > 0 ? duration : 15,
          });
        }
      }

      if (rightColRef.current) {
        const rightItems = rightColRef.current.children[0] as HTMLElement;
        if (rightItems) {
          const totalHeight = rightItems.offsetHeight;
          const speed = 35; // pixels per second
          const duration = totalHeight / speed;

          gsap.fromTo(rightColRef.current,
            { y: -totalHeight },
            {
              y: 0,
              ease: 'none',
              repeat: -1,
              duration: duration > 0 ? duration : 15,
            }
          );
        }
      }

      // 2. Mobile Horizontal Marquees
      if (mobileTopRef.current) {
        const firstChild = mobileTopRef.current.children[0] as HTMLElement;
        if (firstChild) {
          const topWidth = firstChild.getBoundingClientRect().width;
          const speed = 40; // pixels per second
          const duration = topWidth / speed;

          gsap.to(mobileTopRef.current, {
            x: -topWidth,
            ease: 'none',
            repeat: -1,
            duration: duration > 0 ? duration : 15,
          });
        }
      }

      if (mobileBottomRef.current) {
        const firstChild = mobileBottomRef.current.children[0] as HTMLElement;
        if (firstChild) {
          const bottomWidth = firstChild.getBoundingClientRect().width;
          const speed = 40; // pixels per second
          const duration = bottomWidth / speed;

          gsap.fromTo(mobileBottomRef.current,
            { x: -bottomWidth },
            {
              x: 0,
              ease: 'none',
              repeat: -1,
              duration: duration > 0 ? duration : 15,
            }
          );
        }
      }
    });

    return () => ctx.revert();
  }, [loading, clients]);

  if (loading || clients.length === 0) return null;

  // Split clients into two groups for balance
  const leftClients = clients.filter((_, i) => i % 2 === 0);
  const rightClients = clients.filter((_, i) => i % 2 !== 0);

  const renderClientList = (list: Client[]) => (
    <div className="flex flex-col gap-6 py-3">
      {list.map((c) => (
        <div
          key={c._id}
          className="flex items-center text-white text-base md:text-lg font-medium tracking-wide whitespace-nowrap bg-white/5 border border-white/5 px-6 py-4 rounded-xl shadow-lg"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 mr-4 shadow-[0_0_8px_rgba(34,197,94,0.6)] flex-shrink-0"></span>
          {c.name}
        </div>
      ))}
    </div>
  );

  const renderHorizontalList = (list: Client[]) => (
    <div className="flex gap-6 px-3">
      {list.map((c) => (
        <div
          key={c._id}
          className="flex items-center text-white text-sm md:text-base font-medium tracking-wide whitespace-nowrap bg-white/5 border border-white/5 px-5 py-3 rounded-xl shadow-lg flex-shrink-0"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 mr-3 shadow-[0_0_8px_rgba(34,197,94,0.6)] flex-shrink-0"></span>
          {c.name}
        </div>
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

        {/* Desktop & Tablet Layout */}
        <div className="hidden lg:grid grid-cols-12 gap-8 items-center max-w-6xl mx-auto h-[560px]">
          {/* Left Column (Scrolls Up) */}
          <div className="col-span-3 h-full overflow-hidden relative">
            {/* Fade overlays */}
            <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#2A3F5C] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#2A3F5C] to-transparent z-10 pointer-events-none"></div>

            <div ref={leftColRef} className="absolute w-full">
              {renderClientList(leftClients)}
              {renderClientList(leftClients)}
            </div>
          </div>

          {/* Center Image */}
          <div className="col-span-6 h-full flex items-center justify-center px-4">
            <div className="relative w-full h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop"
                alt="Luxury estate architecture design showcase"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1D2B42]/70 via-transparent to-transparent"></div>
            </div>
          </div>

          {/* Right Column (Scrolls Down) */}
          <div className="col-span-3 h-full overflow-hidden relative">
            {/* Fade overlays */}
            <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#2A3F5C] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#2A3F5C] to-transparent z-10 pointer-events-none"></div>

            <div ref={rightColRef} className="absolute w-full">
              {renderClientList(rightClients)}
              {renderClientList(rightClients)}
            </div>
          </div>
        </div>

        {/* Mobile & Small Screens Layout */}
        <div className="lg:hidden flex flex-col gap-8 max-w-xl mx-auto">
          {/* Top Horizontal Row */}
          <div className="w-full overflow-hidden relative">
            <div className="absolute left-0 inset-y-0 w-12 bg-gradient-to-r from-[#2A3F5C] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 inset-y-0 w-12 bg-gradient-to-l from-[#2A3F5C] to-transparent z-10 pointer-events-none"></div>

            <div ref={mobileTopRef} className="flex whitespace-nowrap w-max">
              {renderHorizontalList(leftClients)}
              {renderHorizontalList(leftClients)}
            </div>
          </div>

          {/* Center Image */}
          <div className="w-full px-4">
            <div className="relative w-full h-[280px] rounded-2xl overflow-hidden shadow-xl border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop"
                alt="Luxury estate mobile showcase"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Bottom Horizontal Row */}
          <div className="w-full overflow-hidden relative">
            <div className="absolute left-0 inset-y-0 w-12 bg-gradient-to-r from-[#2A3F5C] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 inset-y-0 w-12 bg-gradient-to-l from-[#2A3F5C] to-transparent z-10 pointer-events-none"></div>

            <div ref={mobileBottomRef} className="flex whitespace-nowrap w-max">
              {renderHorizontalList(rightClients)}
              {renderHorizontalList(rightClients)}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

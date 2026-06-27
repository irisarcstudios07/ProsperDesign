import { useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Service } from '../../types';

gsap.registerPlugin(ScrollTrigger);

interface ParentGridProps {
  parents: Service[];
  onSelect: (parent: Service) => void;
  sectionRef: React.RefObject<HTMLElement | null>;
  cardWidth?: number;
  gap?: number;
}

export default function ParentGrid({
  parents,
  onSelect,
  cardWidth = 900,
  gap = 60,
}: ParentGridProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pinWrapRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth < 1024) return;

    let ctx: gsap.Context | null = null;

    const init = () => {
      const track = trackRef.current;
      const pinWrap = pinWrapRef.current;
      if (!track || !pinWrap || track.children.length === 0) return;

      // Kill any existing ScrollTriggers scoped to this component
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.id === 'services-hscroll') t.kill();
      });

      const cards = Array.from(track.children) as HTMLElement[];
      if (cards.length === 0) return;

      const last = cards[cards.length - 1];

      // How far left we need to push the track so the LAST card is centered
      const endX = last.offsetLeft - (window.innerWidth - last.offsetWidth) / 2;

      ctx = gsap.context(() => {
        gsap.fromTo(
          track,
          { x: 0 },
          {
            x: -endX,
            ease: 'none',
            scrollTrigger: {
              id: 'services-hscroll',
              trigger: pinWrap,
              pin: true,
              pinSpacing: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              start: 'top top',
              end: () => `+=${endX}`,
            },
          }
        );
      });
    };

    // Wait for images to load before measuring offsetLeft
    const images = Array.from(trackRef.current?.querySelectorAll('img') || []);
    const allLoaded =
      images.length === 0 ||
      images.every((img) => img.complete && img.naturalWidth > 0);

    if (allLoaded) {
      // Small timeout to let layout settle
      const t = setTimeout(init, 120);
      return () => {
        clearTimeout(t);
        ctx?.revert();
      };
    }

    let resolved = 0;
    const onLoad = () => {
      resolved++;
      if (resolved >= images.length) init();
    };
    images.forEach((img) => {
      if (img.complete && img.naturalWidth > 0) {
        resolved++;
        if (resolved >= images.length) init();
      } else {
        img.addEventListener('load', onLoad);
        img.addEventListener('error', onLoad);
      }
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener('load', onLoad);
        img.removeEventListener('error', onLoad);
      });
      ctx?.revert();
    };
  }, [parents, cardWidth, gap]);

  /* ── Card renderer ─────────────────────────────────────── */
  const renderCard = (parent: Service, i: number, isDesktop = false) => {
    const childCount = parent.children?.length || 0;
    return (
      <motion.div
        key={parent._id || parent.title}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.08, duration: 0.5 }}
        whileHover={{ y: -6, scale: 1.015 }}
        onClick={() => onSelect(parent)}
        className={`service-card group relative overflow-hidden rounded-3xl cursor-pointer bg-[#1D2B42] shadow-2xl border border-white/10 ${
          isDesktop ? 'shrink-0' : 'w-full'
        }`}
        style={
          isDesktop
            ? {
                height: '72vh',
                maxHeight: '600px',
                minHeight: '400px',
                flex: '0 0 min(80vw, 900px)',
                width: 'min(80vw, 900px)',
                minWidth: '650px',
              }
            : {
                height: '460px',
              }
        }
      >
        <img
          src={parent.coverImage || '/placeholder-cover.jpg'}
          alt={parent.title}
          loading="eager"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1D2B42] via-[#1D2B42]/20 to-transparent flex flex-col justify-end p-8 md:p-12">
          <p className="text-[#d4af37] text-xs md:text-sm uppercase tracking-widest font-semibold mb-2">
            {childCount} {childCount === 1 ? 'Category' : 'Categories'}
          </p>
          <h4 className="text-3xl md:text-4xl font-bold text-white mb-3 uppercase tracking-wide leading-tight">
            {parent.title}
          </h4>
          <p className="text-[#d4af37] text-sm md:text-base uppercase tracking-widest font-semibold flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
            View Categories <span className="text-lg md:text-xl">→</span>
          </p>
        </div>
      </motion.div>
    );
  };

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <motion.div
      key="parent-grid-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* ── DESKTOP: full-viewport pin wrapper ─────────────── */}
      <div
        ref={pinWrapRef}
        className="hidden lg:flex items-center"
        style={{
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Desktop Header Overlay */}
        <div
          className="absolute top-12 left-0 px-16 z-10 pointer-events-none"
          style={{ maxWidth: '480px' }}
        >
          <p className="text-[#d4af37] uppercase tracking-widest text-xs font-bold mb-3">Our Expertise</p>
          <h2 className="text-5xl font-bold uppercase tracking-wider text-white mb-4 leading-tight">Services</h2>
          <p className="text-gray-300 font-light text-base">
            Explore our curated, luxury portfolio of custom craftsmanship.
          </p>
        </div>
        {/* ── Scrolling track ──────────────────────────────── */}
        <div
          ref={trackRef}
          className="services-track flex items-center"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: `${gap}px`,
            /*
             * Padding ensures the FIRST card is already horizontally centred
             * when the section gets pinned, and provides enough room on the
             * right so the LAST card can also reach centre before unpin.
             *
             * padding = (100vw - cardWidth) / 2
             * We use min(80vw, 900px) to mirror the card's own width formula.
             */
            paddingLeft: 'calc((100vw - min(80vw, 900px)) / 2)',
            paddingRight: 'calc((100vw - min(80vw, 900px)) / 2)',
            width: 'max-content',
            minWidth: '100vw',
            height: '100%',
            willChange: 'transform',
          }}
        >
          {parents.map((parent, i) => renderCard(parent, i, true))}
        </div>
      </div>

      {/* ── MOBILE / TABLET: plain vertical stack ──────────── */}
      <div className="lg:hidden flex flex-col gap-8 px-6 md:px-12 container mx-auto max-w-4xl">
        {parents.map((parent, i) => renderCard(parent, i, false))}
      </div>
    </motion.div>
  );
}

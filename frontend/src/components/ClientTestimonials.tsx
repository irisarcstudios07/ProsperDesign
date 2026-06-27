import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import API from '../api';

/* ── Types ─────────────────────────────────────────── */
interface Testimonial {
  _id?: string;
  clientName: string;
  service: string;
  message: string;
  rating: number;
  order?: number;
  visible?: boolean;
}

/* ── Default fallback data (shown while API loads) ── */
const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { clientName: 'PVR Group',            service: 'Exterior & Landscaping',    rating: 5, message: 'Our landscape and outdoor spaces were completed beautifully. The team maintained quality throughout the project and delivered everything on schedule.' },
  { clientName: 'Royal Icon',           service: 'Interior Designing',         rating: 5, message: 'The interior designing transformed our villa completely. Every detail was carefully planned and professionally executed.' },
  { clientName: 'PVR Classic',          service: 'Swimming Pools & Fountains', rating: 5, message: 'The swimming pool and surrounding landscape became the highlight of our property. Excellent execution and finishing.' },
  { clientName: 'SLV',                  service: 'EPDM Flooring',              rating: 5, message: 'The EPDM flooring installation was completed perfectly. Highly durable, clean finishing and timely delivery.' },
  { clientName: 'Hotel Crab',           service: 'Interior Designing',         rating: 5, message: 'Our hotel interiors now have a premium appearance. Guests frequently compliment the design and quality of craftsmanship.' },
  { clientName: 'Urban Meadows',        service: 'Exterior & Landscaping',     rating: 5, message: 'The landscaping work created a beautiful entrance for our community. Professional planning and flawless execution throughout.' },
  { clientName: 'Sky Towers',           service: 'Interior Designing',         rating: 5, message: 'The clubhouse interiors perfectly matched our expectations. Attention to detail was exceptional and timelines were respected.' },
  { clientName: 'Anandalahari',         service: 'Swimming Pools & Fountains', rating: 5, message: 'The water feature and fountain completely transformed our project. Very satisfied with the craftsmanship and finishing.' },
  { clientName: 'Pride',                service: 'Exterior & Landscaping',     rating: 5, message: 'The exterior stone work and retaining walls were finished with great precision. Highly recommend the team.' },
  { clientName: 'Himaja Constructions', service: 'Construction',               rating: 5, message: 'We have partnered on multiple projects. Reliable workmanship and excellent coordination throughout every engagement.' },
  { clientName: 'Sresta Constructions', service: 'Construction',               rating: 5, message: 'The construction support and finishing quality were consistently outstanding. A true professional team.' },
  { clientName: 'End Avenue Serene',    service: 'Exterior & Landscaping',     rating: 5, message: 'The landscape design added tremendous value to our residential project. Highly recommended for any premium estate.' },
];

/* ── Star renderer ──────────────────────────────────── */
function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 text-[#d4af37] text-base" aria-label={`${count} stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? 'text-[#d4af37]' : 'text-white/20'}>★</span>
      ))}
    </div>
  );
}

/* ── Individual Card ────────────────────────────────── */
function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div
      className="testimonial-card flex-shrink-0 mx-4 w-[340px] md:w-[380px] rounded-3xl border border-white/10 p-7 md:p-8 flex flex-col gap-4 select-none"
      style={{
        background: 'linear-gradient(135deg, rgba(49,74,109,0.85) 0%, rgba(42,63,92,0.70) 100%)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        {/* Avatar initials */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-black font-extrabold text-lg flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #d4af37 0%, #f0d060 100%)' }}
        >
          {t.clientName.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-base uppercase tracking-wide leading-tight truncate">
            {t.clientName}
          </h3>
          <span className="text-[#d4af37] text-xs uppercase tracking-widest font-semibold block mt-0.5 truncate">
            {t.service}
          </span>
        </div>
      </div>

      {/* Stars */}
      <Stars count={t.rating} />

      {/* Message */}
      <p className="text-gray-200 text-sm font-light leading-relaxed line-clamp-4 flex-1">
        "{t.message}"
      </p>

      {/* Bottom accent line */}
      <div className="h-px w-12 rounded-full" style={{ background: 'linear-gradient(90deg, #d4af37 0%, transparent 100%)' }} />
    </div>
  );
}

/* ── Main Section ───────────────────────────────────── */
export default function ClientTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  /* Fetch from backend */
  useEffect(() => {
    API.get('/testimonials')
      .then(({ data }) => {
        const list: Testimonial[] = data?.data || data;
        if (Array.isArray(list) && list.length > 0) setTestimonials(list);
      })
      .catch(() => {/* keep defaults silently */});
  }, []);

  /* GSAP infinite marquee – right → left */
  useEffect(() => {
    const track = trackRef.current;
    if (!track || testimonials.length === 0) return;

    // The track contains two identical sets of cards; we slide one full set width
    const singleSetWidth = track.scrollWidth / 2;
    // Speed: ~80px per second gives a calm, premium feel
    const duration = singleSetWidth / 80;

    gsap.set(track, { x: 0 });

    tweenRef.current = gsap.to(track, {
      x: -singleSetWidth,
      duration,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((v) => parseFloat(v) % singleSetWidth),
      },
    });

    return () => { tweenRef.current?.kill(); };
  }, [testimonials]);

  /* Pause / resume on hover */
  const handleMouseEnter = () => tweenRef.current?.pause();
  const handleMouseLeave = () => tweenRef.current?.resume();

  return (
    <section
      id="testimonials"
      className="py-24 md:py-28 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #2A3F5C 0%, #1D2B42 100%)' }}
    >
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20"
          style={{ background: '#d4af37' }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] opacity-10"
          style={{ background: '#415C84' }} />
      </div>

      {/* Section header */}
      <div className="container mx-auto px-6 md:px-12 text-center mb-14 relative z-10">
        <h3 className="text-[#d4af37] uppercase tracking-widest text-sm font-bold mb-4">What Our Clients Say</h3>
        <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-wider text-white">
          Client Testimonials
        </h2>
        <div className="mt-4 mx-auto w-24 h-1 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }} />
      </div>

      {/* Marquee track */}
      <div
        className="relative overflow-hidden w-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Left fade edge */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #1D2B42 0%, transparent 100%)' }} />
        {/* Right fade edge */}
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(270deg, #1D2B42 0%, transparent 100%)' }} />

        <div
          ref={trackRef}
          className="flex items-stretch py-4"
          style={{ width: 'max-content' }}
        >
          {/* Two identical sets for seamless loop */}
          {[...testimonials, ...testimonials].map((t, i) => (
            <TestimonialCard key={`${t._id ?? t.clientName}-${i}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

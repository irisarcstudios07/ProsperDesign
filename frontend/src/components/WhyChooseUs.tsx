import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  { title: 'Custom Design', desc: 'Every project is uniquely tailored to your vision and lifestyle, ensuring absolute exclusivity.' },
  { title: 'Professional Team', desc: 'Our experts bring decades of combined experience across construction and design disciplines.' },
  { title: 'Luxury Finishes', desc: 'We source only the finest premium materials globally for an opulent and enduring result.' },
  { title: 'Fast Execution', desc: 'Efficient project management guarantees timely delivery without compromising on quality.' },
  { title: 'Attention To Detail', desc: 'Meticulous planning and execution down to the finest granular detail.' },
  { title: 'Client Satisfaction', desc: 'A transparent and collaborative process dedicated to exceeding your highest expectations.' },
];

export default function WhyChooseUs() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const cards = containerRef.current.querySelectorAll('.feature-card');
    
    gsap.fromTo(cards, 
      { opacity: 0, y: 50 },
      {
        opacity: 1, 
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section className="py-24 md:py-32 bg-[#2A3F5C] text-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h3 className="text-[#d4af37] text-sm font-bold uppercase tracking-widest mb-4">Why Choose Us</h3>
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-widest">
            Excellence in every detail
          </h2>
        </div>

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div 
              key={i} 
              className="feature-card p-8 md:p-10 border border-white/5 hover:border-[#d4af37]/50 bg-[#415C84] transition-colors duration-500 rounded-xl group"
            >
              <div className="text-[#d4af37] text-xl font-bold mb-6 font-serif italic opacity-50 group-hover:opacity-100 transition-opacity">
                0{i + 1}
              </div>
              <h4 className="text-xl font-bold uppercase tracking-wider mb-4 group-hover:text-[#d4af37] transition-colors">{feature.title}</h4>
              <p className="text-gray-400 font-light leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

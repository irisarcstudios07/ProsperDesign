import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const countersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!countersRef.current) return;
    
    const elements = countersRef.current.querySelectorAll('.counter-val');
    
    elements.forEach((el) => {
      const target = parseFloat(el.getAttribute('data-target') || '0');
      
      ScrollTrigger.create({
        trigger: countersRef.current,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(el, {
            innerHTML: target,
            duration: 2,
            snap: { innerHTML: 1 },
            ease: 'power2.out',
            onUpdate: function() {
              el.innerHTML = Math.round(parseFloat(el.innerHTML)).toString() + (el.getAttribute('data-suffix') || '');
            }
          });
        },
        once: true
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-24 md:py-32 bg-[#415C84] text-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Content Side */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <h3 className="text-[#d4af37] uppercase tracking-widest text-sm font-bold mb-4">About Prosper Design</h3>
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-wider mb-8 leading-tight">
              Crafting Timeless Environments
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6 font-light">
              We create exceptional spaces through landscape design, water features, architectural concepts, and luxury interiors. Our approach blends nature with modern aesthetics to deliver environments that inspire.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed font-light mb-10">
              With a commitment to quality and a passion for design, every project is a masterpiece tailored to elevate the human experience.
            </p>
            <div>
              <button className="px-8 py-4 bg-[#d4af37] text-black uppercase tracking-widest text-sm font-bold hover:bg-white transition-colors duration-300">
                Learn More
              </button>
            </div>
          </div>

          {/* Image & Counters Side */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[500px] w-full">
              <img 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop" 
                alt="Luxury Construction" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Floating Counters */}
            {/* Vercel deployment stats update trigger */}
            <div ref={countersRef} className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-[90%] md:w-[110%] lg:-left-12 lg:translate-x-0 bg-[#1D2B42]/80 backdrop-blur-xl border border-white/10 rounded-xl p-6 md:p-8 grid grid-cols-3 gap-4 md:gap-8 shadow-2xl">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#d4af37] mb-2 counter-val" data-target="150" data-suffix="+">0</div>
                <div className="text-xs text-gray-400 uppercase tracking-widest">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#d4af37] mb-2 counter-val" data-target="50" data-suffix="+">0</div>
                <div className="text-xs text-gray-400 uppercase tracking-widest">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#d4af37] mb-2 counter-val" data-target="98" data-suffix="%">0</div>
                <div className="text-xs text-gray-400 uppercase tracking-widest">Client Satisfaction</div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

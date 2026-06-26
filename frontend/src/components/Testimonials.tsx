import { useState, useEffect } from 'react';

const testimonials = [
  { id: 1, text: "Prosper Design transformed our vision into a reality that exceeded all expectations. Their attention to detail and commitment to luxury is unparalleled.", author: "Sarah Jenkins", role: "Homeowner" },
  { id: 2, text: "The synergy between the landscape and construction they created for our estate is breathtaking. A truly world-class design firm.", author: "Michael Chen", role: "Property Developer" },
  { id: 3, text: "From the initial concept to the final execution, their process was flawless. They didn't just build a house; they crafted a masterpiece.", author: "Elena Rodriguez", role: "Client" }
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 md:py-32 bg-[#2A4365] text-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-[#d4af37] text-sm font-bold uppercase tracking-widest mb-12">Client Voices</h3>
          
          <div className="relative h-64 overflow-hidden">
            {testimonials.map((test, index) => (
              <div 
                key={test.id}
                className={`absolute top-0 left-0 w-full transition-all duration-700 ease-in-out ${
                  index === current ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                }`}
              >
                <div className="bg-[#1A2A40] p-8 md:p-12 rounded-2xl border border-white/5">
                  <p className="text-xl md:text-2xl font-light italic mb-8 text-gray-300 leading-relaxed">
                    "{test.text}"
                  </p>
                  <div>
                    <h4 className="font-bold text-lg uppercase tracking-wider">{test.author}</h4>
                    <p className="text-[#d4af37] text-sm tracking-widest uppercase mt-1">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-3 h-3 rounded-full transition-colors ${idx === current ? 'bg-[#d4af37]' : 'bg-white/20'}`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

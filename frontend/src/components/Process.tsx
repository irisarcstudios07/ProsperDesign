const steps = [
  { num: '01', title: 'Consultation', desc: 'We begin by understanding your vision, lifestyle, and specific requirements for the space.' },
  { num: '02', title: 'Concept Design', desc: 'Our team develops initial sketches, mood boards, and spatial plans to establish the design direction.' },
  { num: '03', title: 'Development', desc: 'Detailed 3D renderings and technical drawings are created to refine the concept and materials.' },
  { num: '04', title: 'Execution', desc: 'Our project managers oversee the construction and installation, ensuring flawless execution.' },
  { num: '05', title: 'Final Delivery', desc: 'The completed project is handed over, styled to perfection and ready for you to enjoy.' },
];

export default function Process() {
  return (
    <section className="py-32 px-6 md:px-12 bg-[#2A3F5C]">
      <div className="container mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-widest mb-20 text-center">
          Our Process
        </h2>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-white/10 hidden md:block"></div>

          <div className="flex flex-col gap-12">
            {steps.map((step, index) => (
              <div key={index} className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className={`w-full md:w-1/2 ${index % 2 !== 0 ? 'text-left' : 'text-left md:text-right'}`}>
                  <h3 className="text-2xl font-bold uppercase tracking-wider mb-4">{step.title}</h3>
                  <p className="text-gray-400 font-light">{step.desc}</p>
                </div>
                
                <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-[#415C84] border border-[#d4af37] text-[#d4af37] text-xl font-bold shrink-0 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                  {step.num}
                </div>
                
                <div className="w-full md:w-1/2 hidden md:block"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

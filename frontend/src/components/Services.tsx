import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { servicesConfig } from '../servicesConfig';
import type { ParentService, SubService } from '../servicesConfig';

export default function Services() {
  // Navigation states:
  // level 1: selectedParent = null, selectedSub = null
  // level 2: selectedParent = ParentService, selectedSub = null
  // level 3: selectedParent = ParentService, selectedSub = SubService
  const [selectedParent, setSelectedParent] = useState<ParentService | null>(null);
  const [selectedSub, setSelectedSub] = useState<SubService | null>(null);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const handleBookRedirect = (parentTitle: string, subTitle: string) => {
    // Map custom titles to standard project types
    let cleanParent = parentTitle;
    if (parentTitle.toLowerCase().includes('interior')) cleanParent = 'Interior Design';
    else if (parentTitle.toLowerCase().includes('landscape')) cleanParent = 'Landscape';
    else if (parentTitle.toLowerCase().includes('water')) cleanParent = 'Water Bodies';
    else if (parentTitle.toLowerCase().includes('play')) cleanParent = 'Playstation';
    else if (parentTitle.toLowerCase().includes('construct')) cleanParent = 'Constructions';

    const url = `/book?parent=${encodeURIComponent(cleanParent)}&child=${encodeURIComponent(subTitle)}`;
    window.location.href = url;
  };

  return (
    <section id="services" className="py-24 md:py-32 bg-[#2A3F5C] text-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Header Section */}
        <div className="max-w-2xl mb-16">
          <h3 className="text-[#d4af37] uppercase tracking-widest text-sm font-bold mb-4">Our Expertise</h3>
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-wider mb-6">Services</h2>
          <p className="text-gray-300 font-light text-lg">
            Explore our curated, luxury portfolio of custom craftsmanship.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {/* LEVEL 1: PARENT SERVICES GRID */}
          {!selectedParent && (
            <motion.div
              key="parent-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            >
              {servicesConfig.map((parent) => (
                <motion.div
                  key={parent.title}
                  whileHover={{ y: -6, scale: 1.02 }}
                  onClick={() => setSelectedParent(parent)}
                  className="group relative h-[450px] overflow-hidden rounded-3xl cursor-pointer bg-[#1D2B42] shadow-2xl border border-white/10"
                >
                  <img 
                    src={parent.coverImage} 
                    alt={parent.title} 
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1D2B42] via-[#1D2B42]/20 to-transparent flex flex-col justify-end p-10">
                    <h4 className="text-3xl font-bold text-white mb-2 uppercase tracking-wide">{parent.title}</h4>
                    <p className="text-[#d4af37] text-sm uppercase tracking-widest font-semibold flex items-center gap-1 group-hover:translate-x-2 transition-transform duration-300">
                      View Categories &rarr;
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* LEVEL 2: SUB SERVICES LIST */}
          {selectedParent && !selectedSub && (
            <motion.div
              key="sub-grid"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedParent(null)}
                  className="px-5 py-2.5 bg-[#415C84] hover:bg-[#d4af37] hover:text-black text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 border border-white/10"
                >
                  &larr; Back to Services
                </button>
                <h4 className="text-[#d4af37] font-bold text-xl uppercase tracking-wider">{selectedParent.title}</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {selectedParent.subServices.map((sub) => (
                  <motion.div
                    key={sub.title}
                    whileHover={{ y: -6, scale: 1.02 }}
                    onClick={() => setSelectedSub(sub)}
                    className="group relative h-[320px] overflow-hidden rounded-2xl cursor-pointer bg-[#1D2B42] shadow-xl border border-white/10"
                  >
                    <img 
                      src={sub.coverImage} 
                      alt={sub.title} 
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1D2B42] via-[#1D2B42]/10 to-transparent flex flex-col justify-end p-6">
                      <h5 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">{sub.title}</h5>
                      <p className="text-[#d4af37] text-xs uppercase tracking-widest font-semibold flex items-center gap-1 group-hover:translate-x-2 transition-transform duration-300">
                        View Gallery &rarr;
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* LEVEL 3: INDIVIDUAL IMAGE GALLERY */}
          {selectedParent && selectedSub && (
            <motion.div
              key="gallery-grid"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedSub(null)}
                    className="px-5 py-2.5 bg-[#415C84] hover:bg-[#d4af37] hover:text-black text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 border border-white/10"
                  >
                    &larr; Back
                  </button>
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-widest">{selectedParent.title}</span>
                    <h4 className="text-[#d4af37] font-bold text-2xl uppercase tracking-wider">{selectedSub.title}</h4>
                  </div>
                </div>
                
                <button
                  onClick={() => handleBookRedirect(selectedParent.title, selectedSub.title)}
                  className="px-8 py-3 bg-[#d4af37] hover:bg-white text-black font-bold text-xs uppercase tracking-widest rounded-lg transition-all duration-300"
                >
                  Book {selectedSub.title} Consultation
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {selectedSub.items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-[#1D2B42] rounded-2xl overflow-hidden border border-white/10 flex flex-col group h-full shadow-lg"
                  >
                    <div 
                      className="h-[260px] overflow-hidden relative cursor-pointer"
                      onClick={() => setLightboxImg(item.image)}
                    >
                      <img 
                        src={item.image} 
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Zoom indicator on hover */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm bg-black/60 px-4 py-2 rounded-full border border-white/15">Click to Zoom</span>
                      </div>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h5 className="text-white font-bold text-lg mb-2 tracking-wide">{item.title}</h5>
                        {item.description && (
                          <p className="text-gray-300 font-light text-sm leading-relaxed mb-4">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lightbox */}
        {lightboxImg && (
          <div 
            className="fixed inset-0 z-[60] bg-[#1D2B42]/95 flex items-center justify-center p-4 md:p-12 backdrop-blur-sm cursor-pointer"
            onClick={() => setLightboxImg(null)}
          >
            <img 
              src={lightboxImg} 
              alt="Preview" 
              className="max-w-full max-h-full object-contain shadow-2xl rounded-2xl border border-white/15"
            />
            <button 
              className="absolute top-6 right-6 text-white text-4xl hover:text-[#d4af37] transition-colors"
              onClick={() => setLightboxImg(null)}
            >
              &times;
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

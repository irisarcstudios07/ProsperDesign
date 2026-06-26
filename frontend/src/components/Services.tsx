import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api';
import type { Service } from '../types';

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Track currently selected parent service index or object. If null, show Parent Categories.
  const [selectedParent, setSelectedParent] = useState<Service | null>(null);

  const fetchServices = async () => {
    try {
      const { data } = await API.get('/services');
      const extractedData = data?.data || data;
      setServices(Array.isArray(extractedData) ? extractedData : []);
    } catch (err) {
      console.error('Failed to load services', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleBookRedirect = (parentTitle: string, childTitle: string) => {
    // Map custom titles to standard names if needed, or pass as is
    let cleanParent = parentTitle;
    if (parentTitle.toLowerCase().includes('interior')) cleanParent = 'Interior Design';
    else if (parentTitle.toLowerCase().includes('landscape')) cleanParent = 'Landscape';
    else if (parentTitle.toLowerCase().includes('water')) cleanParent = 'Water Bodies';
    else if (parentTitle.toLowerCase().includes('play')) cleanParent = 'Playstation';
    else if (parentTitle.toLowerCase().includes('construct')) cleanParent = 'Constructions';

    const url = `/book?parent=${encodeURIComponent(cleanParent)}&child=${encodeURIComponent(childTitle)}`;
    window.location.href = url;
  };

  if (loading) {
    return (
      <section id="services" className="py-24 bg-[#2A3F5C] text-white text-center">
        <div className="animate-pulse text-gray-400">Loading premium services...</div>
      </section>
    );
  }

  const safeServices = Array.isArray(services) ? services : [];

  return (
    <section id="services" className="py-24 md:py-32 bg-[#2A3F5C] text-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Header Section */}
        <div className="max-w-2xl mb-16">
          <h3 className="text-[#d4af37] uppercase tracking-widest text-sm font-bold mb-4">Our Expertise</h3>
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-wider mb-6">Services</h2>
          <p className="text-gray-300 font-light text-lg">
            Explore our diverse range of premium services tailored to bring your ultimate vision to life.
          </p>
        </div>

        {/* Animation container */}
        <AnimatePresence mode="wait">
          {!selectedParent ? (
            // PARENT SERVICES VIEW
            <motion.div
              key="parents-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {safeServices.length === 0 ? (
                <div className="col-span-full text-center text-gray-400 py-12">
                  No services available at the moment. Please check back later.
                </div>
              ) : (
                safeServices.map((parent) => (
                  <motion.div
                    key={parent._id}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="group relative h-[400px] overflow-hidden rounded-2xl cursor-pointer bg-[#415C84] shadow-xl border border-white/5"
                    onClick={() => setSelectedParent(parent)}
                  >
                    <img 
                      src={parent.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop'} 
                      alt={parent.title} 
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop';
                      }}
                    />
                    {/* Premium Dark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1D2B42] via-[#1D2B42]/30 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-300 flex flex-col justify-end p-8">
                      <h4 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">{parent.title}</h4>
                      <p className="text-[#d4af37] text-xs uppercase tracking-widest font-semibold flex items-center gap-1 group-hover:translate-x-2 transition-transform duration-300">
                        Explore Subservices &rarr;
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          ) : (
            // CHILD SERVICES VIEW FOR SELECTED PARENT
            <motion.div
              key="children-grid"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Back navigation banner */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedParent(null)}
                  className="px-5 py-2.5 bg-[#415C84] hover:bg-[#d4af37] hover:text-black text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 border border-white/10"
                >
                  &larr; Back to Services
                </button>
                <h4 className="text-[#d4af37] font-bold text-xl uppercase tracking-wider">{selectedParent.title}</h4>
              </div>

              {/* Children Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(!selectedParent.children || selectedParent.children.length === 0) ? (
                  <div className="col-span-full text-center text-gray-400 py-12">
                    No detailed subservices found for this category.
                  </div>
                ) : (
                  selectedParent.children.map((child, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-[#1D2B42] rounded-2xl overflow-hidden border border-white/10 flex flex-col group h-full shadow-lg"
                    >
                      {/* Child image with hover zoom */}
                      <div className="h-[240px] overflow-hidden relative">
                        <img 
                          src={child.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop'} 
                          alt={child.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop';
                          }}
                        />
                      </div>
                      
                      {/* Child info */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <h5 className="text-white font-bold text-lg mb-3 tracking-wide">{child.title}</h5>
                          {child.description && (
                            <p className="text-gray-300 font-light text-sm line-clamp-3 mb-6 leading-relaxed">
                              {child.description}
                            </p>
                          )}
                        </div>

                        {/* Booking CTA */}
                        <button
                          onClick={() => handleBookRedirect(selectedParent.title, child.title)}
                          className="w-full py-3 bg-[#415C84] hover:bg-[#d4af37] text-white hover:text-black font-bold text-xs uppercase tracking-widest rounded-lg transition-all duration-300 border border-white/5"
                        >
                          Book Consultation
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

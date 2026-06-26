import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Service, ChildService, GalleryImage } from '../../types';
import Lightbox from './Lightbox';

interface ServiceDetailProps {
  parent: Service;
  child: ChildService;
  designTitle: string;
  images: GalleryImage[];
  description: string;
  onBack: () => void;
}

export default function ServiceDetail({ parent, child, designTitle, images, description, onBack }: ServiceDetailProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleBookConsultation = () => {
    // 1. Update URL search parameters without reloading
    const url = new URL(window.location.href);
    url.searchParams.set('parent', parent.title);
    url.searchParams.set('child', `${child.title} - ${designTitle}`);
    window.history.pushState({}, '', url.toString());

    // 2. Dispatch custom event to auto-fill BookConsultation component
    const event = new CustomEvent('autofill-booking', {
      detail: {
        parent: parent.title,
        child: `${child.title} - ${designTitle}`
      }
    });
    window.dispatchEvent(event);

    // 3. Scroll to booking form
    const bookingForm = document.getElementById('book-consultation');
    if (bookingForm) {
      bookingForm.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Use first image in group as the detail page hero cover
  const coverImage = images[0]?.url || child.coverImage || '/placeholder-cover.jpg';

  return (
    <motion.div
      key="service-detail"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35 }}
      className="space-y-10"
    >
      {/* Breadcrumbs */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#415C84] hover:bg-[#d4af37] hover:text-black text-white font-semibold rounded-xl transition-all duration-300 border border-white/10 text-sm"
        >
          ← Back
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-400 flex-wrap">
          <span>Services</span>
          <span>/</span>
          <span>{parent.title}</span>
          <span>/</span>
          <span className="hover:text-white cursor-pointer" onClick={onBack}>{child.title}</span>
          <span>/</span>
          <span className="text-[#d4af37] font-bold">{designTitle}</span>
        </div>
      </div>

      {/* Hero Cover */}
      <div className="relative w-full h-[380px] md:h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        <img
          src={coverImage}
          alt={designTitle}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1D2B42]/90 via-[#1D2B42]/20 to-transparent flex flex-col justify-end p-8 md:p-12">
          <p className="text-[#d4af37] text-xs uppercase tracking-widest font-semibold mb-2">
            {parent.title} · {child.title}
          </p>
          <h3 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-wider leading-tight">
            {designTitle}
          </h3>
        </div>
      </div>

      {/* Description */}
      <div className="bg-[#1A2A40]/40 p-8 rounded-2xl border border-white/5 space-y-4">
        <h4 className="text-[#d4af37] text-xs uppercase tracking-widest font-bold">About the Design</h4>
        <p className="text-gray-200 text-base leading-relaxed font-light whitespace-pre-line">
          {description || "Explore this premium custom design concept."}
        </p>
        {child.features && child.features.length > 0 && (
          <div className="pt-4 border-t border-white/5">
            <h5 className="text-gray-400 text-xs uppercase tracking-widest block mb-2 font-bold">Features</h5>
            <div className="flex flex-wrap gap-2">
              {child.features.map((f, i) => (
                <span key={i} className="text-xs bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20 px-3 py-1 rounded-full">
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Gallery images */}
      {images.length > 0 && (
        <div>
          <h4 className="text-[#d4af37] text-xs uppercase tracking-widest font-bold mb-6">
            Gallery · {images.length} Photo{images.length !== 1 ? 's' : ''}
          </h4>
          <div className={`grid gap-4 ${
            images.length === 1
              ? 'grid-cols-1 max-w-2xl'
              : images.length === 2
              ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}>
            {images.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.4 }}
                className="group relative overflow-hidden rounded-2xl bg-[#1D2B42] border border-white/10 cursor-pointer shadow-lg"
                style={{ aspectRatio: '4/3' }}
                onClick={() => setLightboxIndex(index)}
              >
                <img
                  src={img.url}
                  alt={img.caption || `${designTitle} Image ${index + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 border border-white/40 flex items-center justify-center">
                    <span className="text-white text-lg">⊕</span>
                  </div>
                  <p className="text-white text-xs font-semibold text-center uppercase tracking-wider line-clamp-1">
                    {img.caption || `View Large`}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Book Consultation Trigger */}
      <div className="pt-6 text-center border-t border-white/5">
        <button
          onClick={handleBookConsultation}
          className="px-10 py-4 bg-[#d4af37] text-black font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors duration-300 rounded-lg shadow-xl"
        >
          Book Consultation for this Service
        </button>
      </div>

      {/* Lightbox popup */}
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </motion.div>
  );
}

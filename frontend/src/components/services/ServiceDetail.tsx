import { useState } from 'react';
import { motion } from 'framer-motion';
import type { ParentService, SubService } from '../../servicesConfig';
import Lightbox from './Lightbox';

interface ServiceDetailProps {
  parent: ParentService;
  sub: SubService;
  onBack: () => void;
}

export default function ServiceDetail({ parent, sub, onBack }: ServiceDetailProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <motion.div
      key="service-detail"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35 }}
      className="space-y-10"
    >
      {/* Breadcrumb */}
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
          <span className="text-[#d4af37] font-bold">{sub.title}</span>
        </div>
      </div>

      {/* Hero Cover Image */}
      <div className="relative w-full h-[380px] md:h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        <img
          src={sub.coverImage}
          alt={sub.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1D2B42]/90 via-[#1D2B42]/20 to-transparent flex flex-col justify-end p-8 md:p-12">
          <p className="text-[#d4af37] text-xs uppercase tracking-widest font-semibold mb-2">
            {parent.title}
          </p>
          <h3 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-wider leading-tight">
            {sub.title}
          </h3>
        </div>
      </div>

      {/* Description + Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h4 className="text-[#d4af37] text-xs uppercase tracking-widest font-bold mb-3">About</h4>
          <p className="text-gray-200 text-base leading-relaxed font-light">{sub.description}</p>
        </div>
        {sub.features && sub.features.length > 0 && (
          <div>
            <h4 className="text-[#d4af37] text-xs uppercase tracking-widest font-bold mb-3">Highlights</h4>
            <ul className="space-y-2">
              {sub.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Gallery */}
      {sub.gallery.length > 0 && (
        <div>
          <h4 className="text-[#d4af37] text-xs uppercase tracking-widest font-bold mb-6">
            Gallery · {sub.gallery.length} Photo{sub.gallery.length !== 1 ? 's' : ''}
          </h4>
          <div className={`grid gap-4 ${
            sub.gallery.length === 1
              ? 'grid-cols-1 max-w-2xl'
              : sub.gallery.length === 2
              ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}>
            {sub.gallery.map((img, index) => (
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
                  src={img.image}
                  alt={img.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 border border-white/40 flex items-center justify-center">
                    <span className="text-white text-lg">⊕</span>
                  </div>
                  <p className="text-white text-xs font-semibold text-center uppercase tracking-wider line-clamp-1">
                    {img.title}
                  </p>
                </div>
                {/* Title tag */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-[#1D2B42]/80 to-transparent opacity-0 group-hover:opacity-0 translate-y-0">
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={sub.gallery}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </motion.div>
  );
}

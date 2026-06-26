import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GalleryImage } from '../../types';

interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({ images, currentIndex, onClose, onNavigate }: LightboxProps) {
  const total = images.length;
  const current = images[currentIndex];

  const goNext = useCallback(() => onNavigate((currentIndex + 1) % total), [currentIndex, total, onNavigate]);
  const goPrev = useCallback(() => onNavigate((currentIndex - 1 + total) % total), [currentIndex, total, onNavigate]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, goNext, goPrev]);

  if (!current) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[80] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/92 backdrop-blur-md cursor-pointer"
          onClick={onClose}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center max-w-6xl w-full px-4 md:px-16">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-0 right-4 md:right-0 text-white/60 hover:text-[#d4af37] text-3xl transition-colors z-20 font-light"
            aria-label="Close lightbox"
          >
            ✕
          </button>

          {/* Counter */}
          <div className="text-white/40 text-xs uppercase tracking-widest mb-4">
            {currentIndex + 1} / {total}
          </div>

          {/* Image */}
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={current.url}
              alt={current.caption || 'Gallery Image'}
              className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            />
          </AnimatePresence>

          {/* Caption */}
          {(current.caption || current.description) && (
            <div className="mt-4 text-center">
              <p className="text-white font-semibold text-sm tracking-wide">{current.caption}</p>
              {current.description && (
                <p className="text-gray-400 text-xs mt-1 max-w-lg">{current.description}</p>
              )}
            </div>
          )}

          {/* Navigation Arrows */}
          {total > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-0 md:left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-[#d4af37]/80 flex items-center justify-center text-white text-xl transition-all duration-300 border border-white/10"
                aria-label="Previous image"
              >
                ←
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-0 md:right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-[#d4af37]/80 flex items-center justify-center text-white text-xl transition-all duration-300 border border-white/10"
                aria-label="Next image"
              >
                →
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Strip */}
        {total > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); onNavigate(i); }}
                className={`flex-shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  i === currentIndex ? 'border-[#d4af37] scale-110' : 'border-white/20 opacity-50 hover:opacity-80'
                }`}
              >
                <img src={img.url} alt={img.caption || `Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Service, ChildService, GalleryImage } from '../../types';
import Lightbox from './Lightbox';

interface ServiceDetailProps {
  parent: Service;
  child: ChildService;
  onBack: () => void;
}

const cleanTitle = (name: string) => {
  return name
    .replace(/\.[^/.]+$/, "")
    .replace(/\d+$/, "")
    .replace(/[_-]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim()
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
};

const isCover = (url: string) => {
  const name = url.split('/').pop()?.toLowerCase() || '';
  return [
    "cover.jpg",
    "cover.jpeg",
    "cover.png",
    "cover.webp",
    "cover.avif"
  ].includes(name) || name.includes("cover");
};

const getCleanedTitle = (img: GalleryImage) => {
  if (img.caption && img.caption.trim().length > 0) {
    return cleanTitle(img.caption);
  }
  const filename = img.url.split('/').pop() || '';
  return cleanTitle(filename);
};

export default function ServiceDetail({ parent, child, onBack }: ServiceDetailProps) {
  const [lightboxState, setLightboxState] = useState<{ sectionIndex: number; imageIndex: number } | null>(null);

  const handleBookConsultation = (sectionTitle?: string) => {
    // 1. Update URL search parameters without reloading
    const url = new URL(window.location.href);
    url.searchParams.set('parent', parent.title);
    url.searchParams.set('child', sectionTitle || child.title);
    window.history.pushState({}, '', url.toString());

    // 2. Dispatch custom event to auto-fill BookConsultation component
    const event = new CustomEvent('autofill-booking', {
      detail: {
        parent: parent.title,
        child: sectionTitle || child.title
      }
    });
    window.dispatchEvent(event);

    // 3. Scroll to booking form
    const bookingForm = document.getElementById('book-consultation');
    if (bookingForm) {
      bookingForm.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter out any cover images from the gallery
  const galleryImages = (child.gallery || []).filter(img => !isCover(img.url));

  // Group images by cleaned title, keeping original order of appearance
  interface GroupedSection {
    title: string;
    images: GalleryImage[];
    description: string;
  }

  const sections: GroupedSection[] = [];
  const seenTitles = new Set<string>();

  galleryImages.forEach(img => {
    const title = getCleanedTitle(img) || child.title;
    if (!seenTitles.has(title)) {
      seenTitles.add(title);
      // Fallback description from the first image or child description
      const description = img.description || child.description || '';
      sections.push({ title, images: [img], description });
    } else {
      const existing = sections.find(s => s.title === title);
      if (existing) {
        existing.images.push(img);
      }
    }
  });

  // Use child cover image or the first gallery image
  const coverImage = child.coverImage || galleryImages[0]?.url || '/placeholder-cover.jpg';

  return (
    <motion.div
      key="service-detail"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35 }}
      className="space-y-12"
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
          <span className="text-[#d4af37] font-bold">{child.title}</span>
        </div>
      </div>

      {/* Hero Cover Banner */}
      <div className="relative w-full h-[380px] md:h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        <img
          src={coverImage}
          alt={child.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1D2B42]/95 via-[#1D2B42]/30 to-transparent flex flex-col justify-end p-8 md:p-12">
          <p className="text-[#d4af37] text-xs uppercase tracking-widest font-semibold mb-2">
            {parent.title}
          </p>
          <h3 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-wider leading-tight mb-4">
            {child.title}
          </h3>
          <p className="text-gray-300 text-sm md:text-base font-light max-w-2xl leading-relaxed">
            {child.description || "Luxury custom service execution by Prosper Design."}
          </p>
        </div>
      </div>

      {/* Main Features */}
      {child.features && child.features.length > 0 && (
        <div className="bg-[#1A2A40]/40 p-6 rounded-2xl border border-white/5 flex flex-wrap gap-3 items-center">
          <span className="text-gray-400 text-xs uppercase tracking-widest font-bold mr-2">Key Features:</span>
          {child.features.map((f, i) => (
            <span key={i} className="text-xs bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20 px-3.5 py-1.5 rounded-full font-medium">
              {f}
            </span>
          ))}
        </div>
      )}

      {/* Grouped Galleries */}
      {sections.length === 0 ? (
        <div className="bg-[#1D2B42] rounded-2xl border border-white/10 p-12 text-center text-gray-400">
          No showcase images available for this service yet.
        </div>
      ) : (
        <div className="space-y-16">
          {sections.map((section, sIdx) => (
            <div key={section.title} className="space-y-6 pt-8 border-t border-white/10 first:border-t-0 first:pt-0">
              {/* Section Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h4 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider mb-2">
                    {section.title}
                  </h4>
                  <p className="text-gray-300 font-light text-sm max-w-2xl">
                    {section.description || `Exquisite custom design concepts for ${section.title}.`}
                  </p>
                </div>
                
                {/* Book Section Button */}
                <button
                  onClick={() => handleBookConsultation(section.title)}
                  className="px-6 py-2.5 bg-transparent border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black font-semibold uppercase tracking-widest text-xs rounded-lg transition-all duration-300 shadow-md flex-shrink-0"
                >
                  Book {section.title}
                </button>
              </div>

              {/* Grid for Section Images */}
              <div className={`grid gap-5 ${
                section.images.length === 1
                  ? 'grid-cols-1 max-w-2xl'
                  : section.images.length === 2
                  ? 'grid-cols-1 sm:grid-cols-2 max-w-4xl'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              }`}>
                {section.images.map((img, imgIdx) => (
                  <motion.div
                    key={imgIdx}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: imgIdx * 0.05, duration: 0.4 }}
                    className="group relative overflow-hidden rounded-2xl bg-[#1D2B42] border border-white/10 cursor-pointer shadow-lg aspect-[4/3]"
                    onClick={() => setLightboxState({ sectionIndex: sIdx, imageIndex: imgIdx })}
                  >
                    <img
                      src={img.url}
                      alt={img.caption || `${section.title} Image ${imgIdx + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-4">
                      <div className="w-10 h-10 rounded-full bg-white/20 border border-white/40 flex items-center justify-center">
                        <span className="text-white text-lg">⊕</span>
                      </div>
                      <p className="text-white text-xs font-semibold text-center uppercase tracking-wider line-clamp-1">
                        {img.caption || `View Design`}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Global Book Consultation CTA */}
      <div className="pt-12 text-center border-t border-white/10 flex flex-col items-center gap-4">
        <h4 className="text-xl font-bold uppercase tracking-wider text-white">Interested in {child.title}?</h4>
        <p className="text-gray-300 font-light text-sm max-w-md">
          Schedule a personalized, luxury consultation with our design experts today.
        </p>
        <button
          onClick={() => handleBookConsultation()}
          className="px-10 py-4 bg-[#d4af37] text-black font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors duration-300 rounded-lg shadow-xl"
        >
          Book Consultation for {child.title}
        </button>
      </div>

      {/* Lightbox popup */}
      {lightboxState !== null && (
        <Lightbox
          images={sections[lightboxState.sectionIndex].images}
          currentIndex={lightboxState.imageIndex}
          onClose={() => setLightboxState(null)}
          onNavigate={(idx) => setLightboxState({ ...lightboxState, imageIndex: idx })}
        />
      )}
    </motion.div>
  );
}

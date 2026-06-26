import { motion } from 'framer-motion';
import type { Service, ChildService, GalleryImage } from '../../types';

interface GroupedDesign {
  title: string;
  coverImage: string;
  count: number;
  images: GalleryImage[];
  description: string;
}

interface DesignGridProps {
  parent: Service;
  child: ChildService;
  onBack: () => void;
  onSelect: (design: GroupedDesign) => void;
}

const cleanTitle = (caption: string) => {
  let name = caption.replace(/\.[^/.]+$/, ""); // Remove extension
  name = name.replace(/\d+$/, ""); // Remove trailing numbers (e.g., Garden1 -> Garden)
  name = name.trim();
  name = name.replace(/[_-]/g, " ");
  // Title Case conversion
  return name
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
};

export default function DesignGrid({ parent, child, onBack, onSelect }: DesignGridProps) {
  // Group gallery images by cleaned title
  const groupedMap: { [key: string]: GalleryImage[] } = {};

  (child.gallery || []).forEach(img => {
    const rawCaption = img.caption || '';
    const title = cleanTitle(rawCaption) || child.title || 'General';
    if (!groupedMap[title]) {
      groupedMap[title] = [];
    }
    groupedMap[title].push(img);
  });

  const groups: GroupedDesign[] = Object.keys(groupedMap).map(title => {
    const images = groupedMap[title];
    // Find first image that has a description, or fallback to child service description
    const descImage = images.find(img => img.description && img.description.trim().length > 0);
    const description = descImage?.description || child.description || '';
    const coverImage = images[0]?.url || child.coverImage || '';
    return {
      title,
      coverImage,
      count: images.length,
      images,
      description
    };
  });

  return (
    <motion.div
      key="design-grid"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      {/* Breadcrumb & Back button */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#415C84] hover:bg-[#d4af37] hover:text-black text-white font-semibold rounded-xl transition-all duration-300 border border-white/10 text-sm"
        >
          ← Back
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Services</span>
          <span>/</span>
          <span>{parent.title}</span>
          <span>/</span>
          <span className="text-[#d4af37] font-bold">{child.title}</span>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="bg-[#1D2B42] rounded-2xl border border-white/10 p-12 text-center text-gray-400">
          No designs available in this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {groups.map((group, i) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() => onSelect(group)}
              className="group relative h-[320px] overflow-hidden rounded-2xl cursor-pointer bg-[#1D2B42] shadow-xl border border-white/10"
            >
              <img
                src={group.coverImage}
                alt={group.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1D2B42] via-[#1D2B42]/20 to-transparent flex flex-col justify-end p-6">
                <p className="text-[#d4af37]/80 text-[10px] uppercase tracking-widest font-semibold mb-1">
                  {group.count} Photo{group.count !== 1 ? 's' : ''}
                </p>
                <h5 className="text-xl font-bold text-white mb-2 uppercase tracking-wide leading-snug">
                  {group.title}
                </h5>
                {group.description && (
                  <p className="text-gray-300 text-xs line-clamp-2 mb-2 font-light leading-relaxed">
                    {group.description}
                  </p>
                )}
                <p className="text-[#d4af37] text-xs uppercase tracking-widest font-semibold flex items-center gap-1 group-hover:translate-x-2 transition-transform duration-300">
                  View Gallery →
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

import { motion } from 'framer-motion';
import type { Service, ChildService } from '../../types';

interface ChildGridProps {
  parent: Service;
  onBack: () => void;
  onSelect: (child: ChildService) => void;
}

export default function ChildGrid({ parent, onBack, onSelect }: ChildGridProps) {
  return (
    <motion.div
      key="child-grid"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      {/* Breadcrumb + Back */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#415C84] hover:bg-[#d4af37] hover:text-black text-white font-semibold rounded-xl transition-all duration-300 border border-white/10 text-sm"
        >
          ← Back
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-white cursor-pointer" onClick={onBack}>Services</span>
          <span>/</span>
          <span className="text-[#d4af37] font-bold">{parent.title}</span>
        </div>
      </div>

      {/* Grid */}
      {(!parent.children || parent.children.length === 0) ? (
        <div className="bg-[#1D2B42] rounded-2xl border border-white/10 p-12 text-center text-gray-400">
          No sub-services available in this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {parent.children.map((child, i) => {
            const photoCount = child.gallery?.length || 0;
            return (
              <motion.div
                key={child.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => onSelect(child)}
                className="group relative h-[320px] overflow-hidden rounded-2xl cursor-pointer bg-[#1D2B42] shadow-xl border border-white/10"
              >
                <img
                  src={child.coverImage || '/placeholder-cover.jpg'}
                  alt={child.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D2B42] via-[#1D2B42]/20 to-transparent flex flex-col justify-end p-6">
                  <p className="text-[#d4af37]/80 text-[10px] uppercase tracking-widest font-semibold mb-1">
                    {photoCount} Photo{photoCount !== 1 ? 's' : ''}
                  </p>
                  <h5 className="text-xl font-bold text-white mb-2 uppercase tracking-wide leading-snug">
                    {child.title}
                  </h5>
                  {child.description && (
                    <p className="text-gray-300 text-xs line-clamp-2 mb-2 font-light leading-relaxed">
                      {child.description}
                    </p>
                  )}
                  <p className="text-[#d4af37] text-xs uppercase tracking-widest font-semibold flex items-center gap-1 group-hover:translate-x-2 transition-transform duration-300">
                    View Gallery →
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

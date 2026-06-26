import { motion } from 'framer-motion';
import type { ParentService } from '../../servicesConfig';

interface ParentGridProps {
  parents: ParentService[];
  onSelect: (parent: ParentService) => void;
}

export default function ParentGrid({ parents, onSelect }: ParentGridProps) {
  return (
    <motion.div
      key="parent-grid"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
    >
      {parents.map((parent, i) => (
        <motion.div
          key={parent.title}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.5 }}
          whileHover={{ y: -6, scale: 1.02 }}
          onClick={() => onSelect(parent)}
          className="group relative h-[460px] overflow-hidden rounded-3xl cursor-pointer bg-[#1D2B42] shadow-2xl border border-white/10"
        >
          <img
            src={parent.coverImage}
            alt={parent.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1D2B42] via-[#1D2B42]/30 to-transparent flex flex-col justify-end p-10">
            <p className="text-[#d4af37] text-xs uppercase tracking-widest font-semibold mb-2">
              {parent.subServices.length} Service{parent.subServices.length !== 1 ? 's' : ''}
            </p>
            <h4 className="text-3xl font-bold text-white mb-3 uppercase tracking-wide leading-tight">
              {parent.title}
            </h4>
            <p className="text-[#d4af37] text-sm uppercase tracking-widest font-semibold flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
              View Categories <span className="text-lg">→</span>
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

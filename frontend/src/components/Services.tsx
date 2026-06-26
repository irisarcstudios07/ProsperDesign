import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { servicesConfig } from '../servicesConfig';
import type { ParentService, SubService } from '../servicesConfig';
import ParentGrid from './services/ParentGrid';
import ChildGrid from './services/ChildGrid';
import ServiceDetail from './services/ServiceDetail';

type Level = 'parents' | 'children' | 'detail';

export default function Services() {
  const [level, setLevel] = useState<Level>('parents');
  const [selectedParent, setSelectedParent] = useState<ParentService | null>(null);
  const [selectedSub, setSelectedSub] = useState<SubService | null>(null);

  const handleParentSelect = (parent: ParentService) => {
    setSelectedParent(parent);
    setLevel('children');
  };

  const handleSubSelect = (sub: SubService) => {
    setSelectedSub(sub);
    setLevel('detail');
  };

  const handleBackToParents = () => {
    setLevel('parents');
    setSelectedParent(null);
    setSelectedSub(null);
  };

  const handleBackToChildren = () => {
    setLevel('children');
    setSelectedSub(null);
  };

  return (
    <section id="services" className="py-24 md:py-32 bg-[#2A3F5C] text-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="max-w-2xl mb-16">
          <h3 className="text-[#d4af37] uppercase tracking-widest text-sm font-bold mb-4">Our Expertise</h3>
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-wider mb-6">Services</h2>
          <p className="text-gray-300 font-light text-lg">
            Explore our curated, luxury portfolio of custom craftsmanship.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {level === 'parents' && (
            <ParentGrid
              parents={servicesConfig}
              onSelect={handleParentSelect}
            />
          )}

          {level === 'children' && selectedParent && (
            <ChildGrid
              parent={selectedParent}
              onBack={handleBackToParents}
              onSelect={handleSubSelect}
            />
          )}

          {level === 'detail' && selectedParent && selectedSub && (
            <ServiceDetail
              parent={selectedParent}
              sub={selectedSub}
              onBack={handleBackToChildren}
            />
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}

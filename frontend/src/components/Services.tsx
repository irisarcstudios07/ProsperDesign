import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import API from '../api';
import { servicesConfig } from '../servicesConfig';
import type { Service, ChildService, GalleryImage } from '../types';
import ParentGrid from './services/ParentGrid';
import ChildGrid from './services/ChildGrid';
import DesignGrid from './services/DesignGrid';
import ServiceDetail from './services/ServiceDetail';

type Level = 'parents' | 'children' | 'designs' | 'detail';

interface GroupedDesign {
  title: string;
  coverImage: string;
  count: number;
  images: GalleryImage[];
  description: string;
}

// Map the static public configurations to the database types as fallback
const mapStaticToDbFormat = (): Service[] => {
  return servicesConfig.map((parent, pIdx) => ({
    _id: `static-parent-${pIdx}`,
    title: parent.title,
    coverImage: parent.coverImage,
    children: parent.subServices.map((sub) => ({
      title: sub.title,
      coverImage: sub.coverImage,
      description: sub.description,
      features: sub.features || [],
      gallery: sub.gallery.map((img) => ({
        url: img.image,
        caption: img.title,
        description: img.description || ''
      }))
    }))
  }));
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Navigation state
  const [level, setLevel] = useState<Level>('parents');
  const [selectedParent, setSelectedParent] = useState<Service | null>(null);
  const [selectedChild, setSelectedChild] = useState<ChildService | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<GroupedDesign | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const { data } = await API.get('/services');
        const extracted = data?.data || data;
        if (Array.isArray(extracted) && extracted.length > 0) {
          setServices(extracted);
        } else {
          // Empty DB -> Fallback to static
          setServices(mapStaticToDbFormat());
        }
      } catch (err) {
        console.error("Failed to fetch database services, falling back to static config.", err);
        setServices(mapStaticToDbFormat());
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  const handleParentSelect = (parent: Service) => {
    setSelectedParent(parent);
    setLevel('children');
  };

  const handleChildSelect = (child: ChildService) => {
    setSelectedChild(child);
    setLevel('designs');
  };

  const handleDesignSelect = (design: GroupedDesign) => {
    setSelectedDesign(design);
    setLevel('detail');
  };

  const handleBackToParents = () => {
    setLevel('parents');
    setSelectedParent(null);
    setSelectedChild(null);
    setSelectedDesign(null);
  };

  const handleBackToChildren = () => {
    setLevel('children');
    setSelectedChild(null);
    setSelectedDesign(null);
  };

  const handleBackToDesigns = () => {
    setLevel('designs');
    setSelectedDesign(null);
  };

  if (loading) {
    return (
      <section id="services" className="py-24 md:py-32 bg-[#2A3F5C] text-white flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-[#d4af37]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-gray-300 font-light tracking-widest text-sm">LOADING SERVICES...</span>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-24 md:py-32 bg-[#2A3F5C] text-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">

        {/* Section Header */}
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
              parents={services}
              onSelect={handleParentSelect}
            />
          )}

          {level === 'children' && selectedParent && (
            <ChildGrid
              parent={selectedParent}
              onBack={handleBackToParents}
              onSelect={handleChildSelect}
            />
          )}

          {level === 'designs' && selectedParent && selectedChild && (
            <DesignGrid
              parent={selectedParent}
              child={selectedChild}
              onBack={handleBackToChildren}
              onSelect={handleDesignSelect}
            />
          )}

          {level === 'detail' && selectedParent && selectedChild && selectedDesign && (
            <ServiceDetail
              parent={selectedParent}
              child={selectedChild}
              designTitle={selectedDesign.title}
              images={selectedDesign.images}
              description={selectedDesign.description}
              onBack={handleBackToDesigns}
            />
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}

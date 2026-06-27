import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight, FiArrowLeft, FiMapPin, FiCalendar, FiMaximize2, FiLayers, FiCheckCircle, FiVideo, FiImage, FiGrid, FiCompass } from 'react-icons/fi';
import API, { getBackendUrl } from '../api';
import type { Project } from '../types';

type ViewLevel = 'mainCover' | 'grid' | 'detail';

export default function ProjectShowcase() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewLevel, setViewLevel] = useState<ViewLevel>('mainCover');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Lightbox State for Project Gallery Images
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const sectionRef = useRef<HTMLElement>(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await API.get('/projects');
      const extractedData = data?.data || data;
      const projectsArr = Array.isArray(extractedData) ? extractedData : [];
      setProjects(projectsArr.filter((p: any) => p.visibility !== false));
    } catch (err) {
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const getMediaUrl = (url?: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${getBackendUrl()}/${url}`;
  };

  const getProjectCover = (project: Project) => {
    if (project.coverImage) return getMediaUrl(project.coverImage);
    if (project.thumbnail) return getMediaUrl(project.thumbnail);
    const gallery = project.galleryImages || project.images || [];
    if (gallery.length > 0) return getMediaUrl(gallery[0]);
    return '/placeholder-cover.jpg';
  };

  const getProjectGallery = (project: Project): string[] => {
    const gallery = project.galleryImages && project.galleryImages.length > 0 
      ? project.galleryImages 
      : (project.images || []);
    return gallery.map(img => getMediaUrl(img)).filter(Boolean);
  };

  const activeGalleryImages = selectedProject ? getProjectGallery(selectedProject) : [];

  const handleLightboxPrev = useCallback(() => {
    if (lightboxIndex === null || activeGalleryImages.length === 0) return;
    setLightboxIndex((lightboxIndex - 1 + activeGalleryImages.length) % activeGalleryImages.length);
  }, [lightboxIndex, activeGalleryImages]);

  const handleLightboxNext = useCallback(() => {
    if (lightboxIndex === null || activeGalleryImages.length === 0) return;
    setLightboxIndex((lightboxIndex + 1) % activeGalleryImages.length);
  }, [lightboxIndex, activeGalleryImages]);

  // Handle keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') handleLightboxNext();
      if (e.key === 'ArrowLeft') handleLightboxPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, handleLightboxNext, handleLightboxPrev]);

  const handleOpenGrid = () => {
    setViewLevel('grid');
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setViewLevel('detail');
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBackToGrid = () => {
    setViewLevel('grid');
    setSelectedProject(null);
    setLightboxIndex(null);
  };

  const handleBackToMainCover = () => {
    setViewLevel('mainCover');
    setSelectedProject(null);
    setLightboxIndex(null);
  };

  const safeProjects = Array.isArray(projects) ? projects : [];

  return (
    <section id="projects" ref={sectionRef} className="py-24 md:py-32 bg-[#415C84] text-white min-h-screen relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Section Header (Visible when in Main Cover or Grid view) */}
        {viewLevel !== 'detail' && (
          <div className="text-center mb-12 md:mb-16">
            <h3 className="text-[#d4af37] text-sm font-bold uppercase tracking-widest mb-4">Featured Portfolio</h3>
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-widest mb-6">
              Projects Showcase
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto font-light text-lg">
              Explore our signature architectural transformations, luxury interior craftsmanship, and bespoke estates.
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <svg className="animate-spin h-10 w-10 text-[#d4af37]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-400">
            <p className="mb-4">{error}</p>
            <button onClick={fetchProjects} className="bg-[#d4af37] text-black px-6 py-2 rounded-lg font-bold hover:bg-white transition-colors">Retry</button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            
            {/* LEVEL 0: MAIN PROJECTS COVER CARD */}
            {viewLevel === 'mainCover' && (
              <motion.div
                key="main-cover"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5 }}
                className="max-w-5xl mx-auto"
              >
                <div 
                  onClick={handleOpenGrid}
                  className="group relative bg-[#1D2B42] rounded-3xl overflow-hidden border border-[#d4af37]/30 shadow-2xl cursor-pointer min-h-[480px] md:min-h-[560px] flex flex-col justify-end p-8 md:p-16 transition-all duration-500 hover:shadow-[#d4af37]/20 hover:border-[#d4af37]/60"
                >
                  {/* Main Brand Cover Image */}
                  <img
                    src="/project-main-cover.jpg"
                    alt="Prosper Designs Projects Showcase Cover"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90"
                  />
                  
                  {/* Subtle Gradient & Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1D2B42] via-[#1D2B42]/50 to-black/30 group-hover:via-[#1D2B42]/40 transition-colors duration-500" />
                  
                  {/* Content Overlay */}
                  <div className="relative z-10 space-y-6 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] bg-[#1D2B42]/90 backdrop-blur-md px-4 py-2 rounded-full border border-[#d4af37]/40 shadow-lg flex items-center gap-2">
                        <FiCompass size={14} /> Luxury Portfolio Showcase
                      </span>
                      <span className="text-xs font-bold uppercase tracking-widest text-white bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                        {safeProjects.length} Projects Featured
                      </span>
                    </div>

                    <div>
                      <h3 className="text-4xl md:text-6xl font-extrabold text-white uppercase tracking-wider leading-tight group-hover:text-[#d4af37] transition-colors duration-300">
                        Prosper Designs
                      </h3>
                      <p className="text-[#d4af37] text-base md:text-xl font-medium uppercase tracking-widest mt-2">
                        Interiors That Inspire • Architectural Excellence
                      </p>
                    </div>

                    <p className="text-gray-200 text-base md:text-lg font-light leading-relaxed max-w-xl">
                      Click to step inside our interactive project gallery and discover bespoke residential transformations engineered to perfection.
                    </p>

                    <div className="pt-4">
                      <span className="inline-flex items-center gap-3 bg-[#d4af37] text-black font-bold text-sm md:text-base uppercase tracking-widest px-8 py-4 rounded-full group-hover:bg-white transition-colors duration-300 shadow-2xl group-hover:translate-x-2 transition-transform">
                        Explore Project Showcase <span className="text-xl">→</span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* LEVEL 1: PROJECT COVER CARDS GRID */}
            {viewLevel === 'grid' && (
              <motion.div
                key="projects-grid"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-10"
              >
                {/* Back to Main Cover Navigation */}
                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                  <button
                    onClick={handleBackToMainCover}
                    className="inline-flex items-center gap-3 text-xs md:text-sm font-bold uppercase tracking-widest text-[#d4af37] hover:text-white transition-colors py-2.5 px-5 rounded-full bg-white/5 border border-[#d4af37]/30 hover:border-white/40"
                  >
                    <FiArrowLeft size={18} /> Back to Main Cover
                  </button>
                  <span className="text-xs uppercase tracking-widest text-gray-300 bg-white/10 px-4 py-2 rounded-full font-semibold flex items-center gap-2">
                    <FiGrid size={14} className="text-[#d4af37]" /> Select a Project to View
                  </span>
                </div>

                {safeProjects.length === 0 ? (
                  <div className="bg-[#2A3F5C] rounded-2xl border border-white/5 p-16 text-center text-gray-400 max-w-xl mx-auto">
                    No Projects Available Currently.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {safeProjects.map((project, idx) => {
                      const coverUrl = getProjectCover(project);
                      const imageCount = project.galleryImages?.length || project.images?.length || 1;
                      const hasVideo = Boolean(project.video);

                      return (
                        <motion.div
                          key={project._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05, duration: 0.4 }}
                          whileHover={{ scale: 1.04, y: -4 }}
                          onClick={() => handleSelectProject(project)}
                          className="group relative bg-[#1D2B42] rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col cursor-pointer transition-shadow duration-300 hover:shadow-[#d4af37]/10"
                        >
                          {/* Cover Image Container */}
                          <div className="relative h-64 md:h-72 overflow-hidden bg-black/40">
                            <img
                              src={coverUrl}
                              alt={project.title}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-85"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1D2B42] via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
                            
                            {/* Category Badge */}
                            <span className="absolute top-4 left-4 text-xs font-bold uppercase tracking-widest text-[#d4af37] bg-[#1D2B42]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#d4af37]/30">
                              {project.category}
                            </span>

                            {/* Video Available Indicator */}
                            {hasVideo && (
                              <span className="absolute top-4 right-4 text-xs font-bold uppercase tracking-widest text-white bg-red-600/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-red-400/30">
                                <FiVideo size={13} /> Video Available
                              </span>
                            )}
                          </div>

                          {/* Card Content */}
                          <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="text-2xl font-bold text-white uppercase tracking-wide mb-3 group-hover:text-[#d4af37] transition-colors duration-300">
                                {project.title}
                              </h3>
                              <p className="text-gray-300 text-sm line-clamp-3 font-light leading-relaxed mb-6">
                                {project.description || 'Explore custom architectural design and crafted space solutions.'}
                              </p>
                            </div>

                            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                              <span className="text-[#d4af37] text-xs font-bold uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300">
                                Open Project <span className="text-base">→</span>
                              </span>
                              <span className="text-xs text-gray-300 bg-white/10 px-3 py-1 rounded-md flex items-center gap-1.5 font-medium">
                                <FiImage size={13} className="text-[#d4af37]" /> {imageCount} {imageCount === 1 ? 'Image' : 'Images'}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* LEVEL 2: DEDICATED PROJECT DETAIL VIEW PAGE */}
            {viewLevel === 'detail' && selectedProject && (
              <motion.div
                key="project-detail"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-12"
              >
                {/* Top Navigation & Title */}
                <div className="border-b border-white/10 pb-8 space-y-4">
                  <button
                    onClick={handleBackToGrid}
                    className="inline-flex items-center gap-3 text-xs md:text-sm font-bold uppercase tracking-widest text-[#d4af37] hover:text-white transition-colors py-2.5 px-5 rounded-full bg-white/5 border border-[#d4af37]/30 hover:border-white/40 shadow-md"
                  >
                    <FiArrowLeft size={18} /> Back to Projects Grid
                  </button>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-1">
                        {selectedProject.category} Showcase
                      </span>
                      <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wide text-white">
                        {selectedProject.title}
                      </h1>
                    </div>
                    {selectedProject.year && (
                      <span className="text-xs uppercase tracking-widest text-gray-300 bg-white/10 px-4 py-2 rounded-full self-start md:self-auto border border-white/10">
                        Year: <strong className="text-white font-bold">{selectedProject.year}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* TOP MEDIA SECTION: 70% Video Player / 30% Cover Thumbnail on Desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-8 items-stretch">
                  {/* Left Side (70%): Project Video Player */}
                  <div className="bg-[#1D2B42] rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col justify-center min-h-[340px] md:min-h-[440px] relative">
                    {selectedProject.video ? (
                      <video
                        controls
                        preload="metadata"
                        poster={getProjectCover(selectedProject)}
                        className="w-full h-full object-cover max-h-[520px] rounded-3xl"
                      >
                        <source src={getMediaUrl(selectedProject.video)} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="relative w-full h-full min-h-[360px] overflow-hidden flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#1D2B42] to-[#2A3F5C]">
                        <img
                          src={getProjectCover(selectedProject)}
                          alt={selectedProject.title}
                          className="absolute inset-0 w-full h-full object-cover filter blur-md opacity-30"
                        />
                        <div className="relative z-10 max-w-md space-y-3">
                          <div className="w-16 h-16 bg-[#d4af37]/20 rounded-full flex items-center justify-center mx-auto text-[#d4af37] border border-[#d4af37]/30">
                            <FiVideo size={30} />
                          </div>
                          <h4 className="text-xl font-bold text-white uppercase tracking-wide">Cinematic Showcase</h4>
                          <p className="text-gray-300 text-sm font-light">Explore high-resolution photography below in our dedicated project gallery.</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Side (30%): Project Cover Card Thumbnail */}
                  <div className="bg-[#1D2B42] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative min-h-[340px] md:min-h-[440px] flex flex-col justify-end p-8 group">
                    <img
                      src={getProjectCover(selectedProject)}
                      alt={selectedProject.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1D2B42] via-[#1D2B42]/40 to-transparent" />
                    
                    <div className="relative z-10 space-y-2">
                      <span className="text-[#d4af37] text-xs uppercase tracking-widest font-bold block">
                        Featured Project Cover
                      </span>
                      <h3 className="text-2xl font-bold text-white uppercase tracking-wide leading-tight">
                        {selectedProject.title}
                      </h3>
                      <p className="text-gray-300 text-xs font-light line-clamp-3 leading-relaxed">
                        {selectedProject.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* PROJECT DESCRIPTION & SPECIFICATIONS SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-8 bg-[#2A3F5C] rounded-3xl p-8 md:p-12 border border-white/10 shadow-xl space-y-4">
                    <h3 className="text-2xl font-bold uppercase tracking-wider text-[#d4af37]">
                      Project Overview
                    </h3>
                    <p className="text-gray-200 text-base md:text-lg font-light leading-relaxed whitespace-pre-line">
                      {selectedProject.description || 'Custom detailed craftsmanship engineered to perfection. Designed and executed by our specialized interior and landscape design teams.'}
                    </p>
                  </div>

                  {/* Specifications / Metadata */}
                  <div className="lg:col-span-4 bg-[#1D2B42] rounded-3xl p-8 border border-white/10 shadow-xl space-y-6">
                    <h3 className="text-xl font-bold uppercase tracking-wider text-white flex items-center gap-2.5 border-b border-white/10 pb-4">
                      <FiLayers className="text-[#d4af37]" /> Key Details
                    </h3>
                    <div className="space-y-4">
                      {selectedProject.location && (
                        <div className="bg-[#2A3F5C]/60 p-4 rounded-2xl border border-white/5">
                          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold flex items-center gap-1.5 mb-1">
                            <FiMapPin /> Location
                          </span>
                          <p className="text-white font-bold text-sm">{selectedProject.location}</p>
                        </div>
                      )}
                      {(selectedProject.area || selectedProject.completion) && (
                        <div className="bg-[#2A3F5C]/60 p-4 rounded-2xl border border-white/5">
                          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold flex items-center gap-1.5 mb-1">
                            <FiCalendar /> Scope & Duration
                          </span>
                          <p className="text-white font-bold text-sm">
                            {[selectedProject.area, selectedProject.completion].filter(Boolean).join(' • ')}
                          </p>
                        </div>
                      )}
                      {selectedProject.materials && (
                        <div className="bg-[#2A3F5C]/60 p-4 rounded-2xl border border-white/5">
                          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold flex items-center gap-1.5 mb-1">
                            <FiCheckCircle /> Materials & Finishes
                          </span>
                          <p className="text-white font-bold text-sm">{selectedProject.materials}</p>
                        </div>
                      )}
                      {(!selectedProject.location && !selectedProject.area && !selectedProject.materials) && (
                        <div className="text-gray-400 text-xs italic">Bespoke custom specification tailored for high-end residential estate.</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* RESPONSIVE IMAGE GALLERY SECTION */}
                <div className="space-y-8 pt-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-6">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-wider text-white">
                        Project Images Gallery
                      </h3>
                      <p className="text-gray-300 text-sm font-light mt-1">Select any image to expand into full screen view.</p>
                    </div>
                    <span className="text-xs font-bold text-[#d4af37] bg-[#d4af37]/10 px-4 py-2 rounded-full border border-[#d4af37]/30 flex items-center gap-1.5">
                      <FiImage /> {activeGalleryImages.length} Photos
                    </span>
                  </div>

                  {activeGalleryImages.length === 0 ? (
                    <div className="bg-[#1D2B42] rounded-2xl p-12 text-center text-gray-400 border border-white/5">
                      No extra gallery photos uploaded for this project entry.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                      {activeGalleryImages.map((imgUrl, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.04, duration: 0.3 }}
                          whileHover={{ scale: 1.03 }}
                          onClick={() => setLightboxIndex(idx)}
                          className="group relative h-72 md:h-80 rounded-2xl overflow-hidden cursor-pointer bg-[#1D2B42] border border-white/10 shadow-lg"
                        >
                          <img
                            src={imgUrl}
                            alt={`${selectedProject.title} photo ${idx + 1}`}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90"
                          />
                          <div className="absolute inset-0 bg-[#1D2B42]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="bg-[#d4af37] text-black p-3.5 rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                              <FiMaximize2 size={22} />
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* CALL TO ACTION BUTTON */}
                <div className="bg-gradient-to-r from-[#1D2B42] via-[#2A3F5C] to-[#1D2B42] rounded-3xl p-10 md:p-14 border border-[#d4af37]/30 text-center shadow-2xl space-y-6">
                  <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-wider text-white">
                    Ready to Transform Your Space?
                  </h3>
                  <p className="text-gray-300 max-w-xl mx-auto font-light text-base md:text-lg">
                    Let's discuss how our design team can bring this level of elegance to your property.
                  </p>
                  <div>
                    <a
                      href="#contact"
                      className="inline-block bg-[#d4af37] text-black font-bold text-sm md:text-base uppercase tracking-widest px-10 py-5 rounded-full hover:bg-white transition-colors duration-300 shadow-xl"
                    >
                      Book Consultation
                    </a>
                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        )}
      </div>

      {/* PREMIUM LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxIndex !== null && activeGalleryImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-xl"
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 text-white hover:text-[#d4af37] transition-colors p-3 bg-white/10 hover:bg-white/20 rounded-full z-55"
              aria-label="Close Lightbox"
            >
              <FiX size={28} />
            </button>

            {/* Previous Button */}
            <button
              onClick={handleLightboxPrev}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white hover:text-[#d4af37] transition-colors p-4 bg-white/10 hover:bg-white/20 rounded-full z-55"
              aria-label="Previous Photo"
            >
              <FiChevronLeft size={32} />
            </button>

            {/* Next Button */}
            <button
              onClick={handleLightboxNext}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white hover:text-[#d4af37] transition-colors p-4 bg-white/10 hover:bg-white/20 rounded-full z-55"
              aria-label="Next Photo"
            >
              <FiChevronRight size={32} />
            </button>

            {/* Lightbox Main Image Display */}
            <div className="max-w-6xl max-h-[85vh] flex flex-col items-center justify-center relative">
              <motion.img
                key={lightboxIndex}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={activeGalleryImages[lightboxIndex]}
                alt={`Gallery image ${lightboxIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-white/10"
              />
              
              <div className="mt-4 text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] bg-white/10 px-4 py-1.5 rounded-full">
                  Photo {lightboxIndex + 1} of {activeGalleryImages.length}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

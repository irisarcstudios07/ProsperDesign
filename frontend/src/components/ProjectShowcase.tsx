import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import API, { getBackendUrl } from '../api';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  _id: string;
  title: string;
  category: string;
  description: string;
  thumbnail: string;
  video: string;
}

export default function ProjectShowcase() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
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

  useEffect(() => {
    if (projects.length === 0 || !sectionRef.current) return;

    // Apply parallax effects to project cards
    const projectCards = sectionRef.current.querySelectorAll('.project-card');
    projectCards.forEach((card) => {
      const img = card.querySelector('.parallax-img');
      if (img) {
        gsap.fromTo(img, 
          { y: '-10%' },
          {
            y: '10%',
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            }
          }
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [projects]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedIdx(null);
      } else if (e.key === 'ArrowRight' && selectedIdx !== null) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && selectedIdx !== null) {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIdx, projects]);

  const handleNext = () => {
    if (selectedIdx === null || projects.length === 0) return;
    setSelectedIdx((selectedIdx + 1) % projects.length);
  };

  const handlePrev = () => {
    if (selectedIdx === null || projects.length === 0) return;
    setSelectedIdx((selectedIdx - 1 + projects.length) % projects.length);
  };

  const activeProject = selectedIdx !== null ? projects[selectedIdx] : null;

  const safeProjects = Array.isArray(projects) ? projects : [];

  return (
    <section id="projects" ref={sectionRef} className="py-24 md:py-32 bg-[#415C84] text-white">
      <div className="container mx-auto px-6 md:px-12">
        <h3 className="text-[#d4af37] text-sm font-bold uppercase tracking-widest mb-4 text-center">Featured Works</h3>
        <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-widest mb-20 text-center">
          Project Showcase
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <svg className="animate-spin h-10 w-10 text-[#d4af37]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-400">
            <p className="mb-4">{error}</p>
            <button onClick={fetchProjects} className="bg-[#d4af37] text-black px-6 py-2 rounded font-bold hover:bg-white transition-colors">Retry</button>
          </div>
        ) : safeProjects.length === 0 ? (
          <div className="bg-[#2A3F5C] rounded-2xl border border-white/5 p-16 text-center text-gray-500 max-w-xl mx-auto">
            No Projects Available
          </div>
        ) : (
          <div className="flex flex-col gap-16 md:gap-32">
            {safeProjects.map((project, idx) => {
              const thumbUrl = project.thumbnail.startsWith('http') 
                ? project.thumbnail 
                : `${getBackendUrl()}/${project.thumbnail}`;
              const formattedId = String(idx + 1).padStart(2, '0');

              return (
                <div 
                  key={project._id} 
                  onClick={() => setSelectedIdx(idx)}
                  className="project-card relative w-full h-[50vh] md:h-[80vh] overflow-hidden group rounded-2xl cursor-pointer"
                >
                  <img 
                    src={thumbUrl} 
                    alt={project.title} 
                    loading="lazy"
                    className="parallax-img absolute top-0 left-0 w-full h-[120%] object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[#1D2B42]/40 group-hover:bg-[#1D2B42]/60 transition-colors duration-500"></div>
                  
                  <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-between">
                    <div className="text-5xl md:text-8xl font-bold text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.4)] opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                      {formattedId}
                    </div>
                    
                    <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-[#d4af37] text-sm md:text-base uppercase tracking-widest mb-2 font-bold">
                        {project.category}
                      </p>
                      <h3 className="text-3xl md:text-6xl font-bold text-white uppercase tracking-wider mb-6">
                        {project.title}
                      </h3>
                      <button className="hidden md:inline-block border border-white px-8 py-4 uppercase tracking-widest text-sm font-bold hover:bg-white hover:text-black transition-colors duration-300">
                        View Project
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox / Video Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1D2B42]/90 backdrop-blur-md">
          <button 
            onClick={() => setSelectedIdx(null)}
            className="absolute top-6 right-6 text-white hover:text-[#d4af37] transition-colors p-2 bg-white/10 rounded-full z-55"
          >
            <FiX size={28} />
          </button>

          {/* Nav buttons */}
          <button 
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-[#d4af37] transition-colors p-3 bg-white/10 rounded-full z-55 hidden md:block"
          >
            <FiChevronLeft size={30} />
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-[#d4af37] transition-colors p-3 bg-white/10 rounded-full z-55 hidden md:block"
          >
            <FiChevronRight size={30} />
          </button>

          <div className="w-full max-w-4xl bg-[#415C84] border border-white/10 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
            <div className="w-full md:w-2/3 bg-[#1D2B42] flex items-center justify-center min-h-[300px] md:min-h-[450px]">
              {activeProject.video ? (
                <video
                  key={activeProject._id}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                >
                  <source 
                    src={activeProject.video.startsWith('http') ? activeProject.video : `${getBackendUrl()}/${activeProject.video}`} 
                    type="video/mp4" 
                  />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="text-gray-500 text-sm">No video upload available for this project.</div>
              )}
            </div>

            <div className="w-full md:w-1/3 p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs text-[#d4af37] bg-[#d4af37]/10 px-2.5 py-1 rounded-full uppercase font-bold tracking-widest block w-fit mb-4">
                  {activeProject.category}
                </span>
                <h4 className="text-2xl font-bold uppercase tracking-wider text-white mb-4">{activeProject.title}</h4>
                <p className="text-gray-400 font-light text-sm leading-relaxed">{activeProject.description || 'No description provided.'}</p>
              </div>
              <div className="flex justify-between items-center mt-8 md:mt-0 text-xs text-gray-500">
                <span>Use Left/Right arrows or buttons</span>
                <div className="flex gap-4 md:hidden">
                  <button onClick={handlePrev} className="p-2 border border-white/15 rounded text-white"><FiChevronLeft size={18} /></button>
                  <button onClick={handleNext} className="p-2 border border-white/15 rounded text-white"><FiChevronRight size={18} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

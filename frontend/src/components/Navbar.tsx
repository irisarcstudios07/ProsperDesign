import { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/90 backdrop-blur-md py-4 shadow-lg' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo at Top Left */}
        <div 
          className="cursor-pointer flex items-center gap-3" 
          onClick={() => scrollToSection('home')}
        >
          <img 
            src="/logo.png" 
            alt="Prosper Design" 
            className="h-12 w-auto object-contain bg-white/90 p-1 rounded" 
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
              const span = document.createElement('span');
              span.className = 'text-2xl font-bold text-white tracking-widest uppercase';
              span.innerHTML = 'Prosper<span class="text-[#d4af37]">.</span>';
              (e.target as HTMLElement).parentNode?.appendChild(span);
            }}
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-white uppercase text-sm tracking-wider">
          <button onClick={() => scrollToSection('home')} className="hover:text-[#d4af37] transition-colors">Home</button>
          <button onClick={() => scrollToSection('about')} className="hover:text-[#d4af37] transition-colors">About</button>
          <button onClick={() => scrollToSection('services')} className="hover:text-[#d4af37] transition-colors">Services</button>
          <button onClick={() => scrollToSection('projects')} className="hover:text-[#d4af37] transition-colors">Projects</button>
          <button onClick={() => scrollToSection('contact')} className="hover:text-[#d4af37] transition-colors">Contact</button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white focus:outline-none">
            {isMobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-lg border-t border-white/10 flex flex-col items-center py-8 space-y-6">
          <button onClick={() => scrollToSection('home')} className="text-white text-lg uppercase tracking-widest hover:text-[#d4af37]">Home</button>
          <button onClick={() => scrollToSection('about')} className="text-white text-lg uppercase tracking-widest hover:text-[#d4af37]">About</button>
          <button onClick={() => scrollToSection('services')} className="text-white text-lg uppercase tracking-widest hover:text-[#d4af37]">Services</button>
          <button onClick={() => scrollToSection('projects')} className="text-white text-lg uppercase tracking-widest hover:text-[#d4af37]">Projects</button>
          <button onClick={() => scrollToSection('contact')} className="text-white text-lg uppercase tracking-widest hover:text-[#d4af37]">Contact</button>
        </div>
      )}
    </nav>
  );
}

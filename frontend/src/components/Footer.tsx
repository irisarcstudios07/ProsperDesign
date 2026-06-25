import { FiInstagram, FiFacebook, FiTwitter, FiLinkedin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-[#121212] pt-24 pb-12 px-6 md:px-12 border-t border-white/5 text-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="text-2xl font-bold tracking-widest uppercase mb-6">
              Prosper<span className="text-[#d4af37]">.</span>
            </div>
            <p className="text-gray-400 font-light leading-relaxed mb-8">
              Crafting timeless spaces that elevate the human experience. Premium construction, interiors, and landscape design.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/prosper_designs17" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center border border-white/20 rounded-full hover:bg-[#d4af37] hover:border-[#d4af37] hover:text-black transition-colors"><FiInstagram /></a>
              <a href="#" className="w-10 h-10 flex items-center justify-center border border-white/20 rounded-full hover:bg-[#d4af37] hover:border-[#d4af37] hover:text-black transition-colors"><FiFacebook /></a>
              <a href="#" className="w-10 h-10 flex items-center justify-center border border-white/20 rounded-full hover:bg-[#d4af37] hover:border-[#d4af37] hover:text-black transition-colors"><FiTwitter /></a>
              <a href="#" className="w-10 h-10 flex items-center justify-center border border-white/20 rounded-full hover:bg-[#d4af37] hover:border-[#d4af37] hover:text-black transition-colors"><FiLinkedin /></a>
            </div>
          </div>
          
          <div>
            <h4 className="uppercase tracking-widest font-bold mb-6 text-sm">Quick Links</h4>
            <ul className="space-y-4 font-light text-gray-400">
              <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
              <li><a href="#projects" className="hover:text-white transition-colors">Portfolio</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="uppercase tracking-widest font-bold mb-6 text-sm">Services</h4>
            <ul className="space-y-4 font-light text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Constructions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Interior Design</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Landscape</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Water Bodies</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Playstation</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="uppercase tracking-widest font-bold mb-6 text-sm">Contact Info</h4>
            <ul className="space-y-4 font-light text-gray-400">
              <li>97005 21522</li>
              <li><a href="mailto:prosperdesigns17@gmail.com" className="hover:text-white transition-colors break-all">prosperdesigns17@gmail.com</a></li>
              <li className="pt-2">
                BALLAM VARI STREET,<br />
                RAMAVARAPADU,<br />
                VIJAYAWADA
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-light text-gray-500">
          <p>&copy; {new Date().getFullYear()} Prosper Design. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

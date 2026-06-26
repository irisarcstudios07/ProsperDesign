import { useState } from 'react';

const categories = ['All', 'Landscape', 'Water Bodies', 'Interior Design', 'Constructions', 'Playstation'];

const portfolioItems = [
  { id: 1, title: 'Serene Garden', category: 'Landscape', img: '/land1.jpg' },
  { id: 2, title: 'Luxury Pool', category: 'Water Bodies', img: '/water1.jpg' },
  { id: 3, title: 'Modern Living', category: 'Interior Design', img: '/interior1.jpg' },
  { id: 4, title: 'Urban Park', category: 'Landscape', img: '/land2.jpg' },
  { id: 5, title: 'Infinity Edge', category: 'Water Bodies', img: '/water2.jpg' },
  { id: 6, title: 'Minimalist Bedroom', category: 'Interior Design', img: '/interior2.jpg' },
  { id: 7, title: 'Zen Pathway', category: 'Landscape', img: '/land3.jpg' },
  { id: 8, title: 'Cascading Fall', category: 'Water Bodies', img: '/water3.jpeg' },
  { id: 9, title: 'Elegant Kitchen', category: 'Interior Design', img: '/interior4.jpg' },
  { id: 10, title: 'Contemporary Villa', category: 'Constructions', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop' },
  { id: 'play1', title: 'Playstation Project 1', category: 'Playstation', img: '/Play1.jpg' },
  { id: 'play2', title: 'Playstation Project 2', category: 'Playstation', img: '/play2.jpg' },
  { id: 'play3', title: 'Playstation Project 3', category: 'Playstation', img: '/play3.jpg' },
];

export default function Services() {
  const [activeTab, setActiveTab] = useState('All');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const filteredItems = activeTab === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeTab);

  return (
    <section id="services" className="py-24 md:py-32 bg-[#1A2A40] text-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <h3 className="text-[#d4af37] uppercase tracking-widest text-sm font-bold mb-4">Our Expertise</h3>
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-wider mb-6">Services</h2>
            <p className="text-gray-400 font-light text-lg">
              Explore our diverse range of premium services tailored to bring your ultimate vision to life.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-6 py-2 rounded-full border transition-all duration-300 text-sm tracking-wider uppercase ${
                  activeTab === cat 
                    ? 'border-[#d4af37] bg-[#d4af37] text-black font-bold' 
                    : 'border-white/20 text-gray-300 hover:border-white hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry-style Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-xl cursor-pointer break-inside-avoid bg-[#2A4365]"
              onClick={() => setLightboxImg(item.img)}
            >
              <img 
                src={item.img} 
                alt={item.title} 
                loading="lazy"
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <p className="text-[#d4af37] text-sm uppercase tracking-widest mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{item.category}</p>
                <h3 className="text-2xl font-bold text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {lightboxImg && (
          <div 
            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 md:p-12 backdrop-blur-sm cursor-pointer"
            onClick={() => setLightboxImg(null)}
          >
            <img 
              src={lightboxImg} 
              alt="Preview" 
              className="max-w-full max-h-full object-contain shadow-2xl rounded"
            />
            <button 
              className="absolute top-6 right-6 text-white text-4xl hover:text-[#d4af37] transition-colors"
              onClick={() => setLightboxImg(null)}
            >
              &times;
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

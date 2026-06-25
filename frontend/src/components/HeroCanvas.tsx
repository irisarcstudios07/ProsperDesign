import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 40; // Since there are 40 frames available currently

const currentFrame = (index: number) => 
  `/frames/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`;

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === FRAME_COUNT) {
          setImages(loadedImages);
          setLoaded(true);
        }
      };
      loadedImages.push(img);
    }
  }, []);

  useEffect(() => {
    if (!loaded || images.length === 0 || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render(0); // initial render
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const sequence = {
      frame: 0
    };

    const render = (index: number) => {
      if (images[index]) {
        // Draw image covering the whole canvas like object-fit: cover
        const img = images[index];
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio);
        const centerShift_x = (canvas.width - img.width * ratio) / 2;
        const centerShift_y = (canvas.height - img.height * ratio) / 2;  
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          centerShift_x,
          centerShift_y,
          img.width * ratio,
          img.height * ratio
        );
      }
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=300%', // 300% of viewport height scrolling to complete animation
        scrub: 0.5,
        pin: true,
      }
    });

    tl.to(sequence, {
      frame: FRAME_COUNT - 1,
      snap: 'frame',
      ease: 'none',
      onUpdate: () => render(sequence.frame)
    });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [loaded, images]);

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center text-white z-20">
          Loading...
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      
      {/* Overlay Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold tracking-wider text-white mb-4 uppercase">
          Prosper Design
        </h1>
        <p className="text-lg md:text-2xl text-gray-200 mb-2 font-light tracking-widest">
          Construction &bull; Interiors &bull; Landscape
        </p>
        <p className="text-md md:text-xl text-gray-300 mb-8 font-light italic">
          Crafting Timeless Spaces.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="px-8 py-3 border border-white/50 text-white hover:bg-white hover:text-black transition-colors duration-300 tracking-widest text-sm uppercase">
            Explore Projects
          </button>
          <button className="px-8 py-3 bg-[#d4af37] text-black border border-[#d4af37] hover:bg-transparent hover:text-[#d4af37] transition-colors duration-300 tracking-widest text-sm uppercase font-medium">
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
}

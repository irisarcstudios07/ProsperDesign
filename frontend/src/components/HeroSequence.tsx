import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 40;

const currentFrame = (index: number) => 
  `/frames/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`;

export default function HeroSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedPercent, setLoadedPercent] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      img.onload = () => {
        loadedCount++;
        setLoadedPercent(Math.round((loadedCount / FRAME_COUNT) * 100));
        if (loadedCount === FRAME_COUNT) {
          setImages(loadedImages);
          setIsLoaded(true);
        }
      };
      img.onerror = () => {
        errorCount++;
        setHasError(true);
      };
      loadedImages.push(img);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || images.length === 0 || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    const render = (index: number) => {
      if (images[index]) {
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

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render(sequence.frame); 
    };

    const sequence = { frame: 0 };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Initial render

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=150%', // Scroll range = 150vh
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
  }, [isLoaded, images]);

  if (hasError) {
    return (
      <div className="w-full h-screen bg-[#1D2B42] flex items-center justify-center text-red-500 font-bold text-2xl">
        Frame loading error
      </div>
    );
  }

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#1D2B42] overflow-hidden">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-white z-20 text-3xl font-bold bg-[#1D2B42]">
          Loading... {loadedPercent}%
        </div>
      )}
      
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full object-cover z-0 ${!isLoaded ? 'opacity-0' : 'opacity-100'}`}
      />
      
      {/* Test Overlay */}
      {isLoaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#1D2B42]/40 text-center px-4 pointer-events-none">
          <h1 className="text-5xl md:text-7xl font-bold tracking-wider text-white mb-4 uppercase">
            Prosper Design
          </h1>
        </div>
      )}
    </section>
  );
}

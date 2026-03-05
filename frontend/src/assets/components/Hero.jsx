import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-navy-deep">
      
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <img 
          alt="Luxury Hotel Lobby" 
          className="w-full h-full object-cover scale-105 animate-[ken-burns_20s_ease-in-out_infinite]"
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/80 via-navy-deep/50 to-navy-deep/90 z-10"></div>
      </div>

      
      <div className="relative z-20 text-center px-4 max-w-6xl w-full pt-32 lg:pt-30 pb-40">
        <span className="text-primary uppercase tracking-[0.5em] text-[10px] lg:text-xs font-bold mb-6 block drop-shadow-md">
          Vietnam's Premiere Luxury Destination
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[100px] text-white mb-8 leading-[1.1] drop-shadow-xl italic">
          Where <span className="not-italic">European Elegance</span><br/> Meets Vietnamese Soul
        </h1>
        <p className="text-white/80 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed mb-12 drop-shadow-md">
          An architectural masterpiece blending Neoclassical grandeur with the delicate artistry of Vietnam. Discover a sanctuary of unparalleled luxury in the heart of the city.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <button onClick={() => navigate('/room-map')} className="bg-primary text-navy-deep px-10 py-4 rounded-sm font-bold uppercase tracking-[0.2em] text-xs transition-all hover:bg-white hover:scale-105 active:scale-95 shadow-2xl cursor-pointer">
            Book Your Stay
          </button>
          <button onClick={() => navigate('/room-map')} className="border-2 border-white text-white bg-transparent px-10 py-4 rounded-sm font-bold uppercase tracking-[0.2em] text-xs transition-all hover:bg-white hover:text-navy-deep cursor-pointer">
            Explore Rooms
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/60 flex flex-col items-center">
        <span className="text-[10px] uppercase tracking-[0.3em] mb-3">Discover More</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent animate-pulse"></div>
      </div>

      <style>{`
        @keyframes ken-burns {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
import React from 'react';

const Introduction = () => {
  return (
    <section id='accommodations' className="py-24 lg:py-40 bg-bg-light overflow-hidden">
      <div className="container mx-auto px-8 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <div className="relative">
            <div className="aspect-[4/5] rounded-lg overflow-hidden relative z-10 shadow-2xl">
              <img 
                alt="Luxury Suite" 
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" 
                src="https://media.cntraveler.com/photos/684b1b0f81d45e2f79735799/16:9/w_2992,h_1683,c_limit/The-Living-Room.jpg"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-10 -right-10 w-2/3 aspect-square border-2 border-primary/20 rounded-lg -z-0"></div>
            <div className="absolute -top-10 -left-10 p-16 bg-primary/10 rounded-full blur-3xl -z-0"></div>
          </div>

          <div className="space-y-8">
            <div className="w-16 h-[2px] bg-primary"></div>
            <h2 className="font-serif text-4xl lg:text-6xl leading-[1.15] text-navy-deep">
              A Legacy of Refinement <br/>and Cultural Grace
            </h2>
            <p className="text-navy-deep/70 leading-loose text-lg font-light">
              LA MAISON DTN is more than a hotel; it is a curated gallery of living. Every corner tells a story of heritage, from the Italian marble flooring that echoes European palaces to the hand-applied Vietnamese lacquer art that celebrates local soul.
            </p>
            
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <h4 className="font-bold text-primary text-3xl mb-1">15m</h4>
                <p className="text-[10px] uppercase tracking-[0.2em] font-semibold opacity-40">Vaulted Ceilings</p>
              </div>
              <div>
                <h4 className="font-bold text-primary text-3xl mb-1">24/7</h4>
                <p className="text-[10px] uppercase tracking-[0.2em] font-semibold opacity-40">Private Butler Service</p>
              </div>
            </div>

            <button className="flex items-center space-x-4 group pt-4">
              <span className="text-xs font-bold uppercase tracking-[0.2em] border-b border-navy-deep pb-1 group-hover:border-primary group-hover:text-primary transition-all">Learn Our Story</span>
              <span className="material-icons-outlined text-primary group-hover:translate-x-2 transition-transform">arrow_forward</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Introduction;
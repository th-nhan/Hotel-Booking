import React from 'react';

const ExperienceCard = ({ title, description, imageUrl, cta, offset }) => (
  <div className={`group cursor-pointer ${offset ? 'lg:mt-24' : ''}`}>
    <div className="relative aspect-[3/4] overflow-hidden rounded-xl mb-8 shadow-xl">
      <img 
        alt={title} 
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
        src={imageUrl}
      />
      <div className="absolute inset-0 bg-navy-deep/10 group-hover:bg-navy-deep/30 transition-colors duration-500"></div>
    </div>
    <h4 className="font-serif text-3xl mb-3 text-navy-deep">{title}</h4>
    <p className="text-sm text-navy-deep/60 font-light mb-6 leading-relaxed">
      {description}
    </p>
    <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-primary border-b border-transparent group-hover:border-primary transition-all">
      {cta}
    </span>
  </div>
);

const Experiences = () => {
  const experiences = [
    {
      title: "Gastronomic Art",
      description: "Michelin-star inspired cuisine blending French techniques with Vietnamese spices in a breathtaking neoclassical setting.",
      imageUrl: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/12/30/1132697/321722584_1123230561.jpg",
      cta: "Explore Dining",
    },
    {
      title: "Holistic Sanctuary",
      description: "Rejuvenate your senses with traditional herbal therapies and modern treatments designed for the ultimate relaxation.",
      imageUrl: "https://acihome.vn/uploads/19/spa-area-at-mist-hotel.jpg",
      cta: "Discover Spa",
      offset: true,
    },
    {
      title: "Grand Celebrations",
      description: "Bespoke events hosted in our neoclassical ballroom with 24k gold leaf accents and world-class hospitality.",
      imageUrl: "https://pkphoto.com/wp-content/uploads/2023/06/5O1A4118-scaled-1.jpg",
      cta: "View Venues",
    }
  ];

  return (
    <section id='experiences' className="pb-40 bg-bg-light">
      <div className="container mx-auto px-8 lg:px-16">
        <div className="text-center mb-24">
          <h3 className="font-serif text-4xl lg:text-5xl mb-6 italic text-navy-deep">The DTN Experience</h3>
          <p className="text-navy-deep/50 uppercase tracking-[0.3em] text-[10px] font-bold">Curated moments for the discerning traveler</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {experiences.map((exp, idx) => (
            <ExperienceCard key={idx} {...exp} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experiences;
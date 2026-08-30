import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const ExperienceCard = ({ title, description, imageUrl, cta, offset, onClick }) => (
  <div onClick={onClick} className={`group cursor-pointer ${offset ? 'lg:mt-24' : ''}`}>
    <div className="relative aspect-[3/4] overflow-hidden rounded-xl mb-8 shadow-xl">
      <img 
        alt={title} 
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
        src={imageUrl}
      />
      <div className="absolute inset-0 bg-navy-deep/10 group-hover:bg-navy-deep/30 transition-colors duration-500"></div>
    </div>
    <h4 className="font-serif text-3xl mb-3 text-navy-deep group-hover:text-primary transition-colors">{title}</h4>
    <p className="text-sm text-navy-deep/60 font-light mb-6 leading-relaxed">
      {description}
    </p>
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-primary border-b border-transparent group-hover:border-primary transition-all cursor-pointer bg-transparent"
    >
      {cta}
    </button>
  </div>
);

const Experiences = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const scrollRef = React.useRef(null);

  const experiences = [
    {
      id: 'gastronomy',
      title: t('experiences.gastronomyTitle'),
      description: t('experiences.gastronomyDesc'),
      imageUrl: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/12/30/1132697/321722584_1123230561.jpg",
      cta: t('experiences.gastronomyCta'),
      path: '/experiences/gastronomy'
    },
    {
      id: 'sanctuary',
      title: t('experiences.sanctuaryTitle'),
      description: t('experiences.sanctuaryDesc'),
      imageUrl: "https://acihome.vn/uploads/19/spa-area-at-mist-hotel.jpg",
      cta: t('experiences.sanctuaryCta'),
      offset: true,
      path: '/experiences/sanctuary'
    },
    {
      id: 'celebrations',
      title: t('experiences.celebrationsTitle'),
      description: t('experiences.celebrationsDesc'),
      imageUrl: "https://pkphoto.com/wp-content/uploads/2023/06/5O1A4118-scaled-1.jpg",
      cta: t('experiences.celebrationsCta'),
      path: '/experiences/celebrations'
    }
  ];

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollPosition = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.offsetWidth * 0.82;
      const newIndex = Math.round(scrollPosition / cardWidth);
      setActiveIndex(Math.min(Math.max(newIndex, 0), experiences.length - 1));
    }
  };

  const scrollToIndex = (index) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.offsetWidth * 0.82;
      scrollRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };

  return (
    <section id='experiences' className="pb-32 sm:pb-40 bg-bg-light">
      <div className="container mx-auto px-4 sm:px-8 lg:px-16">
        <div className="text-center mb-12 sm:mb-24">
          <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl mb-4 sm:mb-6 italic text-navy-deep">{t('experiences.title')}</h3>
          <p className="text-navy-deep/50 uppercase tracking-[0.3em] text-[10px] font-bold">{t('experiences.subtitle')}</p>
        </div>
        
        {/* Mobile Swipeable Carousel & Desktop Grid */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-12 lg:gap-16 overflow-x-auto md:overflow-visible no-scrollbar snap-x snap-mandatory px-4 md:px-0 pb-4 md:pb-0 [touch-action:pan-x] [-webkit-overflow-scrolling:touch]"
        >
          {experiences.map((exp) => (
            <div 
              key={exp.id}
              className="w-[82vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none md:shrink"
            >
              <ExperienceCard 
                {...exp} 
                onClick={() => navigate(exp.path)}
              />
            </div>
          ))}
        </div>

        {/* Mobile Pagination Indicator Dots */}
        <div className="flex md:hidden items-center justify-center gap-2 pt-6">
          {experiences.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === idx ? 'w-8 bg-primary' : 'w-2 bg-navy-deep/20'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experiences;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useLanguage } from '../../context/LanguageContext';

const Heritage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const milestones = [
    {
      year: t('heritage.milestone1Year'),
      title: t('heritage.milestone1Title'),
      desc: t('heritage.milestone1Desc'),
      icon: 'architecture',
    },
    {
      year: t('heritage.milestone2Year'),
      title: t('heritage.milestone2Title'),
      desc: t('heritage.milestone2Desc'),
      icon: 'brush',
    },
    {
      year: t('heritage.milestone3Year'),
      title: t('heritage.milestone3Title'),
      desc: t('heritage.milestone3Desc'),
      icon: 'hotel',
    },
    {
      year: t('heritage.milestone4Year'),
      title: t('heritage.milestone4Title'),
      desc: t('heritage.milestone4Desc'),
      icon: 'auto_awesome',
    },
  ];

  const pillars = [
    {
      icon: 'account_balance',
      title: t('heritage.pillar1Title'),
      desc: t('heritage.pillar1Desc'),
    },
    {
      icon: 'palette',
      title: t('heritage.pillar2Title'),
      desc: t('heritage.pillar2Desc'),
    },
    {
      icon: 'room_service',
      title: t('heritage.pillar3Title'),
      desc: t('heritage.pillar3Desc'),
    },
  ];

  const galleryItems = [
    {
      img: 'https://media.cntraveler.com/photos/684b1b0f81d45e2f79735799/16:9/w_2992,h_1683,c_limit/The-Living-Room.jpg',
      title: t('heritage.galleryImg1Title'),
      desc: t('heritage.galleryImg1Desc'),
    },
    {
      img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      title: t('heritage.galleryImg2Title'),
      desc: t('heritage.galleryImg2Desc'),
    },
    {
      img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      title: t('heritage.galleryImg3Title'),
      desc: t('heritage.galleryImg3Desc'),
    },
    {
      img: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
      title: t('heritage.galleryImg4Title'),
      desc: t('heritage.galleryImg4Desc'),
    },
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-bg-light text-navy-deep font-display">
      {/* Navigation */}
      <Navbar scrolled={scrolled} hideNavItems={true} />

      {/* Hero Header */}
      <section className="relative pt-36 pb-24 lg:pt-48 lg:pb-32 bg-navy-deep text-white overflow-hidden">
        {/* Background Image with Dark Vignette Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://media.cntraveler.com/photos/684b1b0f81d45e2f79735799/16:9/w_2992,h_1683,c_limit/The-Living-Room.jpg"
            alt="LA MAISON DTN Heritage"
            className="w-full h-full object-cover opacity-25 scale-105 transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/80 to-navy-deep/60" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-6">
          {/* Breadcrumbs */}
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-primary/90">
            <button
              onClick={() => navigate('/')}
              className="hover:underline hover:text-white transition-colors cursor-pointer"
            >
              {t('heritage.backHome')}
            </button>
            <span>/</span>
            <span className="text-white/70">{t('heritage.currentLocation')}</span>
          </div>

          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold uppercase tracking-[0.2em]">
            {t('heritage.badge')}
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight max-w-4xl mx-auto">
            {t('heritage.pageTitle')}
          </h1>

          <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            {t('heritage.pageSubtitle')}
          </p>

          <div className="flex justify-center pt-4">
            <div className="w-24 h-[2px] bg-primary"></div>
          </div>
        </div>
      </section>

      {/* Chapter 1: The Origin & Architecture */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Column: Story Content */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-primary text-xs font-bold uppercase tracking-[0.25em]">
                <span className="w-8 h-[2px] bg-primary"></span>
                <span>{t('heritage.originTag')}</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-navy-deep leading-snug">
                {t('heritage.originTitle')}
              </h2>

              <p className="text-navy-deep/80 leading-relaxed text-base sm:text-lg font-light">
                {t('heritage.originDesc1')}
              </p>

              <p className="text-navy-deep/80 leading-relaxed text-base sm:text-lg font-light">
                {t('heritage.originDesc2')}
              </p>

              {/* Stats Counters */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-navy-deep/10">
                <div>
                  <h3 className="font-serif font-bold text-3xl sm:text-4xl text-primary mb-1">5+</h3>
                  <p className="text-xs uppercase tracking-wider text-navy-deep/60 font-semibold">{t('heritage.statYears')}</p>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-3xl sm:text-4xl text-primary mb-1">100+</h3>
                  <p className="text-xs uppercase tracking-wider text-navy-deep/60 font-semibold">{t('heritage.statCraftsmen')}</p>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-3xl sm:text-4xl text-primary mb-1">50+</h3>
                  <p className="text-xs uppercase tracking-wider text-navy-deep/60 font-semibold">{t('heritage.statArtworks')}</p>
                </div>
              </div>
            </div>

            {/* Right Column: Layered Images with Gold Frame */}
            <div className="relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl aspect-[4/5] border border-navy-deep/5">
                <img
                  src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"
                  alt="Neoclassical Architecture"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              {/* Secondary Floating Accent Image */}
              <div className="hidden sm:block absolute -bottom-8 -left-8 z-20 w-1/2 aspect-square rounded-xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"
                  alt="Vietnamese Artistry"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative Gold Backdrop Frame */}
              <div className="absolute -top-6 -right-6 w-full h-full border-2 border-primary/30 rounded-2xl -z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="py-20 lg:py-28 bg-bg-light border-y border-navy-deep/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="w-12 h-[2px] bg-primary mx-auto"></div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-navy-deep">
              {t('heritage.pillarsTitle')}
            </h2>
            <p className="text-navy-deep/70 text-base sm:text-lg font-light">
              {t('heritage.pillarsSubtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg border border-navy-deep/5 hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center space-y-5 group"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary text-primary group-hover:text-navy-deep flex items-center justify-center transition-colors duration-300">
                  <span className="material-icons-outlined text-3xl">{pillar.icon}</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-navy-deep">
                  {pillar.title}
                </h3>
                <p className="text-navy-deep/70 text-sm sm:text-base leading-relaxed font-light">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <div className="flex items-center justify-center gap-3 text-primary text-xs font-bold uppercase tracking-[0.25em]">
              <span className="w-8 h-[2px] bg-primary"></span>
              <span>{t('heritage.timelineTag')}</span>
              <span className="w-8 h-[2px] bg-primary"></span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-navy-deep">
              {t('heritage.timelineTitle')}
            </h2>
          </div>

          <div className="relative border-l-2 border-primary/30 ml-4 sm:ml-32 space-y-12 pb-4">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative pl-8 sm:pl-12 group">
                {/* Year tag for larger screens */}
                <div className="hidden sm:block absolute -left-32 top-0.5 text-right w-24">
                  <span className="font-serif font-bold text-xl text-primary group-hover:text-navy-deep transition-colors">
                    {m.year}
                  </span>
                </div>

                {/* Timeline Node Dot */}
                <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-white border-2 border-primary group-hover:bg-primary group-hover:border-navy-deep flex items-center justify-center shadow-md transition-colors">
                  <span className="material-icons-outlined text-xs text-primary group-hover:text-white">
                    {m.icon}
                  </span>
                </div>

                {/* Mobile Year Badge */}
                <div className="sm:hidden mb-2">
                  <span className="inline-block px-2.5 py-0.5 rounded bg-primary/20 text-navy-deep text-xs font-bold font-serif">
                    {m.year}
                  </span>
                </div>

                {/* Content Box */}
                <div className="bg-bg-light p-6 sm:p-8 rounded-xl border border-navy-deep/5 shadow-sm group-hover:shadow-md transition-all">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-navy-deep mb-2">
                    {m.title}
                  </h3>
                  <p className="text-navy-deep/75 text-sm sm:text-base leading-relaxed font-light">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full-width Quote & Philosophy */}
      <section className="py-20 lg:py-28 bg-navy-deep text-white relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 -top-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-6">
          <span className="material-icons-outlined text-primary text-5xl">format_quote</span>
          <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl leading-relaxed italic text-white/95">
            {t('heritage.quote')}
          </blockquote>
          <div className="pt-4">
            <h4 className="font-bold text-primary tracking-wider uppercase text-sm sm:text-base">
              {t('heritage.quoteAuthor')}
            </h4>
            <p className="text-xs text-white/60 uppercase tracking-[0.2em] mt-1">
              {t('heritage.quoteRole')}
            </p>
          </div>
        </div>
      </section>

      {/* Visual Gallery */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="flex items-center justify-center gap-3 text-primary text-xs font-bold uppercase tracking-[0.25em]">
              <span className="w-8 h-[2px] bg-primary"></span>
              <span>{t('heritage.galleryTag')}</span>
              <span className="w-8 h-[2px] bg-primary"></span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-navy-deep">
              {t('heritage.galleryTitle')}
            </h2>
            <p className="text-navy-deep/70 text-base sm:text-lg font-light">
              {t('heritage.gallerySubtitle')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryItems.map((item, idx) => (
              <div
                key={idx}
                className="group relative rounded-xl overflow-hidden aspect-[3/4] shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <h4 className="font-serif text-lg font-bold mb-1 text-primary group-hover:text-white transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-white/80 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 lg:py-24 bg-bg-light border-t border-navy-deep/10 text-center">
        <div className="max-w-3xl mx-auto px-6 space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-navy-deep">
            {t('heritage.ctaTitle')}
          </h2>
          <p className="text-navy-deep/70 text-base sm:text-lg font-light max-w-xl mx-auto">
            {t('heritage.ctaSubtitle')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('/room-map')}
              className="bg-primary hover:bg-navy-deep hover:text-white text-navy-deep font-bold px-8 py-3.5 rounded-md text-xs uppercase tracking-widest transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
            >
              {t('heritage.ctaBook')}
            </button>
            <button
              onClick={() => navigate('/')}
              className="border border-navy-deep/30 hover:border-navy-deep text-navy-deep font-semibold px-8 py-3.5 rounded-md text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer hover:bg-white"
            >
              {t('heritage.backHome')}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Heritage;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Utensils,
  Sparkles,
  Heart,
  Calendar,
  Clock,
  Users,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Phone,
  Mail,
  Wine,
  Flame,
  Award,
  ArrowLeft,
  X,
  FileText,
  Star,
  Info,
  Droplets,
  Crown,
  Building2,
  Waves,
  Leaf,
  ShieldCheck,
  Compass,
  Smile
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useLanguage } from '../../context/LanguageContext';
import { WELLNESS_TREATMENTS, EXPERIENCES_DATA } from '../../data/experiencesData';

const ExperienceDetail = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  // Xử lý các bí danh slug (wellness / spa -> sanctuary)
  const resolvedSlug = (slug || searchParams.get('type') || '').toLowerCase();
  const activeSlug = (resolvedSlug === 'wellness' || resolvedSlug === 'spa' || resolvedSlug === 'signature-experiences')
    ? 'sanctuary'
    : (EXPERIENCES_DATA[resolvedSlug] ? resolvedSlug : (slug ? 'gastronomy' : 'sanctuary'));

  const currentExp = EXPERIENCES_DATA[activeSlug] || EXPERIENCES_DATA.sanctuary;

  const pkgParam = searchParams.get('package');
  const reserveParam = searchParams.get('reserve');

  const getPackageTitle = (pkg, lang) => {
    if (!pkg) return '';
    if (pkg === 'salt-therapy' || pkg === 'salt') {
      return lang === 'vi' ? 'Liệu Pháp Muối Hồng Himalaya' : 'Himalayan Pink Salt Inhalation Chamber';
    } else if (pkg === 'steam-room' || pkg === 'steam') {
      return lang === 'vi' ? 'Phòng Xông Hơi Cẩm Thạch & Thủy Liệu' : 'Italian Marble Steam & Hydrotherapy Circuit';
    } else if (pkg === 'royal' || pkg === 'royal-awakening') {
      return lang === 'vi' ? 'Đánh Thức Năng Lượng Hoàng Gia' : 'The Royal Awakening Full-Day Odyssey';
    } else if (pkg === 'gold-radiance') {
      return lang === 'vi' ? 'Liệu Trình Trẻ Hóa Dát Vàng 24k' : 'Imperial 24k Gold Radiance Facial';
    } else if (pkg === 'oriental-herbal') {
      return lang === 'vi' ? 'Trị Liệu Thảo Dược Cổ Truyền Đông Y' : 'Oriental Herbal Compress & Deep Tissue Ritual';
    } else if (pkg === 'vitality-bath') {
      return lang === 'vi' ? 'Bồn Ngâm Thủy Lực Suối Khoáng & Thảo Mộc' : 'Private Thermal Mineral Bath & Vitality Soak';
    }
    return pkg;
  };

  const [scrolled, setScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(() => Boolean(reserveParam === 'true' || pkgParam));
  const [selectedRitual, setSelectedRitual] = useState(null);
  const [treatmentCategory, setTreatmentCategory] = useState('all');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingCode, setBookingCode] = useState('');

  const [formData, setFormData] = useState(() => ({
    fullName: '',
    phone: '',
    email: '',
    date: new Date().toISOString().split('T')[0],
    time: '14:30',
    guests: '2',
    packageOption: getPackageTitle(pkgParam, language),
    notes: ''
  }));

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setBookingSuccess(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const prefix = activeSlug === 'sanctuary' ? 'SPA' : activeSlug.substring(0, 3).toUpperCase();
    const generatedCode = 'DTN-' + prefix + '-' + Math.floor(100000 + Math.random() * 900000);
    setBookingCode(generatedCode);
    setBookingSuccess(true);
  };

  const handleOpenBookingWithPackage = (pkgTitle) => {
    setFormData((prev) => ({
      ...prev,
      packageOption: pkgTitle
    }));
    setIsModalOpen(true);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedRitual) setSelectedRitual(null);
        if (isModalOpen) closeModal();
      }
    };
    if (isModalOpen || selectedRitual) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, selectedRitual]);

  // Filter treatments
  const filteredTreatments = WELLNESS_TREATMENTS.filter((t) => {
    if (treatmentCategory === 'all') return true;
    return t.category === treatmentCategory;
  });

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#fdfbf7] dark:bg-[#15130e] text-slate-900 dark:text-slate-100 font-sans selection:bg-[#d4af35]/30">
      {/* Navigation Header */}
      <Navbar scrolled={scrolled} hideNavItems={true} />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 lg:pt-48 lg:pb-28 bg-[#1a1814] text-white overflow-hidden">
        {/* Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src={currentExp.heroImage}
            alt={language === 'vi' ? currentExp.titleVi : currentExp.titleEn}
            className="w-full h-full object-cover opacity-35 scale-105 transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1814] via-[#1a1814]/80 to-[#1a1814]/50" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#d4af35]/15 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-6">
          {/* Breadcrumbs */}
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-[#d4af35]">
            <button
              onClick={() => navigate('/')}
              className="hover:underline hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft size={13} />
              <span>{t('navbar.home') || 'Trang chủ'}</span>
            </button>
            <span>/</span>
            <span className="text-white/70">
              {language === 'vi' ? 'Trải nghiệm' : 'Experiences'}
            </span>
            <span>/</span>
            <span className="text-[#d4af35] font-bold">
              {language === 'vi' ? currentExp.badgeVi : currentExp.badgeEn}
            </span>
          </div>

          {/* Badge */}
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#d4af35]/15 border border-[#d4af35]/40 text-[#d4af35] text-xs font-bold uppercase tracking-[0.2em]">
            {language === 'vi' ? currentExp.badgeVi : currentExp.badgeEn}
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white max-w-4xl mx-auto">
            {language === 'vi' ? currentExp.titleVi : currentExp.titleEn}
          </h1>

          {/* Subtitle */}
          <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            {language === 'vi' ? currentExp.subtitleVi : currentExp.subtitleEn}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3.5 rounded-xl bg-[#d4af35] text-[#1a1814] font-bold text-xs uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-lg shadow-[#d4af35]/25 cursor-pointer flex items-center gap-2"
            >
              <Calendar size={16} />
              <span>{language === 'vi' ? currentExp.primaryCtaVi : currentExp.primaryCtaEn}</span>
            </button>

            {currentExp.secondaryUrl && (
              <button
                onClick={() => navigate(currentExp.secondaryUrl)}
                className="px-8 py-3.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/15 text-white font-semibold text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2"
              >
                <Compass size={16} className="text-[#d4af35]" />
                <span>{language === 'vi' ? currentExp.secondaryCtaVi : currentExp.secondaryCtaEn}</span>
              </button>
            )}
          </div>

          {/* Experience Category Switcher */}
          <div className="pt-8 sm:pt-10 w-full max-w-4xl mx-auto px-1 sm:px-4">
            <div className="relative w-full">
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#1a1814] to-transparent z-10 sm:hidden"></div>
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#1a1814] to-transparent z-10 sm:hidden"></div>

              <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar scroll-smooth py-2 px-4 sm:px-2 sm:justify-center [touch-action:pan-x] [-webkit-overflow-scrolling:touch]">
                {Object.values(EXPERIENCES_DATA).map((exp) => {
                  const Icon = exp.icon;
                  const isActive = exp.slug === activeSlug;
                  return (
                    <button
                      key={exp.slug}
                      onClick={() => navigate(`/experiences/${exp.slug}`)}
                      className={`shrink-0 flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer whitespace-nowrap select-none ${
                        isActive
                          ? 'bg-[#d4af35] text-[#1a1814] shadow-lg shadow-[#d4af35]/30 font-extrabold ring-2 ring-[#d4af35]/60 scale-[1.02]'
                          : 'bg-white/10 text-white/80 hover:text-white hover:bg-white/20 border border-white/15 backdrop-blur-md'
                      }`}
                    >
                      <Icon size={14} className={`shrink-0 ${isActive ? 'text-[#1a1814]' : 'text-[#d4af35]'}`} />
                      <span>{language === 'vi' ? exp.badgeVi : exp.badgeEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white dark:bg-[#1e1b15] border-b border-[#d4af35]/20 py-8 shadow-sm relative z-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {currentExp.stats.map((stat, idx) => (
            <div key={idx} className="p-2 space-y-1">
              <span className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#d4af35] block">
                {stat.value}
              </span>
              <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">
                {language === 'vi' ? stat.labelVi : stat.labelEn}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-20 lg:py-28 bg-[#fdfbf7] dark:bg-[#15130e]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="w-12 h-[2px] bg-[#d4af35] mx-auto"></div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-slate-900 dark:text-white">
              {language === 'vi' ? 'Đặc Quyền Trải Nghiệm Điểm Nhấn' : 'Curated Signature Highlights'}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base font-light">
              {language === 'vi'
                ? 'Mỗi khoảnh khắc tại La Maison DTN được tạo tác tỉ mỉ để tôn vinh sự tinh tế và mang đến cảm xúc trọn vẹn nhất cho quý khách.'
                : 'Every touchpoint is designed with unmatched devotion to elevate your senses and create enduring memories.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {currentExp.highlights.map((item, idx) => (
              <div
                key={idx}
                className="group bg-white dark:bg-[#201d16] rounded-2xl overflow-hidden shadow-lg border border-[#d4af35]/15 hover:border-[#d4af35]/50 hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={language === 'vi' ? item.titleVi : item.titleEn}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-[#1a1814]/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#d4af35] uppercase tracking-wider border border-[#d4af35]/30">
                    {item.tag}
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#d4af35] transition-colors">
                      {language === 'vi' ? item.titleVi : item.titleEn}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm font-light leading-relaxed">
                      {language === 'vi' ? item.descVi : item.descEn}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      handleOpenBookingWithPackage(language === 'vi' ? item.titleVi : item.titleEn);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#d4af35] uppercase tracking-wider group-hover:underline cursor-pointer pt-2"
                  >
                    <span>{language === 'vi' ? 'Đặt trải nghiệm này' : 'Book this experience'}</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wellness Signature Treatments Catalog (Chỉ hiển thị khi activeSlug === 'sanctuary') */}
      {activeSlug === 'sanctuary' && (
        <section id="treatment-catalog" className="py-20 lg:py-24 bg-white dark:bg-[#1a1814] border-t border-[#d4af35]/15">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 text-[#d4af35] text-xs font-bold uppercase tracking-[0.2em]">
                <Sparkles size={16} />
                <span>{t('wellness.treatmentMenuTitle')}</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-slate-900 dark:text-white">
                {language === 'vi' ? 'Hành Trình Tái Tạo Thân Tâm' : 'Holistic Healing Menu & Rituals'}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base font-light">
                {t('wellness.treatmentMenuSubtitle')}
              </p>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
                {[
                  { id: 'all', labelVi: 'Tất Cả Liệu Trình', labelEn: 'All Treatments' },
                  { id: 'salt-steam', labelVi: 'Muối & Xông Hơi', labelEn: 'Salt & Steam' },
                  { id: 'royal', labelVi: 'Gói Hoàng Gia', labelEn: 'Royal Packages' },
                  { id: 'facial', labelVi: 'Trẻ Hóa Dát Vàng', labelEn: '24k Gold Facial' },
                  { id: 'herbal', labelVi: 'Thảo Dược & Thủy Liệu', labelEn: 'Herbal & Thermal' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setTreatmentCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      treatmentCategory === cat.id
                        ? 'bg-[#d4af35] text-[#1a1814] shadow-md shadow-[#d4af35]/25 scale-105'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-[#d4af35]/10 hover:text-[#d4af35]'
                    }`}
                  >
                    {language === 'vi' ? cat.labelVi : cat.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Treatment Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTreatments.map((treatment) => (
                <div
                  key={treatment.id}
                  className="group bg-[#fdfbf7] dark:bg-[#221f18] rounded-2xl overflow-hidden border border-[#d4af35]/20 hover:border-[#d4af35] hover:shadow-xl hover:shadow-[#d4af35]/10 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={treatment.image}
                      alt={language === 'vi' ? treatment.titleVi : treatment.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div className="absolute top-3 left-3 bg-[#d4af35] text-[#1a1814] text-[10px] font-bold px-2.5 py-1 rounded shadow uppercase tracking-wider">
                      {language === 'vi' ? treatment.badgeVi : treatment.badgeEn}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold">
                      <span className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded">
                        <Clock size={12} className="text-[#d4af35]" />
                        {language === 'vi' ? treatment.duration : treatment.durationEn}
                      </span>
                      <span className="text-[#d4af35] font-serif text-sm bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded">
                        {language === 'vi' ? treatment.priceVnd : treatment.priceUsd}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white group-hover:text-[#d4af35] transition-colors">
                        {language === 'vi' ? treatment.titleVi : treatment.titleEn}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-light leading-relaxed line-clamp-3">
                        {language === 'vi' ? treatment.descVi : treatment.descEn}
                      </p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between gap-2">
                        <button
                          onClick={() => setSelectedRitual(treatment)}
                          className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#d4af35] flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Info size={14} className="text-[#d4af35]" />
                          <span>{t('wellness.viewRitualDetails')}</span>
                        </button>
                        <button
                          onClick={() => handleOpenBookingWithPackage(language === 'vi' ? treatment.titleVi : treatment.titleEn)}
                          className="px-4 py-2 rounded-lg bg-[#d4af35] text-[#1a1814] font-bold text-xs uppercase tracking-wider hover:bg-[#bfa030] transition-all cursor-pointer shadow-sm"
                        >
                          {t('wellness.reserveNow')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Ritual Detail Modal */}
      {selectedRitual && (
        <div
          onClick={() => setSelectedRitual(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1a1814] border border-[#d4af35]/40 text-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto [scrollbar-width:thin] [scrollbar-color:rgba(212,175,53,0.4)_rgba(255,255,255,0.05)]"
          >
            <button
              onClick={() => setSelectedRitual(null)}
              className="absolute top-4 right-4 text-white/60 hover:text-[#d4af35] p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-[#d4af35] text-xs font-bold uppercase tracking-widest">
                  <Sparkles size={14} />
                  <span>{language === 'vi' ? selectedRitual.badgeVi : selectedRitual.badgeEn}</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  {language === 'vi' ? selectedRitual.titleVi : selectedRitual.titleEn}
                </h3>
                <div className="flex items-center gap-4 text-xs font-semibold text-[#d4af35]">
                  <span>{language === 'vi' ? selectedRitual.duration : selectedRitual.durationEn}</span>
                  <span>•</span>
                  <span>{language === 'vi' ? selectedRitual.priceVnd : selectedRitual.priceUsd}</span>
                </div>
              </div>

              <div className="relative rounded-xl overflow-hidden aspect-[16/9]">
                <img
                  src={selectedRitual.image}
                  alt={language === 'vi' ? selectedRitual.titleVi : selectedRitual.titleEn}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2">
                <h4 className="text-xs uppercase tracking-wider font-bold text-[#d4af35]">
                  {language === 'vi' ? 'Tổng Quan Liệu Trình' : 'Treatment Overview'}
                </h4>
                <p className="text-white/80 text-sm font-light leading-relaxed">
                  {language === 'vi' ? selectedRitual.descVi : selectedRitual.descEn}
                </p>
              </div>

              {/* Ritual Progression Steps */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider font-bold text-[#d4af35]">
                  {language === 'vi' ? 'Các Bước Nghi Thức Trị Liệu' : 'Ritual Progression Steps'}
                </h4>
                <div className="space-y-3">
                  {(language === 'vi' ? selectedRitual.ritualStepsVi : selectedRitual.ritualStepsEn).map((st, idx) => (
                    <div key={idx} className="flex items-start gap-3.5 p-3.5 bg-white/5 border border-white/10 rounded-xl">
                      <span className="font-mono text-sm font-bold text-[#d4af35] bg-[#d4af35]/15 px-2 py-1 rounded">
                        {st.step}
                      </span>
                      <div className="space-y-1">
                        <span className="text-sm font-bold text-white block">{st.title}</span>
                        <span className="text-xs text-white/70 font-light block">{st.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits & Ingredients */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
                  <h5 className="text-xs uppercase tracking-wider font-bold text-[#d4af35]">
                    {language === 'vi' ? 'Lợi Ích Sức Khỏe' : 'Key Health Benefits'}
                  </h5>
                  <ul className="space-y-1.5 text-xs text-white/80">
                    {(language === 'vi' ? selectedRitual.benefitsVi : selectedRitual.benefitsEn).map((b, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 size={13} className="text-[#d4af35] shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
                  <h5 className="text-xs uppercase tracking-wider font-bold text-[#d4af35]">
                    {language === 'vi' ? 'Thành Phần Chiết Xuất' : 'Botanical Ingredients'}
                  </h5>
                  <p className="text-xs text-white/80 leading-relaxed font-light">
                    {language === 'vi' ? selectedRitual.ingredientsVi : selectedRitual.ingredientsEn}
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedRitual(null)}
                  className="px-5 py-2.5 rounded-xl border border-white/20 text-white text-xs font-semibold hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {language === 'vi' ? 'Đóng' : 'Close'}
                </button>
                <button
                  onClick={() => {
                    const title = language === 'vi' ? selectedRitual.titleVi : selectedRitual.titleEn;
                    setSelectedRitual(null);
                    handleOpenBookingWithPackage(title);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#d4af35] text-[#1a1814] text-xs font-bold uppercase tracking-wider hover:bg-white transition-all cursor-pointer shadow-lg"
                >
                  {language === 'vi' ? 'Đặt Liệu Trình Này' : 'Reserve This Ritual'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5-Star Amenities & Sanctuary Pillars */}
      <section className="py-20 lg:py-24 bg-white dark:bg-[#181611] border-t border-[#d4af35]/15">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-[#d4af35] text-xs font-bold uppercase tracking-[0.2em]">
              <Sparkles size={16} />
              <span>{t('wellness.amenitiesTitle')}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 dark:text-white leading-snug">
              {language === 'vi'
                ? 'Đẳng cấp vượt trội trong từng không gian tĩnh dưỡng'
                : 'Unrivaled excellence in every tailored detail'}
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-light leading-relaxed">
              {language === 'vi'
                ? 'Chúng tôi cam kết mang đến những tiêu chuẩn phục vụ quý tộc khắt khe nhất, bảo đảm tính riêng tư tuyệt đối và trải nghiệm hoàn hảo cho kỳ nghỉ của bạn.'
                : 'We are committed to delivering the most rigorous aristocratic hospitality standards, ensuring complete privacy and an extraordinary retreat.'}
            </p>

            <div className="space-y-3 pt-2">
              {(language === 'vi' ? currentExp.inclusionsVi : currentExp.inclusionsEn).map((inc, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#d4af35] shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{inc}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-3.5 rounded-xl bg-[#1a1814] text-white hover:bg-[#d4af35] hover:text-[#1a1814] font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer inline-flex items-center gap-2"
              >
                <Calendar size={16} />
                <span>{language === 'vi' ? currentExp.primaryCtaVi : currentExp.primaryCtaEn}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] border-4 border-white dark:border-[#221f18]">
              <img
                src={currentExp.heroImage}
                alt="Experience detail"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-[#1a1814] text-white p-6 rounded-2xl shadow-xl max-w-xs border border-white/10 hidden sm:block">
              <div className="flex items-center gap-1.5 text-[#d4af35] mb-2">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>
              <p className="text-xs text-white/90 italic font-serif">
                "Một trải nghiệm nghệ thuật và dịch vụ xứng tầm đỉnh cao thế giới."
              </p>
              <span className="text-[10px] uppercase tracking-widest text-[#d4af35] block mt-2 font-bold">
                Luxury Spa Awards 2026
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Spa Etiquette & Wellness Guide */}
      <section className="py-16 bg-[#fdfbf7] dark:bg-[#15130e] border-t border-[#d4af35]/15">
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <div className="text-center space-y-2">
            <h3 className="font-serif text-2xl sm:text-3xl text-slate-900 dark:text-white">
              {t('wellness.etiquetteTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              {language === 'vi'
                ? 'Để kỳ tĩnh dưỡng của quý khách diễn ra trọn vẹn và an yên nhất, xin vui lòng lưu ý một số hướng dẫn chuẩn mực sau:'
                : 'To ensure the most serene and restorative journey, please review our guest etiquette and arrival guidelines:'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 bg-white dark:bg-[#201d16] rounded-xl border border-[#d4af35]/15 space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#d4af35]/15 flex items-center justify-center text-[#d4af35]">
                <Clock size={20} />
              </div>
              <h4 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                {language === 'vi' ? 'Thời Gian Đến Trước' : 'Arrival Time'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                {language === 'vi'
                  ? 'Quý khách vui lòng có mặt trước giờ hẹn 15-20 phút để thưởng trà sen và hoàn thành bảng tư vấn sức khỏe.'
                  : 'Please arrive 15-20 minutes prior to your appointment to enjoy welcome lotus tea and complete health intake.'}
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-[#201d16] rounded-xl border border-[#d4af35]/15 space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#d4af35]/15 flex items-center justify-center text-[#d4af35]">
                <ShieldCheck size={20} />
              </div>
              <h4 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                {language === 'vi' ? 'Trang Phục & Tiện Nghi' : 'Robes & Amenities'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                {language === 'vi'
                  ? 'Áo choàng lụa, dép đi trong phòng và đồ dùng cá nhân 5 sao được chuẩn bị sẵn trong tủ khóa thông minh riêng.'
                  : 'Luxury silk bathrobes, slippers, and 5-star organic grooming toiletries are provided in your private locker.'}
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-[#201d16] rounded-xl border border-[#d4af35]/15 space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#d4af35]/15 flex items-center justify-center text-[#d4af35]">
                <Smile size={20} />
              </div>
              <h4 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                {language === 'vi' ? 'Không Gian Thanh Tịnh' : 'Serene Atmosphere'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                {language === 'vi'
                  ? 'Xin vui lòng giữ điện thoại ở chế độ im lặng để bảo đảm không gian yên tĩnh và riêng tư cho tất cả khách quý.'
                  : 'Kindly silence mobile devices to maintain a tranquil, meditative sanctuary for all esteemed guests.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 lg:py-20 bg-[#1a1814] text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white">
            {language === 'vi' ? 'Sẵn Sàng Cho Kỳ Nghỉ Đáng Nhớ?' : 'Ready for an Unforgettable Stay?'}
          </h2>
          <p className="text-white/70 text-sm sm:text-base max-w-xl mx-auto font-light">
            {language === 'vi'
              ? 'Liên hệ ngay với bộ phận Concierge để được tư vấn thiết kế lịch trình trải nghiệm riêng biệt cho bạn và người thân.'
              : 'Contact our Concierge team today to customize a personalized itinerary for you and your loved ones.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#d4af35] hover:bg-white text-[#1a1814] font-bold px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-[#d4af35]/30 cursor-pointer"
            >
              {language === 'vi' ? currentExp.primaryCtaVi : currentExp.primaryCtaEn}
            </button>
            <button
              onClick={() => navigate('/')}
              className="border border-white/30 hover:border-white text-white font-semibold px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer hover:bg-white/10"
            >
              {t('navbar.home') || 'Trang chủ'}
            </button>
          </div>
        </div>
      </section>

      {/* Booking / Inquiry Modal */}
      {isModalOpen && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1a1814] border border-[#d4af35]/40 text-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[88vh] overflow-y-auto [scrollbar-width:thin] [scrollbar-color:rgba(212,175,53,0.4)_rgba(255,255,255,0.05)] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#d4af35]/40 hover:[&::-webkit-scrollbar-thumb]:bg-[#d4af35] [&::-webkit-scrollbar-thumb]:rounded-full pr-4 sm:pr-6 animate-in zoom-in-95 duration-150"
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white/60 hover:text-[#d4af35] p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {!bookingSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 text-[#d4af35] text-xs font-bold uppercase tracking-wider">
                    <Sparkles size={14} />
                    <span>{language === 'vi' ? currentExp.badgeVi : currentExp.badgeEn}</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white">
                    {language === 'vi' ? 'Đặt Lịch Trải Nghiệm' : 'Reserve Your Experience'}
                  </h3>
                  <p className="text-xs text-white/70">
                    {language === 'vi'
                      ? 'Vui lòng để lại thông tin, quản gia trải nghiệm của chúng tôi sẽ liên hệ xác nhận trong vòng 15 phút.'
                      : 'Please leave your details. Our Experience Butler will reach out to confirm within 15 minutes.'}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/80 font-semibold mb-1">
                      {language === 'vi' ? 'Họ và tên *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white/5 border border-white/20 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#d4af35] focus:ring-1 focus:ring-[#d4af35] transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-white/80 font-semibold mb-1">
                        {language === 'vi' ? 'Số điện thoại *' : 'Phone Number *'}
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0912 345 678"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white/5 border border-white/20 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#d4af35] focus:ring-1 focus:ring-[#d4af35] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-white/80 font-semibold mb-1">
                        {language === 'vi' ? 'Email *' : 'Email Address *'}
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="guest@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white/5 border border-white/20 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#d4af35] focus:ring-1 focus:ring-[#d4af35] transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-white/80 font-semibold mb-1">
                        {language === 'vi' ? 'Ngày *' : 'Date *'}
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-[#d4af35] focus:ring-1 focus:ring-[#d4af35] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-white/80 font-semibold mb-1">
                        {language === 'vi' ? 'Giờ *' : 'Time *'}
                      </label>
                      <input
                        type="time"
                        required
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-[#d4af35] focus:ring-1 focus:ring-[#d4af35] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-white/80 font-semibold mb-1">
                        {language === 'vi' ? 'Số khách *' : 'Guests *'}
                      </label>
                      <select
                        value={formData.guests}
                        onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                        className="w-full px-3 py-2.5 bg-[#1a1814] border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-[#d4af35] focus:ring-1 focus:ring-[#d4af35] transition-all cursor-pointer"
                      >
                        <option value="1">1 Khách</option>
                        <option value="2">2 Khách</option>
                        <option value="4">3 - 5 Khách</option>
                        <option value="8">6 - 10 Khách</option>
                        <option value="20">10+ Khách (Tiệc lớn)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/80 font-semibold mb-1">
                      {language === 'vi' ? 'Gói trải nghiệm / Liệu trình quan tâm' : 'Selected Experience / Treatment'}
                    </label>
                    <input
                      type="text"
                      placeholder={
                        language === 'vi'
                          ? 'VD: Liệu pháp muối Himalaya, Gói Hoàng gia...'
                          : 'e.g. Himalayan Salt Therapy, Royal Awakening...'
                      }
                      value={formData.packageOption}
                      onChange={(e) => setFormData({ ...formData, packageOption: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white/5 border border-white/20 rounded-xl text-sm text-white focus:outline-none focus:border-[#d4af35] focus:ring-1 focus:ring-[#d4af35] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/80 font-semibold mb-1">
                      {language === 'vi' ? 'Yêu cầu đặc biệt (nếu có)' : 'Special Requests'}
                    </label>
                    <textarea
                      rows={2}
                      placeholder={
                        language === 'vi'
                          ? 'Tình trạng sức khỏe, dị ứng, dịp kỷ niệm đặc biệt...'
                          : 'Health considerations, allergies, anniversary celebration...'
                      }
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white/5 border border-white/20 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#d4af35] focus:ring-1 focus:ring-[#d4af35] transition-all [scrollbar-width:thin]"
                    ></textarea>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#d4af35] hover:bg-white text-[#1a1814] font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-[#d4af35]/30 active:scale-[0.99] cursor-pointer"
                  >
                    {language === 'vi' ? 'Gửi Yêu Cầu Đặt Chỗ' : 'Submit Reservation Request'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#d4af35]/20 text-[#d4af35] flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-white">
                  {language === 'vi' ? 'Đặt Chỗ Thành Công!' : 'Reservation Submitted!'}
                </h3>
                <p className="text-xs text-white/80 max-w-sm mx-auto leading-relaxed">
                  {language === 'vi'
                    ? 'Cảm ơn quý khách. Chúng tôi đã nhận được yêu cầu đặt lịch và sẽ liên hệ xác nhận trong giây lát.'
                    : 'Thank you! We have received your request and our concierge team will reach out shortly.'}
                </p>
                <div className="bg-white/5 border border-[#d4af35]/30 p-4 rounded-xl max-w-xs mx-auto">
                  <span className="text-[10px] uppercase tracking-wider text-white/60 block">
                    {language === 'vi' ? 'Mã Đặt Lịch' : 'Booking Reference'}
                  </span>
                  <span className="font-mono text-lg font-bold text-[#d4af35] block mt-1">
                    {bookingCode}
                  </span>
                </div>
                <div className="pt-4">
                  <button
                    onClick={closeModal}
                    className="px-6 py-2.5 bg-[#d4af35] text-[#1a1814] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-white transition-all cursor-pointer shadow-md"
                  >
                    {language === 'vi' ? 'Đóng cửa sổ' : 'Close'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ExperienceDetail;

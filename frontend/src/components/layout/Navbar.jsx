import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const Navbar = ({ scrolled }) => {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const navItems = [
    { name: t('navbar.accommodations'), href: '#accommodations' },
    { name: t('navbar.dining'), href: '#dining' },
    { name: t('navbar.experiences'), href: '#experiences' },
    { name: t('navbar.wellness'), href: '#wellness' },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef(null);

  const isLoggedIn = !!localStorage.getItem('token');
  const tai_khoan = JSON.parse(localStorage.getItem('user')) || {};

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleBooking = () => {
    if (isLoggedIn) {
      navigate('/room-map');
    } else {
      navigate('/login');
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled || isMobileMenuOpen
          ? 'bg-navy-deep/95 backdrop-blur-md py-3.5 border-b border-white/10 shadow-xl'
          : 'bg-gradient-to-b from-navy-deep/80 via-navy-deep/40 to-transparent py-5 border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* --- TRÁI: LOGO --- */}
          <div className="flex items-center shrink-0">
            <a
              href="/"
              className="text-lg sm:text-xl lg:text-2xl font-serif tracking-[0.2em] text-white uppercase font-bold hover:text-primary transition-colors flex items-center gap-2"
            >
              <span>{t('navbar.brand')}</span>
            </a>
          </div>

          {/* --- GIỮA: MENU DESKTOP --- */}
          <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 mx-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                className="nav-link relative text-xs uppercase tracking-[0.15em] text-white/90 hover:text-primary font-medium transition-colors py-1 whitespace-nowrap"
                href={item.href}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* --- PHẢI: ACTIONS DESKTOP --- */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4 shrink-0">
            {/* BỘ CHỌN NGÔN NGỮ DESKTOP */}
            <div className="relative" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                title={t('navbar.language')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-white/90 hover:text-primary rounded-full hover:bg-white/10 transition-colors border border-white/10 text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                <span className="material-icons-outlined text-lg">language</span>
                <span>{language === 'vi' ? 'VI' : 'EN'}</span>
                <span className="material-icons-outlined text-sm">{isLangDropdownOpen ? 'expand_less' : 'expand_more'}</span>
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-navy-deep/95 backdrop-blur-md rounded-lg shadow-2xl border border-white/15 py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('vi');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left cursor-pointer transition-colors ${
                      language === 'vi'
                        ? 'bg-primary/20 text-primary font-bold'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-sm">🇻🇳</span>
                      <span>Tiếng Việt</span>
                    </span>
                    {language === 'vi' && <span className="material-icons-outlined text-sm">check</span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('en');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left cursor-pointer transition-colors ${
                      language === 'en'
                        ? 'bg-primary/20 text-primary font-bold'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-sm">🇬🇧</span>
                      <span>English</span>
                    </span>
                    {language === 'en' && <span className="material-icons-outlined text-sm">check</span>}
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleBooking}
              className="bg-primary hover:bg-white text-navy-deep px-4 py-2 rounded-md font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-primary/30 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              {t('navbar.bookNow')}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-2 pl-2 border-l border-white/15">
                {/* NÚT PROFILE NGƯỜI DÙNG */}
                <button
                  onClick={() => navigate('/profile')}
                  title={`${t('navbar.account')}: ${tai_khoan?.name || t('navbar.guest')}`}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-primary/50 text-white rounded-md transition-all duration-300 text-xs tracking-wide cursor-pointer max-w-[160px]"
                >
                  <span className="material-icons-outlined text-base text-primary shrink-0">account_circle</span>
                  <span className="truncate font-medium">{tai_khoan?.name || t('navbar.guest')}</span>
                </button>

                {/* NÚT ĐĂNG XUẤT */}
                <button
                  onClick={handleLogout}
                  title={t('navbar.logout')}
                  className="p-2 text-white/80 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all duration-300 flex items-center justify-center cursor-pointer border border-transparent hover:border-red-400/30"
                >
                  <span className="material-icons-outlined text-lg">logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-transparent border border-white/40 hover:border-primary text-white hover:text-primary rounded-md transition-all duration-300 text-xs font-semibold uppercase tracking-wider cursor-pointer whitespace-nowrap"
              >
                <span className="material-icons-outlined text-base">login</span>
                <span>{t('navbar.login')}</span>
              </button>
            )}
          </div>

          {/* --- PHẢI: MOBILE ACTIONS & HAMBURGER --- */}
          <div className="flex lg:hidden items-center gap-2.5 shrink-0">

            <button
              onClick={handleBooking}
              className="bg-primary hover:bg-white text-navy-deep px-3 py-1.5 rounded-md font-bold text-[11px] uppercase tracking-wider transition-all shadow cursor-pointer whitespace-nowrap"
            >
              {t('navbar.book')}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 text-white hover:text-primary rounded-md transition-colors flex items-center justify-center cursor-pointer focus:outline-none"
              aria-label="Toggle Menu"
            >
              <span className="material-icons-outlined text-2xl">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* --- DROPDOWN MOBILE MENU --- */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden bg-navy-deep/95 backdrop-blur-lg border-t border-white/10 ${
          isMobileMenuOpen ? 'max-h-[500px] opacity-100 py-5 shadow-2xl' : 'max-h-0 opacity-0 py-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col space-y-4">
          {/* Thông tin user trên mobile */}
          {isLoggedIn && (
            <div
              onClick={() => {
                closeMobileMenu();
                navigate('/profile');
              }}
              className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 cursor-pointer transition-colors"
            >
              <span className="material-icons-outlined text-2xl text-primary">account_circle</span>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] text-white/60">{t('navbar.account')}</span>
                <span className="text-sm font-semibold text-white truncate">{tai_khoan?.name || t('navbar.guest')}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-3 pt-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                onClick={closeMobileMenu}
                className="text-sm uppercase tracking-widest text-white/90 hover:text-primary font-medium transition-colors py-1"
                href={item.href}
              >
                {item.name}
              </a>
            ))}
          </div>

          <hr className="border-white/10 my-1" />

          {/* Chọn ngôn ngữ trong menu mobile */}
          <div className="flex items-center justify-between py-2 text-white/80">
            <div className="flex items-center gap-2 text-sm uppercase tracking-wider">
              <span className="material-icons-outlined text-lg">language</span>
              <span>{t('navbar.language')}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-md border border-white/10">
              <button
                type="button"
                onClick={() => setLanguage('vi')}
                className={`px-2.5 py-1 text-xs rounded transition-colors ${
                  language === 'vi' ? 'bg-primary text-navy-deep font-bold' : 'text-white/70 hover:text-white'
                }`}
              >
                VI
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs rounded transition-colors ${
                  language === 'en' ? 'bg-primary text-navy-deep font-bold' : 'text-white/70 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors text-left py-1 text-sm font-semibold uppercase tracking-wider bg-transparent border-none cursor-pointer"
              >
                <span className="material-icons-outlined text-lg">logout</span>
                <span>{t('navbar.logout')}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  closeMobileMenu();
                  navigate('/login');
                }}
                className="flex items-center gap-3 text-primary hover:text-white transition-colors text-left py-1 text-sm font-semibold uppercase tracking-wider bg-transparent border-none cursor-pointer"
              >
                <span className="material-icons-outlined text-lg">login</span>
                <span>{t('navbar.login')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
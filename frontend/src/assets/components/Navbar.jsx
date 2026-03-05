import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ scrolled }) => {
  const navItems = ['Accommodations', 'Dining', 'Wellness', 'Experiences'];
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem('token');

  const tai_khoan = JSON.parse(localStorage.getItem('user')) || {};

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
  }

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${scrolled || isMobileMenuOpen
        ? 'bg-navy-deep py-3 border-white/5 shadow-xl'
        : 'bg-transparent py-6 border-white/10'
        }`}
    >
      <div className="flex items-center justify-between px-6 lg:px-16 w-full">

        {/* --- TRÁI: LOGO & MENU DESKTOP --- */}
        <div className="flex items-center space-x-12">
          <a className="text-lg lg:text-2xl font-serif tracking-widest text-white uppercase font-bold" href="#">
            LA MAISON DTN
          </a>

          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => {
              const sectionId = item.toLowerCase();
              return (
                <a
                  key={item}
                  className="nav-link relative text-[11px] uppercase tracking-widest text-white/90 font-medium hover:text-primary transition-colors"
                  href={`#${sectionId}`}
                >
                  {item}
                </a>
              );
            })}
          </nav>
        </div>

        {/* --- PHẢI: ACTIONS DESKTOP --- */}
        <div className="hidden lg:flex items-center space-x-4 lg:space-x-6">
          <button className="bg-transparent border-none outline-none shadow-none text-white/90 hover:text-primary transition-colors flex items-center justify-center cursor-pointer">
            <span className="material-icons-outlined">search</span>
          </button>
          <button className="bg-transparent border-none outline-none shadow-none text-white/90 hover:text-primary transition-colors flex items-center justify-center cursor-pointer">
            <span className="material-icons-outlined">language</span>
          </button>
          <button
            onClick={handleBooking}
            className="bg-primary hover:bg-white border-none outline-none text-navy-deep px-5 py-2 rounded-sm font-bold text-[10px] lg:text-xs uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 cursor-pointer">
            Book Now
          </button>
          {isLoggedIn ? (
            <div className="flex items-center space-x-4 lg:space-x-6">

              {/* NÚT TÊN NGƯỜI DÙNG: Bấm vào để qua trang Profile */}
              <button
                onClick={() => {
                  if (typeof closeMobileMenu === 'function') closeMobileMenu();
                  navigate('/profile');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-transparent border border-white text-white hover:border-primary hover:text-primary rounded-md transition-all duration-300 focus:outline-none text-sm tracking-wide"
              >
                Xin chào, <span className="font-bold">{tai_khoan?.name || "Khách"}</span>
              </button>

              <div className="w-px h-4 bg-white/20 hidden md:block"></div> {/* Vạch kẻ phân cách */}

              {/* NÚT ĐĂNG XUẤT */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 px-4 py-2 bg-transparent border border-white text-white hover:border-primary hover:text-primary rounded-md transition-all duration-300 text-xs font-bold uppercase tracking-widest"       >
                <span className="material-icons-outlined text-base">logout</span>
                <span className="hidden md:inline">Thoát</span>
              </button>

            </div>
          ) : (
            <button
              onClick={() => {
                if (typeof closeMobileMenu === 'function') closeMobileMenu();
                navigate('/login');
              }}
              className="flex items-center space-x-1.5 px-4 py-2 bg-transparent border border-white text-white hover:border-primary hover:text-primary rounded-md transition-all duration-300 text-xs font-bold uppercase tracking-widest"            >
              <span className="material-icons-outlined">login</span>
              <span>Đăng nhập</span>
            </button>
          )}
        </div>

        {/* --- PHẢI: MENU MOBILE --- */}
        <div className="flex lg:hidden items-center space-x-4">
          <button onClick={handleBooking} className="bg-primary hover:bg-white border-none outline-none text-navy-deep px-3 py-2 rounded-sm font-bold text-[10px] uppercase tracking-[0.1em] transition-all cursor-pointer">
            Book
          </button>

          {/* ĐÃ FIX: Thêm bg-transparent border-none shadow-none */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="bg-transparent border-none outline-none shadow-none text-white flex items-center cursor-pointer p-0"
          >
            <span className="material-icons-outlined text-3xl">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* --- DROPDOWN MOBILE MENU --- */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full bg-navy-deep border-t border-white/10 transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-[400px] opacity-100 py-4' : 'max-h-0 opacity-0 py-0'
          }`}
      >
        <div className="flex flex-col px-6 space-y-5">
          {navItems.map((item) => {
            const sectionId = item.toLowerCase();
            return (
              <a
                key={item}
                onClick={closeMobileMenu}
                className="text-sm uppercase tracking-widest text-white/90 font-medium hover:text-primary transition-colors"
                href={`#${sectionId}`}
              >
                {item}
              </a>
            );
          })}

          <hr className="border-white/10" />

          {/* ĐÃ FIX: Thêm bg-transparent border-none shadow-none cho tất cả nút dưới này */}
          <div className="flex flex-col space-y-4">
            <button className="bg-transparent border-none outline-none shadow-none flex items-center space-x-3 text-white/90 hover:text-primary transition-colors text-left w-fit p-0">
              <span className="material-icons-outlined">search</span>
              <span className="text-sm uppercase tracking-widest">Search</span>
            </button>

            <button className="bg-transparent border-none outline-none shadow-none flex items-center space-x-3 text-white/90 hover:text-primary transition-colors text-left w-fit p-0">
              <span className="material-icons-outlined">language</span>
              <span className="text-sm uppercase tracking-widest">Language</span>
            </button>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-transparent border-none outline-none shadow-none flex items-center space-x-3 text-white/90 hover:text-primary transition-colors text-left w-fit p-0"
              >
                <span className="material-icons-outlined">logout</span>
                <span className="text-sm font-bold uppercase tracking-widest">Logout</span>
              </button>

            ) : (
              <button
                onClick={() => { closeMobileMenu(); navigate('/login'); }}
                className="bg-transparent border-none outline-none shadow-none flex items-center space-x-3 text-white/90 hover:text-primary transition-colors text-left w-fit p-0"
              >
                <span className="material-icons-outlined">login</span>
                <span className="text-sm font-bold uppercase tracking-widest">Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header >
  );
};

export default Navbar;
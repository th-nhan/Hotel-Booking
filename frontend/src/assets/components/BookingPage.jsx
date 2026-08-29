import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { message } from 'antd';
import { 
  ArrowRight, 
  Star, 
  BedDouble, 
  Square, 
  Wifi, 
  Users, 
  ChevronLeft,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  
  // Lấy dữ liệu từ trang Sơ đồ phòng truyền sang
  const [room, setRoom] = useState(location.state?.room); 
  const passedCheckIn = location.state?.checkIn || '';
  const passedCheckOut = location.state?.checkOut || '';
  const adults = location.state?.adults || 2;
  const children = location.state?.children || 0;

  // Tự động lấy thông tin User từ LocalStorage (nếu đã đăng nhập)
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

  const [formData, setFormData] = useState({
    HoTen: storedUser.HoTen || storedUser.name || '',
    Email: storedUser.Email || storedUser.email || '',
    DiaChi: storedUser.DiaChi || storedUser.address || '',
    SoDienThoai: storedUser.SoDienThoai || storedUser.phone || '',
    CCCD: storedUser.CCCD || storedUser.cccd || '',
    NgayCheckIn: passedCheckIn,
    NgayCheckOutDuKien: passedCheckOut,
    HinhThucThanhToan: 'Tại quầy'
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const today = new Date().toISOString().split('T')[0];

  // Tính toán số đêm và tiền trực tiếp
  const soDem = (() => {
    if (formData.NgayCheckIn && formData.NgayCheckOutDuKien) {
      const start = new Date(formData.NgayCheckIn);
      const end = new Date(formData.NgayCheckOutDuKien);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    return 0;
  })();

  const tongTien = room && soDem > 0 ? soDem * room.GiaPhong : 0;
  const tienCoc = formData.HinhThucThanhToan === 'Tại quầy' ? tongTien * 0.3 : 0;

  // Logic: Đổi phòng nếu phòng hiện tại bị trùng lịch
  const handleSelectRoom = (newRoom) => {
    setRoom(newRoom);          
    setErrorMsg('');           
    setSuggestions([]);        
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Logic: Gửi API Đặt phòng
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (soDem <= 0) {
      message.warning(language === 'vi' ? 'Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 ngày!' : 'Check-out date must be at least 1 day after check-in!');
      return;
    }

    setErrorMsg('');
    setSuggestions([]);

    try {
      const payload = {
        ...formData,
        PhongID: room.PhongID,
        TaiKhoanID: storedUser.TaiKhoanID || storedUser.id || null
      };

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/dat-phong`, payload);

      if (response.data.status === 'success') {
        message.success(t('booking.successMessage'));
        navigate('/'); 
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMsg(error.response.data.message);
        setSuggestions(error.response.data.suggested_rooms || []);
      } else {
        const backendError = error.response?.data?.message || 
          (error.response?.data?.errors ? Object.values(error.response.data.errors).flat().join(' ') : error.message);
        message.error(t('booking.errorMessage') + ' ' + backendError);
      }
    }
  };

  if (!room) {
    return (
      <div className="min-h-screen bg-[#201d12] flex flex-col items-center justify-center text-white p-6 text-center">
        <h2 className="text-2xl font-display mb-4">{language === 'vi' ? 'Vui lòng chọn phòng trên sơ đồ trước!' : 'Please select a room on the room map first!'}</h2>
        <button 
          onClick={() => navigate('/room-map')} 
          className="bg-[#d4af35] text-[#201d12] font-bold px-6 py-3 rounded-lg hover:bg-[#b08d2b] transition-all uppercase tracking-wider text-sm cursor-pointer"
        >
          {t('roomMap.title')}
        </button>
      </div>
    );
  }

  const inputClasses = "w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:border-[#d4af35] focus:outline-none focus:ring-1 focus:ring-[#d4af35] transition-all";

  return (
    <div className="bg-[#201d12] text-slate-100 font-sans antialiased min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-white/10 bg-[#201d12]/90 px-6 py-4 sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-4 text-white cursor-pointer" onClick={() => navigate('/room-map')}>
          <button className="bg-transparent border-none shadow-none outline-none p-2 hover:bg-white/10 rounded-full transition-colors text-white flex items-center justify-center cursor-pointer">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-display font-bold tracking-wide text-[#d4af35]">{t('navbar.brand')}</h2>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
            className="px-3 py-1 text-xs font-bold text-white/90 hover:text-primary rounded-full border border-white/20 bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
            title={t('navbar.language')}
          >
            <span className="material-icons-outlined text-sm">language</span>
            <span>{language === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English'}</span>
          </button>
        </div>
      </header>

      <main className="flex flex-col lg:flex-row flex-1 relative overflow-hidden h-[calc(100vh-73px)]">
        
        {/* LEFT SIDE: Hình ảnh và Thông tin phòng */}
        <div className="lg:w-6/12 w-full relative flex flex-col items-center justify-center overflow-hidden group">
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center opacity-50 transition-transform duration-700 group-hover:scale-105" 
            style={{ backgroundImage: `url('${room.AnhDaiDien || room.AnhDienDien || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop'}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#201d12] via-[#201d12]/60 to-transparent" />
          
          <div className="relative z-10 w-full max-w-2xl px-8 py-12 flex flex-col items-center h-full justify-center text-center">
            <span className="text-[#d4af35] text-xs font-bold tracking-[0.2em] uppercase mb-3 block border border-[#d4af35]/50 px-3 py-1 rounded-full backdrop-blur-sm">
              {room.TenLoai}
            </span>
            <h1 className="text-white font-display text-5xl lg:text-7xl font-medium tracking-tight mb-4 drop-shadow-lg">
              {room.TenPhong}
            </h1>
            <p className="text-white/70 max-w-md italic mb-8">"{room.MoTa}"</p>
            
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/10">
                <Users className="w-5 h-5 text-[#d4af35] shrink-0" />
                <div className="text-left">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">{t('roomMap.capacity')}</p>
                  <p className="text-sm font-semibold text-white">{t('roomMap.capacity')} {room.SoLuongToiDa || room.SoLuongKhach || 2} {t('roomMap.people')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/10">
                <BedDouble className="w-5 h-5 text-[#d4af35] shrink-0" />
                <div className="text-left">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">{language === 'vi' ? 'Giường' : 'Bed'}</p>
                  <p className="text-sm font-semibold text-white">King Size</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/10">
                <Square className="w-5 h-5 text-[#d4af35] shrink-0" />
                <div className="text-left">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">{language === 'vi' ? 'Diện tích' : 'Area'}</p>
                  <p className="text-sm font-semibold text-white">85 m²</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/10">
                <Wifi className="w-5 h-5 text-[#d4af35] shrink-0" />
                <div className="text-left">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">{t('roomMap.amenities')}</p>
                  <p className="text-sm font-semibold text-white">Free Wifi 5G</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Form nhập liệu và Thanh toán */}
        <div className="lg:w-6/12 w-full bg-[#201d12] border-l border-white/10 flex flex-col overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="p-8 lg:p-12 flex flex-col h-full">
            
            {/* Tiêu đề */}
            <div className="mb-8 pb-6 border-b border-white/10">
              <div className="flex items-center gap-2 text-[#d4af35] text-sm font-bold tracking-wider uppercase mb-2">
                <Star className="w-5 h-5" fill="currentColor" />
                {t('booking.pageTitle')}
              </div>
              <h2 className="text-3xl font-display text-white mb-2">{t('booking.customerInfo')}</h2>
              <p className="text-white/50 text-sm">{language === 'vi' ? 'Vui lòng điền đầy đủ thông tin để chúng tôi chuẩn bị đón tiếp.' : 'Please fill in all details for your stay reservation.'}</p>
            </div>

            {/* Báo lỗi trùng lịch và Gợi ý */}
            {errorMsg && (
              <div className="mb-8 p-5 bg-red-500/10 border border-red-500/50 rounded-xl">
                <div className="flex items-center gap-2 text-red-500 mb-3">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-bold">{errorMsg}</span>
                </div>
                {suggestions.length > 0 && (
                  <div>
                    <p className="text-sm text-white/70 mb-3">{language === 'vi' ? 'Gợi ý các phòng tương đương đang trống:' : 'Suggested equivalent available rooms:'}</p>
                    <div className="grid gap-2">
                      {suggestions.map(s => (
                        <div key={s.PhongID} className="flex items-center justify-between bg-black/30 p-3 rounded-lg border border-white/5">
                          <span className="font-medium">Phòng {s.TenPhong} <span className="text-[#d4af35] ml-2">{new Intl.NumberFormat('vi-VN').format(s.GiaPhong)}đ/đêm</span></span>
                          <button
                            type="button"
                            onClick={() => handleSelectRoom(s)}
                            className="text-xs bg-[#d4af35] text-[#201d12] font-bold px-3 py-1.5 rounded uppercase hover:bg-[#b08d2b] transition-colors cursor-pointer"
                          >
                            {language === 'vi' ? 'Đổi sang phòng này' : 'Switch to this room'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Lưới Input Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              <div>
                <label className="block text-xs text-white/50 uppercase tracking-widest mb-2 ml-1">{t('booking.fullName')}</label>
                <input name="HoTen" value={formData.HoTen} placeholder="Nguyễn Văn A" required onChange={handleChange} className={inputClasses} />
              </div>
              <div>
                <label className="block text-xs text-white/50 uppercase tracking-widest mb-2 ml-1">{t('booking.phone')}</label>
                <input name="SoDienThoai" value={formData.SoDienThoai} placeholder="090xxxxxxx" required onChange={handleChange} className={inputClasses} />
              </div>
              <div>
                <label className="block text-xs text-white/50 uppercase tracking-widest mb-2 ml-1">{t('booking.email')}</label>
                <input name="Email" value={formData.Email} type="email" placeholder="email@example.com" required onChange={handleChange} className={inputClasses} />
              </div>
              <div>
                <label className="block text-xs text-white/50 uppercase tracking-widest mb-2 ml-1">{t('booking.identityCard')}</label>
                <input name="CCCD" value={formData.CCCD} placeholder="Nhập số thẻ" required onChange={handleChange} className={inputClasses} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-white/50 uppercase tracking-widest mb-2 ml-1">{language === 'vi' ? 'Địa chỉ' : 'Address'}</label>
                <input name="DiaChi" value={formData.DiaChi} placeholder="Nhập địa chỉ của bạn" required onChange={handleChange} className={inputClasses} />
              </div>
            </div>

            {/* Thời gian và Thanh toán */}
            <h3 className="font-display text-xl text-white mb-4">{t('booking.staySummary')}</h3>
            <div className="bg-white/5 rounded-xl border border-white/10 p-5 shadow-sm mb-8 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs text-white/50 uppercase tracking-widest mb-2 ml-1">{t('roomMap.checkIn')}</label>
                  <input name="NgayCheckIn" value={formData.NgayCheckIn} type="date" min={today} required onChange={handleChange} style={{ colorScheme: 'dark' }} className={inputClasses} />
                </div>
                <div>
                  <label className="block text-xs text-white/50 uppercase tracking-widest mb-2 ml-1">{t('roomMap.checkOut')}</label>
                  <input name="NgayCheckOutDuKien" value={formData.NgayCheckOutDuKien} min={formData.NgayCheckIn || today} type="date" required onChange={handleChange} style={{ colorScheme: 'dark' }} className={inputClasses} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs text-white/50 uppercase tracking-widest mb-2 ml-1">{t('booking.guestCount')}</label>
                  <div className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white/80 text-sm">
                    {adults} {t('roomMap.adults')} {children > 0 ? `, ${children} ${t('roomMap.children')}` : ''}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-white/50 uppercase tracking-widest mb-2 ml-1">{t('booking.paymentMethod')}</label>
                  <select name="HinhThucThanhToan" value={formData.HinhThucThanhToan} onChange={handleChange} className={`${inputClasses} appearance-none cursor-pointer`}>
                    <option className="text-black" value="Tại quầy">{language === 'vi' ? 'Tiền mặt tại quầy (Cần cọc trước 30%)' : 'Cash at Front Desk (30% deposit required)'}</option>
                    <option className="text-black" value="Chuyển khoản">{language === 'vi' ? 'Chuyển khoản Ngân hàng' : 'Bank Transfer'}</option>
                    <option className="text-black" value="Momo">{language === 'vi' ? 'Ví điện tử Momo' : 'Momo E-Wallet'}</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Tổng kết Bill */}
            <div className="mt-auto pt-6 border-t border-white/10">
              <div className="bg-black/20 rounded-xl p-5 mb-6 border border-[#d4af35]/20">
                <div className="flex justify-between text-sm text-white/70 mb-2">
                  <span>{t('booking.basePrice')}</span>
                  <span>
                    {language === 'vi' 
                      ? `${new Intl.NumberFormat('vi-VN').format(room.GiaPhong)} VNĐ`
                      : `$${Math.round(room.GiaPhong / 25000)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-white/70 mb-2">
                  <span>{t('booking.nightCount')}</span>
                  <span>{soDem} {t('booking.nights')}</span>
                </div>
                {formData.HinhThucThanhToan === 'Tại quầy' && (
                  <div className="flex justify-between text-sm text-[#d4af35] mb-2 font-medium">
                    <span>{language === 'vi' ? 'Yêu cầu đặt cọc (30%)' : 'Deposit required (30%)'}</span>
                    <span>
                      {language === 'vi'
                        ? `${new Intl.NumberFormat('vi-VN').format(tienCoc)} VNĐ`
                        : `$${Math.round(tienCoc / 25000)}`}
                    </span>
                  </div>
                )}
                <div className="h-px bg-white/10 my-3"></div>
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-white text-lg font-bold">{t('booking.totalAmount')}</span>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{t('booking.serviceFee')}</p>
                  </div>
                  <span className="text-3xl font-display font-bold text-[#d4af35]">
                    {language === 'vi'
                      ? `${new Intl.NumberFormat('vi-VN').format(tongTien)} VNĐ`
                      : `$${Math.round(tongTien / 25000)}`}
                  </span>
                </div>
              </div>

              <button type="submit" className="w-full bg-[#d4af35] text-[#201d12] h-14 rounded-lg font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#b08d2b] transition-colors shadow-[0_4px_20px_rgba(212,175,53,0.3)] uppercase tracking-widest cursor-pointer">
                <span>{t('booking.confirmBooking')}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-center text-xs text-white/30 mt-4">
                {language === 'vi' ? 'Miễn phí hủy phòng trước 48h nhận phòng.' : 'Free cancellation up to 48 hours before check-in.'}
              </p>
            </div>

          </form>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d4af35; border-radius: 10px; }
      `}} />
    </div>
  );
};

export default BookingPage;
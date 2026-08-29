import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Bell, LayoutDashboard, History, Settings, LogOut, Download, Star, RefreshCw, Mail, Phone, MapPin, Shield, Edit2, Link, Lock, Camera } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
export default function ProfileCustomer() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({ profile: {}, bookings: [] });
  const [activeTab, setActiveTab] = useState('overview');

  const handleUpdateProfile = (updatedFields) => {
    setUserData(prev => ({
      ...prev,
      profile: { ...prev.profile, ...updatedFields }
    }));
  };

  useEffect(() => {
    const fetchProfileData = async () => {

      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/my-profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Lỗi khi tải thông tin:", error);
        // Nếu token hết hạn hoặc lỗi, cho đăng xuất
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  if (loading) {
    return <div className="h-screen bg-[#0B1C2D] flex items-center justify-center text-[#deb42b]"><RefreshCw className="w-10 h-10 animate-spin" /></div>;
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-[#0B1C2D] text-slate-100 custom-font-base">
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap');
        .custom-font-base { font-family: "Plus Jakarta Sans", sans-serif; }
        .serif-font { font-family: "Playfair Display", serif; }
      `}} />

      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <main className="flex-1 flex flex-col lg:flex-row px-6 lg:px-20 py-10 gap-10">
          <Sidebar profile={userData.profile} activeTab={activeTab} setActiveTab={setActiveTab} onUpdateProfile={handleUpdateProfile} />
          {activeTab === 'overview' ? (
            <ProfileOverview profile={userData.profile} bookings={userData.bookings} onUpdateProfile={handleUpdateProfile} />
          ) : (
            <BookingHistory bookings={userData.bookings} />
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}

function Header() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-[#deb42b]/20 px-6 lg:px-20 py-5 bg-[#0B1C2D]/50 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <h2
          onClick={() => navigate('/')}
          className="serif-font text-[#deb42b] text-2xl font-bold leading-tight tracking-widest cursor-pointer"
        >
          {t('navbar.brand')}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
          className="px-3 py-1 text-xs font-bold text-[#deb42b] hover:text-white rounded-full border border-[#deb42b]/20 bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
          title={t('navbar.language')}
        >
          <span className="material-icons-outlined text-sm">language</span>
          <span>{language === 'vi' ? 'VI' : 'EN'}</span>
        </button>

        <button
          onClick={() => navigate('/')}
          className="text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-sm"
        >
          <span className="material-icons-outlined text-base">home</span>
          <span className="hidden sm:inline">{t('navbar.home')}</span>
        </button>
      </div>
    </header>
  );
}

// Sidebar nhận dữ liệu profile thật
function Sidebar({ profile, activeTab, setActiveTab, onUpdateProfile }) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleChangeAvatar = async () => {
    const newAvatarUrl = window.prompt(t('profile.avatarPrompt'), profile.anhdaidien || "");

    if (newAvatarUrl !== null && newAvatarUrl !== profile.anhdaidien) {
      try {
        const token = localStorage.getItem('token');

        await axios.post(`${import.meta.env.VITE_API_URL}/update-profile`,
          {
            name: profile.name,
            phone: profile.phone || '',
            address: profile.address || '',
            anhdaidien: newAvatarUrl
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (onUpdateProfile) {
          onUpdateProfile({ anhdaidien: newAvatarUrl });
        }
        alert(t('profile.avatarSuccess'));
        window.location.reload();
      } catch (error) {
        const errorMsg = error.response?.data?.message || "Error";
        alert(t('profile.serverError') + errorMsg);
        console.error("Chi tiết lỗi:", error.response?.data);
      }
    }
  };

  return (
    <aside className="w-full lg:w-1/4 flex flex-col gap-6">
      <div className="bg-[#deb42b]/5 border border-[#deb42b]/20 rounded-xl p-6">
        <div className="flex flex-col items-center text-center gap-4">
          {/* KHU VỰC AVATAR CÓ NÚT EDIT BÊN TRÊN */}
          <div className="relative group">
            <div className="size-24 rounded-full border-2 border-[#deb42b] p-1">
              <div
                className="w-full h-full rounded-full bg-cover bg-center transition-all duration-300"
                style={{ backgroundImage: `url('${profile.anhdaidien || "https://cafefcdn.com/zoom/600_315/203337114487263232/2022/3/3/photo1646280815645-1646280816151764748403.jpg"}')` }}
              ></div>
            </div>
            {/* Lớp phủ màu đen và icon Camera hiện ra khi trỏ chuột vào */}
            <button
              onClick={handleChangeAvatar}
              className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            >
              <Camera size={24} className="text-[#deb42b] mb-1" />
              <span className="text-[10px] text-white font-bold uppercase tracking-wider">{t('profile.changeAvatar')}</span>
            </button>
          </div>
          <div>
            <h3 className="serif-font text-xl font-bold text-[#deb42b]">{profile.name}</h3>
            <p className="text-xs uppercase tracking-widest text-[#deb42b]/60">{profile.tier || t('profile.silverMember')}</p>
          </div>
        </div>
        <nav className="mt-8 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${activeTab === 'overview'
              ? 'bg-[#deb42b] text-[#0B1C2D] font-bold shadow-lg shadow-[#deb42b]/20'
              : 'text-[#deb42b] hover:bg-[#deb42b]/10 hover:text-[#deb42b]'
              }`}
          >
            <LayoutDashboard size={20} />
            <span className="text-sm uppercase tracking-wider">{t('profile.myProfile')}</span>
          </button>

          {/* NÚT BOOKING HISTORY */}
          <button
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${activeTab === 'history'
              ? 'bg-[#deb42b] text-[#0B1C2D] font-bold shadow-lg shadow-[#deb42b]/20'
              : 'text-[#deb42b] hover:bg-[#deb42b]/10 hover:text-[#deb42b]'
              }`}
          >
            <History size={20} />
            <span className="text-sm uppercase tracking-wider">{t('profile.bookingHistory')}</span>
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all mt-4 border border-red-500/20 cursor-pointer">
            <LogOut size={20} />
            <span className="text-sm font-semibold uppercase tracking-wider">{t('navbar.logout')}</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}

function ProfileOverview({ profile, bookings, onUpdateProfile }) {
  const { t } = useLanguage();
  const completedStays = bookings.filter(b => b.status === 'Completed').length;
  // STATE ĐỂ QUẢN LÝ CHẾ ĐỘ EDIT
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // STATE LƯU DỮ LIỆU ĐANG NHẬP
  const [formData, setFormData] = useState({
    name: profile.name || '',
    phone: profile.phone || '',
    address: profile.address || '',
    anhdaidien: profile.anhdaidien || '',
    current_password: '', // Mật khẩu cũ
    new_password: '',     // Mật khẩu mới
    new_password_confirmation: '' // Xác nhận mật khẩu mới
  });
  useEffect(() => {
    setFormData({
      name: profile.name || '',
      phone: profile.phone || '',
      address: profile.address || '',
      anhdaidien: profile.anhdaidien || '',
      current_password: '', // Mật khẩu cũ
      new_password: '',     // Mật khẩu mới
      new_password_confirmation: '' // Xác nhận mật khẩu mới
    });
  }, [profile]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (formData.current_password || formData.new_password || formData.new_password_confirmation) {
      if (!formData.current_password) {
        alert(t('profile.reqCurrentPass'));
        return;
      }
      if (!formData.new_password) {
        alert(t('profile.reqNewPass'));
        return;
      }
      if (formData.new_password.length < 6) {
        alert(t('profile.passLength'));
        return;
      }
      if (formData.new_password !== formData.new_password_confirmation) {
        alert(t('profile.passMismatch'));
        return;
      }
    }
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');

      // GỌI API ĐỂ LƯU VÀO DATABASE
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/update-profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status === 'success') {
        // Cập nhật UI ngay lập tức thông qua callback
        if (onUpdateProfile) {
          onUpdateProfile({
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            anhdaidien: formData.anhdaidien
          });
        }

        setIsEditing(false); // Tắt chế độ Edit

        // Cập nhật lại tên người dùng trên LocalStorage luôn để Navbar ở trên góc phải nó đổi theo
        try {
          const savedUser = JSON.parse(localStorage.getItem('user')) || {};
          savedUser.name = formData.name;
          localStorage.setItem('user', JSON.stringify(savedUser));
        } catch (e) {
          console.error("Lỗi cập nhật localStorage:", e);
        }
        // Reset lại ô mật khẩu cho trống
        setFormData(prev => ({ ...prev, current_password: '', new_password: '', new_password_confirmation: '' }));

        alert(t('profile.updateSuccess'));
      } else {
        alert(response.data.message); // Hiển thị lỗi nếu sai mật khẩu cũ
      }

    } catch (error) {
      console.error("LỖI CHI TIẾT TỪ LARAVEL:", error.response?.data);
      alert(t('profile.serverError') + (error.response?.data?.message || "Error"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="flex-1 flex flex-col animate-[fadeIn_0.5s_ease-out]">
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 text-[#deb42b]/60 text-xs uppercase tracking-widest mb-4">
          <span className="hover:text-[#deb42b] cursor-pointer">{t('profile.account')}</span>
          <span>/</span>
          <span className="text-[#deb42b] font-bold">{t('profile.overview')}</span>
        </div>
        <h1 className="serif-font text-4xl lg:text-5xl font-bold text-[#deb42b] mb-2">{t('profile.personalOverview')}</h1>
        <p className="text-[#deb42b]/60 font-light italic">{t('profile.overviewSubtitle')}</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* THẺ THÔNG TIN CÁ NHÂN CHÍNH */}
        <div className="xl:col-span-2 bg-[#deb42b]/5 border border-[#deb42b]/20 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-xl shadow-black/20 group transition-colors">

          <div className="flex justify-between items-center mb-8">
            <h3 className="serif-font text-2xl font-bold text-slate-100">{t('profile.accountDetails')}</h3>

            {/* NÚT EDIT / ACTION BUTTONS */}
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 text-[#deb42b]/60 hover:text-[#0B1C2D] text-xs font-bold uppercase tracking-widest hover:bg-[#deb42b] bg-[#deb42b]/10 border border-[#deb42b]/20 px-4 py-2 rounded-lg transition-all"
              >
                <Edit2 size={16} /> {t('profile.edit')}
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    // Reset lại data nếu hủy
                    setFormData({ name: profile.name, phone: profile.phone, address: profile.address });
                  }}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#deb42b]/60 hover:text-red-400 transition-colors"
                >
                  {t('profile.cancel')}
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#0B1C2D] bg-[#deb42b] rounded-lg hover:bg-white transition-colors disabled:opacity-50"
                >
                  {isSaving ? t('profile.saving') : t('profile.saveChanges')}
                </button>
              </div>
            )}
          </div>

          {/* KHU VỰC HIỂN THỊ HOẶC NHẬP LIỆU */}
          {!isEditing ? (
            // CHẾ ĐỘ XEM
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 animate-[fadeIn_0.3s_ease-in-out]">
              <InfoItem icon={<User />} label={t('profile.fullName')} value={profile.name} />
              <InfoItem icon={<Mail />} label={t('profile.email')} value={profile.email} />
              <InfoItem icon={<Phone />} label={t('profile.phone')} value={profile.phone || t('profile.notUpdatedPhone')} />
              <InfoItem icon={<MapPin />} label={t('profile.address')} value={profile.address || t('profile.notUpdatedAddress')} />
            </div>
          ) : (
            // CHẾ ĐỘ SỬA (FORM)
            <div className="flex flex-col gap-10 animate-[fadeIn_0.3s_ease-in-out]">

              {/* PHẦN 1: THÔNG TIN CÁ NHÂN (Nằm trong 1 ô riêng) */}
              <div>
                <h4 className="text-[#deb42b] font-bold text-sm mb-4 uppercase tracking-wider flex items-center gap-2">
                  <User size={16} /> {t('profile.personalInfo')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 bg-black/20 p-6 rounded-xl border border-[#deb42b]/10">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-[#deb42b]/80 font-bold">{t('profile.fullName')}</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-[#0B1C2D]/50 border border-[#deb42b]/30 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-[#deb42b] focus:ring-1 focus:ring-[#deb42b]/50" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-[#deb42b]/50">{t('profile.emailReadOnly')}</label>
                    <input type="email" value={profile.email} disabled className="w-full bg-[#0B1C2D]/30 border border-[#deb42b]/10 rounded-lg px-4 py-2.5 text-slate-500 cursor-not-allowed" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-[#deb42b]/80 font-bold">{t('profile.phone')}</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+84" className="w-full bg-[#0B1C2D]/50 border border-[#deb42b]/30 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-[#deb42b] focus:ring-1 focus:ring-[#deb42b]/50" />
                  </div>

                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-[10px] uppercase tracking-widest text-[#deb42b]/80 font-bold">{t('profile.address')}</label>
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder={t('profile.addressPlaceholder')} className="w-full bg-[#0B1C2D]/50 border border-[#deb42b]/30 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-[#deb42b] focus:ring-1 focus:ring-[#deb42b]/50" />
                  </div>
                </div>
              </div>

              {/* PHẦN 2: ĐỔI MẬT KHẨU (Giao diện rộng rãi và sang trọng hơn) */}
              <div>
                <h4 className="text-[#deb42b] font-bold text-sm mb-4 uppercase tracking-wider flex items-center justify-between">
                  <div className="flex items-center gap-2"><Lock size={16} /> {t('profile.securitySettings')}</div>
                  <span className="text-[10px] font-normal text-[#deb42b]/50 lowercase tracking-normal italic">{t('profile.leaveBlank')}</span>
                </h4>

                <div className="bg-black/20 p-6 rounded-xl border border-[#deb42b]/10 relative overflow-hidden">
                  {/* Trang trí góc thẻ */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#deb42b]/10 to-transparent rounded-bl-full pointer-events-none"></div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* DÒNG 1: MẬT KHẨU HIỆN TẠI (RỘNG RÃI) */}
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#deb42b]/60">{t('profile.currentPassword')}</label>
                      <input type="password" name="current_password" value={formData.current_password} onChange={handleInputChange} placeholder={t('profile.currentPasswordPlaceholder')} className="w-full md:w-1/2 bg-[#0B1C2D]/50 border border-[#deb42b]/20 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-[#deb42b] focus:ring-1 focus:ring-[#deb42b]/50" />
                    </div>

                    {/* DÒNG 2: MẬT KHẨU MỚI & XÁC NHẬN (NẰM SONG SONG) */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#deb42b]/60">{t('profile.newPassword')}</label>
                      <input type="password" name="new_password" value={formData.new_password} onChange={handleInputChange} placeholder={t('profile.newPasswordPlaceholder')} className="w-full bg-[#0B1C2D]/50 border border-[#deb42b]/20 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-[#deb42b] focus:ring-1 focus:ring-[#deb42b]/50" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#deb42b]/60">{t('profile.confirmNewPassword')}</label>
                      <input type="password" name="new_password_confirmation" value={formData.new_password_confirmation} onChange={handleInputChange} placeholder={t('profile.confirmNewPasswordPlaceholder')} className="w-full bg-[#0B1C2D]/50 border border-[#deb42b]/20 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-[#deb42b] focus:ring-1 focus:ring-[#deb42b]/50" />
                    </div>
                  </div>

                </div>
              </div>

            </div>

          )}
        </div>

        {/* THẺ THỐNG KÊ HẠNG THÀNH VIÊN */}
        <div className="bg-gradient-to-b from-[#deb42b]/20 to-[#deb42b]/5 border border-[#deb42b]/30 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-xl shadow-black/20">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="text-[#deb42b]" size={28} />
              <h3 className="serif-font text-xl font-bold text-[#deb42b]">{t('profile.membership')}</h3>
            </div>
            <p className="text-[#deb42b]/60 text-sm mb-6 italic">{t('profile.eliteClub')}</p>
            <div className="text-3xl font-bold text-slate-100 serif-font mb-2">{profile.tier || t('profile.silverMember')}</div>
            <p className="text-xs text-[#deb42b]/60 uppercase tracking-widest">{t('profile.currentTier')}</p>
          </div>

          <div className="mt-8 pt-6 border-t border-[#deb42b]/20 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300 font-light">{t('profile.completedStays')}</span>
              <span className="font-bold text-lg text-[#deb42b]">{completedStays}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300 font-light">{t('profile.totalBookings')}</span>
              <span className="font-bold text-lg text-[#deb42b]">{bookings.length}</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

// Component phụ để render từng dòng thông tin cho đẹp
function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4">
      <div className="p-3 bg-[#deb42b]/10 rounded-lg text-[#deb42b]">
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-widest text-[#deb42b]/50 mb-1">{label}</span>
        <span className="text-slate-200 font-medium text-sm md:text-base">{value}</span>
      </div>
    </div>
  );
}

// Bảng lịch sử nhận dữ liệu mảng bookings từ API
function BookingHistory({ bookings }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  return (
    <section className="flex-1 flex flex-col">
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 text-[#deb42b]/60 text-xs uppercase tracking-widest mb-4">
          <span className="hover:text-[#deb42b] cursor-pointer">{t('profile.account')}</span>
          <span>/</span>
          <span className="text-[#deb42b] font-bold">{t('profile.bookingHistory')}</span>
        </div>
        <h1 className="serif-font text-4xl lg:text-5xl font-bold text-[#deb42b] mb-2">{t('profile.bookingHistory')}</h1>
        <p className="text-[#deb42b]/60 font-light italic">{t('profile.historySubtitle')}</p>
      </div>

      <div className="grid gap-6">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))
        ) : (
          <div className="p-10 border border-[#deb42b]/20 bg-[#deb42b]/5 rounded-xl text-center">
            <p className="text-[#deb42b]/60 italic serif-font text-xl">{t('profile.noBookings')}</p>
            <button onClick={() => navigate('/room-map')} className="mt-4 px-6 py-2 bg-[#deb42b] text-[#0B1C2D] font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-white transition-colors cursor-pointer">
              {t('profile.exploreSuites')}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function BookingCard({ booking }) {
  const { t } = useLanguage();
  const isCompleted = booking.status === 'Completed';
  const isCancelled = booking.status === 'Cancelled';

  const getStatusText = (status) => {
    if (status === 'Completed') return t('profile.statusCompleted');
    if (status === 'Cancelled') return t('profile.statusCancelled');
    if (status === 'Booked') return t('profile.statusBooked');
    return status;
  };

  return (
    <div className="group flex flex-col md:flex-row items-stretch border border-[#deb42b]/20 bg-[#deb42b]/5 rounded-xl overflow-hidden hover:border-[#deb42b]/50 transition-all duration-300 shadow-xl shadow-black/20">
      <div className="w-full md:w-1/3 aspect-[4/3] md:aspect-auto">
        <div
          className={`w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105 ${isCancelled ? 'grayscale opacity-50' : ''}`}
          style={{ backgroundImage: `url('${booking.image}')` }}
        ></div>
      </div>
      <div className="flex-1 p-6 md:p-8 flex flex-col justify-between gap-6">
        <div className="flex justify-between items-start">
          <div>
            <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full mb-3 border ${isCompleted ? 'bg-green-900/40 text-green-400 border-green-500/30' :
              isCancelled ? 'bg-red-900/40 text-red-400 border-red-500/30' :
                'bg-[#deb42b]/20 text-[#deb42b] border-[#deb42b]/30'
              }`}>
              {getStatusText(booking.status)}
            </span>
            <h2 className={`serif-font text-2xl font-bold transition-colors ${isCancelled ? 'text-slate-500' : 'text-slate-100 group-hover:text-[#deb42b]'}`}>
              {booking.room}
            </h2>

            <div className="mt-2 grid grid-cols-2 gap-y-2 text-sm">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-[#deb42b]/40">{t('profile.room')}</span>
                <span className="text-[#deb42b]/80 font-mono">{booking.room_name}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-[#deb42b]/40">{t('profile.stayDuration')}</span>
                <span className="text-[#deb42b]/80">{booking.duration}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-[#deb42b]/40">{t('profile.total')}</span>
                <span className="text-[#deb42b]/80">{booking.total}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase tracking-widest text-[#deb42b]/40 block">{booking.amountLabel}</span>
            <span className={`text-xl font-bold serif-font ${isCancelled ? 'text-slate-500 line-through' : 'text-[#deb42b]'}`}>{booking.amount}</span>
          </div>
        </div>

        <div className="flex gap-4">
          {booking.actions?.includes('download') && !isCancelled && (
            <button className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 bg-[#deb42b] text-[#0B1C2D] text-sm font-bold uppercase tracking-widest rounded-lg hover:bg-white transition-all shadow-lg shadow-[#deb42b]/20 cursor-pointer">
              <Download size={18} /> {t('profile.downloadInvoice')}
            </button>
          )}
          {booking.actions?.includes('manage') && !isCompleted && !isCancelled && (
            <button className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 bg-[#deb42b]/20 text-[#deb42b] border border-[#deb42b]/40 text-sm font-bold uppercase tracking-widest rounded-lg hover:bg-[#deb42b] hover:text-[#0B1C2D] transition-all cursor-pointer">
              {t('profile.manageBooking')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="mt-auto px-6 lg:px-20 py-10 border-t border-[#deb42b]/10 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60">
      <p className="text-xs uppercase tracking-widest text-[#deb42b]/80">{t('footer.copyright')}</p>
    </footer>
  );
}
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Bell, LayoutDashboard, History, Settings, LogOut, Download, Star, RefreshCw, Mail, Phone, MapPin, Shield, Edit2, Link, Lock, Camera, Calendar, CheckCircle2, Sparkles, Printer } from 'lucide-react';
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
  const fileInputRef = React.useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleAvatarClick = () => {
    if (uploading) return;
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const compressImage = (file, maxWidth = 300, maxHeight = 300, quality = 0.85) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = () => resolve(event.target.result);
      };
      reader.onerror = () => resolve(null);
    });
  };

  const uploadToCloud = async (base64Image) => {
    try {
      const cleanBase64 = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');
      const body = new FormData();
      body.append('image', cleanBase64);
      const res = await axios.post('https://api.imgbb.com/1/upload?key=6d207e02198a847aa5a0a0a33ea96ffc', body);
      if (res.data?.data?.url) {
        return res.data.data.url;
      }
    } catch (e) {
      console.warn("Cloud CDN upload fallback to direct backend:", e);
    }
    return null;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, WebP, GIF)!');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Dung lượng ảnh tối đa cho phép là 10MB!');
      return;
    }

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      // 1. Nén ảnh siêu nhẹ trên client
      const base64Image = await compressImage(file, 300, 300, 0.85);

      // 2. Thử upload lên Cloud CDN để lấy URL vĩnh viễn siêu ngắn (< 50 ký tự)
      let finalAvatarUrl = null;
      if (base64Image) {
        finalAvatarUrl = await uploadToCloud(base64Image);
      }

      let res;
      // 3. Nếu có URL từ Cloud, lưu trực tiếp qua update-profile
      if (finalAvatarUrl) {
        res = await axios.post(`${import.meta.env.VITE_API_URL}/update-profile`, {
          name: profile.name,
          phone: profile.phone || '',
          address: profile.address || '',
          anhdaidien: finalAvatarUrl
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data?.status === 'success') {
          res.data.avatar_url = finalAvatarUrl;
        }
      }

      // 4. Nếu không có URL cloud hoặc cloud lỗi, gửi qua backend /upload-avatar
      if (!finalAvatarUrl || !res || res.data?.status !== 'success') {
        const formData = new FormData();
        formData.append('avatar', file);
        if (base64Image) {
          formData.append('avatar_base64', base64Image);
        }

        try {
          res = await axios.post(`${import.meta.env.VITE_API_URL}/upload-avatar`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          });
          finalAvatarUrl = res.data?.avatar_url || base64Image;
        } catch (uploadErr) {
          // Fallback cuối cùng
          if (base64Image) {
            res = await axios.post(`${import.meta.env.VITE_API_URL}/update-profile`, {
              name: profile.name,
              phone: profile.phone || '',
              address: profile.address || '',
              anhdaidien: base64Image
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });
            finalAvatarUrl = base64Image;
          } else {
            throw uploadErr;
          }
        }
      }

      const activeUrl = res?.data?.avatar_url || finalAvatarUrl || base64Image;
      if (activeUrl) {
        if (onUpdateProfile) {
          onUpdateProfile({ anhdaidien: activeUrl });
        }
        try {
          const savedUser = JSON.parse(localStorage.getItem('user')) || {};
          savedUser.anhdaidien = activeUrl;
          localStorage.setItem('user', JSON.stringify(savedUser));
        } catch (storageErr) {
          console.error(storageErr);
        }
        alert('Cập nhật ảnh đại diện thành công!');
      } else {
        alert(res?.data?.message || 'Lỗi khi cập nhật ảnh đại diện');
      }
    } catch (err) {
      console.error('Upload avatar error:', err);
      alert('Lỗi tải ảnh lên: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <aside className="w-full lg:w-1/4 flex flex-col gap-6">
      <div className="bg-[#deb42b]/5 border border-[#deb42b]/20 rounded-xl p-6">
        <div className="flex flex-col items-center text-center gap-4">
          {/* KHU VỰC AVATAR CÓ NÚT UPLOAD TỪ MÁY */}
          <div className="relative group cursor-pointer" onClick={handleAvatarClick} title="Bấm để tải ảnh đại diện từ máy">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="size-24 rounded-full border-2 border-[#deb42b] p-1 relative overflow-hidden">
              <div
                className="w-full h-full rounded-full bg-cover bg-center transition-all duration-300"
                style={{ backgroundImage: `url('${profile.anhdaidien || "https://cafefcdn.com/zoom/600_315/203337114487263232/2022/3/3/photo1646280815645-1646280816151764748403.jpg"}')` }}
              ></div>
            </div>

            {/* Lớp phủ hover hoặc loading */}
            <div
              className={`absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center transition-opacity duration-300 ${uploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            >
              {uploading ? (
                <>
                  <RefreshCw size={22} className="text-[#deb42b] animate-spin mb-1" />
                  <span className="text-[9px] text-white font-bold uppercase tracking-wider">Đang tải...</span>
                </>
              ) : (
                <>
                  <Camera size={22} className="text-[#deb42b] mb-1" />
                  <span className="text-[9px] text-white font-bold uppercase tracking-wider text-center px-1">Đổi Avatar</span>
                </>
              )}
            </div>
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
  const stayingBookings = bookings.filter(b => b.status === 'Staying').length;
  const upcomingBookings = bookings.filter(b => b.status === 'Booked').length;
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
      current_password: '', 
      new_password: '',     
      new_password_confirmation: '' 
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

        // Cập nhật lại tên người dùng trên LocalStorage
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
        alert(response.data.message);
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
                className="flex items-center gap-2 text-[#deb42b]/60 hover:text-[#0B1C2D] text-xs font-bold uppercase tracking-widest hover:bg-[#deb42b] bg-[#deb42b]/10 border border-[#deb42b]/20 px-4 py-2 rounded-lg transition-all cursor-pointer"
              >
                <Edit2 size={16} /> {t('profile.edit')}
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ name: profile.name, phone: profile.phone, address: profile.address });
                  }}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#deb42b]/60 hover:text-red-400 transition-colors cursor-pointer"
                >
                  {t('profile.cancel')}
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#0B1C2D] bg-[#deb42b] rounded-lg hover:bg-white transition-colors disabled:opacity-50 cursor-pointer"
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

              <div>
                <h4 className="text-[#deb42b] font-bold text-sm mb-4 uppercase tracking-wider flex items-center justify-between">
                  <div className="flex items-center gap-2"><Lock size={16} /> {t('profile.securitySettings')}</div>
                  <span className="text-[10px] font-normal text-[#deb42b]/50 lowercase tracking-normal italic">{t('profile.leaveBlank')}</span>
                </h4>

                <div className="bg-black/20 p-6 rounded-xl border border-[#deb42b]/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#deb42b]/10 to-transparent rounded-bl-full pointer-events-none"></div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#deb42b]/60">{t('profile.currentPassword')}</label>
                      <input type="password" name="current_password" value={formData.current_password} onChange={handleInputChange} placeholder={t('profile.currentPasswordPlaceholder')} className="w-full md:w-1/2 bg-[#0B1C2D]/50 border border-[#deb42b]/20 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-[#deb42b] focus:ring-1 focus:ring-[#deb42b]/50" />
                    </div>

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

        {/* THẺ THỐNG KÊ HẠNG THÀNH VIÊN VÀ TRẠNG THÁI LƯU TRÚ */}
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

          <div className="mt-8 pt-6 border-t border-[#deb42b]/20 flex flex-col gap-3">
            <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-[#deb42b]/10 border border-[#deb42b]/20">
              <span className="text-xs text-slate-200 font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#deb42b] animate-pulse"></span>
                {t('profile.stayingRooms')}
              </span>
              <span className="font-bold text-base text-[#deb42b]">{stayingBookings}</span>
            </div>

            <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-sky-950/30 border border-sky-500/20">
              <span className="text-xs text-sky-200 font-medium">{t('profile.upcomingRooms')}</span>
              <span className="font-bold text-base text-sky-400">{upcomingBookings}</span>
            </div>

            <div className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20">
              <span className="text-xs text-emerald-200 font-medium">{t('profile.completedStays')}</span>
              <span className="font-bold text-base text-emerald-400">{completedStays}</span>
            </div>

            <div className="flex justify-between items-center py-1 px-3">
              <span className="text-xs text-slate-400">{t('profile.totalBookings')}</span>
              <span className="font-bold text-sm text-slate-200">{bookings.length}</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

// Component phụ để render từng dòng thông tin
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

// Hàm in hóa đơn cho khách hàng
const printCustomerInvoice = (booking) => {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Hóa đơn đặt phòng - ${booking.id}</title>
        <style>
          body { font-family: 'Times New Roman', serif; padding: 40px; color: #0B1C2D; max-width: 750px; margin: auto; }
          .header { text-align: center; border-bottom: 2px solid #deb42b; padding-bottom: 20px; margin-bottom: 25px; }
          h1 { color: #deb42b; letter-spacing: 2px; margin-bottom: 5px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 25px; font-size: 14px; }
          .table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px; }
          .table th, .table td { border: 1px solid #ddd; padding: 10px; text-align: right; }
          .table th { background-color: #f8f5f0; text-align: center; font-weight: bold; }
          .table td:first-child { text-align: left; }
          .summary-box { margin-top: 20px; width: 50%; float: right; font-size: 14px; }
          .summary-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #ccc; }
          .summary-row.bold { font-weight: bold; border-bottom: none; font-size: 16px; color: #deb42b; border-top: 2px solid #0B1C2D; padding-top: 8px; margin-top: 4px; }
          .footer { clear: both; text-align: center; margin-top: 60px; font-style: italic; color: #666; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>LA MAISON HOTEL</h1>
          <p style="margin: 0;">123 Nguyễn Văn Cừ, Quận 1, TP.HCM | Hotline: 0123.456.789</p>
          <h2 style="margin-top: 15px;">PHIẾU XÁC NHẬN ĐẶT PHÒNG / HÓA ĐƠN</h2>
        </div>
        <div class="info-grid">
          <div>
            <p><strong>Mã phiếu:</strong> ${booking.id}</p>
            <p><strong>Hạng phòng:</strong> ${booking.room} (Phòng ${booking.room_name})</p>
            <p><strong>Trạng thái lưu trú:</strong> ${booking.status === 'Staying' ? 'Đang lưu trú' : booking.status === 'Completed' ? 'Đã hoàn thành (Đã trả phòng)' : booking.status === 'Cancelled' ? 'Đã hủy' : 'Đã đặt'}</p>
          </div>
          <div style="text-align: right;">
            <p><strong>Ngày nhận phòng:</strong> ${booking.checkIn || ''}</p>
            <p><strong>Ngày trả phòng:</strong> ${booking.checkOut || ''}</p>
            <p><strong>Ngày in:</strong> ${new Date().toLocaleDateString('vi-VN')}</p>
          </div>
        </div>
        <table class="table">
          <tr><th>Nội dung</th><th>Thời gian</th><th>Thành tiền</th></tr>
          <tr>
            <td>Phí phòng lưu trú (${booking.room})</td>
            <td style="text-align: center;">${booking.duration}</td>
            <td>${booking.total}</td>
          </tr>
        </table>
        <div class="summary-box">
          <div class="summary-row"><span>Tổng giá trị phòng:</span><span>${booking.total}</span></div>
          <div class="summary-row"><span>Hình thức thanh toán:</span><span>${booking.payment_status || 'Đã thanh toán'}</span></div>
          <div class="summary-row bold"><span>TỔNG THANH TOÁN:</span><span>${booking.total}</span></div>
        </div>
        <div class="footer"><p>Kính chúc quý khách có kỳ nghỉ tuyệt vời tại La Maison Hotel!</p></div>
      </body>
    </html>
  `);
  printWindow.document.close();
  setTimeout(() => { printWindow.print(); }, 250);
};

// Bảng lịch sử có Tab lọc theo các trạng thái phòng
function BookingHistory({ bookings }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');

  const stayingCount = bookings.filter(b => b.status === 'Staying').length;
  const bookedCount = bookings.filter(b => b.status === 'Booked').length;
  const completedCount = bookings.filter(b => b.status === 'Completed').length;
  const cancelledCount = bookings.filter(b => b.status === 'Cancelled').length;

  const filteredBookings = bookings.filter(b => {
    if (filter === 'all') return true;
    if (filter === 'staying') return b.status === 'Staying';
    if (filter === 'booked') return b.status === 'Booked';
    if (filter === 'completed') return b.status === 'Completed';
    if (filter === 'cancelled') return b.status === 'Cancelled';
    return true;
  });

  return (
    <section className="flex-1 flex flex-col">
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 text-[#deb42b]/60 text-xs uppercase tracking-widest mb-4">
          <span className="hover:text-[#deb42b] cursor-pointer">{t('profile.account')}</span>
          <span>/</span>
          <span className="text-[#deb42b] font-bold">{t('profile.bookingHistory')}</span>
        </div>
        <h1 className="serif-font text-4xl lg:text-5xl font-bold text-[#deb42b] mb-2">{t('profile.bookingHistory')}</h1>
        <p className="text-[#deb42b]/60 font-light italic">{t('profile.historySubtitle')}</p>
      </div>

      {/* THANH TAB LỌC TRẠNG THÁI PHÒNG */}
      <div className="flex flex-wrap items-center gap-2 mb-8 p-1.5 bg-[#deb42b]/5 rounded-xl border border-[#deb42b]/20">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 cursor-pointer ${filter === 'all'
            ? 'bg-[#deb42b] text-[#0B1C2D] shadow-md shadow-[#deb42b]/20'
            : 'text-slate-300 hover:text-[#deb42b] hover:bg-[#deb42b]/10'
          }`}
        >
          <span>{t('profile.filterAll')}</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${filter === 'all' ? 'bg-[#0B1C2D] text-[#deb42b]' : 'bg-[#deb42b]/20 text-[#deb42b]'}`}>
            {bookings.length}
          </span>
        </button>

        <button
          onClick={() => setFilter('staying')}
          className={`px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 cursor-pointer ${filter === 'staying'
            ? 'bg-amber-400 text-[#0B1C2D] shadow-md shadow-amber-400/20'
            : 'text-amber-300 hover:bg-amber-400/10'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span>{t('profile.filterStaying')}</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${filter === 'staying' ? 'bg-[#0B1C2D] text-amber-300' : 'bg-amber-400/20 text-amber-300'}`}>
            {stayingCount}
          </span>
        </button>

        <button
          onClick={() => setFilter('booked')}
          className={`px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 cursor-pointer ${filter === 'booked'
            ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
            : 'text-sky-300 hover:bg-sky-500/10'
          }`}
        >
          <span>{t('profile.filterBooked')}</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${filter === 'booked' ? 'bg-[#0B1C2D] text-sky-300' : 'bg-sky-500/20 text-sky-300'}`}>
            {bookedCount}
          </span>
        </button>

        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 cursor-pointer ${filter === 'completed'
            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
            : 'text-emerald-300 hover:bg-emerald-500/10'
          }`}
        >
          <span>{t('profile.filterCompleted')}</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${filter === 'completed' ? 'bg-[#0B1C2D] text-emerald-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
            {completedCount}
          </span>
        </button>

        {cancelledCount > 0 && (
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 cursor-pointer ${filter === 'cancelled'
              ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
              : 'text-red-400 hover:bg-red-500/10'
            }`}
          >
            <span>{t('profile.filterCancelled')}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${filter === 'cancelled' ? 'bg-[#0B1C2D] text-red-300' : 'bg-red-500/20 text-red-300'}`}>
              {cancelledCount}
            </span>
          </button>
        )}
      </div>

      <div className="grid gap-6">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
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
  const isStaying = booking.status === 'Staying';
  const isBooked = booking.status === 'Booked';
  const isCompleted = booking.status === 'Completed';
  const isCancelled = booking.status === 'Cancelled';

  // Thiết lập màu sắc và giao diện theo trạng thái
  const getCardStyle = () => {
    if (isStaying) {
      return 'border-[#deb42b] shadow-[0_0_30px_rgba(222,180,43,0.2)] bg-gradient-to-r from-[#deb42b]/15 via-[#deb42b]/5 to-[#0B1C2D]';
    }
    if (isBooked) {
      return 'border-sky-500/30 shadow-lg shadow-sky-950/30 bg-gradient-to-r from-sky-950/20 via-sky-900/5 to-[#0B1C2D] hover:border-sky-500/60';
    }
    if (isCompleted) {
      return 'border-emerald-500/20 bg-gradient-to-r from-emerald-950/15 via-emerald-900/5 to-[#0B1C2D] hover:border-emerald-500/40';
    }
    return 'border-red-500/20 bg-red-950/10 opacity-75';
  };

  const getBadge = () => {
    if (isStaying) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider rounded-full bg-[#deb42b] text-[#0B1C2D] shadow-md shadow-[#deb42b]/30">
          <span className="w-2 h-2 rounded-full bg-[#0B1C2D] animate-ping"></span>
          {t('profile.statusStaying')} (Đang lưu trú)
        </span>
      );
    }
    if (isBooked) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40">
          <Calendar size={13} />
          {t('profile.statusBooked')}
        </span>
      );
    }
    if (isCompleted) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          <CheckCircle2 size={13} />
          {t('profile.statusCompleted')}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
        {t('profile.statusCancelled')}
      </span>
    );
  };

  return (
    <div className={`group flex flex-col md:flex-row items-stretch border rounded-2xl overflow-hidden transition-all duration-300 ${getCardStyle()}`}>
      {/* Hình ảnh phòng */}
      <div className="w-full md:w-1/3 aspect-[4/3] md:aspect-auto relative overflow-hidden">
        <div
          className={`w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105 ${isCancelled ? 'grayscale opacity-50' : ''}`}
          style={{ backgroundImage: `url('${booking.image || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop'}')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C2D] via-transparent to-transparent md:hidden" />
      </div>

      {/* Thông tin phòng & trạng thái */}
      <div className="flex-1 p-6 md:p-8 flex flex-col justify-between gap-6">
        <div>
          <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
            <div>{getBadge()}</div>
            <span className="text-[11px] font-mono text-[#deb42b]/70 bg-[#0B1C2D]/60 px-2.5 py-1 rounded border border-[#deb42b]/20">
              #{booking.id}
            </span>
          </div>

          <h2 className={`serif-font text-2xl md:text-3xl font-bold transition-colors ${isCancelled ? 'text-slate-500' : isStaying ? 'text-[#deb42b]' : 'text-slate-100 group-hover:text-[#deb42b]'}`}>
            {booking.room}
          </h2>

          {isStaying && (
            <div className="mt-2 text-xs text-amber-200/90 font-medium flex items-center gap-1.5 bg-amber-400/10 px-3 py-1.5 rounded-lg border border-amber-400/20">
              <Sparkles size={14} className="text-[#deb42b] shrink-0" />
              <span>Quý khách đang trong thời gian lưu trú tại khách sạn. Chúc quý khách kỳ nghỉ tuyệt vời!</span>
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4 text-sm">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-[#deb42b]/50">{t('profile.room')}</span>
              <span className="text-slate-100 font-bold font-mono text-base">Phòng {booking.room_name}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-[#deb42b]/50">{t('profile.stayDuration')}</span>
              <span className="text-slate-200 font-medium">{booking.duration}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-[#deb42b]/50">{t('profile.paymentStatus')}</span>
              <span className="text-[#deb42b] font-medium text-xs truncate">{booking.payment_status || 'Đã thanh toán'}</span>
            </div>

            {booking.checkOutActual && (
              <div className="flex flex-col col-span-2">
                <span className="text-[10px] uppercase tracking-widest text-[#deb42b]/50">{t('profile.actualCheckOut')}</span>
                <span className="text-emerald-300 text-xs">{booking.checkOutActual}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer của Thẻ: Số tiền & Nút thao tác */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap justify-between items-center gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#deb42b]/50 block">{booking.amountLabel}</span>
            <span className={`text-2xl font-bold serif-font ${isCancelled ? 'text-slate-500 line-through' : isStaying ? 'text-[#deb42b]' : 'text-slate-100'}`}>
              {booking.total}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {!isCancelled && (
              <button
                onClick={() => printCustomerInvoice(booking)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#deb42b] text-[#0B1C2D] text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-white transition-all shadow-md shadow-[#deb42b]/20 cursor-pointer"
              >
                <Printer size={16} /> {isCompleted ? 'In hóa đơn' : 'In phiếu đặt'}
              </button>
            )}
          </div>
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
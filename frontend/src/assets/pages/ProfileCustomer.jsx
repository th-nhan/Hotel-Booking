import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Bell, LayoutDashboard, History, Settings, LogOut, Download, Star, RefreshCw, Mail, Phone, MapPin, Shield, Edit2, Link, Lock, Camera } from 'lucide-react';
export default function ProfileCustomer() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({ profile: {}, bookings: [] });
  const [activeTab, setActiveTab] = useState('overview');
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
          <Sidebar profile={userData.profile} activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === 'overview' ? (
            <ProfileOverview profile={userData.profile} bookings={userData.bookings} />
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

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-[#deb42b]/20 px-6 lg:px-20 py-5 bg-[#0B1C2D]/50 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <h2
          onClick={() => navigate('/')}
          className="serif-font text-[#deb42b] text-2xl font-bold leading-tight tracking-widest cursor-pointer"
        >
          LA MAISON DTN
        </h2>
      </div>
    </header>
  );
}
// Sidebar nhận dữ liệu profile thật
function Sidebar({ profile, activeTab, setActiveTab }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleChangeAvatar = async () => {
    const newAvatarUrl = window.prompt("Nhập đường dẫn (link) ảnh đại diện mới của bạn:", profile.anhdaidien || "");

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


        profile.anhdaidien = newAvatarUrl;
        alert("Đã cập nhật ảnh đại diện thành công!");
        window.location.reload();
      } catch (error) {
        // Bắt lỗi chi tiết 
        const errorMsg = error.response?.data?.message || "Lỗi không xác định";
        alert("Lỗi từ Server: " + errorMsg);
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
              <span className="text-[10px] text-white font-bold uppercase tracking-wider">Change</span>
            </button>
          </div>
          <div>
            <h3 className="serif-font text-xl font-bold text-[#deb42b]">{profile.name}</h3>
            <p className="text-xs uppercase tracking-widest text-[#deb42b]/60">{profile.tier}</p>
          </div>
        </div>
        <nav className="mt-8 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'overview'
              ? 'bg-[#deb42b] text-[#0B1C2D] font-bold shadow-lg shadow-[#deb42b]/20'
              : 'text-[#deb42b] hover:bg-[#deb42b]/10 hover:text-[#deb42b]'
              }`}
          >
            <LayoutDashboard size={20} />
            <span className="text-sm uppercase tracking-wider">Overview</span>
          </button>

          {/* NÚT BOOKING HISTORY */}
          <button
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'history'
              ? 'bg-[#deb42b] text-[#0B1C2D] font-bold shadow-lg shadow-[#deb42b]/20'
              : 'text-[#deb42b] hover:bg-[#deb42b]/10 hover:text-[#deb42b]'
              }`}
          >
            <History size={20} />
            <span className="text-sm uppercase tracking-wider">Booking History</span>
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all mt-4 border border-red-500/20">
            <LogOut size={20} />
            <span className="text-sm font-semibold uppercase tracking-wider">Sign Out</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}

function ProfileOverview({ profile, bookings }) {
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
        alert("Vui lòng nhập MẬT KHẨU HIỆN TẠI để được phép đổi mật khẩu mới!");
        return;
      }
      if (!formData.new_password) {
        alert("Vui lòng nhập Mật khẩu mới!");
        return;
      }
      if (formData.new_password.length < 6) {
        alert("Mật khẩu mới phải có ít nhất 6 ký tự!");
        return;
      }
      if (formData.new_password !== formData.new_password_confirmation) {
        alert("Xác nhận mật khẩu mới không khớp. Vui lòng kiểm tra lại!");
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
        // Cập nhật UI ngay lập tức
        profile.name = formData.name;
        profile.phone = formData.phone;
        profile.address = formData.address;
        profile.anhdaidien = formData.anhdaidien;

        setIsEditing(false); // Tắt chế độ Edit

        // Cập nhật lại tên người dùng trên LocalStorage luôn để Navbar ở trên góc phải nó đổi theo
        const savedUser = JSON.parse(localStorage.getItem('user'));
        savedUser.name = formData.name;
        localStorage.setItem('user', JSON.stringify(savedUser));
        // Reset lại ô mật khẩu cho trống
        setFormData({ ...formData, current_password: '', new_password: '', new_password_confirmation: '' });

        alert("Cập nhật thông tin cá nhân thành công!");
      } else {
        alert(response.data.message); // Hiển thị lỗi nếu sai mật khẩu cũ
      }

    } catch (error) {
      console.error("LỖI CHI TIẾT TỪ LARAVEL:", error.response?.data);
      alert("Lỗi từ máy chủ: " + (error.response?.data?.message || "Vui lòng xem Console"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="flex-1 flex flex-col animate-[fadeIn_0.5s_ease-out]">
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 text-[#deb42b]/60 text-xs uppercase tracking-widest mb-4">
          <span className="hover:text-[#deb42b] cursor-pointer">Account</span>
          <span>/</span>
          <span className="text-[#deb42b] font-bold">Overview</span>
        </div>
        <h1 className="serif-font text-4xl lg:text-5xl font-bold text-[#deb42b] mb-2">Personal Overview</h1>
        <p className="text-[#deb42b]/60 font-light italic">Manage your luxurious profile and preferences.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* THẺ THÔNG TIN CÁ NHÂN CHÍNH */}
        <div className="xl:col-span-2 bg-[#deb42b]/5 border border-[#deb42b]/20 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-xl shadow-black/20 group transition-colors">

          <div className="flex justify-between items-center mb-8">
            <h3 className="serif-font text-2xl font-bold text-slate-100">Account Details</h3>

            {/* NÚT EDIT / ACTION BUTTONS */}
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 text-[#deb42b]/60 hover:text-[#0B1C2D] text-xs font-bold uppercase tracking-widest hover:bg-[#deb42b] bg-[#deb42b]/10 border border-[#deb42b]/20 px-4 py-2 rounded-lg transition-all"
              >
                <Edit2 size={16} /> Edit
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
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#0B1C2D] bg-[#deb42b] rounded-lg hover:bg-white transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>

          {/* KHU VỰC HIỂN THỊ HOẶC NHẬP LIỆU */}
          {!isEditing ? (
            // CHẾ ĐỘ XEM
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 animate-[fadeIn_0.3s_ease-in-out]">
              <InfoItem icon={<User />} label="Full Name" value={profile.name} />
              <InfoItem icon={<Mail />} label="Email Address" value={profile.email} />
              <InfoItem icon={<Phone />} label="Phone Number" value={profile.phone || "(+84) Chưa cập nhật"} />
              <InfoItem icon={<MapPin />} label="Address" value={profile.address || "Chưa cập nhật địa chỉ"} />
            </div>
          ) : (
            // CHẾ ĐỘ SỬA (FORM)
            <div className="flex flex-col gap-10 animate-[fadeIn_0.3s_ease-in-out]">

              {/* PHẦN 1: THÔNG TIN CÁ NHÂN (Nằm trong 1 ô riêng) */}
              <div>
                <h4 className="text-[#deb42b] font-bold text-sm mb-4 uppercase tracking-wider flex items-center gap-2">
                  <User size={16} /> Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 bg-black/20 p-6 rounded-xl border border-[#deb42b]/10">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-[#deb42b]/80 font-bold">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-[#0B1C2D]/50 border border-[#deb42b]/30 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-[#deb42b] focus:ring-1 focus:ring-[#deb42b]/50" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-[#deb42b]/50">Email Address (Read-only)</label>
                    <input type="email" value={profile.email} disabled className="w-full bg-[#0B1C2D]/30 border border-[#deb42b]/10 rounded-lg px-4 py-2.5 text-slate-500 cursor-not-allowed" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-[#deb42b]/80 font-bold">Phone Number</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+84" className="w-full bg-[#0B1C2D]/50 border border-[#deb42b]/30 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-[#deb42b] focus:ring-1 focus:ring-[#deb42b]/50" />
                  </div>

                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-[10px] uppercase tracking-widest text-[#deb42b]/80 font-bold">Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Nhập địa chỉ của bạn" className="w-full bg-[#0B1C2D]/50 border border-[#deb42b]/30 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-[#deb42b] focus:ring-1 focus:ring-[#deb42b]/50" />
                  </div>
                </div>
              </div>

              {/* PHẦN 2: ĐỔI MẬT KHẨU (Giao diện rộng rãi và sang trọng hơn) */}
              <div>
                <h4 className="text-[#deb42b] font-bold text-sm mb-4 uppercase tracking-wider flex items-center justify-between">
                  <div className="flex items-center gap-2"><Lock size={16} /> Security Settings</div>
                  <span className="text-[10px] font-normal text-[#deb42b]/50 lowercase tracking-normal italic">(Leave blank if not changing)</span>
                </h4>

                <div className="bg-black/20 p-6 rounded-xl border border-[#deb42b]/10 relative overflow-hidden">
                  {/* Trang trí góc thẻ */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#deb42b]/10 to-transparent rounded-bl-full pointer-events-none"></div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* DÒNG 1: MẬT KHẨU HIỆN TẠI (RỘNG RÃI) */}
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#deb42b]/60">Current Password</label>
                      <input type="password" name="current_password" value={formData.current_password} onChange={handleInputChange} placeholder="Nhập mật khẩu hiện tại để xác nhận..." className="w-full md:w-1/2 bg-[#0B1C2D]/50 border border-[#deb42b]/20 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-[#deb42b] focus:ring-1 focus:ring-[#deb42b]/50" />
                    </div>

                    {/* DÒNG 2: MẬT KHẨU MỚI & XÁC NHẬN (NẰM SONG SONG) */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#deb42b]/60">New Password</label>
                      <input type="password" name="new_password" value={formData.new_password} onChange={handleInputChange} placeholder="Nhập mật khẩu mới..." className="w-full bg-[#0B1C2D]/50 border border-[#deb42b]/20 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-[#deb42b] focus:ring-1 focus:ring-[#deb42b]/50" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#deb42b]/60">Confirm New Pwd</label>
                      <input type="password" name="new_password_confirmation" value={formData.new_password_confirmation} onChange={handleInputChange} placeholder="Nhập lại mật khẩu mới..." className="w-full bg-[#0B1C2D]/50 border border-[#deb42b]/20 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-[#deb42b] focus:ring-1 focus:ring-[#deb42b]/50" />
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
              <h3 className="serif-font text-xl font-bold text-[#deb42b]">Membership</h3>
            </div>
            <p className="text-[#deb42b]/60 text-sm mb-6 italic">LA MAISON DTN Elite Club</p>
            <div className="text-3xl font-bold text-slate-100 serif-font mb-2">{profile.tier || "Silver Member"}</div>
            <p className="text-xs text-[#deb42b]/60 uppercase tracking-widest">Current Tier</p>
          </div>

          <div className="mt-8 pt-6 border-t border-[#deb42b]/20 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300 font-light">Completed Stays</span>
              <span className="font-bold text-lg text-[#deb42b]">{completedStays}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300 font-light">Total Bookings</span>
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
  return (
    <section className="flex-1 flex flex-col">
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 text-[#deb42b]/60 text-xs uppercase tracking-widest mb-4">
          <span className="hover:text-[#deb42b] cursor-pointer">Account</span>
          <span>/</span>
          <span className="text-[#deb42b] font-bold">Booking History</span>
        </div>
        <h1 className="serif-font text-4xl lg:text-5xl font-bold text-[#deb42b] mb-2">Booking History</h1>
        <p className="text-[#deb42b]/60 font-light italic">Reflecting on your journey of refined luxury at LA MAISON DTN.</p>
      </div>

      <div className="grid gap-6">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))
        ) : (
          <div className="p-10 border border-[#deb42b]/20 bg-[#deb42b]/5 rounded-xl text-center">
            <p className="text-[#deb42b]/60 italic serif-font text-xl">You don't have any bookings yet.</p>
            <button onClick={() => navigate('/room-map')} className="mt-4 px-6 py-2 bg-[#deb42b] text-[#0B1C2D] font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-white transition-colors">
              Explore Suites
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function BookingCard({ booking }) {
  const isCompleted = booking.status === 'Completed';
  const isCancelled = booking.status === 'Cancelled';

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
              {booking.status}
            </span>
            <h2 className={`serif-font text-2xl font-bold transition-colors ${isCancelled ? 'text-slate-500' : 'text-slate-100 group-hover:text-[#deb42b]'}`}>
              {booking.room}
            </h2>

            <div className="mt-2 grid grid-cols-2 gap-y-2 text-sm">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-[#deb42b]/40">Room</span>
                <span className="text-[#deb42b]/80 font-mono">{booking.room_name}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-[#deb42b]/40">Stay Duration</span>
                <span className="text-[#deb42b]/80">{booking.duration}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-[#deb42b]/40">Total</span>
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
            <button className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 bg-[#deb42b] text-[#0B1C2D] text-sm font-bold uppercase tracking-widest rounded-lg hover:bg-white transition-all shadow-lg shadow-[#deb42b]/20">
              <Download size={18} /> Download Invoice
            </button>
          )}
          {booking.actions?.includes('manage') && !isCompleted && !isCancelled && (
            <button className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 bg-[#deb42b]/20 text-[#deb42b] border border-[#deb42b]/40 text-sm font-bold uppercase tracking-widest rounded-lg hover:bg-[#deb42b] hover:text-[#0B1C2D] transition-all">
              Manage Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-auto px-6 lg:px-20 py-10 border-t border-[#deb42b]/10 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60">
      <p className="text-xs uppercase tracking-widest text-[#deb42b]/80">© 2024 LA MAISON DTN. All Rights Reserved.</p>
    </footer>
  );
}
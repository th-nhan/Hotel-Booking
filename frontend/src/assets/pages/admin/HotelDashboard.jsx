import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LayoutDashboard, Map as MapIcon, CalendarDays, Users, FileText, Settings,
  Search, Download, Bell, UserCircle, LogOut, X,
  Sparkles, BedDouble, CheckCircle2, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export default function HotelDashboard() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [stats, setStats] = useState({
    totalRooms: 0, available: 0, occupied: 0, cleaning: 0, occupancyRate: 0, revenueToday: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. GỌI API LẤY DỮ LIỆU TỪ LARAVEL
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard`);
      setRooms(response.data.rooms);
      setStats(response.data.stats);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu Dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Tự động làm mới dữ liệu mỗi 30 giây (Real-time nhẹ)
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  // 2. MAP MÀU SẮC THEO TRẠNG THÁI TIẾNG VIỆT TỪ DB
  const getRoomStyle = (status) => {
    switch (status) {
      case 'Trống':
        return 'border border-[#D4AF37] text-[#D4AF37] bg-transparent hover:bg-[#D4AF37]/10';
      case 'Đã đặt':
        return 'bg-[#0B1C2D] text-white border border-[#0B1C2D]';
      case 'Đang ở':
        return 'bg-[#D4AF37] text-[#0B1C2D] border border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)] font-bold';
      case 'Đang dọn':
        return 'bg-gray-200 text-gray-500 border border-gray-300';
      default:
        return 'bg-gray-100 text-gray-400';
    }
  };

  // API Trả phòng
  const handleCheckout = async () => {
    if (!selectedRoom || !window.confirm(`Xác nhận trả phòng ${selectedRoom.number}?`)) return;
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/tra-phong`, { PhongID: selectedRoom.id });
      fetchDashboardData(); // Gọi lại API để update biểu đồ & map
      setSelectedRoom({ ...selectedRoom, status: 'Đang dọn', guestName: null });
    } catch (error) {
      alert("Lỗi khi trả phòng: " + error.message);
    }
  };

  if (loading && rooms.length === 0) {
    return <div className="h-screen bg-[#0B1C2D] flex items-center justify-center text-[#D4AF37]"><RefreshCw className="w-10 h-10 animate-spin" /></div>;
  }

  // Nhóm phòng theo tầng để render
  const floors = [...new Set(rooms.map(r => r.floor))].sort((a, b) => b - a);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  return (
    <div className="flex h-screen font-sans bg-[#F8F5F0] text-[#0B1C2D] overflow-hidden selection:bg-[#D4AF37]/30 custom-scrollbar">

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #D4AF37; border-radius: 10px; }
        .bg-marble {
          background-image: radial-gradient(#D4AF37 0.5px, transparent 0.5px), radial-gradient(#D4AF37 0.5px, #F8F5F0 0.5px);
          background-size: 20px 20px; background-position: 0 0, 10px 10px; background-color: #F8F5F0; opacity: 0.4;
        }
      `}} />

      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-[#0B1C2D] text-white flex flex-col z-20 shadow-2xl">
        <div className="h-20 flex items-center justify-center border-b border-white/10 gap-3">
          <Sparkles className="w-6 h-6 text-[#D4AF37]" />
          <h1 className="text-xl font-serif font-bold tracking-widest text-[#D4AF37]">LA MAISON</h1>
        </div>
        <nav className="flex-1 py-8 px-4 space-y-2">
          <NavItem icon={<LayoutDashboard />} label="Dashboard" active />
          <NavItem icon={<MapIcon />} label="Room Map" />
          <NavItem icon={<CalendarDays />} label="Bookings" />
          <NavItem icon={<Users />} label="Guests" />
          <NavItem icon={<FileText />} label="Reports" />
          <NavItem icon={<Settings />} label="Settings" />
          <NavItem onClick={handleLogout} icon={<LogOut />} label="Logout" />

        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col relative h-screen">
        <div className="absolute inset-0 z-0 bg-marble pointer-events-none"></div>

        <header className="h-20 px-8 flex items-center justify-between border-b border-[#0B1C2D]/10 bg-[#F8F5F0]/80 backdrop-blur-md z-10 relative">
          <div>
            <h2 className="text-2xl font-serif font-bold">Overview</h2>
            <p className="text-sm text-[#0B1C2D]/60">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative p-2 rounded-full bg-white border border-[#0B1C2D]/10 hover:border-[#D4AF37] transition-colors">
              <Bell className="w-5 h-5 text-[#0B1C2D]" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 z-10 relative custom-scrollbar space-y-8">

          {/* Top Row: KPI Cards DỮ LIỆU THẬT */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard title="Tổng số phòng" value={stats.totalRooms} icon={<BedDouble />} color="navy" />
            <KPICard title="Tỷ lệ lấp đầy" value={`${stats.occupancyRate}%`} subtitle={`${stats.occupied} phòng có khách`} icon={<CheckCircle2 />} color="gold" progress={stats.occupancyRate} />
            <KPICard title="Phòng trống" value={stats.available} icon={<CheckCircle2 />} color="white" />
            <KPICard title="Doanh thu dự kiến" value={`${new Intl.NumberFormat('vi-VN').format(stats.revenueToday)}đ`} subtitle="Đang lưu trú" icon={<FileText />} color="white" />
          </div>

          {/* Middle: Interactive Room Map */}
          <div className="bg-white rounded-2xl border border-[#0B1C2D]/10 shadow-xl shadow-[#0B1C2D]/5 overflow-hidden">
            <div className="p-6 border-b border-[#0B1C2D]/10 flex justify-between items-center bg-gradient-to-r from-[#0B1C2D] to-[#1a365d]">
              <h3 className="text-xl font-serif font-bold text-white tracking-wide">Sơ đồ phòng trực tuyến</h3>
              <div className="flex gap-4">
                <StatusLegend color="bg-transparent border border-[#D4AF37] text-[#D4AF37]" label="Trống" />
                <StatusLegend color="bg-[#0B1C2D]" label="Đã đặt" />
                <StatusLegend color="bg-[#D4AF37]" label="Đang ở" />
                <StatusLegend color="bg-gray-200" label="Đang dọn" />
              </div>
            </div>

            <div className="p-8 flex flex-col gap-4">
              {floors.map(floor => {
                const floorRooms = rooms.filter(r => r.floor === floor);
                let gridClass = "grid-cols-10";
                if (floor >= 9) gridClass = "grid-cols-3";
                if (floor >= 6 && floor <= 8) gridClass = "grid-cols-5";

                return (
                  <div key={floor} className="flex items-stretch gap-4 border-b border-dashed border-[#0B1C2D]/10 pb-4 last:border-0 last:pb-0">
                    <div className="w-16 flex flex-col justify-center items-center bg-[#F8F5F0] rounded-lg border border-[#D4AF37]/30 text-[#0B1C2D]">
                      <span className="text-xs uppercase tracking-widest font-bold text-[#D4AF37]">Lầu</span>
                      <span className="text-2xl font-serif">{floor}</span>
                    </div>

                    <div className={`flex-1 grid ${gridClass} gap-3`}>
                      {floorRooms.map(room => (
                        <button
                          key={room.id}
                          onClick={() => setSelectedRoom(room)}
                          className={`
                            h-14 rounded-lg flex flex-col items-center justify-center font-bold transition-all duration-300 transform hover:-translate-y-1 relative
                            ${getRoomStyle(room.status)}
                            ${selectedRoom?.id === room.id ? 'ring-4 ring-[#D4AF37]/50 ring-offset-2 z-10' : ''}
                          `}
                        >
                          <span className="text-lg">{room.number}</span>
                          {(room.status === 'Đã đặt' || room.status === 'Đang ở') && <span className="absolute bottom-1 text-[10px] truncate w-full px-1">{room.guestName?.split(' ').pop()}</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom: Guest Table */}
          <div className="bg-white rounded-2xl border border-[#0B1C2D]/10 shadow-xl shadow-[#0B1C2D]/5 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-[#0B1C2D]/10 flex justify-between items-center">
              <h3 className="text-lg font-serif font-bold">Khách đang lưu trú gần đây</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F8F5F0] text-[#0B1C2D]/60 uppercase tracking-widest text-[10px]">
                  <tr>
                    <th className="px-6 py-4 font-bold">Tên Khách</th>
                    <th className="px-6 py-4 font-bold">Phòng</th>
                    <th className="px-6 py-4 font-bold">Check In</th>
                    <th className="px-6 py-4 font-bold">Check Out</th>
                    <th className="px-6 py-4 font-bold">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0B1C2D]/5">
                  {rooms.filter(r => r.guestName).slice(0, 10).map((room, idx) => (
                    <tr key={idx} className="hover:bg-[#F8F5F0]/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-[#0B1C2D]">{room.guestName}</td>
                      <td className="px-6 py-4 font-medium text-[#D4AF37]">{room.number} ({room.type})</td>
                      <td className="px-6 py-4">{room.checkIn}</td>
                      <td className="px-6 py-4">{room.checkOut}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${room.status === 'Đang ở' ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-[#0B1C2D]/10 text-[#0B1C2D]'
                          }`}>
                          {room.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* --- RIGHT DRAWER (ROOM DETAILS) --- */}
      <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-[-10px_0_30px_rgba(11,28,45,0.1)] z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${selectedRoom ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedRoom && (
          <div className="h-full flex flex-col">
            <div className="h-40 bg-[#0B1C2D] relative p-6 flex flex-col justify-end text-white">
              <button onClick={() => setSelectedRoom(null)} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">{selectedRoom.type}</span>
                  <h2 className="text-4xl font-serif font-bold mt-1">Phòng {selectedRoom.number}</h2>
                </div>
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded ${selectedRoom.status === 'Trống' ? 'bg-[#D4AF37]/20 text-[#D4AF37]' :
                    selectedRoom.status === 'Đã đặt' ? 'bg-white/20 text-white' :
                      selectedRoom.status === 'Đang ở' ? 'bg-[#D4AF37] text-[#0B1C2D]' : 'bg-gray-400 text-white'
                  }`}>
                  {selectedRoom.status}
                </span>
              </div>
            </div>

            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar space-y-6">
              <div className="bg-[#F8F5F0] p-4 rounded-xl border border-[#D4AF37]/20 flex justify-between items-center">
                <div>
                  <p className="text-xs text-[#0B1C2D]/60 uppercase tracking-widest font-bold">Giá mỗi đêm</p>
                  <p className="text-2xl font-serif font-bold text-[#D4AF37]">{new Intl.NumberFormat('vi-VN').format(selectedRoom.price)}đ</p>
                </div>
                <Sparkles className="text-[#D4AF37]/50 w-8 h-8" />
              </div>

              {selectedRoom.guestName ? (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-[#0B1C2D]/60 border-b border-[#0B1C2D]/10 pb-2">Thông tin lưu trú</h4>
                  <div>
                    <p className="text-xl font-bold text-[#0B1C2D]">{selectedRoom.guestName}</p>
                    <p className="text-sm text-[#0B1C2D]/70 mt-1 flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-[#D4AF37]" />
                      {selectedRoom.checkIn} đến {selectedRoom.checkOut}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-10 flex flex-col items-center justify-center text-center opacity-50">
                  <UserCircle className="w-16 h-16 mb-2 text-[#0B1C2D]" />
                  <p className="font-bold">Phòng đang trống</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-[#0B1C2D]/10 bg-[#F8F5F0]">
              {selectedRoom.status === 'Đang ở' && (
                <button onClick={handleCheckout} className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-600/20">
                  <LogOut className="w-4 h-4" /> Trả phòng (Check-Out)
                </button>
              )}
              {selectedRoom.status === 'Đang dọn' && (
                <button className="w-full h-12 border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B1C2D] font-bold uppercase tracking-widest text-sm rounded-lg transition-colors">
                  Hoàn tất dọn dẹp
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {selectedRoom && (
        <div className="fixed inset-0 bg-[#0B1C2D]/20 backdrop-blur-sm z-40" onClick={() => setSelectedRoom(null)}></div>
      )}

    </div>
  );
}

// Sub components
function NavItem({ icon, label, active, onClick }) {
  return (
    <a href="#"
      onClick={(e) => {
        e.preventDefault();
        if (onClick) onClick();
      }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-medium ${active ? 'bg-[#D4AF37] text-[#0B1C2D] shadow-[0_0_15px_rgba(212,175,55,0.2)]' : 'text-white/70 hover:bg-white/5 hover:text-[#D4AF37]'
        }`}>
      {React.cloneElement(icon, { className: 'w-5 h-5' })}
      <span>{label}</span>
    </a>
  );
}

function KPICard({ title, value, subtitle, icon, color, progress }) {
  const isNavy = color === 'navy';
  const isGold = color === 'gold';
  return (
    <div className={`p-6 rounded-2xl border transition-transform hover:-translate-y-1 ${isNavy ? 'bg-[#0B1C2D] text-white border-[#0B1C2D] shadow-xl shadow-[#0B1C2D]/20' :
        isGold ? 'bg-gradient-to-br from-[#D4AF37] to-[#B5952F] text-[#0B1C2D] border-[#D4AF37] shadow-xl shadow-[#D4AF37]/30' :
          'bg-white text-[#0B1C2D] border-[#0B1C2D]/10 shadow-xl shadow-[#0B1C2D]/5'
      }`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isNavy ? 'text-white/60' : isGold ? 'text-[#0B1C2D]/70' : 'text-[#0B1C2D]/50'}`}>{title}</p>
          <h3 className="text-3xl font-serif font-bold">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${isNavy ? 'bg-white/10 text-[#D4AF37]' : isGold ? 'bg-[#0B1C2D]/10 text-[#0B1C2D]' : 'bg-[#F8F5F0] text-[#D4AF37]'}`}>
          {React.cloneElement(icon, { className: 'w-6 h-6' })}
        </div>
      </div>
      {progress !== undefined && (
        <div className="w-full bg-[#0B1C2D]/10 h-1.5 rounded-full overflow-hidden mt-4">
          <div className="bg-[#0B1C2D] h-full rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      )}
      {subtitle && (
        <p className={`text-sm mt-4 font-medium ${isNavy ? 'text-white/80' : isGold ? 'text-[#0B1C2D]/80' : 'text-green-600'}`}>{subtitle}</p>
      )}
    </div>
  );
}

function StatusLegend({ color, label }) {
  return (
    <div className="flex items-center gap-2 text-xs text-white/80 uppercase tracking-widest font-bold">
      <span className={`w-3 h-3 rounded-full ${color}`}></span>
      {label}
    </div>
  );
}
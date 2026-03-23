import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LayoutDashboard, Map as MapIcon, CalendarDays, Users, FileText, Settings,
  Search, Download, Bell, UserCircle, LogOut, X,
  Sparkles, BedDouble, CheckCircle2, RefreshCw, Printer, LogIn, PaintBucket,
  MessageSquare, Star, Calendar, Bot // Đã thêm icon Bot cho nút AI
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HotelDashboard() {
  const navigate = useNavigate();
  // 1. STATE QUẢN LÝ TAB HIỆN TẠI
  const [activeTab, setActiveTab] = useState('dashboard');

  const [rooms, setRooms] = useState([]);
  const [stats, setStats] = useState({
    totalRooms: 0, available: 0, occupied: 0, cleaning: 0, occupancyRate: 0, revenueToday: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // --- THÊM STATE CHO REVIEWS ---
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [timeRange, setTimeRange] = useState('all');
  
  // Thêm state loading riêng cho nút AI
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // --- API GỌI DỮ LIỆU PHÒNG CHUNG ---
  const processRoomStatuses = (fetchedRooms) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return fetchedRooms.map(room => {
      let checkInDate = null;
      let checkOutDate = null;

      if (room.checkIn) {
        let inStr = room.checkIn;
        if (inStr.includes('/')) inStr = inStr.split('/').reverse().join('-'); 
        checkInDate = new Date(inStr);
        checkInDate.setHours(0, 0, 0, 0);
      }

      if (room.checkOut) {
        let outStr = room.checkOut;
        if (outStr.includes('/')) outStr = outStr.split('/').reverse().join('-');
        checkOutDate = new Date(outStr);
        checkOutDate.setHours(0, 0, 0, 0);
      }
      
      if (checkOutDate && today.getTime() > checkOutDate.getTime()) {
        return { ...room, status: 'Trống', guestName: null };
      }
      
      if (room.status === 'Đã đặt' && checkInDate && today.getTime() >= checkInDate.getTime()) {
        if (!checkOutDate || today.getTime() <= checkOutDate.getTime()) {
          return { ...room, status: 'Đang ở' };
        }
      }

      return room; 
    });
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard`);
      const processedRooms = processRoomStatuses(response.data.rooms);
      setRooms(processedRooms);
      setStats(response.data.stats);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu Dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- API GỌI DỮ LIỆU ĐÁNH GIÁ CÓ LỌC THỜI GIAN ---
  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/review`, {
        params: { time_range: timeRange } 
      });
      const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
      setReviews(data);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu đánh giá:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này không? Hành động này không thể hoàn tác!")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/review/${id}`);
      alert("Đã xóa đánh giá thành công!");
      setReviews(reviews.filter(review => review.DanhGiaID !== id));
    } catch (error) {
      alert("Lỗi xóa đánh giá: " + error.message);
    }
  };

  // --- HÀM XUẤT BÁO CÁO AI (Đã được chuyển từ AIAnalyzer sang đây) ---
  const handleAnalyzeAndDownload = async () => {
    setIsAnalyzing(true);
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/reviews/analyze-export`, {
            time_range: timeRange 
        }, {
            responseType: 'blob', 
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        const timeLabel = timeRange === 'all' ? 'Tat_Ca' : timeRange + '_Thang';
        link.setAttribute('download', `Bao_Cao_AI_${timeLabel}_${Date.now()}.xlsx`); 
        document.body.appendChild(link);
        link.click();
        
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
        
    } catch (error) {
        console.error("Lỗi tải file:", error);
        if(error.response && error.response.status === 404) {
            alert("Không có đánh giá nào trong khoảng thời gian này để phân tích!");
        } else {
            alert("Đã có lỗi xảy ra khi gọi AI. Vui lòng kiểm tra lại server!");
        }
    } finally {
        setIsAnalyzing(false);
    }
  };

  // --- EFFECTS ---
  useEffect(() => {
    if (selectedRoom) {
      const updated = rooms.find(r => r.id === selectedRoom.id);
      if (updated && updated.status !== selectedRoom.status) {
        setSelectedRoom(updated);
      }
    }
  }, [rooms, selectedRoom]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTab === 'reviews') {
      fetchReviews();
    }
  }, [activeTab, timeRange]);

  const getRoomStyle = (status) => {
    switch (status) {
      case 'Trống': return 'border border-[#D4AF37] text-[#D4AF37] bg-transparent hover:bg-[#D4AF37]/10';
      case 'Đã đặt': return 'bg-[#0B1C2D] text-white border border-[#0B1C2D]';
      case 'Đang ở': return 'bg-[#D4AF37] text-[#0B1C2D] border border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)] font-bold';
      case 'Đang dọn': return 'bg-gray-200 text-gray-500 border border-gray-300';
      default: return 'bg-gray-100 text-gray-400';
    }
  };

  const handleCheckIn = async () => {
    if (!selectedRoom || !window.confirm(`Xác nhận khách đã nhận phòng ${selectedRoom.number}?`)) return;
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/nhan-phong`, { PhongID: selectedRoom.id });
      fetchDashboardData();
      setSelectedRoom({ ...selectedRoom, status: 'Đang ở' });
    } catch (error) {
      alert("Lỗi Check-in: " + error.message);
    }
  };

  const handleCheckout = async () => {
    if (!selectedRoom || !window.confirm(`Xác nhận trả phòng ${selectedRoom.number}?`)) return;
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/tra-phong`, { PhongID: selectedRoom.id });
      fetchDashboardData();
      setSelectedRoom({ ...selectedRoom, status: 'Đang dọn', guestName: null });
    } catch (error) {
      alert("Lỗi khi trả phòng: " + error.message);
    }
  };

  const handleCleaned = async () => {
    if (!selectedRoom) return;
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/hoan-tat-don`, { PhongID: selectedRoom.id });
      fetchDashboardData();
      setSelectedRoom({ ...selectedRoom, status: 'Trống' });
    } catch (error) {
      alert("Lỗi cập nhật: " + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const exportInvoice = (room) => {
    const checkInDate = new Date(room.checkIn);
    const checkOutDate = new Date(room.checkOut);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    let daysStayed = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (daysStayed <= 0) daysStayed = 1;

    const roomPrice = Number(room.price) || 0;
    const roomTotal = roomPrice * daysStayed;
    const serviceFee = Number(room.serviceFee) || 0;
    const deposit = Number(room.deposit) || 0;
    const grandTotal = (roomTotal + serviceFee) - deposit;

    const formatVND = (amount) => new Intl.NumberFormat('vi-VN').format(amount) + ' VND';

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Hóa đơn - ${room.guestName}</title>
          <style>
            body { font-family: 'Times New Roman', serif; padding: 40px; color: #0B1C2D; max-width: 800px; margin: auto; }
            .header { text-align: center; border-bottom: 2px solid #D4AF37; padding-bottom: 20px; margin-bottom: 30px; }
            h1 { color: #D4AF37; letter-spacing: 2px; margin-bottom: 5px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 30px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .table th, .table td { border: 1px solid #ccc; padding: 12px; text-align: right; }
            .table th { background-color: #f8f5f0; text-align: center; font-weight: bold; }
            .table td:first-child { text-align: left; }
            .summary-box { margin-top: 20px; width: 50%; float: right; }
            .summary-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #ccc; }
            .summary-row.bold { font-weight: bold; border-bottom: none; font-size: 18px; }
            .summary-row.total-pay { color: #D4AF37; font-size: 22px; border-top: 2px solid #0B1C2D; padding-top: 10px; margin-top: 5px; }
            .footer { clear: both; text-align: center; margin-top: 80px; font-style: italic; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>LA MAISON HOTEL</h1>
            <p style="margin: 0;">123 Nguyễn Văn Cừ, Quận 1, TP.HCM | ĐT: 0123.456.789</p>
            <h2 style="margin-top: 20px;">HÓA ĐƠN THANH TOÁN (INVOICE)</h2>
          </div>
          <div class="info-grid">
            <div>
              <p><strong>Khách hàng:</strong> ${room.guestName}</p>
              <p><strong>Số phòng:</strong> ${room.number} (${room.type})</p>
            </div>
            <div style="text-align: right;">
              <p><strong>Ngày Check-in:</strong> ${room.checkIn}</p>
              <p><strong>Ngày Check-out:</strong> ${room.checkOut}</p>
              <p><strong>Ngày in HĐ:</strong> ${new Date().toLocaleDateString('vi-VN')}</p>
            </div>
          </div>
          <table class="table">
            <tr><th>Hạng mục dịch vụ</th><th>Đơn giá</th><th>Số lượng</th><th>Thành tiền</th></tr>
            <tr>
              <td>Tiền phòng lưu trú</td>
              <td>${formatVND(roomPrice)} / đêm</td>
              <td style="text-align: center;">${daysStayed} đêm</td>
              <td>${formatVND(roomTotal)}</td>
            </tr>
            ${serviceFee > 0 ? `
            <tr>
              <td>Phí dịch vụ phát sinh</td><td>-</td><td style="text-align: center;">-</td>
              <td>${formatVND(serviceFee)}</td>
            </tr>` : ''}
          </table>
          <div class="summary-box">
            <div class="summary-row"><span>Tổng cộng:</span><span>${formatVND(roomTotal + serviceFee)}</span></div>
            <div class="summary-row"><span>Đã đặt cọc:</span><span style="color: red;">- ${formatVND(deposit)}</span></div>
            <div class="summary-row bold total-pay"><span>CẦN THANH TOÁN:</span><span>${formatVND(grandTotal > 0 ? grandTotal : 0)}</span></div>
          </div>
          <div class="footer"><p>Cảm ơn quý khách đã sử dụng dịch vụ tại La Maison Hotel!</p></div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 250);
  };

  if (loading && rooms.length === 0) {
    return <div className="h-screen bg-[#0B1C2D] flex items-center justify-center text-[#D4AF37]"><RefreshCw className="w-10 h-10 animate-spin" /></div>;
  }

  const floors = [...new Set(rooms.map(r => r.floor))].sort((a, b) => b - a);

  // ================= RENDER CÁC TAB CHÍNH =================
  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
      <KPICard title="Tổng số phòng" value={stats.totalRooms} icon={<BedDouble />} color="navy" />
      <KPICard title="Tỷ lệ lấp đầy" value={`${stats.occupancyRate}%`} subtitle={`${stats.occupied} phòng có khách`} icon={<CheckCircle2 />} color="gold" progress={stats.occupancyRate} />
      <KPICard title="Phòng trống" value={stats.available} icon={<CheckCircle2 />} color="white" />
      <KPICard title="Doanh thu dự kiến" value={`${new Intl.NumberFormat('vi-VN').format(stats.revenueToday)}đ`} subtitle="Đang lưu trú" icon={<FileText />} color="white" />
    </div>
  );

  const renderRoomMap = () => (
    <div className="bg-white rounded-2xl border border-[#0B1C2D]/10 shadow-xl shadow-[#0B1C2D]/5 overflow-hidden animate-fade-in">
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
                    className={`h-14 rounded-lg flex flex-col items-center justify-center font-bold transition-all duration-300 transform hover:-translate-y-1 relative ${getRoomStyle(room.status)} ${selectedRoom?.id === room.id ? 'ring-4 ring-[#D4AF37]/50 ring-offset-2 z-10' : ''}`}
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
  );

  const renderGuests = () => (
    <div className="bg-white rounded-2xl border border-[#0B1C2D]/10 shadow-xl shadow-[#0B1C2D]/5 overflow-hidden flex flex-col animate-fade-in">
      <div className="p-6 border-b border-[#0B1C2D]/10 flex justify-between items-center bg-[#F8F5F0]">
        <h3 className="text-lg font-serif font-bold">Danh sách khách hàng</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-white text-[#0B1C2D]/60 uppercase tracking-widest text-[10px] border-b border-[#0B1C2D]/10">
            <tr>
              <th className="px-6 py-4 font-bold">Tên Khách</th>
              <th className="px-6 py-4 font-bold">Phòng</th>
              <th className="px-6 py-4 font-bold">Check In</th>
              <th className="px-6 py-4 font-bold">Check Out</th>
              <th className="px-6 py-4 font-bold">Trạng Thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0B1C2D]/5">
            {rooms.filter(r => r.guestName).map((room, idx) => (
              <tr key={idx} className="hover:bg-[#F8F5F0]/50 transition-colors cursor-pointer" onClick={() => setSelectedRoom(room)}>
                <td className="px-6 py-4 font-bold text-[#0B1C2D]">{room.guestName}</td>
                <td className="px-6 py-4 font-medium text-[#D4AF37]">{room.number} ({room.type})</td>
                <td className="px-6 py-4">{room.checkIn}</td>
                <td className="px-6 py-4">{room.checkOut}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${room.status === 'Đang ở' ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-[#0B1C2D]/10 text-[#0B1C2D]'}`}>
                    {room.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="bg-white rounded-2xl border border-[#0B1C2D]/10 shadow-xl shadow-[#0B1C2D]/5 overflow-hidden flex flex-col animate-fade-in">
      <div className="p-6 border-b border-[#0B1C2D]/10 flex justify-between items-center bg-[#0B1C2D] text-white">
        <h3 className="text-lg font-serif font-bold">Xuất Hóa Đơn Dịch Vụ</h3>
      </div>
      <div className="p-6 grid gap-4">
        {rooms.filter(r => r.guestName).map((room, idx) => (
          <div key={idx} className="flex justify-between items-center p-4 border border-[#0B1C2D]/10 rounded-xl hover:border-[#D4AF37] transition-colors">
            <div>
              <p className="font-bold text-lg">{room.guestName} <span className="text-[#D4AF37] text-sm ml-2">Phòng {room.number}</span></p>
              <p className="text-sm text-gray-500">{room.checkIn} - {room.checkOut}</p>
            </div>
            <button onClick={() => exportInvoice(room)} className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#0B1C2D] font-bold rounded-lg hover:bg-[#b5952f] transition-colors">
              <Printer className="w-4 h-4" /> In Hóa Đơn
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // --- RENDER TAB REVIEWS GỌN GÀNG NHẤT ---
  const renderReviews = () => (
    <div className="bg-white rounded-2xl border border-[#0B1C2D]/10 shadow-xl shadow-[#0B1C2D]/5 overflow-hidden flex flex-col animate-fade-in">
      <div className="p-6 border-b border-[#0B1C2D]/10 flex flex-wrap justify-between items-center bg-[#F8F5F0] gap-4">
        <div className="flex items-center gap-3">
            <h3 className="text-lg font-serif font-bold">Quản lý Đánh Giá</h3>
            <div className="bg-white px-3 py-1.5 rounded-lg font-bold text-xs text-[#0B1C2D] border border-[#0B1C2D]/10 shadow-sm flex items-center gap-2">
                <MessageSquare className="w-3 h-3 text-[#D4AF37]" />
                {reviews.length} đánh giá
            </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Một Ô Chọn Thời Gian Duy Nhất Cho Cả Bảng Và Nút Xuất Excel */}
          <div className="relative flex items-center bg-white border border-[#0B1C2D]/10 hover:border-[#D4AF37] rounded-lg px-3 py-2 shadow-sm transition-colors">
            <Calendar className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
            <select 
              className="bg-transparent text-sm font-bold text-[#0B1C2D] outline-none cursor-pointer w-full min-w-[140px]"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              disabled={isAnalyzing || loadingReviews}
            >
              <option value="all">Tất cả thời gian</option>
              <option value="1">1 tháng gần nhất</option>
              <option value="3">3 tháng gần nhất</option>
            </select>
          </div>

          {/* Nút Xuất AI Gộp Thẳng Vào Đây */}
          <button 
            onClick={handleAnalyzeAndDownload} 
            disabled={isAnalyzing || reviews.length === 0}
            className={`
                flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 shadow-sm
                ${isAnalyzing || reviews.length === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-200' 
                    : 'bg-[#0B1C2D] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B1C2D] border border-transparent hover:border-[#0B1C2D]'
                }
            `}
          >
            {isAnalyzing ? (
                <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>AI Đang xử lý...</span>
                </>
            ) : (
                <>
                    <Bot className="w-4 h-4" />
                    <span>AI Xuất Báo Cáo</span>
                </>
            )}
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        {loadingReviews ? (
          <div className="text-center py-10 text-gray-500 font-bold animate-pulse">Đang tải dữ liệu...</div>
        ) : (
          <div className="">
            <table className="w-full text-left text-sm">
              <thead className="bg-white text-[#0B1C2D]/60 uppercase tracking-widest text-[10px] border-b border-[#0B1C2D]/10">
                <tr>
                  <th className="px-6 py-4 font-bold">ID</th>
                  <th className="px-6 py-4 font-bold">Khách hàng</th>
                  <th className="px-6 py-4 font-bold">Đánh giá</th>
                  <th className="px-6 py-4 font-bold">Nội dung</th>
                  <th className="px-6 py-4 font-bold">Ngày đăng</th>
                  <th className="px-6 py-4 font-bold text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B1C2D]/5">
                {reviews.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500 italic">
                      Chưa có đánh giá nào.
                    </td>
                  </tr>
                ) : (
                  reviews.map((review) => (
                    <tr key={review.DanhGiaID} className="hover:bg-[#F8F5F0]/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-400">
                        #{review.DanhGiaID}
                      </td>
                      <td className="px-6 py-4 font-bold text-[#0B1C2D]">
                        {review.TenKhachHang || "Khách ẩn danh"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex text-[#D4AF37]">
                          {[...Array(review.SoSao)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate text-gray-700" title={review.BinhLuan}>
                        {review.BinhLuan}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {new Date(review.NgayDanhGia).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDeleteReview(review.DanhGiaID)}
                          className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded text-xs uppercase tracking-wider font-bold transition-colors border border-red-200 hover:border-red-600"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

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
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
      `}} />

      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-[#0B1C2D] text-white flex flex-col z-20 shadow-2xl shrink-0">
        <div className="h-20 flex items-center justify-center border-b border-white/10 gap-3">
          <Sparkles className="w-6 h-6 text-[#D4AF37]" />
          <h1 className="text-xl font-serif font-bold tracking-widest text-[#D4AF37]">LA MAISON</h1>
        </div>
        <nav className="flex-1 py-8 px-4 space-y-2">
          <NavItem icon={<LayoutDashboard />} label="Overview" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<MapIcon />} label="Room Map" active={activeTab === 'roomMap'} onClick={() => setActiveTab('roomMap')} />
          <NavItem icon={<Users />} label="Guests" active={activeTab === 'guests'} onClick={() => setActiveTab('guests')} />
          <NavItem icon={<FileText />} label="Invoices" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
          <NavItem icon={<MessageSquare />} label="Reviews" active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} />

          <div className="pt-8 border-t border-white/10 mt-8"></div>
          <NavItem onClick={handleLogout} icon={<LogOut />} label="Logout" />
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col relative h-screen">
        <div className="absolute inset-0 z-0 bg-marble pointer-events-none"></div>

        <header className="h-20 px-8 flex items-center justify-between border-b border-[#0B1C2D]/10 bg-[#F8F5F0]/80 backdrop-blur-md z-10 relative shrink-0">
          <div>
            <h2 className="text-2xl font-serif font-bold uppercase tracking-wider">{
              activeTab === 'dashboard' ? 'Overview' :
                activeTab === 'roomMap' ? 'Room Map' :
                  activeTab === 'guests' ? 'Guest Management' :
                    activeTab === 'reviews' ? 'Review Management' : 'Reports & Invoices'
            }</h2>
            <p className="text-sm text-[#0B1C2D]/60">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative p-2 rounded-full bg-white border border-[#0B1C2D]/10 hover:border-[#D4AF37] transition-colors">
              <Bell className="w-5 h-5 text-[#0B1C2D]" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 z-10 relative custom-scrollbar space-y-8">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'roomMap' && renderRoomMap()}
          {activeTab === 'guests' && renderGuests()}
          {activeTab === 'reports' && renderReports()}
          {activeTab === 'reviews' && renderReviews()}
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

            <div className="p-6 border-t border-[#0B1C2D]/10 bg-[#F8F5F0] space-y-3">
              {selectedRoom.status === 'Đã đặt' && (
                <button onClick={handleCheckIn} className="w-full h-12 bg-[#0B1C2D] hover:bg-[#1a365d] text-[#D4AF37] font-bold uppercase tracking-widest text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg">
                  <LogIn className="w-4 h-4" /> Khách nhận phòng (Check-in)
                </button>
              )}
              {selectedRoom.status === 'Đang ở' && (
                <button onClick={handleCheckout} className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-600/20">
                  <LogOut className="w-4 h-4" /> Trả phòng (Check-Out)
                </button>
              )}
              {selectedRoom.status === 'Đang dọn' && (
                <button onClick={handleCleaned} className="w-full h-12 border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B1C2D] font-bold uppercase tracking-widest text-sm rounded-lg transition-colors flex items-center justify-center gap-2">
                  <PaintBucket className="w-4 h-4" /> Hoàn tất dọn dẹp
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
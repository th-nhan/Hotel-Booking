import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LayoutDashboard, Map as MapIcon, CalendarDays, Users, FileText,
  Search, Bell, UserCircle, LogOut, X,
  Sparkles, BedDouble, CheckCircle2, RefreshCw, Printer, LogIn, PaintBucket,
  PlusCircle, CreditCard, Phone, Mail, ShieldCheck, Loader2,
  Clock, AlertCircle, Smartphone, Building, ArrowRight, UserCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ReceptionistDashboard() {
  const navigate = useNavigate();

  // --- 1. KIỂM TRA PHÂN QUYỀN LỄ TÂN (ROLE GUARD) ---
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      // Role 2 = Lễ tân / Nhân viên, Role 1 = Quản trị viên
      if (user.role != 2 && user.role != 1 && user.role !== '2' && user.role !== '1') {
        alert('Bạn không có quyền truy cập vào giao diện Lễ tân!');
        navigate('/');
        return;
      }
      setCurrentUser(user);
    } catch {
      navigate('/login');
      return;
    } finally {
      setAuthChecking(false);
    }
  }, [navigate]);

  // --- 2. STATE QUẢN LÝ TAB & DỮ LIỆU ---
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings', 'roomMap', 'walkIn'
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomActionLoading, setRoomActionLoading] = useState(false);

  // State Quản lý danh sách phiếu đặt phòng & Thống kê ca trực
  const [bookings, setBookings] = useState([]);
  const [shiftStats, setShiftStats] = useState({
    checkInToday: 0,
    checkOutToday: 0,
    stayingRooms: 0,
    availableRooms: 0,
    cleaningRooms: 0,
    totalBookings: 0
  });
  const [bookingFilter, setBookingFilter] = useState('all'); // all, today_checkin, today_checkout, staying, app, walk_in
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // State Modal Đặt phòng tại quầy (Walk-in Booking)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const getTodayStr = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  };

  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [bookingForm, setBookingForm] = useState({
    HoTen: '',
    SoDienThoai: '',
    Email: '',
    CCCD: '',
    DiaChi: 'Tại khách sạn',
    NgayCheckIn: getTodayStr(),
    NgayCheckOutDuKien: getTomorrowStr(),
    HinhThucThanhToan: 'Tại quầy',
    directCheckIn: true,
    PhongID: ''
  });

  // --- 3. FETCH DỮ LIỆU TỪ SERVER ---
  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard`);
      setRooms(response.data.rooms || []);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu phòng:", error);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/receptionist/bookings`, {
        params: {
          search: searchQuery,
          filter: bookingFilter
        }
      });
      if (response.data.status === 'success') {
        setBookings(response.data.data || []);
        if (response.data.stats) {
          setShiftStats(response.data.stats);
        }
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách đặt phòng:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshAll = async () => {
    await Promise.all([fetchDashboardData(), fetchBookings()]);
  };

  useEffect(() => {
    if (!authChecking) {
      refreshAll();
      const interval = setInterval(refreshAll, 30000);
      return () => clearInterval(interval);
    }
  }, [authChecking, bookingFilter]);

  // Debounced search for bookings
  useEffect(() => {
    if (!authChecking) {
      const timer = setTimeout(() => {
        fetchBookings();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  // --- 4. THAO TÁC CHECK-IN, CHECK-OUT, DỌN PHÒNG & HỦY PHIẾU ---
  const handleCheckInByRoomId = async (phongId, guestName) => {
    if (!window.confirm(`Xác nhận khách ${guestName || ''} đã đến nhận phòng?`)) return;
    setRoomActionLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/nhan-phong`, { PhongID: phongId });
      alert("Đã hoàn tất thủ tục Check-in nhận phòng!");
      if (selectedRoom) setSelectedRoom(null);
      await refreshAll();
    } catch (error) {
      alert("Lỗi Check-in: " + (error.response?.data?.message || error.message));
    } finally {
      setRoomActionLoading(false);
    }
  };

  const handleCheckoutByRoomId = async (phongId, roomNumber) => {
    if (!window.confirm(`Xác nhận khách trả phòng ${roomNumber || ''}?`)) return;
    setRoomActionLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/tra-phong`, { PhongID: phongId });
      alert("Trả phòng thành công! Phòng đã chuyển sang trạng thái Đang dọn.");
      if (selectedRoom) setSelectedRoom(null);
      await refreshAll();
    } catch (error) {
      alert("Lỗi khi trả phòng: " + (error.response?.data?.message || error.message));
    } finally {
      setRoomActionLoading(false);
    }
  };

  const handleCleaned = async (phongId) => {
    setRoomActionLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/hoan-tat-don`, { PhongID: phongId });
      alert("Phòng đã dọn dẹp xong và sẵn sàng đón khách mới!");
      if (selectedRoom) setSelectedRoom(null);
      await refreshAll();
    } catch (error) {
      alert("Lỗi cập nhật: " + (error.response?.data?.message || error.message));
    } finally {
      setRoomActionLoading(false);
    }
  };

  const handleCancelBooking = async (phieuId, maPhieu) => {
    if (!window.confirm(`Bạn có chắc chắn muốn hủy phiếu đặt phòng ${maPhieu}? Hành động này sẽ giải phóng phòng!`)) return;
    setActionLoadingId(phieuId);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/receptionist/bookings/${phieuId}/cancel`);
      if (response.data.status === 'success') {
        alert("Đã hủy phiếu đặt phòng thành công!");
        await refreshAll();
      }
    } catch (error) {
      alert("Lỗi hủy phiếu: " + (error.response?.data?.message || error.message));
    } finally {
      setActionLoadingId(null);
    }
  };

  // --- 5. ĐẶT PHÒNG NHANH TẠI QUẦY (WALK-IN BOOKING) ---
  const openWalkInModal = (room = null) => {
    if (room) {
      setSelectedRoom(room);
    }
    setBookingError('');
    setBookingForm({
      HoTen: '',
      SoDienThoai: '',
      Email: '',
      CCCD: '',
      DiaChi: 'Tại khách sạn',
      NgayCheckIn: getTodayStr(),
      NgayCheckOutDuKien: getTomorrowStr(),
      HinhThucThanhToan: 'Tại quầy',
      directCheckIn: true,
      PhongID: room ? room.id : (rooms.find(r => r.status === 'Trống')?.id || '')
    });
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingForm.PhongID) {
      setBookingError('Vui lòng chọn phòng cần đặt!');
      return;
    }

    if (!bookingForm.HoTen.trim() || !bookingForm.SoDienThoai.trim() || !bookingForm.CCCD.trim()) {
      setBookingError('Vui lòng điền đầy đủ Họ tên, Số điện thoại và CCCD/CMND của khách!');
      return;
    }

    const start = new Date(bookingForm.NgayCheckIn);
    const end = new Date(bookingForm.NgayCheckOutDuKien);
    if (end <= start) {
      setBookingError('Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 ngày!');
      return;
    }

    setBookingLoading(true);
    setBookingError('');

    try {
      const email = bookingForm.Email.trim() || `walkin_${bookingForm.SoDienThoai.trim()}@lamaison.hotel`;
      const payload = {
        HoTen: bookingForm.HoTen,
        SoDienThoai: bookingForm.SoDienThoai,
        Email: email,
        CCCD: bookingForm.CCCD,
        DiaChi: bookingForm.DiaChi || 'Tại khách sạn',
        PhongID: bookingForm.PhongID,
        NgayCheckIn: bookingForm.NgayCheckIn,
        NgayCheckOutDuKien: bookingForm.NgayCheckOutDuKien,
        HinhThucThanhToan: bookingForm.HinhThucThanhToan
      };

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/dat-phong`, payload);

      if (res.data.status === 'success') {
        // Tự động nhận phòng nếu chọn check-in hôm nay
        if (bookingForm.directCheckIn && bookingForm.NgayCheckIn === getTodayStr()) {
          try {
            await axios.post(`${import.meta.env.VITE_API_URL}/nhan-phong`, { PhongID: bookingForm.PhongID });
          } catch (ciErr) {
            console.warn("Checkin auto error:", ciErr);
          }
        }

        alert(`Đặt phòng thành công cho khách ${bookingForm.HoTen}!`);
        setIsBookingModalOpen(false);
        await refreshAll();
      }
    } catch (err) {
      console.error("Booking error:", err);
      const msg = err.response?.data?.message || 
        (err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(' ') : err.message);
      setBookingError(msg || 'Lỗi đặt phòng, vui lòng thử lại.');
    } finally {
      setBookingLoading(false);
    }
  };

  // --- 6. IN HÓA ĐƠN THANH TOÁN (PRINT INVOICE) ---
  const handlePrintInvoice = (item) => {
    const checkInDate = new Date(item.NgayCheckIn || item.checkIn);
    const checkOutDate = new Date(item.NgayCheckOutDuKien || item.checkOut || getTodayStr());
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    let daysStayed = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (daysStayed <= 0) daysStayed = 1;

    const roomPrice = Number(item.GiaPhong || item.price) || 0;
    const roomTotal = Number(item.TongTienPhong) || (roomPrice * daysStayed);
    const serviceFee = Number(item.PhiPhuThu || item.serviceFee) || 0;
    const deposit = Number(item.TienCoc || item.deposit) || 0;
    const grandTotal = Math.max(0, (roomTotal + serviceFee) - deposit);

    const guestName = item.TenKhachHang || item.guestName || 'Quý khách';
    const roomNumber = item.TenPhong || item.number || '—';
    const roomType = item.TenLoai || item.type || 'Standard';

    const formatVND = (amount) => new Intl.NumberFormat('vi-VN').format(amount) + ' VND';

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Hóa đơn - ${guestName}</title>
          <style>
            body { font-family: 'Times New Roman', serif; padding: 40px; color: #0B1C2D; max-width: 800px; margin: auto; }
            .header { text-align: center; border-bottom: 2px solid #D4AF37; padding-bottom: 20px; margin-bottom: 30px; }
            h1 { color: #D4AF37; letter-spacing: 2px; margin-bottom: 5px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 30px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .table th, .table td { border: 1px solid #ccc; padding: 12px; text-align: right; }
            .table th { background-color: #f8f5f0; text-align: center; font-weight: bold; }
            .table td:first-child { text-align: left; }
            .summary-box { margin-top: 20px; width: 55%; float: right; }
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
            <p style="font-size: 12px; color: #888;">Mã phiếu: ${item.MaPhieu || 'PDP_' + Date.now()}</p>
          </div>
          <div class="info-grid">
            <div>
              <p><strong>Khách hàng:</strong> ${guestName}</p>
              <p><strong>Số phòng:</strong> ${roomNumber} (${roomType})</p>
              <p><strong>SĐT / CCCD:</strong> ${item.SoDienThoai || '—'} / ${item.CCCD || '—'}</p>
            </div>
            <div style="text-align: right;">
              <p><strong>Ngày Check-in:</strong> ${item.NgayCheckIn || item.checkIn}</p>
              <p><strong>Ngày Check-out:</strong> ${item.NgayCheckOutDuKien || item.checkOut}</p>
              <p><strong>Lễ tân lập phiếu:</strong> ${currentUser?.name || 'Lễ tân'}</p>
              <p><strong>Ngày in HĐ:</strong> ${new Date().toLocaleDateString('vi-VN')}</p>
            </div>
          </div>
          <table class="table">
            <tr><th>Hạng mục</th><th>Đơn giá</th><th>Số lượng</th><th>Thành tiền</th></tr>
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
            <div class="summary-row"><span>Tổng tiền phòng:</span><span>${formatVND(roomTotal + serviceFee)}</span></div>
            <div class="summary-row"><span>Đã đặt cọc:</span><span style="color: red;">- ${formatVND(deposit)}</span></div>
            <div class="summary-row bold total-pay"><span>CẦN THU TẠI QUẦY:</span><span>${formatVND(grandTotal)}</span></div>
          </div>
          <div class="footer">
            <p>Cảm ơn quý khách đã sử dụng dịch vụ tại La Maison Hotel!</p>
            <p style="font-size: 11px;">Hẹn gặp lại quý khách trong kỳ nghỉ tiếp theo.</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 250);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (authChecking) {
    return (
      <div className="h-screen bg-[#0B1C2D] flex items-center justify-center text-[#D4AF37]">
        <RefreshCw className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  const floors = [...new Set(rooms.map(r => r.floor))].sort((a, b) => b - a);

  const getRoomStyle = (status) => {
    switch (status) {
      case 'Trống': return 'border border-[#D4AF37] text-[#D4AF37] bg-transparent hover:bg-[#D4AF37]/10';
      case 'Đã đặt': return 'bg-[#0B1C2D] text-white border border-[#0B1C2D]';
      case 'Đang ở': return 'bg-[#D4AF37] text-[#0B1C2D] border border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)] font-bold';
      case 'Đang dọn': return 'bg-gray-200 text-gray-700 border border-gray-400 font-semibold';
      default: return 'bg-gray-100 text-gray-400';
    }
  };

  // --- RENDER TAB: QUẢN LÝ ĐẶT PHÒNG (BOOKINGS & CHECK-IN/OUT) ---
  const renderBookingsTab = () => (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Ca trực Lễ tân */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-[#0B1C2D] text-white border border-[#0B1C2D] shadow-xl">
          <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold mb-1">Cần Check-in hôm nay</p>
          <div className="flex justify-between items-end">
            <h3 className="text-3xl font-serif font-bold text-white">{shiftStats.checkInToday}</h3>
            <LogIn className="w-6 h-6 text-[#D4AF37]" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#0B1C2D]/10 shadow-xl">
          <p className="text-xs uppercase tracking-widest text-red-600 font-bold mb-1">Cần Check-out hôm nay</p>
          <div className="flex justify-between items-end">
            <h3 className="text-3xl font-serif font-bold text-[#0B1C2D]">{shiftStats.checkOutToday}</h3>
            <LogOut className="w-6 h-6 text-red-500" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B5952F] text-[#0B1C2D] shadow-xl">
          <p className="text-xs uppercase tracking-widest text-[#0B1C2D]/80 font-bold mb-1">Phòng đang ở</p>
          <div className="flex justify-between items-end">
            <h3 className="text-3xl font-serif font-bold">{shiftStats.stayingRooms}</h3>
            <BedDouble className="w-6 h-6 text-[#0B1C2D]" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#0B1C2D]/10 shadow-xl">
          <p className="text-xs uppercase tracking-widest text-emerald-600 font-bold mb-1">Phòng trống đón khách</p>
          <div className="flex justify-between items-end">
            <h3 className="text-3xl font-serif font-bold text-[#0B1C2D]">{shiftStats.availableRooms}</h3>
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#0B1C2D]/10 shadow-xl">
          <p className="text-xs uppercase tracking-widest text-amber-600 font-bold mb-1">Phòng đang dọn dẹp</p>
          <div className="flex justify-between items-end">
            <h3 className="text-3xl font-serif font-bold text-[#0B1C2D]">{shiftStats.cleaningRooms}</h3>
            <PaintBucket className="w-6 h-6 text-amber-600" />
          </div>
        </div>
      </div>

      {/* Bảng Danh sách Đặt phòng */}
      <div className="bg-white rounded-2xl border border-[#0B1C2D]/10 shadow-xl shadow-[#0B1C2D]/5 overflow-hidden flex flex-col">
        {/* Header toolbar */}
        <div className="p-6 border-b border-[#0B1C2D]/10 bg-gradient-to-r from-[#0B1C2D] to-[#1a365d] text-white flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-serif font-bold tracking-wide text-white">Danh sách Phiếu Đặt Phòng</h3>
              <span className="bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs px-2.5 py-0.5 rounded-full font-bold">
                {bookings.length} phiếu
              </span>
            </div>
            <p className="text-xs text-white/60 mt-0.5">Xử lý Check-in nhận phòng, Check-out trả phòng và In hóa đơn lưu trú</p>
          </div>

          <button
            onClick={() => openWalkInModal()}
            className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#b5952f] text-[#0B1C2D] font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 transition-all shadow-lg shadow-[#D4AF37]/20 cursor-pointer flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Đặt phòng tại quầy (Walk-in)</span>
          </button>
        </div>

        {/* Thanh tìm kiếm & bộ lọc */}
        <div className="p-5 bg-[#F8F5F0] border-b border-[#0B1C2D]/10 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1 min-w-[280px]">
            <input
              type="text"
              placeholder="Tìm theo Tên khách, SĐT, CCCD, Mã phiếu (PDP...), Phòng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-[#0B1C2D]/15 rounded-xl text-sm text-[#0B1C2D] placeholder-[#0B1C2D]/40 outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 text-xs font-bold cursor-pointer"
              >
                Xóa
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={bookingFilter}
              onChange={(e) => setBookingFilter(e.target.value)}
              className="bg-white border border-[#0B1C2D]/15 hover:border-[#D4AF37] rounded-xl px-3 py-2 text-xs font-bold text-[#0B1C2D] outline-none shadow-sm cursor-pointer"
            >
              <option value="all">Tất cả phiếu</option>
              <option value="today_checkin">Khách đến hôm nay</option>
              <option value="today_checkout">Khách trả phòng hôm nay</option>
              <option value="staying">Đang lưu trú</option>
              <option value="app">Đặt qua App Online</option>
              <option value="walk_in">Đặt tại quầy</option>
            </select>

            <button
              onClick={refreshAll}
              disabled={loading}
              className="px-4 py-2 bg-white border border-[#0B1C2D]/15 hover:border-[#D4AF37] rounded-xl shadow-sm text-xs font-bold text-[#0B1C2D] hover:text-[#D4AF37] transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Đang tải...' : 'Làm mới'}
            </button>
          </div>
        </div>

        {/* Bảng dữ liệu */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center text-gray-500 gap-2">
              <RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin" />
              <p className="font-bold text-sm">Đang tải dữ liệu đặt phòng...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-gray-500 gap-2">
              <p className="font-bold text-base text-[#0B1C2D]/70">Không có phiếu đặt phòng nào phù hợp</p>
              <p className="text-xs text-gray-400">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-white text-[#0B1C2D]/60 uppercase tracking-widest text-[10px] border-b border-[#0B1C2D]/10">
                <tr>
                  <th className="px-6 py-4 font-bold">Mã / Nguồn</th>
                  <th className="px-6 py-4 font-bold">Khách hàng</th>
                  <th className="px-6 py-4 font-bold">Phòng</th>
                  <th className="px-6 py-4 font-bold">Thời gian</th>
                  <th className="px-6 py-4 font-bold">Thanh toán</th>
                  <th className="px-6 py-4 font-bold text-center">Trạng thái</th>
                  <th className="px-6 py-4 font-bold text-right">Thao tác Lễ tân</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B1C2D]/5">
                {bookings.map((item) => {
                  const isStaying = item.TrangThaiPhong === 'Đang ở';
                  const isCheckedOut = Boolean(item.NgayCheckOutThucTe);
                  const isCancelled = item.TrangThaiThanhToan === 'Đã hủy';

                  return (
                    <tr key={item.PhieuDatPhongID} className={`hover:bg-[#F8F5F0]/60 transition-colors ${isCheckedOut || isCancelled ? 'bg-gray-50/70 opacity-75' : ''}`}>
                      {/* Mã phiếu & Nguồn */}
                      <td className="px-6 py-4">
                        <div className="font-mono font-bold text-xs text-[#0B1C2D]">{item.MaPhieu}</div>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.NguonDat === 'App Online'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}>
                          {item.NguonDat}
                        </span>
                      </td>

                      {/* Khách hàng */}
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#0B1C2D]">{item.TenKhachHang}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{item.SoDienThoai}</div>
                        {item.CCCD && item.CCCD !== '—' && (
                          <div className="text-[11px] text-gray-400">CCCD: {item.CCCD}</div>
                        )}
                      </td>

                      {/* Phòng */}
                      <td className="px-6 py-4">
                        <div className="font-serif font-bold text-base text-[#D4AF37]">Phòng {item.TenPhong}</div>
                        <div className="text-xs text-gray-600">{item.TenLoai}</div>
                        <div className="text-[11px] text-gray-400">{new Intl.NumberFormat('vi-VN').format(item.GiaPhong)}đ/đêm</div>
                      </td>

                      {/* Thời gian */}
                      <td className="px-6 py-4 text-xs space-y-0.5">
                        <div className="text-gray-700"><strong>In:</strong> {item.NgayCheckIn}</div>
                        <div className="text-gray-700"><strong>Out:</strong> {item.NgayCheckOutDuKien}</div>
                        {item.NgayCheckOutThucTe && (
                          <div className="text-gray-400 italic text-[11px]">Đã trả: {item.NgayCheckOutThucTe}</div>
                        )}
                      </td>

                      {/* Thanh toán */}
                      <td className="px-6 py-4 text-xs">
                        <div className="font-bold text-[#0B1C2D]">
                          {new Intl.NumberFormat('vi-VN').format(item.TongTienPhong)}đ
                        </div>
                        <div className="text-gray-500 text-[11px]">
                          Cọc: {new Intl.NumberFormat('vi-VN').format(item.TienCoc)}đ
                        </div>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.TrangThaiThanhToan === 'Đã thanh toán' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : item.TrangThaiThanhToan === 'Đã hủy'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.TrangThaiThanhToan}
                        </span>
                      </td>

                      {/* Trạng thái */}
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          item.StatusColor === 'gold' ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30' :
                          item.StatusColor === 'green' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse' :
                          item.StatusColor === 'red' ? 'bg-red-100 text-red-800' :
                          item.StatusColor === 'blue' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {item.StatusLabel}
                        </span>
                      </td>

                      {/* Thao tác */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {/* Nút Check-in: Chỉ hiện khi chưa ở và chưa hủy và chưa check-out */}
                          {!isStaying && !isCheckedOut && !isCancelled && (
                            <button
                              onClick={() => handleCheckInByRoomId(item.PhongID, item.TenKhachHang)}
                              className="px-3 py-1.5 bg-[#0B1C2D] hover:bg-[#1a365d] text-[#D4AF37] text-xs font-bold rounded-lg transition-colors cursor-pointer border border-[#D4AF37]/30 shadow-sm"
                            >
                              Check-in
                            </button>
                          )}

                          {/* Nút Check-out: Chỉ hiện khi đang ở */}
                          {isStaying && (
                            <button
                              onClick={() => handleCheckoutByRoomId(item.PhongID, item.TenPhong)}
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm"
                            >
                              Check-out
                            </button>
                          )}

                          {/* Nút In hóa đơn */}
                          <button
                            onClick={() => handlePrintInvoice(item)}
                            title="In hóa đơn thanh toán"
                            className="px-2.5 py-1.5 bg-white hover:bg-gray-100 text-[#0B1C2D] border border-gray-300 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            In HĐ
                          </button>

                          {/* Nút Hủy nếu chưa ở */}
                          {!isStaying && !isCheckedOut && !isCancelled && (
                            <button
                              onClick={() => handleCancelBooking(item.PhieuDatPhongID, item.MaPhieu)}
                              disabled={actionLoadingId === item.PhieuDatPhongID}
                              className="px-2.5 py-1.5 bg-gray-100 hover:bg-red-50 text-red-600 hover:text-red-700 border border-gray-200 text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                            >
                              Hủy
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );

  // --- RENDER TAB: SƠ ĐỒ PHÒNG TRỰC TIẾP ---
  const renderRoomMapTab = () => (
    <div className="bg-white rounded-2xl border border-[#0B1C2D]/10 shadow-xl shadow-[#0B1C2D]/5 overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-[#0B1C2D]/10 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-[#0B1C2D] to-[#1a365d] gap-4">
        <div>
          <h3 className="text-xl font-serif font-bold text-white tracking-wide">Sơ đồ phòng trực tuyến (Live Room Rack)</h3>
          <p className="text-xs text-white/60 mt-0.5">Click vào phòng để thực hiện Check-in, Trả phòng hoặc Đặt phòng nhanh</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="px-3 py-1 text-xs font-bold rounded border border-[#D4AF37] text-[#D4AF37]">Trống</span>
          <span className="px-3 py-1 text-xs font-bold rounded bg-[#0B1C2D] text-white border border-white/20">Đã đặt</span>
          <span className="px-3 py-1 text-xs font-bold rounded bg-[#D4AF37] text-[#0B1C2D]">Đang ở</span>
          <span className="px-3 py-1 text-xs font-bold rounded bg-gray-200 text-gray-700">Đang dọn</span>
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
                    {(room.status === 'Đã đặt' || room.status === 'Đang ở') && (
                      <span className="absolute bottom-1 text-[10px] truncate w-full px-1">
                        {room.guestName?.split(' ').pop() || 'Khách'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen font-sans bg-[#F8F5F0] text-[#0B1C2D] overflow-hidden custom-scrollbar">
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #D4AF37; border-radius: 10px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
      `}} />

      {/* --- SIDEBAR LỄ TÂN --- */}
      <aside className="w-64 bg-[#0B1C2D] text-white flex flex-col z-20 shadow-2xl shrink-0">
        <div className="h-20 flex items-center justify-center border-b border-white/10 gap-3">
          <Sparkles className="w-6 h-6 text-[#D4AF37]" />
          <div>
            <h1 className="text-lg font-serif font-bold tracking-widest text-[#D4AF37]">LA MAISON</h1>
            <p className="text-[10px] uppercase tracking-wider text-white/50">Reception Desk</p>
          </div>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-medium cursor-pointer ${
              activeTab === 'bookings' 
                ? 'bg-[#D4AF37] text-[#0B1C2D] font-bold shadow-lg shadow-[#D4AF37]/20' 
                : 'text-white/70 hover:bg-white/5 hover:text-[#D4AF37]'
            }`}
          >
            <CalendarDays className="w-5 h-5" />
            <span>Quản lý Đặt phòng</span>
          </button>

          <button
            onClick={() => setActiveTab('roomMap')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-medium cursor-pointer ${
              activeTab === 'roomMap' 
                ? 'bg-[#D4AF37] text-[#0B1C2D] font-bold shadow-lg shadow-[#D4AF37]/20' 
                : 'text-white/70 hover:bg-white/5 hover:text-[#D4AF37]'
            }`}
          >
            <MapIcon className="w-5 h-5" />
            <span>Sơ đồ phòng Live</span>
          </button>

          <button
            onClick={() => openWalkInModal()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#D4AF37] bg-white/5 hover:bg-[#D4AF37] hover:text-[#0B1C2D] transition-all duration-300 font-medium cursor-pointer border border-[#D4AF37]/30 mt-4"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Đặt phòng tại quầy</span>
          </button>

          <div className="pt-8 border-t border-white/10 mt-8"></div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors font-medium cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Đăng xuất</span>
          </button>
        </nav>

        {/* Thông tin nhân viên trực */}
        <div className="p-4 border-t border-white/10 bg-black/20 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center font-bold text-[#D4AF37] text-xs">
            LT
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{currentUser?.name || 'Nhân viên Lễ tân'}</p>
            <p className="text-[10px] text-emerald-400">● Đang trong ca trực</p>
          </div>
        </div>
      </aside>

      {/* --- NỘI DUNG CHÍNH --- */}
      <div className="flex-1 flex flex-col relative h-screen">
        {/* Header */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-[#0B1C2D]/10 bg-[#F8F5F0]/80 backdrop-blur-md z-10 relative shrink-0">
          <div>
            <h2 className="text-2xl font-serif font-bold uppercase tracking-wider">
              {activeTab === 'bookings' ? 'Bàn Quầy Lễ Tân (Front Desk)' : 'Sơ Đồ Phòng Khách Sạn'}
            </h2>
            <p className="text-sm text-[#0B1C2D]/60">
              {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={refreshAll}
              className="p-2.5 bg-white border border-[#0B1C2D]/15 hover:border-[#D4AF37] rounded-xl shadow-sm text-xs font-bold text-[#0B1C2D] flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#D4AF37]' : ''}`} />
              <span>Đồng bộ</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 z-10 relative custom-scrollbar space-y-8">
          {activeTab === 'bookings' && renderBookingsTab()}
          {activeTab === 'roomMap' && renderRoomMapTab()}
        </main>
      </div>

      {/* --- RIGHT DRAWER: CHI TIẾT PHÒNG --- */}
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
                    selectedRoom.status === 'Đang ở' ? 'bg-[#D4AF37] text-[#0B1C2D]' :
                      selectedRoom.status === 'Đang dọn' ? 'bg-gray-500 text-white font-semibold' : 'bg-gray-400 text-white'
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
              {selectedRoom.status === 'Trống' && (
                <button
                  disabled={roomActionLoading}
                  onClick={() => openWalkInModal(selectedRoom)}
                  className="w-full h-12 bg-[#D4AF37] hover:bg-[#b5952f] text-[#0B1C2D] font-bold uppercase tracking-widest text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 cursor-pointer disabled:opacity-50"
                >
                  <PlusCircle className="w-5 h-5" /> Đặt phòng / Nhận khách tại quầy
                </button>
              )}
              {selectedRoom.status === 'Đã đặt' && (
                <button
                  disabled={roomActionLoading}
                  onClick={() => handleCheckInByRoomId(selectedRoom.id, selectedRoom.guestName)}
                  className="w-full h-12 bg-[#0B1C2D] hover:bg-[#1a365d] text-[#D4AF37] font-bold uppercase tracking-widest text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
                >
                  {roomActionLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Đang nhận phòng...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" /> Khách nhận phòng (Check-in)
                    </>
                  )}
                </button>
              )}
              {selectedRoom.status === 'Đang ở' && (
                <div className="space-y-2">
                  <button
                    disabled={roomActionLoading}
                    onClick={() => handleCheckoutByRoomId(selectedRoom.id, selectedRoom.number)}
                    className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 cursor-pointer disabled:opacity-50"
                  >
                    {roomActionLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Đang xử lý trả phòng...
                      </>
                    ) : (
                      <>
                        <LogOut className="w-4 h-4" /> Trả phòng (Check-Out)
                      </>
                    )}
                  </button>
                  <button
                    disabled={roomActionLoading}
                    onClick={() => handlePrintInvoice(selectedRoom)}
                    className="w-full h-10 bg-white hover:bg-gray-100 text-[#0B1C2D] font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 border border-[#0B1C2D]/20 cursor-pointer disabled:opacity-50"
                  >
                    <Printer className="w-4 h-4 text-[#D4AF37]" /> In hóa đơn thanh toán
                  </button>
                </div>
              )}
              {selectedRoom.status === 'Đang dọn' && (
                <button
                  disabled={roomActionLoading}
                  onClick={() => handleCleaned(selectedRoom.id)}
                  className="w-full h-12 border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B1C2D] font-bold uppercase tracking-widest text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {roomActionLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <PaintBucket className="w-4 h-4" /> Hoàn tất dọn dẹp (Sẵn sàng)
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL ĐẶT PHÒNG TẠI QUẦY (WALK-IN BOOKING) --- */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1C2D]/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-[#0B1C2D]/10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#0B1C2D] text-white p-6 flex justify-between items-center relative">
              <div>
                <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">Lễ tân lập phiếu</span>
                <h3 className="text-2xl font-serif font-bold text-white mt-0.5">Đặt phòng trực tiếp tại quầy</h3>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="p-6 overflow-y-auto space-y-4 custom-scrollbar">
              {bookingError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg font-medium">
                  {bookingError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Chọn Phòng */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#0B1C2D]/70 uppercase tracking-wider mb-1">
                    Chọn phòng cần đặt <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={bookingForm.PhongID}
                    onChange={(e) => setBookingForm({ ...bookingForm, PhongID: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#0B1C2D]/20 focus:border-[#D4AF37] outline-none text-sm bg-white cursor-pointer"
                  >
                    <option value="">-- Chọn phòng trống --</option>
                    {rooms.map(r => (
                      <option key={r.id} value={r.id}>
                        Phòng {r.number} ({r.type}) - {new Intl.NumberFormat('vi-VN').format(r.price)}đ/đêm [{r.status}]
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B1C2D]/70 uppercase tracking-wider mb-1">
                    Họ và tên khách hàng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn A"
                    value={bookingForm.HoTen}
                    onChange={(e) => setBookingForm({ ...bookingForm, HoTen: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#0B1C2D]/20 focus:border-[#D4AF37] outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B1C2D]/70 uppercase tracking-wider mb-1">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="VD: 0901234567"
                    value={bookingForm.SoDienThoai}
                    onChange={(e) => setBookingForm({ ...bookingForm, SoDienThoai: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#0B1C2D]/20 focus:border-[#D4AF37] outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B1C2D]/70 uppercase tracking-wider mb-1">
                    CCCD / CMND / Hộ chiếu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 07920300xxxx"
                    value={bookingForm.CCCD}
                    onChange={(e) => setBookingForm({ ...bookingForm, CCCD: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#0B1C2D]/20 focus:border-[#D4AF37] outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B1C2D]/70 uppercase tracking-wider mb-1">
                    Email (Tùy chọn)
                  </label>
                  <input
                    type="email"
                    placeholder="VD: guest@email.com"
                    value={bookingForm.Email}
                    onChange={(e) => setBookingForm({ ...bookingForm, Email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#0B1C2D]/20 focus:border-[#D4AF37] outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B1C2D]/70 uppercase tracking-wider mb-1">
                    Ngày nhận phòng (Check-in) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={getTodayStr()}
                    value={bookingForm.NgayCheckIn}
                    onChange={(e) => setBookingForm({ ...bookingForm, NgayCheckIn: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#0B1C2D]/20 focus:border-[#D4AF37] outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B1C2D]/70 uppercase tracking-wider mb-1">
                    Ngày trả phòng (Check-out) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={bookingForm.NgayCheckIn || getTodayStr()}
                    value={bookingForm.NgayCheckOutDuKien}
                    onChange={(e) => setBookingForm({ ...bookingForm, NgayCheckOutDuKien: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#0B1C2D]/20 focus:border-[#D4AF37] outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B1C2D]/70 uppercase tracking-wider mb-1">
                    Hình thức thanh toán
                  </label>
                  <select
                    value={bookingForm.HinhThucThanhToan}
                    onChange={(e) => setBookingForm({ ...bookingForm, HinhThucThanhToan: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#0B1C2D]/20 focus:border-[#D4AF37] outline-none text-sm bg-white cursor-pointer"
                  >
                    <option value="Tại quầy">Tiền mặt tại quầy (Cọc 30%)</option>
                    <option value="Chuyển khoản">Chuyển khoản ngân hàng (100%)</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bookingForm.directCheckIn}
                      onChange={(e) => setBookingForm({ ...bookingForm, directCheckIn: e.target.checked })}
                      className="w-4 h-4 text-[#D4AF37] rounded border-gray-300 focus:ring-[#D4AF37]"
                    />
                    <span className="text-xs font-bold text-[#0B1C2D]">Khách nhận phòng ngay (Check-in tức thì)</span>
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-bold text-xs uppercase tracking-wider hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="px-6 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#b5952f] text-[#0B1C2D] font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {bookingLoading ? 'Đang xử lý...' : 'Xác nhận Đặt phòng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedRoom && !isBookingModalOpen && (
        <div className="fixed inset-0 bg-[#0B1C2D]/20 backdrop-blur-sm z-40" onClick={() => setSelectedRoom(null)}></div>
      )}
    </div>
  );
}

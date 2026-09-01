import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LayoutDashboard, Map as MapIcon, CalendarDays, Users, FileText, Settings,
  Search, Download, Bell, UserCircle, LogOut, X,
  Sparkles, BedDouble, CheckCircle2, RefreshCw, Printer, LogIn, PaintBucket,
  MessageSquare, Star, Calendar, Bot, PlusCircle, CreditCard, Phone, Mail, User, ShieldCheck,
  Loader2, UserCheck, UserX, Lock, Unlock, Edit3, Trash2, Shield, Eye, EyeOff, Check, UserPlus
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
  const [roomActionLoading, setRoomActionLoading] = useState(false);

  // --- STATE MODAL ĐẶT PHÒNG NHANH ---
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
    directCheckIn: true
  });

  // --- THÊM STATE CHO REVIEWS ---
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [timeRange, setTimeRange] = useState('all');
  
  // Thêm state loading riêng cho nút AI
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // --- STATE QUẢN LÝ TÀI KHOẢN ---
  const [accounts, setAccounts] = useState([]);
  const [accountStats, setAccountStats] = useState({
    total: 0, admins: 0, staff: 0, customers: 0, active: 0, locked: 0
  });
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [accountSearch, setAccountSearch] = useState('');
  const [accountRoleFilter, setAccountRoleFilter] = useState('all');
  const [accountStatusFilter, setAccountStatusFilter] = useState('all');

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [accountFormLoading, setAccountFormLoading] = useState(false);
  const [accountFormError, setAccountFormError] = useState('');
  const [accountActionLoadingId, setAccountActionLoadingId] = useState(null);

  const [accountForm, setAccountForm] = useState({
    HoTen: '',
    Email: '',
    MatKhau: '',
    VaiTroID: 3,
    SoDienThoai: '',
    CCCD: '',
    DiaChi: '',
    TrangThai: 1
  });

  // --- API GỌI DỮ LIỆU PHÒNG CHUNG ---
  const processRoomStatuses = (fetchedRooms) => {
    if (!Array.isArray(fetchedRooms)) return [];
    return fetchedRooms;
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

  // --- HÀM XUẤT BÁO CÁO AI ---
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

  // --- API GỌI DỮ LIỆU TÀI KHOẢN ---
  const fetchAccounts = async (customSearch = null) => {
    setLoadingAccounts(true);
    try {
      const qSearch = customSearch !== null ? customSearch : accountSearch;
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/accounts`, {
        params: {
          search: qSearch,
          role: accountRoleFilter,
          status: accountStatusFilter
        }
      });
      if (response.data.status === 'success') {
        setAccounts(response.data.data || []);
        if (response.data.stats) {
          setAccountStats(response.data.stats);
        }
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách tài khoản:", error);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const handleToggleAccountStatus = async (account) => {
    const actionText = account.TrangThai ? 'khóa' : 'mở khóa';
    if (!window.confirm(`Bạn có chắc chắn muốn ${actionText} tài khoản "${account.HoTen}" (${account.Email})?`)) return;

    setAccountActionLoadingId(account.TaiKhoanID);
    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/accounts/${account.TaiKhoanID}/toggle-status`);
      if (response.data.status === 'success') {
        const newStatus = response.data.newStatus;
        setAccounts(prev => prev.map(acc => acc.TaiKhoanID === account.TaiKhoanID ? { ...acc, TrangThai: newStatus } : acc));
        setAccountStats(prev => ({
          ...prev,
          active: newStatus ? prev.active + 1 : Math.max(0, prev.active - 1),
          locked: newStatus ? Math.max(0, prev.locked - 1) : prev.locked + 1
        }));
      }
    } catch (error) {
      alert("Lỗi khi cập nhật trạng thái: " + (error.response?.data?.message || error.message));
    } finally {
      setAccountActionLoadingId(null);
    }
  };

  const handleDeleteAccount = async (account) => {
    if (!window.confirm(`Xác nhận xóa vĩnh viễn tài khoản "${account.HoTen}" (${account.Email})? Hành động này không thể hoàn tác!`)) return;

    setAccountActionLoadingId(account.TaiKhoanID);
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/accounts/${account.TaiKhoanID}`);
      if (response.data.status === 'success') {
        alert("Đã xóa tài khoản thành công!");
        fetchAccounts();
      }
    } catch (error) {
      alert("Lỗi khi xóa tài khoản: " + (error.response?.data?.message || error.message));
    } finally {
      setAccountActionLoadingId(null);
    }
  };

  const openCreateAccountModal = () => {
    setEditingAccount(null);
    setAccountFormError('');
    setAccountForm({
      HoTen: '',
      Email: '',
      MatKhau: '',
      VaiTroID: 3,
      SoDienThoai: '',
      CCCD: '',
      DiaChi: '',
      TrangThai: 1
    });
    setIsAccountModalOpen(true);
  };

  const openEditAccountModal = (account) => {
    setEditingAccount(account);
    setAccountFormError('');
    setAccountForm({
      HoTen: account.HoTen || '',
      Email: account.Email || '',
      MatKhau: '',
      VaiTroID: Number(account.VaiTroID) || 3,
      SoDienThoai: account.SoDienThoai || '',
      CCCD: account.CCCD || '',
      DiaChi: account.DiaChi || '',
      TrangThai: account.TrangThai !== undefined ? account.TrangThai : 1
    });
    setIsAccountModalOpen(true);
  };

  const handleAccountFormSubmit = async (e) => {
    e.preventDefault();
    if (!accountForm.HoTen.trim() || !accountForm.Email.trim()) {
      setAccountFormError('Vui lòng điền đầy đủ họ tên và email!');
      return;
    }
    if (!editingAccount && (!accountForm.MatKhau || accountForm.MatKhau.length < 6)) {
      setAccountFormError('Mật khẩu bắt buộc và phải có ít nhất 6 ký tự!');
      return;
    }
    if (editingAccount && accountForm.MatKhau && accountForm.MatKhau.length < 6) {
      setAccountFormError('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }

    setAccountFormLoading(true);
    setAccountFormError('');

    try {
      if (editingAccount) {
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/accounts/${editingAccount.TaiKhoanID}`, accountForm);
        if (response.data.status === 'success') {
          alert("Cập nhật thông tin tài khoản thành công!");
          setIsAccountModalOpen(false);
          fetchAccounts();
        }
      } else {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/accounts`, accountForm);
        if (response.data.status === 'success') {
          alert("Tạo tài khoản mới thành công!");
          setIsAccountModalOpen(false);
          fetchAccounts();
        }
      }
    } catch (error) {
      const msg = error.response?.data?.message || 
        (error.response?.data?.errors ? Object.values(error.response.data.errors).flat().join(' ') : error.message);
      setAccountFormError(msg || 'Đã có lỗi xảy ra.');
    } finally {
      setAccountFormLoading(false);
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

  useEffect(() => {
    if (activeTab === 'accounts') {
      const timer = setTimeout(() => {
        fetchAccounts(accountSearch);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeTab, accountSearch, accountRoleFilter, accountStatusFilter]);

  const getRoomStyle = (status) => {
    switch (status) {
      case 'Trống': return 'border border-[#D4AF37] text-[#D4AF37] bg-transparent hover:bg-[#D4AF37]/10';
      case 'Đã đặt': return 'bg-[#0B1C2D] text-white border border-[#0B1C2D]';
      case 'Đang ở': return 'bg-[#D4AF37] text-[#0B1C2D] border border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)] font-bold';
      case 'Đang dọn': return 'bg-gray-200 text-gray-700 border border-gray-400 font-semibold';
      default: return 'bg-gray-100 text-gray-400';
    }
  };

  const handleCheckIn = async () => {
    if (!selectedRoom || !window.confirm(`Xác nhận khách đã nhận phòng ${selectedRoom.number}?`)) return;
    setRoomActionLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/nhan-phong`, { PhongID: selectedRoom.id });
      // Cập nhật trạng thái ngay lập tức trên UI (Optimistic Update)
      setRooms(prev => prev.map(r => r.id === selectedRoom.id ? { ...r, status: 'Đang ở' } : r));
      setSelectedRoom(null);
      await fetchDashboardData();
    } catch (error) {
      alert("Lỗi Check-in: " + (error.response?.data?.message || error.message));
    } finally {
      setRoomActionLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedRoom || !window.confirm(`Xác nhận trả phòng ${selectedRoom.number}?`)) return;
    setRoomActionLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/tra-phong`, { PhongID: selectedRoom.id });
      // 1. Cập nhật state danh sách phòng ngay lập tức sang "Đang dọn"
      setRooms(prev => prev.map(r => r.id === selectedRoom.id ? { ...r, status: 'Đang dọn', guestName: null, checkIn: null, checkOut: null } : r));
      setStats(prev => ({
        ...prev,
        occupied: Math.max(0, prev.occupied - 1),
        cleaning: prev.cleaning + 1
      }));
      // 2. Đóng ngay tab/drawer chi tiết phòng
      setSelectedRoom(null);
      // 3. Đồng bộ lại dữ liệu mới nhất từ server
      await fetchDashboardData();
    } catch (error) {
      alert("Lỗi khi trả phòng: " + (error.response?.data?.message || error.message));
    } finally {
      setRoomActionLoading(false);
    }
  };

  const handleCleaned = async () => {
    if (!selectedRoom) return;
    setRoomActionLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/hoan-tat-don`, { PhongID: selectedRoom.id });
      // Cập nhật state ngay lập tức sang "Trống"
      setRooms(prev => prev.map(r => r.id === selectedRoom.id ? { ...r, status: 'Trống', guestName: null, checkIn: null, checkOut: null } : r));
      setStats(prev => ({
        ...prev,
        cleaning: Math.max(0, prev.cleaning - 1),
        available: prev.available + 1
      }));
      setSelectedRoom(null);
      await fetchDashboardData();
    } catch (error) {
      alert("Lỗi cập nhật: " + (error.response?.data?.message || error.message));
    } finally {
      setRoomActionLoading(false);
    }
  };

  const openBookingModal = (room) => {
    setSelectedRoom(room);
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
      directCheckIn: true
    });
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRoom) return;

    if (!bookingForm.HoTen.trim() || !bookingForm.SoDienThoai.trim() || !bookingForm.CCCD.trim()) {
      setBookingError('Vui lòng điền đầy đủ Họ tên, Số điện thoại và CCCD/CMND!');
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
      const email = bookingForm.Email.trim() || `guest_${bookingForm.SoDienThoai.trim()}@lamaison.hotel`;
      const payload = {
        HoTen: bookingForm.HoTen,
        SoDienThoai: bookingForm.SoDienThoai,
        Email: email,
        CCCD: bookingForm.CCCD,
        DiaChi: bookingForm.DiaChi || 'Tại khách sạn',
        PhongID: selectedRoom.id,
        NgayCheckIn: bookingForm.NgayCheckIn,
        NgayCheckOutDuKien: bookingForm.NgayCheckOutDuKien,
        HinhThucThanhToan: bookingForm.HinhThucThanhToan
      };

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/dat-phong`, payload);

      if (res.data.status === 'success') {
        // Nếu chọn nhận phòng ngay hôm nay
        if (bookingForm.directCheckIn && bookingForm.NgayCheckIn === getTodayStr()) {
          try {
            await axios.post(`${import.meta.env.VITE_API_URL}/nhan-phong`, { PhongID: selectedRoom.id });
          } catch (ciErr) {
            console.warn("Checkin auto error:", ciErr);
          }
        }

        alert(`Đặt phòng ${selectedRoom.number} thành công cho khách ${bookingForm.HoTen}!`);
        setIsBookingModalOpen(false);
        await fetchDashboardData();
        setSelectedRoom({
          ...selectedRoom,
          status: bookingForm.directCheckIn && bookingForm.NgayCheckIn === getTodayStr() ? 'Đang ở' : 'Đã đặt',
          guestName: bookingForm.HoTen,
          checkIn: bookingForm.NgayCheckIn,
          checkOut: bookingForm.NgayCheckOutDuKien
        });
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

  // --- RENDER TAB TÀI KHOẢN ---
  const renderAccounts = () => {
    const getRoleBadge = (roleId) => {
      const id = Number(roleId);
      if (id === 1) {
        return (
          <span className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-[#0B1C2D] text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm">
            Quản trị viên
          </span>
        );
      }
      if (id === 2) {
        return (
          <span className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
            Lễ tân / Nhân viên
          </span>
        );
      }
      return (
        <span className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
          Khách hàng
        </span>
      );
    };

    return (
      <div className="space-y-8 animate-fade-in">
        {/* KPI Thống kê tài khoản */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard 
            title="Tổng tài khoản" 
            value={accountStats.total} 
            subtitle={`${accountStats.active} hoạt động • ${accountStats.locked} bị khóa`} 
            icon={<Users />} 
            color="navy" 
          />
          <KPICard 
            title="Quản trị viên" 
            value={accountStats.admins} 
            subtitle="Toàn quyền hệ thống" 
            icon={<ShieldCheck />} 
            color="gold" 
          />
          <KPICard 
            title="Nhân viên / Lễ tân" 
            value={accountStats.staff} 
            subtitle="Vận hành & Đặt phòng" 
            icon={<UserCheck />} 
            color="white" 
          />
          <KPICard 
            title="Khách hàng đăng ký" 
            value={accountStats.customers} 
            subtitle="Tài khoản thành viên" 
            icon={<UserCircle />} 
            color="white" 
          />
        </div>

        {/* Bảng Danh sách & Bộ lọc */}
        <div className="bg-white rounded-2xl border border-[#0B1C2D]/10 shadow-xl shadow-[#0B1C2D]/5 overflow-hidden flex flex-col">
          {/* Header Bảng và Toolbar */}
          <div className="p-6 border-b border-[#0B1C2D]/10 bg-gradient-to-r from-[#0B1C2D] via-[#102a43] to-[#0B1C2D] text-white flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-serif font-bold tracking-wide text-white">Danh sách Tài Khoản</h3>
                <span className="bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {accounts.length} người dùng
                </span>
              </div>
              <p className="text-xs text-white/60 mt-0.5">Quản lý phân quyền, theo dõi hoạt động và phân nhóm tài khoản</p>
            </div>

            <button
              onClick={openCreateAccountModal}
              className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#b5952f] text-[#0B1C2D] font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 transition-all shadow-lg shadow-[#D4AF37]/20 cursor-pointer shrink-0"
            >
              Thêm tài khoản mới
            </button>
          </div>

          {/* Thanh Tìm kiếm & Bộ Lọc Nâng Cao */}
          <div className="p-5 bg-[#F8F5F0] border-b border-[#0B1C2D]/10 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
            {/* Ô tìm kiếm chính */}
            <div className="relative flex-1 min-w-[280px]">
              <input
                type="text"
                placeholder="Tìm kiếm theo Tên, Email, Số điện thoại, CCCD..."
                value={accountSearch}
                onChange={(e) => setAccountSearch(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-[#0B1C2D]/15 rounded-xl text-sm text-[#0B1C2D] placeholder-[#0B1C2D]/40 outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 shadow-sm transition-all"
              />
              {accountSearch && (
                <button
                  onClick={() => setAccountSearch('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 text-xs font-bold cursor-pointer"
                  title="Xóa tìm kiếm"
                >
                  Xóa
                </button>
              )}
            </div>

            {/* Bộ lọc dropdown & action */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Lọc Vai trò */}
              <div className="bg-white border border-[#0B1C2D]/15 hover:border-[#D4AF37] rounded-xl px-3 py-2 shadow-sm transition-all focus-within:border-[#D4AF37] focus-within:ring-2 focus-within:ring-[#D4AF37]/20">
                <select
                  value={accountRoleFilter}
                  onChange={(e) => setAccountRoleFilter(e.target.value)}
                  className="bg-transparent text-xs font-bold text-[#0B1C2D] outline-none cursor-pointer pr-2"
                >
                  <option value="all">Tất cả vai trò</option>
                  <option value="1">Quản trị viên (Admin)</option>
                  <option value="2">Nhân viên / Lễ tân</option>
                  <option value="3">Khách hàng</option>
                </select>
              </div>

              {/* Lọc Trạng thái */}
              <div className="bg-white border border-[#0B1C2D]/15 hover:border-[#D4AF37] rounded-xl px-3 py-2 shadow-sm transition-all focus-within:border-[#D4AF37] focus-within:ring-2 focus-within:ring-[#D4AF37]/20">
                <select
                  value={accountStatusFilter}
                  onChange={(e) => setAccountStatusFilter(e.target.value)}
                  className="bg-transparent text-xs font-bold text-[#0B1C2D] outline-none cursor-pointer pr-2"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="1">Đang hoạt động</option>
                  <option value="0">Đã bị khóa</option>
                </select>
              </div>

              {/* Nút Xóa nhanh bộ lọc nếu có lọc */}
              {(accountSearch || accountRoleFilter !== 'all' || accountStatusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setAccountSearch('');
                    setAccountRoleFilter('all');
                    setAccountStatusFilter('all');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-gray-200/80 hover:bg-gray-300 text-[#0B1C2D] text-xs font-bold transition-colors cursor-pointer"
                  title="Đặt lại bộ lọc"
                >
                  Xóa lọc
                </button>
              )}

              {/* Nút Làm mới */}
              <button
                onClick={() => fetchAccounts()}
                disabled={loadingAccounts}
                title="Làm mới danh sách"
                className="px-4 py-2 bg-white border border-[#0B1C2D]/15 hover:border-[#D4AF37] rounded-xl shadow-sm text-xs font-bold text-[#0B1C2D] hover:text-[#D4AF37] transition-all cursor-pointer disabled:opacity-50"
              >
                {loadingAccounts ? 'Đang tải...' : 'Làm mới'}
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            {loadingAccounts ? (
              <div className="py-16 flex flex-col items-center justify-center text-gray-500 gap-3">
                <p className="font-bold text-sm">Đang tải danh sách tài khoản...</p>
              </div>
            ) : accounts.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-gray-500 gap-2">
                <p className="font-bold text-base text-[#0B1C2D]/70">Không tìm thấy tài khoản nào</p>
                <p className="text-xs text-gray-400">Thử thay đổi từ khóa tìm kiếm hoặc điều kiện lọc</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-white text-[#0B1C2D]/60 uppercase tracking-widest text-[10px] border-b border-[#0B1C2D]/10">
                  <tr>
                    <th className="px-6 py-4 font-bold">Người dùng</th>
                    <th className="px-6 py-4 font-bold">Vai trò</th>
                    <th className="px-6 py-4 font-bold">Thông tin liên hệ</th>
                    <th className="px-6 py-4 font-bold">Ngày tạo</th>
                    <th className="px-6 py-4 font-bold text-center">Trạng thái</th>
                    <th className="px-6 py-4 font-bold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0B1C2D]/5">
                  {accounts.map((account) => {
                    const initials = account.HoTen
                      ? account.HoTen.split(' ').map(n => n[0]).slice(-2).join('').toUpperCase()
                      : 'U';
                    const isLocked = !account.TrangThai;

                    return (
                      <tr key={account.TaiKhoanID} className={`hover:bg-[#F8F5F0]/60 transition-colors ${isLocked ? 'bg-gray-50/70' : ''}`}>
                        {/* Người dùng */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {account.AnhDaiDien ? (
                              <img
                                src={account.AnhDaiDien}
                                alt={account.HoTen}
                                className="w-10 h-10 rounded-full object-cover border-2 border-[#D4AF37]/40 shadow-sm shrink-0"
                              />
                            ) : (
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-xs shrink-0 shadow-sm ${
                                account.VaiTroID == 1 
                                  ? 'bg-[#0B1C2D] text-[#D4AF37] border-2 border-[#D4AF37]' 
                                  : account.VaiTroID == 2
                                    ? 'bg-blue-900 text-white'
                                    : 'bg-[#F8F5F0] text-[#0B1C2D] border border-[#0B1C2D]/20'
                              }`}>
                                {initials}
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-[#0B1C2D] flex items-center gap-2">
                                <span>{account.HoTen}</span>
                                <span className="text-[10px] text-gray-400 font-mono">#{account.TaiKhoanID}</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                {account.Email}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Vai trò */}
                        <td className="px-6 py-4">
                          {getRoleBadge(account.VaiTroID)}
                        </td>

                        {/* Thông tin liên hệ */}
                        <td className="px-6 py-4 text-xs space-y-1">
                          <div className="text-gray-700 font-medium">
                            {account.SoDienThoai || <span className="italic text-gray-400">Chưa cập nhật SĐT</span>}
                          </div>
                          {account.CCCD && (
                            <div className="text-[11px] text-gray-500">
                              CCCD: {account.CCCD}
                            </div>
                          )}
                          {account.DiaChi && (
                            <div className="text-[11px] text-gray-500 truncate max-w-[200px]" title={account.DiaChi}>
                              {account.DiaChi}
                            </div>
                          )}
                        </td>

                        {/* Ngày tạo */}
                        <td className="px-6 py-4 text-xs text-gray-500">
                          {account.NgayTao 
                            ? new Date(account.NgayTao).toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' })
                            : (account.created_at ? new Date(account.created_at).toLocaleDateString('vi-VN') : '—')}
                        </td>

                        {/* Trạng thái */}
                        <td className="px-6 py-4 text-center">
                          {account.TrangThai ? (
                            <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              Hoạt động
                            </span>
                          ) : (
                            <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-red-100 text-red-800 border border-red-300">
                              Đã khóa
                            </span>
                          )}
                        </td>

                        {/* Thao tác */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Nút Khóa / Mở Khóa */}
                            <button
                              onClick={() => handleToggleAccountStatus(account)}
                              disabled={accountActionLoadingId === account.TaiKhoanID}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                                account.TrangThai 
                                  ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-600 hover:text-white hover:border-amber-600'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600'
                              } disabled:opacity-50`}
                            >
                              {accountActionLoadingId === account.TaiKhoanID 
                                ? 'Đang xử lý...' 
                                : account.TrangThai ? 'Khóa' : 'Mở khóa'}
                            </button>

                            {/* Nút Sửa */}
                            <button
                              onClick={() => openEditAccountModal(account)}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 text-xs font-bold transition-colors cursor-pointer"
                            >
                              Sửa
                            </button>

                            {/* Nút Xóa */}
                            <button
                              onClick={() => handleDeleteAccount(account)}
                              disabled={accountActionLoadingId === account.TaiKhoanID}
                              className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                            >
                              Xóa
                            </button>
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
          <NavItem icon={<ShieldCheck />} label="Accounts" active={activeTab === 'accounts'} onClick={() => setActiveTab('accounts')} />

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
                    activeTab === 'reviews' ? 'Review Management' :
                      activeTab === 'accounts' ? 'Account Management' : 'Reports & Invoices'
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
          {activeTab === 'accounts' && renderAccounts()}
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
                  onClick={() => openBookingModal(selectedRoom)}
                  className="w-full h-12 bg-[#D4AF37] hover:bg-[#b5952f] text-[#0B1C2D] font-bold uppercase tracking-widest text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 cursor-pointer disabled:opacity-50"
                >
                  <PlusCircle className="w-5 h-5" /> Đặt phòng / Nhận khách
                </button>
              )}
              {selectedRoom.status === 'Đã đặt' && (
                <button
                  disabled={roomActionLoading}
                  onClick={handleCheckIn}
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
                    onClick={handleCheckout}
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
                    onClick={() => exportInvoice(selectedRoom)}
                    className="w-full h-10 bg-white hover:bg-gray-100 text-[#0B1C2D] font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 border border-[#0B1C2D]/20 cursor-pointer disabled:opacity-50"
                  >
                    <Printer className="w-4 h-4 text-[#D4AF37]" /> In hóa đơn thanh toán
                  </button>
                </div>
              )}
              {selectedRoom.status === 'Đang dọn' && (
                <button
                  disabled={roomActionLoading}
                  onClick={handleCleaned}
                  className="w-full h-12 border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B1C2D] font-bold uppercase tracking-widest text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {roomActionLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <PaintBucket className="w-4 h-4" /> Hoàn tất dọn dẹp
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL ĐẶT PHÒNG NHANH CHO ADMIN --- */}
      {isBookingModalOpen && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1C2D]/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-[#0B1C2D]/10 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-[#0B1C2D] text-white p-6 flex justify-between items-center relative">
              <div>
                <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">{selectedRoom.type}</span>
                <h3 className="text-2xl font-serif font-bold text-white mt-0.5">Đặt phòng {selectedRoom.number}</h3>
                <p className="text-xs text-white/60 mt-1">Đơn giá: {new Intl.NumberFormat('vi-VN').format(selectedRoom.price)} VNĐ / đêm</p>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleBookingSubmit} className="p-6 overflow-y-auto space-y-4 custom-scrollbar">
              {bookingError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg font-medium">
                  ⚠️ {bookingError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#0B1C2D]/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-sm"
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
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#0B1C2D]/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-sm"
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
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#0B1C2D]/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B1C2D]/70 uppercase tracking-wider mb-1">
                    Email khách hàng
                  </label>
                  <input
                    type="email"
                    placeholder="VD: guest@email.com (tùy chọn)"
                    value={bookingForm.Email}
                    onChange={(e) => setBookingForm({ ...bookingForm, Email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#0B1C2D]/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#0B1C2D]/70 uppercase tracking-wider mb-1">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    placeholder="VD: TP. Hồ Chí Minh"
                    value={bookingForm.DiaChi}
                    onChange={(e) => setBookingForm({ ...bookingForm, DiaChi: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#0B1C2D]/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-sm"
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
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#0B1C2D]/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-sm"
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
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#0B1C2D]/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B1C2D]/70 uppercase tracking-wider mb-1">
                    Hình thức thanh toán
                  </label>
                  <select
                    value={bookingForm.HinhThucThanhToan}
                    onChange={(e) => setBookingForm({ ...bookingForm, HinhThucThanhToan: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#0B1C2D]/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-sm bg-white cursor-pointer"
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
                    <span className="text-xs font-bold text-[#0B1C2D]">Khách nhận phòng ngay (Check-in trực tiếp)</span>
                  </label>
                </div>
              </div>

              {/* Box Tính Toán Chi Phí */}
              {(() => {
                const s = new Date(bookingForm.NgayCheckIn);
                const e = new Date(bookingForm.NgayCheckOutDuKien);
                const nights = Math.max(1, Math.ceil((e - s) / (1000 * 60 * 60 * 24)));
                const price = Number(selectedRoom.price) || 0;
                const total = nights * price;
                const deposit = bookingForm.HinhThucThanhToan === 'Tại quầy' ? total * 0.3 : total;

                return (
                  <div className="bg-[#F8F5F0] p-4 rounded-xl border border-[#D4AF37]/30 space-y-1.5 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>Thời gian lưu trú:</span>
                      <span className="font-bold text-[#0B1C2D]">{nights} đêm ({bookingForm.NgayCheckIn} ➜ {bookingForm.NgayCheckOutDuKien})</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tổng tiền phòng:</span>
                      <span className="font-bold text-[#0B1C2D]">{new Intl.NumberFormat('vi-VN').format(total)} VNĐ</span>
                    </div>
                    <div className="flex justify-between text-[#D4AF37] font-bold text-sm pt-1 border-t border-[#D4AF37]/20">
                      <span>{bookingForm.HinhThucThanhToan === 'Tại quầy' ? 'Tiền cọc cần thu (30%):' : 'Tổng thanh toán (100%):'}</span>
                      <span>{new Intl.NumberFormat('vi-VN').format(deposit)} VNĐ</span>
                    </div>
                  </div>
                );
              })()}

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
                  {bookingLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Xác nhận Đặt phòng</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL THÊM / SỬA TÀI KHOẢN --- */}
      {isAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1C2D]/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-[#0B1C2D]/10 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-[#0B1C2D] text-white p-6 flex justify-between items-center relative">
              <div>
                <h3 className="text-xl font-serif font-bold text-white">
                  {editingAccount ? 'Chỉnh sửa tài khoản' : 'Tạo tài khoản mới'}
                </h3>
                <p className="text-xs text-white/60 mt-0.5">
                  {editingAccount ? `Cập nhật thông tin cho #${editingAccount.TaiKhoanID} - ${editingAccount.Email}` : 'Cấp quyền và tạo thông tin người dùng mới'}
                </p>
              </div>
              <button
                onClick={() => setIsAccountModalOpen(false)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAccountFormSubmit} className="p-6 overflow-y-auto space-y-4 custom-scrollbar">
              {accountFormError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg font-medium">
                  {accountFormError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#0B1C2D]/70 uppercase tracking-wider mb-1">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn A"
                    value={accountForm.HoTen}
                    onChange={(e) => setAccountForm({ ...accountForm, HoTen: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#0B1C2D]/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B1C2D]/70 uppercase tracking-wider mb-1">
                    Email đăng nhập <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="VD: user@hotel.com"
                    value={accountForm.Email}
                    onChange={(e) => setAccountForm({ ...accountForm, Email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#0B1C2D]/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B1C2D]/70 uppercase tracking-wider mb-1">
                    Mật khẩu {editingAccount ? <span className="text-gray-400 font-normal">(tùy chọn)</span> : <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="password"
                    required={!editingAccount}
                    placeholder={editingAccount ? "Để trống nếu giữ nguyên" : "Tối thiểu 6 ký tự"}
                    value={accountForm.MatKhau}
                    onChange={(e) => setAccountForm({ ...accountForm, MatKhau: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#0B1C2D]/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B1C2D]/70 uppercase tracking-wider mb-1">
                    Vai trò hệ thống <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={accountForm.VaiTroID}
                    onChange={(e) => setAccountForm({ ...accountForm, VaiTroID: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#0B1C2D]/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-sm bg-white cursor-pointer"
                  >
                    <option value={1}>Quản trị viên (Admin)</option>
                    <option value={2}>Nhân viên / Lễ tân</option>
                    <option value={3}>Khách hàng</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B1C2D]/70 uppercase tracking-wider mb-1">
                    Trạng thái tài khoản
                  </label>
                  <select
                    value={accountForm.TrangThai}
                    onChange={(e) => setAccountForm({ ...accountForm, TrangThai: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#0B1C2D]/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-sm bg-white cursor-pointer"
                  >
                    <option value={1}>Hoạt động (Cho phép đăng nhập)</option>
                    <option value={0}>Đã khóa (Chặn đăng nhập)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B1C2D]/70 uppercase tracking-wider mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    placeholder="VD: 0901234567"
                    value={accountForm.SoDienThoai}
                    onChange={(e) => setAccountForm({ ...accountForm, SoDienThoai: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#0B1C2D]/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0B1C2D]/70 uppercase tracking-wider mb-1">
                    Số CCCD / CMND
                  </label>
                  <input
                    type="text"
                    placeholder="VD: 07920300xxxx"
                    value={accountForm.CCCD}
                    onChange={(e) => setAccountForm({ ...accountForm, CCCD: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#0B1C2D]/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#0B1C2D]/70 uppercase tracking-wider mb-1">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Quận 1, TP. Hồ Chí Minh"
                    value={accountForm.DiaChi}
                    onChange={(e) => setAccountForm({ ...accountForm, DiaChi: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#0B1C2D]/20 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none text-sm"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAccountModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-bold text-xs uppercase tracking-wider hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={accountFormLoading}
                  className="px-6 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#b5952f] text-[#0B1C2D] font-bold text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer disabled:opacity-50"
                >
                  {accountFormLoading ? 'Đang lưu...' : editingAccount ? 'Lưu thay đổi' : 'Xác nhận tạo'}
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
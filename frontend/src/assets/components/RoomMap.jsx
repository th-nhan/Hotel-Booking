import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

const RoomMap = () => {
  const navigate = useNavigate();

  // State lưu thông tin bộ lọc
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  // State dữ liệu phòng
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    const today = new Date();
    const nextWeek = new Date(today);
    
    //  Mặc định lọc ngày Check-out là 7 ngày sau (1 tuần)
    nextWeek.setDate(nextWeek.getDate() + 7); 
    
    const checkInDate = today.toISOString().split('T')[0];
    const checkOutDate = nextWeek.toISOString().split('T')[0];

    setCheckIn(checkInDate);
    setCheckOut(checkOutDate);
    
    // Gọi API lấy dữ liệu phòng trống trong 1 tuần tới
    fetchRooms({
      check_in: checkInDate,
      check_out: checkOutDate
    });
  }, []);

  const fetchRooms = async (filterParams = {}) => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/phongs', {
        params: filterParams
      });

      const totalGuests = adults + children;
      
      const processedRooms = response.data.map(room => {
        // Nếu phòng Trống nhưng KHÔNG ĐỦ CHỖ cho số khách -> Khóa lại
        if (room.TinhTrang === 'Trống' && room.SoLuongToiDa < totalGuests) {
          return { ...room, TinhTrang: 'Không đủ chỗ' };
        }
        return room;
      });

      setRooms(processedRooms);
      setSelectedRoom(null); 
    } catch (error) {
      console.error("Lỗi lấy dữ liệu phòng:", error);
      message.error("Không thể tải sơ đồ phòng!");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (new Date(checkIn) >= new Date(checkOut)) {
      message.warning("Ngày trả phòng phải sau ngày nhận phòng!");
      return;
    }

    const filterParams = {
      check_in: checkIn,
      check_out: checkOut,
      adults: adults,
      children: children
    };
    
    fetchRooms(filterParams);
  };

  const groupByFloor = (data) => {
    return data.reduce((acc, room) => {
      const floorMatch = room.TenPhong.match(/\d+/);
      let floor = 0;
      if (floorMatch) {
        const num = parseInt(floorMatch[0]);
        floor = num < 1000 ? Math.floor(num / 100) : Math.floor(num / 100);
      }
      if (!acc[floor]) acc[floor] = [];
      acc[floor].push(room);
      return acc;
    }, {});
  };

  const roomsByFloor = groupByFloor(rooms);
  const sortedFloors = Object.keys(roomsByFloor).sort((a, b) => b - a);

  const getRoomStyle = (status) => {
    switch (status) {
      case 'Trống':
        return 'bg-[#d4af35]/20 border-[#d4af35]/40 text-[#d4af35] shadow-[0_0_15px_rgba(212,175,53,0.2)] hover:bg-[#d4af35]/30 cursor-pointer';
      case 'Đã đặt':
      case 'Đang ở':
      case 'Đang dọn':
      case 'Không đủ chỗ':
        return 'bg-white/5 border-white/10 text-white/30 opacity-70 hover:bg-white/10 cursor-pointer'; 
      default:
        return 'bg-gray-500/20 border-gray-500/40 text-gray-400 cursor-not-allowed';
    }
  };


  return (
    <div className="bg-[#201d12] text-slate-100 font-sans antialiased overflow-x-hidden min-h-screen flex flex-col">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-white/10 px-6 py-4 lg:px-10 z-50 bg-[#201d12]/90 sticky top-0 backdrop-blur-md">
        <div className="flex items-center gap-4 text-white cursor-pointer" onClick={() => navigate('/')}>
          <div className="size-8 text-[#d4af35]">
            <span className="material-symbols-outlined !text-[32px]">apartment</span>
          </div>
          <h2 className="text-white text-xl font-display font-bold leading-tight tracking-wider">LA MAISON DTN</h2>
        </div>
        <div className="hidden lg:flex flex-1 justify-end gap-8 items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="text-slate-300 hover:text-white transition-colors">
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-col lg:flex-row flex-1 h-[calc(100vh-73px)] overflow-hidden">
        
        {/* --- LEFT SIDEBAR --- */}
        <aside className="w-full lg:w-[340px] border-b lg:border-b-0 lg:border-r border-white/10 bg-[#201d12] flex flex-col p-6 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-display font-medium text-white mb-2">Tìm Phòng</h1>
            <p className="text-white/50 text-sm">Lọc phòng trống theo ngày và số khách</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[#d4af35] font-medium text-sm tracking-wide uppercase">Thời gian lưu trú (Mặc định 1 tuần)</h3>
              <span className="material-symbols-outlined text-white/40 text-sm">calendar_month</span>
            </div>
            <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/10">
              <div>
                <label className="block text-xs text-white/50 uppercase tracking-widest mb-1.5 ml-1">Nhận phòng (Check-in)</label>
                <input 
                  type="date" 
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  style={{ colorScheme: 'dark' }}
                  className="w-full bg-[#201d12] border border-white/10 rounded-lg py-2.5 px-3 text-white focus:border-[#d4af35] focus:outline-none focus:ring-1 focus:ring-[#d4af35] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 uppercase tracking-widest mb-1.5 ml-1">Trả phòng (Check-out)</label>
                <input 
                  type="date" 
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  style={{ colorScheme: 'dark' }}
                  className="w-full bg-[#201d12] border border-white/10 rounded-lg py-2.5 px-3 text-white focus:border-[#d4af35] focus:outline-none focus:ring-1 focus:ring-[#d4af35] transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[#d4af35] font-medium text-sm tracking-wide uppercase">Khách</h3>
              <span className="material-symbols-outlined text-white/40 text-sm">group</span>
            </div>
            <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white font-medium">Người lớn</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setAdults(Math.max(1, adults - 1))} className="size-7 rounded-full bg-[#201d12] border border-white/10 flex items-center justify-center hover:bg-[#d4af35]/20 text-white hover:text-[#d4af35] hover:border-[#d4af35]/50 transition-all"><span className="material-symbols-outlined text-sm">remove</span></button>
                  <span className="text-white w-5 text-center font-bold">{adults}</span>
                  <button onClick={() => setAdults(adults + 1)} className="size-7 rounded-full bg-[#201d12] border border-white/10 flex items-center justify-center hover:bg-[#d4af35]/20 text-white hover:text-[#d4af35] hover:border-[#d4af35]/50 transition-all"><span className="material-symbols-outlined text-sm">add</span></button>
                </div>
              </div>
              <div className="h-px bg-white/5 w-full my-1"></div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white font-medium">Trẻ em</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setChildren(Math.max(0, children - 1))} className="size-7 rounded-full bg-[#201d12] border border-white/10 flex items-center justify-center hover:bg-[#d4af35]/20 text-white hover:text-[#d4af35] hover:border-[#d4af35]/50 transition-all"><span className="material-symbols-outlined text-sm">remove</span></button>
                  <span className="text-white w-5 text-center font-bold">{children}</span>
                  <button onClick={() => setChildren(children + 1)} className="size-7 rounded-full bg-[#201d12] border border-white/10 flex items-center justify-center hover:bg-[#d4af35]/20 text-white hover:text-[#d4af35] hover:border-[#d4af35]/50 transition-all"><span className="material-symbols-outlined text-sm">add</span></button>
                </div>
              </div>
            </div>
          </div>

          <div className="">
            <button 
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-[#d4af35] hover:bg-[#bfa030] text-[#201d12] font-bold py-3.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(212,175,53,0.25)] uppercase tracking-widest disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-lg">search</span>
              <span>{loading ? 'Đang lọc...' : 'Lọc Bộ Kết Quả'}</span>
            </button>
          </div>
        </aside>

        {/* --- CENTER: SƠ ĐỒ PHÒNG KIẾN TRÚC --- */}
        <section className="flex-1 relative flex flex-col items-center py-12 px-8 overflow-y-auto">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-[#201d12]/50 backdrop-blur-sm z-50">
              <span className="text-[#d4af35] material-symbols-outlined text-4xl animate-spin">progress_activity</span>
            </div>
          ) : null}

          <div className="sticky top-0 bg-[#201d12]/90 backdrop-blur border border-white/10 px-6 py-3 rounded-full flex gap-6 z-20 mb-8 shadow-xl">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-[#d4af35] shadow-[0_0_10px_rgba(212,175,53,0.6)]"></div>
              <span className="text-xs text-white uppercase tracking-wider">Trống</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-white/10 border border-white/20"></div>
              <span className="text-xs text-white/50 uppercase tracking-wider">Đã đặt / Không khả dụng</span>
            </div>
          </div>

          <div className="w-full max-w-4xl flex flex-col gap-3 relative">
            {sortedFloors.length === 0 && !loading && (
              <div className="text-center text-white/40 mt-10 italic">
                Sơ đồ phòng trống. Vui lòng kiểm tra lại kết nối.
              </div>
            )}
            
            {sortedFloors.map(floor => {
              const floorNum = parseInt(floor);
              let gridClass = "grid-cols-4"; 
              let roomHeight = "h-16";
              let textSize = "text-lg";

              if (floorNum >= 9) {
                gridClass = "grid-cols-3";
                roomHeight = "h-28 lg:h-32";
                textSize = "text-xl lg:text-2xl";
              } else if (floorNum >= 6 && floorNum <= 8) {
                gridClass = "grid-cols-5";
                roomHeight = "h-16 lg:h-20";
                textSize = "text-base lg:text-lg";
              } else if (floorNum >= 2 && floorNum <= 5) {
                gridClass = "grid-cols-5 lg:grid-cols-10"; 
                roomHeight = "h-12";
                textSize = "text-xs lg:text-sm";
              }

              return (
                <div key={floor} className="flex gap-4 w-full border-b border-white/5 pb-3 items-stretch">
                  <div className="w-12 lg:w-16 shrink-0 flex items-center justify-center bg-white/5 rounded-lg border border-white/10 text-white/50 font-display text-xs lg:text-sm tracking-widest">
                    Lầu {floor}
                  </div>

                  <div className={`flex-1 grid ${gridClass} gap-2 lg:gap-3`}>
                    {roomsByFloor[floor].map(room => (
                      <button
                        key={room.PhongID}
                        onClick={() => setSelectedRoom(room)}
                        className={`
                          relative flex flex-col items-center justify-center rounded-lg border transition-all duration-300 ${roomHeight} overflow-hidden
                          ${getRoomStyle(room.TinhTrang)}
                          ${selectedRoom?.PhongID === room.PhongID ? 'ring-2 ring-offset-2 ring-offset-[#201d12] ring-[#d4af35] scale-105 z-10' : ''}
                        `}
                      >
                        <span className={`font-display font-bold ${textSize} relative z-10`}>{room.TenPhong}</span>
                        
                        {/* HIỂN THỊ ICON Ổ KHÓA HOẶC CẤM TRÊN SƠ ĐỒ */}
                        {(room.TinhTrang === 'Đang ở' || room.TinhTrang === 'Đã đặt' || room.TinhTrang === 'Đang dọn') && (
                          <span className="material-symbols-outlined absolute text-[14px] text-white/30 bottom-1 right-1 lg:bottom-2 lg:right-2 z-10">lock</span>
                        )}
                        {room.TinhTrang === 'Không đủ chỗ' && (
                          <span className="material-symbols-outlined absolute text-[14px] text-white/30 bottom-1 right-1 lg:bottom-2 lg:right-2 z-10">group_off</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* --- RIGHT SIDEBAR: CHI TIẾT --- */}
        <aside className="w-full lg:w-[400px] border-t lg:border-t-0 lg:border-l border-white/10 bg-[#201d12] flex flex-col z-20 shadow-2xl overflow-y-auto">
          {!selectedRoom ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <span className="material-symbols-outlined text-[80px] text-white/10 mb-4">domain</span>
              <h3 className="text-white/50 font-display text-lg">Chưa chọn phòng</h3>
              <p className="text-white/30 text-sm mt-2">Vui lòng chọn một phòng từ sơ đồ để xem chi tiết hoặc thực hiện giao dịch.</p>
            </div>
          ) : (
            <>
              <div className="relative h-64 shrink-0">
                <img 
                  alt={selectedRoom.TenLoai} 
                  className="w-full h-full object-cover" 
                  src={selectedRoom.AnhDienDien} 
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop' }} 
                />
                <div className="absolute top-4 right-4 bg-[#d4af35] text-[#201d12] font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  {selectedRoom.TinhTrang === 'Đang dọn' ? 'Đã đặt' : selectedRoom.TinhTrang}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#201d12] to-transparent h-24"></div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-3xl font-display font-medium text-white">{selectedRoom.TenPhong}</h2>
                  <div className="text-right">
                    <span className="text-[#d4af35] font-display text-xl font-bold">{new Intl.NumberFormat('vi-VN').format(selectedRoom.GiaPhong)}<span className="text-sm font-sans text-white/50 font-normal">đ</span></span>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">/ Đêm</p>
                  </div>
                </div>
                <p className="text-sm text-[#d4af35] mb-6 uppercase tracking-widest">{selectedRoom.TenLoai}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-8 border-y border-white/10 py-5">
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <span className="material-symbols-outlined text-[#d4af35]">group</span>
                    <span>Tối đa {selectedRoom.SoLuongToiDa} người</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <span className="material-symbols-outlined text-[#d4af35]">king_bed</span>
                    <span>Giường King</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <span className="material-symbols-outlined text-[#d4af35]">bathtub</span>
                    <span>Phòng tắm đá marble</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <span className="material-symbols-outlined text-[#d4af35]">wifi</span>
                    <span>Wifi tốc độ cao</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-white/70 text-sm font-medium mb-2 uppercase tracking-wide">Mô tả</h4>
                  <p className="text-sm text-white/40 leading-relaxed italic border-l-2 border-[#d4af35] pl-3">
                    "{selectedRoom.MoTa}"
                  </p>
                </div>
                
                <div className="mt-6">
                  {selectedRoom.TinhTrang === 'Trống' && (
                    <button 
                      onClick={() => navigate('/booking-page', { 
                        state: { 
                          room: selectedRoom, 
                          adults, 
                          children,
                          checkIn,
                          checkOut
                        } 
                      })}
                      className="w-full bg-[#d4af35] hover:bg-[#bfa030] text-[#201d12] font-bold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(212,175,53,0.3)] uppercase tracking-widest"
                    >
                      <span>Đặt Phòng Ngay</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  )}


                  {/* LOGIC NÚT KHÓA */}
                  {(selectedRoom.TinhTrang === 'Đã đặt' || selectedRoom.TinhTrang === 'Đang dọn') && (
                    <button disabled className="w-full bg-white/5 border border-white/10 text-white/40 font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2 uppercase tracking-widest cursor-not-allowed">
                      <span className="material-symbols-outlined text-lg">lock</span>
                      <span>Phòng Đã Kín Lịch</span>
                    </button>
                  )}

                  {selectedRoom.TinhTrang === 'Không đủ chỗ' && (
                    <button disabled className="w-full bg-red-500/10 border border-red-500/20 text-red-500/50 font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2 uppercase tracking-widest cursor-not-allowed">
                      <span className="material-symbols-outlined text-lg">group_off</span>
                      <span>Vượt Quá Sức Chứa ({selectedRoom.SoLuongToiDa} Người)</span>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </aside>
      </main>
    </div>
  );
}

export default RoomMap;
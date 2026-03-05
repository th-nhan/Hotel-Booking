import React, { useState } from 'react';
import { message } from 'antd'; // Chỉ giữ lại message để hiện thông báo
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    
    // State để lưu trữ dữ liệu người dùng nhập
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Xử lý khi bấm nút Submit
    const handleLogin = async (e) => {
        e.preventDefault(); // Ngăn trình duyệt reload lại trang
        
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login', {
                username: email,
                password: password
            });
            
            if (response.data.status === 'success') {
                message.success('Đăng nhập thành công!');

                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                if (response.data.user.role === 1 || response.data.user.role === '1') {
                    navigate('/dashboard');
                } else {
                    navigate('/');
                }
            }
        } catch (error) {
            message.error('Sai tên đăng nhập hoặc mật khẩu!');
        }
    };

    
    const goldGradientStyle = {
        background: 'linear-gradient(135deg, #d4af35 0%, #a68a2e 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    };

    return (
        <div className="font-sans antialiased text-[#0B1C2D] bg-[#f8f7f6] min-h-screen flex flex-col">
            <div className="relative flex min-h-screen w-full flex-col overflow-hidden">
                
                {/* Ảnh nền có lớp phủ mờ */}
                <div className="absolute inset-0 z-0">
                    <img 
                        alt="Grand luxury hotel lobby" 
                        className="h-full w-full object-cover blur-[2px] scale-105" 
                        src="https://wonder.vn/wp-content/uploads/2017/10/1-16.jpg"
                    />
                    <div className="absolute inset-0 bg-[#0B1C2D]/40 backdrop-blur-[1px]"></div>
                </div>

                {/* Nội dung Form */}
                <div className="relative z-10 flex h-full grow flex-col items-center justify-center p-4">
                    
                    <div className="w-full max-w-[480px] bg-[#F8F5F0] rounded-xl relative border border-white/20 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)]">
                        {/* Viền góc trang trí */}
                        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#d4af35]/40 rounded-tl-lg pointer-events-none"></div>
                        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#d4af35]/40 rounded-tr-lg pointer-events-none"></div>
                        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#d4af35]/40 rounded-bl-lg pointer-events-none"></div>
                        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#d4af35]/40 rounded-br-lg pointer-events-none"></div>
                        
                        <div className="px-8 py-10 md:px-12 md:py-14 flex flex-col items-center">
                            
                            {/* Logo */}
                            <div className="flex flex-col items-center mb-8">
                               
                                <h1 className="text-3xl font-bold tracking-tight mb-1" style={goldGradientStyle}>DTN</h1>
                                <p className="text-xs font-medium tracking-[0.2em] text-[#0B1C2D]/60 uppercase">La Maison</p>
                            </div>

                            {/* Tabs */}
                            <div className="w-full mb-8">
                                <div className="flex border-b border-[#e5e0d2] w-full">
                                    <button className="flex-1 pb-3 text-sm font-semibold tracking-wide border-b-2 border-[#d4af35] text-[#0B1C2D] transition-colors">
                                        Login
                                    </button>
                                    <button 
                                        onClick={() => navigate('/register')}
                                        className="flex-1 pb-3 text-sm font-semibold tracking-wide border-b-2 border-transparent text-[#0B1C2D]/40 hover:text-[#0B1C2D]/70 transition-colors"
                                    >
                                        Register
                                    </button>
                                </div>
                            </div>

                            {/* Form Logic */}
                            <form onSubmit={handleLogin} className="w-full flex flex-col gap-5">
                                {/* Email */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium uppercase tracking-wider text-[#0B1C2D]/70 ml-1" htmlFor="email">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-[#d4af35]/70 text-[20px]">mail</span>
                                        </div>
                                        <input 
                                            id="email" 
                                            type="email" 
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="guest@lamaison.dtn" 
                                            className="block w-full rounded-lg border-[#e5e0d2] bg-white py-3 pl-10 pr-3 text-[#0B1C2D] placeholder-[#0B1C2D]/30 focus:border-[#d4af35] focus:outline-none focus:ring-1 focus:ring-[#d4af35] sm:text-sm transition-all shadow-sm" 
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium uppercase tracking-wider text-[#0B1C2D]/70 ml-1" htmlFor="password">Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-[#d4af35]/70 text-[20px]">lock</span>
                                        </div>
                                        <input 
                                            id="password" 
                                            type={showPassword ? "text" : "password"} 
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••" 
                                            className="block w-full rounded-lg border-[#e5e0d2] bg-white py-3 pl-10 pr-10 text-[#0B1C2D] placeholder-[#0B1C2D]/30 focus:border-[#d4af35] focus:outline-none focus:ring-1 focus:ring-[#d4af35] sm:text-sm transition-all shadow-sm" 
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#0B1C2D]/40 hover:text-[#0B1C2D] transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">
                                                {showPassword ? 'visibility' : 'visibility_off'}
                                            </span>
                                        </button>
                                    </div>
                                    <div className="flex justify-end mt-1">
                                        <a href="#" className="text-xs font-medium text-[#0B1C2D]/60 hover:text-[#d4af35] transition-colors underline decoration-transparent hover:decoration-[#d4af35] underline-offset-4">
                                            Forgot Password?
                                        </a>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button 
                                    type="submit" 
                                    className="mt-4 w-full flex items-center justify-center rounded-lg bg-[#d4af35] py-3.5 px-4 text-sm font-bold text-white shadow-[0_0_15px_rgba(212,175,53,0.3)] hover:bg-[#b08d2b] hover:shadow-lg transition-all transform active:scale-[0.98] tracking-wide uppercase"
                                >
                                    Enter La Maison
                                </button>
                            </form>

                            {/* Concierge Link */}
                            <div className="mt-8 pt-6 border-t border-[#e5e0d2] w-full flex flex-col items-center gap-3">
                                <p className="text-xs text-[#0B1C2D]/50">Having trouble accessing your account?</p>
                                <a href="#" className="inline-flex items-center gap-2 text-xs font-semibold text-[#0B1C2D] hover:text-[#d4af35] transition-colors group">
                                    <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">concierge</span>
                                    Contact Concierge
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-white/60 text-xs tracking-wider font-light">
                        © 2026 LA MAISON DTN. All Rights Reserved.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
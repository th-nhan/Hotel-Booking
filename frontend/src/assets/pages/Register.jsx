import React, { useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();

    // State lưu dữ liệu
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    // Xử lý gửi API
    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            message.error('Mật khẩu nhập lại không khớp!');
            return;
        }

        if (!agreeToTerms) {
            message.warning('Vui lòng đồng ý với các điều khoản!');
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/register`, {
                fullname: fullName,
                username: email,
                password: password
            });

            if (response.data.status === 'success') {
                message.success('Đăng ký thành công! Đang chuyển hướng...');
                navigate('/login');
            }
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.message || 'Đăng ký thất bại, email có thể đã tồn tại!';
            message.error(errorMsg);
        }
    };

    // Style cho chữ DTN
    const goldGradientStyle = {
        background: 'linear-gradient(135deg, #d4af35 0%, #a68a2e 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    };

    return (
        <div className="font-sans antialiased text-[#0B1C2D] bg-[#f8f7f6] min-h-screen flex flex-col">
            <div className="relative flex min-h-screen w-full flex-col overflow-hidden">

                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        alt="Grand luxury hotel lobby"
                        className="h-full w-full object-cover blur-[2px] scale-105"
                        src="https://wonder.vn/wp-content/uploads/2017/10/1-16.jpg"
                    />
                    <div className="absolute inset-0 bg-[#0B1C2D]/40 backdrop-blur-[1px]"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex h-full grow flex-col items-center justify-center p-4 py-10">
                    <div className="w-full max-w-[480px] bg-[#F8F5F0] rounded-xl relative border border-white/20 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)]">
                        {/* Viền góc */}
                        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#d4af35]/40 rounded-tl-lg pointer-events-none"></div>
                        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#d4af35]/40 rounded-tr-lg pointer-events-none"></div>
                        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#d4af35]/40 rounded-bl-lg pointer-events-none"></div>
                        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#d4af35]/40 rounded-br-lg pointer-events-none"></div>

                        <div className="px-8 py-10 flex flex-col items-center">
                            
                            {/* Logo */}
                            <div className="flex flex-col items-center mb-6">
                               
                                <h1 className="text-3xl font-bold tracking-tight mb-1" style={goldGradientStyle}>DTN</h1>
                                <p className="text-xs font-medium tracking-[0.2em] text-[#0B1C2D]/60 uppercase">La Maison</p>
                            </div>

                            {/* Tabs */}
                            <div className="w-full mb-6">
                                <div className="flex border-b border-[#e5e0d2] w-full">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/login')}
                                        className="flex-1 pb-3 text-sm font-semibold tracking-wide border-b-2 border-transparent text-[#0B1C2D]/40 hover:text-[#0B1C2D]/70 transition-colors"
                                    >
                                        Login
                                    </button>
                                    <button className="flex-1 pb-3 text-sm font-semibold tracking-wide border-b-2 border-[#d4af35] text-[#0B1C2D] transition-colors">
                                        Register
                                    </button>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleRegister} className="w-full flex flex-col gap-4">

                                {/* Full Name */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium uppercase tracking-wider text-[#0B1C2D]/70 ml-1">Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-[#d4af35]/70 text-[20px]">person</span>
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Nguyễn Văn A"
                                            className="block w-full rounded-lg border-[#e5e0d2] bg-white py-3 pl-10 pr-3 text-[#0B1C2D] placeholder-[#0B1C2D]/30 focus:border-[#d4af35] focus:outline-none focus:ring-1 focus:ring-[#d4af35] sm:text-sm transition-all shadow-sm"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium uppercase tracking-wider text-[#0B1C2D]/70 ml-1">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-[#d4af35]/70 text-[20px]">mail</span>
                                        </div>
                                        <input
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
                                    <label className="text-xs font-medium uppercase tracking-wider text-[#0B1C2D]/70 ml-1">Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-[#d4af35]/70 text-[20px]">lock</span>
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            minLength={6}
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
                                </div>

                                {/* Confirm Password */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium uppercase tracking-wider text-[#0B1C2D]/70 ml-1">Confirm Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-[#d4af35]/70 text-[20px]">verified_user</span>
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            minLength={6}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="block w-full rounded-lg border-[#e5e0d2] bg-white py-3 pl-10 pr-3 text-[#0B1C2D] placeholder-[#0B1C2D]/30 focus:border-[#d4af35] focus:outline-none focus:ring-1 focus:ring-[#d4af35] sm:text-sm transition-all shadow-sm"
                                        />
                                    </div>
                                </div>

                                {/* Terms Checkbox */}
                                <label className="flex items-start gap-3 mt-1 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="mt-1 rounded border-[#e5e0d2] text-[#d4af35] focus:ring-[#d4af35]/50 bg-white cursor-pointer"
                                        checked={agreeToTerms}
                                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                                    />
                                    <span className="text-sm text-[#0B1C2D]/80">
                                        I agree to the <span className="text-[#d4af35] hover:underline cursor-pointer">Terms of Service</span> and <span className="text-[#d4af35] hover:underline cursor-pointer">Privacy Policy</span>.
                                    </span>
                                </label>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="mt-2 w-full flex items-center justify-center rounded-lg bg-[#d4af35] py-3.5 px-4 text-sm font-bold text-white shadow-[0_0_15px_rgba(212,175,53,0.3)] hover:bg-[#b08d2b] hover:shadow-lg transition-all active:scale-[0.98] tracking-wide uppercase"
                                >
                                    Create Account
                                </button>
                            </form>
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

export default Register;
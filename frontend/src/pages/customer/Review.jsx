import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/ui/useToast';
import { useLanguage } from '../../context/LanguageContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const Header = () => {
    const navigate = useNavigate();
    const { language, setLanguage, t } = useLanguage();
    
    // Đọc thông tin user trực tiếp
    const user = (() => {
        try {
            const stored = localStorage.getItem('user');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    })();

    const userName = user?.HoTen || user?.name || t('navbar.guest');
    const isLoggedIn = !!user;

    return (
        <header className="sticky top-0 left-0 right-0 z-[990] flex items-center justify-between border-b border-primary/20 bg-background-light/80 backdrop-blur-md px-6 md:px-20 py-4">
            <div className="flex items-center gap-3">
                <a href="/" className="font-display text-xl font-bold tracking-widest text-navy-deep hover:text-primary transition-colors">
                    {t('navbar.brand')}
                </a>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
                    className="px-3 py-1 text-xs font-bold text-navy-deep hover:text-primary rounded-full border border-navy-deep/20 bg-black/5 hover:bg-black/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                    title={t('navbar.language')}
                >
                    <span className="material-icons-outlined text-sm">language</span>
                    <span>{language === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}</span>
                </button>

                {isLoggedIn ? (
                    <div onClick={() => navigate('/profile')} className="flex items-center gap-2 text-navy-deep/70 cursor-pointer hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-navy-deep/40">account_circle</span>
                        <span className="text-sm font-medium">{userName}</span>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className="text-xs uppercase tracking-widest font-bold text-navy-deep hover:text-primary transition-colors px-2 py-2 cursor-pointer"
                    >
                        {t('navbar.login')}
                    </button>
                )}
                <button onClick={() => navigate('/room-map')} className="bg-primary text-navy-deep px-6 py-2 text-xs uppercase tracking-widest font-bold hover:text-white transition-all rounded cursor-pointer">
                    {t('navbar.bookNow')}
                </button>
            </div>
        </header>
    );
};

const Hero = () => {
    const { t } = useLanguage();
    return (
        <section className="relative h-[460px] w-full flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-navy-deep/40 z-10 backdrop-blur-[2px]"></div>
                <div
                    className="w-full h-full bg-cover bg-center scale-105"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD1Hu0BuA4hkHgSuEd8idXqGujxWqiy95YDtoxoM__I9YgwKc_vUgUZhQ8UxOnphgGgOMkotzynDHN5bOe-nfP7GtwbPT6wlyRQBElmHc3X0t0hrXDFQtc-lsqqNJZd_wkDjo0OLiNNOj7bobashuXbZw_tnEpq6iwl8ZQcRUDxcNq9breWp2IML2RnTdFLxPyZCZ51vsTwzJxmTHQDWIpZ4tfICBMs1YRe8r8qs5dNbRLLyabcJBoxJSIXGlJr6bKHvHrZS-ni6KU')" }}
                ></div>
            </div>
            <div className="relative z-20 text-center px-4 text-white">
                <div className="mb-4 flex justify-center opacity-80">
                    <span className="material-symbols-outlined text-primary text-5xl">auto_awesome</span>
                </div>
                <h1 className="font-display text-5xl md:text-7xl text-ivory leading-tight mb-4 drop-shadow-lg">{t('reviews.pageTitle')}</h1>
                <div className="h-[1px] w-24 bg-primary mx-auto"></div>
                <p className="mt-6 text-ivory/90 font-display italic text-lg md:text-xl tracking-wide">{t('reviews.pageSubtitle')}</p>
            </div>
        </section>
    );
};

const ReviewForm = ({ onReviewSuccess, triggerToast }) => {
    const { language, t } = useLanguage();
    const [rating, setRating] = useState(5);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content) return triggerToast(language === 'vi' ? "Lỗi" : "Error", language === 'vi' ? "Vui lòng viết vài dòng chia sẻ nhé!" : "Please write your review!");

        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            triggerToast(language === 'vi' ? "Yêu cầu đăng nhập" : "Login Required", language === 'vi' ? "Bạn cần đăng nhập để gửi đánh giá nhé!" : "Please log in to submit a review!");
            setTimeout(() => navigate('/login'), 1500);
            return;
        }

        const user = JSON.parse(storedUser);
        const userName = user.HoTen || user.name || t('navbar.guest');
        const userAvatar = user.AnhDaiDien || `https://ui-avatars.com/api/?name=${userName}&background=D4AF37&color=fff`;

        setLoading(true);
        try {
            await axios.post(`${API_URL}/review`, {
                TaiKhoanID: user.id || user.TaiKhoanID,
                KhachHangID: user.KhachHangID,
                HoTen: userName,
                SoSao: rating,
                BinhLuan: content
            });

            triggerToast(userName, t('reviews.successSubmit'), userAvatar);

            setContent('');
            setRating(5);
            onReviewSuccess();
        } catch (error) {
            console.error("Lỗi gửi review:", error);
            triggerToast(language === 'vi' ? "Lỗi gửi đánh giá" : "Review Error", error.response?.data?.message || (language === 'vi' ? "Không thể gửi đánh giá" : "Could not submit review"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="marble-bg gold-border-gradient rounded-xl shadow-2xl p-8 md:p-12 mb-16 relative z-30 -mt-20 bg-white">
            <div className="text-center mb-10">
                <h2 className="font-display text-3xl text-navy-deep mb-2">{t('reviews.writeReview')}</h2>
                <p className="text-navy-deep/60 text-sm tracking-widest uppercase">{t('reviews.pageSubtitle')}</p>
            </div>
            <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                <div className="flex flex-col items-center">
                    <span className="text-xs uppercase tracking-widest font-bold text-navy-deep/70 mb-4">{t('reviews.yourRating')}</span>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                className="group transition-all hover:scale-110 bg-white cursor-pointer"
                                type="button"
                                onClick={() => setRating(star)}
                            >
                                <span
                                    className={`material-symbols-outlined text-4xl ${star <= rating ? 'text-primary' : 'text-primary/30'}`}
                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                >
                                    star
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col">
                    <label className="flex-1 flex flex-col h-full">
                        <span className="block text-xs uppercase tracking-widest font-bold text-navy-deep/70 mb-2">{t('reviews.yourComment')}</span>
                        <textarea
                            className="w-full flex-1 min-h-[120px] bg-transparent border border-navy-deep/10 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary p-4 transition-all placeholder:text-navy-deep/30 font-display leading-relaxed outline-none resize-none"
                            placeholder={t('reviews.commentPlaceholder')}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        ></textarea>
                    </label>
                </div>
                <div className="flex justify-center mt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`${loading ? 'opacity-50' : 'hover:shadow-primary/40 hover:-translate-y-0.5'} bg-primary text-navy-deep px-12 py-4 rounded font-bold uppercase tracking-[0.3em] text-xs shadow-lg shadow-primary/20 transition-all cursor-pointer`}
                    >
                        {loading ? '...' : t('reviews.submitReview')}
                    </button>
                </div>
            </form>
        </section>
    );
};

const Testimonials = ({ reviews, onRefresh, triggerToast }) => {
    const { language, t } = useLanguage();
    const safeReviews = Array.isArray(reviews) ? reviews : [];

    // State quản lý việc Like và Trả lời
    const [likedReviews, setLikedReviews] = useState({});
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    // Xử lý Thả tim
    const handleLike = async (reviewId) => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            triggerToast(language === 'vi' ? "Yêu cầu đăng nhập" : "Login Required", language === 'vi' ? "Bạn cần đăng nhập để thả tim!" : "Please log in to like this review!");
            setTimeout(() => navigate('/login'), 1500);
            return;
        }

        const user = JSON.parse(storedUser);

        setLikedReviews(prev => ({ ...prev, [reviewId]: !prev[reviewId] }));

        try {
            await axios.post(`${API_URL}/review/${reviewId}/like`, { 
                TaiKhoanID: user.id || user.TaiKhoanID,
                KhachHangID: user.KhachHangID,
                HoTen: user.HoTen || user.name || t('navbar.guest')
            });
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error("Lỗi khi thả tim:", error);
            setLikedReviews(prev => ({ ...prev, [reviewId]: !prev[reviewId] }));
        }
    };

    const handleReplySubmit = async (e, reviewId) => {
        e.preventDefault();
        if (!replyText.trim()) return triggerToast(language === 'vi' ? "Lỗi" : "Error", language === 'vi' ? "Vui lòng nhập nội dung trả lời!" : "Please type your reply!");

        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            triggerToast(language === 'vi' ? "Yêu cầu đăng nhập" : "Login Required", language === 'vi' ? "Bạn cần đăng nhập để trả lời bình luận!" : "Please log in to reply!");
            setTimeout(() => navigate('/login'), 1500);
            return;
        }

        const user = JSON.parse(storedUser);
        const userName = user.HoTen || user.name || t('navbar.guest');
        const userAvatar = user.AnhDaiDien || `https://ui-avatars.com/api/?name=${userName}&background=D4AF37&color=fff`;

        setIsSubmitting(true);
        try {
            await axios.post(`${API_URL}/review/${reviewId}/reply`, {
                TaiKhoanID: user.id || user.TaiKhoanID,
                KhachHangID: user.KhachHangID,
                HoTen: userName,
                NoiDung: replyText
            });

            triggerToast(userName, language === 'vi' ? "Câu trả lời của bạn đã được gửi thành công!" : "Your reply was posted successfully!", userAvatar);

            setReplyText('');
            setReplyingTo(null);
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error("Lỗi gửi phản hồi:", error);
            triggerToast(language === 'vi' ? "Lỗi gửi phản hồi" : "Reply Error", error.response?.data?.message || (language === 'vi' ? "Không thể gửi phản hồi lúc này." : "Could not send reply."));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between mb-8">
                <h3 className="font-display text-2xl text-navy-deep">{t('reviews.pageTitle')}</h3>
            </div>

            {safeReviews.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-navy-deep/10 rounded-xl">
                    <p className="text-navy-deep/40 italic">{t('reviews.noReviewsYet')}</p>
                </div>
            ) : (
                safeReviews.map((testimonial) => (
                    <div key={testimonial.DanhGiaID} className="bg-ivory border-l-4 border-primary shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-8 rounded-r-xl">

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-navy-deep/5 flex items-center justify-center border border-primary/20 overflow-hidden">
                                    <div
                                        className="w-full h-full bg-cover bg-center transition-all duration-300"
                                        style={{ backgroundImage: `url('${testimonial.AnhDaiDien || "https://cafefcdn.com/zoom/600_315/203337114487263232/2022/3/3/photo1646280815645-1646280816151764748403.jpg"}')` }}
                                    ></div>
                                </div>
                                <div>
                                    <p className="font-display font-bold text-navy-deep">
                                        {testimonial.TenKhachHang || t('reviews.anonymous')}
                                    </p>
                                    <div className="flex gap-0.5 mt-1">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <span key={star} className={`material-symbols-outlined text-sm ${star <= testimonial.SoSao ? 'text-primary' : 'text-primary/20'}`} style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="text-xs uppercase tracking-widest font-bold text-navy-deep/30 bg-navy-deep/5 px-3 py-1 rounded">
                                {testimonial.NgayDanhGia ? new Date(testimonial.NgayDanhGia).toLocaleDateString() : 'Recent'}
                            </div>
                        </div>

                        <p className="font-display italic text-lg text-navy-deep/80 leading-relaxed pl-4 border-l border-navy-deep/10 mb-6">
                            "{testimonial.BinhLuan}"
                        </p>

                        {/* NÚT LIKE & REPLY */}
                        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-navy-deep/5">
                            <button
                                onClick={() => handleLike(testimonial.DanhGiaID)}
                                className={`flex items-center gap-1.5 text-sm font-bold transition-colors cursor-pointer ${likedReviews[testimonial.DanhGiaID] || testimonial.DaLike ? 'text-red-500' : 'text-navy-deep/40 hover:text-red-500'}`}
                            >
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: (likedReviews[testimonial.DanhGiaID] || testimonial.DaLike) ? "'FILL' 1" : "'FILL' 0" }}>
                                    favorite
                                </span>
                                {testimonial.SoLuotThich || 0}
                            </button>

                            <button
                                onClick={() => setReplyingTo(replyingTo === testimonial.DanhGiaID ? null : testimonial.DanhGiaID)}
                                className="flex items-center gap-1.5 text-sm font-bold text-navy-deep/40 hover:text-primary transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-lg">chat_bubble</span>
                                {language === 'vi' ? 'Trả lời' : 'Reply'}
                            </button>
                        </div>

                        {/* FORM TRẢ LỜI */}
                        {replyingTo === testimonial.DanhGiaID && (
                            <form onSubmit={(e) => handleReplySubmit(e, testimonial.DanhGiaID)} className="mt-4 flex gap-3 animate-fade-in">
                                <input
                                    type="text"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder={language === 'vi' ? "Viết câu trả lời của bạn..." : "Type your reply..."}
                                    className="flex-1 bg-white border border-navy-deep/10 rounded-full px-5 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                                <button type="submit" disabled={isSubmitting} className="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-navy-deep transition-colors disabled:opacity-50 cursor-pointer">
                                    {language === 'vi' ? 'Gửi' : 'Send'}
                                </button>
                            </form>
                        )}

                        {/* HIỂN THỊ CÁC CÂU TRẢ LỜI CŨ TỪ API */}
                        {testimonial.replies && testimonial.replies.length > 0 && (
                            <div className="mt-6 ml-8 pl-4 border-l-2 border-primary/20 space-y-4">
                                {testimonial.replies.map((reply, idx) => (
                                    <div key={idx} className="bg-navy-deep/5 p-4 rounded-lg">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-sm text-navy-deep">{reply.TenNguoiTraLoi || t('navbar.guest')}</span>
                                            <span className="text-xs text-navy-deep/40">
                                                {reply.NgayTraLoi ? new Date(reply.NgayTraLoi).toLocaleDateString() : ''}
                                            </span>
                                        </div>
                                        <p className="text-sm text-navy-deep/80">{reply.NoiDung}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                ))
            )}
        </div>
    );
};

const Footer = () => {
    const { t } = useLanguage();
    return (
        <footer className="bg-navy-deep text-ivory py-16 px-6 border-t border-primary/20 mt-20">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                <p className="text-ivory/50 text-sm mb-6 italic">
                    {t('footer.about')}
                </p>
                <p className="text-ivory/30 text-xs tracking-widest opacity-40">{t('footer.copyright')}</p>
            </div>
        </footer>
    );
};

export default function ReviewPage() {
    const [reviews, setReviews] = useState([]);
    const { showToast, ToastComponent } = useToast();

    const fetchReviews = async () => {
        try {
            let currentUserId = null;
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                currentUserId = user.KhachHangID || user.id;
            }

            const response = await axios.get(`${API_URL}/review`, {
                params: { KhachHangID: currentUserId }
            });

            const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
            setReviews(data);
        } catch (error) {
            console.error("Lỗi lấy dữ liệu:", error);
            setReviews([]);
        }
    };

    useEffect(() => {
        let isCancelled = false;

        let currentUserId = null;
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                currentUserId = user.KhachHangID || user.id;
            }
        } catch (err) {
            console.error(err);
        }

        axios.get(`${API_URL}/review`, {
            params: { KhachHangID: currentUserId }
        })
        .then((response) => {
            if (!isCancelled) {
                const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
                setReviews(data);
            }
        })
        .catch((error) => {
            console.error("Lỗi lấy dữ liệu:", error);
            if (!isCancelled) {
                setReviews([]);
            }
        });

        return () => {
            isCancelled = true;
        };
    }, []);

    return (
        <div className="min-h-screen w-full flex-col selection:bg-primary/30 relative">
            <Header />
            <main className="flex-1">
                <Hero />
                <div className="max-w-5xl mx-auto px-6 mb-20">
                    <ReviewForm onReviewSuccess={fetchReviews} triggerToast={showToast} />
                    <Testimonials reviews={reviews} onRefresh={fetchReviews} triggerToast={showToast} />
                </div>
            </main>
            <Footer />

            <div className="fixed z-[9999]">
                <ToastComponent />
            </div>
        </div>
    );
}
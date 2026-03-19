import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const Header = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {

        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUserName(parsedUser.HoTen || parsedUser.name || 'Khách Hàng');
                setIsLoggedIn(true);
            } catch (error) {
                console.error("Lỗi đọc dữ liệu user:", error);
            }
        }
    }, []);
    return (
        <header className="sticky top-0 left-0 right-0 z-[990] flex items-center justify-between border-b border-primary/20 bg-background-light/80 backdrop-blur-md px-6 md:px-20 py-4">
            <div className="flex items-center gap-3">
                <a href="/" className="font-display text-xl font-bold tracking-widest text-navy-deep hover:text-primary transition-colors">
                    LA MAISON DTN
                </a>
            </div>

            <div className="flex items-center gap-4">
                {isLoggedIn ? (
                    <div onClick={() => navigate('/profile')} className="flex items-center gap-2 text-navy-deep/70 cursor-pointer hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-navy-deep/40">account_circle</span>
                        <span className="text-sm font-medium">{userName}</span>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className="text-xs uppercase tracking-widest font-bold text-whitecd f hover:text-primary transition-colors px-2 py-2"
                    >
                        Login
                    </button>
                )}
                <button onClick={() => navigate('/room-map')} className="bg-primary text-ivory px-6 py-2 text-xs uppercase tracking-widest font-bold hover:text-white transition-all rounded">
                    Book Stay
                </button>
            </div>
        </header>
    )

};


const Hero = () => (
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
            <h1 className="font-display text-5xl md:text-7xl text-ivory leading-tight mb-4 drop-shadow-lg">Guest Experiences</h1>
            <div className="h-[1px] w-24 bg-primary mx-auto"></div>
            <p className="mt-6 text-ivory/90 font-display italic text-lg md:text-xl tracking-wide">A chronicle of neoclassical elegance and refined stays.</p>
        </div>
    </section>
);

const ReviewForm = ({ onReviewSuccess }) => {
    const [rating, setRating] = useState(5);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content) return alert("Vui lòng viết vài dòng chia sẻ nhé!");
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            alert("Bạn cần đăng nhập để gửi đánh giá nhé!");
            navigate('/login')
            return;
        }
        const user = JSON.parse(storedUser);
        const currentUserId = user.KhachHangID || user.id;

        //test
        console.log("Dữ liệu chuẩn bị gửi đi:", {
            KhachHangID: currentUserId,
            SoSao: rating,
            BinhLuan: content
        });

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/review`, {
                KhachHangID: currentUserId,
                SoSao: rating,
                BinhLuan: content
            });


            //test
            console.log("Kết quả từ server:", response.data);

            alert("Cảm ơn bạn đã chia sẻ trải nghiệm!");
            setContent('');
            setRating(5);
            onReviewSuccess();
        } catch (error) {
            console.error("Lỗi gửi review:", error);
            alert("Lỗi: " + (error.response?.data?.message || "Không thể gửi đánh giá"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="marble-bg gold-border-gradient rounded-xl shadow-2xl p-8 md:p-12 mb-16 relative z-30 -mt-20 bg-white">
            <div className="text-center mb-10">
                <h2 className="font-display text-3xl text-navy-deep mb-2">Share Your Experience</h2>
                <p className="text-navy-deep/60 text-sm tracking-widest uppercase">We value your distinguished perspective</p>
            </div>
            {/* Đổi grid-cols thành flex để form đẹp hơn khi bỏ ô Email */}
            <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                <div className="flex flex-col items-center">
                    <span className="text-xs uppercase tracking-widest font-bold text-navy-deep/70 mb-4">Service Rating</span>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                className="group transition-all hover:scale-110 bg-white"
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
                        <span className="block text-xs uppercase tracking-widest font-bold text-navy-deep/70 mb-2">Review Content</span>
                        <textarea
                            className="w-full flex-1 min-h-[120px] bg-transparent border border-navy-deep/10 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary p-4 transition-all placeholder:text-navy-deep/30 font-display leading-relaxed outline-none resize-none"
                            placeholder="Detail your experience at our neoclassical estate..."
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
                        {loading ? 'Submitting...' : 'Submit Review'}
                    </button>
                </div>
            </form>
        </section>
    );
};
const Testimonials = ({ reviews }) => {

    const safeReviews = Array.isArray(reviews) ? reviews : [];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between mb-8">
                <h3 className="font-display text-2xl text-navy-deep">Past Testimonials</h3>
            </div>

            {safeReviews.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-navy-deep/10 rounded-xl">
                    <p className="text-navy-deep/40 italic">Chưa có đánh giá nào từ khách hàng.</p>
                </div>
            ) : (
                safeReviews.map((testimonial, idx) => (
                    <div key={idx} className="bg-ivory border-l-4 border-primary shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-8 rounded-r-xl">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-navy-deep/5 flex items-center justify-center border border-primary/20">
                                    <div
                                        className="w-full h-full rounded-full bg-cover bg-center transition-all duration-300"
                                        style={{ backgroundImage: `url('${testimonial.AnhDaiDien || "https://cafefcdn.com/zoom/600_315/203337114487263232/2022/3/3/photo1646280815645-1646280816151764748403.jpg"}')` }}
                                    ></div>
                                </div>
                                <div>

                                    <p className="font-display font-bold text-navy-deep">
                                        {testimonial.TenKhachHang || "Khách hàng ẩn danh"}
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
                        <p className="font-display italic text-lg text-navy-deep/80 leading-relaxed pl-4 border-l border-navy-deep/10">
                            "{testimonial.BinhLuan}"
                        </p>
                    </div>
                ))
            )}
        </div>
    );
};

const Footer = () => (
    <footer className="bg-navy-deep text-ivory text-primary py-16 px-6 border-t border-primary/20 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col items-center">

            <p className="text-ivory/50 text-sm mb-6 italic">
                Thank you for choosing La Maison DTN — where every stay is a timeless experience.
            </p>
            <p className="text-ivory/30 text-xs tracking-widest opacity-40">© 2024 LA MAISON DTN. ALL RIGHTS RESERVED.</p>
        </div>
    </footer>
);

export default function ReviewPage() {
    const [reviews, setReviews] = useState([]);

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`${API_URL}/review`);

            const data = Array.isArray(response.data) ? response.data : (response.data.data || []);
            setReviews(data);
        } catch (error) {
            console.error("Lỗi lấy dữ liệu:", error);
            setReviews([]);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    return (
        <div className=" min-h-screen w-full flex-col selection:bg-primary/30">
            <Header />
            <main className="flex-1">
                <Hero />
                <div className="max-w-5xl mx-auto px-6 mb-20">
                    <ReviewForm onReviewSuccess={fetchReviews} />
                    <Testimonials reviews={reviews} />
                </div>
            </main>
            <Footer />
        </div>
    );
}
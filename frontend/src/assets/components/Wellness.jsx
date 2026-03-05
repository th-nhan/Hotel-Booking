import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Menu,
    ArrowRight,
    Image as ImageIcon,
    Sparkles,
    Droplets,
    Crown,
    Building2,
    Waves,
    Leaf,
    MapPin,
    Clock,
    Phone,
    Calendar,
    ChevronLeft
} from 'lucide-react';

const Wellness = () => {
    const navigate = useNavigate();

    return (
        <div id='wellness' className="bg-[#fdfbf7] dark:bg-[#1a1814] font-sans text-slate-900 dark:text-slate-100 min-h-screen flex flex-col overflow-x-hidden selection:bg-[#d4af35]/30">
            <main className="flex-1 w-full max-w-[1440px] mx-auto">
                {/* Signature Experiences */}
                <section className="px-6 md:px-10  bg-[#fdfbf7] dark:bg-[#1a1814] relative">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <h3 className="text-[#d4af35] font-medium tracking-widest text-sm uppercase mb-2">Our Offerings</h3>
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white">Signature Experiences</h2>
                        </div>
                        <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1 mx-8 hidden md:block self-center"></div>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md text-sm md:text-base leading-relaxed">
                            Curated wellness journeys combining ancient healing traditions with modern luxury architecture.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Card 1 */}
                        <div className="group relative overflow-hidden rounded-xl bg-white dark:bg-[#221f18] border border-[#d4af35]/20 shadow-sm hover:shadow-xl hover:shadow-[#d4af35]/5 transition-all duration-500">
                            <div className="h-64 sm:h-80 overflow-hidden relative">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop')" }}
                                ></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80"></div>
                                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm p-2 rounded-full shadow-lg">
                                    <Sparkles className="w-5 h-5 text-[#d4af35]" />
                                </div>
                            </div>
                            <div className="p-8 relative">
                                <div className="absolute -top-6 right-8 bg-[#d4af35] text-[#1a1814] text-xs font-bold px-3 py-1 rounded shadow-md uppercase tracking-wider">Most Popular</div>
                                <h4 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-3 group-hover:text-[#d4af35] transition-colors">Himalayan Salt Therapy</h4>
                                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                                    Breathe deeply in our exclusive salt chamber. The textured stone walls and warm amber lighting create a purifying atmosphere designed to rejuvenate the respiratory system.
                                </p>
                                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6">
                                    <span className="text-sm font-medium text-slate-400">60 Mins • $180</span>
                                    <button className="text-[#d4af35] font-bold text-sm uppercase tracking-wide hover:underline decoration-2 underline-offset-4 flex items-center gap-1">
                                        Book This
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="group relative overflow-hidden rounded-xl bg-white dark:bg-[#221f18] border border-[#d4af35]/20 shadow-sm hover:shadow-xl hover:shadow-[#d4af35]/5 transition-all duration-500">
                            <div className="h-64 sm:h-80 overflow-hidden relative">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                    style={{ backgroundImage: "url('https://hanteco.vn/hinhanh/tintuc/thiet-ke-khu-xong-hoi-spa-chuyen-nghiep-hop-ly-8.jpg')" }}
                                ></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80"></div>
                                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm p-2 rounded-full shadow-lg">
                                    <Droplets className="w-5 h-5 text-[#d4af35]" />
                                </div>
                            </div>
                            <div className="p-8 relative">
                                <h4 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-3 group-hover:text-[#d4af35] transition-colors">Ethereal Steam Room</h4>
                                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                                    Relax your muscles and mind in our steam room featuring soft, ethereal lighting and Italian marble surfaces. A true escape for detoxification and clarity.
                                </p>
                                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6">
                                    <span className="text-sm font-medium text-slate-400">45 Mins • $120</span>
                                    <button className="text-[#d4af35] font-bold text-sm uppercase tracking-wide hover:underline decoration-2 underline-offset-4 flex items-center gap-1">
                                        Book This
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Card 3 (Full Width) */}
                        <div className="group relative overflow-hidden rounded-xl bg-white dark:bg-[#221f18] border border-[#d4af35]/20 shadow-sm hover:shadow-xl hover:shadow-[#d4af35]/5 transition-all duration-500 lg:col-span-2 flex flex-col md:flex-row">
                            <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden relative">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=1000&auto=format&fit=crop')" }}
                                ></div>
                            </div>
                            <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-3">
                                    <Crown className="w-4 h-4 text-[#d4af35]" />
                                    <span className="text-[#d4af35] text-xs font-bold uppercase tracking-widest">Premium Package</span>
                                </div>
                                <h4 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-3 group-hover:text-[#d4af35] transition-colors">The Royal Awakening</h4>
                                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                                    Our signature full-day package combining the Salt Therapy, Steam Room access, and a 90-minute deep tissue massage. Includes a light organic lunch.
                                </p>
                                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6 mt-auto">
                                    <span className="text-sm font-medium text-slate-400">4 Hours • $450</span>
                                    <button className="text-[#d4af35] font-bold text-sm uppercase tracking-wide hover:underline decoration-2 underline-offset-4 flex items-center gap-1">
                                        Book Experience
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Minimalist Feature Section */}
                <section className="py-24 px-6 md:px-10  bg-white dark:bg-[#15130f] border-y border-[#d4af35]/10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-[#d4af35]/10 flex items-center justify-center text-[#d4af35] mb-2">
                                <Building2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">Architectural Harmony</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
                                Spaces designed with Italian marble and hand-carved moldings to elevate the spirit through beauty.
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-[#d4af35]/10 flex items-center justify-center text-[#d4af35] mb-2">
                                <Waves className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">Hydrotherapy</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
                                State-of-the-art water circuits designed to invigorate circulation and calm the nervous system.
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-[#d4af35]/10 flex items-center justify-center text-[#d4af35] mb-2">
                                <Leaf className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">Organic Products</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
                                We use only premium, organic oils and scrubs, sourced sustainably for your wellbeing.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Sticky Booking Bar */}
            <div className="sticky bottom-0 z-40 w-full bg-white dark:bg-[#1a1814] border-t border-[#d4af35]/20 shadow-[0_-5px_20px_rgba(0,0,0,0.3)] py-4 px-6 md:px-10 lg:px-40">
                <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="hidden md:flex flex-col">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">Ready to relax?</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">Book your appointment today and receive a complimentary herbal tea.</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                        <div className="relative w-full sm:w-64">
                            <select className="w-full bg-[#fdfbf7] dark:bg-[#221f18] border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg py-2.5 px-3 focus:ring-[#d4af35] focus:border-[#d4af35] outline-none cursor-pointer">
                                <option>Select Treatment</option>
                                <option>Himalayan Salt Therapy</option>
                                <option>Ethereal Steam Room</option>
                                <option>Deep Tissue Massage</option>
                                <option>The Royal Awakening</option>
                            </select>
                        </div>
                        <button className="w-full sm:w-auto bg-[#d4af35] hover:bg-[#bfa030] text-[#1a1814] font-bold text-sm px-6 py-2.5 rounded-lg shadow-md shadow-[#d4af35]/20 whitespace-nowrap transition-colors flex items-center justify-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Schedule a Treatment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wellness;
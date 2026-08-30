import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Sparkles,
    Droplets,
    Crown,
    Building2,
    Waves,
    Leaf,
    Calendar,
    ArrowRight,
    Compass,
    ChevronDown,
    Check
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Wellness = () => {
    const navigate = useNavigate();
    const { language, t } = useLanguage();
    const [selectedTreatment, setSelectedTreatment] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const treatmentOptions = [
        {
            value: '',
            label: t('wellness.selectTreatment'),
            desc: language === 'vi' ? 'Xem & Đặt tất cả dịch vụ' : 'Browse all luxury rituals',
            icon: Sparkles
        },
        {
            value: t('wellness.saltTherapyTitle'),
            label: t('wellness.saltTherapyTitle'),
            desc: t('wellness.saltTherapyTimePrice'),
            icon: Sparkles
        },
        {
            value: t('wellness.steamRoomTitle'),
            label: t('wellness.steamRoomTitle'),
            desc: t('wellness.steamRoomTimePrice'),
            icon: Droplets
        },
        {
            value: t('wellness.royalTitle'),
            label: t('wellness.royalTitle'),
            desc: t('wellness.royalTimePrice'),
            icon: Crown
        }
    ];

    const currentSelected = treatmentOptions.find(opt => opt.value === selectedTreatment) || treatmentOptions[0];
    const SelectedIcon = currentSelected.icon;

    const handleSchedule = () => {
        if (selectedTreatment) {
            navigate(`/experiences/sanctuary?package=${encodeURIComponent(selectedTreatment)}&reserve=true`);
        } else {
            navigate('/experiences/sanctuary?reserve=true');
        }
    };

    return (
        <div id='wellness' className="bg-[#fdfbf7] dark:bg-[#15130e] font-sans text-slate-900 dark:text-slate-100 min-h-screen flex flex-col overflow-x-hidden selection:bg-[#d4af35]/30">
            <main className="flex-1 w-full max-w-[1440px] mx-auto">
                {/* Signature Experiences */}
                <section className="px-6 md:px-10 bg-[#fdfbf7] dark:bg-[#15130e] relative py-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                        <div>
                            <h3 className="text-[#d4af35] font-medium tracking-widest text-sm uppercase mb-2">
                                {t('wellness.offerings')}
                            </h3>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white">
                                {t('wellness.title')}
                            </h2>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <p className="text-slate-500 dark:text-slate-400 max-w-md text-sm md:text-base leading-relaxed">
                                {t('wellness.subtitle')}
                            </p>
                            <button
                                onClick={() => navigate('/experiences/sanctuary')}
                                className="shrink-0 px-4 py-2.5 rounded-xl border border-[#d4af35]/40 text-[#d4af35] hover:bg-[#d4af35] hover:text-[#1a1814] text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm"
                            >
                                <Compass className="w-4 h-4" />
                                <span>{t('wellness.viewAllSpa')}</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Card 1: Himalayan Salt Therapy */}
                        <div 
                            onClick={() => navigate('/experiences/sanctuary?package=salt-therapy')}
                            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-[#201d16] border border-[#d4af35]/20 shadow-sm hover:shadow-2xl hover:shadow-[#d4af35]/10 hover:-translate-y-1.5 transition-all duration-500 cursor-pointer flex flex-col justify-between"
                        >
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
                            <div className="p-8 relative flex-1 flex flex-col justify-between">
                                <div className="absolute -top-6 right-8 bg-[#d4af35] text-[#1a1814] text-xs font-bold px-3 py-1 rounded shadow-md uppercase tracking-wider">
                                    {t('wellness.mostPopular')}
                                </div>
                                <div>
                                    <h4 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-3 group-hover:text-[#d4af35] transition-colors">
                                        {t('wellness.saltTherapyTitle')}
                                    </h4>
                                    <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed text-sm font-light">
                                        {t('wellness.saltTherapyDesc')}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6">
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        {t('wellness.saltTherapyTimePrice')}
                                    </span>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate('/experiences/sanctuary?package=salt-therapy&reserve=true');
                                        }}
                                        className="text-[#d4af35] font-bold text-sm uppercase tracking-wide hover:underline decoration-2 underline-offset-4 flex items-center gap-1 cursor-pointer"
                                    >
                                        {t('wellness.bookThis')}
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Ethereal Steam Room */}
                        <div 
                            onClick={() => navigate('/experiences/sanctuary?package=steam-room')}
                            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-[#201d16] border border-[#d4af35]/20 shadow-sm hover:shadow-2xl hover:shadow-[#d4af35]/10 hover:-translate-y-1.5 transition-all duration-500 cursor-pointer flex flex-col justify-between"
                        >
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
                            <div className="p-8 relative flex-1 flex flex-col justify-between">
                                <div>
                                    <h4 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-3 group-hover:text-[#d4af35] transition-colors">
                                        {t('wellness.steamRoomTitle')}
                                    </h4>
                                    <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed text-sm font-light">
                                        {t('wellness.steamRoomDesc')}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6">
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        {t('wellness.steamRoomTimePrice')}
                                    </span>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate('/experiences/sanctuary?package=steam-room&reserve=true');
                                        }}
                                        className="text-[#d4af35] font-bold text-sm uppercase tracking-wide hover:underline decoration-2 underline-offset-4 flex items-center gap-1 cursor-pointer"
                                    >
                                        {t('wellness.bookThis')}
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Card 3: The Royal Awakening (Full Width) */}
                        <div 
                            onClick={() => navigate('/experiences/sanctuary?package=royal-awakening')}
                            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-[#201d16] border border-[#d4af35]/20 shadow-sm hover:shadow-2xl hover:shadow-[#d4af35]/10 hover:-translate-y-1.5 transition-all duration-500 lg:col-span-2 flex flex-col md:flex-row cursor-pointer"
                        >
                            <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden relative min-h-[300px]">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=1000&auto=format&fit=crop')" }}
                                ></div>
                                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>
                            </div>
                            <div className="w-full md:w-1/2 p-8 sm:p-10 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Crown className="w-4 h-4 text-[#d4af35]" />
                                        <span className="text-[#d4af35] text-xs font-bold uppercase tracking-widest">
                                            {t('wellness.premiumPackage')}
                                        </span>
                                    </div>
                                    <h4 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white mb-3 group-hover:text-[#d4af35] transition-colors">
                                        {t('wellness.royalTitle')}
                                    </h4>
                                    <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed text-sm font-light">
                                        {t('wellness.royalDesc')}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6 mt-auto">
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        {t('wellness.royalTimePrice')}
                                    </span>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate('/experiences/sanctuary?package=royal-awakening&reserve=true');
                                        }}
                                        className="text-[#d4af35] font-bold text-sm uppercase tracking-wide hover:underline decoration-2 underline-offset-4 flex items-center gap-1 cursor-pointer"
                                    >
                                        {t('wellness.bookExperience')}
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Minimalist Feature Section */}
                <section className="py-20 px-6 md:px-10 bg-white dark:bg-[#1a1814] border-y border-[#d4af35]/15">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div 
                            onClick={() => navigate('/experiences/sanctuary')}
                            className="group flex flex-col items-center gap-4 cursor-pointer p-4 rounded-xl hover:bg-[#d4af35]/5 transition-colors"
                        >
                            <div className="w-16 h-16 rounded-full bg-[#d4af35]/10 group-hover:bg-[#d4af35] group-hover:text-[#1a1814] transition-all duration-300 flex items-center justify-center text-[#d4af35] mb-2">
                                <Building2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white group-hover:text-[#d4af35] transition-colors">
                                {t('wellness.archTitle')}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs font-light">
                                {t('wellness.archDesc')}
                            </p>
                        </div>
                        <div 
                            onClick={() => navigate('/experiences/sanctuary')}
                            className="group flex flex-col items-center gap-4 cursor-pointer p-4 rounded-xl hover:bg-[#d4af35]/5 transition-colors"
                        >
                            <div className="w-16 h-16 rounded-full bg-[#d4af35]/10 group-hover:bg-[#d4af35] group-hover:text-[#1a1814] transition-all duration-300 flex items-center justify-center text-[#d4af35] mb-2">
                                <Waves className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white group-hover:text-[#d4af35] transition-colors">
                                {t('wellness.hydroTitle')}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs font-light">
                                {t('wellness.hydroDesc')}
                            </p>
                        </div>
                        <div 
                            onClick={() => navigate('/experiences/sanctuary')}
                            className="group flex flex-col items-center gap-4 cursor-pointer p-4 rounded-xl hover:bg-[#d4af35]/5 transition-colors"
                        >
                            <div className="w-16 h-16 rounded-full bg-[#d4af35]/10 group-hover:bg-[#d4af35] group-hover:text-[#1a1814] transition-all duration-300 flex items-center justify-center text-[#d4af35] mb-2">
                                <Leaf className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white group-hover:text-[#d4af35] transition-colors">
                                {t('wellness.organicTitle')}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs font-light">
                                {t('wellness.organicDesc')}
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Sticky Booking Bar */}
            <div className="sticky bottom-0 z-40 w-full bg-white dark:bg-[#1a1814] border-t border-[#d4af35]/20 shadow-[0_-5px_20px_rgba(0,0,0,0.15)] py-4 px-6 md:px-10 lg:px-40 backdrop-blur-md bg-white/95 dark:bg-[#1a1814]/95">
                <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="hidden md:flex flex-col">
                        <span className="text-sm font-bold text-slate-900 dark:text-white font-serif">
                            {t('wellness.readyToRelax')}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                            {t('wellness.complimentaryTea')}
                        </span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                        <div className="relative w-full sm:w-80" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full bg-[#fdfbf7] dark:bg-[#201d16] border border-[#d4af35]/40 hover:border-[#d4af35] focus:border-[#d4af35] text-slate-800 dark:text-slate-100 text-sm rounded-xl py-2.5 px-3.5 shadow-sm transition-all duration-200 flex items-center justify-between gap-2.5 cursor-pointer outline-none focus:ring-2 focus:ring-[#d4af35]/20 group"
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <span className="p-1.5 rounded-lg bg-[#d4af35]/10 text-[#d4af35] group-hover:scale-105 transition-transform shrink-0">
                                        <SelectedIcon className="w-4 h-4" />
                                    </span>
                                    <span className={`truncate text-sm font-medium ${!selectedTreatment ? 'text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                                        {currentSelected.label}
                                    </span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-[#d4af35] shrink-0 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Custom Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white/95 dark:bg-[#1f1c16]/95 border border-[#d4af35]/30 rounded-2xl shadow-2xl backdrop-blur-xl z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-3 py-1.5 text-[10px] font-bold tracking-widest text-[#d4af35] uppercase border-b border-[#d4af35]/15">
                                        {language === 'vi' ? 'Liệu trình đặc quyền' : 'Signature Rituals'}
                                    </div>
                                    <div className="max-h-64 overflow-y-auto space-y-1 py-1 custom-scrollbar">
                                        {treatmentOptions.map((opt) => {
                                            const isSelected = selectedTreatment === opt.value;
                                            const OptIcon = opt.icon;
                                            return (
                                                <button
                                                    key={opt.label}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedTreatment(opt.value);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer ${
                                                        isSelected
                                                            ? 'bg-[#d4af35]/15 text-[#d4af35] font-semibold'
                                                            : 'hover:bg-[#d4af35]/10 text-slate-700 dark:text-slate-200 hover:text-[#d4af35]'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3 min-w-0 pr-2">
                                                        <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? 'bg-[#d4af35] text-[#1a1814]' : 'bg-[#d4af35]/10 text-[#d4af35]'}`}>
                                                            <OptIcon className="w-4 h-4" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="text-xs sm:text-sm font-medium truncate">
                                                                {opt.label}
                                                            </div>
                                                            {opt.desc && (
                                                                <div className="text-[11px] text-slate-400 dark:text-slate-500 font-light truncate">
                                                                    {opt.desc}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {isSelected && (
                                                        <Check className="w-4 h-4 text-[#d4af35] shrink-0" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={handleSchedule}
                            className="w-full sm:w-auto bg-[#d4af35] hover:bg-[#bfa030] text-[#1a1814] font-bold text-sm px-6 py-2.5 rounded-lg shadow-md shadow-[#d4af35]/20 whitespace-nowrap transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                        >
                            <Calendar className="w-4 h-4" />
                            {t('wellness.scheduleTreatment')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wellness;
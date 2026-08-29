import React, { useState } from 'react';
import axios from 'axios';
import { Bot, FileDown, Loader2 } from 'lucide-react';

// Nhận timeRange từ component cha truyền xuống
const AIAnalyzer = ({ timeRange }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleAnalyzeAndDownload = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/reviews/analyze-export`, {
                time_range: timeRange 
            }, {
                responseType: 'blob', 
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Bao_Cao_AI_Danh_Gia_${Date.now()}.xlsx`); 
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
            setIsLoading(false);
        }
    };

    return (
        <div className="px-6 py-4 bg-white border-b border-[#0B1C2D]/10 flex flex-col sm:flex-row justify-between items-center gap-4 transition-all">
            <div className="flex items-center gap-3">
                <div className="bg-[#0B1C2D]/5 p-2.5 rounded-xl border border-[#0B1C2D]/10">
                    <Bot className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                    <h4 className="font-bold text-[#0B1C2D] text-sm font-serif">Trợ lý AI Phân tích Review</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Tự động phân loại cảm xúc và tóm tắt đánh giá ra file Excel</p>
                </div>
            </div>
            
            <button 
                onClick={handleAnalyzeAndDownload} 
                disabled={isLoading}
                className={`
                    flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 whitespace-nowrap
                    ${isLoading 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                        : 'bg-[#0B1C2D] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0B1C2D] border border-transparent hover:border-[#0B1C2D] shadow-md'
                    }
                `}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang phân tích...</span>
                    </>
                ) : (
                    <>
                        <FileDown className="w-4 h-4" />
                        <span>Xuất Báo Cáo</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default AIAnalyzer;
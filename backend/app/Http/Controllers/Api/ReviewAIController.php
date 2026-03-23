<?php

namespace App\Http\Controllers\Api;



use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Exports\ReviewAIExport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReviewAIController extends Controller
{
    public function analyzeAndExport(Request $request)
    {
        config(['excel.temporary_files.local_path' => '/tmp']);
        // 1. NHẬN YÊU CẦU THỜI GIAN TỪ REACTJS (Mặc định là '1' nếu không có)
        $timeRange = $request->input('time_range', '1');

        // 2. KHỞI TẠO CÂU LỆNH TRUY VẤN CƠ BẢN
        $query = DB::table('danh_gia')
            ->whereNotNull('BinhLuan')
            ->where('BinhLuan', '!=', '');

        // 3. ÁP DỤNG BỘ LỌC THỜI GIAN (DÙNG CARBON)
        if ($timeRange === '1') {
            // Lấy từ 1 tháng trước đến hiện tại
            $query->where('NgayDanhGia', '>=', Carbon::now()->subMonth());
        } elseif ($timeRange === '3') {
            // Lấy từ 3 tháng trước đến hiện tại
            $query->where('NgayDanhGia', '>=', Carbon::now()->subMonths(3));
        }
        // Nếu $timeRange là 'all' thì không thêm lệnh where nào cả (Lấy hết)

        // 4. LẤY DỮ LIỆU CUỐI CÙNG
        $dbReviews = $query->orderBy('NgayDanhGia', 'desc')
            ->limit(50)
            ->get();

        if ($dbReviews->isEmpty()) {
            return response()->json(['error' => 'Không có đánh giá nào có nội dung chữ để phân tích trong khoảng thời gian này.'], 404);
        }

        // 5. MAP DỮ LIỆU (Giữ nguyên y hệt như cũ)
        $reviews = $dbReviews->map(function ($item) {
            return [
                'id'      => $item->DanhGiaID,
                'content' => $item->BinhLuan
            ];
        })->toArray();
        try {
            // 3. GỌI API MICROSERVICE PYTHON
            /** @var \Illuminate\Http\Client\Response $response */
            $response = Http::timeout(60)->post('https://hotel-ai-analyzer.vercel.app/analyze', [
                'reviews' => $reviews
            ]);

            // $response = Http::timeout(60)->post('http://host.docker.internal:8000/analyze', [
            //     'reviews' => $reviews
            // ]);

            // 4. XỬ LÝ JSON TỪ AI VÀ XUẤT RA EXCEL
            if ($response->status() === 200) {
                $aiResults = $response->json();
                
                $excelData = [];
                
                // 1. IN DANH SÁCH CHI TIẾT CÁC ĐÁNH GIÁ
                foreach ($aiResults['reviews_analysis'] as $item) {
                    $excelData[] = [
                        'id'            => $item['id'],
                        'sentiment'     => $item['sentiment'] ?? 'N/A',
                        'tags'          => isset($item['tags']) ? (is_array($item['tags']) ? implode(', ', $item['tags']) : $item['tags']) : '', 
                        'summary'       => $item['summary'] ?? '',
                        'action_needed' => $item['action_needed'] ?? '',
                    ];
                }

                // 2. THÊM DÒNG TRỐNG ĐỂ CÁCH BIỆT
                $excelData[] = [
                    'id' => '', 'sentiment' => '', 'tags' => '', 'summary' => '', 'action_needed' => ''
                ];

                // 3. THÊM DÒNG TIÊU ĐỀ TỔNG KẾT
                $excelData[] = [
                    'id'            => '', 
                    'sentiment'     => '', 
                    'tags'          => '★★★', 
                    'summary'       => 'BÁO CÁO TỔNG QUAN CHIẾN LƯỢC TỪ AI', 
                    'action_needed' => '★★★'
                ];

                // 4. IN CÁC NỘI DUNG TỔNG KẾT CỦA GIÁM ĐỐC
                $summary = $aiResults['overall_summary'];

                // Dòng: Các vấn đề chính
                $excelData[] = [
                    'id' => '', 'sentiment' => '', 
                    'tags' => 'Các vấn đề chính (Lặp lại nhiều)', 
                    'summary' => isset($summary['main_issues']) ? (is_array($summary['main_issues']) ? implode("\n- ", $summary['main_issues']) : $summary['main_issues']) : '',
                    'action_needed' => ''
                ];

                // Dòng: Hành động ưu tiên
                $excelData[] = [
                    'id' => '', 'sentiment' => '', 
                    'tags' => 'Hành động ƯU TIÊN', 
                    'summary' => isset($summary['priority_actions']) ? (is_array($summary['priority_actions']) ? implode("\n- ", $summary['priority_actions']) : $summary['priority_actions']) : '',
                    'action_needed' => ''
                ];

                // Dòng: Điểm mạnh
                $excelData[] = [
                    'id' => '', 'sentiment' => '', 
                    'tags' => 'Điểm mạnh cần duy trì', 
                    'summary' => isset($summary['positive_points']) ? (is_array($summary['positive_points']) ? implode("\n- ", $summary['positive_points']) : $summary['positive_points']) : '',
                    'action_needed' => ''
                ];

                // Dòng: Nhận định tổng quan
                $excelData[] = [
                    'id' => '', 'sentiment' => '', 
                    'tags' => 'Nhận định của Giám đốc (AI)', 
                    'summary' => $summary['general_recommendation'] ?? '',
                    'action_needed' => ''
                ];

                // 5. TẠO VÀ TRẢ VỀ FILE EXCEL
                $fileName = 'Bao_Cao_AI_Danh_Gia_' . date('Y_m_d_H_i_s') . '.xlsx';
                return Excel::download(new ReviewAIExport($excelData), $fileName);
            }

            return response()->json(['error' => 'Python API báo lỗi: ' . $response->body()], $response->status());
        } catch (\Exception $e) {
            return response()->json(['error' => 'Không thể kết nối với AI Server: ' . $e->getMessage()], 500);
        }
    }
}

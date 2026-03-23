<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class ReviewAIExport implements FromArray, WithHeadings, ShouldAutoSize
{
    protected $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    public function array(): array
    {
        return $this->data;
    }

    // Tiêu đề các cột trong file Excel
    public function headings(): array
    {
        return [
            'ID Đánh giá',
            'Cảm xúc',
            'Chủ đề (Tags)',
            'Tóm tắt ý chính',
            'Đề xuất xử lý'
        ];
    }
}
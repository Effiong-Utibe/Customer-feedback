<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class FeedbackReportExport implements FromCollection, WithHeadings, WithMapping
{
    public function __construct(private readonly Collection $feedback) {}

    public function collection(): Collection
    {
        return $this->feedback;
    }

    public function headings(): array
    {
        return ['ID', 'Customer', 'Category', 'Subject', 'Status', 'Priority', 'Rating', 'Assigned to', 'Submitted at', 'Resolved at'];
    }

    public function map($feedback): array
    {
        return [
            $feedback->id,
            $feedback->customer?->name,
            $feedback->category?->name,
            $feedback->subject,
            $feedback->status->value,
            $feedback->priority->value,
            $feedback->rating,
            $feedback->assignee?->name,
            $feedback->created_at?->toDateTimeString(),
            $feedback->resolved_at?->toDateTimeString(),
        ];
    }
}

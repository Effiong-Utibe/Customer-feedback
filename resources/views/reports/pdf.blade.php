<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <style>
        body {
            font-family:
                DejaVu Sans,
                sans-serif;
            color: #1e293b;
            font-size: 10px;
        }
        h1 {
            color: #1e40af;
            font-size: 20px;
            margin-bottom: 4px;
        }
        p {
            color: #64748b;
            margin-top: 0;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin-top: 18px;
        }
        th {
            background: #eff6ff;
            color: #1e3a8a;
            text-align: left;
        }
        th,
        td {
            border: 1px solid #dbe3ef;
            padding: 7px;
            vertical-align: top;
        }
        tr:nth-child(even) td {
            background: #f8fafc;
        }
    </style>
</head>
<body>
    <h1>UI Ventures Feedback Report</h1>
    <p>Generated {{ now()->format('d M Y, H:i') }} · {{ $rows->count() }} records</p>
    <table>
        <thead>
            <tr>
                <th>Subject</th>
                <th>Customer</th>
                <th>Category</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Rating</th>
                <th>Submitted</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($rows as $feedback)
                <tr>
                    <td>{{ $feedback->subject }}</td>
                    <td>{{ $feedback->customer?->name ?? '—' }}</td>
                    <td>{{ $feedback->category?->name ?? '—' }}</td>
                    <td>{{ $feedback->status->value }}</td>
                    <td>{{ $feedback->priority->value }}</td>
                    <td>{{ $feedback->rating ?? '—' }}</td>
                    <td>{{ $feedback->created_at?->format('d M Y') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>

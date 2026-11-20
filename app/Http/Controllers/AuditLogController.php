<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()->can('audit.view'), 403);

        return Inertia::render('admin/audit-logs/index', [
            'logs' => ActivityLog::with('actor:id,name')->latest()->paginate(30)->withQueryString(),
        ]);
    }
}

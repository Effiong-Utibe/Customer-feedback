import { Link } from '@inertiajs/react';
import type { FeedbackItem, RoleName, SharedProps, SurveySummary } from '@/types';
import { StatusBadge } from '@/components/common/status-badge';

export interface DashboardProps extends SharedProps {
    role: RoleName;
    metrics: Record<string, number>;
    feedbackTrend?: Array<{ day: string; total: number }>;
    recentActivity?: Array<{
        id: string;
        action: string;
        description?: string | null;
        created_at: string;
        actor?: { name: string } | null;
    }>;
    recentFeedback?: Array<FeedbackItem & { customer?: { name: string } }>;
    availableSurveys?: SurveySummary[];
    notifications?: Array<{
        id: string;
        data: { message?: string; title?: string };
        created_at: string;
    }>;
}

export const dateLabel = (value: string) =>
    new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

export function FeedbackList({
    items,
    showCustomer = false,
}: {
    items: Array<FeedbackItem & { customer?: { name: string } }>;
    showCustomer?: boolean;
}) {
    return (
        <div className="divide-y divide-slate-100">
            {items.map((item) => (
                <Link
                    href={`/feedback/${item.id}`}
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
                >
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900 hover:text-blue-700">
                            {item.subject}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                            {showCustomer ? `${item.customer?.name ?? 'Customer'} · ` : ''}
                            {item.category?.name ?? 'Uncategorized'} · {dateLabel(item.created_at)}
                        </p>
                    </div>
                    <StatusBadge value={item.status} />
                </Link>
            ))}
        </div>
    );
}

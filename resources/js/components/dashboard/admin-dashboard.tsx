import { Link } from '@inertiajs/react';
import {
    CheckCircle2,
    ClipboardCheck,
    ClipboardList,
    MessageSquareText,
    Star,
    Users,
    UsersRound,
} from 'lucide-react';
import { StatCard } from '@/components/common/stat-card';
import { AppLayout } from '@/layouts/app-layout';
import { FeedbackTrend, RecentActivity } from './widgets';
import type { DashboardProps } from './types';

export function AdminDashboard({
    metrics,
    feedbackTrend = [],
    recentActivity = [],
}: DashboardProps) {
    return (
        <AppLayout
            title="Overview"
            description="A live view of customer feedback, survey participation, and service health across UI Ventures."
        >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="Customers"
                    value={metrics.customers ?? 0}
                    note="Active customer accounts"
                    icon={UsersRound}
                />
                <StatCard
                    label="Staff members"
                    value={metrics.staff ?? 0}
                    note="Provisioned staff accounts"
                    icon={Users}
                    tone="violet"
                />
                <StatCard
                    label="Feedback received"
                    value={metrics.feedback ?? 0}
                    note={String(metrics.pendingFeedback ?? 0) + ' awaiting resolution'}
                    icon={MessageSquareText}
                    tone="amber"
                />
                <StatCard
                    label="Resolved feedback"
                    value={metrics.resolvedFeedback ?? 0}
                    note="Closed or resolved"
                    icon={CheckCircle2}
                    tone="green"
                />
                <StatCard
                    label="Surveys"
                    value={metrics.surveys ?? 0}
                    note={String(metrics.activeSurveys ?? 0) + ' currently open'}
                    icon={ClipboardList}
                />
                <StatCard
                    label="Survey responses"
                    value={metrics.surveyResponses ?? 0}
                    note="Submitted responses"
                    icon={ClipboardCheck}
                    tone="violet"
                />
                <StatCard
                    label="Average rating"
                    value={
                        metrics.averageRating
                            ? String(metrics.averageRating.toFixed(1)) + ' / 5'
                            : '—'
                    }
                    note="From customer feedback"
                    icon={Star}
                    tone="amber"
                />
                <StatCard
                    label="Pending feedback"
                    value={metrics.pendingFeedback ?? 0}
                    note="Needs staff attention"
                    icon={MessageSquareText}
                    tone="blue"
                />
            </div>
            <div className="mt-6 grid gap-5 xl:grid-cols-[1.6fr_1fr]">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h2 className="font-semibold text-slate-900">Feedback activity</h2>
                            <p className="mt-1 text-xs text-slate-500">
                                Daily submissions over the past week
                            </p>
                        </div>
                        <span className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700">
                            7 days
                        </span>
                    </div>
                    <div className="mt-5">
                        <FeedbackTrend data={feedbackTrend} />
                    </div>
                </section>
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-semibold text-slate-900">Recent activity</h2>
                            <p className="mt-1 text-xs text-slate-500">
                                Latest recorded system events
                            </p>
                        </div>
                        <Link
                            href="/admin/audit-logs"
                            className="text-xs font-semibold text-blue-700 hover:text-blue-900"
                        >
                            View all
                        </Link>
                    </div>
                    <RecentActivity items={recentActivity} />
                </section>
            </div>
        </AppLayout>
    );
}

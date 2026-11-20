import { Link } from '@inertiajs/react';
import { ArrowRight, CheckCircle2, ClipboardCheck, MessageSquareText } from 'lucide-react';
import { EmptyState } from '@/components/common/empty-state';
import { StatCard } from '@/components/common/stat-card';
import { AppLayout } from '@/layouts/app-layout';
import { FeedbackList, type DashboardProps } from './shared';

type StaffDashboardProps = Pick<DashboardProps, 'metrics' | 'recentFeedback'>;

export function StaffDashboard({ metrics, recentFeedback = [] }: StaffDashboardProps) {
    return (
        <AppLayout
            title="Your work"
            description="Keep assigned feedback moving and follow up with customers."
        >
            <div className="grid gap-4 sm:grid-cols-3">
                <StatCard
                    label="Assigned feedback"
                    value={metrics.assignedFeedback ?? 0}
                    note="All items assigned to you"
                    icon={MessageSquareText}
                />
                <StatCard
                    label="Pending tasks"
                    value={metrics.pendingTasks ?? 0}
                    note="Open items needing action"
                    icon={ClipboardCheck}
                    tone="amber"
                />
                <StatCard
                    label="Resolved"
                    value={metrics.resolvedFeedback ?? 0}
                    note="Completed assignments"
                    icon={CheckCircle2}
                    tone="green"
                />
            </div>
            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-slate-900">Recent assignments</h2>
                        <p className="mt-1 text-xs text-slate-500">
                            Feedback that needs your attention
                        </p>
                    </div>
                    <Link
                        href="/feedback"
                        className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700"
                    >
                        All assigned <ArrowRight className="size-4" />
                    </Link>
                </div>
                {recentFeedback.length ? (
                    <FeedbackList items={recentFeedback} showCustomer />
                ) : (
                    <EmptyState
                        icon={ClipboardCheck}
                        title="You are all caught up"
                        description="New items assigned to you will appear here."
                    />
                )}
            </section>
        </AppLayout>
    );
}

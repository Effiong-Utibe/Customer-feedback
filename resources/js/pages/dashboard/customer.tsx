import { Link } from '@inertiajs/react';
import { CheckCircle2, ClipboardCheck, ClipboardList, MessageSquareText, Star } from 'lucide-react';
import { EmptyState } from '@/components/common/empty-state';
import { StatCard } from '@/components/common/stat-card';
import { AppLayout } from '@/layouts/app-layout';
import { AvailableSurveyList, FeedbackList } from '@/components/dashboard/widgets';
import type { DashboardProps } from '@/components/dashboard/types';

type CustomerDashboardProps = Pick<
    DashboardProps,
    'metrics' | 'recentFeedback' | 'availableSurveys'
>;

export function CustomerDashboard({
    metrics,
    recentFeedback = [],
    availableSurveys = [],
}: CustomerDashboardProps) {
    return (
        <AppLayout
            title="Welcome back"
            description="Track your feedback and share your thoughts with UI Ventures."
        >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <StatCard
                    label="Feedback submitted"
                    value={metrics.submittedFeedback ?? 0}
                    icon={MessageSquareText}
                />
                <StatCard
                    label="Awaiting response"
                    value={metrics.pendingFeedback ?? 0}
                    icon={ClipboardCheck}
                    tone="amber"
                />
                <StatCard
                    label="Resolved"
                    value={metrics.resolvedFeedback ?? 0}
                    icon={CheckCircle2}
                    tone="green"
                />
                <StatCard
                    label="Open surveys"
                    value={metrics.availableSurveys ?? 0}
                    icon={ClipboardList}
                    tone="violet"
                />
                <StatCard
                    label="Surveys completed"
                    value={metrics.completedSurveys ?? 0}
                    icon={Star}
                />
            </div>
            <div className="mt-6 grid gap-5 xl:grid-cols-[1.25fr_1fr]">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="font-semibold text-slate-900">Your recent feedback</h2>
                            <p className="mt-1 text-xs text-slate-500">
                                Follow the latest status and response updates
                            </p>
                        </div>
                        <Link
                            href="/feedback/create"
                            className="text-sm font-semibold text-blue-700"
                        >
                            New feedback
                        </Link>
                    </div>
                    {recentFeedback.length ? (
                        <FeedbackList items={recentFeedback} />
                    ) : (
                        <EmptyState
                            icon={MessageSquareText}
                            title="Share your first feedback"
                            description="Tell us what is working well or where we can improve."
                            action={
                                <Link
                                    href="/feedback/create"
                                    className="text-sm font-semibold text-blue-700"
                                >
                                    Submit feedback
                                </Link>
                            }
                        />
                    )}
                </section>
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="font-semibold text-slate-900">Available surveys</h2>
                            <p className="mt-1 text-xs text-slate-500">
                                Your perspective helps shape better service
                            </p>
                        </div>
                        <Link href="/surveys" className="text-sm font-semibold text-blue-700">
                            All surveys
                        </Link>
                    </div>
                    <AvailableSurveyList surveys={availableSurveys} />
                </section>
            </div>
        </AppLayout>
    );
}

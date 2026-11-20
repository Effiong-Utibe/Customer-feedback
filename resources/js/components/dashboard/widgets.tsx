import { Link } from '@inertiajs/react';
import { ArrowRight, ClipboardCheck, MessageSquareText } from 'lucide-react';
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { EmptyState } from '@/components/common/empty-state';
import { StatusBadge } from '@/components/common/status-badge';
import type { FeedbackItem, SurveySummary } from '@/types';
import type { DashboardProps } from './types';

const dateLabel = (value: string) =>
    new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

/** These rows are already visibility-scoped by FeedbackController/DashboardController. */
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
                    href={'/feedback/' + item.id}
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
                >
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900 hover:text-blue-700">
                            {item.subject}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                            {showCustomer ? (item.customer?.name ?? 'Customer') + ' · ' : ''}
                            {item.category?.name ?? 'Uncategorized'} · {dateLabel(item.created_at)}
                        </p>
                    </div>
                    <StatusBadge value={item.status} />
                </Link>
            ))}
        </div>
    );
}

/** Render the seven-day submission series returned by the dashboard controller. */
export function FeedbackTrend({ data }: { data: NonNullable<DashboardProps['feedbackTrend']> }) {
    return (
        <div className="h-64 w-full">
            {data.length ? (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                        <CartesianGrid stroke="#eef2f7" vertical={false} />
                        <XAxis
                            dataKey="day"
                            tickFormatter={dateLabel}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 11 }}
                        />
                        <YAxis
                            allowDecimals={false}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 11 }}
                        />
                        <Tooltip
                            labelFormatter={(label) => dateLabel(String(label))}
                            contentStyle={{
                                borderRadius: 12,
                                borderColor: '#e2e8f0',
                                fontSize: 12,
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="total"
                            stroke="#2457c5"
                            strokeWidth={3}
                            dot={{ fill: '#2457c5', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <EmptyState
                    icon={MessageSquareText}
                    title="No feedback this week"
                    description="New customer submissions will appear here."
                />
            )}
        </div>
    );
}

export function RecentActivity({
    items,
}: {
    items: NonNullable<DashboardProps['recentActivity']>;
}) {
    return (
        <div className="mt-5 space-y-4">
            {items.length ? (
                items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-blue-500 ring-4 ring-blue-50" />
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-slate-800">
                                {item.description ?? item.action.replaceAll('.', ' ')}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                                {item.actor?.name ?? 'System'} · {dateLabel(item.created_at)}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <p className="py-10 text-center text-sm text-slate-500">
                    Activity will appear here as your team works.
                </p>
            )}
        </div>
    );
}

export function AvailableSurveyList({ surveys }: { surveys: SurveySummary[] }) {
    return (
        <div className="space-y-3">
            {surveys.length ? (
                surveys.map((survey) => (
                    <Link
                        href={'/surveys/' + survey.id}
                        key={survey.id}
                        className="group flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/50"
                    >
                        <div>
                            <p className="font-medium text-slate-900 group-hover:text-blue-800">
                                {survey.title}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                                {survey.questions_count ?? survey.questions?.length ?? 0} questions
                            </p>
                        </div>
                        <ArrowRight className="size-4 text-slate-400 group-hover:text-blue-600" />
                    </Link>
                ))
            ) : (
                <p className="py-8 text-center text-sm text-slate-500">
                    No surveys are open right now.
                </p>
            )}
        </div>
    );
}

export function EmptyFeedback({ staff = false }: { staff?: boolean }) {
    return (
        <EmptyState
            icon={staff ? ClipboardCheck : MessageSquareText}
            title={staff ? 'You are all caught up' : 'Share your first feedback'}
            description={
                staff
                    ? 'New items assigned to you will appear here.'
                    : 'Tell us what is working well or where we can improve.'
            }
            action={
                staff ? undefined : (
                    <Link href="/feedback/create" className="text-sm font-semibold text-blue-700">
                        Submit feedback
                    </Link>
                )
            }
        />
    );
}

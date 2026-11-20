import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ClipboardList, History, MessageSquareText, UserRound } from 'lucide-react';
import { StatusBadge } from '@/components/common/status-badge';
import { AppLayout } from '@/layouts/app-layout';
import type { FeedbackItem, SharedProps, SurveySummary } from '@/types';

interface UserDetail {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    created_at: string;
    roles: Array<{ name: string }>;
    staff_profile?: {
        staff_number: string;
        job_title?: string | null;
        department?: string | null;
    } | null;
    customer_profile?: { phone?: string | null; organization?: string | null } | null;
}
interface Props extends SharedProps {
    user: UserDetail;
    feedback: FeedbackItem[];
    surveyResponses: Array<{
        id: string;
        submitted_at: string;
        survey?: { id: string; title: string };
    }>;
    activity: Array<{
        id: string;
        action: string;
        description?: string | null;
        created_at: string;
    }>;
}

export default function UserShow({ user, feedback, surveyResponses, activity }: Props) {
    const role = user.roles[0]?.name ?? 'CUSTOMER';
    return (
        <AppLayout
            title={user.name}
            description={`${role} account · ${user.email}`}
            action={
                <Link
                    href={
                        role === 'STAFF'
                            ? '/admin/staff'
                            : role === 'CUSTOMER'
                              ? '/admin/customers'
                              : '/admin/users'
                    }
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600"
                >
                    <ArrowLeft className="size-4" />
                    Account list
                </Link>
            }
        >
            <Head title={`${user.name} · Account`} />
            <div className="grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
                <div className="space-y-5">
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                        <div className="grid size-12 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                            <UserRound className="size-6" />
                        </div>
                        <h2 className="mt-4 text-lg font-semibold text-slate-900">
                            Account profile
                        </h2>
                        <dl className="mt-5 space-y-4 text-sm">
                            <div>
                                <dt className="text-xs text-slate-500">Role</dt>
                                <dd className="mt-1 font-semibold text-slate-800">{role}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-slate-500">Account status</dt>
                                <dd className="mt-1">
                                    <span
                                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${user.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}
                                    >
                                        {user.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs text-slate-500">Joined</dt>
                                <dd className="mt-1 font-medium text-slate-800">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </dd>
                            </div>
                            {user.staff_profile ? (
                                <>
                                    <div>
                                        <dt className="text-xs text-slate-500">Staff number</dt>
                                        <dd className="mt-1 font-medium text-slate-800">
                                            {user.staff_profile.staff_number}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-slate-500">Department</dt>
                                        <dd className="mt-1 font-medium text-slate-800">
                                            {user.staff_profile.department ?? '—'}
                                        </dd>
                                    </div>
                                </>
                            ) : null}
                            {user.customer_profile ? (
                                <>
                                    <div>
                                        <dt className="text-xs text-slate-500">Phone</dt>
                                        <dd className="mt-1 font-medium text-slate-800">
                                            {user.customer_profile.phone ?? '—'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-slate-500">Organization</dt>
                                        <dd className="mt-1 font-medium text-slate-800">
                                            {user.customer_profile.organization ?? '—'}
                                        </dd>
                                    </div>
                                </>
                            ) : null}
                        </dl>
                    </section>
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                        <h2 className="flex items-center gap-2 font-semibold text-slate-900">
                            <History className="size-4 text-blue-700" />
                            Account activity
                        </h2>
                        <div className="mt-4 space-y-3">
                            {activity.length ? (
                                activity.map((item) => (
                                    <div key={item.id} className="border-l-2 border-blue-100 pl-3">
                                        <p className="text-sm font-medium text-slate-800">
                                            {item.description ?? item.action.replaceAll('.', ' ')}
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            {new Date(item.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500">No activity recorded.</p>
                            )}
                        </div>
                    </section>
                </div>
                <div className="space-y-5">
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                        <h2 className="flex items-center gap-2 font-semibold text-slate-900">
                            <MessageSquareText className="size-4 text-blue-700" />
                            Feedback history
                        </h2>
                        <div className="mt-4 divide-y divide-slate-100">
                            {feedback.length ? (
                                feedback.map((item) => (
                                    <Link
                                        href={`/feedback/${item.id}`}
                                        key={item.id}
                                        className="flex items-center justify-between gap-3 py-3 first:pt-0"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-slate-800">
                                                {item.subject}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {item.category?.name ?? 'Uncategorized'} ·{' '}
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <StatusBadge value={item.status} />
                                    </Link>
                                ))
                            ) : (
                                <p className="py-6 text-sm text-slate-500">No feedback history.</p>
                            )}
                        </div>
                    </section>
                    {role === 'CUSTOMER' ? (
                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                            <h2 className="flex items-center gap-2 font-semibold text-slate-900">
                                <ClipboardList className="size-4 text-blue-700" />
                                Identifiable survey history
                            </h2>
                            <div className="mt-4 divide-y divide-slate-100">
                                {surveyResponses.length ? (
                                    surveyResponses.map((response) => (
                                        <div
                                            key={response.id}
                                            className="flex items-center justify-between gap-3 py-3 first:pt-0"
                                        >
                                            <p className="text-sm font-medium text-slate-800">
                                                {response.survey?.title ?? 'Survey'}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {new Date(
                                                    response.submitted_at,
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="py-6 text-sm text-slate-500">
                                        No identifiable survey responses. Anonymous participation
                                        does not appear here.
                                    </p>
                                )}
                            </div>
                        </section>
                    ) : null}
                </div>
            </div>
        </AppLayout>
    );
}

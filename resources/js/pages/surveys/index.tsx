import { Head, Link } from '@inertiajs/react';
import { ArrowRight, CheckCircle2, ClipboardList, Clock3 } from 'lucide-react';
import { EmptyState } from '@/components/common/empty-state';
import { StatusBadge } from '@/components/common/status-badge';
import { AppLayout } from '@/layouts/app-layout';
import type { Paginated, SharedProps, SurveySummary } from '@/types';

interface Props extends SharedProps {
    surveys: Paginated<SurveySummary>;
    completedSurveyIds: string[];
    history: Paginated<{
        id: string;
        submitted_at: string;
        survey?: { id: string; title: string; status: string };
    }>;
}

export default function SurveysIndex({ surveys, completedSurveyIds, history }: Props) {
    return (
        <AppLayout
            title="Surveys"
            description="Share your perspective through short surveys from UI Ventures."
        >
            <Head title="Surveys" />
            <div className="grid gap-6 xl:grid-cols-[1.35fr_.8fr]">
                <section>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-semibold text-slate-900">Available surveys</h2>
                        <span className="text-xs text-slate-500">{surveys.total} open</span>
                    </div>
                    {surveys.data.length ? (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {surveys.data.map((survey) => {
                                const done = completedSurveyIds.includes(survey.id);
                                return (
                                    <article
                                        key={survey.id}
                                        className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
                                                <ClipboardList className="size-5" />
                                            </span>
                                            {done ? (
                                                <StatusBadge value="RESOLVED" />
                                            ) : (
                                                <span className="text-xs text-slate-500">
                                                    {survey.questions_count ?? 0} questions
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="mt-4 text-base font-semibold text-slate-900">
                                            {survey.title}
                                        </h3>
                                        {survey.description ? (
                                            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                                                {survey.description}
                                            </p>
                                        ) : (
                                            <p className="mt-2 text-sm text-slate-500">
                                                Your responses help us improve our services.
                                            </p>
                                        )}
                                        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                                            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                                                <Clock3 className="size-3.5" />
                                                {survey.ends_at
                                                    ? `Closes ${new Date(survey.ends_at).toLocaleDateString()}`
                                                    : 'Open until further notice'}
                                            </span>
                                            {done ? (
                                                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                                                    <CheckCircle2 className="size-4" />
                                                    Completed
                                                </span>
                                            ) : (
                                                <Link
                                                    href={`/surveys/${survey.id}`}
                                                    className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-900"
                                                >
                                                    Start <ArrowRight className="size-4" />
                                                </Link>
                                            )}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    ) : (
                        <EmptyState
                            icon={ClipboardList}
                            title="No open surveys"
                            description="New surveys will appear here when UI Ventures publishes them."
                        />
                    )}
                </section>
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                    <h2 className="font-semibold text-slate-900">Your participation history</h2>
                    <p className="mt-1 text-xs text-slate-500">Surveys you have submitted</p>
                    {history.data.length ? (
                        <div className="mt-4 divide-y divide-slate-100">
                            {history.data.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between gap-3 py-4 first:pt-0"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-slate-800">
                                            {item.survey?.title ?? 'Survey'}
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Submitted{' '}
                                            {item.submitted_at
                                                ? new Date(item.submitted_at).toLocaleDateString()
                                                : 'recently'}
                                        </p>
                                    </div>
                                    <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-6 rounded-xl bg-slate-50 px-4 py-5 text-center text-sm text-slate-500">
                            Completed surveys will appear here.
                        </p>
                    )}
                </section>
            </div>
        </AppLayout>
    );
}

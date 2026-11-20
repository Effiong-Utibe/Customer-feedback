import { Head, Link, router } from '@inertiajs/react';
import { ClipboardList, FilePlus2, MoreHorizontal } from 'lucide-react';
import { EmptyState } from '@/components/common/empty-state';
import { StatusBadge } from '@/components/common/status-badge';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/layouts/app-layout';
import type { Paginated, SharedProps, SurveySummary } from '@/types';

interface Props extends SharedProps {
    surveys: Paginated<SurveySummary & { creator?: { name: string } }>;
}

export default function SurveyManagementIndex({ surveys }: Props) {
    return (
        <AppLayout
            title="Survey management"
            description="Create surveys, manage questions, and monitor customer participation."
            action={
                <Button render={<Link href="/admin/surveys/create" />}>
                    <FilePlus2 />
                    Create survey
                </Button>
            }
        >
            <Head title="Survey management" />
            {surveys.data.length ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-5 py-4 font-semibold">Survey</th>
                                    <th className="px-5 py-4 font-semibold">Status</th>
                                    <th className="px-5 py-4 font-semibold">Questions</th>
                                    <th className="px-5 py-4 font-semibold">Responses</th>
                                    <th className="px-5 py-4 font-semibold">Created by</th>
                                    <th className="px-5 py-4" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {surveys.data.map((survey) => (
                                    <tr key={survey.id} className="hover:bg-slate-50/70">
                                        <td className="px-5 py-4">
                                            <Link
                                                href={`/admin/surveys/${survey.id}/edit`}
                                                className="font-semibold text-slate-900 hover:text-blue-700"
                                            >
                                                {survey.title}
                                            </Link>
                                            <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                                                {survey.description ?? 'No description'}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <StatusBadge value={survey.status} />
                                        </td>
                                        <td className="px-5 py-4 text-slate-600">
                                            {survey.questions_count ?? 0}
                                        </td>
                                        <td className="px-5 py-4 text-slate-600">
                                            {survey.responses_count ?? 0}
                                        </td>
                                        <td className="px-5 py-4 text-slate-600">
                                            {survey.creator?.name ?? '—'}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                {survey.status === 'DRAFT' ||
                                                survey.status === 'SCHEDULED' ? (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.post(
                                                                `/admin/surveys/${survey.id}/publish`,
                                                            )
                                                        }
                                                    >
                                                        Publish
                                                    </Button>
                                                ) : null}
                                                {survey.status === 'ACTIVE' ||
                                                survey.status === 'SCHEDULED' ? (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() =>
                                                            router.post(
                                                                `/admin/surveys/${survey.id}/close`,
                                                            )
                                                        }
                                                    >
                                                        Close
                                                    </Button>
                                                ) : null}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {surveys.last_page > 1 ? (
                        <div className="flex justify-end gap-2 border-t border-slate-100 p-4">
                            {surveys.links
                                .filter((link) => link.url && link.label !== '...')
                                .map((link) => (
                                    <Link
                                        key={link.label}
                                        href={link.url!}
                                        className={`rounded-lg px-3 py-2 text-xs font-semibold ${link.active ? 'bg-blue-700 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                        </div>
                    ) : null}
                </div>
            ) : (
                <EmptyState
                    icon={ClipboardList}
                    title="No surveys yet"
                    description="Build a survey with custom question types and publish it when it is ready."
                    action={
                        <Button render={<Link href="/admin/surveys/create" />}>
                            <FilePlus2 />
                            Create your first survey
                        </Button>
                    }
                />
            )}
        </AppLayout>
    );
}

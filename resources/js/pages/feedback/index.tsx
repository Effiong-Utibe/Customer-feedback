import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight, FilePlus2, MessageSquareText, Search, SlidersHorizontal } from 'lucide-react';
import { EmptyState } from '@/components/common/empty-state';
import { StatusBadge } from '@/components/common/status-badge';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { AppLayout } from '@/layouts/app-layout';
import type { Category, FeedbackItem, Paginated, SharedProps } from '@/types';

interface Props extends SharedProps {
    feedback: Paginated<FeedbackItem>;
    filters: { q?: string; status?: string; priority?: string; category?: number };
    categories: Category[];
    canManage: boolean;
}

export default function FeedbackIndex({ feedback, filters, categories, canManage }: Props) {
    const form = useForm({
        q: filters.q ?? '',
        status: filters.status ?? '',
        priority: filters.priority ?? '',
        category: filters.category?.toString() ?? '',
    });
    const apply = (event: React.FormEvent) => {
        event.preventDefault();
        form.get('/feedback', { preserveState: true, preserveScroll: true });
    };

    return (
        <AppLayout
            title={canManage ? 'Feedback queue' : 'My feedback'}
            description={
                canManage
                    ? 'Search submissions, review customer priorities, and respond to assigned feedback.'
                    : 'Review the status of your submissions and follow responses from the team.'
            }
            action={
                !canManage ? (
                    <Button render={<Link href="/feedback/create" />}>
                        <FilePlus2 />
                        Submit feedback
                    </Button>
                ) : undefined
            }
        >
            <Head title="Feedback" />
            <form
                onSubmit={apply}
                className="mb-5 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1.4fr_repeat(3,1fr)_auto] md:items-end"
            >
                <label className="grid gap-1.5 text-xs font-semibold text-slate-600">
                    <span>Search</span>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            className="pl-9"
                            value={form.data.q}
                            onChange={(event) => form.setData('q', event.target.value)}
                            placeholder="Subject or details"
                        />
                    </div>
                </label>
                <label className="grid gap-1.5 text-xs font-semibold text-slate-600">
                    <span>Status</span>
                    <Select
                        value={form.data.status}
                        onChange={(event) => form.setData('status', event.target.value)}
                    >
                        <option value="">All statuses</option>
                        {[
                            'SUBMITTED',
                            'UNDER_REVIEW',
                            'ASSIGNED',
                            'IN_PROGRESS',
                            'RESOLVED',
                            'CLOSED',
                        ].map((value) => (
                            <option key={value}>{value}</option>
                        ))}
                    </Select>
                </label>
                <label className="grid gap-1.5 text-xs font-semibold text-slate-600">
                    <span>Priority</span>
                    <Select
                        value={form.data.priority}
                        onChange={(event) => form.setData('priority', event.target.value)}
                    >
                        <option value="">All priorities</option>
                        {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((value) => (
                            <option key={value}>{value}</option>
                        ))}
                    </Select>
                </label>
                <label className="grid gap-1.5 text-xs font-semibold text-slate-600">
                    <span>Category</span>
                    <Select
                        value={form.data.category}
                        onChange={(event) => form.setData('category', event.target.value)}
                    >
                        <option value="">All categories</option>
                        {categories.map((category) => (
                            <option value={category.id} key={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </Select>
                </label>
                <Button type="submit" variant="outline">
                    <SlidersHorizontal />
                    Filter
                </Button>
            </form>
            {feedback.data.length ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[740px] text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-5 py-4 font-semibold">Feedback</th>
                                    <th className="px-5 py-4 font-semibold">Category</th>
                                    <th className="px-5 py-4 font-semibold">Status</th>
                                    <th className="px-5 py-4 font-semibold">Priority</th>
                                    <th className="px-5 py-4 font-semibold">Submitted</th>
                                    <th className="px-5 py-4" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {feedback.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/70">
                                        <td className="px-5 py-4">
                                            <Link
                                                href={`/feedback/${item.id}`}
                                                className="font-semibold text-slate-900 hover:text-blue-700"
                                            >
                                                {item.subject}
                                            </Link>
                                            <p className="mt-1 max-w-sm truncate text-xs text-slate-500">
                                                {item.body}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4 text-slate-600">
                                            {item.category?.name ?? '—'}
                                        </td>
                                        <td className="px-5 py-4">
                                            <StatusBadge value={item.status} />
                                        </td>
                                        <td className="px-5 py-4">
                                            <StatusBadge value={item.priority} />
                                        </td>
                                        <td className="px-5 py-4 text-xs text-slate-500">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-5 py-4">
                                            <Link
                                                href={`/feedback/${item.id}`}
                                                aria-label={`Open ${item.subject}`}
                                                className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-700"
                                            >
                                                <ArrowRight className="size-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {feedback.last_page > 1 ? (
                        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
                            <span>
                                Showing {feedback.data.length} of {feedback.total}
                            </span>
                            <div className="flex gap-1">
                                {feedback.links
                                    .filter((link) => link.url && link.label !== '...')
                                    .map((link) => (
                                        <Link
                                            key={link.label}
                                            href={link.url!}
                                            className={`rounded-lg px-3 py-2 font-semibold ${link.active ? 'bg-blue-700 text-white' : 'hover:bg-slate-100'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            ) : (
                <EmptyState
                    icon={MessageSquareText}
                    title="No feedback found"
                    description="Try adjusting the filters or submit a new feedback item."
                    action={
                        !canManage ? (
                            <Button render={<Link href="/feedback/create" />}>
                                <FilePlus2 />
                                Submit feedback
                            </Button>
                        ) : undefined
                    }
                />
            )}
        </AppLayout>
    );
}

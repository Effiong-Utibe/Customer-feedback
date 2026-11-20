import { Head, Link } from '@inertiajs/react';
import { History, ShieldCheck } from 'lucide-react';
import { EmptyState } from '@/components/common/empty-state';
import { AppLayout } from '@/layouts/app-layout';
import type { Paginated, SharedProps } from '@/types';

interface Log {
    id: string;
    action: string;
    description?: string | null;
    subject_type?: string | null;
    subject_id?: string | null;
    properties?: Record<string, unknown> | null;
    created_at: string;
    actor?: { id: number; name: string } | null;
}
interface Props extends SharedProps {
    logs: Paginated<Log>;
}

export default function AuditLogs({ logs }: Props) {
    return (
        <AppLayout
            title="Audit activity"
            description="A read-only history of important administrative and operational changes."
        >
            <Head title="Audit activity" />
            {logs.data.length ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="divide-y divide-slate-100">
                        {logs.data.map((log) => (
                            <article key={log.id} className="flex gap-4 px-5 py-4">
                                <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
                                    <ShieldCheck className="size-4" />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <p className="text-sm font-semibold text-slate-900">
                                            {log.description ?? log.action.replaceAll('.', ' ')}
                                        </p>
                                        <time className="text-xs text-slate-400">
                                            {new Date(log.created_at).toLocaleString()}
                                        </time>
                                    </div>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {log.actor?.name ?? 'System'} · {log.action}
                                        {log.subject_type
                                            ? ` · ${log.subject_type}${log.subject_id ? ` ${log.subject_id}` : ''}`
                                            : ''}
                                    </p>
                                    {log.properties ? (
                                        <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-50 p-2 text-[10px] text-slate-500">
                                            {JSON.stringify(log.properties)}
                                        </pre>
                                    ) : null}
                                </div>
                            </article>
                        ))}
                    </div>
                    {logs.last_page > 1 ? (
                        <div className="flex justify-end gap-1 border-t border-slate-100 p-4">
                            {logs.links
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
                    icon={History}
                    title="No activity yet"
                    description="Important system events will be recorded here."
                />
            )}
        </AppLayout>
    );
}

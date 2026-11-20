import { Download, Paperclip } from 'lucide-react';
import { StatusBadge } from '@/components/common/status-badge';
import { Card, CardContent } from '@/components/ui/card';
import type { FeedbackDetail } from './types';

export function FeedbackSummary({ feedback }: { feedback: FeedbackDetail }) {
    return (
        <Card>
            <CardContent className="p-5 md:p-7">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <div className="flex flex-wrap gap-2">
                            <StatusBadge value={feedback.status} />
                            <StatusBadge value={feedback.priority} />
                        </div>
                        <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">
                            {feedback.subject}
                        </h2>
                        <p className="mt-1 text-xs text-slate-500">
                            {feedback.category?.name ?? 'Uncategorized'} · Submitted{' '}
                            {new Date(feedback.created_at).toLocaleString()}
                        </p>
                    </div>
                    {feedback.rating ? (
                        <div className="rounded-xl bg-amber-50 px-3 py-2 text-center">
                            <p className="text-lg font-semibold text-amber-700">
                                {feedback.rating}
                                <span className="text-sm">/5</span>
                            </p>
                            <p className="text-[10px] font-semibold uppercase text-amber-700">
                                Rating
                            </p>
                        </div>
                    ) : null}
                </div>
                <p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                    {feedback.body}
                </p>
                {feedback.attachments.length ? (
                    <div className="mt-6 border-t border-slate-100 pt-5">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Attachments
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {feedback.attachments.map((attachment) => (
                                <a
                                    key={attachment.id}
                                    href={
                                        '/feedback/' + feedback.id + '/attachments/' + attachment.id
                                    }
                                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:border-blue-200 hover:bg-blue-50"
                                >
                                    <Paperclip className="size-3.5" />
                                    {attachment.original_name}
                                    <Download className="size-3.5 text-slate-400" />
                                </a>
                            ))}
                        </div>
                    </div>
                ) : null}
            </CardContent>
        </Card>
    );
}

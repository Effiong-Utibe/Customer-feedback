import { useForm } from '@inertiajs/react';
import { Send, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, Textarea } from '@/components/ui/input';
import type { FeedbackDetail } from './types';

export function FeedbackConversation({
    feedback,
    isStaff,
}: {
    feedback: FeedbackDetail;
    isStaff: boolean;
}) {
    const responseForm = useForm({ body: '', is_internal: false });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Conversation</CardTitle>
                <CardDescription>
                    Responses and updates from you and the UI Ventures team.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {feedback.responses.length ? (
                        feedback.responses.map((response) => (
                            <article
                                key={response.id}
                                className={
                                    'rounded-xl border p-4 ' +
                                    (response.is_internal
                                        ? 'border-amber-200 bg-amber-50/60'
                                        : 'border-slate-200 bg-slate-50/70')
                                }
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <p className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                                        <UserRound className="size-3.5 text-slate-400" />
                                        {response.author?.name ?? 'UI Ventures'}
                                        {response.is_internal ? (
                                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] text-amber-800">
                                                Internal note
                                            </span>
                                        ) : null}
                                    </p>
                                    <time className="text-[11px] text-slate-400">
                                        {new Date(response.created_at).toLocaleString()}
                                    </time>
                                </div>
                                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                                    {response.body}
                                </p>
                            </article>
                        ))
                    ) : (
                        <p className="rounded-xl bg-slate-50 px-4 py-5 text-center text-sm text-slate-500">
                            No responses yet.
                        </p>
                    )}
                </div>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        // Laravel validates the response and returns errors through Inertia.
                        responseForm.post('/feedback/' + feedback.id + '/responses', {
                            onSuccess: () => responseForm.reset('body'),
                        });
                    }}
                    className="mt-5 border-t border-slate-100 pt-5"
                >
                    <Field
                        label={isStaff ? 'Add a response or internal note' : 'Write a reply'}
                        error={responseForm.errors.body}
                    >
                        <Textarea
                            value={responseForm.data.body}
                            onChange={(event) => responseForm.setData('body', event.target.value)}
                            placeholder="Write a helpful response…"
                        />
                    </Field>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                        {isStaff ? (
                            <label className="flex items-center gap-2 text-xs text-slate-600">
                                <input
                                    type="checkbox"
                                    checked={responseForm.data.is_internal}
                                    onChange={(event) =>
                                        responseForm.setData('is_internal', event.target.checked)
                                    }
                                    className="size-4 rounded border-slate-300 text-blue-700"
                                />
                                Internal note (not shown to the customer)
                            </label>
                        ) : (
                            <span />
                        )}
                        <Button type="submit" disabled={responseForm.processing}>
                            <Send />
                            {responseForm.processing ? 'Sending…' : 'Send response'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

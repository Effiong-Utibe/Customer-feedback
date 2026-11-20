import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Paperclip, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, Input, Select, Textarea } from '@/components/ui/input';
import { AppLayout } from '@/layouts/app-layout';
import type { Category } from '@/types';

interface FormData {
    feedback_category_id: string;
    subject: string;
    body: string;
    rating: string;
    attachments: File[];
}

export default function FeedbackCreate({ categories }: { categories: Category[] }) {
    const form = useForm<FormData>({
        feedback_category_id: '',
        subject: '',
        body: '',
        rating: '',
        attachments: [],
    });
    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        form.post('/feedback', { forceFormData: true });
    };

    return (
        <AppLayout
            title="Share feedback"
            description="Tell us about your experience. The UI Ventures team will review and respond to your submission."
            action={
                <Link
                    href="/feedback"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft className="size-4" />
                    My feedback
                </Link>
            }
        >
            <Head title="Submit feedback" />
            <form
                onSubmit={submit}
                className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-8"
            >
                <div className="grid gap-5">
                    <Field label="Feedback category" error={form.errors.feedback_category_id}>
                        <Select
                            value={form.data.feedback_category_id}
                            onChange={(event) =>
                                form.setData('feedback_category_id', event.target.value)
                            }
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option value={category.id} key={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </Select>
                    </Field>
                    <Field label="Subject" error={form.errors.subject}>
                        <Input
                            value={form.data.subject}
                            onChange={(event) => form.setData('subject', event.target.value)}
                            maxLength={180}
                            placeholder="Summarize your feedback"
                        />
                    </Field>
                    <Field
                        label="Details"
                        hint="Share enough context for our team to understand your experience."
                        error={form.errors.body}
                    >
                        <Textarea
                            value={form.data.body}
                            onChange={(event) => form.setData('body', event.target.value)}
                            maxLength={10000}
                            placeholder="What happened? What worked well, or what could we improve?"
                        />
                    </Field>
                    <Field
                        label="Rating (optional)"
                        hint="Rate your experience from 1 to 5."
                        error={form.errors.rating}
                    >
                        <Select
                            value={form.data.rating}
                            onChange={(event) => form.setData('rating', event.target.value)}
                        >
                            <option value="">Choose a rating</option>
                            {[5, 4, 3, 2, 1].map((value) => (
                                <option key={value} value={value}>
                                    {value} —{' '}
                                    {value >= 4
                                        ? 'Good'
                                        : value === 3
                                          ? 'Okay'
                                          : 'Needs improvement'}
                                </option>
                            ))}
                        </Select>
                    </Field>
                    <Field
                        label="Attachments"
                        hint="Up to 5 files, 5 MB each. PDF, images, text, or Word documents."
                        error={form.errors.attachments}
                    >
                        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                                <Paperclip className="size-4" />
                                Choose files
                                <input
                                    type="file"
                                    multiple
                                    accept=".pdf,.jpg,.jpeg,.png,.webp,.txt,.doc,.docx"
                                    className="sr-only"
                                    onChange={(event) =>
                                        form.setData(
                                            'attachments',
                                            Array.from(event.currentTarget.files ?? []),
                                        )
                                    }
                                />
                            </label>
                            {form.data.attachments.length ? (
                                <ul className="mt-3 space-y-1 text-xs text-slate-600">
                                    {form.data.attachments.map((file) => (
                                        <li key={`${file.name}-${file.size}`}>
                                            {file.name} · {(file.size / 1024 / 1024).toFixed(1)} MB
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="mt-2 text-xs text-slate-500">
                                    Files are stored privately and only available to authorized
                                    reviewers.
                                </p>
                            )}
                        </div>
                    </Field>
                    {form.errors['attachments.0'] ? (
                        <p className="-mt-4 text-xs text-red-600">{form.errors['attachments.0']}</p>
                    ) : null}
                    <div className="flex justify-end border-t border-slate-100 pt-5">
                        <Button type="submit" size="lg" disabled={form.processing}>
                            <Send />
                            {form.processing ? 'Submitting…' : 'Submit feedback'}
                        </Button>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}

import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, Input, Select, Textarea } from '@/components/ui/input';
import { QuestionEditor, type QuestionDraft } from '@/components/surveys/question-editor';
import { AppLayout } from '@/layouts/app-layout';
import type { SurveyQuestion, SurveySummary } from '@/types';

interface FormData {
    title: string;
    description: string;
    instructions: string;
    starts_at: string;
    ends_at: string;
    is_anonymous: boolean;
    allow_multiple_submissions: boolean;
    questions: QuestionDraft[];
}

// Convert the persisted survey model into an editable client-side draft.
function questionFrom(question?: SurveyQuestion): QuestionDraft {
    return {
        ...(question?.id ? { id: question.id } : {}),
        title: question?.title ?? '',
        description: question?.description ?? '',
        question_type: question?.question_type ?? 'SHORT_TEXT',
        is_required: question?.is_required ?? false,
        validation_rules: question?.validation_rules ?? { min: 1, max: 10 },
        options: question?.options?.map(({ id, label, value }) => ({ id, label, value })) ?? [],
    };
}

export default function SurveyForm({ survey }: { survey: SurveySummary | null }) {
    const form = useForm<FormData>({
        title: survey?.title ?? '',
        description: survey?.description ?? '',
        instructions: survey?.instructions ?? '',
        starts_at: survey?.starts_at?.slice(0, 16) ?? '',
        ends_at: survey?.ends_at?.slice(0, 16) ?? '',
        is_anonymous: survey?.is_anonymous ?? false,
        allow_multiple_submissions: survey?.allow_multiple_submissions ?? false,
        questions: survey?.questions
            ?.filter((question) => question.is_active !== false)
            .map(questionFrom) ?? [questionFrom()],
    });

    const setQuestion = (index: number, update: Partial<QuestionDraft>) =>
        form.setData(
            'questions',
            form.data.questions.map((question, i) =>
                i === index ? { ...question, ...update } : question,
            ),
        );
    const addQuestion = () => form.setData('questions', [...form.data.questions, questionFrom()]);
    const removeQuestion = (index: number) =>
        form.setData(
            'questions',
            form.data.questions.filter((_, i) => i !== index),
        );
    const moveQuestion = (index: number, direction: -1 | 1) => {
        const next = [...form.data.questions];
        const target = index + direction;
        if (target < 0 || target >= next.length) return;
        // Reordering the draft array also determines the persisted question position.
        [next[index], next[target]] = [next[target], next[index]];
        form.setData('questions', next);
    };
    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        if (survey) form.patch(`/admin/surveys/${survey.id}`);
        else form.post('/admin/surveys');
    };

    return (
        <AppLayout
            title={survey ? 'Edit survey' : 'Create survey'}
            description="Set up the survey details and arrange the questions your customers will answer."
            action={
                <Link
                    href="/admin/surveys"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft className="size-4" />
                    Survey list
                </Link>
            }
        >
            <Head title={survey ? 'Edit survey' : 'Create survey'} />
            <form onSubmit={submit} className="mx-auto max-w-4xl space-y-6">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
                    <div className="mb-5">
                        <h2 className="font-semibold text-slate-900">Survey details</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Give participants clear context before they begin.
                        </p>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="Title" error={form.errors.title}>
                            <Input
                                value={form.data.title}
                                onChange={(event) => form.setData('title', event.target.value)}
                                placeholder="Customer service experience"
                            />
                        </Field>
                        <Field label="Description" error={form.errors.description}>
                            <Input
                                value={form.data.description}
                                onChange={(event) =>
                                    form.setData('description', event.target.value)
                                }
                                placeholder="A short introduction"
                            />
                        </Field>
                        <Field label="Instructions" error={form.errors.instructions}>
                            <Textarea
                                value={form.data.instructions}
                                onChange={(event) =>
                                    form.setData('instructions', event.target.value)
                                }
                                placeholder="Let participants know what to expect"
                                className="sm:col-span-2"
                            />
                        </Field>
                        <Field label="Starts at">
                            <Input
                                type="datetime-local"
                                value={form.data.starts_at}
                                onChange={(event) => form.setData('starts_at', event.target.value)}
                            />
                        </Field>
                        <Field label="Ends at" error={form.errors.ends_at}>
                            <Input
                                type="datetime-local"
                                value={form.data.ends_at}
                                onChange={(event) => form.setData('ends_at', event.target.value)}
                            />
                        </Field>
                    </div>
                    <div className="mt-5 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2">
                        <label className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                            <input
                                type="checkbox"
                                checked={form.data.is_anonymous}
                                onChange={(event) =>
                                    form.setData('is_anonymous', event.target.checked)
                                }
                                className="mt-0.5 size-4 rounded border-slate-300 text-blue-700 focus:ring-blue-500"
                            />
                            <span>
                                <span className="block text-sm font-medium text-slate-800">
                                    Anonymous responses
                                </span>
                                <span className="mt-1 block text-xs leading-5 text-slate-500">
                                    Customer identity is omitted from response records.
                                </span>
                            </span>
                        </label>
                        <label className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                            <input
                                type="checkbox"
                                checked={form.data.allow_multiple_submissions}
                                onChange={(event) =>
                                    form.setData('allow_multiple_submissions', event.target.checked)
                                }
                                className="mt-0.5 size-4 rounded border-slate-300 text-blue-700 focus:ring-blue-500"
                            />
                            <span>
                                <span className="block text-sm font-medium text-slate-800">
                                    Allow multiple submissions
                                </span>
                                <span className="mt-1 block text-xs leading-5 text-slate-500">
                                    Participants may submit more than one response.
                                </span>
                            </span>
                        </label>
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="flex items-end justify-between gap-3">
                        <div>
                            <h2 className="font-semibold text-slate-900">Questions</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Drag-free ordering controls keep the question sequence clear.
                            </p>
                        </div>
                        <Button type="button" variant="outline" onClick={addQuestion}>
                            <Plus />
                            Add question
                        </Button>
                    </div>
                    {form.data.questions.map((question, index) => (
                        <QuestionEditor
                            key={question.id ?? `new-${index}`}
                            question={question}
                            index={index}
                            count={form.data.questions.length}
                            titleError={
                                form.errors[
                                    `questions.${index}.title` as keyof typeof form.errors
                                ] as string | undefined
                            }
                            optionsError={
                                form.errors[
                                    `questions.${index}.options` as keyof typeof form.errors
                                ] as string | undefined
                            }
                            onChange={(update) => setQuestion(index, update)}
                            onMove={(direction) => moveQuestion(index, direction)}
                            onRemove={() => removeQuestion(index)}
                        />
                    ))}
                    {form.errors.questions ? (
                        <p className="text-sm text-red-600">{form.errors.questions}</p>
                    ) : null}
                </section>
                <div className="flex justify-end gap-3">
                    <Button render={<Link href="/admin/surveys" />} variant="outline">
                        Cancel
                    </Button>
                    <Button type="submit" size="lg" disabled={form.processing}>
                        {form.processing ? 'Saving…' : 'Save draft'}
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}

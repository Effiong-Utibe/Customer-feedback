import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, Input, Select, Textarea } from '@/components/ui/input';
import { AppLayout } from '@/layouts/app-layout';
import type { SurveySummary } from '@/types';

export default function Participate({ survey }: { survey: SurveySummary }) {
    const form = useForm<{ answers: Record<string, string | string[]> }>({ answers: {} });
    const setAnswer = (id: string, value: string | string[]) =>
        form.setData('answers', { ...form.data.answers, [id]: value });

    return (
        <AppLayout
            title={survey.title}
            description={survey.description ?? 'Your responses help UI Ventures improve service.'}
            action={
                <a
                    href="/surveys"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft className="size-4" />
                    All surveys
                </a>
            }
        >
            <Head title={survey.title} />
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    form.post(`/surveys/${survey.id}/responses`);
                }}
                className="mx-auto max-w-3xl"
            >
                {survey.instructions ? (
                    <div className="mb-5 rounded-2xl border border-blue-100 bg-blue-50/70 p-5 text-sm leading-6 text-blue-950">
                        {survey.instructions}
                    </div>
                ) : null}
                <div className="mb-5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                    <ClipboardList className="size-5 text-blue-700" />
                    {survey.questions?.length ?? 0} questions{' '}
                    {survey.is_anonymous ? '· Anonymous responses' : ''}
                </div>
                <div className="grid gap-4">
                    {survey.questions?.map((question, index) => {
                        const key = question.id;
                        const value = form.data.answers[key] ?? '';
                        return (
                            <section
                                key={key}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6"
                            >
                                <div className="mb-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                                        Question {index + 1}
                                        {question.is_required ? ' · Required' : ''}
                                    </p>
                                    <h2 className="mt-2 font-semibold text-slate-900">
                                        {question.title}
                                    </h2>
                                    {question.description ? (
                                        <p className="mt-1 text-sm text-slate-500">
                                            {question.description}
                                        </p>
                                    ) : null}
                                </div>
                                <QuestionInput
                                    question={question}
                                    value={value}
                                    onChange={(next) => setAnswer(key, next)}
                                />
                                {form.errors[`answers.${key}`] ? (
                                    <p className="mt-2 text-xs text-red-600">
                                        {form.errors[`answers.${key}`]}
                                    </p>
                                ) : null}
                            </section>
                        );
                    })}
                </div>
                <div className="mt-6 flex justify-end">
                    <Button type="submit" size="lg" disabled={form.processing}>
                        {form.processing ? 'Submitting…' : 'Submit response'}
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}

function QuestionInput({
    question,
    value,
    onChange,
}: {
    question: NonNullable<SurveySummary['questions']>[number];
    value: string | string[];
    onChange: (value: string | string[]) => void;
}) {
    if (question.question_type === 'SHORT_TEXT')
        return (
            <Input
                value={String(value)}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Your answer"
            />
        );
    if (question.question_type === 'LONG_TEXT')
        return (
            <Textarea
                value={String(value)}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Write your answer"
            />
        );
    if (question.question_type === 'DATE')
        return (
            <Input
                type="date"
                value={String(value)}
                onChange={(event) => onChange(event.target.value)}
            />
        );
    if (question.question_type === 'DROPDOWN')
        return (
            <Select value={String(value)} onChange={(event) => onChange(event.target.value)}>
                <option value="">Choose an option</option>
                {question.options.map((option) => (
                    <option key={option.id ?? option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </Select>
        );
    if (question.question_type === 'SINGLE_CHOICE' || question.question_type === 'YES_NO') {
        const options =
            question.question_type === 'YES_NO'
                ? [
                      { label: 'Yes', value: 'yes' },
                      { label: 'No', value: 'no' },
                  ]
                : question.options;
        return (
            <div className="grid gap-2">
                {options.map((option) => (
                    <label
                        key={option.value}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 px-3.5 py-3 text-sm text-slate-700 hover:bg-slate-50"
                    >
                        <input
                            type="radio"
                            name={question.id}
                            checked={String(value) === option.value}
                            onChange={() => onChange(option.value)}
                            className="size-4 border-slate-300 text-blue-700 focus:ring-blue-500"
                        />
                        {option.label}
                    </label>
                ))}
            </div>
        );
    }
    if (question.question_type === 'MULTIPLE_CHOICE') {
        const selected = Array.isArray(value) ? value : [];
        return (
            <div className="grid gap-2">
                {question.options.map((option) => (
                    <label
                        key={option.value}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 px-3.5 py-3 text-sm text-slate-700 hover:bg-slate-50"
                    >
                        <input
                            type="checkbox"
                            checked={selected.includes(option.value)}
                            onChange={(event) =>
                                onChange(
                                    event.target.checked
                                        ? [...selected, option.value]
                                        : selected.filter((item) => item !== option.value),
                                )
                            }
                            className="size-4 rounded border-slate-300 text-blue-700 focus:ring-blue-500"
                        />
                        {option.label}
                    </label>
                ))}
            </div>
        );
    }
    if (question.question_type === 'RATING')
        return (
            <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                        key={rating}
                        type="button"
                        onClick={() => onChange(String(rating))}
                        className={`grid size-11 place-items-center rounded-xl border text-sm font-semibold transition ${String(value) === String(rating) ? 'border-blue-700 bg-blue-700 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'}`}
                    >
                        {rating}
                    </button>
                ))}
            </div>
        );
    const min = question.validation_rules?.min ?? 1;
    const max = question.validation_rules?.max ?? 10;
    return (
        <Field label={`Choose a number from ${min} to ${max}`}>
            <Input
                type="number"
                min={min}
                max={max}
                value={String(value)}
                onChange={(event) => onChange(event.target.value)}
            />
        </Field>
    );
}

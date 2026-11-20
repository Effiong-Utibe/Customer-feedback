import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, Input, Select } from '@/components/ui/input';
import type { QuestionType } from '@/types';

export interface QuestionDraft {
    id?: string;
    title: string;
    description: string;
    question_type: QuestionType;
    is_required: boolean;
    validation_rules: { min?: number; max?: number };
    options: Array<{ id?: string; label: string; value: string }>;
}

const questionTypes: Array<{ value: QuestionType; label: string }> = [
    { value: 'SHORT_TEXT', label: 'Short text' },
    { value: 'LONG_TEXT', label: 'Long text' },
    { value: 'SINGLE_CHOICE', label: 'Single choice' },
    { value: 'MULTIPLE_CHOICE', label: 'Multiple choice' },
    { value: 'DROPDOWN', label: 'Dropdown' },
    { value: 'RATING', label: 'Rating 1–5' },
    { value: 'LINEAR_SCALE', label: 'Linear scale' },
    { value: 'YES_NO', label: 'Yes / No' },
    { value: 'DATE', label: 'Date' },
];

const isChoice = (type: QuestionType) =>
    ['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'DROPDOWN'].includes(type);
const optionValue = (label: string) =>
    label
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 180);

interface QuestionEditorProps {
    question: QuestionDraft;
    index: number;
    count: number;
    titleError?: string;
    optionsError?: string;
    onChange: (update: Partial<QuestionDraft>) => void;
    onMove: (direction: -1 | 1) => void;
    onRemove: () => void;
}

/** Edit one question; list ordering and form submission stay in the page. */
export function QuestionEditor({
    question,
    index,
    count,
    titleError,
    optionsError,
    onChange,
    onMove,
    onRemove,
}: QuestionEditorProps) {
    const updateOption = (optionIndex: number, label: string) => {
        onChange({
            options: question.options.map((item, i) =>
                i === optionIndex ? { ...item, label, value: optionValue(label) } : item,
            ),
        });
    };

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Question {index + 1}
                </p>
                <div className="flex items-center gap-1">
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        aria-label="Move question up"
                        disabled={index === 0}
                        onClick={() => onMove(-1)}
                    >
                        <ArrowUp />
                    </Button>
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        aria-label="Move question down"
                        disabled={index === count - 1}
                        onClick={() => onMove(1)}
                    >
                        <ArrowDown />
                    </Button>
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        aria-label="Remove question"
                        onClick={onRemove}
                    >
                        <Trash2 className="text-red-600" />
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
                <Field label="Question title" error={titleError}>
                    <Input
                        value={question.title}
                        onChange={(event) => onChange({ title: event.target.value })}
                        placeholder="What did you think of your visit?"
                    />
                </Field>
                <Field label="Answer type">
                    <Select
                        value={question.question_type}
                        onChange={(event) => {
                            const type = event.target.value as QuestionType;
                            const options =
                                isChoice(type) && question.options.length < 2
                                    ? [
                                          { label: 'Option 1', value: 'option-1' },
                                          { label: 'Option 2', value: 'option-2' },
                                      ]
                                    : question.options;
                            onChange({ question_type: type, options });
                        }}
                    >
                        {questionTypes.map((type) => (
                            <option value={type.value} key={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </Select>
                </Field>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                <Field label="Help text">
                    <Input
                        value={question.description}
                        onChange={(event) => onChange({ description: event.target.value })}
                        placeholder="Optional details for participants"
                    />
                </Field>
                <label className="flex h-10 items-center gap-2 text-sm text-slate-700">
                    <input
                        type="checkbox"
                        checked={question.is_required}
                        onChange={(event) => onChange({ is_required: event.target.checked })}
                        className="size-4 rounded border-slate-300 text-blue-700 focus:ring-blue-500"
                    />
                    Required
                </label>
            </div>

            {isChoice(question.question_type) ? (
                <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="mb-3 text-sm font-medium text-slate-700">Answer options</p>
                    <div className="grid gap-2">
                        {question.options.map((option, optionIndex) => (
                            <div key={option.id ?? optionIndex} className="flex gap-2">
                                <Input
                                    value={option.label}
                                    onChange={(event) =>
                                        updateOption(optionIndex, event.target.value)
                                    }
                                    placeholder={`Option ${optionIndex + 1}`}
                                />
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    aria-label="Remove option"
                                    onClick={() =>
                                        onChange({
                                            options: question.options.filter(
                                                (_, i) => i !== optionIndex,
                                            ),
                                        })
                                    }
                                >
                                    <Trash2 className="text-slate-400" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="mt-2"
                        onClick={() =>
                            onChange({ options: [...question.options, { label: '', value: '' }] })
                        }
                    >
                        <Plus />
                        Add option
                    </Button>
                    {optionsError ? (
                        <p className="mt-2 text-xs text-red-600">{optionsError}</p>
                    ) : null}
                </div>
            ) : null}

            {question.question_type === 'LINEAR_SCALE' ? (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Field label="Minimum">
                        <Input
                            type="number"
                            value={question.validation_rules.min ?? 1}
                            onChange={(event) =>
                                onChange({
                                    validation_rules: {
                                        ...question.validation_rules,
                                        min: Number(event.target.value),
                                    },
                                })
                            }
                        />
                    </Field>
                    <Field label="Maximum">
                        <Input
                            type="number"
                            value={question.validation_rules.max ?? 10}
                            onChange={(event) =>
                                onChange({
                                    validation_rules: {
                                        ...question.validation_rules,
                                        max: Number(event.target.value),
                                    },
                                })
                            }
                        />
                    </Field>
                </div>
            ) : null}
        </article>
    );
}

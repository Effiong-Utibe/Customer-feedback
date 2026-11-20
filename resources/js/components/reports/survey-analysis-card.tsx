import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ReportQuestion } from './report-types';

interface SurveyAnalysisCardProps {
    metrics: { total: number; active: number; responses: number };
    selectedSurvey?: { id: string; title: string } | null;
    questions: ReportQuestion[];
}

/** Displays summary counts and the selected survey's answer distributions. */
export function SurveyAnalysisCard({
    metrics,
    selectedSurvey,
    questions,
}: SurveyAnalysisCardProps) {
    return (
        <Card>
            <CardHeader className="flex-row items-start justify-between">
                <div>
                    <CardTitle>Survey participation</CardTitle>
                    <CardDescription className="mt-1">
                        Published surveys and submitted responses
                    </CardDescription>
                </div>
                <BarChart3 className="size-5 text-blue-700" />
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-3">
                    <MiniStat label="Surveys" value={metrics.total} />
                    <MiniStat label="Active" value={metrics.active} />
                    <MiniStat label="Responses" value={metrics.responses} />
                </div>
                {selectedSurvey ? (
                    <div className="mt-5 border-t border-slate-100 pt-4">
                        <p className="mb-3 text-xs font-semibold text-slate-700">
                            Question results · {selectedSurvey.title}
                        </p>
                        <div className="space-y-4">
                            {questions.map((question) => (
                                <div key={question.id}>
                                    <div className="flex justify-between gap-3">
                                        <p className="truncate text-xs font-medium text-slate-700">
                                            {question.title}
                                        </p>
                                        <span className="shrink-0 text-[11px] text-slate-500">
                                            {question.responses} responses
                                        </span>
                                    </div>
                                    {question.distribution.length ? (
                                        <div className="mt-2 h-28">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    data={question.distribution}
                                                    margin={{
                                                        top: 4,
                                                        right: 6,
                                                        left: -28,
                                                        bottom: 0,
                                                    }}
                                                >
                                                    <XAxis
                                                        dataKey="name"
                                                        tick={{ fontSize: 9, fill: '#64748b' }}
                                                    />
                                                    <YAxis
                                                        allowDecimals={false}
                                                        tick={{ fontSize: 9, fill: '#94a3b8' }}
                                                    />
                                                    <Tooltip />
                                                    <Bar
                                                        dataKey="total"
                                                        fill="#2457c5"
                                                        radius={[4, 4, 0, 0]}
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ) : (
                                        <p className="mt-1 text-[11px] text-slate-500">
                                            Open-text responses are not displayed in aggregate
                                            charts.
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}
            </CardContent>
        </Card>
    );
}

function MiniStat({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                {label}
            </p>
            <p className="mt-1.5 text-lg font-semibold text-slate-900">{value}</p>
        </div>
    );
}

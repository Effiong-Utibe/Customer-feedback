import { Head, useForm, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Download,
    FileSpreadsheet,
    FileText,
    Filter,
    MessageSquareText,
    Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, Input, Select } from '@/components/ui/input';
import { ChartCard, DistributionChart, TrendChart } from '@/components/reports/report-charts';
import { StaffPerformanceTable } from '@/components/reports/staff-performance-table';
import { SurveyAnalysisCard } from '@/components/reports/survey-analysis-card';
import type { ReportProps } from '@/components/reports/report-types';
import { AppLayout } from '@/layouts/app-layout';

export default function ReportsIndex() {
    const props = usePage<ReportProps>().props;
    // Seed the filter form from Laravel's validated query values so charts and exports use one selection.
    const form = useForm({
        from: String(props.filters.from ?? ''),
        to: String(props.filters.to ?? ''),
        category_id: String(props.filters.category_id ?? ''),
        status: String(props.filters.status ?? ''),
        priority: String(props.filters.priority ?? ''),
        survey_id: String(props.filters.survey_id ?? ''),
        customer_id: String(props.filters.customer_id ?? ''),
    });
    const exportQuery = new URLSearchParams(
        Object.entries(form.data)
            .filter(([, value]) => value !== '')
            .map(([key, value]) => [key, String(value)]),
    ).toString();

    return (
        <AppLayout
            title="Reports & analytics"
            description="Explore real feedback trends, resolution progress, staff performance, and survey responses."
        >
            <Head title="Reports & analytics" />
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    form.get('/reports', { preserveScroll: true });
                }}
                className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5"
            >
                <div className="mb-4 flex items-center gap-2">
                    <Filter className="size-4 text-blue-700" />
                    <h2 className="text-sm font-semibold text-slate-900">Filter report</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
                    <Field label="From">
                        <Input
                            type="date"
                            value={form.data.from}
                            onChange={(event) => form.setData('from', event.target.value)}
                        />
                    </Field>
                    <Field label="To">
                        <Input
                            type="date"
                            value={form.data.to}
                            onChange={(event) => form.setData('to', event.target.value)}
                        />
                    </Field>
                    <Field label="Category">
                        <Select
                            value={form.data.category_id}
                            onChange={(event) => form.setData('category_id', event.target.value)}
                        >
                            <option value="">All categories</option>
                            {props.categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </Select>
                    </Field>
                    <Field label="Status">
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
                    </Field>
                    <Field label="Priority">
                        <Select
                            value={form.data.priority}
                            onChange={(event) => form.setData('priority', event.target.value)}
                        >
                            <option value="">All priorities</option>
                            {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((value) => (
                                <option key={value}>{value}</option>
                            ))}
                        </Select>
                    </Field>
                    <Field label="Survey">
                        <Select
                            value={form.data.survey_id}
                            onChange={(event) => form.setData('survey_id', event.target.value)}
                        >
                            <option value="">All surveys</option>
                            {props.surveys.map((survey) => (
                                <option value={survey.id} key={survey.id}>
                                    {survey.title}
                                </option>
                            ))}
                        </Select>
                    </Field>
                    {props.canFilterCustomer ? (
                        <Field label="Customer">
                            <Select
                                value={form.data.customer_id}
                                onChange={(event) =>
                                    form.setData('customer_id', event.target.value)
                                }
                            >
                                <option value="">All customers</option>
                                {props.customers.map((customer) => (
                                    <option value={customer.id} key={customer.id}>
                                        {customer.name}
                                    </option>
                                ))}
                            </Select>
                        </Field>
                    ) : null}
                    <div className="flex items-end">
                        <Button type="submit" variant="outline" className="w-full">
                            Apply filters
                        </Button>
                    </div>
                </div>
            </form>

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-500">
                    Filtered to {props.feedbackMetrics.total} feedback records
                </p>
                <div className="flex flex-wrap gap-2">
                    <a
                        href={'/reports/export/csv?' + exportQuery}
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        <Download className="size-3.5" />
                        CSV
                    </a>
                    <a
                        href={'/reports/export/xlsx?' + exportQuery}
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        <FileSpreadsheet className="size-3.5" />
                        Excel
                    </a>
                    <a
                        href={'/reports/export/pdf?' + exportQuery}
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        <FileText className="size-3.5" />
                        PDF
                    </a>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Metric
                    label="Feedback received"
                    value={props.feedbackMetrics.total}
                    icon={MessageSquareText}
                />
                <Metric
                    label="Resolved"
                    value={props.feedbackMetrics.resolved}
                    icon={MessageSquareText}
                />
                <Metric
                    label="Resolution rate"
                    value={String(props.feedbackMetrics.resolutionRate) + '%'}
                    icon={BarChart3}
                />
                <Metric
                    label="Average rating"
                    value={
                        props.feedbackMetrics.averageRating
                            ? String(props.feedbackMetrics.averageRating.toFixed(1)) + ' / 5'
                            : '—'
                    }
                    icon={Star}
                />
            </div>

            <div className="mt-5 grid gap-5 xl:grid-cols-2">
                <ChartCard
                    title="Feedback trend"
                    subtitle="Submissions by day in the selected period"
                >
                    <TrendChart data={props.feedbackTrend} color="#2457c5" />
                </ChartCard>
                <ChartCard
                    title="Survey response trend"
                    subtitle="Submitted survey responses by day"
                >
                    <TrendChart data={props.surveyResponseTrend} color="#2a8a73" />
                </ChartCard>
                <ChartCard
                    title="Feedback by category"
                    subtitle="Submissions grouped by customer topic"
                >
                    <DistributionChart data={props.feedbackByCategory} />
                </ChartCard>
                <ChartCard title="Feedback by status" subtitle="Current workflow distribution">
                    <DistributionChart data={props.feedbackByStatus} />
                </ChartCard>
                <ChartCard title="Feedback by priority" subtitle="Customer care urgency levels">
                    <DistributionChart data={props.feedbackByPriority} />
                </ChartCard>
                <SurveyAnalysisCard
                    metrics={props.surveyMetrics}
                    selectedSurvey={props.selectedSurvey}
                    questions={props.questionAnalysis}
                />
            </div>

            <div className="mt-5">
                <StaffPerformanceTable staff={props.staffPerformance} />
            </div>
        </AppLayout>
    );
}

function Metric({
    label,
    value,
    icon: Icon,
}: {
    label: string;
    value: string | number;
    icon: typeof BarChart3;
}) {
    return (
        <Card>
            <CardContent className="p-5">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">{label}</span>
                    <Icon className="size-4 text-blue-700" />
                </div>
                <p className="mt-3 text-2xl font-semibold text-slate-950">{value}</p>
            </CardContent>
        </Card>
    );
}

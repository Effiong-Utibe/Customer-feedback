import type { SharedProps } from '@/types';

export type Distribution = Array<{ name: string; total: number }>;

export interface ReportQuestion {
    id: string;
    title: string;
    type: string;
    responses: number;
    distribution: Distribution;
}

export interface StaffPerformance {
    id: number;
    name: string;
    assigned_count: number;
    resolved_count: number;
}

/** Inertia response shape produced by ReportsController@index. */
export interface ReportProps extends SharedProps {
    filters: Record<string, string | number | undefined>;
    canFilterCustomer: boolean;
    customers: Array<{ id: number; name: string }>;
    surveys: Array<{ id: string; title: string; status: string }>;
    categories: Array<{ id: number; name: string }>;
    feedbackMetrics: {
        total: number;
        resolved: number;
        resolutionRate: number;
        averageRating: number;
    };
    feedbackByCategory: Distribution;
    feedbackByStatus: Distribution;
    feedbackByPriority: Distribution;
    feedbackTrend: Array<{ day: string; total: number }>;
    staffPerformance: StaffPerformance[];
    surveyMetrics: { total: number; active: number; responses: number };
    surveyResponseTrend: Array<{ day: string; total: number }>;
    selectedSurvey?: { id: string; title: string } | null;
    questionAnalysis: ReportQuestion[];
}

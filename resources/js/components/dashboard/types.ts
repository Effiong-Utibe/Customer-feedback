import type { FeedbackItem, SharedProps, SurveySummary } from '@/types';

export type DashboardRole = 'ADMIN' | 'STAFF' | 'CUSTOMER';

/** Props sent by DashboardController for each authenticated role. */
export interface DashboardProps extends SharedProps {
    role: DashboardRole;
    metrics: Record<string, number>;
    feedbackTrend?: Array<{ day: string; total: number }>;
    recentActivity?: Array<{
        id: string;
        action: string;
        description?: string | null;
        created_at: string;
        actor?: { name: string } | null;
    }>;
    recentFeedback?: Array<FeedbackItem & { customer?: { name: string } }>;
    availableSurveys?: SurveySummary[];
    notifications?: Array<{
        id: string;
        data: { message?: string; title?: string };
        created_at: string;
    }>;
}

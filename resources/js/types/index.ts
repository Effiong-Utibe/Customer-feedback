import type { PageProps } from '@inertiajs/core';

export type RoleName = 'ADMIN' | 'STAFF' | 'CUSTOMER';
export type FeedbackStatus =
    'SUBMITTED' | 'UNDER_REVIEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type FeedbackPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type SurveyStatus = 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'CLOSED' | 'ARCHIVED';
export type QuestionType =
    | 'SHORT_TEXT'
    | 'LONG_TEXT'
    | 'SINGLE_CHOICE'
    | 'MULTIPLE_CHOICE'
    | 'DROPDOWN'
    | 'RATING'
    | 'LINEAR_SCALE'
    | 'YES_NO'
    | 'DATE';

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    roles: string[];
    permissions: string[];
}

export interface Category {
    id: number;
    name: string;
    description?: string | null;
}

export interface SurveyOption {
    id?: string;
    label: string;
    value: string;
    position?: number;
}

export interface SurveyQuestion {
    id: string;
    title: string;
    description?: string | null;
    question_type: QuestionType;
    is_required: boolean;
    position: number;
    validation_rules?: { min?: number; max?: number } | null;
    is_active?: boolean;
    options: SurveyOption[];
}

export interface SurveySummary {
    id: string;
    title: string;
    description?: string | null;
    instructions?: string | null;
    status: SurveyStatus;
    starts_at?: string | null;
    ends_at?: string | null;
    is_anonymous: boolean;
    allow_multiple_submissions: boolean;
    questions?: SurveyQuestion[];
    questions_count?: number;
    responses_count?: number;
    published_at?: string | null;
}

export interface FeedbackItem {
    id: string;
    subject: string;
    body: string;
    status: FeedbackStatus;
    priority: FeedbackPriority;
    rating?: number | null;
    created_at: string;
    updated_at: string;
    category?: { id: number; name: string } | null;
    assignee?: { id: number; name: string } | null;
}

export interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

export interface SharedProps extends PageProps {
    auth: { user: AuthUser | null };
    flash: { success?: string | null; error?: string | null };
    errors: Record<string, string>;
}

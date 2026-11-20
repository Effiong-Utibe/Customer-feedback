import type { FeedbackItem } from '@/types';

export interface FeedbackDetail extends FeedbackItem {
    resolved_at?: string | null;
    customer?: { id: number; name: string };
    assignee?: { id: number; name: string } | null;
    attachments: Array<{ id: string; original_name: string; size_bytes: number }>;
    responses: Array<{
        id: string;
        body: string;
        is_internal: boolean;
        created_at: string;
        author?: { name: string } | null;
    }>;
}

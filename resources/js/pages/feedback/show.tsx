import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FeedbackConversation } from '@/components/feedback/feedback-conversation';
import { FeedbackSummary } from '@/components/feedback/feedback-summary';
import { FeedbackWorkflow } from '@/components/feedback/feedback-workflow';
import type { FeedbackDetail } from '@/components/feedback/types';
import type { SharedProps } from '@/types';
import { AppLayout } from '@/layouts/app-layout';

interface Props extends SharedProps {
    feedback: FeedbackDetail;
    staff: Array<{ id: number; name: string }>;
    canUpdate: boolean;
    canAssign: boolean;
}

/** Page entry point. Laravel's policy result controls which workflow forms appear. */
export default function FeedbackShow({ feedback, staff, canUpdate, canAssign }: Props) {
    const { auth } = usePage<Props>().props;
    const isStaff = auth.user?.roles.some((role) => role === 'ADMIN' || role === 'STAFF') ?? false;

    return (
        <AppLayout
            title="Feedback details"
            description="Review the full submission history and keep the customer informed."
            action={
                <Link
                    href="/feedback"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft className="size-4" />
                    Back to feedback
                </Link>
            }
        >
            <Head title={feedback.subject} />
            <div className="grid gap-5 xl:grid-cols-[1.45fr_.75fr]">
                <div className="space-y-5">
                    <FeedbackSummary feedback={feedback} />
                    <FeedbackConversation feedback={feedback} isStaff={isStaff} />
                </div>
                <FeedbackWorkflow
                    feedback={feedback}
                    staff={staff}
                    isStaff={isStaff}
                    canUpdate={canUpdate}
                    canAssign={canAssign}
                />
            </div>
        </AppLayout>
    );
}

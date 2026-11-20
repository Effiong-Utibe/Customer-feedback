import { usePage } from '@inertiajs/react';
import { AdminDashboard } from './admin';
import { CustomerDashboard } from './customer';
import { StaffDashboard } from './staff';
import type { DashboardProps } from './shared';

export default function Dashboard() {
    const props = usePage<DashboardProps>().props;

    // Keep role routing at the page boundary; each role component handles its own dashboard layout.
    if (props.role === 'ADMIN') {
        return (
            <AdminDashboard
                metrics={props.metrics}
                feedbackTrend={props.feedbackTrend}
                recentActivity={props.recentActivity}
            />
        );
    }

    if (props.role === 'STAFF') {
        return <StaffDashboard metrics={props.metrics} recentFeedback={props.recentFeedback} />;
    }

    return (
        <CustomerDashboard
            metrics={props.metrics}
            recentFeedback={props.recentFeedback}
            availableSurveys={props.availableSurveys}
        />
    );
}

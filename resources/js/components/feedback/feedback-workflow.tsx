import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, Select } from '@/components/ui/input';
import type { FeedbackDetail } from './types';

const statuses = [
    'SUBMITTED',
    'UNDER_REVIEW',
    'ASSIGNED',
    'IN_PROGRESS',
    'RESOLVED',
    'CLOSED',
] as const;
const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const;

export function FeedbackWorkflow({
    feedback,
    staff,
    isStaff,
    canUpdate,
    canAssign,
}: {
    feedback: FeedbackDetail;
    staff: Array<{ id: number; name: string }>;
    isStaff: boolean;
    canUpdate: boolean;
    canAssign: boolean;
}) {
    const statusForm = useForm({ status: feedback.status, priority: feedback.priority });
    const assignForm = useForm({ assigned_to_id: feedback.assignee?.id.toString() ?? '' });

    return (
        <aside className="space-y-5">
            <Card>
                <CardHeader>
                    <CardTitle>Submission details</CardTitle>
                </CardHeader>
                <CardContent>
                    <dl className="space-y-4 text-sm">
                        <div>
                            <dt className="text-xs text-slate-500">Submitted by</dt>
                            <dd className="mt-1 font-medium text-slate-800">
                                {isStaff ? (feedback.customer?.name ?? 'Customer') : 'You'}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-slate-500">Assigned to</dt>
                            <dd className="mt-1 font-medium text-slate-800">
                                {feedback.assignee?.name ?? 'Unassigned'}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-slate-500">Last updated</dt>
                            <dd className="mt-1 font-medium text-slate-800">
                                {new Date(feedback.updated_at).toLocaleString()}
                            </dd>
                        </div>
                    </dl>
                </CardContent>
            </Card>

            {canUpdate ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Update workflow</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                // This PATCH action is authorized by FeedbackPolicy on the Laravel controller.
                                statusForm.patch('/feedback/' + feedback.id);
                            }}
                            className="grid gap-4"
                        >
                            <Field label="Status" error={statusForm.errors.status}>
                                <Select
                                    value={statusForm.data.status}
                                    onChange={(event) =>
                                        statusForm.setData(
                                            'status',
                                            event.target.value as typeof statusForm.data.status,
                                        )
                                    }
                                >
                                    {statuses.map((value) => (
                                        <option key={value}>{value}</option>
                                    ))}
                                </Select>
                            </Field>
                            <Field label="Priority" error={statusForm.errors.priority}>
                                <Select
                                    value={statusForm.data.priority}
                                    onChange={(event) =>
                                        statusForm.setData(
                                            'priority',
                                            event.target.value as typeof statusForm.data.priority,
                                        )
                                    }
                                >
                                    {priorities.map((value) => (
                                        <option key={value}>{value}</option>
                                    ))}
                                </Select>
                            </Field>
                            <Button
                                type="submit"
                                variant="outline"
                                disabled={statusForm.processing}
                            >
                                Save status
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            ) : null}

            {canAssign ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Assign to staff</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                assignForm.post('/feedback/' + feedback.id + '/assign');
                            }}
                            className="grid gap-4"
                        >
                            <Field label="Staff member" error={assignForm.errors.assigned_to_id}>
                                <Select
                                    value={assignForm.data.assigned_to_id}
                                    onChange={(event) =>
                                        assignForm.setData('assigned_to_id', event.target.value)
                                    }
                                >
                                    <option value="">Select staff</option>
                                    {staff.map((member) => (
                                        <option value={member.id} key={member.id}>
                                            {member.name}
                                        </option>
                                    ))}
                                </Select>
                            </Field>
                            <Button
                                type="submit"
                                variant="outline"
                                disabled={assignForm.processing}
                            >
                                Assign feedback
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            ) : null}
        </aside>
    );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { StaffPerformance } from './report-types';

export function StaffPerformanceTable({ staff }: { staff: StaffPerformance[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Staff performance</CardTitle>
                <CardDescription>Feedback assignments and completed resolutions</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[480px] text-left text-sm">
                        <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="py-3 font-semibold">Staff member</th>
                                <th className="py-3 font-semibold">Assigned</th>
                                <th className="py-3 font-semibold">Resolved</th>
                                <th className="py-3 font-semibold">Resolution share</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {staff.map((member) => (
                                <tr key={member.id}>
                                    <td className="py-3 font-medium text-slate-800">
                                        {member.name}
                                    </td>
                                    <td className="py-3 text-slate-600">{member.assigned_count}</td>
                                    <td className="py-3 text-slate-600">{member.resolved_count}</td>
                                    <td className="py-3 text-slate-600">
                                        {member.assigned_count
                                            ? Math.round(
                                                  (member.resolved_count * 100) /
                                                      member.assigned_count,
                                              )
                                            : 0}
                                        %
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}

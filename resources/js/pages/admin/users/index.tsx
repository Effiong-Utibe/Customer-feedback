import { Head, Link, router, useForm } from '@inertiajs/react';
import { Search, UserPlus, UsersRound } from 'lucide-react';
import { EmptyState } from '@/components/common/empty-state';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { AppLayout } from '@/layouts/app-layout';
import type { AuthUser, Paginated, SharedProps } from '@/types';

interface UserRow extends Omit<AuthUser, 'permissions'> {
    staff_profile?: {
        staff_number: string;
        job_title?: string | null;
        department?: string | null;
    } | null;
    customer_profile?: { phone?: string | null; organization?: string | null } | null;
}
interface Props extends SharedProps {
    users: Paginated<UserRow>;
    filters: { q?: string; active?: string; role?: string };
    roleFilter?: string | null;
}

export default function UsersIndex({ users, filters, roleFilter }: Props) {
    const form = useForm({
        q: filters.q ?? '',
        active: filters.active ?? '',
        role: filters.role ?? '',
    });
    const title =
        roleFilter === 'CUSTOMER'
            ? 'Customers'
            : roleFilter === 'STAFF'
              ? 'Staff'
              : 'User accounts';
    const href =
        roleFilter === 'STAFF'
            ? '/admin/staff'
            : roleFilter === 'CUSTOMER'
              ? '/admin/customers'
              : '/admin/users';

    return (
        <AppLayout
            title={title}
            description="Manage accounts, activation, and system roles from one place."
            action={
                roleFilter !== 'CUSTOMER' ? (
                    <Button render={<Link href="/admin/staff/create" />}>
                        <UserPlus />
                        Add staff
                    </Button>
                ) : undefined
            }
        >
            <Head title={title} />
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    form.get(href, { preserveScroll: true });
                }}
                className="mb-5 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_180px_180px_auto] sm:items-end"
            >
                <label className="grid gap-1.5 text-xs font-semibold text-slate-600">
                    <span>Search accounts</span>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            className="pl-9"
                            value={form.data.q}
                            onChange={(event) => form.setData('q', event.target.value)}
                            placeholder="Name or email"
                        />
                    </div>
                </label>
                <label className="grid gap-1.5 text-xs font-semibold text-slate-600">
                    <span>Account status</span>
                    <Select
                        value={form.data.active}
                        onChange={(event) => form.setData('active', event.target.value)}
                    >
                        <option value="">All accounts</option>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                    </Select>
                </label>
                {!roleFilter ? (
                    <label className="grid gap-1.5 text-xs font-semibold text-slate-600">
                        <span>Role</span>
                        <Select
                            value={form.data.role}
                            onChange={(event) => form.setData('role', event.target.value)}
                        >
                            <option value="">All roles</option>
                            {['ADMIN', 'STAFF', 'CUSTOMER'].map((role) => (
                                <option key={role}>{role}</option>
                            ))}
                        </Select>
                    </label>
                ) : null}
                <Button type="submit" variant="outline">
                    Apply
                </Button>
            </form>
            {users.data.length ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[820px] text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-5 py-4 font-semibold">Account</th>
                                    <th className="px-5 py-4 font-semibold">Role</th>
                                    <th className="px-5 py-4 font-semibold">Profile</th>
                                    <th className="px-5 py-4 font-semibold">Status</th>
                                    <th className="px-5 py-4" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/70">
                                        <td className="px-5 py-4">
                                            <Link
                                                href={`/admin/users/${user.id}`}
                                                className="font-semibold text-slate-900 hover:text-blue-700"
                                            >
                                                {user.name}
                                            </Link>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {user.email}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <Select
                                                className="h-9 w-36 text-xs"
                                                value={user.roles[0] ?? 'CUSTOMER'}
                                                onChange={(event) =>
                                                    router.patch(
                                                        `/admin/users/${user.id}/role`,
                                                        { role: event.target.value },
                                                        { preserveScroll: true },
                                                    )
                                                }
                                            >
                                                {['ADMIN', 'STAFF', 'CUSTOMER'].map((role) => (
                                                    <option key={role}>{role}</option>
                                                ))}
                                            </Select>
                                        </td>
                                        <td className="px-5 py-4 text-xs text-slate-600">
                                            {user.staff_profile?.staff_number ??
                                                user.customer_profile?.organization ??
                                                '—'}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${user.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}
                                            >
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    router.patch(
                                                        `/admin/users/${user.id}/status`,
                                                        { is_active: !user.is_active },
                                                        { preserveScroll: true },
                                                    )
                                                }
                                            >
                                                {user.is_active ? 'Deactivate' : 'Activate'}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {users.last_page > 1 ? (
                        <div className="flex justify-end gap-1 border-t border-slate-100 p-4">
                            {users.links
                                .filter((link) => link.url && link.label !== '...')
                                .map((link) => (
                                    <Link
                                        key={link.label}
                                        href={link.url!}
                                        className={`rounded-lg px-3 py-2 text-xs font-semibold ${link.active ? 'bg-blue-700 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                        </div>
                    ) : null}
                </div>
            ) : (
                <EmptyState
                    icon={UsersRound}
                    title="No accounts found"
                    description="Try changing the search or status filters."
                />
            )}
        </AppLayout>
    );
}

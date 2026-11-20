import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { AppLayout } from '@/layouts/app-layout';

export default function StaffCreate() {
    const form = useForm({ name: '', email: '', staff_number: '', job_title: '', department: '' });
    return (
        <AppLayout
            title="Provision staff account"
            description="Create a staff login. The staff member can sign in after setting a password."
            action={
                <Link
                    href="/admin/staff"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600"
                >
                    <ArrowLeft className="size-4" />
                    Back to staff
                </Link>
            }
        >
            <Head title="Add staff member" />
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    form.post('/admin/staff');
                }}
                className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-8"
            >
                <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Full name" error={form.errors.name}>
                        <Input
                            autoComplete="name"
                            value={form.data.name}
                            onChange={(event) => form.setData('name', event.target.value)}
                        />
                    </Field>
                    <Field label="Email address" error={form.errors.email}>
                        <Input
                            type="email"
                            autoComplete="email"
                            value={form.data.email}
                            onChange={(event) => form.setData('email', event.target.value)}
                        />
                    </Field>
                    <Field label="Staff number" error={form.errors.staff_number}>
                        <Input
                            value={form.data.staff_number}
                            onChange={(event) => form.setData('staff_number', event.target.value)}
                            placeholder="UIV-STAFF-001"
                        />
                    </Field>
                    <Field label="Job title" error={form.errors.job_title}>
                        <Input
                            value={form.data.job_title}
                            onChange={(event) => form.setData('job_title', event.target.value)}
                            placeholder="Customer care officer"
                        />
                    </Field>
                    <Field label="Department" error={form.errors.department}>
                        <Input
                            value={form.data.department}
                            onChange={(event) => form.setData('department', event.target.value)}
                            placeholder="Customer experience"
                        />
                    </Field>
                </div>
                <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
                    <Button type="submit" size="lg" disabled={form.processing}>
                        <UserPlus />
                        {form.processing ? 'Creating account…' : 'Create staff account'}
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}

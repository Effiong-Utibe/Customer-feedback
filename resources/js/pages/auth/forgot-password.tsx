import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { AuthLayout } from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    const form = useForm({ email: '' });
    return (
        <AuthLayout
            title="Reset your password"
            description="Enter your account email and we will send you a secure reset link."
            footer={
                <Link href="/login" className="font-semibold text-blue-700 hover:text-blue-900">
                    Back to sign in
                </Link>
            }
        >
            <Head title="Forgot password" />
            {status ? (
                <div className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    {status}
                </div>
            ) : null}
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    form.post('/forgot-password');
                }}
                className="grid gap-5"
            >
                <Field label="Email address" error={form.errors.email}>
                    <Input
                        type="email"
                        autoComplete="email"
                        value={form.data.email}
                        onChange={(event) => form.setData('email', event.target.value)}
                        autoFocus
                    />
                </Field>
                <Button type="submit" size="lg" disabled={form.processing}>
                    {form.processing ? 'Sending…' : 'Send reset link'}
                </Button>
            </form>
        </AuthLayout>
    );
}

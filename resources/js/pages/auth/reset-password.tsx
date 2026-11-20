import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { AuthLayout } from '@/layouts/auth-layout';

export default function ResetPassword({
    email = '',
    token = '',
}: {
    email?: string;
    token: string;
}) {
    const form = useForm({ token, email, password: '', password_confirmation: '' });
    return (
        <AuthLayout
            title="Choose a new password"
            description="Set a new password for your UI Ventures account."
            footer={<>Need help? Contact UI Ventures support.</>}
        >
            <Head title="Reset password" />
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    form.post('/reset-password');
                }}
                className="grid gap-4"
            >
                <Field label="Email address" error={form.errors.email}>
                    <Input
                        type="email"
                        autoComplete="email"
                        value={form.data.email}
                        onChange={(event) => form.setData('email', event.target.value)}
                    />
                </Field>
                <Field label="New password" error={form.errors.password}>
                    <Input
                        type="password"
                        autoComplete="new-password"
                        value={form.data.password}
                        onChange={(event) => form.setData('password', event.target.value)}
                    />
                </Field>
                <Field label="Confirm new password" error={form.errors.password_confirmation}>
                    <Input
                        type="password"
                        autoComplete="new-password"
                        value={form.data.password_confirmation}
                        onChange={(event) =>
                            form.setData('password_confirmation', event.target.value)
                        }
                    />
                </Field>
                <Button type="submit" size="lg" disabled={form.processing}>
                    {form.processing ? 'Updating…' : 'Update password'}
                </Button>
            </form>
        </AuthLayout>
    );
}

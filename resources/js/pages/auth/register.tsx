import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { AuthLayout } from '@/layouts/auth-layout';

export default function Register() {
    const form = useForm({ name: '', email: '', password: '', password_confirmation: '' });

    return (
        <AuthLayout
            title="Create your account"
            description="Register to submit feedback and participate in customer surveys."
            footer={
                <>
                    Already registered?{' '}
                    <Link href="/login" className="font-semibold text-blue-700 hover:text-blue-900">
                        Sign in
                    </Link>
                </>
            }
        >
            <Head title="Create account" />
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    form.post('/register');
                }}
                className="grid gap-4"
            >
                <Field label="Full name" error={form.errors.name}>
                    <Input
                        autoComplete="name"
                        value={form.data.name}
                        onChange={(event) => form.setData('name', event.target.value)}
                        placeholder="Your name"
                    />
                </Field>
                <Field label="Email address" error={form.errors.email}>
                    <Input
                        type="email"
                        autoComplete="email"
                        value={form.data.email}
                        onChange={(event) => form.setData('email', event.target.value)}
                        placeholder="you@example.com"
                    />
                </Field>
                <Field
                    label="Password"
                    hint="Use at least 8 characters."
                    error={form.errors.password}
                >
                    <Input
                        type="password"
                        autoComplete="new-password"
                        value={form.data.password}
                        onChange={(event) => form.setData('password', event.target.value)}
                    />
                </Field>
                <Field label="Confirm password" error={form.errors.password_confirmation}>
                    <Input
                        type="password"
                        autoComplete="new-password"
                        value={form.data.password_confirmation}
                        onChange={(event) =>
                            form.setData('password_confirmation', event.target.value)
                        }
                    />
                </Field>
                <p className="text-xs leading-5 text-slate-500">
                    Public registration creates a customer account. Staff and administrator access
                    is provisioned by UI Ventures.
                </p>
                <Button type="submit" size="lg" disabled={form.processing}>
                    {form.processing ? 'Creating account…' : 'Create account'}
                </Button>
            </form>
        </AuthLayout>
    );
}

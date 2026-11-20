import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { AuthLayout } from '@/layouts/auth-layout';

export default function Login() {
    const form = useForm({ email: '', password: '', remember: false });

    return (
        <AuthLayout
            title="Sign in to your account"
            description="Access your feedback, surveys, or team workspace."
            footer={
                <>
                    New to the portal?{' '}
                    <Link
                        href="/register"
                        className="font-semibold text-blue-700 hover:text-blue-900"
                    >
                        Create an account
                    </Link>
                </>
            }
        >
            <Head title="Sign in" />
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    form.post('/login');
                }}
                className="grid gap-5"
            >
                <Field label="Email address" error={form.errors.email}>
                    <Input
                        type="email"
                        autoComplete="email"
                        autoFocus
                        value={form.data.email}
                        onChange={(event) => form.setData('email', event.target.value)}
                        placeholder="you@example.com"
                    />
                </Field>
                <Field label="Password" error={form.errors.password}>
                    <Input
                        type="password"
                        autoComplete="current-password"
                        value={form.data.password}
                        onChange={(event) => form.setData('password', event.target.value)}
                        placeholder="Enter your password"
                    />
                </Field>
                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-slate-600">
                        <input
                            type="checkbox"
                            checked={form.data.remember}
                            onChange={(event) => form.setData('remember', event.target.checked)}
                            className="size-4 rounded border-slate-300 text-blue-700 focus:ring-blue-500"
                        />{' '}
                        Remember me
                    </label>
                    <Link
                        href="/forgot-password"
                        className="font-semibold text-blue-700 hover:text-blue-900"
                    >
                        Forgot password?
                    </Link>
                </div>
                <Button type="submit" size="lg" disabled={form.processing}>
                    {form.processing ? 'Signing in…' : 'Sign in'}
                </Button>
            </form>
        </AuthLayout>
    );
}

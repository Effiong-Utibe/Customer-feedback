import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { AuthLayout } from '@/layouts/auth-layout';

export default function ConfirmPassword() {
    const form = useForm({ password: '' });
    return (
        <AuthLayout
            title="Confirm your password"
            description="For your security, enter your password before continuing."
            footer={<>Your password stays private and is never shown to staff.</>}
        >
            <Head title="Confirm password" />
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    form.post('/confirm-password');
                }}
                className="grid gap-5"
            >
                <Field label="Password" error={form.errors.password}>
                    <Input
                        type="password"
                        autoComplete="current-password"
                        autoFocus
                        value={form.data.password}
                        onChange={(event) => form.setData('password', event.target.value)}
                    />
                </Field>
                <Button type="submit" size="lg" disabled={form.processing}>
                    {form.processing ? 'Confirming…' : 'Confirm password'}
                </Button>
            </form>
        </AuthLayout>
    );
}

import { Head, useForm, usePage } from '@inertiajs/react';
import { KeyRound, Save, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { AppLayout } from '@/layouts/app-layout';
import type { SharedProps } from '@/types';

interface Profile {
    name: string;
    email: string;
    phone?: string | null;
    organization?: string | null;
    jobTitle?: string | null;
    department?: string | null;
}

export default function ProfilePage({ profile }: { profile: Profile }) {
    const { auth } = usePage<SharedProps>().props;
    const profileForm = useForm({ name: profile.name, email: profile.email });
    const passwordForm = useForm({ current_password: '', password: '', password_confirmation: '' });

    return (
        <AppLayout title="Profile settings" description="Manage your account details and security.">
            <Head title="Profile settings" />
            <div className="grid gap-5 xl:grid-cols-2">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
                    <div className="flex items-center gap-3">
                        <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-700">
                            <UserRound className="size-5" />
                        </span>
                        <div>
                            <h2 className="font-semibold text-slate-900">Personal information</h2>
                            <p className="mt-1 text-xs text-slate-500">
                                Update the name and email used for sign in.
                            </p>
                        </div>
                    </div>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            profileForm.put('/user/profile-information');
                        }}
                        className="mt-6 grid gap-4"
                    >
                        <Field label="Full name" error={profileForm.errors.name}>
                            <Input
                                value={profileForm.data.name}
                                onChange={(event) =>
                                    profileForm.setData('name', event.target.value)
                                }
                            />
                        </Field>
                        <Field label="Email address" error={profileForm.errors.email}>
                            <Input
                                type="email"
                                autoComplete="email"
                                value={profileForm.data.email}
                                onChange={(event) =>
                                    profileForm.setData('email', event.target.value)
                                }
                            />
                        </Field>
                        {profile.phone ||
                        profile.organization ||
                        profile.jobTitle ||
                        profile.department ? (
                            <div className="grid gap-3 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
                                {profile.phone ? (
                                    <div>
                                        <p className="text-xs text-slate-500">Phone</p>
                                        <p className="mt-1 font-medium text-slate-800">
                                            {profile.phone}
                                        </p>
                                    </div>
                                ) : null}
                                {profile.organization ? (
                                    <div>
                                        <p className="text-xs text-slate-500">Organization</p>
                                        <p className="mt-1 font-medium text-slate-800">
                                            {profile.organization}
                                        </p>
                                    </div>
                                ) : null}
                                {profile.jobTitle ? (
                                    <div>
                                        <p className="text-xs text-slate-500">Job title</p>
                                        <p className="mt-1 font-medium text-slate-800">
                                            {profile.jobTitle}
                                        </p>
                                    </div>
                                ) : null}
                                {profile.department ? (
                                    <div>
                                        <p className="text-xs text-slate-500">Department</p>
                                        <p className="mt-1 font-medium text-slate-800">
                                            {profile.department}
                                        </p>
                                    </div>
                                ) : null}
                            </div>
                        ) : null}
                        {auth.user?.email !== profileForm.data.email ? (
                            <p className="text-xs leading-5 text-amber-700">
                                Changing your email requires verifying the new address before you
                                can continue.
                            </p>
                        ) : null}
                        <div className="flex justify-end border-t border-slate-100 pt-4">
                            <Button type="submit" disabled={profileForm.processing}>
                                <Save />
                                Save profile
                            </Button>
                        </div>
                    </form>
                </section>
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
                    <div className="flex items-center gap-3">
                        <span className="grid size-10 place-items-center rounded-xl bg-violet-50 text-violet-700">
                            <KeyRound className="size-5" />
                        </span>
                        <div>
                            <h2 className="font-semibold text-slate-900">Change password</h2>
                            <p className="mt-1 text-xs text-slate-500">
                                Use your current password to set a new one.
                            </p>
                        </div>
                    </div>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            passwordForm.put('/user/password', {
                                onSuccess: () => passwordForm.reset(),
                            });
                        }}
                        className="mt-6 grid gap-4"
                    >
                        <Field
                            label="Current password"
                            error={passwordForm.errors.current_password}
                        >
                            <Input
                                type="password"
                                autoComplete="current-password"
                                value={passwordForm.data.current_password}
                                onChange={(event) =>
                                    passwordForm.setData('current_password', event.target.value)
                                }
                            />
                        </Field>
                        <Field label="New password" error={passwordForm.errors.password}>
                            <Input
                                type="password"
                                autoComplete="new-password"
                                value={passwordForm.data.password}
                                onChange={(event) =>
                                    passwordForm.setData('password', event.target.value)
                                }
                            />
                        </Field>
                        <Field
                            label="Confirm new password"
                            error={passwordForm.errors.password_confirmation}
                        >
                            <Input
                                type="password"
                                autoComplete="new-password"
                                value={passwordForm.data.password_confirmation}
                                onChange={(event) =>
                                    passwordForm.setData(
                                        'password_confirmation',
                                        event.target.value,
                                    )
                                }
                            />
                        </Field>
                        <div className="flex justify-end border-t border-slate-100 pt-4">
                            <Button
                                type="submit"
                                variant="outline"
                                disabled={passwordForm.processing}
                            >
                                {passwordForm.processing ? 'Updating…' : 'Update password'}
                            </Button>
                        </div>
                    </form>
                </section>
            </div>
        </AppLayout>
    );
}

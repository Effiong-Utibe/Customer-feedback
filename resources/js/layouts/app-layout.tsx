import { Link, router, usePage } from '@inertiajs/react';
import {
    BarChart3,
    ClipboardList,
    Headphones,
    LayoutDashboard,
    LogOut,
    Menu,
    ShieldCheck,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import type { SharedProps } from '@/types';
import { BrandMark } from '@/components/common/brand-mark';

interface NavItem {
    label: string;
    href: string;
    icon: typeof LayoutDashboard;
}

export function AppLayout({
    children,
    title,
    description,
    action,
}: {
    children: ReactNode;
    title?: string;
    description?: string;
    action?: ReactNode;
}) {
    const { auth, flash } = usePage<SharedProps>().props;
    const user = auth.user;
    const role = user?.roles[0] ?? 'CUSTOMER';
    const [mobileOpen, setMobileOpen] = useState(false);
    const path = usePage().url.split('?')[0];

    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
    }, [flash.success, flash.error]);

    // Keep the navigation role-aware so users only see links available to their permissions.
    const items: NavItem[] =
        role === 'ADMIN'
            ? [
                  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
                  { label: 'Feedback', href: '/feedback', icon: Headphones },
                  { label: 'Survey management', href: '/admin/surveys', icon: ClipboardList },
                  { label: 'Customers', href: '/admin/customers', icon: Users },
                  { label: 'Staff', href: '/admin/staff', icon: Users },
                  { label: 'All users', href: '/admin/users', icon: Users },
                  { label: 'Reports', href: '/reports', icon: BarChart3 },
                  { label: 'Audit activity', href: '/admin/audit-logs', icon: ShieldCheck },
              ]
            : role === 'STAFF'
              ? [
                    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
                    { label: 'Assigned feedback', href: '/feedback', icon: Headphones },
                    { label: 'Surveys', href: '/admin/surveys', icon: ClipboardList },
                    { label: 'Reports', href: '/reports', icon: BarChart3 },
                ]
              : [
                    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
                    { label: 'My feedback', href: '/feedback', icon: Headphones },
                    { label: 'Surveys', href: '/surveys', icon: ClipboardList },
                ];

    const sidebar = (
        <>
            <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
                <BrandMark compact dark />
                <button
                    type="button"
                    aria-label="Close navigation"
                    onClick={() => setMobileOpen(false)}
                    className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden"
                >
                    <X className="size-5" />
                </button>
            </div>
            <div className="px-4 pt-7">
                <p className="px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">
                    Workspace
                </p>
                <nav className="mt-3 grid gap-1">
                    {items.map(({ label, href, icon: Icon }) => {
                        const active =
                            path === href || (href !== '/dashboard' && path.startsWith(`${href}/`));
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'}`}
                            >
                                <Icon className={`size-[18px] ${active ? 'text-blue-300' : ''}`} />
                                <span>{label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="mt-auto border-t border-white/10 p-4">
                <Link
                    href="/settings/profile"
                    className="mb-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white"
                >
                    <Users className="size-4" />
                    Profile settings
                </Link>
                <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
                    <div className="grid size-9 shrink-0 place-items-center rounded-full bg-blue-100 text-xs font-bold text-blue-800">
                        {user?.name
                            .split(' ')
                            .slice(0, 2)
                            .map((part) => part[0])
                            .join('')
                            .toUpperCase() ?? 'UI'}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">{user?.name}</p>
                        <p className="mt-0.5 text-[10px] font-semibold tracking-wide text-slate-400">
                            {role}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => router.post('/logout')}
                        aria-label="Sign out"
                        title="Sign out"
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                    >
                        <LogOut className="size-4" />
                    </button>
                </div>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-slate-50 lg:flex">
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-[#111d31] lg:flex">
                {sidebar}
            </aside>
            {mobileOpen ? (
                <div
                    className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            ) : null}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#111d31] shadow-2xl transition-transform lg:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {sidebar}
            </aside>
            <div className="min-w-0 flex-1 lg:ml-64">
                <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur md:px-8">
                    <button
                        type="button"
                        aria-label="Open navigation"
                        onClick={() => setMobileOpen(true)}
                        className="mr-3 grid size-10 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
                    >
                        <Menu className="size-5" />
                    </button>
                    <div className="hidden text-xs font-medium text-slate-400 sm:block">
                        UI Ventures <span className="px-1.5 text-slate-300">/</span>{' '}
                        {role.toLowerCase()}
                    </div>
                    <div className="ml-auto flex items-center gap-3">
                        <span className="hidden text-xs text-slate-500 sm:block">
                            University of Ibadan
                        </span>
                        <div className="grid size-9 place-items-center rounded-full border border-blue-100 bg-blue-50 text-xs font-semibold text-blue-800">
                            {user?.name.slice(0, 1).toUpperCase() ?? 'U'}
                        </div>
                    </div>
                </header>
                <main className="mx-auto w-full max-w-[1440px] px-4 py-7 md:px-8 md:py-9">
                    {title ? (
                        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="mb-2 text-xs font-semibold uppercase tracking-[.16em] text-blue-700">
                                    {role === 'CUSTOMER'
                                        ? 'Customer portal'
                                        : 'Management workspace'}
                                </p>
                                <h1 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-[30px]">
                                    {title}
                                </h1>
                                {description ? (
                                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                        {description}
                                    </p>
                                ) : null}
                            </div>
                            {action ? <div className="shrink-0">{action}</div> : null}
                        </div>
                    ) : null}
                    {children}
                </main>
            </div>
        </div>
    );
}

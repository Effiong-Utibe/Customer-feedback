import type { ReactNode } from 'react';
import { ShieldCheck } from 'lucide-react';
import { BrandMark } from '@/components/common/brand-mark';

export function AuthLayout({
    children,
    title,
    description,
    footer,
}: {
    children: ReactNode;
    title: string;
    description: string;
    footer: ReactNode;
}) {
    return (
        <main className="surface-grid relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f7fb] px-4 py-10">
            <div className="absolute -right-24 -top-28 size-[420px] rounded-full bg-blue-100/70 blur-3xl" />
            <div className="absolute -bottom-36 -left-24 size-[420px] rounded-full bg-indigo-100/70 blur-3xl" />
            <div className="relative grid w-full max-w-[1020px] overflow-hidden rounded-[28px] border border-white bg-white shadow-[0_25px_80px_-30px_rgba(15,23,42,.28)] lg:grid-cols-[.92fr_1.08fr]">
                <section className="hidden flex-col justify-between bg-[#111d31] p-10 text-white lg:flex xl:p-12">
                    <div>
                        <BrandMark dark />
                        <p className="mt-16 text-xs font-bold uppercase tracking-[.2em] text-blue-300">
                            Listen. Improve. Grow.
                        </p>
                        <h2 className="mt-4 max-w-sm text-3xl font-semibold leading-tight tracking-tight">
                            Better service starts with your voice.
                        </h2>
                        <p className="mt-4 max-w-sm text-sm leading-7 text-slate-300">
                            Share feedback, take part in surveys, and stay connected with the UI
                            Ventures team.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <ShieldCheck className="size-4 text-emerald-300" /> Your account and
                        submissions are protected.
                    </div>
                </section>
                <section className="px-6 py-9 sm:px-10 sm:py-12 xl:px-14">
                    <div className="mb-8 lg:hidden">
                        <BrandMark compact />
                    </div>
                    <div className="mx-auto max-w-md">
                        <p className="text-xs font-semibold uppercase tracking-[.16em] text-blue-700">
                            University of Ibadan
                        </p>
                        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                            {title}
                        </h1>
                        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
                        <div className="mt-7">{children}</div>
                        <div className="mt-7 border-t border-slate-100 pt-5 text-sm text-slate-500">
                            {footer}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

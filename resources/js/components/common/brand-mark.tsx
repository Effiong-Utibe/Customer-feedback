import { Link } from '@inertiajs/react';

/** Shared brand mark keeps the logo and wordmark consistent across layouts. */
export function BrandMark({
    compact = false,
    dark = false,
}: {
    compact?: boolean;
    dark?: boolean;
}) {
    return (
        <Link href="/" className="inline-flex items-center gap-3" aria-label="UI Ventures home">
            <img
                src="/images/ui.png"
                alt="UI Ventures logo"
                className={`${compact ? 'size-10' : 'size-11'} shrink-0 rounded-xl object-contain ${dark ? 'bg-white p-1' : ''}`}
            />
            <span>
                <span
                    className={`block text-sm font-semibold tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}
                >
                    UI Ventures
                </span>
                <span
                    className={`mt-0.5 block text-[11px] ${dark ? 'text-slate-400' : 'text-slate-500'}`}
                >
                    Customer experience
                </span>
            </span>
        </Link>
    );
}

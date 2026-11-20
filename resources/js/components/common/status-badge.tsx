import { cn } from '@/lib/utils';

const palette: Record<string, string> = {
    SUBMITTED: 'bg-sky-50 text-sky-700 ring-sky-600/15',
    UNDER_REVIEW: 'bg-amber-50 text-amber-700 ring-amber-600/15',
    ASSIGNED: 'bg-violet-50 text-violet-700 ring-violet-600/15',
    IN_PROGRESS: 'bg-blue-50 text-blue-700 ring-blue-600/15',
    RESOLVED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15',
    CLOSED: 'bg-slate-100 text-slate-600 ring-slate-500/15',
    DRAFT: 'bg-slate-100 text-slate-600 ring-slate-500/15',
    SCHEDULED: 'bg-indigo-50 text-indigo-700 ring-indigo-600/15',
    ACTIVE: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15',
    ARCHIVED: 'bg-slate-100 text-slate-500 ring-slate-500/15',
    LOW: 'bg-slate-100 text-slate-600 ring-slate-500/15',
    MEDIUM: 'bg-blue-50 text-blue-700 ring-blue-600/15',
    HIGH: 'bg-amber-50 text-amber-700 ring-amber-600/15',
    URGENT: 'bg-red-50 text-red-700 ring-red-600/15',
};

export function StatusBadge({ value, className }: { value: string; className?: string }) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ring-1 ring-inset',
                palette[value] ?? palette.CLOSED,
                className,
            )}
        >
            {value.replaceAll('_', ' ')}
        </span>
    );
}

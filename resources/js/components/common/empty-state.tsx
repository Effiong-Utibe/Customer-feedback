import type { LucideIcon } from 'lucide-react';

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
}: {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
            <span className="grid size-12 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                <Icon className="size-5" />
            </span>
            <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">{description}</p>
            {action ? <div className="mt-5">{action}</div> : null}
        </div>
    );
}

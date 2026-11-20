import type { LucideIcon } from 'lucide-react';

export function StatCard({
    label,
    value,
    note,
    icon: Icon,
    tone = 'blue',
}: {
    label: string;
    value: string | number;
    note?: string;
    icon: LucideIcon;
    tone?: 'blue' | 'green' | 'amber' | 'violet';
}) {
    const tones = {
        blue: 'bg-blue-50 text-blue-700',
        green: 'bg-emerald-50 text-emerald-700',
        amber: 'bg-amber-50 text-amber-700',
        violet: 'bg-violet-50 text-violet-700',
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-slate-500">{label}</p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                        {value}
                    </p>
                    {note ? <p className="mt-1.5 text-xs text-slate-500">{note}</p> : null}
                </div>
                <span className={`grid size-10 place-items-center rounded-xl ${tones[tone]}`}>
                    <Icon className="size-5" />
                </span>
            </div>
        </div>
    );
}

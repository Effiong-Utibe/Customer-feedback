import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const controlClass =
    'w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:bg-slate-100';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
    return <input className={cn(controlClass, 'h-10', className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea className={cn(controlClass, 'min-h-28 py-3 leading-6', className)} {...props} />
    );
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
    return <select className={cn(controlClass, 'h-10', className)} {...props} />;
}

export function Field({
    label,
    hint,
    error,
    children,
}: {
    label: string;
    hint?: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            <span>{label}</span>
            {children}
            {error ? (
                <span className="text-xs font-normal text-red-600">{error}</span>
            ) : hint ? (
                <span className="text-xs font-normal text-slate-500">{hint}</span>
            ) : null}
        </label>
    );
}

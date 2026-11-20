import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/** Shared shadcn-style card primitives keep page sections visually consistent. */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            data-slot="card"
            className={cn('rounded-xl border bg-white text-slate-950 shadow-sm', className)}
            {...props}
        />
    );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            data-slot="card-header"
            className={cn('flex flex-col gap-1.5 p-5 md:p-6', className)}
            {...props}
        />
    );
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h2
            data-slot="card-title"
            className={cn('font-semibold leading-none tracking-tight', className)}
            {...props}
        />
    );
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p
            data-slot="card-description"
            className={cn('text-sm text-slate-500', className)}
            {...props}
        />
    );
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            data-slot="card-content"
            className={cn('px-5 pb-5 md:px-6 md:pb-6', className)}
            {...props}
        />
    );
}

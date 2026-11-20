import { Button as ButtonPrimitive } from '@base-ui/react/button';
import type { ComponentProps, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// CVA keeps variants composable and follows the shadcn component pattern.
const buttonVariants = cva(
    'inline-flex shrink-0 items-center justify-center gap-2 font-semibold transition-colors outline-none focus-visible:ring-4 focus-visible:ring-blue-100 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                primary:
                    'bg-blue-700 text-white shadow-sm hover:bg-blue-800 focus-visible:ring-blue-600',
                secondary: 'bg-blue-50 text-blue-800 hover:bg-blue-100 focus-visible:ring-blue-500',
                outline:
                    'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-blue-500',
                ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-blue-500',
                danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
            },
            size: {
                sm: 'h-8 rounded-md px-3 text-xs',
                md: 'h-10 rounded-lg px-4 text-sm',
                lg: 'h-12 rounded-xl px-5 text-sm',
                icon: 'size-10 rounded-lg',
            },
        },
        defaultVariants: { variant: 'primary', size: 'md' },
    },
);

type ButtonProps = ComponentProps<typeof ButtonPrimitive> &
    VariantProps<typeof buttonVariants> & {
        children?: ReactNode;
    };

export function Button({ variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
    return (
        <ButtonPrimitive
            data-slot="button"
            className={cn(buttonVariants({ variant, size }), className)}
            {...props}
        />
    );
}

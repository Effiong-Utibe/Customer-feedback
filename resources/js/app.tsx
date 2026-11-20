// Load the shared Tailwind theme and base styles once for every Inertia page.
import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import type { ComponentType } from 'react';
import { Toaster } from 'sonner';

// Inertia supplies each page's own props at runtime; `unknown` from Vite's
// untyped glob cannot express that component contract at this boundary.
type InertiaPageModule = { default: ComponentType<any> };
const pages = import.meta.glob<InertiaPageModule>('./pages/**/*.tsx');

void createInertiaApp({
    title: (title) => (title ? `${title} · UI Ventures` : 'UI Ventures Feedback'),
    resolve: async (name) => {
        const path = `./pages/${name}.tsx`;
        const load = pages[path];
        if (!load) throw new Error(`Inertia page not found: ${name}`);
        // Return the component itself so Inertia's resolver sees a React
        // component rather than Vite's generic module wrapper.
        return load().then((page) => page.default);
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <>
                <App {...props} />
                <Toaster position="top-right" richColors />
            </>,
        );
    },
});

import type { ReactNode } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Distribution } from './report-types';

const chartColors = ['#2457c5', '#2a8a73', '#8b66d2', '#f2a83b', '#d96558', '#60748b'];

export function ChartCard({
    title,
    subtitle,
    children,
}: {
    title: string;
    subtitle: string;
    children: ReactNode;
}) {
    return (
        <Card>
            <CardHeader className="pb-0">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{subtitle}</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="h-64">{children}</div>
            </CardContent>
        </Card>
    );
}

/** Render category, status, and priority totals with a shared color palette. */
export function DistributionChart({ data }: { data: Distribution }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 10, left: -24, bottom: 20 }}>
                <CartesianGrid stroke="#eef2f7" vertical={false} />
                <XAxis
                    dataKey="name"
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                />
                <Tooltip
                    contentStyle={{ borderRadius: 12, borderColor: '#e2e8f0', fontSize: 12 }}
                />
                <Bar dataKey="total" radius={[5, 5, 0, 0]}>
                    {data.map((item, index) => (
                        <Cell key={item.name} fill={chartColors[index % chartColors.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

export function TrendChart({
    data,
    color,
}: {
    data: Array<{ day: string; total: number }>;
    color: string;
}) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                <CartesianGrid stroke="#eef2f7" vertical={false} />
                <XAxis
                    dataKey="day"
                    tickFormatter={(day) =>
                        new Date(day).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                        })
                    }
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                />
                <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                />
                <Tooltip />
                <Line
                    type="monotone"
                    dataKey="total"
                    stroke={color}
                    strokeWidth={3}
                    dot={{ fill: color, r: 3 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

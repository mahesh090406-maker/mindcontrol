"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
    { day: '1', mood: 65, sleep: 70 },
    { day: '5', mood: 59, sleep: 65 },
    { day: '10', mood: 80, sleep: 85 },
    { day: '15', mood: 81, sleep: 75 },
    { day: '20', mood: 56, sleep: 60 },
    { day: '25', mood: 90, sleep: 88 },
    { day: '30', mood: 85, sleep: 90 },
];

export default function MoodHistoryChart() {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-80">
            <h3 className="text-sm font-bold text-slate-800 mb-6">30-Day Mood History</h3>
            <ResponsiveContainer width="100%" height="90%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: "20px" }} />
                    <Line
                        type="monotone"
                        dataKey="mood"
                        stroke="#0ea5e9"
                        strokeWidth={3}
                        dot={{ fill: '#0ea5e9', strokeWidth: 0, r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Mood Score"
                    />
                    <Line
                        type="monotone"
                        dataKey="sleep"
                        stroke="#818cf8"
                        strokeWidth={3}
                        dot={false}
                        strokeDasharray="5 5"
                        name="Sleep Quality"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

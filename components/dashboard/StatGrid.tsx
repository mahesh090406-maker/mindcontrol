"use client";

import { TrendingUp, Activity, Moon, Sun } from "lucide-react";

export default function StatGrid() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatItem
                icon={TrendingUp}
                label="Avg Mood"
                value="78%"
                trend="+5%"
                color="cyan"
            />
            <StatItem
                icon={Moon}
                label="Avg Sleep"
                value="6.5h"
                trend="-0.5h"
                color="indigo"
                trendDown
            />
            <StatItem
                icon={Activity}
                label="Consistency"
                value="92%"
                trend="High"
                color="emerald"
            />
            <StatItem
                icon={Sun}
                label="Best Time"
                value="Morning"
                trend="9AM"
                color="orange"
            />
        </div>
    )
}

function StatItem({ icon: Icon, label, value, trend, color, trendDown }: any) {
    const colors = {
        cyan: "bg-cyan-50 text-cyan-600",
        indigo: "bg-indigo-50 text-indigo-600",
        emerald: "bg-emerald-50 text-emerald-600",
        orange: "bg-orange-50 text-orange-600",
    };

    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
                <div className={`p-2 rounded-xl ${colors[color as keyof typeof colors]}`}>
                    <Icon size={18} />
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${trendDown ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-500"}`}>
                    {trend}
                </span>
            </div>
            <div>
                <h4 className="text-2xl font-bold text-slate-800">{value}</h4>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mt-1">{label}</p>
            </div>
        </div>
    )
}

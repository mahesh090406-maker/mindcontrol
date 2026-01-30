"use client";

import { Info } from "lucide-react";
import CircularGauge from "./CircularGauge";

export default function WellbeingIndex() {
    return (
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-lg font-bold text-slate-800">Well-being Index</h2>
                    <p className="text-sm text-slate-500">Weekly average score</p>
                </div>
                <button className="text-slate-400 hover:text-teal-600 transition-colors">
                    <Info size={20} />
                </button>
            </div>

            <div className="flex items-center justify-around gap-4 flex-wrap">
                <div className="flex flex-col items-center">
                    <CircularGauge value={78} label="Overall" color="#0d9488" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <CircularGauge value={85} label="Mood" color="#f59e0b" />
                    <CircularGauge value={62} label="sleep" color="#6366f1" />
                </div>
            </div>

            <div className="mt-6 p-4 bg-teal-50 rounded-xl border border-teal-100 flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-teal-500 shrink-0" />
                <p className="text-sm text-teal-800 font-medium">
                    Your score improved by <span className="font-bold">+12%</span> compared to last week. Keep up the good work!
                </p>
            </div>
        </section>
    );
}

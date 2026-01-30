"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface RangeSliderProps {
    label: string;
    question: string;
    minLabel: string;
    midLabel: string;
    maxLabel: string;
    value: number;
    onChange: (val: number) => void;
}

export default function RangeSlider({
    label,
    question,
    minLabel,
    midLabel,
    maxLabel,
    value,
    onChange
}: RangeSliderProps) {
    const [isDragging, setIsDragging] = useState(false);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 transition-all hover:shadow-md">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">{label}</h3>
                <span className="text-xs font-semibold text-cyan-600 bg-cyan-50 px-2 py-1 rounded-md">
                    {value}%
                </span>
            </div>

            <p className="text-sm text-slate-600 mb-6 font-medium">{question}</p>

            <div className="relative h-12 flex items-center">
                {/* Track */}
                <div className="absolute w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-cyan-400 to-teal-500"
                        style={{ width: `${value}%` }}
                        layoutId="sliderTrack"
                    />
                </div>

                {/* Input (Invisible overlay for interaction) */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    onMouseDown={() => setIsDragging(true)}
                    onMouseUp={() => setIsDragging(false)}
                    onTouchStart={() => setIsDragging(true)}
                    onTouchEnd={() => setIsDragging(false)}
                    className="absolute w-full h-full opacity-0 cursor-pointer z-20"
                />

                {/* Custom Thumb - Animated with Framer Motion */}
                <motion.div
                    className="absolute h-6 w-6 bg-white border-2 border-cyan-500 rounded-full shadow-md z-10 pointer-events-none flex items-center justify-center"
                    style={{ left: `calc(${value}% - 12px)` }}
                    animate={{
                        scale: isDragging ? 1.2 : 1,
                        boxShadow: isDragging ? "0 0 0 4px rgba(6, 182, 212, 0.2)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                    }}
                >
                    <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                </motion.div>
            </div>

            <div className="flex justify-between text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-2">
                <span>{minLabel}</span>
                <span>{midLabel}</span>
                <span>{maxLabel}</span>
            </div>
        </div>
    );
}

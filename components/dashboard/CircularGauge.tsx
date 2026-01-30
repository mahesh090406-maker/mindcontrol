"use client";

import { useEffect, useState } from "react";

interface CircularGaugeProps {
    value: number; // 0 to 100
    label: string;
    color?: string;
}

export default function CircularGauge({ value, label, color = "#14b8a6" }: CircularGaugeProps) {
    const [animatedValue, setAnimatedValue] = useState(0);
    const radius = 50;
    const strokeWidth = 10;
    const normalizedRadius = radius - strokeWidth * 0.5;
    const circumference = normalizedRadius * 2 * Math.PI;

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedValue(value);
        }, 100);
        return () => clearTimeout(timer);
    }, [value]);

    const strokeDashoffset = circumference - (animatedValue / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="relative w-32 h-32 flex items-center justify-center">
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    className="rotate-[-90deg] transition-all duration-1000 ease-out"
                >
                    {/* Background Circle */}
                    <circle
                        stroke="#e2e8f0"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    {/* Progress Circle */}
                    <circle
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference + " " + circumference}
                        style={{ strokeDashoffset }}
                        strokeLinecap="round"
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-bold text-slate-800">{Math.round(animatedValue)}</span>
                    <span className="text-xs text-slate-400 font-medium">%</span>
                </div>
            </div>
            <h3 className="mt-3 text-sm font-semibold text-slate-600">{label}</h3>
        </div>
    );
}

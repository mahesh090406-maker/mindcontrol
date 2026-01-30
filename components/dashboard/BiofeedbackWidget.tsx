"use client";

import { Activity, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function BiofeedbackWidget() {
    // In a real app, this would subscribe to a global context or store.
    // For now, it shows the entry point and status.
    // We can simulate a "Connected" state if we had global state.

    return (
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-6 text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden group">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-colors" />

            <div className="relative z-10 flex justify-between items-start mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                            <Activity size={20} className="text-indigo-200" />
                        </div>
                        <span className="font-bold text-indigo-100 text-sm uppercase tracking-wider">Biofeedback</span>
                    </div>
                    <h3 className="text-2xl font-bold">Connect Sensor</h3>
                </div>
                <div className="w-2 h-2 rounded-full bg-indigo-400" />
            </div>

            <div className="relative z-10">
                <p className="text-indigo-200 text-sm mb-6">
                    Connect your GSR device to track real-time stress levels and unlock biofeedback training.
                </p>
                <Link
                    href="/gsr"
                    className="flex items-center justify-between bg-white text-indigo-900 px-4 py-3 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors"
                >
                    <span>Open Monitor</span>
                    <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );
}

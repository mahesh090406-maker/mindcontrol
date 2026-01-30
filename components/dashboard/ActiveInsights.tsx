"use client";

import { Brain, Book, ChevronRight, Lightbulb, Headphones } from "lucide-react";
import { useState } from "react";
import JournalModal from "./JournalModal";
import ResourcePlayer from "../resources/ResourcePlayer";

export default function ActiveInsights() {
    const [showJournal, setShowJournal] = useState(false);
    const [selectedResource, setSelectedResource] = useState<any>(null);

    return (
        <div className="mb-24">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-1">Active Insights</h3>

            <div className="grid grid-cols-2 gap-4 mb-8">
                {/* Daily Mindset - Opens Breathing Resource */}
                <div
                    onClick={() => setSelectedResource({
                        title: "Daily Mindset",
                        subtitle: "Audio • 5 min",
                        type: "audio",
                        icon: Headphones,
                        color: "text-sky-600",
                        // Reusing sample audio
                        audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditative-rain-114354.mp3"
                    })}
                    className="bg-sky-50 rounded-2xl p-4 flex flex-col justify-between h-32 hover:bg-sky-100 transition-colors cursor-pointer active:scale-95 duration-200"
                >
                    <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 mb-2">
                        <Brain size={18} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm">Daily Mindset</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-tight">Take 5 minutes to breathe today.</p>
                    </div>
                </div>

                {/* Journaling - Opens Journal Modal */}
                <div
                    onClick={() => setShowJournal(true)}
                    className="bg-slate-50 rounded-2xl p-4 flex flex-col justify-between h-32 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-100 active:scale-95 duration-200"
                >
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 mb-2">
                        <Book size={18} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm">Journaling</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-tight">3 new entries this week.</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex-shrink-0 flex items-center justify-center text-orange-500 mt-1">
                        <Lightbulb size={20} />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-800 text-sm">Interaction Stability</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">Your phone usage is consistent with your baseline. Good job maintaining balance.</p>
                    </div>
                    <ChevronRight size={20} className="text-slate-300 self-center" />
                </div>
            </div>

            {/* Modals */}
            <JournalModal isOpen={showJournal} onClose={() => setShowJournal(false)} />
            <ResourcePlayer resource={selectedResource} onClose={() => setSelectedResource(null)} />
        </div>
    );
}

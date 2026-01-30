"use client";

import DashboardHeader from "@/components/layout/DashboardHeader";
import ResourcePlayer from "@/components/resources/ResourcePlayer";
import { Play, BookOpen, Headphones, ChevronRight, Wind, Moon, Sun, Activity } from "lucide-react";
import { useState } from "react";

export default function ResourcesPage() {
    const [selectedResource, setSelectedResource] = useState<any>(null);
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = ["All", "Meditation", "Sleep", "Anxiety", "Focus"];

    // Sample Data Database
    const resources = [
        {
            title: "Understanding Burnout",
            subtitle: "Article • 5 min read",
            type: "article",
            category: "Anxiety",
            icon: BookOpen,
            color: "text-orange-500",
            bgColor: "bg-orange-50",
            content: "Burnout is a state of emotional, physical, and mental exhaustion caused by excessive and prolonged stress..."
        },
        {
            title: "Sleep Sounds: Rain",
            subtitle: "Audio • 45 min",
            type: "audio",
            category: "Sleep",
            icon: Headphones,
            color: "text-indigo-500",
            bgColor: "bg-indigo-50",
            audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditative-rain-114354.mp3"
        },
        {
            title: "Box Breathing",
            subtitle: "Guide • 3 min",
            type: "article",
            category: "Anxiety",
            icon: Wind,
            color: "text-sky-500",
            bgColor: "bg-sky-50"
        },
        {
            title: "Deep Focus Music",
            subtitle: "Audio • 1 hour",
            type: "audio",
            category: "Focus",
            icon: Headphones,
            color: "text-emerald-500",
            bgColor: "bg-emerald-50",
            audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditative-rain-114354.mp3"
        },
        {
            title: "Morning Affirmations",
            subtitle: "Audio • 5 min",
            type: "audio",
            category: "Meditation",
            icon: Sun,
            color: "text-amber-500",
            bgColor: "bg-amber-50",
            audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditative-rain-114354.mp3"
        },
        {
            title: "Evening Wind Down",
            subtitle: "Audio • 15 min",
            type: "audio",
            category: "Sleep",
            icon: Moon,
            color: "text-violet-500",
            bgColor: "bg-violet-50",
            audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditative-rain-114354.mp3"
        }
    ];

    // Filter Logic
    const filteredResources = activeCategory === "All"
        ? resources
        : resources.filter(r => r.category === activeCategory);

    return (
        <div className="min-h-screen bg-slate-50 pb-24 lg:pb-8">
            <DashboardHeader />

            <main className="px-6 space-y-6 max-w-4xl mx-auto">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-800">Library</h2>
                    <button
                        onClick={() => setActiveCategory("All")}
                        className="text-sm font-semibold text-cyan-600 hover:text-cyan-700 active:scale-95 transition-transform"
                    >
                        View All
                    </button>
                </div>

                {/* Categories */}
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                    {categories.map(cat => (
                        <CategoryBadge
                            key={cat}
                            label={cat}
                            active={activeCategory === cat}
                            onClick={() => setActiveCategory(cat)}
                        />
                    ))}
                </div>

                {/* Featured (Only show on All or Meditation) */}
                {(activeCategory === "All" || activeCategory === "Meditation") && (
                    <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-teal-900/10 cursor-pointer transition-transform hover:scale-[1.01]"
                        onClick={() => setSelectedResource({
                            title: "Morning Clarity",
                            subtitle: "Audio • 10 min",
                            type: "audio",
                            icon: Headphones,
                            color: "text-teal-500",
                            audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditative-rain-114354.mp3"
                        })}
                    >
                        <div className="relative z-10 w-2/3">
                            <span className="bg-white/20 px-2 py-1 rounded-md text-xs font-semibold backdrop-blur-sm mb-3 inline-block">Daily Pick</span>
                            <h3 className="text-xl font-bold mb-2">Morning Clarity</h3>
                            <p className="text-teal-50 text-xs mb-4 leading-relaxed">Start your day with a clear mind and focused intention. A 10-minute guided session.</p>
                            <button className="bg-white text-teal-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-teal-50 transition-colors">
                                <Play size={16} fill="currentColor" /> Play Now
                            </button>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-8 -mt-8 blur-2xl"></div>
                        <div className="absolute bottom-0 right-10 w-20 h-20 bg-teal-900/20 rounded-full blur-xl"></div>
                    </div>
                )}

                {/* List */}
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 text-sm">
                        {activeCategory === "All" ? "Recommended for You" : `${activeCategory} Resources`}
                    </h3>

                    {filteredResources.length > 0 ? (
                        filteredResources.map((resource, idx) => (
                            <ResourceItem
                                key={idx}
                                {...resource}
                                onClick={() => setSelectedResource(resource)}
                            />
                        ))
                    ) : (
                        <div className="text-center py-10 text-slate-400 text-sm">
                            No resources found for {activeCategory}.
                        </div>
                    )}
                </div>
            </main>

            {/* Player Modal */}
            <ResourcePlayer resource={selectedResource} onClose={() => setSelectedResource(null)} />
        </div>
    );
}

function CategoryBadge({ label, active = false, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${active ? "bg-slate-800 text-white shadow-md transform scale-105" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"}`}
        >
            {label}
        </button>
    );
}

function ResourceItem({ title, subtitle, icon: Icon, color, bgColor, onClick }: any) {
    return (
        <div onClick={onClick} className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all duration-200 cursor-pointer select-none active:scale-[0.98]">
            <div className={`w-12 h-12 rounded-xl ${bgColor} ${color} flex items-center justify-center flex-shrink-0`}>
                <Icon size={20} />
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
                <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                <Play size={12} fill="currentColor" />
            </div>
        </div>
    )
}

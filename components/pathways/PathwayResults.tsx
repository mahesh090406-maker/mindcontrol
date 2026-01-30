"use client";

import { Moon, Users, Smile, Wind, MessageSquare, Phone, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PathwayResults() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Header */}
            <header className="flex items-center px-6 py-4 bg-white sticky top-0 z-10 border-b border-slate-100 shadow-sm">
                <Link href="/" className="text-slate-400 hover:text-slate-600 mr-4 transition-colors">
                    <ChevronLeft size={24} />
                </Link>
                <h1 className="text-base font-bold text-slate-800 flex-1 text-center pr-10">Pathways</h1>
            </header>

            <main className="px-6 py-6 max-w-xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl font-bold text-slate-800">Hi, Alex</h2>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                        We've gathered some personalized insights to help you stay balanced today.
                    </p>
                </motion.div>

                {/* Recent Observations */}
                <section className="mb-8">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Recent Observations</h3>
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="space-y-3"
                    >
                        <motion.div variants={item}>
                            <ObservationItem
                                icon={Moon}
                                iconColor="text-indigo-500"
                                bg="bg-indigo-50"
                                title="Sleep Pattern Shift"
                                desc="We've noticed a change in your rest hours."
                            />
                        </motion.div>
                        <motion.div variants={item}>
                            <ObservationItem
                                icon={Users}
                                iconColor="text-sky-500"
                                bg="bg-sky-50"
                                title="Social Activity"
                                desc="You've been less active in your social circles lately."
                            />
                        </motion.div>
                        <motion.div variants={item}>
                            <ObservationItem
                                icon={Smile}
                                iconColor="text-emerald-500"
                                bg="bg-emerald-50"
                                title="Mood Variance"
                                desc="Subtle fluctuations in your daily sentiment logs."
                            />
                        </motion.div>
                    </motion.div>
                </section>

                {/* Personalized for You */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="space-y-4"
                >
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Personalized for You</h3>

                    {/* Guided Breathing Card */}
                    <div className="bg-gradient-to-br from-cyan-50 to-white rounded-2xl p-5 border border-cyan-100 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-100 rounded-bl-full opacity-50 -mr-4 -mt-4 transition-transform group-hover:scale-110 duration-500"></div>
                        <div className="relative z-10">
                            <div className="flex items-start gap-4 mb-3">
                                <div className="w-12 h-12 rounded-2xl bg-cyan-500 flex items-center justify-center text-white shadow-lg shadow-cyan-200 transform group-hover:-translate-y-1 transition-transform duration-300">
                                    <Wind size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg">Guided Box Breathing</h4>
                                    <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-[220px]">
                                        A 5-minute session to reset your nervous system and reduce stress.
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => alert("Starting Breathing Session...")}
                                className="text-sm font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-1 mt-3 group-hover:gap-2 transition-all"
                            >
                                Start Session <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Journaling */}
                    <div className="bg-white rounded-2xl p-1 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
                        <div className="p-4 flex items-center gap-4 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                            <div className="bg-slate-100 p-3 rounded-xl text-slate-600 group-hover:bg-white group-hover:text-cyan-600 transition-colors">
                                <MessageSquare size={22} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-sm text-slate-800">Reflective Journaling</h4>
                                <p className="text-xs text-slate-500 mt-0.5">Try writing down three things you are grateful for.</p>
                            </div>
                            <ChevronRight size={18} className="text-slate-300 group-hover:text-cyan-500 transition-colors" />
                        </div>
                    </div>

                    {/* Quick Connect Area */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mt-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-rose-50 text-rose-500 rounded-lg">
                                <MapPin size={20} />
                            </div>
                            <h4 className="font-bold text-sm text-slate-800">Need Immediate Support?</h4>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button className="flex flex-col items-center justify-center p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
                                <Phone size={20} className="text-slate-400 mb-1" />
                                <span className="text-xs font-bold text-slate-600">Helpline</span>
                            </button>
                            <button className="flex flex-col items-center justify-center p-3 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors">
                                <Users size={20} className="text-indigo-400 mb-1" />
                                <span className="text-xs font-bold text-indigo-600">Call Friend</span>
                            </button>
                        </div>
                    </div>

                </motion.section>
            </main>
        </div>
    );
}

function ObservationItem({ icon: Icon, iconColor, bg, title, desc }: any) {
    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
            <div className={`w-10 h-10 rounded-full ${bg} ${iconColor} flex items-center justify-center flex-shrink-0`}>
                <Icon size={20} />
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-sm text-slate-800">{title}</h4>
                <p className="text-xs text-slate-500 leading-tight mt-0.5">{desc}</p>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
        </div>
    );
}

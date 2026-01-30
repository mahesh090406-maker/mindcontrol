"use client";

import { X, Save, Calendar, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface JournalModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function JournalModal({ isOpen, onClose }: JournalModalProps) {
    const [entry, setEntry] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setEntry("");
            onClose();
            alert("Journal entry saved successfully!"); // Simple feedback
        }, 1500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-50 p-6 m-4"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-100 rounded-xl text-slate-500">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <h2 className="font-bold text-slate-800">Daily Journal</h2>
                                    <p className="text-xs text-slate-400 font-medium">Capture your thoughts</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                                <X size={20} />
                            </button>
                        </div>

                        <textarea
                            value={entry}
                            onChange={(e) => setEntry(e.target.value)}
                            placeholder="How are you feeling right now?"
                            className="w-full h-48 bg-slate-50 rounded-2xl p-4 text-slate-700 placeholder-slate-400 border-none focus:ring-2 focus:ring-cyan-100 transition-all resize-none mb-4"
                        ></textarea>

                        <div className="flex items-center justify-between">
                            <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-colors">
                                <Mic size={20} />
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!entry.trim() || isSaving}
                                className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isSaving ? (
                                    <span className="animate-pulse">Saving...</span>
                                ) : (
                                    <>
                                        <Save size={18} /> Save Entry
                                    </>
                                )}
                            </button>
                        </div>

                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

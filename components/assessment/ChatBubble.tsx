"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";

export default function ChatBubble() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex gap-4 items-start mb-8"
        >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-cyan-200 flex-shrink-0">
                <Bot size={20} />
            </div>

            <div className="bg-white rounded-2xl rounded-tl-none p-5 shadow-sm border border-slate-100 max-w-[85%] relative">
                <p className="text-slate-700 text-sm leading-relaxed">
                    Hello! To better understand your well-being patterns, I have a few questions about your day.
                    <br /><br />
                    <span className="font-medium text-cyan-600">Let's start with how you've been feeling lately.</span>
                </p>

                {/* Visual Arrow for bubble */}
                <div className="absolute top-0 left-0 -ml-2 w-4 h-4 overflow-hidden">
                    <div className="w-3 h-4 bg-white border-l border-b border-slate-100 transform rotate-45 origin-top-right translate-x-2"></div>
                </div>
            </div>
        </motion.div>
    );
}

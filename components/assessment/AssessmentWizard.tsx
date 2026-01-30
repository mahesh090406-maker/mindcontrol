"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Info, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ChatBubble from "./ChatBubble";
import RangeSlider from "./RangeSlider";

export default function AssessmentWizard() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [mood, setMood] = useState(50);
    const [sleep, setSleep] = useState(50);
    const [energy, setEnergy] = useState(50);

    const handleContinue = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            router.push("/pathways");
        }, 2000);
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 100 : -100,
            opacity: 0
        })
    };

    if (isSubmitting) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    className="w-20 h-20 bg-cyan-100 text-cyan-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-cyan-100"
                >
                    <Sparkles size={40} />
                </motion.div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Analyzing Patterns...</h2>
                <p className="text-slate-500">Connecting your mood with recent sleep data to generate personalized insights.</p>
            </div>
        );
    }

    return (
        <div className="pb-24 min-h-screen bg-slate-50">
            {/* Header */}
            <header className="flex justify-between items-center px-6 py-4 bg-white sticky top-0 z-10 border-b border-slate-100 shadow-sm">
                <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors">
                    <ChevronLeft size={24} />
                </Link>
                <h1 className="text-base font-bold text-slate-800">Check-in</h1>
                <button className="text-slate-400 hover:text-teal-600 transition-colors">
                    <Info size={20} />
                </button>
            </header>

            <main className="max-w-md mx-auto">
                {/* Progress Bar */}
                <div className="px-6 py-6">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        <span>Progress</span>
                        <span className="text-cyan-600">Step {currentStep} of {totalSteps}</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-cyan-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                    </div>
                </div>

                <div className="px-6 relative overflow-hidden">
                    <AnimatePresence mode="wait" custom={1}>
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                custom={1}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="w-full"
                            >
                                <ChatBubble />
                                <div className="space-y-6">
                                    <div className="mb-4">
                                        <h2 className="text-2xl font-bold text-slate-800 mb-1">How are you feeling?</h2>
                                        <p className="text-sm text-slate-500">Rate your overall mood today.</p>
                                    </div>
                                    <RangeSlider
                                        label="Mood"
                                        question="I feel optimistic about the future."
                                        minLabel="Disagree"
                                        midLabel="Neutral"
                                        maxLabel="Agree"
                                        value={mood}
                                        onChange={setMood}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                custom={1}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="w-full"
                            >
                                <div className="space-y-6 pt-4">
                                    <div className="mb-4">
                                        <h2 className="text-2xl font-bold text-slate-800 mb-1">Energy & Sleep</h2>
                                        <p className="text-sm text-slate-500">Let's check your physical state.</p>
                                    </div>
                                    <RangeSlider
                                        label="Sleep Quality"
                                        question="How well did you sleep last night?"
                                        minLabel="Poorly"
                                        midLabel="Okay"
                                        maxLabel="Great"
                                        value={sleep}
                                        onChange={setSleep}
                                    />
                                    <RangeSlider
                                        label="Energy"
                                        question="My energy level right now is..."
                                        minLabel="Low"
                                        midLabel="Moderate"
                                        maxLabel="High"
                                        value={energy}
                                        onChange={setEnergy}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                custom={1}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="w-full"
                            >
                                <div className="space-y-6 pt-4">
                                    <div className="mb-4">
                                        <h2 className="text-2xl font-bold text-slate-800 mb-1">Review</h2>
                                        <p className="text-sm text-slate-500">Confirm your check-in details.</p>
                                    </div>

                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
                                        <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                                            <span className="text-sm font-medium text-slate-500">Mood score</span>
                                            <span className="text-lg font-bold text-cyan-600">{mood}%</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                                            <span className="text-sm font-medium text-slate-500">Sleep Quality</span>
                                            <span className="text-lg font-bold text-cyan-600">{sleep}%</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-slate-500">Energy Level</span>
                                            <span className="text-lg font-bold text-cyan-600">{energy}%</span>
                                        </div>
                                    </div>

                                    <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 flex gap-3 items-start">
                                        <CheckCircle2 size={20} className="text-teal-500 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-teal-800 font-medium">
                                            Everything looks set! We'll start tracking these metrics for your weekly report.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-10">
                        <button
                            onClick={handleContinue}
                            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-cyan-200"
                        >
                            <span>{currentStep === totalSteps ? "Complete Check-in" : "Continue"}</span>
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

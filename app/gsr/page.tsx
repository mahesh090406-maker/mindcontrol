"use client";

import { useState, useEffect, useRef } from "react";
import { Activity, Zap, Wind, Brain, Settings2, PlayCircle, PauseCircle, Download, History, Lightbulb, Pause, Play, MessageCircle, Loader } from "lucide-react";
import BiofeedbackChart from "@/components/gsr/BiofeedbackChart";
import { motion, AnimatePresence } from "framer-motion";

interface ReadingSession {
    id: string;
    date: string;
    time: string;
    averageReading: number;
    minReading: number;
    maxReading: number;
    stressLevel: string;
    notes: string;
}

interface AIMessage {
    role: "user" | "assistant";
    content: string;
}

export default function GsrDashboard() {
    const [isSimulating, setIsSimulating] = useState(false);
    const [currentValue, setCurrentValue] = useState(5.0); // Initial baseline 5µS
    const [dataHistory, setDataHistory] = useState<any[]>([]);
    const [stressThreshold, setStressThreshold] = useState(20); // 20µS trigger

    // 15-Second Sensing Mode (triggered by simulate button)
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [finalReading, setFinalReading] = useState<number | null>(null);
    const sensingDataRef = useRef<number[]>([]);

    // New Features
    const [readingHistory, setReadingHistory] = useState<ReadingSession[]>([]);
    const [sessionNotes, setSessionNotes] = useState("");
    const [showBreathingGuide, setShowBreathingGuide] = useState(false);
    const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
    const [showHistory, setShowHistory] = useState(false);

    // AI Features
    const [showAIChat, setShowAIChat] = useState(false);
    const [aiMessages, setAIMessages] = useState<AIMessage[]>([
        { role: "assistant", content: "👋 Hi! I'm your AI wellness assistant. Ask me anything about stress management, your readings, or wellness tips!" }
    ]);
    const [aiInput, setAIInput] = useState("");
    const [aiLoading, setAILoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [showWellnessTips, setShowWellnessTips] = useState(false);

    // Web Serial Logic
    const [isConnected, setIsConnected] = useState(false);
    const portRef = useRef<any>(null);
    const readerRef = useRef<any>(null);

    // Load history on mount
    useEffect(() => {
        const saved = localStorage.getItem("gsr_reading_history");
        if (saved) {
            setReadingHistory(JSON.parse(saved));
        }
    }, []);

    // Save history whenever it changes
    useEffect(() => {
        localStorage.setItem("gsr_reading_history", JSON.stringify(readingHistory));
    }, [readingHistory]);

    // Save reading to history
    const saveReadingToHistory = (reading: number) => {
        const now = new Date();
        const minReading = Math.min(...sensingDataRef.current);
        const maxReading = Math.max(...sensingDataRef.current);
        const stressLevel = getStressLevel(reading);

        const session: ReadingSession = {
            id: Date.now().toString(),
            date: now.toLocaleDateString(),
            time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            averageReading: reading,
            minReading: minReading,
            maxReading: maxReading,
            stressLevel: stressLevel,
            notes: sessionNotes
        };

        setReadingHistory([...readingHistory, session]);
        setSessionNotes("");
    };

    const getStressLevel = (reading: number) => {
        if (reading < 8) return "Deeply Relaxed";
        if (reading < 12) return "Calm";
        if (reading < 18) return "Engaged";
        if (reading < 25) return "High Stress";
        return "Critical";
    };

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [aiMessages]);

    // AI Chat Handler - Supports both Gemini and ChatGPT
    const handleAIMessage = async (userMessage: string) => {
        if (!userMessage.trim()) return;

        setAIInput("");
        setAIMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setAILoading(true);

        try {
            // Build context from reading history
            const statsText = getStatistics() ?
                `User Stats: ${getStatistics()!.total} readings, Average: ${getStatistics()!.average}µS, Min: ${getStatistics()!.min}µS, Max: ${getStatistics()!.max}µS`
                : "No readings yet";

            const recentReadings = readingHistory.slice(-5).map(r =>
                `${r.date} ${r.time}: ${r.averageReading.toFixed(2)}µS (${r.stressLevel})`
            ).join("; ");

            const systemPrompt = `You are a professional wellness and stress management AI assistant. You help users understand their GSR (Galvanic Skin Response) sensor readings and provide evidence-based stress management advice.

Current User Data:
- ${statsText}
- Recent Readings: ${recentReadings || "None"}

Be empathetic, professional, and provide actionable advice. Keep responses concise (2-3 sentences max).`;

            const aiProvider = process.env.NEXT_PUBLIC_AI_PROVIDER || 'gemini';
            const endpoint = aiProvider === 'chatgpt' ? '/api/chatgpt' : '/api/gemini';

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: `${systemPrompt}\n\nUser Question: ${userMessage}`,
                    readingData: { history: readingHistory }
                })
            });

            const data = await response.json();

            if (data.content) {
                setAIMessages(prev => [...prev, { role: "assistant", content: data.content }]);
            } else if (data.error) {
                setAIMessages(prev => [...prev, { role: "assistant", content: `Error: ${data.error}. Please check your API key in .env.local` }]);
            } else {
                setAIMessages(prev => [...prev, { role: "assistant", content: "Sorry, I couldn't generate a response. Please try again." }]);
            }
        } catch (error) {
            console.error("AI error:", error);
            setAIMessages(prev => [...prev, { role: "assistant", content: "Error connecting to AI. Please check your API key in .env.local file." }]);
        } finally {
            setAILoading(false);
        }
    };

    const exportToCSV = () => {
        if (readingHistory.length === 0) {
            alert("No readings to export!");
            return;
        }

        const headers = ["Date", "Time", "Average (µS)", "Min (µS)", "Max (µS)", "Stress Level", "Notes"];
        const rows = readingHistory.map(session => [
            session.date,
            session.time,
            session.averageReading.toFixed(2),
            session.minReading.toFixed(2),
            session.maxReading.toFixed(2),
            session.stressLevel,
            session.notes
        ]);

        const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `GSR_Readings_${new Date().toLocaleDateString()}.csv`;
        a.click();
    };

    const getStatistics = () => {
        if (readingHistory.length === 0) return null;
        const readings = readingHistory.map(r => r.averageReading);
        return {
            total: readingHistory.length,
            average: (readings.reduce((a, b) => a + b, 0) / readings.length).toFixed(2),
            min: Math.min(...readings).toFixed(2),
            max: Math.max(...readings).toFixed(2)
        };
    };

    // Breathing exercise
    useEffect(() => {
        if (!showBreathingGuide) return;

        const phases = ["inhale", "hold", "exhale"] as const;
        const durations = { inhale: 4000, hold: 4000, exhale: 4000 };
        let currentPhaseIndex = 0;

        const cycle = setInterval(() => {
            const phase = phases[currentPhaseIndex];
            setBreathingPhase(phase);
            currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
        }, 4000);

        return () => clearInterval(cycle);
    }, [showBreathingGuide]);

    const connectSerial = async () => {
        if (!("serial" in navigator)) {
            alert("Your browser does not support Web Serial API. Please use Chrome or Edge.");
            return;
        }

        try {
            const port = await (navigator as any).serial.requestPort();
            await port.open({ baudRate: 9600 });
            portRef.current = port;
            setIsConnected(true);
            setIsSimulating(false); // Stop simulation if real device connects

            const textDecoder = new TextDecoderStream();
            const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
            const reader = textDecoder.readable.getReader();
            readerRef.current = reader;

            readLoop(reader);
        } catch (error) {
            console.error("Serial Connection Error:", error);
            alert("Failed to connect to device.");
        }
    };

    const readLoop = async (reader: any) => {
        let buffer = "";
        try {
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                buffer += value;
                const lines = buffer.split('\n');

                // Process all complete lines
                for (let i = 0; i < lines.length - 1; i++) {
                    const line = lines[i].trim();
                    if (line) {
                        const val = parseFloat(line);
                        if (!isNaN(val)) {
                            setCurrentValue(val);
                            setDataHistory(prev => {
                                const now = new Date();
                                const newPoint = {
                                    time: now.toLocaleTimeString([], { second: '2-digit', minute: '2-digit' }),
                                    value: val
                                };
                                const newHistory = [...prev, newPoint];
                                if (newHistory.length > 50) newHistory.shift();
                                return newHistory;
                            });
                        }
                    }
                }
                // Keep the remainder in buffer
                buffer = lines[lines.length - 1];
            }
        } catch (error) {
            console.error("Read Error:", error);
        } finally {
            reader.releaseLock();
        }
    };

    const disconnectSerial = async () => {
        if (readerRef.current) {
            await readerRef.current.cancel();
            readerRef.current = null;
        }
        if (portRef.current) {
            await portRef.current.close();
            portRef.current = null;
        }
        setIsConnected(false);
    };

    // 15-Second Sensing Mode (triggered by analyze button)
    useEffect(() => {
        if (!isSimulating) return;

        sensingDataRef.current = [];
        setTimeRemaining(15);
        setFinalReading(null);
        setDataHistory([]);
        let secondsElapsed = 0;
        let baseValue = 8 + Math.random() * 6; // Start between 8-14

        // Collect data every 100ms for 15 seconds
        const dataInterval = setInterval(() => {
            // Generate realistic fluctuating data
            // If sensor connected, values come from ESP32
            // If not connected, generate test data
            let newValue;

            if (isConnected) {
                // Use sensor data - slight variation from current reading
                newValue = Math.max(0, Math.min(50, currentValue + (Math.random() - 0.5) * 1.5));
            } else {
                // Test mode: Generate realistic fluctuating data
                baseValue += (Math.random() - 0.5) * 2; // Random walk
                newValue = Math.max(0, Math.min(50, baseValue));
            }

            setCurrentValue(newValue);
            sensingDataRef.current.push(newValue);

            setDataHistory(prevHistory => {
                const now = new Date();
                const newPoint = {
                    time: now.toLocaleTimeString([], { second: '2-digit', minute: '2-digit' }),
                    value: newValue
                };
                return [...prevHistory, newPoint];
            });
        }, 100);

        // Countdown timer - Start from 15 and count down
        const countdownInterval = setInterval(() => {
            secondsElapsed++;
            const remaining = 15 - secondsElapsed;
            setTimeRemaining(remaining);

            if (remaining <= 0) {
                clearInterval(dataInterval);
                clearInterval(countdownInterval);
            }
        }, 1000);

        // Stop after exactly 15 seconds
        const timeoutId = setTimeout(() => {
            clearInterval(dataInterval);
            clearInterval(countdownInterval);

            // Calculate final reading
            if (sensingDataRef.current.length > 0) {
                const avg = sensingDataRef.current.reduce((a, b) => a + b, 0) / sensingDataRef.current.length;
                const reading = parseFloat(avg.toFixed(2));
                setFinalReading(reading);
                // Save to history
                setTimeout(() => {
                    saveReadingToHistory(reading);
                }, 500);
            }
            setIsSimulating(false);
        }, 15000); // Exactly 15 seconds

        return () => {
            clearInterval(dataInterval);
            clearInterval(countdownInterval);
            clearTimeout(timeoutId);
        };
    }, [isSimulating]);

    // Determine State
    const getState = (val: number) => {
        if (val < 8) return { label: "Deeply Relaxed", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-200" };
        if (val < 15) return { label: "Calm / Focus", color: "text-cyan-500", bg: "bg-cyan-500/10", border: "border-cyan-200" };
        if (val < 20) return { label: "Engaged", color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-200" };
        return { label: "High Arousal / Stress", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-200" };
    };

    // Detailed Stress Analysis for 15-second readings
    const getStressAnalysis = (val: number) => {
        if (val < 8) {
            return {
                level: "Low Stress - Relaxed",
                icon: Brain,
                color: "emerald",
                bgColor: "bg-emerald-500",
                description: "✅ Patient Status: EXCELLENT",
                details: "You are in a deeply relaxed state. Your nervous system is well-regulated and you have excellent emotional control.",
                recommendations: [
                    "• Maintain current wellness practices",
                    "• Perfect state for meditation or deep work",
                    "• Continue stress management routines"
                ],
                risk: "No immediate risk detected"
            };
        } else if (val < 12) {
            return {
                level: "Normal Stress - Calm",
                icon: Wind,
                color: "cyan",
                bgColor: "bg-cyan-500",
                description: "✅ Patient Status: GOOD",
                details: "Your stress levels are within normal, healthy ranges. You are calm and focused with good emotional balance.",
                recommendations: [
                    "• Continue regular exercise and activities",
                    "• Maintain good sleep hygiene",
                    "• Practice mindfulness when needed"
                ],
                risk: "No significant risk"
            };
        } else if (val < 18) {
            return {
                level: "Moderate Stress - Active",
                icon: Activity,
                color: "indigo",
                bgColor: "bg-indigo-500",
                description: "⚠️ Patient Status: ALERT",
                details: "Your stress levels are moderately elevated. You're in an engaged state but should monitor your stress responses.",
                recommendations: [
                    "• Take short breaks every hour",
                    "• Practice deep breathing exercises",
                    "• Reduce caffeine intake if high",
                    "• Engage in light physical activity"
                ],
                risk: "Monitor stress levels - early intervention advised"
            };
        } else if (val < 25) {
            return {
                level: "High Stress - Elevated",
                icon: Wind,
                color: "rose",
                bgColor: "bg-rose-500",
                description: "⚠️ Patient Status: AT RISK",
                details: "Your stress levels are significantly elevated. Immediate stress management is recommended.",
                recommendations: [
                    "• Practice deep breathing: 4-7-8 technique",
                    "• Take a 10-minute walk outdoors",
                    "• Reduce stimuli (phone, noise)",
                    "• Try progressive muscle relaxation",
                    "• Consider speaking with a healthcare provider"
                ],
                risk: "Elevated risk - intervention required"
            };
        } else {
            return {
                level: "Very High Stress - Critical",
                icon: Zap,
                color: "red",
                bgColor: "bg-red-600",
                description: "🔴 Patient Status: CRITICAL",
                details: "Your stress levels are critically elevated. This requires immediate professional attention and urgent stress management.",
                recommendations: [
                    "• Seek immediate relaxation techniques",
                    "• Contact healthcare professional",
                    "• Avoid stressful situations",
                    "• Consider emergency support if needed",
                    "• Meditation or guided imagery sessions"
                ],
                risk: "CRITICAL - Immediate professional consultation recommended"
            };
        }
    };


    const currentState = getState(currentValue);

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <div className="bg-cyan-100 p-2 rounded-xl text-cyan-600"><Activity size={32} /></div>
                        Biofeedback Monitor
                    </h1>
                    <p className="text-slate-500 mt-1 ml-14">Real-time Galvanic Skin Response (GSR) tracking.</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    {/* USB Connect Button */}
                    <button
                        onClick={isConnected ? disconnectSerial : connectSerial}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all shadow-md text-sm ${isConnected ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                    >
                        {isConnected ? <><Settings2 size={16} /> Connected</> : <><Zap size={16} /> Connect</>}
                    </button>

                    {/* Analyze Button */}
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                        <span className={`text-xs font-bold uppercase tracking-wider ${isConnected ? 'text-slate-400' : 'text-amber-500'}`}>
                            {isConnected ? "Analyze" : "Test"}
                        </span>
                        <button
                            onClick={() => setIsSimulating(!isSimulating)}
                            className={`p-1 rounded-lg transition-colors ${isSimulating ? 'text-rose-500 bg-rose-100 animate-pulse' : 'text-slate-400 hover:bg-slate-100'}`}
                        >
                            {isSimulating ? <PauseCircle size={18} /> : <PlayCircle size={18} />}
                        </button>
                        {isSimulating && timeRemaining > 0 && (
                            <span className="ml-2 text-xs font-bold text-rose-600">{timeRemaining}s</span>
                        )}
                    </div>

                    {/* History Button */}
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all shadow-md text-sm"
                    >
                        <History size={16} /> History
                    </button>

                    {/* Wellness Tips Button */}
                    <button
                        onClick={() => setShowWellnessTips(!showWellnessTips)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all shadow-md text-sm"
                    >
                        <Lightbulb size={16} /> Tips
                    </button>

                    {/* Export Button */}
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600 transition-all shadow-md text-sm"
                    >
                        <Download size={16} /> Export
                    </button>

                    {/* AI Chat Button */}
                    <button
                        onClick={() => setShowAIChat(!showAIChat)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all shadow-md text-sm"
                    >
                        <MessageCircle size={16} /> AI Assistant
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Graph Card */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-700">Conductance History (µS)</h3>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                            <div className={`w-2 h-2 rounded-full ${isConnected || isSimulating ? 'bg-cyan-500 animate-pulse' : 'bg-slate-300'}`} />
                            Live Data
                        </div>
                    </div>
                    <div className="h-[400px]">
                        <BiofeedbackChart data={dataHistory} threshold={stressThreshold} />
                    </div>
                </div>

                {/* Live Stats & Control */}
                <div className="space-y-6">
                    {/* Current Value Card */}
                    <div className={`bg-white rounded-3xl p-8 shadow-xl border-2 transition-colors ${currentState.border}`}>
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                {isSimulating ? "Live Reading (Analyzing...)" : "Current Reading"}
                            </span>
                            <Zap size={20} className={currentState.color} />
                        </div>
                        <div className="flex items-baseline gap-4">
                            <h2 className="text-6xl font-bold text-slate-800">{currentValue.toFixed(1)}</h2>
                            <span className="text-xl font-medium text-slate-400">µS</span>
                            {isSimulating && timeRemaining > 0 && (
                                <div className="ml-4 px-4 py-2 bg-rose-100 rounded-lg">
                                    <span className="text-lg font-bold text-rose-600">{timeRemaining}s</span>
                                </div>
                            )}
                        </div>
                        <div className={`inline-block mt-4 px-3 py-1 rounded-full text-sm font-bold ${currentState.bg} ${currentState.color}`}>
                            {isSimulating && timeRemaining > 0 ? "Sensing in progress..." : currentState.label}
                        </div>
                    </div>

                    {/* Simulation & Controls */}
                    <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                        <div className="flex items-center gap-2 mb-4">
                            <Settings2 size={18} className="text-slate-400" />
                            <h3 className="font-bold text-slate-700 text-sm">Simulation & Controls</h3>
                        </div>

                        {/* Manual Sensor Input Slider */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Manual Reading</label>
                                <span className="text-xs font-bold text-indigo-600">{currentValue.toFixed(1)} µS</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="50"
                                step="0.5"
                                value={currentValue}
                                onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    setCurrentValue(val);
                                    // Also add to history so graph updates
                                    setDataHistory(prev => {
                                        const now = new Date();
                                        const newPoint = {
                                            time: now.toLocaleTimeString([], { second: '2-digit', minute: '2-digit' }),
                                            value: val
                                        };
                                        const newHistory = [...prev, newPoint];
                                        if (newHistory.length > 50) newHistory.shift();
                                        return newHistory;
                                    });
                                }}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                            <div className="flex justify-between mt-1 text-[10px] text-slate-400 font-mono">
                                <span>0µS</span>
                                <span>50µS</span>
                            </div>
                        </div>

                        {/* Threshold Slider */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Alert Threshold</label>
                                <span className="text-xs font-bold text-cyan-600">{stressThreshold} µS</span>
                            </div>
                            <input
                                type="range"
                                min="10"
                                max="40"
                                step="1"
                                value={stressThreshold}
                                onChange={(e) => setStressThreshold(parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                            />
                            <div className="flex justify-between mt-1 text-[10px] text-slate-400 font-mono">
                                <span>10µS</span>
                                <span>Trigger</span>
                                <span>40µS</span>
                            </div>
                        </div>
                    </div>

                    {/* Active Recommendations (Triggered by Logic) */}
                    <AnimatePresence>
                        {currentValue > stressThreshold && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="bg-rose-500 text-white rounded-3xl p-6 shadow-xl shadow-rose-500/20"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-white/20 p-2 rounded-full"><Wind size={20} /></div>
                                    <h3 className="font-bold">High Stress Detected</h3>
                                </div>
                                <p className="text-rose-100 text-sm mb-4">Your skin conductance levels are elevated. Let's reset.</p>
                                <button className="w-full py-3 bg-white text-rose-600 rounded-xl font-bold hover:bg-rose-50 transition-colors">
                                    Start Breathing Exercise
                                </button>
                            </motion.div>
                        )}

                        {currentValue < 8 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="bg-emerald-500 text-white rounded-3xl p-6 shadow-xl shadow-emerald-500/20"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-white/20 p-2 rounded-full"><Brain size={20} /></div>
                                    <h3 className="font-bold">Zone of Focus</h3>
                                </div>
                                <p className="text-emerald-100 text-sm mb-4">You are in a deeply relaxed state. Perfect for meditation or deep work.</p>
                                <button className="w-full py-3 bg-white text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition-colors">
                                    Log Focus Session
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Stress Analysis Report - Popup Modal */}
            <AnimatePresence>
                {finalReading !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="w-full max-w-2xl"
                        >
                            {(() => {
                                const analysis = getStressAnalysis(finalReading);
                                const ColorMap: { [key: string]: string } = {
                                    emerald: "border-emerald-300 bg-emerald-50",
                                    cyan: "border-cyan-300 bg-cyan-50",
                                    indigo: "border-indigo-300 bg-indigo-50",
                                    rose: "border-rose-300 bg-rose-50",
                                    red: "border-red-300 bg-red-50"
                                };
                                const TextColorMap: { [key: string]: string } = {
                                    emerald: "text-emerald-700",
                                    cyan: "text-cyan-700",
                                    indigo: "text-indigo-700",
                                    rose: "text-rose-700",
                                    red: "text-red-700"
                                };

                                return (
                                    <div className={`rounded-3xl p-8 shadow-2xl border-2 ${ColorMap[analysis.color]} max-h-[90vh] overflow-y-auto`}>
                                        <div className="space-y-6">
                                            {/* Header with Close Button */}
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h2 className={`text-4xl font-bold ${TextColorMap[analysis.color]} mb-3`}>
                                                        {analysis.description}
                                                    </h2>
                                                    <div className="flex gap-4 items-center flex-wrap">
                                                        <p className={`text-2xl font-bold ${TextColorMap[analysis.color]}`}>
                                                            {analysis.level}
                                                        </p>
                                                        <div className={`${analysis.bgColor} text-white px-4 py-2 rounded-lg font-bold text-lg`}>
                                                            {finalReading.toFixed(2)} µS
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => { setFinalReading(null); setDataHistory([]); }}
                                                    className="text-2xl font-bold text-slate-400 hover:text-slate-600"
                                                >
                                                    ✕
                                                </button>
                                            </div>

                                            {/* Analysis Details */}
                                            <div className="bg-white rounded-2xl p-6 border border-slate-200">
                                                <p className={`text-lg ${TextColorMap[analysis.color]} font-medium leading-relaxed`}>
                                                    {analysis.details}
                                                </p>
                                            </div>

                                            {/* Risk Assessment */}
                                            <div className={`${analysis.bgColor} text-white p-6 rounded-2xl border-2 ${ColorMap[analysis.color]}`}>
                                                <p className="font-bold text-lg mb-2">⚠️ Risk Assessment:</p>
                                                <p className="text-base">{analysis.risk}</p>
                                            </div>

                                            {/* Recommendations */}
                                            <div>
                                                <h3 className={`text-xl font-bold ${TextColorMap[analysis.color]} mb-4`}>
                                                    📋 Recommended Actions:
                                                </h3>
                                                <div className="bg-white rounded-2xl p-6 border-l-4 border-slate-400 space-y-3">
                                                    {analysis.recommendations.map((rec, idx) => (
                                                        <div key={idx} className="flex gap-3">
                                                            <span className={`${TextColorMap[analysis.color]} font-bold text-lg`}>✓</span>
                                                            <p className="text-slate-700 font-medium">{rec}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => { setFinalReading(null); setDataHistory([]); }}
                                                    className={`flex-1 py-4 ${analysis.bgColor} text-white rounded-xl font-bold text-lg hover:opacity-90 transition-all`}
                                                >
                                                    🔄 Start New Analysis
                                                </button>
                                                <button
                                                    onClick={() => { setFinalReading(null); setDataHistory([]); }}
                                                    className="px-6 py-4 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all"
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        </div>

                                        {/* Session Notes Input */}
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-700 mb-3">📝 Session Notes:</h3>
                                            <textarea
                                                value={sessionNotes}
                                                onChange={(e) => setSessionNotes(e.target.value)}
                                                placeholder="Add notes about this session..."
                                                className="w-full p-4 border border-slate-200 rounded-xl resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                );
                            })()}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* History Modal */}
            <AnimatePresence>
                {showHistory && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="w-full max-w-3xl bg-white rounded-3xl p-8 max-h-[80vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-bold text-slate-900">📊 Reading History</h2>
                                <button
                                    onClick={() => setShowHistory(false)}
                                    className="text-2xl font-bold text-slate-400 hover:text-slate-600"
                                >
                                    ✕
                                </button>
                            </div>

                            {readingHistory.length === 0 ? (
                                <p className="text-slate-500 text-center py-8">No readings yet. Click Analyze to start!</p>
                            ) : (
                                <>
                                    {/* Statistics */}
                                    {getStatistics() && (
                                        <div className="grid grid-cols-4 gap-4 mb-6">
                                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                                                <p className="text-sm text-blue-600 font-bold">Total Readings</p>
                                                <p className="text-2xl font-bold text-blue-700">{getStatistics()!.total}</p>
                                            </div>
                                            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                                                <p className="text-sm text-green-600 font-bold">Average</p>
                                                <p className="text-2xl font-bold text-green-700">{getStatistics()!.average} µS</p>
                                            </div>
                                            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                                                <p className="text-sm text-yellow-600 font-bold">Min</p>
                                                <p className="text-2xl font-bold text-yellow-700">{getStatistics()!.min} µS</p>
                                            </div>
                                            <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                                                <p className="text-sm text-red-600 font-bold">Max</p>
                                                <p className="text-2xl font-bold text-red-700">{getStatistics()!.max} µS</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Readings Table */}
                                    <div className="space-y-3">
                                        {readingHistory.map((session) => (
                                            <div key={session.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-bold text-slate-900">{session.date} {session.time}</p>
                                                        <p className="text-sm text-slate-600">Avg: {session.averageReading.toFixed(2)} µS | Min: {session.minReading.toFixed(2)} µS | Max: {session.maxReading.toFixed(2)} µS</p>
                                                        <p className="text-sm text-slate-700 mt-1 font-bold">{session.stressLevel}</p>
                                                        {session.notes && <p className="text-sm text-slate-500 italic mt-2">{session.notes}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            <button
                                onClick={() => setShowHistory(false)}
                                className="w-full mt-6 py-3 bg-slate-700 text-white rounded-xl font-bold hover:bg-slate-800"
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Wellness Tips Modal */}
            <AnimatePresence>
                {showWellnessTips && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="w-full max-w-2xl bg-white rounded-3xl p-8 max-h-[80vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-bold text-slate-900">💡 Wellness Tips</h2>
                                <button
                                    onClick={() => setShowWellnessTips(false)}
                                    className="text-2xl font-bold text-slate-400 hover:text-slate-600"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-green-50 p-4 rounded-xl border-l-4 border-green-500">
                                    <p className="font-bold text-green-700">🧘 Meditation</p>
                                    <p className="text-slate-700 mt-2">Practice 10 minutes of meditation daily to reduce stress and improve focus.</p>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500">
                                    <p className="font-bold text-blue-700">🏃 Exercise</p>
                                    <p className="text-slate-700 mt-2">Engage in 30 minutes of physical activity daily. Walking, yoga, or dancing all help.</p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-xl border-l-4 border-purple-500">
                                    <p className="font-bold text-purple-700">🫁 Breathing Exercises</p>
                                    <button
                                        onClick={() => {
                                            setShowWellnessTips(false);
                                            setShowBreathingGuide(true);
                                        }}
                                        className="bg-purple-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-purple-600 font-bold"
                                    >
                                        Start Guided Breathing
                                    </button>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-xl border-l-4 border-yellow-500">
                                    <p className="font-bold text-yellow-700">😴 Sleep</p>
                                    <p className="text-slate-700 mt-2">Aim for 7-9 hours of quality sleep each night for better stress management.</p>
                                </div>
                                <div className="bg-red-50 p-4 rounded-xl border-l-4 border-red-500">
                                    <p className="font-bold text-red-700">☕ Reduce Caffeine</p>
                                    <p className="text-slate-700 mt-2">Limit caffeine intake, especially after 2 PM, to avoid anxiety and stress.</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowWellnessTips(false)}
                                className="w-full mt-6 py-3 bg-slate-700 text-white rounded-xl font-bold hover:bg-slate-800"
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Breathing Guide Modal */}
            <AnimatePresence>
                {showBreathingGuide && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="w-full max-w-md bg-white rounded-3xl p-8 text-center"
                        >
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">🫁 Guided Breathing</h2>

                            <motion.div
                                animate={breathingPhase === "inhale" ? { scale: 1.2 } : breathingPhase === "exhale" ? { scale: 0.8 } : { scale: 1 }}
                                className={`w-40 h-40 mx-auto rounded-full flex items-center justify-center text-white text-2xl font-bold mb-8 transition-colors ${breathingPhase === "inhale" ? "bg-blue-500" :
                                        breathingPhase === "hold" ? "bg-yellow-500" :
                                            "bg-green-500"
                                    }`}
                            >
                                {breathingPhase === "inhale" ? "INHALE" :
                                    breathingPhase === "hold" ? "HOLD" :
                                        "EXHALE"}
                            </motion.div>

                            <p className="text-slate-600 mb-6">Follow the circle animation and breathe slowly. This helps calm your nervous system.</p>

                            <button
                                onClick={() => setShowBreathingGuide(false)}
                                className="w-full py-3 bg-slate-700 text-white rounded-xl font-bold hover:bg-slate-800"
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* AI Chat Modal */}
            <AnimatePresence>
                {showAIChat && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[80vh]"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-t-3xl flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/20 p-3 rounded-full">
                                        <MessageCircle size={24} />
                                    </div>
                                    <h2 className="text-2xl font-bold">AI Wellness Assistant</h2>
                                </div>
                                <button
                                    onClick={() => setShowAIChat(false)}
                                    className="text-2xl font-bold hover:text-white/70"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                                {aiMessages.map((msg, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${msg.role === "user"
                                                    ? "bg-indigo-500 text-white rounded-br-none"
                                                    : "bg-white text-slate-800 border-2 border-slate-200 rounded-bl-none"
                                                }`}
                                        >
                                            <p className="text-sm leading-relaxed">{msg.content}</p>
                                        </div>
                                    </motion.div>
                                ))}
                                {aiLoading && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex justify-start"
                                    >
                                        <div className="bg-white border-2 border-slate-200 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-2">
                                            <Loader size={16} className="animate-spin text-indigo-500" />
                                            <span className="text-sm text-slate-600">AI is thinking...</span>
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="border-t border-slate-200 p-6 bg-white rounded-b-3xl">
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={aiInput}
                                        onChange={(e) => setAIInput(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && handleAIMessage(aiInput)}
                                        placeholder="Ask me anything about your stress levels..."
                                        className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-sm"
                                        disabled={aiLoading}
                                    />
                                    <button
                                        onClick={() => handleAIMessage(aiInput)}
                                        disabled={aiLoading || !aiInput.trim()}
                                        className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        Send
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">💡 Ask about your readings, stress management tips, or breathing exercises!</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

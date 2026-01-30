"use client";

import { X, Play, Pause, SkipBack, SkipForward, Volume2, RotateCcw, RotateCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface ResourcePlayerProps {
    resource: any | null;
    onClose: () => void;
}

export default function ResourcePlayer({ resource, onClose }: ResourcePlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initial setup when resource opens
    useEffect(() => {
        if (resource?.type === 'audio' && resource.audioUrl) {
            // Reset state for new resource
            setIsPlaying(false);
            setProgress(0);
            setCurrentTime(0);
            setDuration(0);

            // Initialize Audio
            const audio = new Audio(resource.audioUrl);
            audioRef.current = audio;

            const onLoadedMetadata = () => {
                if (isFinite(audio.duration)) {
                    setDuration(audio.duration);
                }
            };

            const onTimeUpdate = () => {
                if (isFinite(audio.currentTime) && isFinite(audio.duration) && audio.duration > 0) {
                    setCurrentTime(audio.currentTime);
                    setProgress((audio.currentTime / audio.duration) * 100);
                }
            };

            const onEnded = () => {
                setIsPlaying(false);
                setProgress(0);
                setCurrentTime(0);
            };

            audio.addEventListener('loadedmetadata', onLoadedMetadata);
            audio.addEventListener('timeupdate', onTimeUpdate);
            audio.addEventListener('ended', onEnded);

            return () => {
                // Cleanup
                audio.pause();
                audio.removeEventListener('loadedmetadata', onLoadedMetadata);
                audio.removeEventListener('timeupdate', onTimeUpdate);
                audio.removeEventListener('ended', onEnded);
                audio.remove();
                audioRef.current = null;
            }
        }
    }, [resource]);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => {
                    console.error("Playback failed:", e);
                    setIsPlaying(false);
                });
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef.current || !isFinite(duration) || duration === 0) return;

        const bar = e.currentTarget;
        const rect = bar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = Math.min(Math.max(clickX / rect.width, 0), 1);

        const newTime = percentage * duration;

        if (isFinite(newTime)) {
            audioRef.current.currentTime = newTime;
            setProgress(percentage * 100);
            setCurrentTime(newTime);
        }
    };

    const skip = (seconds: number) => {
        if (audioRef.current && isFinite(duration) && duration > 0) {
            const newTime = Math.min(Math.max(audioRef.current.currentTime + seconds, 0), duration);
            if (isFinite(newTime)) {
                audioRef.current.currentTime = newTime;
            }
        }
    };

    const formatTime = (time: number) => {
        if (!isFinite(time) || isNaN(time)) return "0:00";
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <AnimatePresence>
            {resource && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 transition-opacity"
                    />
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white rounded-t-3xl z-50 shadow-2xl overflow-hidden flex flex-col md:max-w-md md:mx-auto md:h-[650px] md:top-1/2 md:-translate-y-1/2 md:rounded-3xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{resource.type}</div>
                            <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                                <X size={20} className="text-slate-600" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center text-center">
                            <div className={`w-32 h-32 rounded-3xl ${resource.color.replace('text-', 'bg-').replace('500', '100')} flex items-center justify-center mb-6 shadow-xl`}>
                                <resource.icon size={48} className={resource.color} />
                            </div>

                            <h2 className="text-2xl font-bold text-slate-800 mb-2">{resource.title}</h2>
                            <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8">{resource.subtitle}</p>

                            {/* Audio Controls */}
                            {resource.type === 'audio' ? (
                                <div className="w-full max-w-xs space-y-6">
                                    {/* Progress Bar */}
                                    <div className="space-y-2">
                                        <div
                                            className="h-2 bg-slate-100 rounded-full overflow-hidden cursor-pointer relative group"
                                            onClick={handleSeek}
                                        >
                                            <div
                                                className="h-full bg-cyan-500 relative transition-none"
                                                style={{ width: `${progress}%` }}
                                            />
                                            {/* Hover area */}
                                            <div className="absolute inset-0 bg-transparent hover:bg-black/5 transition-colors" />
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-400 font-medium font-mono">
                                            <span>{formatTime(currentTime)}</span>
                                            <span>{formatTime(duration)}</span>
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex items-center justify-center gap-6">
                                        <button
                                            onClick={() => skip(-10)}
                                            className="text-slate-400 hover:text-cyan-500 transition-colors flex flex-col items-center gap-1 group active:scale-95"
                                        >
                                            <RotateCcw size={24} />
                                            <span className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">-10s</span>
                                        </button>

                                        <button
                                            onClick={() => setIsPlaying(!isPlaying)}
                                            className="w-20 h-20 bg-cyan-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-cyan-200 hover:scale-105 active:scale-95 transition-all"
                                        >
                                            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                                        </button>

                                        <button
                                            onClick={() => skip(10)}
                                            className="text-slate-400 hover:text-cyan-500 transition-colors flex flex-col items-center gap-1 group active:scale-95"
                                        >
                                            <RotateCw size={24} />
                                            <span className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">+10s</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-left bg-slate-50 p-6 rounded-2xl text-slate-600 text-sm leading-relaxed">
                                    <p className="mb-4">Here is the content for {resource.title}. This represents a readable article or guide.</p>
                                    <h3 className="font-bold text-slate-800 mb-2">Step 1: Preparation</h3>
                                    <p className="mb-4">Find a quiet space where you won't be disturbed. Sit comfortably with your back straight.</p>
                                    <h3 className="font-bold text-slate-800 mb-2">Step 2: The Practice</h3>
                                    <p>Take a deep breath. Focus on the present moment. Let go of distractions...</p>
                                </div>
                            )}
                        </div>

                        {/* Footer Action */}
                        <div className="p-6 border-t border-slate-100">
                            <button onClick={onClose} className="w-full py-4 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                                Close
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

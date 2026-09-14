'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    Volume2,
    VolumeX,
    Coffee,
    Code2,
    Moon,
    ArrowRight,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import HolographicPortfolio from '@/components/hologram/HolographicPortfolio';
import { CharacterRoutine } from '@/components/3d/CyberCharacter';
import { CameraMode } from '@/components/3d/CameraController';
import { audio } from '@/lib/audio';

const CyberRoomScene = dynamic(() => import('@/components/3d/CyberRoomScene'), {
    ssr: false,
    loading: () => null,
});

export default function StoryController() {
    // Master story & camera phases
    const [cameraMode, setCameraMode] = useState<CameraMode>('orbit');
    const [showHologram, setShowHologram] = useState(false);
    const [screenFlare, setScreenFlare] = useState(false);

    // Character life simulation status
    const [currentRoutine, setCurrentRoutine] = useState<CharacterRoutine>('coding');
    const [routineLabel, setRoutineLabel] = useState('Compiling Neural Shaders & Live Hacking (Desk)');

    // Sound state
    const [isMuted, setIsMuted] = useState(false);
    const [isLofiPlaying, setIsLofiPlaying] = useState(false);

    useEffect(() => {
        setIsMuted(audio.getMuted());
        // Lofi music stays always on
        audio.startLofi();
        setIsLofiPlaying(true);

        const handleUserGesture = () => {
            audio.startLofi();
            setIsLofiPlaying(true);
        };
        window.addEventListener('pointerdown', handleUserGesture, { once: true });
        window.addEventListener('keydown', handleUserGesture, { once: true });

        // Keyboard triggers for fast interaction
        const handleKeyDown = (e: KeyboardEvent) => {
            if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
                return;
            }

            if (cameraMode === 'orbit') {
                if (e.code === 'Space' || e.key === 'Enter') {
                    e.preventDefault();
                    handleJackIn();
                } else if (e.key === '1') {
                    handleSelectRoutine('coding');
                } else if (e.key === '2') {
                    handleSelectRoutine('brewing');
                } else if (e.key === '3') {
                    handleSelectRoutine('bed');
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('pointerdown', handleUserGesture);
        };
    }, [cameraMode, currentRoutine]);

    // Handle Jack In (Dolly Zoom inward over shoulder to monitor)
    const handleJackIn = () => {
        if (cameraMode !== 'orbit') return;
        audio.playWarpGlide();
        setCameraMode('dolly_in');
    };

    // Camera reached monitor -> Screen flare explosion & Holographic UI burst
    const handleDollyComplete = () => {
        setScreenFlare(true);
        audio.playSuccess();
        setTimeout(() => {
            setShowHologram(true);
            setCameraMode('at_screen');
        }, 150);
        setTimeout(() => {
            setScreenFlare(false);
        }, 800);
    };

    // Handle Return / Unjack back to 3D room
    const handleReturnToRoom = () => {
        setShowHologram(false);
        setScreenFlare(true);
        audio.playWarpOut();
        setCameraMode('dolly_out');
        setTimeout(() => {
            setScreenFlare(false);
        }, 700);
    };

    // Camera reversed back to orbit position
    const handleReturnComplete = () => {
        setCameraMode('orbit');
    };

    // Trigger specific character routine manually
    const handleSelectRoutine = (target: 'coding' | 'brewing' | 'bed') => {
        audio.playClick();
        if (target === 'coding') {
            if (currentRoutine === 'coding') return;
            setCurrentRoutine('returning_to_desk');
            setRoutineLabel('Returning to Battlestation...');
        } else if (target === 'brewing') {
            if (currentRoutine === 'brewing_coffee') return;
            setCurrentRoutine('walking_to_coffee');
            setRoutineLabel('Heading to Neon Espresso Bar...');
        } else if (target === 'bed') {
            if (currentRoutine === 'resting_bed') return;
            setCurrentRoutine('walking_to_bed');
            setRoutineLabel('Heading to Cyber Futon to Sleep...');
        }
    };

    const handleRoutineChange = (routine: CharacterRoutine, label: string) => {
        setCurrentRoutine(routine);
        setRoutineLabel(label);
    };

    const handleToggleSound = () => {
        const muted = audio.toggleMute();
        setIsMuted(muted);
    };

    const handleToggleLofi = () => {
        const active = audio.toggleLofi();
        setIsLofiPlaying(active);
    };

    return (
        <main className="relative w-full h-screen overflow-hidden bg-[#020408] select-none text-zinc-100">
            {/* 1. REAL-TIME 3D CYBERPUNK ISOMETRIC ROOM */}
            <div className="absolute inset-0 w-full h-full">
                <CyberRoomScene
                    cameraMode={cameraMode}
                    onDollyComplete={handleDollyComplete}
                    onReturnComplete={handleReturnComplete}
                    currentRoutine={currentRoutine}
                    onRoutineChange={handleRoutineChange}
                />
            </div>

            {/* 2. CINEMATIC OVERLAY & HUD (VISIBLE DURING ORBIT HERO PHASE) */}
            <AnimatePresence>
                {cameraMode === 'orbit' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.25 } }}
                        className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-8 md:p-10 z-20"
                    >
                        {/* TOP-RIGHT MINIMAL AUDIO CONTROLS */}
                        <header className="flex items-center justify-end pointer-events-auto">
                            <button
                                onClick={handleToggleSound}
                                onMouseEnter={() => audio.playHover()}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-950/70 border border-zinc-800 hover:border-cyan-400 text-zinc-300 hover:text-cyan-400 font-mono text-xs transition-all shadow-lg backdrop-blur-md group"
                                title={isMuted ? 'Unmute Lofi Audio' : 'Mute Lofi Audio'}
                            >
                                <span className={`w-2 h-2 rounded-full ${isMuted ? 'bg-zinc-600' : 'bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f5d4]'}`} />
                                <span className="text-[11px] text-zinc-400 group-hover:text-cyan-300">LOFI</span>
                                {isMuted ? (
                                    <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                                ) : (
                                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                                )}
                            </button>
                        </header>

                        {/* CENTER / BOTTOM HERO CTA & INTERACTIVE ROOM CONTROLS */}
                        <div className="flex flex-col items-center justify-center text-center space-y-5 max-w-xl mx-auto pointer-events-auto pb-6">
                            {/* Live Character Routine Status Badge */}
                            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs sm:text-sm shadow-[0_0_20px_rgba(0,245,212,0.25)] backdrop-blur-md">
                                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                <span>{routineLabel}</span>
                            </div>

                            {/* Direct Room Routine Action Triggers */}
                            <div className="flex flex-wrap items-center justify-center gap-2">
                                <button
                                    onClick={() => handleSelectRoutine('coding')}
                                    onMouseEnter={() => audio.playHover()}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                                        currentRoutine === 'coding'
                                            ? 'bg-cyan-500/30 border border-cyan-400 text-cyan-200 shadow-[0_0_12px_#00f5d4]'
                                            : 'bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                                    }`}
                                >
                                    <Code2 className="w-3.5 h-3.5" />
                                    <span>1. Code at Desk</span>
                                </button>
                                <button
                                    onClick={() => handleSelectRoutine('brewing')}
                                    onMouseEnter={() => audio.playHover()}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                                        currentRoutine === 'walking_to_coffee' || currentRoutine === 'brewing_coffee'
                                            ? 'bg-amber-500/30 border border-amber-400 text-amber-200 shadow-[0_0_12px_#ffb703]'
                                            : 'bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                                    }`}
                                >
                                    <Coffee className="w-3.5 h-3.5" />
                                    <span>2. Brew Espresso</span>
                                </button>
                                <button
                                    onClick={() => handleSelectRoutine('bed')}
                                    onMouseEnter={() => audio.playHover()}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                                        currentRoutine === 'walking_to_bed' || currentRoutine === 'resting_bed'
                                            ? 'bg-rose-500/30 border border-rose-400 text-rose-200 shadow-[0_0_12px_#f72585]'
                                            : 'bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                                    }`}
                                >
                                    <Moon className="w-3.5 h-3.5" />
                                    <span>3. Rest on Futon</span>
                                </button>
                            </div>

                            {/* PRIMARY CTA: ENTER SYSTEM // JACK IN */}
                            <div className="space-y-2">
                                <button
                                    onClick={handleJackIn}
                                    onMouseEnter={() => audio.playHover()}
                                    className="relative group px-8 py-3.5 sm:px-10 sm:py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-500 text-zinc-950 font-mono font-bold text-sm sm:text-base tracking-wider transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(0,245,212,0.6)] hover:shadow-[0_0_50px_rgba(0,245,212,0.9)] flex items-center gap-3 overflow-hidden"
                                >
                                    {/* Shimmer sweep */}
                                    <div className="absolute inset-0 bg-white/30 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                    <Sparkles className="w-5 h-5 text-zinc-950 animate-spin" />
                                    <span>ENTER SYSTEM // JACK IN</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                                </button>
                                <p className="text-[11px] font-mono text-cyan-400/80">
                                    Click or press <span className="font-bold text-white">[SPACE]</span> / Drag to Orbit
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 3. SCREEN FLARE EXPLOSION TRANSITION */}
            <AnimatePresence>
                {screenFlare && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1.1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="pointer-events-none absolute inset-0 z-40 bg-gradient-to-r from-cyan-400 via-white to-cyan-300 mix-blend-screen shadow-[0_0_120px_#00f5d4]"
                    />
                )}
            </AnimatePresence>

            {/* 4. 3D HOLOGRAPHIC PORTFOLIO INTERFACE BURST */}
            <AnimatePresence>
                {showHologram && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.95, filter: 'blur(6px)' }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="absolute inset-0 z-30"
                    >
                        <HolographicPortfolio onReturnToRoom={handleReturnToRoom} />
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}

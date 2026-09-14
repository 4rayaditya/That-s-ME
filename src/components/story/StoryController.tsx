'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Volume2,
    VolumeX,
    Camera,
    X,
    Sparkles,
    Sun,
    Sunset,
    Moon,
    Flame,
    Compass,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import HolographicPortfolio from '@/components/hologram/HolographicPortfolio';
import { CharacterRoutine } from '@/components/3d/CyberCharacter';
import { CameraMode } from '@/components/3d/CameraController';
import { audio } from '@/lib/audio';
import {
    EnvironmentPhase,
    ENVIRONMENT_CONFIGS,
    getLiveISTTime,
    ISTTimeData,
} from '@/lib/environment';

const CyberRoomScene = dynamic(() => import('@/components/3d/CyberRoomScene'), {
    ssr: false,
    loading: () => null,
});

export default function StoryController() {
    // Master story & camera phases
    const [cameraMode, setCameraMode] = useState<CameraMode>('orbit');
    const [showHologram, setShowHologram] = useState(false);
    const [screenFlare, setScreenFlare] = useState(false);

    // Tour mode info
    const [tourInfo, setTourInfo] = useState<{ name: string; index: number; total: number } | null>(null);

    // Indian Standard Time (IST) & Dynamic Day/Night Environmental Engine
    const [istData, setIstData] = useState<ISTTimeData>(getLiveISTTime());
    const [overridePhase, setOverridePhase] = useState<EnvironmentPhase | 'live'>('live');
    const activePhase: EnvironmentPhase = overridePhase === 'live' ? istData.phase : overridePhase;
    const activeConfig = ENVIRONMENT_CONFIGS[activePhase];

    // Character life simulation status
    const [currentRoutine, setCurrentRoutine] = useState<CharacterRoutine>('coding');
    const [routineLabel, setRoutineLabel] = useState('Compiling Neural Shaders & Live Hacking (Desk)');

    // Sound state
    const [isMuted, setIsMuted] = useState(false);
    const [isLofiPlaying, setIsLofiPlaying] = useState(false);

    // Synchronize Indian Time every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setIstData(getLiveISTTime());
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    // Synchronize default character routine with active time of day
    useEffect(() => {
        const cfg = ENVIRONMENT_CONFIGS[activePhase];
        if (cfg.defaultCharacterRoutine === 'resting_bed') {
            setCurrentRoutine('resting_bed');
            setRoutineLabel('Sleeping on Cyber Futon & Recharging 🛏️');
        } else if (cfg.defaultCharacterRoutine === 'brewing_coffee') {
            setCurrentRoutine('brewing_coffee');
            setRoutineLabel('Brewing Hyper-Caffeine Espresso & Sipping ☕');
        } else {
            setCurrentRoutine('coding');
            setRoutineLabel('Studying & Coding at Battlestation ⚡');
        }
    }, [activePhase]);

    // Audio & Global Key Listeners
    useEffect(() => {
        setIsMuted(audio.getMuted());
        audio.startLofi();
        setIsLofiPlaying(true);

        const handleUserGesture = () => {
            audio.startLofi();
            setIsLofiPlaying(true);
        };
        window.addEventListener('pointerdown', handleUserGesture, { once: true });
        window.addEventListener('keydown', handleUserGesture, { once: true });

        const handleKeyDown = (e: KeyboardEvent) => {
            if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
                return;
            }

            if (e.key === 'Escape') {
                if (cameraMode === 'tour') {
                    handleExitTour();
                } else if (showHologram) {
                    handleReturnToRoom();
                }
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
                } else if (e.key === 't' || e.key === 'T') {
                    handleStartTour();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('pointerdown', handleUserGesture);
        };
    }, [cameraMode, showHologram, currentRoutine]);

    // Jack In (Dolly Zoom into central monitor)
    const handleJackIn = () => {
        if (cameraMode !== 'orbit') return;
        audio.playWarpGlide();
        setCameraMode('dolly_in');
    };

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

    const handleReturnToRoom = () => {
        setShowHologram(false);
        setScreenFlare(true);
        audio.playWarpOut();
        setCameraMode('dolly_out');
        setTimeout(() => {
            setScreenFlare(false);
        }, 700);
    };

    const handleReturnComplete = () => {
        setCameraMode('orbit');
    };

    // Room Tour Controls
    const handleStartTour = () => {
        audio.playClick();
        setCameraMode('tour');
    };

    const handleExitTour = () => {
        audio.playClick();
        setCameraMode('orbit');
        setTourInfo(null);
    };

    const handleTourPoiChange = (name: string, index: number, total: number) => {
        setTourInfo({ name, index, total });
    };

    const handleTourComplete = () => {
        setCameraMode('orbit');
        setTourInfo(null);
    };

    // Character routine transitions
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

    return (
        <main className="relative w-full h-screen overflow-hidden bg-[#020408] select-none text-zinc-100 font-sans">
            {/* 1. REAL-TIME 3D ISOMETRIC CYBERPUNK ROOM */}
            <div className="absolute inset-0 w-full h-full">
                <CyberRoomScene
                    cameraMode={cameraMode}
                    onDollyComplete={handleDollyComplete}
                    onReturnComplete={handleReturnComplete}
                    onTourPoiChange={handleTourPoiChange}
                    onTourComplete={handleTourComplete}
                    currentRoutine={currentRoutine}
                    onRoutineChange={handleRoutineChange}
                    environmentPhase={activePhase}
                    onJackIn={handleJackIn}
                />
            </div>

            {/* 2. MINIMALIST CINEMATIC HUD (NO LARGE CENTER TEXTS) */}
            <AnimatePresence>
                {(cameraMode === 'orbit' || cameraMode === 'tour') && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-6 z-20"
                    >
                        {/* TOP BAR: LIVE INDIAN TIME WATCHER & AUDIO CONTROLS */}
                        <header className="flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
                            {/* Live Indian Standard Time & Environmental Vibe Selector */}
                            <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-zinc-950/80 border border-zinc-800/80 shadow-lg backdrop-blur-md">
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-700/60 text-xs font-mono">
                                    <span className="text-sm">🇮🇳</span>
                                    <span className="font-semibold text-zinc-200">{istData.formattedTime} IST</span>
                                    <span className="text-[10px] text-zinc-400">({istData.phaseLabel})</span>
                                </div>

                                {/* Quick Preview Phase Buttons */}
                                <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono">
                                    <button
                                        onClick={() => {
                                            audio.playClick();
                                            setOverridePhase('live');
                                        }}
                                        className={`px-2 py-0.5 rounded-full transition-all ${
                                            overridePhase === 'live'
                                                ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/60 shadow-[0_0_8px_rgba(0,245,212,0.4)]'
                                                : 'text-zinc-400 hover:text-zinc-200'
                                        }`}
                                        title="Synchronize with live Indian Standard Time"
                                    >
                                        Live
                                    </button>
                                    <button
                                        onClick={() => {
                                            audio.playClick();
                                            setOverridePhase('morning');
                                        }}
                                        className={`px-2 py-0.5 rounded-full transition-all ${
                                            overridePhase === 'morning'
                                                ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/60 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                                                : 'text-zinc-400 hover:text-zinc-200'
                                        }`}
                                        title="Morning: Cool green vibe, morning sunlight & green trees outside"
                                    >
                                        Morning 🌿
                                    </button>
                                    <button
                                        onClick={() => {
                                            audio.playClick();
                                            setOverridePhase('afternoon');
                                        }}
                                        className={`px-2 py-0.5 rounded-full transition-all ${
                                            overridePhase === 'afternoon'
                                                ? 'bg-sky-500/30 text-sky-300 border border-sky-400/60 shadow-[0_0_8px_rgba(14,165,233,0.4)]'
                                                : 'text-zinc-400 hover:text-zinc-200'
                                        }`}
                                        title="Afternoon: Bright daylight & high clarity"
                                    >
                                        Afternoon ☀️
                                    </button>
                                    <button
                                        onClick={() => {
                                            audio.playClick();
                                            setOverridePhase('evening');
                                        }}
                                        className={`px-2 py-0.5 rounded-full transition-all ${
                                            overridePhase === 'evening'
                                                ? 'bg-amber-500/30 text-amber-300 border border-amber-400/60 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                                                : 'text-zinc-400 hover:text-zinc-200'
                                        }`}
                                        title="Evening: Golden hour twilight study vibe at desk"
                                    >
                                        Evening 🌆
                                    </button>
                                    <button
                                        onClick={() => {
                                            audio.playClick();
                                            setOverridePhase('night');
                                        }}
                                        className={`px-2 py-0.5 rounded-full transition-all ${
                                            overridePhase === 'night'
                                                ? 'bg-rose-500/30 text-rose-300 border border-rose-400/60 shadow-[0_0_8px_rgba(244,63,94,0.4)]'
                                                : 'text-zinc-400 hover:text-zinc-200'
                                        }`}
                                        title="Night: Cyberpunk dark neon aesthetic & sleeping in bed"
                                    >
                                        Night 🌙
                                    </button>
                                </div>
                            </div>

                            {/* Minimal Audio Controls (Top-Right) */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleToggleSound}
                                    onMouseEnter={() => audio.playHover()}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-950/70 border border-zinc-800 hover:border-cyan-400 text-zinc-300 hover:text-cyan-400 font-mono text-xs transition-all shadow-lg backdrop-blur-md group"
                                    title={isMuted ? 'Unmute Lofi Audio' : 'Mute Lofi Audio'}
                                >
                                    <span
                                        className={`w-2 h-2 rounded-full ${
                                            isMuted ? 'bg-zinc-600' : 'bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f5d4]'
                                        }`}
                                    />
                                    <span className="text-[11px] text-zinc-400 group-hover:text-cyan-300">LOFI</span>
                                    {isMuted ? (
                                        <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                                    ) : (
                                        <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                                    )}
                                </button>
                            </div>
                        </header>

                        {/* BOTTOM FLOATING ACTION DOCK */}
                        <footer className="flex items-center justify-between w-full pointer-events-auto pt-4">
                            {/* Live Routine Badge (Subtle, bottom left) */}
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-950/70 border border-zinc-800/80 text-zinc-300 font-mono text-xs backdrop-blur-md">
                                <span
                                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                                    style={{ backgroundColor: activeConfig.accentColor }}
                                />
                                <span className="text-[11px] text-zinc-400">{routineLabel}</span>
                            </div>

                            {/* FLOATING ROOM TOUR BUTTON / TOUR STATUS */}
                            <div className="mx-auto sm:mx-0 flex items-center gap-3">
                                {cameraMode === 'tour' ? (
                                    <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-950/90 border border-cyan-400 text-cyan-300 font-mono text-xs shadow-[0_0_25px_rgba(0,245,212,0.4)] backdrop-blur-md animate-pulse">
                                        <Compass className="w-4 h-4 text-cyan-400 animate-spin" />
                                        <span>
                                            {tourInfo
                                                ? `${tourInfo.index}/${tourInfo.total}: ${tourInfo.name}`
                                                : 'Cinematic Room Tour Active...'}
                                        </span>
                                        <button
                                            onClick={handleExitTour}
                                            className="ml-2 p-1 rounded-full bg-zinc-800 hover:bg-rose-500 hover:text-white transition-colors"
                                            title="Exit Room Tour (Esc)"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleStartTour}
                                        onMouseEnter={() => audio.playHover()}
                                        className="group flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-950/80 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 hover:text-white font-mono text-xs shadow-[0_0_18px_rgba(0,245,212,0.3)] hover:shadow-[0_0_30px_rgba(0,245,212,0.7)] hover:scale-105 transition-all backdrop-blur-md"
                                        title="Start Guided Cinematic Room Tour (Press T)"
                                    >
                                        <Camera className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
                                        <span>🎥 Room Tour</span>
                                    </button>
                                )}
                            </div>
                        </footer>
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

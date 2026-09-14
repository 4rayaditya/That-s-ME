'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Sun, Moon } from 'lucide-react';
import dynamic from 'next/dynamic';
import HolographicPortfolio from '@/components/hologram/HolographicPortfolio';
import { CharacterRoutine } from '@/components/3d/CyberCharacter';
import { CameraMode } from '@/components/3d/CameraController';
import { audio } from '@/lib/audio';
import {
    EnvironmentPhase,
    ENVIRONMENT_CONFIGS,
    getLiveISTTime,
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

    // Live Indian Standard Time (IST = UTC+5:30) & Dynamic Atmosphere Engine
    const [activePhase, setActivePhase] = useState<EnvironmentPhase>(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('portfolio_theme_mode');
                if (saved === 'dark') return 'night';
                if (saved === 'light') return 'morning';
            } catch {}
        }
        return getLiveISTTime().phase;
    });

    const [isLightMode, setIsLightMode] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('portfolio_theme_mode');
                if (saved === 'dark') return false;
                if (saved === 'light') return true;
            } catch {}
        }
        const p = getLiveISTTime().phase;
        return p === 'morning' || p === 'afternoon';
    });

    // Tracks whether the user explicitly toggled Dark / Light mode so it NEVER gets overridden by automatic timers!
    const userOverrodeThemeRef = useRef<boolean>(false);

    // Character life simulation status
    const [currentRoutine, setCurrentRoutine] = useState<CharacterRoutine>('coding');
    const [, setRoutineLabel] = useState('Studying & Coding at Battlestation (Desk)');

    // Sound state
    const [isMuted, setIsMuted] = useState(false);

    // Check localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('portfolio_theme_mode');
            if (saved === 'dark') {
                userOverrodeThemeRef.current = true;
                setIsLightMode(false);
                setActivePhase('night');
            } else if (saved === 'light') {
                userOverrodeThemeRef.current = true;
                setIsLightMode(true);
                setActivePhase('morning');
            }
        } catch {}
    }, []);

    const handleToggleTheme = () => {
        audio.playClick();
        userOverrodeThemeRef.current = true;
        setIsLightMode((prev) => {
            const next = !prev;
            const newPhase: EnvironmentPhase = next ? 'morning' : 'night';
            setActivePhase(newPhase);
            try {
                localStorage.setItem('portfolio_theme_mode', next ? 'light' : 'dark');
            } catch {}
            return next;
        });
    };

    // Continuously sync with live Indian Time ONLY IF the user has NOT manually set Dark/Light mode!
    useEffect(() => {
        const checkTime = () => {
            if (userOverrodeThemeRef.current) return;
            const ist = getLiveISTTime();
            setActivePhase(ist.phase);
            setIsLightMode(ist.phase === 'morning' || ist.phase === 'afternoon');
        };
        const interval = setInterval(checkTime, 10000);
        return () => clearInterval(interval);
    }, []);

    // Audio & Global Key Listeners
    useEffect(() => {
        setIsMuted(audio.getMuted());
        audio.startLofi();

        const handleUserGesture = () => {
            audio.startLofi();
        };
        window.addEventListener('pointerdown', handleUserGesture, { once: true });
        window.addEventListener('keydown', handleUserGesture, { once: true });

        const handleKeyDown = (e: KeyboardEvent) => {
            if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
                return;
            }

            if (e.key === 'Escape' && showHologram) {
                handleReturnToRoom();
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
        <main className="relative w-full h-screen overflow-hidden bg-[#020408] select-none text-zinc-100">
            {/* 1. REAL-TIME 3D ISOMETRIC ROOM WITH FLOATING INTERACTIVE BUTTONS ONLY */}
            <div className="absolute inset-0 w-full h-full">
                <CyberRoomScene
                    cameraMode={cameraMode}
                    onDollyComplete={handleDollyComplete}
                    onReturnComplete={handleReturnComplete}
                    currentRoutine={currentRoutine}
                    onRoutineChange={handleRoutineChange}
                    environmentPhase={activePhase}
                    onJackIn={handleJackIn}
                />
            </div>

            {/* 2. HEADER CONTROLS: THEME SWITCH (LIGHT/DARK) & AUDIO TOGGLE */}
            <header className="absolute top-4 right-4 z-20 pointer-events-auto flex items-center gap-2.5">
                <button
                    onClick={handleToggleTheme}
                    onMouseEnter={() => audio.playHover()}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-zinc-950/70 border border-zinc-700/80 hover:border-amber-400/90 text-zinc-300 hover:text-amber-300 transition-all shadow-md backdrop-blur-md cursor-pointer group"
                    title={isLightMode ? 'Switch to Cozy Dark Mode' : 'Switch to Sunlit Light Mode'}
                    aria-label="Toggle Dark / Light Mode"
                >
                    {isLightMode ? (
                        <>
                            <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
                            <span className="text-xs font-mono font-medium text-amber-200">Light Mode</span>
                        </>
                    ) : (
                        <>
                            <Moon className="w-4 h-4 text-amber-300 group-hover:-rotate-12 transition-transform" />
                            <span className="text-xs font-mono font-medium text-amber-200">Dark Mode</span>
                        </>
                    )}
                </button>

                <button
                    onClick={handleToggleSound}
                    onMouseEnter={() => audio.playHover()}
                    className="flex items-center justify-center p-2.5 rounded-full bg-zinc-950/70 border border-zinc-700/80 hover:border-amber-400/80 text-zinc-400 hover:text-amber-300 transition-all shadow-md backdrop-blur-md cursor-pointer"
                    title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                    aria-label="Toggle Audio"
                >
                    {isMuted ? (
                        <VolumeX className="w-4 h-4 text-rose-400" />
                    ) : (
                        <Volume2 className="w-4 h-4 text-amber-300" />
                    )}
                </button>
            </header>

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

            {/* 4. 3D HOLOGRAPHIC PORTFOLIO INTERFACE (ON JACK IN) */}
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

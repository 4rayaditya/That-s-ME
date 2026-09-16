'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Volume2,
    VolumeX,
    Monitor,
    Compass,
    Camera,
    Gamepad2,
    ChevronRight,
    ChevronLeft,
    X,
    Info,
    RotateCcw,
    Eye,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import WindowsDesktop from '@/components/os/WindowsDesktop';
import { CharacterRoutine } from '@/components/3d/CyberCharacter';
import { CameraMode, TOUR_STOPS } from '@/components/3d/CameraController';
import { audio } from '@/lib/audio';
import { EnvironmentPhase } from '@/lib/environment';

const LoadingPlaceholder = () => (
    <div className="w-full h-full bg-[#020408]" />
);

const CyberRoomScene = dynamic(() => import('@/components/3d/CyberRoomScene'), {
    ssr: false,
    loading: LoadingPlaceholder,
});

const MENU_OPTIONS = [
    {
        id: 'portfolio' as const,
        title: 'ENTER PORTFOLIO',
        description: '',
    },
    {
        id: 'explore' as const,
        title: 'EXPLORE ROOM',
        description: 'Free-roam orbit camera with interactive room hotspots & daily routines',
    },
    {
        id: 'walk' as const,
        title: 'GTA V WALK',
        description: 'First-person movement with WASD controls and sprint',
    },
    {
        id: 'tour' as const,
        title: 'CINEMATIC TOUR',
        description: 'Automated cinematic camera sequence dwelling 5 seconds at each room showcase',
    },
];

export default function StoryController() {
    // Master story & camera phases
    const [cameraMode, setCameraMode] = useState<CameraMode>('orbit');
    const [showHologram, setShowHologram] = useState(false);

    // Title Screen state (Full Modern Menu)
    const [showTitleMenu, setShowTitleMenu] = useState(true);
    const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);
    const [discoveryHint, setDiscoveryHint] = useState<string | null>(null);

    // Pending jack-in when returning to battlestation
    const pendingJackInRef = useRef(false);

    // Tour telemetry state
    const [currentTourName, setCurrentTourName] = useState<string>('BATTLESTATION // WORKSPACE');
    const [currentTourIndex, setCurrentTourIndex] = useState<number>(0);
    const [tourProgress, setTourProgress] = useState<number>(0);
    const [forcedTourIndex, setForcedTourIndex] = useState<number | null>(null);

    // Always dark mode (night)
    const [activePhase] = useState<EnvironmentPhase>('night');

    // Character life simulation status
    const [currentRoutine, setCurrentRoutine] = useState<CharacterRoutine>('coding');

    // Sound state
    const [isMuted, setIsMuted] = useState(false);

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

            // In Title Menu: handle Arrow navigation, Enter/Space, number shortcuts, Escape
            if (showTitleMenu) {
                if (e.key === 'Escape') {
                    setShowTitleMenu(false);
                    return;
                }
                if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                    e.preventDefault();
                    audio.playHover();
                    setSelectedMenuIndex((prev) => (prev + 1) % MENU_OPTIONS.length);
                    return;
                }
                if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
                    e.preventDefault();
                    audio.playHover();
                    setSelectedMenuIndex((prev) => (prev - 1 + MENU_OPTIONS.length) % MENU_OPTIONS.length);
                    return;
                }
                if (e.key === 'Enter' || e.code === 'Space') {
                    e.preventDefault();
                    handleTitleSelect(MENU_OPTIONS[selectedMenuIndex].id);
                    return;
                }
                if (e.key === '1') {
                    e.preventDefault();
                    handleTitleSelect('portfolio');
                    return;
                }
                if (e.key === '2') {
                    e.preventDefault();
                    handleTitleSelect('explore');
                    return;
                }
                if (e.key === '3') {
                    e.preventDefault();
                    handleTitleSelect('walk');
                    return;
                }
                if (e.key === '4') {
                    e.preventDefault();
                    handleTitleSelect('tour');
                    return;
                }
                return;
            }

            // In Windows OS Hologram: Escape returns to 3D room
            if (e.key === 'Escape' && showHologram) {
                handleReturnToRoom();
                return;
            }

            // Press 'V' to cycle views (GTA 5 Style camera toggle)
            if (e.key === 'v' || e.key === 'V') {
                if (!showHologram) {
                    handleCycleCameraView();
                    return;
                }
            }

            // In 3D Room Orbit / Walk
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
            } else if (cameraMode === 'walk' || cameraMode === 'tour') {
                if (e.key === 'Escape') {
                    audio.playClick();
                    setCameraMode('orbit');
                    return;
                } else if (e.code === 'Space' || e.key === 'Enter') {
                    e.preventDefault();
                    handleJackIn();
                    return;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('pointerdown', handleUserGesture);
        };
    }, [cameraMode, showHologram, currentRoutine, showTitleMenu]);

    // GTA 5 style Camera View Toggle (V key or button)
    const handleCycleCameraView = () => {
        audio.playClick();
        if (cameraMode === 'orbit') {
            setCameraMode('walk');
            setDiscoveryHint('GTA 5 Walk Mode: Use WASD / Arrow Keys to walk, mouse drag to look around.');
            setTimeout(() => setDiscoveryHint(null), 5000);
        } else if (cameraMode === 'walk') {
            setCameraMode('tour');
            setDiscoveryHint('Cinematic Tour: Auto-switching camera angles every 5 seconds.');
            setTimeout(() => setDiscoveryHint(null), 5000);
        } else {
            setCameraMode('orbit');
        }
    };

    // Jack In (Subtle, smooth transition into battlestation computer)
    const handleJackIn = useCallback(() => {
        audio.playClick();
        setCameraMode('dolly_in');
    }, []);

    // Setup / Code button action:
    // If character is already on setup -> immediately enter portfolio
    // If character is away from setup -> go to setup and open portfolio upon arrival
    const handleSelectSetup = useCallback(() => {
        audio.playClick();
        if (currentRoutine === 'coding') {
            handleJackIn();
        } else {
            pendingJackInRef.current = true;
            setCurrentRoutine('returning_to_desk');
            setDiscoveryHint('Returning to battlestation to launch portfolio...');
            setTimeout(() => setDiscoveryHint(null), 4000);
        }
    }, [currentRoutine, handleJackIn]);

    const handleRoutineChange = useCallback((routine: CharacterRoutine) => {
        setCurrentRoutine(routine);
        if (routine === 'coding' && pendingJackInRef.current) {
            pendingJackInRef.current = false;
            handleJackIn();
        }
    }, [handleJackIn]);

    // Title menu selection dispatcher
    const handleTitleSelect = (option: 'portfolio' | 'explore' | 'walk' | 'tour') => {
        audio.playClick();
        setShowTitleMenu(false);

        if (option === 'portfolio') {
            setCurrentRoutine('coding');
            setCameraMode('dolly_in');
        } else if (option === 'tour') {
            setForcedTourIndex(0);
            setCameraMode('tour');
        } else if (option === 'walk') {
            setCameraMode('walk');
            setDiscoveryHint('GTA 5 Walk Mode: Use WASD / Arrow Keys to walk, mouse to look around.');
            setTimeout(() => setDiscoveryHint(null), 5500);
        } else {
            // 'explore'
            setCameraMode('orbit');
            setDiscoveryHint('Click the battlestation monitors or press [Enter] anytime to open portfolio.');
            setTimeout(() => setDiscoveryHint(null), 6000);
        }
    };

    const handleDollyComplete = () => {
        setShowHologram(true);
        setCameraMode('at_screen');
    };

    const handleReturnToRoom = () => {
        audio.playClick();
        setShowHologram(false);
        setCameraMode('dolly_out');
    };

    const handleReturnComplete = () => {
        setCameraMode('orbit');
    };

    const handleTourPoiChange = useCallback((name: string, index: number) => {
        setCurrentTourName(name);
        setCurrentTourIndex(index - 1);
        setTourProgress(0);
    }, []);

    const handleTourComplete = useCallback(() => {
        setCameraMode('orbit');
        setDiscoveryHint('Tour complete. Click the battlestation or press [Enter] to launch portfolio.');
        setTimeout(() => setDiscoveryHint(null), 6000);
    }, []);

    const handleNextTourAngle = () => {
        audio.playClick();
        const nextIdx = (currentTourIndex + 1) % TOUR_STOPS.length;
        setForcedTourIndex(nextIdx);
        setCurrentTourIndex(nextIdx);
        setCurrentTourName(TOUR_STOPS[nextIdx].name);
        setTourProgress(0);
    };

    const handlePrevTourAngle = () => {
        audio.playClick();
        const prevIdx = (currentTourIndex - 1 + TOUR_STOPS.length) % TOUR_STOPS.length;
        setForcedTourIndex(prevIdx);
        setCurrentTourIndex(prevIdx);
        setCurrentTourName(TOUR_STOPS[prevIdx].name);
        setTourProgress(0);
    };

    // Character routine transitions
    const handleSelectRoutine = (target: 'coding' | 'brewing' | 'bed' | 'fridge') => {
        audio.playClick();
        pendingJackInRef.current = false;
        if (target === 'coding') {
            if (currentRoutine === 'coding') return;
            setCurrentRoutine('returning_to_desk');
        } else if (target === 'brewing') {
            if (currentRoutine === 'brewing_coffee') return;
            setCurrentRoutine('walking_to_coffee');
        } else if (target === 'bed') {
            if (currentRoutine === 'resting_bed') return;
            setCurrentRoutine('walking_to_bed');
        } else if (target === 'fridge') {
            if (currentRoutine === 'snacking_at_fridge') return;
            setCurrentRoutine('walking_to_fridge');
        }
    };

    const handleToggleSound = () => {
        const muted = audio.toggleMute();
        setIsMuted(muted);
    };

    return (
        <main className="relative w-full h-dvh overflow-hidden bg-[#020408] select-none text-zinc-100 font-sans">
            {/* 1. REAL-TIME 3D ISOMETRIC ROOM */}
            <div className="absolute inset-0 w-full h-full">
                <CyberRoomScene
                    cameraMode={cameraMode}
                    onDollyComplete={handleDollyComplete}
                    onReturnComplete={handleReturnComplete}
                    onTourPoiChange={handleTourPoiChange}
                    onTourComplete={handleTourComplete}
                    onTourProgress={setTourProgress}
                    forcedTourIndex={forcedTourIndex}
                    currentRoutine={currentRoutine}
                    onRoutineChange={handleRoutineChange}
                    environmentPhase={activePhase}
                    onJackIn={handleJackIn}
                    onSelectSetup={handleSelectSetup}
                    isMenuOpen={showTitleMenu}
                />
            </div>

            {/* 2. HEADER CONTROLS: CAMERA VIEW SWITCHER, EXPERIENCE MENU & AUDIO */}
            <header className="absolute top-4 right-4 z-30 pointer-events-auto flex items-center gap-2.5">
                {!showHologram && (
                    <>
                        {/* GTA 5 Camera View Cycle Button */}
                        <button
                            onClick={handleCycleCameraView}
                            onMouseEnter={() => audio.playHover()}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-zinc-950/80 border border-zinc-700/80 hover:border-cyan-400 text-zinc-300 hover:text-cyan-300 text-xs font-mono transition-all shadow-md backdrop-blur-md cursor-pointer"
                            title="Cycle Camera View (Press V)"
                        >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">View [V]:</span>
                            <span className="text-cyan-400 uppercase font-semibold">
                                {cameraMode === 'walk' ? 'Walk' : cameraMode === 'tour' ? 'Tour' : 'Room'}
                            </span>
                        </button>

                        {/* Minecraft-Style Menu Reopen Button */}
                        <button
                            onClick={() => {
                                audio.playClick();
                                setShowTitleMenu(true);
                            }}
                            onMouseEnter={() => audio.playHover()}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-zinc-950/80 border border-zinc-700/80 hover:border-amber-400 text-zinc-300 hover:text-amber-300 text-xs font-mono transition-all shadow-md backdrop-blur-md cursor-pointer"
                            title="Open Experience Selection Menu"
                        >
                            <Compass className="w-3.5 h-3.5" />
                            <span>Menu</span>
                        </button>
                    </>
                )}

                {/* Audio Toggle */}
                <button
                    onClick={handleToggleSound}
                    onMouseEnter={() => audio.playHover()}
                    className="flex items-center justify-center p-2.5 rounded-full bg-zinc-950/80 border border-zinc-700/80 hover:border-amber-400 text-zinc-400 hover:text-amber-300 transition-all shadow-md backdrop-blur-md cursor-pointer"
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

            {/* 3. GTA 5 WALK MODE HUD (When in 'walk' mode - Bottom Left, Styled like Menu) */}
            <AnimatePresence>
                {cameraMode === 'walk' && !showHologram && !showTitleMenu && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.25 }}
                        className="absolute bottom-6 left-6 z-20 pointer-events-auto flex flex-col items-start gap-2 select-none"
                    >
                        <div className="flex flex-col gap-2.5 p-3.5 rounded-lg bg-black/40 border border-zinc-100 shadow-[0_0_25px_rgba(255,255,255,0.15)] backdrop-blur-md font-mono text-zinc-100 min-w-[200px]">
                            <div className="flex items-center justify-between gap-4 pb-1.5 border-b border-zinc-800">
                                <span className="text-xs font-bold tracking-[0.2em] uppercase text-white">
                                    GTA V WALK
                                </span>
                                <button
                                    onClick={() => setCameraMode('orbit')}
                                    className="px-2 py-0.5 rounded border border-zinc-500 hover:border-white bg-white/5 hover:bg-white/15 text-[10px] text-zinc-300 hover:text-white transition-all cursor-pointer uppercase tracking-wider"
                                >
                                    [ESC] Exit
                                </button>
                            </div>
                            <div className="flex flex-col gap-1.5 text-[11px] text-zinc-300">
                                <span className="flex items-center gap-2">
                                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-900/90 border border-zinc-700 text-[10px] text-zinc-200 font-mono shadow-sm">
                                        WASD
                                    </kbd>
                                    <span>Move & Steer</span>
                                </span>
                                <span className="flex items-center gap-2">
                                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-900/90 border border-zinc-700 text-[10px] text-zinc-200 font-mono shadow-sm">
                                        SHIFT
                                    </kbd>
                                    <span>Sprint</span>
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 4. CINEMATIC TOUR HUD (Styled with exact border, font & design as menu page) */}
            <AnimatePresence>
                {cameraMode === 'tour' && !showHologram && !showTitleMenu && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.25 }}
                        className="absolute top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex flex-col items-center gap-2 w-[92%] max-w-md select-none"
                    >
                        <div className="w-full p-3.5 rounded-lg bg-black/40 border border-zinc-100 shadow-[0_0_25px_rgba(255,255,255,0.15)] backdrop-blur-md flex flex-col gap-2.5 font-mono text-zinc-100">
                            <div className="flex items-center justify-between text-xs tracking-wider">
                                <span className="font-bold tracking-[0.2em] text-white uppercase text-[11px] sm:text-xs">
                                    {currentTourName}
                                </span>
                                <span className="text-zinc-300 font-bold text-[11px]">
                                    [ {currentTourIndex + 1}/{TOUR_STOPS.length} ]
                                </span>
                            </div>

                            {/* Sleek white progress bar matching menu style */}
                            <div className="w-full h-1 rounded-full bg-white/20 overflow-hidden">
                                <div
                                    className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)] transition-all duration-100 ease-linear rounded-full"
                                    style={{ width: `${Math.round(tourProgress * 100)}%` }}
                                />
                            </div>

                            {/* Tour Controls (Next, Prev, Exit) */}
                            <div className="flex items-center justify-between pt-0.5 text-[11px] text-zinc-400">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handlePrevTourAngle}
                                        className="px-2 py-0.5 rounded border border-zinc-600 hover:border-zinc-200 bg-white/5 hover:bg-white/15 text-zinc-200 hover:text-white transition-all cursor-pointer"
                                        title="Previous Angle"
                                    >
                                        <ChevronLeft className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={handleNextTourAngle}
                                        className="px-2 py-0.5 rounded border border-zinc-600 hover:border-zinc-200 bg-white/5 hover:bg-white/15 text-zinc-200 hover:text-white transition-all cursor-pointer"
                                        title="Next Angle"
                                    >
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="text-[10px] text-zinc-400 tracking-wider ml-1">Auto: 5s</span>
                                </div>

                                <button
                                    onClick={() => {
                                        audio.playClick();
                                        setCameraMode('orbit');
                                    }}
                                    className="px-2.5 py-0.5 rounded border border-zinc-600 hover:border-zinc-200 bg-white/5 hover:bg-white/15 text-zinc-200 hover:text-white transition-all text-[10px] tracking-wider uppercase cursor-pointer"
                                >
                                    [ESC] Exit
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 5. DISCOVERY FLOATING TOAST (Shown when entering room explore) */}
            <AnimatePresence>
                {discoveryHint && !showHologram && !showTitleMenu && cameraMode === 'orbit' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.25 }}
                        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex items-center gap-3 px-4 py-2.5 rounded-xl bg-zinc-950/90 border border-amber-500/40 shadow-2xl backdrop-blur-md text-xs font-mono text-zinc-200"
                    >
                        <div className="p-1 rounded bg-amber-500/20 text-amber-300">
                            <Info className="w-4 h-4" />
                        </div>
                        <span>{discoveryHint}</span>
                        <button
                            onClick={() => setDiscoveryHint(null)}
                            className="p-1 text-zinc-400 hover:text-zinc-200 transition-colors ml-1 cursor-pointer"
                            aria-label="Dismiss hint"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 6. FULL MODERN MENU (MATCHING REFERENCE IMAGE, TRANSLUCENT GLASSMORPHISM, NO EMOJIS) */}
            <AnimatePresence>
                {showTitleMenu && !showHologram && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.28 }}
                        className="absolute inset-0 z-[100] flex flex-col justify-between items-center px-6 py-8 sm:py-12 bg-black/35 backdrop-blur-[2px] pointer-events-auto select-none"
                    >
                        {/* TOP: FULL MODERN MENU TITLE (Without subtitle) */}
                        <div className="flex flex-col items-center pt-6 sm:pt-10">
                            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-[0.2em] font-mono text-zinc-100 uppercase drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] text-center leading-tight">
                                ADITYA RAY
                            </h1>
                        </div>

                        {/* CENTER: MINIMALIST VERTICAL BUTTONS LIST (ACTIVE OPTION IN CRISP WIREFRAME BOX) */}
                        <div className="w-full max-w-sm flex flex-col items-center gap-3 my-auto">
                            {MENU_OPTIONS.map((opt, idx) => {
                                const isSelected = selectedMenuIndex === idx;
                                return (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleTitleSelect(opt.id)}
                                        onMouseEnter={() => {
                                            if (selectedMenuIndex !== idx) {
                                                audio.playHover();
                                                setSelectedMenuIndex(idx);
                                            }
                                        }}
                                        className={`w-full max-w-[280px] sm:max-w-[320px] py-2.5 sm:py-3 text-center text-xs sm:text-sm font-mono tracking-[0.25em] uppercase transition-all duration-150 cursor-pointer ${
                                            isSelected
                                                ? 'border border-zinc-100 bg-white/10 text-white shadow-[0_0_25px_rgba(255,255,255,0.18)] font-bold'
                                                : 'border border-transparent text-zinc-400 hover:text-zinc-200 font-medium'
                                        }`}
                                    >
                                        {opt.title}
                                    </button>
                                );
                            })}
                        </div>

                        {/* BOTTOM: HOVER DESCRIPTION, KEYBOARD HELPER & VERSION */}
                        <div className="w-full flex flex-col items-center gap-3 pb-2">
                            {/* Dynamic Description matching hovered/active item */}
                            <p className="text-xs sm:text-sm font-mono text-zinc-300 tracking-wide text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] min-h-[22px] max-w-lg px-4">
                                {MENU_OPTIONS[selectedMenuIndex]?.description}
                            </p>

                            {/* Keyboard controls helper */}
                            <div className="flex items-center gap-5 text-[11px] font-mono text-zinc-400 drop-shadow">
                                <span className="flex items-center gap-1.5">
                                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-900/90 border border-zinc-700 text-[10px] text-zinc-200 font-mono shadow-sm">
                                        ESC
                                    </kbd>
                                    Quit
                                </span>
                                <span className="text-zinc-600">•</span>
                                <span className="flex items-center gap-1.5">
                                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-900/90 border border-zinc-700 text-[10px] text-zinc-200 font-mono shadow-sm">
                                        ENTER
                                    </kbd>
                                    Select
                                </span>
                                <span className="text-zinc-600 hidden sm:inline">•</span>
                                <span className="hidden sm:flex items-center gap-1.5">
                                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-900/90 border border-zinc-700 text-[10px] text-zinc-200 font-mono shadow-sm">
                                        ↑ / ↓
                                    </kbd>
                                    Navigate
                                </span>
                            </div>

                            {/* Version Tag (Absolute bottom right like reference screenshot) */}
                            <div className="absolute bottom-4 right-6 text-[10px] sm:text-xs font-mono text-zinc-500 tracking-wider select-none pointer-events-none">
                                Ver 2.4.0
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 7. WINDOWS 7 WORKSTATION HOMESCREEN (ON JACK IN) */}
            <AnimatePresence>
                {showHologram && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className="absolute inset-0 z-50"
                    >
                        <WindowsDesktop onReturnToRoom={handleReturnToRoom} />
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}

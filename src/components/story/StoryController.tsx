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

// ─── Mobile Virtual Joystick + Touch Controls for First-Person Walk Mode ────────
function MobileWalkControls({
    onMove,
    onExit,
    onEnterPortfolio,
}: {
    onMove: (fwd: number, right: number, isToggling?: boolean) => void;
    onExit: () => void;
    onEnterPortfolio: () => void;
}) {
    const stickBaseRef = useRef<HTMLDivElement>(null);
    const stickKnobRef = useRef<HTMLDivElement>(null);
    const touchIdRef = useRef<number | null>(null);
    const baseOriginRef = useRef({ x: 0, y: 0 });
    const MAX_R = 36;

    useEffect(() => {
        const base = stickBaseRef.current;
        const knob = stickKnobRef.current;
        if (!base || !knob) return;

        const onTouchStart = (e: TouchEvent) => {
            e.stopPropagation();
            if (touchIdRef.current !== null) return;
            const t = e.changedTouches[0];
            touchIdRef.current = t.identifier;
            const rect = base.getBoundingClientRect();
            baseOriginRef.current = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
            };
            onMove(0, 0, true);
        };

        const onTouchMove = (e: TouchEvent) => {
            e.stopPropagation();
            if (touchIdRef.current === null) return;
            let t: Touch | null = null;
            for (let i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === touchIdRef.current) {
                    t = e.changedTouches[i];
                    break;
                }
            }
            if (!t) return;
            const dx = t.clientX - baseOriginRef.current.x;
            const dy = t.clientY - baseOriginRef.current.y;
            const dist = Math.hypot(dx, dy);
            const clamped = Math.min(dist, MAX_R);
            const angle = Math.atan2(dy, dx);
            const nx = Math.cos(angle) * clamped;
            const ny = Math.sin(angle) * clamped;
            if (knob) {
                knob.style.transform = `translate(calc(-50% + ${nx}px), calc(-50% + ${ny}px))`;
            }
            // fwd = -y component, right = x component (normalised -1..1)
            const factor = clamped / MAX_R;
            const fwd = -Math.sin(angle) * factor;
            const right = Math.cos(angle) * factor;
            const isToggling = clamped > 4;
            onMove(fwd, right, isToggling);
        };

        const onTouchEnd = (e: TouchEvent) => {
            e.stopPropagation();
            for (let i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === touchIdRef.current) {
                    touchIdRef.current = null;
                    if (knob) knob.style.transform = 'translate(-50%, -50%)';
                    onMove(0, 0, false);
                    break;
                }
            }
        };

        base.addEventListener('touchstart', onTouchStart, { passive: true });
        base.addEventListener('touchmove', onTouchMove, { passive: true });
        base.addEventListener('touchend', onTouchEnd, { passive: true });
        base.addEventListener('touchcancel', onTouchEnd, { passive: true });
        return () => {
            base.removeEventListener('touchstart', onTouchStart);
            base.removeEventListener('touchmove', onTouchMove);
            base.removeEventListener('touchend', onTouchEnd);
            base.removeEventListener('touchcancel', onTouchEnd);
        };
    }, [onMove]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="sm:hidden absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
        >
            {/* Left side: virtual joystick */}
            <div className="absolute bottom-8 left-8 pointer-events-auto">
                <div
                    ref={stickBaseRef}
                    className="relative w-24 h-24 rounded-full bg-white/10 border border-white/30 backdrop-blur-sm"
                    style={{ touchAction: 'none' }}
                >
                    <div
                        ref={stickKnobRef}
                        className="absolute top-1/2 left-1/2 w-10 h-10 rounded-full bg-white/40 border border-white/60"
                        style={{ transform: 'translate(-50%, -50%)' }}
                    />
                </div>
            </div>

            {/* Right side: action buttons */}
            <div className="absolute bottom-8 right-8 flex flex-col gap-3 pointer-events-auto">
                <button
                    onTouchStart={(e) => { e.stopPropagation(); onEnterPortfolio(); }}
                    className="px-3 py-2 rounded-lg bg-white/15 border border-white/40 text-white text-[11px] font-mono tracking-widest uppercase backdrop-blur-sm active:bg-white/30"
                    style={{ touchAction: 'none' }}
                >
                    Portfolio
                </button>
                <button
                    onTouchStart={(e) => { e.stopPropagation(); onExit(); }}
                    className="px-3 py-2 rounded-lg bg-white/10 border border-zinc-400/40 text-zinc-300 text-[11px] font-mono tracking-widest uppercase backdrop-blur-sm active:bg-white/20"
                    style={{ touchAction: 'none' }}
                >
                    Exit
                </button>
            </div>
        </motion.div>
    );
}
// ──────────────────────────────────────────────────────────────────────────────

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
        title: 'FIRST-PERSON EXPLORE',
        description: 'Free-roam 3D exploration with smooth WASD strafe, 360° mouse look, jump & sprint',
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
                if (e.code === 'Space') {
                    e.preventDefault();
                    handleTitleSelect('portfolio');
                    return;
                }
                if (e.key === 'Enter') {
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

            // Press 'V' to cycle views (First-person / tour / orbit camera toggle)
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
                    if (cameraMode === 'tour') {
                        setCameraMode('dolly_out');
                    } else {
                        setCameraMode('orbit');
                    }
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

    // First-Person Camera View Toggle (V key or button)
    const handleCycleCameraView = () => {
        audio.playClick();
        if (cameraMode === 'orbit') {
            setCameraMode('walk');
            setDiscoveryHint('First-Person Roam: WASD to walk & strafe, drag mouse to look 360°, Shift to sprint, Space to hop.');
            setTimeout(() => setDiscoveryHint(null), 5500);
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
    // Enter portfolio directly without disturbing the character's routine
    const handleSelectSetup = useCallback(() => {
        audio.playClick();
        handleJackIn();
    }, [handleJackIn]);

    const handleRoutineChange = useCallback((routine: CharacterRoutine) => {
        setCurrentRoutine(routine);
    }, []);

    // Title menu selection dispatcher
    const handleTitleSelect = (option: 'portfolio' | 'explore' | 'walk' | 'tour') => {
        audio.playClick();
        setShowTitleMenu(false);

        if (option === 'portfolio') {
            setCameraMode('dolly_in');
        } else if (option === 'tour') {
            setForcedTourIndex(0);
            setCameraMode('tour');
        } else if (option === 'walk') {
            setCameraMode('walk');
            setDiscoveryHint('First-Person Roam: WASD to walk & strafe, drag mouse to look 360°, Shift to sprint, Space to enter portfolio.');
            setTimeout(() => setDiscoveryHint(null), 5500);
        } else {
            // 'explore'
            setCameraMode('orbit');
            setDiscoveryHint('Click the battlestation monitors or press [Space] anytime to open portfolio.');
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
        setShowTitleMenu(true);
    };

    const handleTourPoiChange = useCallback((name: string, index: number) => {
        setCurrentTourName(name);
        setCurrentTourIndex(index - 1);
        setTourProgress(0);
    }, []);

    const handleTourComplete = useCallback(() => {
        audio.playClick();
        setCameraMode('dolly_out');
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
            {!showTitleMenu && (
            <header className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 pointer-events-auto flex items-center gap-1.5 sm:gap-2.5">
                {!showHologram && (
                    <>
                        {/* Camera View Cycle Button */}
                        <button
                            onClick={handleCycleCameraView}
                            onMouseEnter={() => audio.playHover()}
                            className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-black/40 border border-zinc-100 shadow-[0_0_25px_rgba(255,255,255,0.15)] hover:bg-white/10 text-zinc-200 hover:text-white text-[11px] sm:text-xs font-mono tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-all backdrop-blur-md cursor-pointer"
                            title="Cycle Camera View (Press V)"
                        >
                            <Eye className="w-3.5 h-3.5 text-zinc-300 flex-shrink-0" />
                            <span className="hidden sm:inline text-zinc-400">View [V]:</span>
                            <span className="text-white font-bold">
                                {cameraMode === 'walk' ? 'Roam' : cameraMode === 'tour' ? 'Tour' : 'Room'}
                            </span>
                        </button>

                        {/* Menu Reopen Button */}
                        <button
                            onClick={() => {
                                audio.playClick();
                                setShowTitleMenu(true);
                            }}
                            onMouseEnter={() => audio.playHover()}
                            className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-black/40 border border-zinc-100 shadow-[0_0_25px_rgba(255,255,255,0.15)] hover:bg-white/10 text-zinc-200 hover:text-white text-[11px] sm:text-xs font-mono tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-all backdrop-blur-md cursor-pointer"
                            title="Open Experience Selection Menu"
                        >
                            <Compass className="w-3.5 h-3.5 text-zinc-300 flex-shrink-0" />
                            <span className="font-bold">Menu</span>
                        </button>
                    </>
                )}

                {/* Audio Toggle */}
                <button
                    onClick={handleToggleSound}
                    onMouseEnter={() => audio.playHover()}
                    className="flex items-center justify-center p-2 sm:p-2.5 rounded-lg bg-black/40 border border-zinc-100 shadow-[0_0_25px_rgba(255,255,255,0.15)] hover:bg-white/10 text-zinc-300 hover:text-white transition-all backdrop-blur-md cursor-pointer"
                    title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                    aria-label="Toggle Audio"
                >
                    {isMuted ? (
                        <VolumeX className="w-4 h-4 text-zinc-400" />
                    ) : (
                        <Volume2 className="w-4 h-4 text-zinc-100" />
                    )}
                </button>
            </header>
            )}

            {/* 3. FIRST-PERSON FREE ROAM HUD — desktop only, joystick handles mobile */}
            <AnimatePresence>
                {cameraMode === 'walk' && !showHologram && !showTitleMenu && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.25 }}
                        className="hidden sm:flex absolute bottom-6 left-6 z-20 pointer-events-auto flex-col items-start gap-2 select-none"
                    >
                        <div className="flex flex-col gap-2.5 p-3.5 rounded-lg bg-black/40 border border-zinc-100 shadow-[0_0_25px_rgba(255,255,255,0.15)] backdrop-blur-md font-mono text-zinc-100 min-w-[220px]">
                            <div className="flex items-center justify-between gap-4 pb-1.5 border-b border-zinc-800">
                                <span className="text-xs font-bold tracking-[0.2em] uppercase text-white font-mono">
                                    FIRST-PERSON ROAM
                                </span>
                                <button
                                    onClick={() => setCameraMode('orbit')}
                                    className="px-2 py-0.5 rounded border border-zinc-600 hover:border-zinc-100 bg-white/5 hover:bg-white/15 text-[10px] text-zinc-300 hover:text-white transition-all cursor-pointer uppercase tracking-wider font-mono"
                                >
                                    [ESC] Exit
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] text-zinc-300 font-mono">
                                <span className="flex items-center gap-1.5">
                                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-900/90 border border-zinc-700 text-[10px] text-zinc-200 font-mono shadow-sm">
                                        WASD
                                    </kbd>
                                    <span>Move/Strafe</span>
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-900/90 border border-zinc-700 text-[10px] text-zinc-200 font-mono shadow-sm">
                                        DRAG
                                    </kbd>
                                    <span>360° Look</span>
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-900/90 border border-zinc-700 text-[10px] text-zinc-200 font-mono shadow-sm">
                                        SHIFT
                                    </kbd>
                                    <span>Sprint</span>
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-900/90 border border-zinc-700 text-[10px] text-zinc-200 font-mono shadow-sm">
                                        SPACE
                                    </kbd>
                                    <span>Enter Portfolio</span>
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 3b. MOBILE VIRTUAL JOYSTICK FOR FIRST-PERSON ROAM */}
            <AnimatePresence>
                {cameraMode === 'walk' && !showHologram && !showTitleMenu && (
                    <MobileWalkControls
                        onMove={(fwd, right, isToggling) => {
                            // Dispatch to global walk keys via custom event
                            window.dispatchEvent(new CustomEvent('mobilewalk', { detail: { fwd, right, isToggling } }));
                        }}
                        onExit={() => setCameraMode('orbit')}
                        onEnterPortfolio={() => handleJackIn()}
                    />
                )}
            </AnimatePresence>

            {/* 4. CINEMATIC TOUR HUD */}
            <AnimatePresence>
                {cameraMode === 'tour' && !showHologram && !showTitleMenu && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.25 }}
                        className="absolute bottom-4 sm:bottom-6 inset-x-0 z-20 pointer-events-none flex justify-center px-3 sm:px-4 select-none"
                    >
                        <div className="pointer-events-auto w-full max-w-[360px] p-2.5 sm:p-3 rounded-xl bg-black/75 border border-zinc-100/50 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-lg flex flex-col gap-2 font-mono text-zinc-100">
                            <div className="flex items-center justify-between text-xs tracking-wider">
                                <span className="font-bold tracking-[0.12em] sm:tracking-[0.18em] text-white uppercase text-[10px] sm:text-xs truncate pr-2">
                                    {currentTourName}
                                </span>
                                <span className="text-zinc-300 font-bold text-[10px] sm:text-[11px] flex-shrink-0">
                                    [ {currentTourIndex + 1}/{TOUR_STOPS.length} ]
                                </span>
                            </div>

                            {/* Sleek white progress bar */}
                            <div className="w-full h-1 rounded-full bg-white/20 overflow-hidden">
                                <div
                                    className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)] transition-all duration-100 ease-linear rounded-full"
                                    style={{ width: `${Math.round(tourProgress * 100)}%` }}
                                />
                            </div>

                            {/* Tour Controls */}
                            <div className="flex items-center justify-between pt-0.5 text-[11px] text-zinc-400">
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <button
                                        onClick={handlePrevTourAngle}
                                        className="p-1 sm:px-2 sm:py-0.5 rounded border border-zinc-600 hover:border-zinc-200 bg-white/5 hover:bg-white/15 text-zinc-200 hover:text-white transition-all cursor-pointer flex items-center justify-center"
                                        title="Previous Angle"
                                        aria-label="Previous Stop"
                                    >
                                        <ChevronLeft className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={handleNextTourAngle}
                                        className="p-1 sm:px-2 sm:py-0.5 rounded border border-zinc-600 hover:border-zinc-200 bg-white/5 hover:bg-white/15 text-zinc-200 hover:text-white transition-all cursor-pointer flex items-center justify-center"
                                        title="Next Angle"
                                        aria-label="Next Stop"
                                    >
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="text-[10px] text-zinc-400 tracking-wider ml-1">Auto: 5s</span>
                                </div>

                                <button
                                    onClick={() => {
                                        setCameraMode('dolly_out');
                                    }}
                                    className="px-2.5 py-1 sm:py-0.5 rounded border border-zinc-600 hover:border-zinc-200 bg-white/5 hover:bg-white/15 text-zinc-200 hover:text-white transition-all text-[10px] tracking-wider uppercase cursor-pointer flex items-center gap-1"
                                >
                                    <span className="hidden sm:inline">[ESC]</span>
                                    <span>Exit</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* 5. DISCOVERY FLOATING TOAST */}
            <AnimatePresence>
                {discoveryHint && !showHologram && !showTitleMenu && cameraMode === 'orbit' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.25 }}
                        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-zinc-950/90 border border-amber-500/40 shadow-2xl backdrop-blur-md text-[11px] sm:text-xs font-mono text-zinc-200 max-w-[90vw] sm:max-w-sm"
                    >
                        <div className="p-1 rounded bg-amber-500/20 text-amber-300 flex-shrink-0">
                            <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        <span className="line-clamp-2 sm:line-clamp-none">{discoveryHint}</span>
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

            {/* 6. FULL MODERN MENU (WITH CINEMATIC ZOOMOUT ENTRANCE ANIMATION) */}
            <AnimatePresence>
                {showTitleMenu && !showHologram && (
                    <motion.div
                        initial={{ opacity: 0, scale: 1.08 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
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

                            {/* Keyboard controls helper for desktop / Touch hint for mobile */}
                            <div className="hidden sm:flex items-center gap-5 text-[11px] font-mono text-zinc-400 drop-shadow">
                                <span className="flex items-center gap-1.5">
                                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-900/90 border border-zinc-700 text-[10px] text-zinc-200 font-mono shadow-sm">
                                        ESC
                                    </kbd>
                                    Quit
                                </span>
                                <span className="text-zinc-600">•</span>
                                <span className="flex items-center gap-1.5">
                                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-900/90 border border-zinc-700 text-[10px] text-zinc-200 font-mono shadow-sm">
                                        SPACE
                                    </kbd>
                                    Enter Portfolio
                                </span>
                                <span className="text-zinc-600">•</span>
                                <span className="flex items-center gap-1.5">
                                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-900/90 border border-zinc-700 text-[10px] text-zinc-200 font-mono shadow-sm">
                                        ENTER
                                    </kbd>
                                    Select
                                </span>
                                <span className="text-zinc-600">•</span>
                                <span className="flex items-center gap-1.5">
                                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-900/90 border border-zinc-700 text-[10px] text-zinc-200 font-mono shadow-sm">
                                        ↑ / ↓
                                    </kbd>
                                    Navigate
                                </span>
                            </div>

                            {/* Mobile Touch Helper */}
                            <div className="sm:hidden flex items-center gap-2 text-xs font-mono text-zinc-300 drop-shadow py-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                <span>Tap any option to enter • Drag to view room</span>
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

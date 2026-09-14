'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Volume2, VolumeX, Sparkles, Heart, Coffee, Shield, Zap, ArrowRight, Eye } from 'lucide-react';
import { audio } from '@/lib/audio';

interface CyberRoomProps {
    onJackIn: () => void;
}

export default function CyberRoom({ onJackIn }: CyberRoomProps) {
    const [catPurring, setCatPurring] = useState(false);
    const [coffeeSipped, setCoffeeSipped] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [hoveringMonitor, setHoveringMonitor] = useState(false);
    const canvasSteamRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        setIsMuted(audio.getMuted());

        // Keyboard shortcut: Enter or Space to Jack In
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.code === 'Space') {
                if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    onJackIn();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onJackIn]);

    // Animated rising coffee steam particles
    useEffect(() => {
        const canvas = canvasSteamRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animId: number;
        const particles: { x: number; y: number; vx: number; vy: number; alpha: number; size: number }[] = [];

        for (let i = 0; i < 24; i++) {
            particles.push({
                x: 15 + Math.random() * 10,
                y: 50 + Math.random() * 20,
                vx: (Math.random() - 0.5) * 0.4,
                vy: -Math.random() * 0.7 - 0.4,
                alpha: Math.random() * 0.6 + 0.2,
                size: Math.random() * 4 + 2,
            });
        }

        const renderSteam = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= 0.007;

                if (p.alpha <= 0 || p.y < 0) {
                    p.x = 15 + Math.random() * 10;
                    p.y = 60;
                    p.alpha = Math.random() * 0.6 + 0.2;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 245, 212, ${p.alpha * 0.5})`;
                ctx.fill();
            });

            animId = requestAnimationFrame(renderSteam);
        };

        renderSteam();
        return () => cancelAnimationFrame(animId);
    }, []);

    const handleCatClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        audio.playPurr();
        setCatPurring(true);
        setTimeout(() => setCatPurring(false), 3000);
    };

    const handleCoffeeClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        audio.playClick();
        setCoffeeSipped(true);
        setTimeout(() => setCoffeeSipped(false), 2000);
    };

    const handleSoundToggle = () => {
        const muted = audio.toggleMute();
        setIsMuted(muted);
    };

    return (
        <section className="relative w-full h-screen overflow-hidden select-none bg-space-950 flex items-center justify-center">
            {/* Cinematic Cyberpunk Room Background with Breathing Motion */}
            <motion.div
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 3, ease: 'easeOut' }}
                className="absolute inset-0 w-full h-full"
            >
                <img
                    src="/images/cyberpunk_room.jpg"
                    alt="Aditya Ray Cyberpunk Developer Battlestation"
                    className="w-full h-full object-cover object-center filter brightness-95"
                />

                {/* Cyber Room Ambient Atmospheric Glows */}
                <div className="absolute inset-0 bg-gradient-to-t from-space-950/80 via-transparent to-space-950/40 pointer-events-none" />
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55%] h-[45%] bg-brand-cyan/15 blur-[100px] pointer-events-none animate-pulse" />
            </motion.div>

            {/* Flying Cyber Traffic Particles outside Window */}
            <div className="absolute top-[18%] left-[30%] w-[38%] h-[26%] overflow-hidden pointer-events-none z-10">
                {/* Rain effect */}
                <div className="absolute inset-0 bg-cyber-grid opacity-30 animate-pulse" />
                {/* Moving light streak 1 */}
                <motion.div
                    animate={{ x: [-150, 450], y: [10, -20] }}
                    transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
                    className="absolute top-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-[1px] shadow-[0_0_10px_#00f5d4]"
                />
                {/* Moving light streak 2 */}
                <motion.div
                    animate={{ x: [450, -150], y: [40, 20] }}
                    transition={{ repeat: Infinity, duration: 8.5, delay: 2, ease: 'linear' }}
                    className="absolute top-1/3 w-20 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent blur-[1px] shadow-[0_0_10px_#9d4edd]"
                />
            </div>

            {/* INTERACTIVE HOTSPOTS IN THE ROOM */}

            {/* 1. Holographic Cyber-Cat Hotspot (On Top of PC Tower, Right Side) */}
            <div
                onClick={handleCatClick}
                className="absolute top-[32%] right-[16%] sm:right-[18%] z-20 cursor-pointer group"
                title="Pet Holographic Cyber-Cat"
            >
                <div className="relative w-24 sm:w-32 h-20 sm:h-24 rounded-full flex items-center justify-center">
                    {/* Glowing pulse ring */}
                    <div className="absolute inset-0 rounded-full bg-brand-cyan/20 blur-md group-hover:bg-brand-cyan/40 transition-all animate-pulse" />

                    {/* Purring Speech Bubble */}
                    {catPurring && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                            animate={{ opacity: 1, y: -20, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-space-900/90 border border-brand-cyan text-brand-cyan font-mono text-[11px] whitespace-nowrap shadow-[0_0_15px_rgba(0,245,212,0.6)] flex items-center gap-1.5"
                        >
                            <Heart className="w-3.5 h-3.5 text-brand-pink fill-brand-pink" />
                            <span>*purrs in 60 FPS*</span>
                        </motion.div>
                    )}

                    {/* Hover Hint */}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-brand-cyan bg-space-950/80 px-2 py-0.5 rounded border border-brand-cyan/30 whitespace-nowrap">
                        Pet Cyber-Cat
                    </span>
                </div>
            </div>

            {/* 2. Steaming Coffee / Ramen Hotspot (Desk Right) */}
            <div
                onClick={handleCoffeeClick}
                className="absolute bottom-[20%] right-[22%] sm:right-[24%] z-20 cursor-pointer group"
                title="Take a sip of Neon Espresso"
            >
                <div className="relative w-16 h-20 flex items-center justify-center">
                    {/* Canvas Steam */}
                    <canvas
                        ref={canvasSteamRef}
                        width={40}
                        height={70}
                        className="absolute -top-12 left-1/2 -translate-x-1/2 pointer-events-none"
                    />

                    {coffeeSipped && (
                        <motion.div
                            initial={{ opacity: 0, y: 0 }}
                            animate={{ opacity: 1, y: -24 }}
                            className="absolute -top-6 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-space-950 border border-amber-400 text-amber-300 font-mono text-[10px] whitespace-nowrap shadow-lg"
                        >
                            +50% Hacking Speed ☕
                        </motion.div>
                    )}

                    <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-mono text-zinc-300 bg-space-950/80 px-1.5 py-0.5 rounded border border-white/10 whitespace-nowrap">
                        Drink Espresso
                    </span>
                </div>
            </div>

            {/* 3. PRIMARY MONITOR: TARGET HOTSPOT TO JACK IN (Center of Room) */}
            <motion.div
                onClick={onJackIn}
                onMouseEnter={() => {
                    setHoveringMonitor(true);
                    audio.playHover();
                }}
                onMouseLeave={() => setHoveringMonitor(false)}
                className="absolute top-[44%] left-[49%] -translate-x-1/2 -translate-y-1/2 w-[34%] h-[27%] z-30 cursor-pointer group flex items-center justify-center"
            >
                {/* Border reticle animation */}
                <div
                    className={`absolute inset-0 rounded-xl border-2 transition-all duration-300 ${
                        hoveringMonitor
                            ? 'border-brand-cyan shadow-[0_0_40px_rgba(0,245,212,0.8)] bg-brand-cyan/15 scale-105'
                            : 'border-brand-cyan/40 shadow-[0_0_20px_rgba(0,245,212,0.3)] bg-transparent'
                    }`}
                >
                    {/* Reticle Corner Brackets */}
                    <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-brand-cyan" />
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-brand-cyan" />
                    <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-brand-cyan" />
                    <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-brand-cyan" />
                </div>

                {/* Center Holographic Target Badge */}
                <motion.div
                    animate={{ scale: hoveringMonitor ? [1, 1.08, 1] : 1 }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-space-950/90 border border-brand-cyan/60 backdrop-blur-md shadow-[0_0_30px_rgba(0,245,212,0.5)] text-center pointer-events-none"
                >
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-brand-cyan">
                        <Terminal className="w-4 h-4 text-brand-cyan animate-pulse" />
                        <span>RayOS LINUX TERMINAL</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-300">
                        <span className="w-2 h-2 rounded-full bg-brand-cyan animate-ping" />
                        <span>CLICK TO JACK IN</span>
                    </div>
                    <span className="hidden sm:inline text-[9px] font-mono text-brand-cyan/80 bg-brand-cyan/10 px-2 py-0.5 rounded border border-brand-cyan/20">
                        OR PRESS [ENTER]
                    </span>
                </motion.div>
            </motion.div>

            {/* TOP FLOATING OVERLAY: ADITYA RAY IDENTITY */}
            <div className="absolute top-6 left-6 z-40 flex items-center gap-3">
                <div className="flex items-center gap-3 p-2.5 px-4 rounded-2xl bg-space-950/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-cyan to-brand-purple p-0.5 shadow-[0_0_15px_rgba(0,245,212,0.4)]">
                        <div className="w-full h-full rounded-xl bg-space-950 flex items-center justify-center font-mono font-bold text-sm text-brand-cyan">
                            AR
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white tracking-wide">Aditya Ray</span>
                            <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
                        </div>
                        <div className="text-[11px] font-mono text-zinc-400">Cyber Room • Dev Station #01</div>
                    </div>
                </div>
            </div>

            {/* TOP RIGHT: SOUND TOGGLE */}
            <div className="absolute top-6 right-6 z-40 flex items-center gap-2">
                <button
                    onClick={handleSoundToggle}
                    className={`p-2.5 rounded-2xl border backdrop-blur-xl transition-all flex items-center gap-2 text-xs font-mono ${
                        !isMuted
                            ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan shadow-[0_0_20px_rgba(0,245,212,0.4)]'
                            : 'bg-space-950/80 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                    title={isMuted ? 'Turn Sound On' : 'Mute Sound'}
                >
                    {!isMuted ? <Volume2 className="w-4 h-4 text-brand-cyan" /> : <VolumeX className="w-4 h-4" />}
                    <span className="hidden sm:inline text-[11px]">{!isMuted ? 'AUDIO ACTIVE' : 'MUTED'}</span>
                </button>
            </div>

            {/* BOTTOM FLOATING NARRATIVE HUD */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute bottom-6 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40 max-w-xl w-full"
            >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-space-950/85 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">
                            <Zap className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                                <span>CYBERPUNK DEV WORKSTATION</span>
                                <span className="px-2 py-0.5 rounded-full text-[9px] bg-brand-purple/20 text-brand-purple border border-brand-purple/30">
                                    LIVE FEED
                                </span>
                            </div>
                            <div className="text-[11px] text-zinc-400 mt-0.5">
                                Explore room artifacts or jack directly into the Linux mainframe.
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onJackIn}
                        onMouseEnter={() => audio.playHover()}
                        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple text-space-950 font-bold font-mono text-xs shadow-[0_0_25px_rgba(0,245,212,0.5)] hover:shadow-[0_0_40px_rgba(0,245,212,0.8)] hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shrink-0 group"
                    >
                        <span>JACK IN TO SCREEN</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </motion.div>
        </section>
    );
}

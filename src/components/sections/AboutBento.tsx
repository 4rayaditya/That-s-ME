'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Globe, Clock, ShieldCheck, Cpu, Code2, Sparkles, Flame } from 'lucide-react';
import TiltCard from '@/components/ui/TiltCard';
import TerminalCard from '@/components/ui/TerminalCard';
import { PERSONAL_INFO } from '@/data/portfolioData';
import { audio } from '@/lib/audio';

const TECH_BADGES = [
    'Next.js 14', 'Three.js', 'WebGL 2.0', 'TypeScript', 'GLSL Shaders',
    'GSAP', 'React Three Fiber', 'PostgreSQL', 'Redis', 'Docker', 'WebSockets', 'WebXR'
];

export default function AboutBento() {
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(
                now.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                })
            );
        };
        updateTime();
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section id="about" className="relative py-24 px-4 sm:px-6 max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-semibold bg-brand-purple/15 text-brand-purple border border-brand-purple/30 mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>SYSTEM ARCHITECTURE & IDENTITY</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                    Beyond The <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-purple">Interface</span>
                </h2>
                <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
                    A synthesis of creative artistry, hardware-accelerated shaders, and mission-critical cloud infrastructure.
                </p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* 1. Identity & Core Bio (Span 2 cols on md/lg) */}
                <div className="md:col-span-2 lg:col-span-2 h-full">
                    <TiltCard className="bg-space-900/80 border border-white/10 p-6 sm:p-8 flex flex-col justify-between h-full shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                        <div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-cyan to-brand-purple p-0.5 shadow-[0_0_20px_rgba(0,245,212,0.3)]">
                                        <div className="w-full h-full rounded-2xl bg-space-950 flex items-center justify-center font-mono font-bold text-lg text-brand-cyan">
                                            AR
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white leading-tight">
                                            {PERSONAL_INFO.name}
                                        </h3>
                                        <span className="text-xs font-mono text-brand-cyan">
                                            {PERSONAL_INFO.handle}
                                        </span>
                                    </div>
                                </div>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Online
                                </span>
                            </div>

                            <p className="mt-6 text-sm text-zinc-300 leading-relaxed">
                                I am a creative engineer specializing in real-time interactive 3D graphics, high-throughput full-stack architectures, and immersive web experiences. I bridge the gap between complex GPU mathematics and delightful user interfaces.
                            </p>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                    <div className="text-[10px] font-mono text-zinc-400">FOCUS AREA</div>
                                    <div className="text-xs font-semibold text-white mt-0.5">3D WebGL & Systems</div>
                                </div>
                                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                    <div className="text-[10px] font-mono text-zinc-400">DISCIPLINE</div>
                                    <div className="text-xs font-semibold text-white mt-0.5">Full-Stack Creative</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
                            <span className="flex items-center gap-1.5">
                                <Globe className="w-3.5 h-3.5 text-brand-blue" />
                                Available Globally (Remote)
                            </span>
                            <span className="font-mono text-brand-cyan">Lighthouse 99/100</span>
                        </div>
                    </TiltCard>
                </div>

                {/* 2. Live Interactive Terminal Emulator (Span 2 cols) */}
                <div className="md:col-span-1 lg:col-span-2 h-full min-h-[320px]">
                    <TerminalCard />
                </div>

                {/* 3. Engineering Tenets / Principles (Span 2 cols on lg) */}
                <div className="md:col-span-2 lg:col-span-2 h-full">
                    <TiltCard className="bg-space-900/80 border border-white/10 p-6 flex flex-col justify-between h-full">
                        <div>
                            <div className="flex items-center gap-2 text-xs font-mono text-brand-cyan mb-4">
                                <Cpu className="w-4 h-4" />
                                <span>ENGINEERING PHILOSOPHY</span>
                            </div>
                            <div className="space-y-4">
                                {PERSONAL_INFO.principles.map((p, idx) => (
                                    <div key={idx} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-brand-cyan/20 transition-all">
                                        <div className="text-xs font-semibold text-white flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" />
                                            {p.title}
                                        </div>
                                        <p className="text-xs text-zinc-400 mt-1 leading-relaxed pl-3.5">
                                            {p.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TiltCard>
                </div>

                {/* 4. Tech Stack Orbit Radar (Span 1 col) */}
                <div className="md:col-span-1 lg:col-span-1 h-full">
                    <TiltCard className="bg-space-900/80 border border-white/10 p-5 flex flex-col justify-between h-full">
                        <div>
                            <div className="flex items-center gap-2 text-xs font-mono text-brand-purple mb-3">
                                <Code2 className="w-4 h-4" />
                                <span>CORE STACK</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {TECH_BADGES.map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-white/[0.04] hover:bg-brand-cyan/20 border border-white/5 hover:border-brand-cyan/40 text-zinc-300 hover:text-brand-cyan transition-all cursor-default"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/5 text-[10px] font-mono text-zinc-400 text-center">
                            Continuous integration & deployment
                        </div>
                    </TiltCard>
                </div>

                {/* 5. Live Telemetry / Timezone Clock (Span 1 col) */}
                <div className="md:col-span-1 lg:col-span-1 h-full">
                    <TiltCard className="bg-space-900/80 border border-white/10 p-5 flex flex-col justify-between h-full">
                        <div>
                            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-3">
                                <Clock className="w-4 h-4" />
                                <span>TELEMETRY CLOCK</span>
                            </div>
                            <div className="text-center py-4">
                                <div className="text-2xl font-bold font-mono text-white tracking-wider">
                                    {currentTime || '12:00:00 PM'}
                                </div>
                                <div className="text-[10px] font-mono text-zinc-400 mt-1">
                                    UTC+5:30 (IST) / Global Sync
                                </div>
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                            <span className="text-[11px] font-mono text-emerald-300 flex items-center justify-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                All Systems Nominal
                            </span>
                        </div>
                    </TiltCard>
                </div>
            </div>
        </section>
    );
}

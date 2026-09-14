'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles, Terminal, FileText, ChevronRight, Send, Compass } from 'lucide-react';
import { PERSONAL_INFO } from '@/data/portfolioData';
import { audio } from '@/lib/audio';
import HeroCanvas from '@/components/3d/HeroCanvas';

const ROLES = [
    'Creative Technologist',
    'Senior Full-Stack 3D Engineer',
    'WebGL & Custom Shader Specialist',
    'Spatial UI & WebXR Architect',
];

export default function HeroSection() {
    const [roleIndex, setRoleIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setRoleIndex((prev) => (prev + 1) % ROLES.length);
        }, 3200);
        return () => clearInterval(interval);
    }, []);

    const handleScrollTo = (id: string) => {
        audio.playClick();
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section
            id="hero"
            className="relative min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 pt-28 pb-16 overflow-hidden"
        >
            {/* 3D Interactive Canvas Background */}
            <HeroCanvas />

            {/* Ambient background glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-cyan/10 blur-[140px] pointer-events-none -z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-brand-purple/10 blur-[130px] pointer-events-none -z-10" />

            {/* Main Content */}
            <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
                {/* Status Pill */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl mb-6 shadow-[0_0_20px_rgba(0,245,212,0.1)]"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan" />
                    </span>
                    <span className="text-xs font-mono font-medium text-zinc-300">
                        {PERSONAL_INFO.status}
                    </span>
                </motion.div>

                {/* Main Heading / Name */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                >
                    <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white font-sans">
                        Aditya <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple">Ray</span>
                    </h1>
                </motion.div>

                {/* Animated Role Cycler */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="h-10 sm:h-12 mt-3 flex items-center justify-center"
                >
                    <span className="text-lg sm:text-2xl md:text-3xl font-mono text-zinc-300 font-semibold flex items-center gap-2">
                        <span className="text-brand-cyan font-bold">&gt;</span>
                        <motion.span
                            key={roleIndex}
                            initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
                            transition={{ duration: 0.4 }}
                            className="text-white"
                        >
                            {ROLES[roleIndex]}
                        </motion.span>
                    </span>
                </motion.div>

                {/* Bio / Value Prop */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="mt-6 text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl leading-relaxed"
                >
                    {PERSONAL_INFO.bio}
                </motion.p>

                {/* Call to Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="mt-8 flex flex-wrap items-center justify-center gap-4"
                >
                    <button
                        onClick={() => handleScrollTo('projects')}
                        onMouseEnter={() => audio.playHover()}
                        className="group px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-space-950 font-bold text-sm shadow-[0_0_25px_rgba(0,245,212,0.4)] hover:shadow-[0_0_40px_rgba(0,245,212,0.7)] hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-2"
                    >
                        <Compass className="w-4 h-4 transition-transform group-hover:rotate-45" />
                        <span>Explore Flagship Works</span>
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>

                    <button
                        onClick={() => handleScrollTo('about')}
                        onMouseEnter={() => audio.playHover()}
                        className="px-6 py-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/25 text-white font-medium text-sm hover:bg-white/[0.08] active:scale-[0.98] transition-all flex items-center gap-2"
                    >
                        <Terminal className="w-4 h-4 text-brand-cyan" />
                        <span>Open Interactive Bio</span>
                    </button>
                </motion.div>

                {/* Quick Stats Strip */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    className="mt-14 w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4 rounded-2xl bg-space-950/60 border border-white/10 backdrop-blur-xl"
                >
                    {PERSONAL_INFO.stats.map((stat, idx) => (
                        <div key={idx} className="flex flex-col items-center py-2 px-3 border-r last:border-r-0 border-white/5">
                            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
                                {stat.value}
                            </span>
                            <span className="text-xs text-zinc-400 mt-0.5 font-medium">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Scroll Down Indicator */}
            <motion.button
                onClick={() => handleScrollTo('about')}
                onMouseEnter={() => audio.playHover()}
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-zinc-400 hover:text-brand-cyan transition-colors"
                aria-label="Scroll to About Section"
            >
                <span className="text-[10px] font-mono tracking-widest uppercase">Scroll</span>
                <ArrowDown className="w-4 h-4" />
            </motion.button>
        </section>
    );
}

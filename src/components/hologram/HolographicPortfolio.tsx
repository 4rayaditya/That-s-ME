'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Terminal,
    Cpu,
    Briefcase,
    Mail,
    ExternalLink,
    ChevronRight,
    ArrowLeft,
    Volume2,
    VolumeX,
    Sparkles,
    Radio,
    Code2,
    Layers,
    Send,
    CheckCircle2,
} from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';
import { PERSONAL_INFO, PROJECTS, SKILL_CATEGORIES, Project } from '@/data/portfolioData';
import { audio } from '@/lib/audio';

interface HolographicPortfolioProps {
    onReturnToRoom: () => void;
}

type TabType = 'about' | 'projects' | 'skills' | 'terminal';

export default function HolographicPortfolio({ onReturnToRoom }: HolographicPortfolioProps) {
    const [activeTab, setActiveTab] = useState<TabType>('about');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [terminalInput, setTerminalInput] = useState('');
    const [terminalHistory, setTerminalHistory] = useState<Array<{ type: 'in' | 'out'; text: string }>>([
        { type: 'out', text: '>>> NEURAL UPLINK SYNCHRONIZED.' },
        { type: 'out', text: '>>> RayOS v4.2 // Aditya Ray Battlestation Terminal.' },
        { type: 'out', text: '>>> Type "help" to display available neural commands.' },
    ]);
    const [contactSent, setContactSent] = useState(false);
    const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

    useEffect(() => {
        setIsMuted(audio.getMuted());

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                audio.playClick();
                onReturnToRoom();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onReturnToRoom]);

    const handleTabChange = (tab: TabType) => {
        audio.playClick();
        setActiveTab(tab);
        setSelectedProject(null);
    };

    const handleSoundToggle = () => {
        const muted = audio.toggleMute();
        setIsMuted(muted);
    };

    const handleTerminalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cmd = terminalInput.trim().toLowerCase();
        if (!cmd) return;

        audio.playClick();
        const newHist = [...terminalHistory, { type: 'in' as const, text: `$ ${terminalInput}` }];

        if (cmd === 'help') {
            newHist.push({
                type: 'out',
                text: 'Commands: about, projects, skills, contact, clear, lofi, coffee, exit',
            });
        } else if (cmd === 'about') {
            newHist.push({ type: 'out', text: `Aditya Ray: ${PERSONAL_INFO.bio}` });
        } else if (cmd === 'projects') {
            newHist.push({
                type: 'out',
                text: `Available Projects:\n${PROJECTS.map((p) => `• ${p.title} (${p.categoryLabel})`).join('\n')}`,
            });
        } else if (cmd === 'skills') {
            newHist.push({
                type: 'out',
                text: `Core Disciplines:\n${SKILL_CATEGORIES.map((c) => `[${c.title}]: ${c.skills.map((s) => s.name).join(', ')}`).join('\n')}`,
            });
        } else if (cmd === 'clear') {
            setTerminalHistory([]);
            setTerminalInput('');
            return;
        } else if (cmd === 'lofi') {
            audio.toggleLofi();
            newHist.push({ type: 'out', text: 'Lofi synthesizer soundscape toggled.' });
        } else if (cmd === 'coffee') {
            audio.playClick();
            newHist.push({ type: 'out', text: '☕ Brewing virtual espresso... +100% Focus restored!' });
        } else if (cmd === 'exit') {
            onReturnToRoom();
            return;
        } else {
            newHist.push({
                type: 'out',
                text: `Command not recognized: "${cmd}". Type "help" for a list of commands.`,
            });
        }

        setTerminalHistory(newHist);
        setTerminalInput('');
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!contactForm.email || !contactForm.message) return;
        audio.playSuccess();
        setContactSent(true);
        setTimeout(() => {
            setContactSent(false);
            setContactForm({ name: '', email: '', message: '' });
        }, 4000);
    };

    return (
        <div className="absolute inset-0 z-30 flex flex-col justify-between p-3 sm:p-6 md:p-8 bg-[#030712]/80 backdrop-blur-md overflow-hidden select-none">
            {/* HOLOGRAPHIC CRT SCANLINE & GRID BACKGROUND OVERLAY */}
            <div
                className="pointer-events-none absolute inset-0 z-0 opacity-20"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(0, 245, 212, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 245, 212, 0.15) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                }}
            />
            <div
                className="pointer-events-none absolute inset-0 z-0 opacity-15"
                style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4) 2px, transparent 2px, transparent 4px)',
                }}
            />

            {/* TOP HUD SYSTEM BAR */}
            <header className="relative z-10 flex items-center justify-between border-b border-cyan-500/30 pb-3 sm:pb-4 backdrop-blur-lg">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#00f5d4]" />
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs sm:text-sm font-bold text-cyan-400 tracking-wider">
                                RAY_OS // HOLOGRAPHIC INTERFACE
                            </span>
                            <span className="px-1.5 py-0.5 text-[9px] font-mono bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 rounded">
                                v4.2.0-STABLE
                            </span>
                        </div>
                        <p className="text-[10px] sm:text-xs font-mono text-zinc-400">
                            Aditya Ray • Creative Technologist & 3D WebGL Engineer
                        </p>
                    </div>
                </div>

                {/* Top Action Controls */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Audio Mute/Unmute */}
                    <button
                        onClick={handleSoundToggle}
                        onMouseEnter={() => audio.playHover()}
                        className="p-2 rounded-lg bg-zinc-900/80 border border-zinc-700/60 hover:border-cyan-400/80 text-zinc-300 hover:text-cyan-400 transition-all shadow-sm"
                        title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
                    >
                        {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                    </button>

                    {/* Return to Room / Unjack Button */}
                    <button
                        onClick={() => {
                            audio.playClick();
                            onReturnToRoom();
                        }}
                        onMouseEnter={() => audio.playHover()}
                        className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-zinc-900/90 border border-rose-500/50 hover:border-rose-400 text-rose-300 hover:text-rose-200 font-mono text-xs sm:text-sm transition-all shadow-[0_0_15px_rgba(244,63,94,0.2)] hover:shadow-[0_0_20px_rgba(244,63,94,0.5)] group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>RETURN TO ROOM</span>
                        <span className="hidden sm:inline text-[10px] opacity-60 ml-1">[ESC]</span>
                    </button>
                </div>
            </header>

            {/* TAB NAVIGATION SELECTOR */}
            <nav className="relative z-10 flex items-center justify-center gap-1 sm:gap-2 my-2 sm:my-4 overflow-x-auto py-1">
                {[
                    { id: 'about', label: 'DOSSIER // ABOUT', icon: Cpu },
                    { id: 'projects', label: 'PROJECTS // ARCHIVES', icon: Briefcase },
                    { id: 'skills', label: 'NEURAL MATRIX // SKILLS', icon: Layers },
                    { id: 'terminal', label: 'TERMINAL // UPLINK', icon: Terminal },
                ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id as TabType)}
                            onMouseEnter={() => audio.playHover()}
                            className={`flex items-center gap-2 px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg font-mono text-xs sm:text-sm transition-all whitespace-nowrap ${isActive
                                    ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(0,245,212,0.4)]'
                                    : 'bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600'
                                }`}
                        >
                            <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-cyan-400 animate-pulse' : ''}`} />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* MAIN HOLOGRAPHIC PROJECTION CONTENT AREA */}
            <main className="relative z-10 flex-1 overflow-y-auto custom-scrollbar px-1 sm:px-4 py-2">
                <AnimatePresence mode="wait">
                    {/* 1. DOSSIER // ABOUT ME */}
                    {activeTab === 'about' && (
                        <motion.div
                            key="about"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-5xl mx-auto space-y-6"
                        >
                            {/* Bio Bento Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Profile Card */}
                                <div className="md:col-span-2 p-5 sm:p-6 rounded-xl bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 border border-cyan-500/30 shadow-[0_0_30px_rgba(0,245,212,0.1)] relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Code2 className="w-32 h-32 text-cyan-400" />
                                    </div>
                                    <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">
                                        SUBJECT IDENTIFICATION // AR-99
                                    </span>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1 mb-2">
                                        Aditya Ray <span className="text-cyan-400">(@4rayaditya)</span>
                                    </h1>
                                    <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-4">
                                        {PERSONAL_INFO.bio}
                                    </p>
                                    <div className="flex flex-wrap gap-2 text-xs font-mono">
                                        <span className="px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300">
                                            Role: {PERSONAL_INFO.role}
                                        </span>
                                        <span className="px-2.5 py-1 rounded bg-purple-950/60 border border-purple-500/40 text-purple-300">
                                            Loc: {PERSONAL_INFO.location}
                                        </span>
                                        <span className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                                            Status: {PERSONAL_INFO.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Live Metrics Panel */}
                                <div className="p-5 sm:p-6 rounded-xl bg-zinc-900/90 border border-purple-500/30 shadow-[0_0_30px_rgba(157,78,221,0.1)] flex flex-col justify-between">
                                    <span className="text-[10px] font-mono text-purple-400 tracking-widest uppercase mb-3">
                                        TELEMETRY METRICS
                                    </span>
                                    <div className="grid grid-cols-2 gap-3">
                                        {PERSONAL_INFO.stats.map((stat, i) => (
                                            <div key={i} className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800">
                                                <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-300">
                                                    {stat.value}
                                                </div>
                                                <div className="text-[10px] font-mono text-zinc-400">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
                                        <span>Neural Sync:</span>
                                        <span className="text-cyan-400 font-bold">100% OPERATIONAL</span>
                                    </div>
                                </div>
                            </div>

                            {/* Core Engineering Principles */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {PERSONAL_INFO.principles.map((pr, idx) => (
                                    <div
                                        key={idx}
                                        className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-cyan-500/50 transition-all group"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
                                            <Sparkles className="w-4 h-4" />
                                        </div>
                                        <h3 className="text-sm font-bold text-zinc-100 font-mono mb-1">{pr.title}</h3>
                                        <p className="text-xs text-zinc-400 leading-relaxed">{pr.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* 2. PROJECTS // ARCHIVES */}
                    {activeTab === 'projects' && (
                        <motion.div
                            key="projects"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-5xl mx-auto"
                        >
                            {!selectedProject ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {PROJECTS.map((proj) => (
                                        <div
                                            key={proj.id}
                                            onClick={() => {
                                                audio.playClick();
                                                setSelectedProject(proj);
                                            }}
                                            onMouseEnter={() => audio.playHover()}
                                            className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-cyan-400/80 transition-all cursor-pointer group relative overflow-hidden shadow-lg hover:shadow-[0_0_25px_rgba(0,245,212,0.25)] flex flex-col justify-between"
                                        >
                                            {/* CRT Scanline hover shimmer */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300">
                                                        {proj.categoryLabel}
                                                    </span>
                                                    <span className="text-xs font-mono text-zinc-500">{proj.year}</span>
                                                </div>

                                                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors font-mono">
                                                    {proj.title}
                                                </h3>
                                                <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                                                    {proj.description}
                                                </p>
                                            </div>

                                            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex flex-wrap gap-1.5 items-center justify-between">
                                                <div className="flex flex-wrap gap-1">
                                                    {proj.tags.slice(0, 4).map((tag, t) => (
                                                        <span
                                                            key={t}
                                                            className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-950 text-zinc-400 border border-zinc-800"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                <span className="text-xs font-mono text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                    Inspect Spec <ChevronRight className="w-3.5 h-3.5" />
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                /* Detailed Project Spec View */
                                <div className="p-6 rounded-xl bg-zinc-900/90 border border-cyan-500/40 shadow-[0_0_35px_rgba(0,245,212,0.15)] space-y-5">
                                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                                        <button
                                            onClick={() => setSelectedProject(null)}
                                            onMouseEnter={() => audio.playHover()}
                                            className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-cyan-400 transition-colors"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            Back to Archive
                                        </button>
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={selectedProject.githubUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                onMouseEnter={() => audio.playHover()}
                                                className="flex items-center gap-1 px-3 py-1 rounded bg-zinc-950 border border-zinc-700 hover:border-cyan-400 text-xs font-mono text-zinc-300 hover:text-cyan-300 transition-colors"
                                            >
                                                <GithubIcon className="w-3.5 h-3.5" />
                                                GitHub
                                            </a>
                                            <a
                                                href={selectedProject.liveUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                onMouseEnter={() => audio.playHover()}
                                                className="flex items-center gap-1 px-3 py-1 rounded bg-cyan-950 border border-cyan-500/50 hover:border-cyan-400 text-xs font-mono text-cyan-300 transition-colors"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                                Live Uplink
                                            </a>
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-[10px] font-mono text-cyan-400 uppercase">
                                            {`${selectedProject.categoryLabel} // ${selectedProject.year}`}
                                        </span>
                                        <h2 className="text-2xl font-bold font-mono text-white mt-1">
                                            {selectedProject.title}
                                        </h2>
                                        <p className="text-sm text-cyan-300/90 font-mono mt-0.5">
                                            {selectedProject.subtitle}
                                        </p>
                                    </div>

                                    <p className="text-sm text-zinc-300 leading-relaxed">
                                        {selectedProject.longDescription}
                                    </p>

                                    {/* Metrics Grid */}
                                    <div className="grid grid-cols-3 gap-3">
                                        {selectedProject.metrics.map((m, idx) => (
                                            <div key={idx} className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800">
                                                <div className="text-lg font-bold font-mono text-cyan-400">{m.value}</div>
                                                <div className="text-[10px] font-mono text-zinc-400">{m.label}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Architecture Highlights */}
                                    <div>
                                        <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                                            System Architecture & Innovations
                                        </h4>
                                        <ul className="space-y-1.5">
                                            {selectedProject.architecture.map((arch, a) => (
                                                <li
                                                    key={a}
                                                    className="text-xs text-zinc-300 flex items-start gap-2 font-mono"
                                                >
                                                    <span className="text-cyan-400 mt-0.5">▹</span>
                                                    <span>{arch}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* 3. NEURAL MATRIX // SKILLS */}
                    {activeTab === 'skills' && (
                        <motion.div
                            key="skills"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-5xl mx-auto space-y-5"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                {SKILL_CATEGORIES.map((cat, cIdx) => (
                                    <div
                                        key={cIdx}
                                        className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800/90 shadow-md space-y-4"
                                    >
                                        <h3
                                            className="text-sm font-mono font-bold uppercase tracking-wider pb-2 border-b border-zinc-800 flex items-center justify-between"
                                            style={{ color: cat.color }}
                                        >
                                            <span>{cat.title}</span>
                                            <span className="text-[10px] opacity-70">[{cat.skills.length} NODES]</span>
                                        </h3>

                                        <div className="space-y-3">
                                            {cat.skills.map((sk, sIdx) => (
                                                <div key={sIdx} className="space-y-1">
                                                    <div className="flex items-center justify-between text-xs font-mono">
                                                        <span className="text-zinc-200">{sk.name}</span>
                                                        <span className="text-zinc-400 font-bold">{sk.level}%</span>
                                                    </div>
                                                    {/* Progress bar with glow */}
                                                    <div className="w-full h-1.5 rounded-full bg-zinc-950 overflow-hidden border border-zinc-800">
                                                        <div
                                                            className="h-full rounded-full transition-all duration-1000"
                                                            style={{
                                                                width: `${sk.level}%`,
                                                                backgroundColor: cat.color,
                                                                boxShadow: `0 0 8px ${cat.color}`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* 4. TERMINAL // UPLINK */}
                    {activeTab === 'terminal' && (
                        <motion.div
                            key="terminal"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5"
                        >
                            {/* Interactive Command Line Terminal */}
                            <div className="p-4 sm:p-5 rounded-xl bg-zinc-950/90 border border-cyan-500/40 shadow-[0_0_30px_rgba(0,245,212,0.15)] flex flex-col h-80 sm:h-96">
                                <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800 font-mono text-[11px] text-zinc-400">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                        <span className="ml-2 text-cyan-400">ray@battlestation:~$</span>
                                    </div>
                                    <span>BASH 5.2</span>
                                </div>

                                <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-xs space-y-1.5 text-zinc-300">
                                    {terminalHistory.map((line, i) => (
                                        <div
                                            key={i}
                                            className={line.type === 'in' ? 'text-cyan-400 font-bold' : 'text-zinc-300 whitespace-pre-line'}
                                        >
                                            {line.text}
                                        </div>
                                    ))}
                                </div>

                                <form onSubmit={handleTerminalSubmit} className="mt-3 flex items-center gap-2 pt-2 border-t border-zinc-800">
                                    <span className="font-mono text-cyan-400 text-sm">$</span>
                                    <input
                                        type="text"
                                        value={terminalInput}
                                        onChange={(e) => setTerminalInput(e.target.value)}
                                        placeholder="Type 'help' or command..."
                                        className="flex-1 bg-transparent font-mono text-xs text-white focus:outline-none placeholder:text-zinc-600"
                                    />
                                    <button
                                        type="submit"
                                        className="px-2.5 py-1 rounded bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-mono text-xs hover:bg-cyan-900 transition-colors"
                                    >
                                        Run
                                    </button>
                                </form>
                            </div>

                            {/* Direct Communication Uplink Form */}
                            <div className="p-4 sm:p-5 rounded-xl bg-zinc-900/80 border border-purple-500/40 shadow-[0_0_30px_rgba(157,78,221,0.15)] flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
                                        <h3 className="text-sm font-bold font-mono text-white">
                                            TRANSMISSION UPLINK // CONTACT
                                        </h3>
                                    </div>
                                    <p className="text-xs text-zinc-400 mb-4 font-mono">
                                        Direct priority transmission to Aditya Ray ({PERSONAL_INFO.email}).
                                    </p>

                                    {contactSent ? (
                                        <div className="p-6 rounded-lg bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-center font-mono text-xs space-y-2">
                                            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 animate-bounce" />
                                            <p className="font-bold">TRANSMISSION DELIVERED TO NEURAL CORE!</p>
                                            <p className="text-[10px] text-zinc-400">Aditya will respond to your uplink shortly.</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSendMessage} className="space-y-3">
                                            <div>
                                                <label className="block text-[10px] font-mono text-zinc-400 mb-1">IDENTIFIER // NAME</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={contactForm.name}
                                                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                                    placeholder="Alex Cyber"
                                                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-white focus:border-cyan-400 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-mono text-zinc-400 mb-1">RELAY COMMS // EMAIL</label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={contactForm.email}
                                                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                                    placeholder="alex@nexus.corp"
                                                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-white focus:border-cyan-400 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-mono text-zinc-400 mb-1">PAYLOAD // MESSAGE</label>
                                                <textarea
                                                    required
                                                    rows={3}
                                                    value={contactForm.message}
                                                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                                    placeholder="We are building an interactive 3D platform and want you to lead the WebGL architecture..."
                                                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-white focus:border-cyan-400 focus:outline-none resize-none"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                onMouseEnter={() => audio.playHover()}
                                                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-mono text-xs font-bold shadow-[0_0_20px_rgba(0,245,212,0.4)] hover:brightness-110 transition-all"
                                            >
                                                <Send className="w-3.5 h-3.5" />
                                                TRANSMIT PACKET
                                            </button>
                                        </form>
                                    )}
                                </div>

                                <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                                    <a
                                        href={PERSONAL_INFO.github}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="hover:text-cyan-300 transition-colors"
                                    >
                                        GitHub: @4rayaditya
                                    </a>
                                    <a
                                        href={PERSONAL_INFO.linkedin}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="hover:text-cyan-300 transition-colors"
                                    >
                                        LinkedIn
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* BOTTOM STATUS FOOTER BAR */}
            <footer className="relative z-10 flex items-center justify-between border-t border-zinc-800 pt-2 text-[10px] sm:text-xs font-mono text-zinc-400">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Hologram Projection Matrix: Locked at 60 FPS</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-zinc-500 hidden sm:inline">Use mouse to inspect, or click Return to Room</span>
                    <span className="text-cyan-400 font-bold">RAY_SYSTEM // READY</span>
                </div>
            </footer>
        </div>
    );
}

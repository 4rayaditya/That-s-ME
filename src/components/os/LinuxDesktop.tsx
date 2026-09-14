'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from './TopBar';
import Dock from './Dock';
import WindowFrame from './WindowFrame';
import TerminalApp from './TerminalApp';
import ProjectsApp from './ProjectsApp';
import CodeEditorApp from './CodeEditorApp';
import ContactApp from './ContactApp';
import MusicPlayerApp from './MusicPlayerApp';
import { Terminal, FolderGit2, Code2, Briefcase, Send, Music, Sparkles } from 'lucide-react';
import { EXPERIENCES, EDUCATION_CERTS } from '@/data/portfolioData';
import { audio } from '@/lib/audio';

interface LinuxDesktopProps {
    onReturnToRoom: () => void;
}

export default function LinuxDesktop({ onReturnToRoom }: LinuxDesktopProps) {
    const [activeWorkspace, setActiveWorkspace] = useState(1);
    const [isLofiPlaying, setIsLofiPlaying] = useState(false);
    const [showMusicWidget, setShowMusicWidget] = useState(false);

    useEffect(() => {
        setIsLofiPlaying(audio.getLofiPlaying());

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                audio.playWarpOut();
                onReturnToRoom();
            }
            if (e.altKey && !isNaN(Number(e.key))) {
                const ws = Number(e.key);
                if (ws >= 1 && ws <= 5) {
                    audio.playClick();
                    setActiveWorkspace(ws);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onReturnToRoom]);

    const handleToggleLofi = () => {
        const playing = audio.toggleLofi();
        setIsLofiPlaying(playing);
    };

    return (
        <section className="relative w-full h-screen overflow-hidden bg-[#05070d] flex flex-col font-mono select-none">
            {/* Ambient Cyber Grid & Wallpapers */}
            <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />
            <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand-cyan/10 blur-[130px] pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-brand-purple/10 blur-[130px] pointer-events-none" />

            {/* Desktop Top Bar */}
            <TopBar
                activeWorkspace={activeWorkspace}
                onSelectWorkspace={setActiveWorkspace}
                onReturnToRoom={() => {
                    audio.playWarpOut();
                    onReturnToRoom();
                }}
                isLofiPlaying={isLofiPlaying}
                onToggleLofi={handleToggleLofi}
            />

            {/* Desktop Workspaces Canvas Area */}
            <div className="flex-1 relative p-3 sm:p-6 pb-20 overflow-hidden flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {/* Workspace 1: Terminal & Neofetch */}
                    {activeWorkspace === 1 && (
                        <motion.div
                            key="ws-1"
                            initial={{ opacity: 0, scale: 0.96, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="w-full max-w-4xl h-[80vh] flex flex-col"
                        >
                            <WindowFrame
                                title="zsh - kitty - 4rayaditya@archbox"
                                icon={<Terminal className="w-4 h-4" />}
                                subtitle="Terminal // neofetch"
                                className="h-full border-brand-cyan/30 shadow-[0_0_40px_rgba(0,245,212,0.15)]"
                            >
                                <TerminalApp onReturnToRoom={onReturnToRoom} />
                            </WindowFrame>
                        </motion.div>
                    )}

                    {/* Workspace 2: Flagship Projects Browser */}
                    {activeWorkspace === 2 && (
                        <motion.div
                            key="ws-2"
                            initial={{ opacity: 0, scale: 0.96, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="w-full max-w-5xl h-[82vh] flex flex-col"
                        >
                            <WindowFrame
                                title="projects.app - Chromium (Wayland)"
                                icon={<FolderGit2 className="w-4 h-4" />}
                                subtitle="Aditya Ray Flagship 3D Systems"
                                className="h-full border-brand-blue/30 shadow-[0_0_40px_rgba(0,180,216,0.15)]"
                            >
                                <ProjectsApp />
                            </WindowFrame>
                        </motion.div>
                    )}

                    {/* Workspace 3: Neovim Code Editor */}
                    {activeWorkspace === 3 && (
                        <motion.div
                            key="ws-3"
                            initial={{ opacity: 0, scale: 0.96, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="w-full max-w-5xl h-[82vh] flex flex-col"
                        >
                            <WindowFrame
                                title="nvim - /home/aditya/portfolio"
                                icon={<Code2 className="w-4 h-4" />}
                                subtitle="Neovim v0.10.0 (LSP Active)"
                                className="h-full border-brand-purple/30 shadow-[0_0_40px_rgba(157,78,221,0.15)]"
                            >
                                <CodeEditorApp />
                            </WindowFrame>
                        </motion.div>
                    )}

                    {/* Workspace 4: Career Journey & Credentials */}
                    {activeWorkspace === 4 && (
                        <motion.div
                            key="ws-4"
                            initial={{ opacity: 0, scale: 0.96, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="w-full max-w-4xl h-[82vh] flex flex-col"
                        >
                            <WindowFrame
                                title="journey.log - Career Milestones & Certifications"
                                icon={<Briefcase className="w-4 h-4" />}
                                subtitle="Verified Track Record"
                                className="h-full border-amber-400/30 shadow-[0_0_40px_rgba(245,158,11,0.15)]"
                            >
                                <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar">
                                    <div className="space-y-4">
                                        <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                                            {/* PRODUCTION EXPERIENCE */}
                                        </div>
                                        {EXPERIENCES.map((exp) => (
                                            <div
                                                key={exp.id}
                                                className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-bold text-white text-sm">{exp.role}</h3>
                                                        <span className="text-brand-cyan text-xs">{exp.company}</span>
                                                    </div>
                                                    <span className="text-[10px] text-zinc-500 font-mono">
                                                        {exp.period} • {exp.location}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-zinc-300 leading-relaxed">
                                                    {exp.description}
                                                </p>
                                                <div className="flex flex-wrap gap-1 pt-1">
                                                    {exp.technologies.map((t) => (
                                                        <span
                                                            key={t}
                                                            className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-zinc-400"
                                                        >
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Certifications */}
                                    <div className="space-y-3 pt-4 border-t border-white/10">
                                        <div className="text-xs font-bold text-brand-purple uppercase tracking-wider">
                                            {/* VERIFIED HONORS */}
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {EDUCATION_CERTS.map((edu, idx) => (
                                                <div
                                                    key={idx}
                                                    className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-1"
                                                >
                                                    <div className="text-[10px] text-brand-cyan font-bold">{edu.badge}</div>
                                                    <div className="font-bold text-white text-xs">{edu.degree}</div>
                                                    <div className="text-[10px] text-zinc-400">{edu.institution}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </WindowFrame>
                        </motion.div>
                    )}

                    {/* Workspace 5: Contact Signal */}
                    {activeWorkspace === 5 && (
                        <motion.div
                            key="ws-5"
                            initial={{ opacity: 0, scale: 0.96, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="w-full max-w-3xl h-[75vh] flex flex-col"
                        >
                            <WindowFrame
                                title="signal.sh - Direct Communication Uplink"
                                icon={<Send className="w-4 h-4" />}
                                subtitle="Encryption: Active"
                                className="h-full border-emerald-400/30 shadow-[0_0_40px_rgba(16,185,129,0.15)]"
                            >
                                <ContactApp />
                            </WindowFrame>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Desktop Dock */}
            <Dock
                activeWorkspace={activeWorkspace}
                onSelectWorkspace={setActiveWorkspace}
                onReturnToRoom={() => {
                    audio.playWarpOut();
                    onReturnToRoom();
                }}
                isLofiPlaying={isLofiPlaying}
                onToggleLofi={handleToggleLofi}
            />
        </section>
    );
}

'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Cpu, Activity, Layers, CheckCircle2 } from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';
import { Project } from '@/data/portfolioData';
import { audio } from '@/lib/audio';

interface ProjectModalProps {
    project: Project | null;
    onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
    useEffect(() => {
        if (project) {
            audio.playModal();
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') onClose();
            };
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';

            return () => {
                window.removeEventListener('keydown', handleKeyDown);
                document.body.style.overflow = 'unset';
            };
        }
    }, [project, onClose]);

    if (!project) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => {
                        audio.playClick();
                        onClose();
                    }}
                    className="fixed inset-0 bg-space-950/85 backdrop-blur-2xl"
                />

                {/* Modal Window */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-3xl rounded-3xl bg-space-900 border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden z-10 my-auto"
                >
                    {/* Close Button */}
                    <button
                        onClick={() => {
                            audio.playClick();
                            onClose();
                        }}
                        className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-space-950/80 border border-white/10 text-zinc-300 hover:text-white hover:border-brand-cyan transition-all"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Project Header Banner Image */}
                    <div className="relative h-60 sm:h-72 w-full overflow-hidden">
                        <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-space-900 via-space-900/40 to-transparent" />

                        {/* Badges on image */}
                        <div className="absolute bottom-4 left-6 flex flex-wrap gap-2 items-center">
                            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan backdrop-blur-md">
                                {project.categoryLabel}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/10 border border-white/15 text-zinc-200 backdrop-blur-md">
                                {project.year}
                            </span>
                        </div>
                    </div>

                    {/* Modal Body Content */}
                    <div className="p-6 sm:p-8 space-y-6">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                                {project.title}
                            </h2>
                            <p className="mt-1 text-sm font-medium text-brand-cyan font-mono">
                                {project.subtitle}
                            </p>
                        </div>

                        {/* Description */}
                        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                            {project.longDescription}
                        </p>

                        {/* Performance & Scale Metrics */}
                        <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                            {project.metrics.map((m, idx) => (
                                <div key={idx} className="text-center">
                                    <div className="text-xs font-mono text-zinc-400">{m.label}</div>
                                    <div className="text-lg sm:text-xl font-bold font-mono text-white mt-0.5">
                                        {m.value}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Technical Architecture Highlights */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                                <Cpu className="w-4 h-4 text-brand-purple" />
                                Engineering Architecture & Innovations
                            </h3>
                            <ul className="space-y-2">
                                {project.architecture.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
                                        <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Tech Stack Pills */}
                        <div className="space-y-2">
                            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                                <Layers className="w-4 h-4 text-brand-cyan" />
                                Technologies Utilized
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 rounded-xl text-xs font-mono bg-white/[0.04] border border-white/10 text-zinc-300"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-white/10">
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => audio.playClick()}
                                className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-space-950 font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,245,212,0.3)] hover:shadow-[0_0_30px_rgba(0,245,212,0.6)] hover:scale-[1.02] transition-all"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Explore Production System
                            </a>
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => audio.playClick()}
                                className="w-full sm:w-auto py-3 px-5 rounded-xl bg-white/[0.05] border border-white/10 hover:border-white/25 text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
                            >
                                <GithubIcon className="w-4 h-4" />
                                Source Architecture
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

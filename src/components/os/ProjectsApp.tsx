'use client';

import React, { useState } from 'react';
import { ExternalLink, Layers, ArrowUpRight, Cpu, Activity, Eye, X } from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';
import { PROJECTS, Project } from '@/data/portfolioData';
import { audio } from '@/lib/audio';

export default function ProjectsApp() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [filter, setFilter] = useState<'all' | '3d' | 'fullstack' | 'systems'>('all');

    const filtered = PROJECTS.filter((p) => filter === 'all' || p.category === filter);

    return (
        <div className="p-4 sm:p-6 font-mono text-xs space-y-6">
            {/* Header Toolbar & Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <span>/home/aditya/repositories</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30">
                            {PROJECTS.length} Systems Deployed
                        </span>
                    </h2>
                </div>

                <div className="flex items-center gap-1.5">
                    {[
                        { id: 'all', label: 'All' },
                        { id: '3d', label: '3D WebGL' },
                        { id: 'fullstack', label: 'Full-Stack' },
                        { id: 'systems', label: 'GPU Shaders' },
                    ].map((f) => (
                        <button
                            key={f.id}
                            onClick={() => {
                                audio.playClick();
                                setFilter(f.id as typeof filter);
                            }}
                            className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
                                filter === f.id
                                    ? 'bg-brand-cyan text-space-950 font-bold shadow-sm'
                                    : 'bg-white/[0.04] text-zinc-400 hover:text-white border border-white/5'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filtered.map((proj) => (
                    <div
                        key={proj.id}
                        onClick={() => {
                            audio.playModal();
                            setSelectedProject(proj);
                        }}
                        className="group cursor-pointer rounded-xl bg-white/[0.03] border border-white/10 hover:border-brand-cyan/50 hover:bg-white/[0.05] p-3 transition-all flex flex-col justify-between shadow-lg"
                    >
                        <div>
                            {/* Thumbnail Banner */}
                            <div className="relative h-44 w-full rounded-lg overflow-hidden">
                                <img
                                    src={proj.image}
                                    alt={proj.title}
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-space-950/80 border border-white/10 text-[10px] font-bold text-brand-cyan">
                                    {proj.metrics[0].value}
                                </div>
                                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-space-950/80 border border-white/10 text-[10px] text-zinc-300">
                                    {proj.categoryLabel}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="mt-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-white group-hover:text-brand-cyan transition-colors">
                                        {proj.title}
                                    </h3>
                                    <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-brand-cyan group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                </div>
                                <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                                    {proj.description}
                                </p>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="mt-3 pt-2.5 border-t border-white/5 flex flex-wrap gap-1">
                            {proj.tags.slice(0, 4).map((t) => (
                                <span
                                    key={t}
                                    className="px-1.5 py-0.5 rounded text-[10px] bg-white/[0.04] text-zinc-400"
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Selected Project Full Architecture Modal Drawer */}
            {selectedProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/80 backdrop-blur-md">
                    <div className="relative w-full max-w-2xl max-h-[85vh] rounded-2xl bg-space-900 border border-brand-cyan/40 p-6 overflow-y-auto custom-scrollbar shadow-2xl space-y-4">
                        <button
                            onClick={() => setSelectedProject(null)}
                            className="absolute top-4 right-4 p-2 rounded-full bg-space-950 border border-white/10 text-zinc-300 hover:text-white"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="h-52 w-full rounded-xl overflow-hidden">
                            <img
                                src={selectedProject.image}
                                alt={selectedProject.title}
                                className="w-full h-full object-cover object-center"
                            />
                        </div>

                        <div>
                            <div className="text-brand-cyan text-xs">{selectedProject.subtitle}</div>
                            <h2 className="text-xl font-bold text-white">{selectedProject.title}</h2>
                        </div>

                        <p className="text-zinc-300 text-xs leading-relaxed">
                            {selectedProject.longDescription}
                        </p>

                        <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-white/[0.03] border border-white/5">
                            {selectedProject.metrics.map((m, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-[10px] text-zinc-400">{m.label}</div>
                                    <div className="text-sm font-bold text-white">{m.value}</div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2">
                            <div className="text-[11px] font-bold text-brand-purple uppercase">Architecture Highlights</div>
                            <ul className="space-y-1 text-[11px] text-zinc-300">
                                {selectedProject.architecture.map((a, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <span className="text-brand-cyan">▹</span>
                                        <span>{a}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <a
                                href={selectedProject.liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 py-2 rounded-lg bg-brand-cyan text-space-950 font-bold text-center text-xs flex items-center justify-center gap-1.5"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                Launch System
                            </a>
                            <a
                                href={selectedProject.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="py-2 px-4 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center gap-1.5"
                            >
                                <GithubIcon className="w-3.5 h-3.5" />
                                Source
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

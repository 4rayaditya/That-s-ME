'use client';

import React, { useState } from 'react';
import {
    ExternalLink,
    Sparkles,
    Layers,
    CheckCircle2,
    Search,
} from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';
import { PROJECTS, Project } from '@/data/portfolioData';
import { audio } from '@/lib/audio';

export default function WindowsProjectsApp() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [activeProject, setActiveProject] = useState<Project | null>(PROJECTS[0]);

    const categories = [
        { id: 'all', label: 'All Projects' },
        { id: '3d', label: '3D & WebGL' },
        { id: 'fullstack', label: 'Full-Stack Web' },
        { id: 'systems', label: 'Systems & Shaders' },
    ];

    const filteredProjects = PROJECTS.filter((p) => {
        const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
        const matchesQuery =
            !searchQuery ||
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCat && matchesQuery;
    });

    return (
        <div className="flex-1 flex flex-col sm:flex-row overflow-hidden font-sans text-sm">
            {/* LEFT / MAIN COLUMN: Projects List & Explorer Toolbar */}
            <div className="flex-1 flex flex-col border-r border-white/10 overflow-hidden">
                {/* Search & Filter Bar */}
                <div className="p-3 sm:p-4 border-b border-white/10 bg-white/[0.02] flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
                    {/* Category Filter Chips */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    audio.playClick();
                                    setSelectedCategory(cat.id);
                                }}
                                className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                                    selectedCategory === cat.id
                                        ? 'bg-cyan-500 text-zinc-950 font-bold shadow-sm'
                                        : 'bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08] hover:text-white'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full sm:w-56">
                        <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Filter projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-8 pr-3 py-1 bg-white/[0.04] border border-white/10 rounded-md text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-400/50"
                        />
                    </div>
                </div>

                {/* Projects Grid / List */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 custom-scrollbar">
                    {filteredProjects.map((project) => {
                        const isSelected = activeProject?.id === project.id;
                        return (
                            <div
                                key={project.id}
                                onClick={() => {
                                    audio.playClick();
                                    setActiveProject(project);
                                }}
                                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                                    isSelected
                                        ? 'bg-cyan-500/10 border-cyan-400/50 shadow-[0_0_20px_rgba(0,245,212,0.15)] ring-1 ring-cyan-400/30'
                                        : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs px-2 py-0.5 rounded bg-white/5 border border-white/10 text-cyan-300 font-mono">
                                                {project.categoryLabel}
                                            </span>
                                            <span className="text-[11px] text-zinc-400 font-mono">
                                                {project.year}
                                            </span>
                                        </div>
                                        <h3 className="text-sm font-bold text-white mt-1">
                                            {project.title}
                                        </h3>
                                    </div>
                                    {project.featured && (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" />
                                            Featured
                                        </span>
                                    )}
                                </div>

                                <p className="text-xs text-zinc-300 line-clamp-2">
                                    {project.description}
                                </p>

                                {/* Metrics Row */}
                                <div className="grid grid-cols-3 gap-2 py-1.5 px-2.5 rounded-lg bg-black/30 border border-white/5">
                                    {project.metrics.map((m, idx) => (
                                        <div key={idx} className="text-center">
                                            <div className="text-[10px] text-zinc-400 truncate">{m.label}</div>
                                            <div className="text-xs font-bold text-cyan-300">{m.value}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-1 pt-1">
                                    {project.tags.slice(0, 5).map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-1.5 py-0.5 rounded text-[10px] bg-white/[0.04] text-zinc-400 font-mono"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                    {project.tags.length > 5 && (
                                        <span className="text-[10px] text-zinc-400 self-center">
                                            +{project.tags.length - 5} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* RIGHT COLUMN: Active Project Details Inspector */}
            {activeProject && (
                <div className="w-full sm:w-80 lg:w-96 flex flex-col bg-white/[0.01] overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar">
                    <div>
                        <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
                            System Specification
                        </span>
                        <h2 className="text-base font-bold text-white mt-1">
                            {activeProject.title}
                        </h2>
                        <p className="text-xs text-zinc-400 mt-0.5">
                            {activeProject.subtitle}
                        </p>
                    </div>

                    {/* Action Links */}
                    <div className="flex items-center gap-2 pt-1">
                        <a
                            href={activeProject.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs transition-colors cursor-pointer shadow-md shadow-cyan-500/20"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Live Demo
                        </a>
                        <a
                            href={activeProject.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium text-xs border border-white/15 transition-colors cursor-pointer"
                        >
                            <GithubIcon className="w-3.5 h-3.5" />
                            Source
                        </a>
                    </div>

                    {/* Long Description */}
                    <div className="space-y-1.5 pt-2 border-t border-white/10">
                        <h4 className="text-xs font-semibold text-zinc-300">Overview</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                            {activeProject.longDescription}
                        </p>
                    </div>

                    {/* Architecture Highlights */}
                    <div className="space-y-2 pt-2 border-t border-white/10">
                        <h4 className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-cyan-400" />
                            Architectural Pipeline
                        </h4>
                        <div className="space-y-1.5">
                            {activeProject.architecture.map((arch, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-xs text-zinc-400">
                                    <CheckCircle2 className="w-3 h-3 text-cyan-400 flex-shrink-0 mt-0.5" />
                                    <span>{arch}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Full Tech Stack */}
                    <div className="space-y-1.5 pt-2 border-t border-white/10">
                        <h4 className="text-xs font-semibold text-zinc-300">Full Tech Stack</h4>
                        <div className="flex flex-wrap gap-1.5">
                            {activeProject.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 border border-cyan-500/20 text-cyan-300"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

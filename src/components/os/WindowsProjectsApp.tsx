'use client';

import React, { useState } from 'react';
import {
    ExternalLink,
    Sparkles,
    Layers,
    CheckCircle2,
    Search,
    ChevronLeft,
} from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';
import { PROJECTS, Project } from '@/data/portfolioData';
import { audio } from '@/lib/audio';

export default function WindowsProjectsApp() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [activeProject, setActiveProject] = useState<Project | null>(PROJECTS[0]);
    const [mobileTab, setMobileTab] = useState<'list' | 'details'>('list');

    const categories = [
        { id: 'all', label: 'All Projects' },
        { id: 'fullstack', label: 'Full-Stack' },
        { id: 'systems', label: 'Systems & AI' },
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
        <div className="flex-1 flex flex-col overflow-hidden font-sans text-sm bg-[#f8fafc]">
            {/* Mobile Tab Switcher Bar (Visible only on mobile screens) */}
            <div className="sm:hidden flex items-center border-b border-slate-200 bg-slate-200/80 p-1 gap-1 select-none flex-shrink-0">
                <button
                    onClick={() => { audio.playClick(); setMobileTab('list'); }}
                    className={`flex-1 py-1.5 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        mobileTab === 'list'
                            ? 'bg-white text-blue-800 shadow-sm border border-slate-300'
                            : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    <span>All Projects ({filteredProjects.length})</span>
                </button>
                <button
                    onClick={() => { audio.playClick(); setMobileTab('details'); }}
                    className={`flex-1 py-1.5 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        mobileTab === 'details'
                            ? 'bg-white text-blue-800 shadow-sm border border-slate-300'
                            : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    <span className="truncate">Details &amp; Demo</span>
                </button>
            </div>

            {/* Main Area: Side-by-side on desktop, Toggled view on mobile */}
            <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
                {/* LEFT / MAIN COLUMN: Projects List & Explorer Toolbar */}
                <div className={`flex-1 flex-col border-r border-slate-200 overflow-hidden ${mobileTab === 'details' ? 'hidden sm:flex' : 'flex'}`}>
                    {/* Search & Filter Bar */}
                    <div className="p-3 sm:p-4 border-b border-slate-200 bg-slate-100/90 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
                        {/* Category Filter Chips */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => {
                                        audio.playClick();
                                        setSelectedCategory(cat.id);
                                    }}
                                    className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                                        selectedCategory === cat.id
                                            ? 'bg-blue-600 text-white font-bold shadow-sm'
                                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full sm:w-56 flex-shrink-0">
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Filter projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-8 pr-3 py-1 bg-white border border-slate-300 rounded-md text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-inner"
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
                                        setMobileTab('details');
                                    }}
                                    className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                                        isSelected
                                            ? 'bg-blue-50/80 border-blue-500 shadow-sm ring-1 ring-blue-400/40'
                                            : 'bg-white border-slate-200/90 hover:bg-slate-50/80 hover:border-blue-300 shadow-sm'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 font-mono font-medium">
                                                    {project.categoryLabel}
                                                </span>
                                                <span className="text-[11px] text-slate-500 font-mono">
                                                    {project.year}
                                                </span>
                                            </div>
                                            <h3 className="text-sm font-bold text-slate-900 mt-1">
                                                {project.title}
                                            </h3>
                                        </div>
                                        {project.featured && (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 border border-amber-300 text-amber-800 flex items-center gap-1 flex-shrink-0">
                                                <Sparkles className="w-3 h-3" />
                                                Featured
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                        {project.description}
                                    </p>

                                    {/* Metrics Row */}
                                    <div className="grid grid-cols-3 gap-2 py-1.5 px-2.5 rounded-lg bg-slate-100/70 border border-slate-200">
                                        {project.metrics.map((m, idx) => (
                                            <div key={idx} className="text-center">
                                                <div className="text-[10px] text-slate-500 truncate">{m.label}</div>
                                                <div className="text-xs font-bold text-blue-700">{m.value}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Tags & Mobile Action Hint */}
                                    <div className="flex items-center justify-between gap-2 pt-1">
                                        <div className="flex flex-wrap gap-1 flex-1">
                                            {project.tags.slice(0, 4).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 border border-slate-200 text-slate-600 font-mono"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                            {project.tags.length > 4 && (
                                                <span className="text-[10px] text-slate-500 self-center font-medium">
                                                    +{project.tags.length - 4}
                                                </span>
                                            )}
                                        </div>
                                        <span className="sm:hidden text-[11px] text-blue-600 font-semibold flex-shrink-0">
                                            View Details →
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT COLUMN: Active Project Details Inspector */}
                {activeProject && (
                    <div className={`w-full sm:w-80 lg:w-96 flex-col bg-white overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar ${mobileTab === 'list' ? 'hidden sm:flex' : 'flex'}`}>
                        {/* Mobile Back Button */}
                        <div className="sm:hidden flex items-center justify-between pb-2 border-b border-slate-200">
                            <button
                                onClick={() => { audio.playClick(); setMobileTab('list'); }}
                                className="flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900 cursor-pointer"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span>Back to All Projects</span>
                            </button>
                            <span className="text-[11px] text-slate-500 font-mono">
                                {activeProject.categoryLabel}
                            </span>
                        </div>

                        <div>
                            <span className="text-[11px] font-mono text-blue-700 uppercase tracking-wider font-semibold">
                                System Specification
                            </span>
                            <h2 className="text-base font-bold text-slate-900 mt-1">
                                {activeProject.title}
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                {activeProject.subtitle}
                            </p>
                        </div>

                        {/* Action Links */}
                        <div className="flex items-center gap-2 pt-1">
                            <a
                                href={activeProject.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                Live Demo
                            </a>
                            <a
                                href={activeProject.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs border border-slate-300 transition-colors cursor-pointer shadow-sm"
                            >
                                <GithubIcon className="w-3.5 h-3.5" />
                                Source
                            </a>
                        </div>

                        {/* Long Description */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-200">
                            <h4 className="text-xs font-bold text-slate-900">Overview</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                {activeProject.longDescription}
                            </p>
                        </div>

                        {/* Architecture Highlights */}
                        <div className="space-y-2 pt-2 border-t border-slate-200">
                            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                <Layers className="w-3.5 h-3.5 text-blue-600" />
                                Architectural Pipeline
                            </h4>
                            <div className="space-y-1.5">
                                {activeProject.architecture.map((arch, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <span>{arch}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Full Tech Stack */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-200">
                            <h4 className="text-xs font-bold text-slate-900">Full Tech Stack</h4>
                            <div className="flex flex-wrap gap-1.5">
                                {activeProject.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-blue-50 border border-blue-200 text-blue-700 font-medium"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

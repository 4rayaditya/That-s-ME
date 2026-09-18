'use client';

import React, { useState } from 'react';
import {
    ArrowLeft,
    ArrowRight,
    Search,
    ExternalLink,
    Sparkles,
    FolderGit2,
    CheckCircle2,
    Monitor,
    ChevronLeft,
    Layers,
    Calendar,
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
        <div className="flex-1 flex flex-col overflow-hidden font-sans text-xs bg-[#ffffff] select-none text-[#1e1e1e]">
            {/* 1. Windows 7 Explorer Navigation & Address Command Bar */}
            <div className="h-10 px-2.5 bg-gradient-to-b from-[#f7f9fc] via-[#eaf0f7] to-[#dbe5f1] border-b border-[#b2bcc7] flex items-center justify-between gap-2 shadow-[inset_0_1px_0_#ffffff] flex-shrink-0">
                {/* Back / Forward Buttons */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => {
                            audio.playClick();
                            setSelectedCategory('all');
                            setSearchQuery('');
                            setMobileTab('list');
                        }}
                        className="w-6 h-6 rounded-full bg-gradient-to-b from-[#ffffff] to-[#d6e3f2] border border-[#899db4] hover:border-[#4d7ca8] flex items-center justify-center text-[#2a4768] shadow-xs cursor-pointer transition-colors"
                        title="Back to All Projects"
                    >
                        <ArrowLeft className="w-3 h-3" />
                    </button>
                    <button
                        className="w-6 h-6 rounded-full bg-gradient-to-b from-[#ffffff] to-[#e8edf3] border border-[#b2bcc7] flex items-center justify-center text-[#94a3b8] cursor-default opacity-60"
                        title="Forward"
                        disabled
                    >
                        <ArrowRight className="w-3 h-3" />
                    </button>
                </div>

                {/* Breadcrumbs Address Bar */}
                <div className="flex-1 h-6 rounded-[2px] px-2 bg-white border border-[#828790] hover:border-[#3c7fb1] flex items-center gap-1 text-[11px] text-[#333333] shadow-[inset_0_1px_1px_rgba(0,0,0,0.1)] overflow-hidden transition-colors">
                    <FolderGit2 className="w-3.5 h-3.5 text-[#0284c7] flex-shrink-0" />
                    <span className="text-[#555555]">Computer</span>
                    <span className="text-[#999999] text-[9px]">▶</span>
                    <span className="text-[#555555]">Projects Library</span>
                    <span className="text-[#999999] text-[9px]">▶</span>
                    <span className="text-[#1e395b] font-semibold truncate">
                        {activeProject ? activeProject.title : 'All Systems'}
                    </span>
                </div>

                {/* Windows 7 Search Input */}
                <div className="w-44 sm:w-56 h-6 rounded-[2px] px-2 bg-white border border-[#828790] focus-within:border-[#3c7fb1] flex items-center gap-1.5 text-[11px] shadow-[inset_0_1px_1px_rgba(0,0,0,0.1)] flex-shrink-0">
                    <Search className="w-3 h-3 text-[#555555]" />
                    <input
                        type="text"
                        placeholder="Search Projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent outline-none text-[#1e1e1e] placeholder-[#888888]"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="text-[10px] text-[#777777] hover:text-[#000000] px-0.5 cursor-pointer"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* 2. Windows 7 Filter Bar */}
            <div className="px-3 py-1.5 bg-[#f0f4f9] border-b border-[#d8e1eb] flex items-center justify-between gap-2 flex-shrink-0">
                <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar">
                    <span className="text-[11px] font-semibold text-[#1e395b] mr-1">
                        Filter:
                    </span>
                    {categories.map((cat) => {
                        const isSelected = selectedCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    audio.playClick();
                                    setSelectedCategory(cat.id);
                                }}
                                className={`px-2.5 py-0.5 rounded-[3px] text-[11px] font-normal transition-all whitespace-nowrap cursor-pointer border ${
                                    isSelected
                                        ? 'bg-gradient-to-b from-[#dcedfa] to-[#bcdbf7] border-[#4a82b5] text-[#103a63] font-semibold shadow-[inset_0_1px_0_#ffffff]'
                                        : 'bg-gradient-to-b from-[#f7f8fa] to-[#e4e8ee] border-[#b0bac6] text-[#222222] hover:from-[#f2f8fe] hover:to-[#d2e8f8] hover:border-[#6da1ce] shadow-[inset_0_1px_0_#ffffff]'
                                }`}
                            >
                                {cat.label}
                            </button>
                        );
                    })}
                </div>

                {/* Mobile View Switcher */}
                <div className="sm:hidden flex items-center gap-1">
                    <button
                        onClick={() => { audio.playClick(); setMobileTab('list'); }}
                        className={`px-2 py-0.5 rounded text-[10px] border ${mobileTab === 'list' ? 'bg-[#dcedfa] border-[#4a82b5] text-[#103a63] font-bold' : 'bg-white border-[#ccc]'}`}
                    >
                        List
                    </button>
                    <button
                        onClick={() => { audio.playClick(); setMobileTab('details'); }}
                        className={`px-2 py-0.5 rounded text-[10px] border ${mobileTab === 'details' ? 'bg-[#dcedfa] border-[#4a82b5] text-[#103a63] font-bold' : 'bg-white border-[#ccc]'}`}
                    >
                        Details
                    </button>
                </div>
            </div>

            {/* 3. Main Explorer Content Area (Split List & Preview Pane) */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Projects List */}
                <div className={`flex-1 border-r border-[#d8e1eb] overflow-y-auto p-3 space-y-2 custom-scrollbar bg-white ${mobileTab === 'details' ? 'hidden sm:block' : 'block'}`}>
                    {filteredProjects.length === 0 ? (
                        <div className="h-48 flex flex-col items-center justify-center text-center space-y-1 text-[#666666]">
                            <p className="text-sm font-semibold text-[#1e395b]">No projects match your criteria.</p>
                            <button
                                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                                className="text-xs text-[#0066cc] hover:underline"
                            >
                                Reset search
                            </button>
                        </div>
                    ) : (
                        filteredProjects.map((project) => {
                            const isSelected = activeProject?.id === project.id;
                            return (
                                <div
                                    key={project.id}
                                    onClick={() => {
                                        audio.playClick();
                                        setActiveProject(project);
                                        setMobileTab('details');
                                    }}
                                    className={`p-3 rounded-[3px] border transition-all duration-150 cursor-pointer ${
                                        isSelected
                                            ? 'bg-gradient-to-b from-[#d9ebf9] to-[#c5e2f7] border-[#7da2ce] shadow-[inset_0_0_1px_#ffffff]'
                                            : 'bg-transparent border-transparent hover:bg-gradient-to-b hover:from-[#eef6fd] hover:to-[#e1f0fc] hover:border-[#b8d6fb] hover:shadow-[inset_0_0_1px_#ffffff]'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="w-8 h-8 rounded-[2px] bg-[#f2f6fa] border border-[#d2dbe6] flex items-center justify-center text-[#0891b2] flex-shrink-0 shadow-[inset_0_1px_0_#ffffff]">
                                                <FolderGit2 className="w-4 h-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-xs font-bold text-[#1e1e1e] truncate leading-tight">
                                                    {project.title}
                                                </div>
                                                <div className="text-[11px] text-[#555555] truncate mt-0.5">
                                                    {project.subtitle}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 flex-shrink-0">
                                            {project.featured && (
                                                <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-[#fff7d6] border border-[#e6c84f] text-[#8a6b05]">
                                                    ★ Featured
                                                </span>
                                            )}
                                            <span className="text-[10px] text-[#777777] font-mono">
                                                {project.year}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-[11px] text-[#444444] line-clamp-2 mt-2 leading-relaxed">
                                        {project.description}
                                    </p>

                                    {/* Metrics & Tags Strip */}
                                    <div className="flex items-center justify-between gap-2 mt-2 pt-1.5 border-t border-[#e2e8f0]/80 text-[10px]">
                                        <div className="flex flex-wrap gap-1">
                                            {project.tags.slice(0, 4).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-1.5 py-0.2 rounded bg-[#f4f7fa] border border-[#d8e1eb] text-[#475569] font-mono"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <span className="text-[#0066cc] font-medium hidden sm:inline">
                                            View specs →
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Right: Windows 7 Details & Preview Pane */}
                {activeProject && (
                    <div className={`w-full sm:w-80 lg:w-96 bg-[#fbfcfe] p-4 space-y-4 overflow-y-auto custom-scrollbar ${mobileTab === 'list' ? 'hidden sm:block' : 'block'}`}>
                        {/* Mobile Back Button */}
                        <div className="sm:hidden flex items-center justify-between pb-2 border-b border-[#d8e1eb]">
                            <button
                                onClick={() => { audio.playClick(); setMobileTab('list'); }}
                                className="flex items-center gap-1 text-xs font-semibold text-[#0066cc] cursor-pointer"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span>Back to Project List</span>
                            </button>
                        </div>

                        {/* Title Header */}
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded bg-[#e8f2fc] text-[#1c5f94] border border-[#bcdbf7]">
                                    {activeProject.categoryLabel}
                                </span>
                                <span className="text-[10px] text-[#666666] font-mono">
                                    Release: {activeProject.year}
                                </span>
                            </div>
                            <h3 className="text-sm font-bold text-[#1e395b] mt-1">
                                {activeProject.title}
                            </h3>
                            <p className="text-[11px] text-[#555555] mt-0.5">
                                {activeProject.subtitle}
                            </p>
                        </div>

                        {/* Action Buttons: Windows 7 Push Buttons */}
                        <div className="flex items-center gap-2 pt-1">
                            <a
                                href={activeProject.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => audio.playClick()}
                                className="flex-1 py-1.5 px-3 rounded-[3px] bg-gradient-to-b from-[#f7f8fa] to-[#e4e8ee] hover:from-[#eef6fe] hover:to-[#d4e8f8] border border-[#a8b4c2] hover:border-[#4a82b5] text-[#1e395b] font-bold text-xs flex items-center justify-center gap-1.5 shadow-[inset_0_1px_0_#ffffff] cursor-pointer transition-colors"
                            >
                                <ExternalLink className="w-3.5 h-3.5 text-[#0066cc]" />
                                Live Demo
                            </a>
                            <a
                                href={activeProject.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => audio.playClick()}
                                className="py-1.5 px-3 rounded-[3px] bg-gradient-to-b from-[#f7f8fa] to-[#e4e8ee] hover:from-[#eef6fe] hover:to-[#d4e8f8] border border-[#a8b4c2] hover:border-[#4a82b5] text-[#333333] font-semibold text-xs flex items-center justify-center gap-1.5 shadow-[inset_0_1px_0_#ffffff] cursor-pointer transition-colors"
                            >
                                <GithubIcon className="w-3.5 h-3.5 text-[#222222]" />
                                Source
                            </a>
                        </div>

                        {/* System Overview */}
                        <div className="space-y-1 pt-2 border-t border-[#d8e1eb]">
                            <div className="text-xs font-bold text-[#1e395b] flex items-center gap-1">
                                System Overview
                                <div className="flex-1 h-[1px] bg-gradient-to-r from-[#9ec4e8] to-transparent ml-2" />
                            </div>
                            <p className="text-[11px] text-[#444444] leading-relaxed">
                                {activeProject.longDescription}
                            </p>
                        </div>

                        {/* Architecture Pipeline */}
                        <div className="space-y-1.5 pt-2 border-t border-[#d8e1eb]">
                            <div className="text-xs font-bold text-[#1e395b] flex items-center gap-1">
                                <Layers className="w-3.5 h-3.5 text-[#2a68a5]" />
                                Architectural Components
                                <div className="flex-1 h-[1px] bg-gradient-to-r from-[#9ec4e8] to-transparent ml-2" />
                            </div>
                            <div className="space-y-1">
                                {activeProject.architecture.map((arch, idx) => (
                                    <div key={idx} className="flex items-start gap-1.5 text-[11px] text-[#333333]">
                                        <span className="text-[#008800] font-bold">✓</span>
                                        <span>{arch}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tech Stack Components */}
                        <div className="space-y-1.5 pt-2 border-t border-[#d8e1eb]">
                            <div className="text-xs font-bold text-[#1e395b] flex items-center gap-1">
                                Technology Matrix
                                <div className="flex-1 h-[1px] bg-gradient-to-r from-[#9ec4e8] to-transparent ml-2" />
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {activeProject.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-0.5 rounded-[2px] text-[10px] font-mono bg-white border border-[#c2d0df] text-[#1c5f94]"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 4. Windows 7 Explorer Status Bar */}
            <div className="h-6 px-3 bg-gradient-to-b from-[#f2f5f9] to-[#e4e9ef] border-t border-[#d0d7e0] flex items-center justify-between text-[11px] text-[#444444] shadow-[inset_0_1px_0_#ffffff] flex-shrink-0">
                <div className="flex items-center gap-2">
                    <FolderGit2 className="w-3 h-3 text-[#3a6ea5]" />
                    <span>{filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}</span>
                </div>
                <div className="text-[11px] text-[#666666]">
                    Computer | Flagship Systems Library
                </div>
            </div>
        </div>
    );
}

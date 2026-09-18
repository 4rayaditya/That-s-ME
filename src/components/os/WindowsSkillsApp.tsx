'use client';

import React, { useState } from 'react';
import {
    ArrowLeft,
    ArrowRight,
    Search,
    Cpu,
    Folder,
    Monitor,
    Layers,
} from 'lucide-react';
import { SKILL_CATEGORIES } from '@/data/portfolioData';
import { audio } from '@/lib/audio';

export default function WindowsSkillsApp() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedSkillName, setSelectedSkillName] = useState<string | null>(null);

    const categories = [
        { id: 'all', title: 'All Skills' },
        ...SKILL_CATEGORIES.map((c) => ({ id: c.title, title: c.title })),
    ];

    // Filter categories & skills
    const filteredCategories = SKILL_CATEGORIES.map((cat) => {
        const matchesCategory = selectedCategory === 'all' || selectedCategory === cat.title;
        if (!matchesCategory) return null;

        const filteredSkills = cat.skills.filter((skill) => {
            if (!searchQuery.trim()) return true;
            const q = searchQuery.toLowerCase();
            return (
                skill.name.toLowerCase().includes(q) ||
                (skill.highlight && skill.highlight.toLowerCase().includes(q)) ||
                cat.title.toLowerCase().includes(q)
            );
        });

        if (filteredSkills.length === 0) return null;

        return {
            ...cat,
            skills: filteredSkills,
        };
    }).filter(Boolean) as typeof SKILL_CATEGORIES;

    const totalVisibleSkills = filteredCategories.reduce((acc, cat) => acc + cat.skills.length, 0);

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
                        }}
                        className="w-6 h-6 rounded-full bg-gradient-to-b from-[#ffffff] to-[#d6e3f2] border border-[#899db4] hover:border-[#4d7ca8] flex items-center justify-center text-[#2a4768] shadow-xs cursor-pointer transition-colors"
                        title="Back to All Skills"
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
                    <Monitor className="w-3 h-3 text-[#3a6ea5] flex-shrink-0" />
                    <span className="text-[#555555]">Computer</span>
                    <span className="text-[#999999] text-[9px]">▶</span>
                    <span className="text-[#555555]">System Diagnostics</span>
                    <span className="text-[#999999] text-[9px]">▶</span>
                    <span className="text-[#1e395b] font-semibold truncate">
                        {selectedCategory === 'all' ? 'Skills Matrix' : selectedCategory}
                    </span>
                </div>

                {/* Windows 7 Search Input */}
                <div className="w-44 sm:w-56 h-6 rounded-[2px] px-2 bg-white border border-[#828790] focus-within:border-[#3c7fb1] flex items-center gap-1.5 text-[11px] shadow-[inset_0_1px_1px_rgba(0,0,0,0.1)] flex-shrink-0">
                    <Search className="w-3 h-3 text-[#555555]" />
                    <input
                        type="text"
                        placeholder="Search Skills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent outline-none text-[#1e1e1e] placeholder-[#888888]"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="text-[10px] text-[#777777] hover:text-[#000000] px-0.5"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* 2. Windows 7 Filter Bar (Category Push Buttons) */}
            <div className="px-3 py-1.5 bg-[#f0f4f9] border-b border-[#d8e1eb] flex items-center gap-1 overflow-x-auto custom-scrollbar flex-shrink-0">
                <span className="text-[11px] font-semibold text-[#1e395b] mr-1 flex items-center gap-1">
                    <Folder className="w-3 h-3 text-[#e6a817]" />
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
                            {cat.title}
                        </button>
                    );
                })}
            </div>

            {/* 3. Main Windows 7 Tiles View Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 custom-scrollbar bg-[#ffffff]">
                {filteredCategories.length === 0 ? (
                    <div className="h-48 flex flex-col items-center justify-center text-center space-y-1 text-[#666666]">
                        <p className="text-sm font-semibold text-[#1e395b]">No items match your search.</p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('all');
                            }}
                            className="text-xs text-[#0066cc] hover:underline"
                        >
                            Clear search filters
                        </button>
                    </div>
                ) : (
                    filteredCategories.map((cat) => (
                        <div key={cat.title} className="space-y-2">
                            {/* Windows 7 Classic Group Header */}
                            <div className="flex items-center">
                                <span className="text-xs font-bold text-[#1e395b] flex items-center gap-1">
                                    {cat.title}
                                    <span className="text-[11px] font-normal text-[#666666]">
                                        ({cat.skills.length})
                                    </span>
                                </span>
                                <div className="flex-1 h-[1px] bg-gradient-to-r from-[#9ec4e8] to-transparent ml-3" />
                            </div>

                            {/* Windows 7 Explorer Tiles Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5">
                                {cat.skills.map((skill) => {
                                    const isSelected = selectedSkillName === skill.name;

                                    return (
                                        <div
                                            key={skill.name}
                                            onClick={() => {
                                                audio.playClick();
                                                setSelectedSkillName(skill.name);
                                            }}
                                            className={`p-2 rounded-[3px] border transition-all duration-150 flex items-center gap-3 cursor-pointer ${
                                                isSelected
                                                    ? 'bg-gradient-to-b from-[#d9ebf9] to-[#c5e2f7] border-[#7da2ce] shadow-[inset_0_0_1px_#ffffff]'
                                                    : 'bg-transparent border-transparent hover:bg-gradient-to-b hover:from-[#eef6fd] hover:to-[#e1f0fc] hover:border-[#b8d6fb] hover:shadow-[inset_0_0_1px_#ffffff]'
                                            }`}
                                        >
                                            {/* Skill Icon */}
                                            <div className="w-8 h-8 rounded-[2px] bg-[#f4f7fb] border border-[#d2dbe6] flex items-center justify-center text-lg flex-shrink-0 shadow-[inset_0_1px_0_#ffffff]">
                                                {skill.icon}
                                            </div>

                                            {/* Skill Name & Highlight Description */}
                                            <div className="min-w-0 flex-1">
                                                <div className="text-xs font-semibold text-[#1e1e1e] truncate leading-tight">
                                                    {skill.name}
                                                </div>
                                                {skill.highlight && (
                                                    <div className="text-[11px] text-[#555555] truncate leading-tight mt-0.5">
                                                        {skill.highlight}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* 4. Windows 7 Explorer Status Bar */}
            <div className="h-6 px-3 bg-gradient-to-b from-[#f2f5f9] to-[#e4e9ef] border-t border-[#d0d7e0] flex items-center justify-between text-[11px] text-[#444444] shadow-[inset_0_1px_0_#ffffff] flex-shrink-0">
                <div className="flex items-center gap-2">
                    <Layers className="w-3 h-3 text-[#3a6ea5]" />
                    <span>{totalVisibleSkills} {totalVisibleSkills === 1 ? 'item' : 'items'}</span>
                </div>
                <div className="text-[11px] text-[#666666]">
                    Computer | System Diagnostics
                </div>
            </div>
        </div>
    );
}

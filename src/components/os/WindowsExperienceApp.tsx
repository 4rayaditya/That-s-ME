'use client';

import React, { useState } from 'react';
import {
    ArrowLeft,
    ArrowRight,
    Search,
    Briefcase,
    Calendar,
    MapPin,
    Award,
    Building,
    Check,
} from 'lucide-react';
import { EXPERIENCES, EDUCATION_CERTS } from '@/data/portfolioData';
import { audio } from '@/lib/audio';

export default function WindowsExperienceApp() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredExperiences = EXPERIENCES.filter((exp) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            exp.role.toLowerCase().includes(q) ||
            exp.company.toLowerCase().includes(q) ||
            exp.description.toLowerCase().includes(q) ||
            exp.technologies.some((t) => t.toLowerCase().includes(q))
        );
    });

    const filteredEducation = EDUCATION_CERTS.filter((edu) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            edu.degree.toLowerCase().includes(q) ||
            edu.institution.toLowerCase().includes(q) ||
            edu.badge.toLowerCase().includes(q)
        );
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
                            setSearchQuery('');
                        }}
                        className="w-6 h-6 rounded-full bg-gradient-to-b from-[#ffffff] to-[#d6e3f2] border border-[#899db4] hover:border-[#4d7ca8] flex items-center justify-center text-[#2a4768] shadow-xs cursor-pointer transition-colors"
                        title="Back to All Experience"
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
                    <Briefcase className="w-3.5 h-3.5 text-[#d97706] flex-shrink-0" />
                    <span className="text-[#555555]">Computer</span>
                    <span className="text-[#999999] text-[9px]">▶</span>
                    <span className="text-[#555555]">Career History</span>
                    <span className="text-[#999999] text-[9px]">▶</span>
                    <span className="text-[#1e395b] font-semibold truncate">
                        Professional Track Record
                    </span>
                </div>

                {/* Windows 7 Search Input */}
                <div className="w-44 sm:w-56 h-6 rounded-[2px] px-2 bg-white border border-[#828790] focus-within:border-[#3c7fb1] flex items-center gap-1.5 text-[11px] shadow-[inset_0_1px_1px_rgba(0,0,0,0.1)] flex-shrink-0">
                    <Search className="w-3 h-3 text-[#555555]" />
                    <input
                        type="text"
                        placeholder="Search Experience..."
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

            {/* 2. Main Windows 7 Content Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar bg-[#ffffff]">
                {/* Section 1: Professional Work History */}
                <div className="space-y-3">
                    <div className="flex items-center">
                        <span className="text-xs font-bold text-[#1e395b] flex items-center gap-1.5">
                            <Building className="w-3.5 h-3.5 text-[#2563eb]" />
                            Professional Work History
                            <span className="text-[11px] font-normal text-[#666666]">
                                ({filteredExperiences.length})
                            </span>
                        </span>
                        <div className="flex-1 h-[1px] bg-gradient-to-r from-[#9ec4e8] to-transparent ml-3" />
                    </div>

                    <div className="space-y-3">
                        {filteredExperiences.map((exp) => (
                            <div
                                key={exp.id}
                                className="p-4 rounded-[3px] bg-white border border-[#d2dbe6] hover:bg-gradient-to-b hover:from-[#f4f8fd] hover:to-[#eaf2fc] hover:border-[#b8d6fb] transition-all duration-150 space-y-2.5 shadow-[inset_0_1px_0_#ffffff]"
                            >
                                {/* Role & Company Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-[#e5edf5]">
                                    <div>
                                        <h3 className="text-xs font-bold text-[#1e1e1e]">
                                            {exp.role}
                                        </h3>
                                        <span className="text-[11px] text-[#0066cc] font-semibold">
                                            {exp.company}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[11px] text-[#555555] font-mono">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3 text-[#777777]" />
                                            {exp.period}
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3 text-[#777777]" />
                                            {exp.location}
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-[11px] text-[#444444] leading-relaxed">
                                    {exp.description}
                                </p>

                                {/* Achievements */}
                                <div className="space-y-1 pt-1">
                                    {exp.achievements.map((ach, idx) => (
                                        <div key={idx} className="flex items-start gap-2 text-[11px] text-[#333333]">
                                            <span className="text-[#008800] font-bold">✓</span>
                                            <span>{ach}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Tech Stack Pills */}
                                <div className="flex flex-wrap gap-1 pt-2 border-t border-[#edf2f7]">
                                    {exp.technologies.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-1.5 py-0.2 rounded-[2px] text-[10px] font-mono bg-[#f4f7fb] border border-[#d2dbe6] text-[#1c5f94]"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 2: Education & Certifications */}
                <div className="space-y-3">
                    <div className="flex items-center">
                        <span className="text-xs font-bold text-[#1e395b] flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-[#0d9488]" />
                            Verified Credentials &amp; Certifications
                            <span className="text-[11px] font-normal text-[#666666]">
                                ({filteredEducation.length})
                            </span>
                        </span>
                        <div className="flex-1 h-[1px] bg-gradient-to-r from-[#9ec4e8] to-transparent ml-3" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {filteredEducation.map((cert, idx) => (
                            <div
                                key={idx}
                                className="p-3.5 rounded-[3px] bg-white border border-[#d2dbe6] hover:bg-gradient-to-b hover:from-[#f4f8fd] hover:to-[#eaf2fc] hover:border-[#b8d6fb] transition-all space-y-1 shadow-[inset_0_1px_0_#ffffff]"
                            >
                                <span className="inline-block px-1.5 py-0.2 rounded-[2px] text-[10px] font-semibold bg-[#e8f2fc] text-[#1c5f94] border border-[#bcdbf7]">
                                    {cert.badge}
                                </span>
                                <div className="text-xs font-bold text-[#1e1e1e] leading-tight">
                                    {cert.degree}
                                </div>
                                <div className="text-[11px] text-[#555555]">
                                    {cert.institution}
                                </div>
                                <div className="text-[10px] text-[#777777] font-mono">
                                    Year: {cert.year}
                                </div>
                                <p className="text-[10px] text-[#666666] pt-1">
                                    {cert.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. Windows 7 Explorer Status Bar */}
            <div className="h-6 px-3 bg-gradient-to-b from-[#f2f5f9] to-[#e4e9ef] border-t border-[#d0d7e0] flex items-center justify-between text-[11px] text-[#444444] shadow-[inset_0_1px_0_#ffffff] flex-shrink-0">
                <div className="flex items-center gap-2">
                    <Briefcase className="w-3 h-3 text-[#3a6ea5]" />
                    <span>{filteredExperiences.length} Roles • {filteredEducation.length} Credentials</span>
                </div>
                <div className="text-[11px] text-[#666666]">
                    Computer | Verified Professional History
                </div>
            </div>
        </div>
    );
}

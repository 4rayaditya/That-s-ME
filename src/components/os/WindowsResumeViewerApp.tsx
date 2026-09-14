'use client';

import React from 'react';
import { Download, Printer, ZoomIn, ZoomOut, FileText, CheckCircle2 } from 'lucide-react';
import { PERSONAL_INFO, EXPERIENCES, EDUCATION_CERTS, SKILL_CATEGORIES } from '@/data/portfolioData';

export default function WindowsResumeViewerApp() {
    const handleDownload = () => {
        window.print();
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden font-sans bg-[#2b2b2b] text-zinc-100 select-text">
            {/* PDF Viewer Top Toolbar */}
            <div className="h-10 px-4 bg-[#1f1f1f] border-b border-white/10 flex items-center justify-between select-none text-xs">
                <div className="flex items-center gap-2 text-zinc-300">
                    <FileText className="w-4 h-4 text-rose-400" />
                    <span className="font-medium">Aditya_Ray_Resume.pdf</span>
                    <span className="text-[11px] text-zinc-500 font-mono">(Page 1 of 1)</span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-1.5 px-3 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs transition-colors cursor-pointer"
                        title="Print / Save as PDF"
                    >
                        <Printer className="w-3.5 h-3.5" />
                        Print / Save PDF
                    </button>
                </div>
            </div>

            {/* Document Canvas Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center custom-scrollbar">
                <div className="w-full max-w-2xl bg-[#0e1117] border border-white/15 shadow-2xl p-6 sm:p-10 space-y-6 text-zinc-200 rounded-sm">
                    {/* Header */}
                    <div className="border-b border-white/15 pb-5">
                        <h1 className="text-2xl font-bold text-white tracking-tight">
                            {PERSONAL_INFO.name}
                        </h1>
                        <p className="text-xs text-cyan-400 font-mono mt-0.5">
                            {PERSONAL_INFO.role}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-400 mt-2 font-mono">
                            <span>{PERSONAL_INFO.email}</span>
                            <span>•</span>
                            <span>{PERSONAL_INFO.location}</span>
                            <span>•</span>
                            <span>github.com/4rayaditya</span>
                            <span>•</span>
                            <span>linkedin.com/in/4rayaditya</span>
                        </div>
                    </div>

                    {/* Executive Summary */}
                    <div className="space-y-1.5">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-white/10 pb-1">
                            Executive Summary
                        </h2>
                        <p className="text-xs text-zinc-300 leading-relaxed pt-1">
                            {PERSONAL_INFO.bio}
                        </p>
                    </div>

                    {/* Core Skills */}
                    <div className="space-y-2">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-white/10 pb-1">
                            Technical Proficiencies
                        </h2>
                        <div className="space-y-1 text-xs">
                            {SKILL_CATEGORIES.map((cat) => (
                                <div key={cat.title} className="flex flex-col sm:flex-row sm:items-baseline gap-1">
                                    <span className="font-semibold text-zinc-300 w-44 flex-shrink-0">
                                        {cat.title}:
                                    </span>
                                    <span className="text-zinc-400 font-mono text-[11px]">
                                        {cat.skills.map((s) => s.name).join(', ')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Work Experience */}
                    <div className="space-y-3">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-white/10 pb-1">
                            Professional Experience
                        </h2>
                        <div className="space-y-4 pt-1">
                            {EXPERIENCES.map((exp) => (
                                <div key={exp.id} className="space-y-1.5">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="text-xs font-bold text-white">
                                            {exp.role} — <span className="text-cyan-400">{exp.company}</span>
                                        </h3>
                                        <span className="text-[11px] text-zinc-400 font-mono">
                                            {exp.period}
                                        </span>
                                    </div>
                                    <p className="text-xs text-zinc-400">
                                        {exp.description}
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 text-[11px] text-zinc-400">
                                        {exp.achievements.map((ach, i) => (
                                            <li key={i}>{ach}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Education */}
                    <div className="space-y-2">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-white/10 pb-1">
                            Education & Honors
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                            {EDUCATION_CERTS.map((edu, idx) => (
                                <div key={idx} className="p-2 rounded bg-white/[0.02] border border-white/5">
                                    <div className="font-semibold text-white">{edu.degree}</div>
                                    <div className="text-[11px] text-zinc-400">{edu.institution} ({edu.year})</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

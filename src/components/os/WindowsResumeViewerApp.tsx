'use client';

import React, { useState } from 'react';
import { Printer, FileText, Download, ExternalLink, Eye, LayoutList } from 'lucide-react';
import { PERSONAL_INFO, EXPERIENCES, EDUCATION_CERTS, SKILL_CATEGORIES } from '@/data/portfolioData';

export default function WindowsResumeViewerApp() {
    const [viewMode, setViewMode] = useState<'pdf' | 'html'>('pdf');

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden font-sans bg-[#1f242d] text-zinc-100 select-text">
            {/* PDF Viewer Top Toolbar */}
            <div className="h-10 px-3 sm:px-4 bg-[#141820] border-b border-white/10 flex items-center justify-between select-none text-xs gap-2">
                <div className="flex items-center gap-2 text-zinc-300 min-w-0">
                    <FileText className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <span className="font-medium truncate">Aditya_Ray_Resume.pdf</span>
                    <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">(Original Document)</span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    {/* View Switcher Toggle */}
                    <div className="flex items-center rounded bg-white/10 p-0.5 text-[11px] font-medium">
                        <button
                            onClick={() => setViewMode('pdf')}
                            className={`px-2 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer ${
                                viewMode === 'pdf' ? 'bg-blue-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            <Eye className="w-3 h-3" />
                            <span>PDF</span>
                        </button>
                        <button
                            onClick={() => setViewMode('html')}
                            className={`px-2 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer ${
                                viewMode === 'html' ? 'bg-blue-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            <LayoutList className="w-3 h-3" />
                            <span>Text</span>
                        </button>
                    </div>

                    {/* Download PDF button */}
                    <a
                        href="/resume.pdf"
                        download="Aditya_Ray_Resume.pdf"
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors cursor-pointer"
                        title="Download Original PDF"
                    >
                        <Download className="w-3 h-3" />
                        <span className="hidden sm:inline">Download</span>
                    </a>

                    {/* Open in new tab */}
                    <a
                        href="/resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 p-1 rounded bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                        title="Open in Browser Tab"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {/* Print button */}
                    <button
                        onClick={handlePrint}
                        className="hidden md:flex items-center gap-1 p-1 rounded bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                        title="Print Document"
                    >
                        <Printer className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Document Canvas Area */}
            <div className="flex-1 overflow-hidden relative">
                {viewMode === 'pdf' ? (
                    <div className="w-full h-full bg-[#323639]">
                        <iframe
                            src="/resume.pdf#toolbar=0"
                            className="w-full h-full border-0"
                            title="Aditya Ray Resume PDF"
                        />
                    </div>
                ) : (
                    <div className="w-full h-full overflow-y-auto p-4 sm:p-8 flex justify-center custom-scrollbar bg-[#0f131a]">
                        <div className="w-full max-w-2xl bg-[#131822] border border-white/15 shadow-2xl p-6 sm:p-10 space-y-6 text-zinc-200 rounded-sm">
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
                )}
            </div>
        </div>
    );
}

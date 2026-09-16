'use client';

import React from 'react';
import { Cpu, Zap, Code } from 'lucide-react';
import { SKILL_CATEGORIES } from '@/data/portfolioData';

// Map bright neon category colors to high-contrast rich hues for light theme text
const getCategoryHeadingColor = (color: string) => {
    switch (color.toLowerCase()) {
        case '#00f5d4': return '#0891b2'; // Rich Cyan
        case '#9d4edd': return '#7e22ce'; // Rich Purple
        case '#00b4d8': return '#0284c7'; // Rich Blue
        case '#ffaa00': return '#d97706'; // Rich Amber
        case '#ff007f': return '#be185d'; // Rich Rose
        default: return '#1e40af';
    }
};

export default function WindowsSkillsApp() {
    return (
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-7 space-y-4 sm:space-y-6 custom-scrollbar font-sans text-sm bg-[#f8fafc]">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700 border border-blue-200">
                            <Cpu className="w-4 h-4" />
                        </span>
                        <h2 className="text-base font-bold text-slate-900 tracking-wide">
                            Technical Competencies & System Matrix
                        </h2>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                        High-throughput GPU pipelines, interactive 3D WebGL architectures, and distributed real-time cloud services.
                    </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-medium">
                    <Zap className="w-3.5 h-3.5" />
                    GPU Accelerated
                </div>
            </div>

            {/* Categories */}
            <div className="space-y-6">
                {SKILL_CATEGORIES.map((cat, idx) => {
                    const headingColor = getCategoryHeadingColor(cat.color);
                    return (
                        <div key={idx} className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3
                                    className="text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                                    style={{ color: headingColor }}
                                >
                                    <Code className="w-3.5 h-3.5" />
                                    {cat.title}
                                </h3>
                                <span className="text-[11px] text-slate-500 font-mono">
                                    {cat.skills.length} Technologies
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {cat.skills.map((skill) => (
                                    <div
                                        key={skill.name}
                                        className="p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-blue-400/60 transition-all space-y-2 shadow-sm"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-base">{skill.icon}</span>
                                                <span className="text-xs font-bold text-slate-900">
                                                    {skill.name}
                                                </span>
                                            </div>
                                            <span className="text-xs font-mono font-bold" style={{ color: headingColor }}>
                                                {skill.level}%
                                            </span>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${skill.level}%`,
                                                    backgroundColor: headingColor,
                                                }}
                                            />
                                        </div>

                                        {/* Highlight Tag */}
                                        {skill.highlight && (
                                            <div className="text-[10px] text-slate-500 font-mono">
                                                {skill.highlight}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

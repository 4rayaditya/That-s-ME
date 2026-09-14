'use client';

import React from 'react';
import { Cpu, Zap, Code, ShieldCheck } from 'lucide-react';
import { SKILL_CATEGORIES } from '@/data/portfolioData';

export default function WindowsSkillsApp() {
    return (
        <div className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-7 custom-scrollbar font-sans text-sm">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                            <Cpu className="w-4 h-4" />
                        </span>
                        <h2 className="text-base font-bold text-white tracking-wide">
                            Technical Competencies & System Matrix
                        </h2>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">
                        High-throughput GPU pipelines, interactive 3D WebGL architectures, and distributed real-time cloud services.
                    </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                    <Zap className="w-3.5 h-3.5" />
                    GPU Accelerated
                </div>
            </div>

            {/* Categories */}
            <div className="space-y-6">
                {SKILL_CATEGORIES.map((cat, idx) => (
                    <div key={idx} className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3
                                className="text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                                style={{ color: cat.color }}
                            >
                                <Code className="w-3.5 h-3.5" />
                                {cat.title}
                            </h3>
                            <span className="text-[11px] text-zinc-400 font-mono">
                                {cat.skills.length} Technologies
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {cat.skills.map((skill) => (
                                <div
                                    key={skill.name}
                                    className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all space-y-2 shadow-sm"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-base">{skill.icon}</span>
                                            <span className="text-xs font-bold text-white">
                                                {skill.name}
                                            </span>
                                        </div>
                                        <span className="text-xs font-mono font-bold" style={{ color: cat.color }}>
                                            {skill.level}%
                                        </span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{
                                                width: `${skill.level}%`,
                                                backgroundColor: cat.color,
                                                boxShadow: `0 0 8px ${cat.color}88`,
                                            }}
                                        />
                                    </div>

                                    {/* Highlight Tag */}
                                    {skill.highlight && (
                                        <div className="text-[10px] text-zinc-400 font-mono">
                                            {skill.highlight}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

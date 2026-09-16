'use client';

import React from 'react';
import { Briefcase, Calendar, MapPin, Award, CheckCircle2, Building } from 'lucide-react';
import { EXPERIENCES, EDUCATION_CERTS } from '@/data/portfolioData';

export default function WindowsExperienceApp() {
    return (
        <div className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-7 custom-scrollbar font-sans text-sm">
            {/* Header Banner */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            <Briefcase className="w-4 h-4" />
                        </span>
                        <h2 className="text-base font-bold text-white tracking-wide">
                            Career Trajectory & Experience
                        </h2>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">
                        Proven history in architecting high-traffic WebGL systems and distributed full-stack cloud platforms.
                    </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Open for Select Opportunities
                </div>
            </div>

            {/* Experience Timeline */}
            <div className="space-y-4">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <Building className="w-3.5 h-3.5" />
                    Professional Work History
                </div>

                <div className="space-y-4">
                    {EXPERIENCES.map((exp) => (
                        <div
                            key={exp.id}
                            className="p-5 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 hover:border-amber-400/40 transition-all space-y-3 group shadow-lg"
                        >
                            {/* Role & Company Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <div>
                                    <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                                        {exp.role}
                                    </h3>
                                    <span className="text-xs text-cyan-400 font-medium">
                                        {exp.company}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3 text-zinc-400" />
                                        {exp.period}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3 text-zinc-400" />
                                        {exp.location}
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-xs text-zinc-300 leading-relaxed">
                                {exp.description}
                            </p>

                            {/* Achievements */}
                            <div className="space-y-1.5 pt-1">
                                {exp.achievements.map((ach, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-xs text-zinc-400">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                        <span>{ach}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Tech Stack Pills */}
                            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                                {exp.technologies.map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-white/[0.05] border border-white/10 text-zinc-300"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Education & Certifications */}
            <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-3.5 h-3.5" />
                    Verified Credentials & Certifications
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {EDUCATION_CERTS.map((cert, idx) => (
                        <div
                            key={idx}
                            className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-cyan-400/40 transition-colors space-y-1.5 shadow-md"
                        >
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                                {cert.badge}
                            </span>
                            <div className="text-xs font-bold text-white leading-tight">
                                {cert.degree}
                            </div>
                            <div className="text-[11px] text-zinc-400">
                                {cert.institution}
                            </div>
                            <div className="text-[10px] text-zinc-400 font-mono">
                                {cert.year}
                            </div>
                            <p className="text-[11px] text-zinc-400 leading-snug pt-1">
                                {cert.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

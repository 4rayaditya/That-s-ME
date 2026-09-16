'use client';

import React from 'react';
import { Briefcase, Calendar, MapPin, Award, CheckCircle2, Building } from 'lucide-react';
import { EXPERIENCES, EDUCATION_CERTS } from '@/data/portfolioData';

export default function WindowsExperienceApp() {
    return (
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-7 space-y-4 sm:space-y-7 custom-scrollbar font-sans text-sm bg-[#f8fafc]">
            {/* Header Banner */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700 border border-blue-200">
                            <Briefcase className="w-4 h-4" />
                        </span>
                        <h2 className="text-base font-bold text-slate-900 tracking-wide">
                            Career Trajectory & Experience
                        </h2>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                        Proven history in architecting high-traffic WebGL systems and distributed full-stack cloud platforms.
                    </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs font-mono font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Open for Select Opportunities
                </div>
            </div>

            {/* Experience Timeline */}
            <div className="space-y-4">
                <div className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-2">
                    <Building className="w-3.5 h-3.5" />
                    Professional Work History
                </div>

                <div className="space-y-4">
                    {EXPERIENCES.map((exp) => (
                        <div
                            key={exp.id}
                            className="p-5 rounded-xl bg-white hover:bg-slate-50/80 border border-slate-200/90 hover:border-blue-400/60 transition-all space-y-3 group shadow-sm"
                        >
                            {/* Role & Company Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                                        {exp.role}
                                    </h3>
                                    <span className="text-xs text-blue-600 font-semibold">
                                        {exp.company}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3 text-slate-400" />
                                        {exp.period}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3 text-slate-400" />
                                        {exp.location}
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-xs text-slate-700 leading-relaxed">
                                {exp.description}
                            </p>

                            {/* Achievements */}
                            <div className="space-y-1.5 pt-1">
                                {exp.achievements.map((ach, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                        <span>{ach}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Tech Stack Pills */}
                            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                                {exp.technologies.map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-100 border border-slate-200 text-slate-700 font-medium"
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
                <div className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-3.5 h-3.5" />
                    Verified Credentials & Certifications
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {EDUCATION_CERTS.map((cert, idx) => (
                        <div
                            key={idx}
                            className="p-4 rounded-xl bg-white border border-slate-200/90 hover:border-blue-400/60 transition-colors space-y-1.5 shadow-sm"
                        >
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 border border-blue-200 text-blue-700">
                                {cert.badge}
                            </span>
                            <div className="text-xs font-bold text-slate-900 leading-tight">
                                {cert.degree}
                            </div>
                            <div className="text-[11px] text-slate-600">
                                {cert.institution}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                                {cert.year}
                            </div>
                            <p className="text-[11px] text-slate-600 leading-snug pt-1">
                                {cert.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

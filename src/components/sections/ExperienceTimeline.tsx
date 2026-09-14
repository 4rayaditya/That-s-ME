'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, CheckCircle2, Award, GraduationCap, Sparkles } from 'lucide-react';
import { EXPERIENCES, EDUCATION_CERTS } from '@/data/portfolioData';
import TiltCard from '@/components/ui/TiltCard';

export default function ExperienceTimeline() {
    return (
        <section id="journey" className="relative py-24 px-4 sm:px-6 max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-semibold bg-brand-blue/15 text-brand-blue border border-brand-blue/30 mb-3">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>CAREER TRAJECTORY</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                    Experience & <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-purple">Milestones</span>
                </h2>
                <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
                    A track record of engineering scalable platforms, mentoring talent, and pioneering 3D web standards.
                </p>
            </div>

            {/* Experience List */}
            <div className="relative border-l-2 border-white/10 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-12">
                {EXPERIENCES.map((exp, idx) => (
                    <motion.div
                        key={exp.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.15 }}
                        className="relative"
                    >
                        {/* Glowing Node on Timeline */}
                        <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-space-950 border-2 border-brand-cyan shadow-[0_0_12px_#00f5d4]" />

                        <div className="p-6 sm:p-8 rounded-2xl bg-space-900/80 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                            {/* Role and Company */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <h3 className="text-lg sm:text-xl font-bold text-white">
                                        {exp.role}
                                    </h3>
                                    <span className="text-sm font-semibold text-brand-cyan font-mono">
                                        {exp.company}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                                        {exp.period}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                                        {exp.location}
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="mt-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                                {exp.description}
                            </p>

                            {/* Key Achievements */}
                            <div className="mt-4 space-y-2">
                                {exp.achievements.map((item, aIdx) => (
                                    <div key={aIdx} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-400">
                                        <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Tech Stack Pills */}
                            <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap gap-1.5">
                                {exp.technologies.map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-white/[0.04] border border-white/5 text-zinc-300"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Certifications & Education Section */}
            <div className="mt-20">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-brand-purple/15 text-brand-purple border border-brand-purple/30 mb-2">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>HONORS & CREDENTIALS</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white">
                        Degrees & Certifications
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {EDUCATION_CERTS.map((item, idx) => (
                        <TiltCard
                            key={idx}
                            className="bg-space-900/80 border border-white/10 p-6 flex flex-col justify-between shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
                        >
                            <div>
                                <div className="flex items-center justify-between gap-2">
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-brand-cyan/15 border border-brand-cyan/30 text-brand-cyan">
                                        {item.badge}
                                    </span>
                                    <span className="text-xs font-mono text-zinc-400">{item.year}</span>
                                </div>
                                <h4 className="mt-3 text-base font-bold text-white leading-snug">
                                    {item.degree}
                                </h4>
                                <div className="text-xs font-mono text-brand-purple mt-1">
                                    {item.institution}
                                </div>
                                <p className="mt-3 text-xs text-zinc-400 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </TiltCard>
                    ))}
                </div>
            </div>
        </section>
    );
}

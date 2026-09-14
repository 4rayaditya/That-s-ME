'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Cpu, Layers, Terminal, Award } from 'lucide-react';
import { SKILL_CATEGORIES } from '@/data/portfolioData';
import TiltCard from '@/components/ui/TiltCard';

export default function SkillsMatrix() {
    return (
        <section id="skills" className="relative py-24 px-4 sm:px-6 max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-semibold bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 mb-3">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>TECHNICAL COMPETENCY</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                    Skills & <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple">Capabilities</span>
                </h2>
                <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
                    Full-spectrum engineering stack ranging from real-time GPU pipelines to distributed event-driven microservices.
                </p>
            </div>

            {/* 3 Column Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {SKILL_CATEGORIES.map((category, catIdx) => (
                    <TiltCard
                        key={category.title}
                        className="bg-space-900/80 border border-white/10 p-6 sm:p-7 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                    >
                        <div>
                            {/* Category Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-white/5">
                                <h3 className="text-base font-bold text-white tracking-wide">
                                    {category.title}
                                </h3>
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{
                                        backgroundColor: category.color,
                                        boxShadow: `0 0 10px ${category.color}`,
                                    }}
                                />
                            </div>

                            {/* Skills List */}
                            <div className="mt-6 space-y-5">
                                {category.skills.map((skill, sIdx) => (
                                    <div key={skill.name} className="space-y-1.5">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="flex items-center gap-2 font-medium text-zinc-200">
                                                <span>{skill.icon}</span>
                                                <span>{skill.name}</span>
                                            </span>
                                            <span className="font-mono text-zinc-400 font-bold">
                                                {skill.level}%
                                            </span>
                                        </div>

                                        {/* Progress Track */}
                                        <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${skill.level}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1.2, delay: sIdx * 0.1, ease: 'easeOut' }}
                                                className="h-full rounded-full"
                                                style={{
                                                    background: `linear-gradient(90deg, ${category.color}88, ${category.color})`,
                                                    boxShadow: `0 0 8px ${category.color}66`,
                                                }}
                                            />
                                        </div>

                                        {/* Specialization tag */}
                                        {skill.highlight && (
                                            <div className="text-[10px] font-mono text-zinc-400 text-right">
                                                {skill.highlight}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Card Footer Badge */}
                        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                            <span>TIER-1 PROFICIENCY</span>
                            <span className="text-brand-cyan">PRODUCTION VERIFIED</span>
                        </div>
                    </TiltCard>
                ))}
            </div>
        </section>
    );
}

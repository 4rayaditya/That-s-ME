'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Layers, ArrowUpRight, Sparkles, Eye } from 'lucide-react';
import TiltCard from '@/components/ui/TiltCard';
import ProjectModal from '@/components/ui/ProjectModal';
import { PROJECTS, Project } from '@/data/portfolioData';
import { audio } from '@/lib/audio';

type CategoryFilter = 'all' | '3d' | 'fullstack' | 'systems';

export default function ProjectsSection() {
    const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const filteredProjects = PROJECTS.filter((p) => {
        if (activeFilter === 'all') return true;
        return p.category === activeFilter;
    });

    const handleFilterChange = (filter: CategoryFilter) => {
        audio.playClick();
        setActiveFilter(filter);
    };

    const handleProjectOpen = (project: Project) => {
        audio.playModal();
        setSelectedProject(project);
    };

    return (
        <section id="projects" className="relative py-24 px-4 sm:px-6 max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-14">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-semibold bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>FLAGSHIP ARCHITECTURES</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                    Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple">Creations</span>
                </h2>
                <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
                    Exploration of hardware-accelerated 3D graphics, high-scale telemetry pipelines, and immersive virtual environments.
                </p>

                {/* Filter Pills */}
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                    {[
                        { id: 'all', label: 'All Works' },
                        { id: '3d', label: '3D & WebGL' },
                        { id: 'fullstack', label: 'Full-Stack Web' },
                        { id: 'systems', label: 'Systems & Shaders' },
                    ].map((filter) => {
                        const isActive = activeFilter === filter.id;
                        return (
                            <button
                                key={filter.id}
                                onClick={() => handleFilterChange(filter.id as CategoryFilter)}
                                onMouseEnter={() => audio.playHover()}
                                className={`px-4 py-2 rounded-xl text-xs font-mono transition-all duration-200 ${
                                    isActive
                                        ? 'bg-brand-cyan text-space-950 font-bold shadow-[0_0_20px_rgba(0,245,212,0.4)]'
                                        : 'bg-white/[0.04] border border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                                }`}
                            >
                                {filter.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Projects Grid */}
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <AnimatePresence>
                    {filteredProjects.map((project) => (
                        <motion.div
                            layout
                            key={project.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                        >
                            <TiltCard
                                onClick={() => handleProjectOpen(project)}
                                className="group cursor-pointer bg-space-900/80 border border-white/10 overflow-hidden flex flex-col justify-between shadow-[0_10px_35px_rgba(0,0,0,0.6)] hover:border-brand-cyan/40 transition-colors"
                            >
                                <div>
                                    {/* Thumbnail Image Banner */}
                                    <div className="relative h-56 sm:h-64 w-full overflow-hidden">
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-space-900 via-space-900/30 to-transparent" />

                                        {/* Metric Badge Overlay */}
                                        <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-space-950/80 backdrop-blur-md border border-white/10 text-brand-cyan shadow-md">
                                            {project.metrics[0].value} {project.metrics[0].label}
                                        </div>

                                        {/* Category Badge */}
                                        <div className="absolute bottom-3 left-4 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-medium bg-white/10 backdrop-blur-md border border-white/15 text-zinc-200">
                                            {project.categoryLabel}
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-6">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="text-xl font-bold text-white group-hover:text-brand-cyan transition-colors">
                                                {project.title}
                                            </h3>
                                            <div className="p-2 rounded-lg bg-white/[0.04] text-zinc-400 group-hover:text-brand-cyan group-hover:bg-brand-cyan/10 transition-colors shrink-0">
                                                <Eye className="w-4 h-4" />
                                            </div>
                                        </div>

                                        <p className="mt-1 text-xs font-mono text-zinc-400">
                                            {project.subtitle}
                                        </p>

                                        <p className="mt-3 text-xs sm:text-sm text-zinc-300 line-clamp-2 leading-relaxed">
                                            {project.description}
                                        </p>

                                        {/* Tech Tags */}
                                        <div className="mt-4 flex flex-wrap gap-1.5">
                                            {project.tags.slice(0, 4).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-white/[0.04] border border-white/5 text-zinc-400"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                            {project.tags.length > 4 && (
                                                <span className="px-2 py-0.5 rounded-md text-[11px] font-mono text-zinc-500">
                                                    +{project.tags.length - 4}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Link Bar */}
                                <div className="px-6 py-3.5 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-xs">
                                    <span className="text-brand-cyan font-mono flex items-center gap-1 group-hover:underline">
                                        Inspect Deep-Dive Specs
                                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </span>
                                    <span className="font-mono text-zinc-400">{project.year}</span>
                                </div>
                            </TiltCard>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* In-Depth Project Detail Modal */}
            <ProjectModal
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
            />
        </section>
    );
}

'use client';

import dynamic from 'next/dynamic';
import { Suspense, useMemo } from 'react';
import { useAppStore } from '@/store/appStore';
import { useJourneyStore } from '@/store/journeyStore';
import { ProjectDetailPanel } from '@/components/ui/ProjectDetailPanel';
import type { Project } from '@/types';
import projectsData from '@/data/projects.json';

// Lazy load 3D scene
const ProjectsScene = dynamic(() => import('./ProjectsScene'), {
    ssr: false,
    loading: () => (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="mt-4 text-gray-400">Loading projects...</p>
            </div>
        </div>
    ),
});

export default function Projects() {
    const deviceType = useAppStore((state) => state.deviceType);
    const performanceTier = useAppStore((state) => state.performanceTier);
    const setSelectedProject = useAppStore((state) => state.setSelectedProject);
    const setProjectDetailOpen = useAppStore((state) => state.setProjectDetailOpen);
    const { interactiveMode, toggleInteractiveMode } = useJourneyStore();

    const projects = useMemo(() => projectsData as Project[], []);

    // Render 2D fallback for low-end devices
    const shouldRender3D = performanceTier.tier !== 'low';

    const handleProjectClick = (projectId: string) => {
        setSelectedProject(projectId);
        setProjectDetailOpen(true);
    };

    return (
        <section id="projects" className="relative min-h-screen w-full py-20 bg-black">
            {/* Section Header */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 mb-12">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Featured <span className="text-primary-400">Projects</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl">
                            {shouldRender3D
                                ? '🎮 Explore in 3D • Click projects or portals to navigate'
                                : 'Click on any project to learn more.'
                            }
                        </p>
                    </div>

                    {/* Interactive Mode Toggle */}
                    {shouldRender3D && (
                        <button
                            onClick={toggleInteractiveMode}
                            className="px-4 py-2 bg-black/80 backdrop-blur-lg rounded-lg border border-primary-500/30 text-white hover:bg-primary-500/20 transition-colors"
                        >
                            {interactiveMode ? '🎮 Interactive' : '👁️ Orbit'}
                        </button>
                    )}
                </div>
            </div>

            {/* 3D Scene or 2D Grid */}
            {shouldRender3D ? (
                <div className="absolute inset-0">
                    <Suspense fallback={null}>
                        <ProjectsScene projects={projects} />
                    </Suspense>
                </div>
            ) : (
                /* 2D Fallback Grid */
                <div className="relative z-10 max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                onClick={() => handleProjectClick(project.id)}
                                className="bg-gray-900 rounded-lg overflow-hidden cursor-pointer hover:transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-primary-500/20"
                            >
                                {/* Thumbnail */}
                                <div className="aspect-video bg-gray-800 relative">
                                    {project.thumbnail && (
                                        <img
                                            src={project.thumbnail}
                                            alt={project.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    )}
                                    {project.featured && (
                                        <span className="absolute top-3 right-3 px-3 py-1 bg-primary-500 text-white text-xs font-semibold rounded-full">
                                            Featured
                                        </span>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                        {project.description}
                                    </p>

                                    {/* Tech Stack */}
                                    <div className="flex flex-wrap gap-2">
                                        {project.techStack.slice(0, 3).map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                        {project.techStack.length > 3 && (
                                            <span className="px-2 py-1 text-primary-400 text-xs">
                                                +{project.techStack.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Project Detail Panel */}
            <ProjectDetailPanel projects={projects} />
        </section>
    );
}

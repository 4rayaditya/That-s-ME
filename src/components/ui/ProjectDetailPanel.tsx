'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/cn';
import type { Project } from '@/types';
import gsap from 'gsap';

interface ProjectDetailPanelProps {
    projects: Project[];
}

export function ProjectDetailPanel({ projects }: ProjectDetailPanelProps) {
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);
    const isOpen = useAppStore((state) => state.isProjectDetailOpen);
    const setProjectDetailOpen = useAppStore((state) => state.setProjectDetailOpen);
    const panelRef = useRef<HTMLDivElement>(null);

    const project = projects.find((p) => p.id === selectedProjectId);

    useEffect(() => {
        if (!panelRef.current) return;

        if (isOpen) {
            gsap.to(panelRef.current, {
                x: 0,
                duration: 0.4,
                ease: 'power2.out',
            });
        } else {
            gsap.to(panelRef.current, {
                x: '100%',
                duration: 0.4,
                ease: 'power2.in',
            });
        }
    }, [isOpen]);

    if (!project) return null;

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
                    onClick={() => setProjectDetailOpen(false)}
                />
            )}

            {/* Panel */}
            <div
                ref={panelRef}
                className={cn(
                    'fixed top-0 right-0 h-full w-full md:w-[600px] bg-gray-900 z-50 shadow-2xl',
                    'transform translate-x-full overflow-y-auto'
                )}
            >
                {/* Close button */}
                <button
                    onClick={() => setProjectDetailOpen(false)}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
                    aria-label="Close"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <h2 className="text-3xl font-bold text-white">{project.title}</h2>
                            {project.year && (
                                <span className="px-3 py-1 bg-primary-500/20 text-primary-400 text-sm rounded-full">
                                    {project.year}
                                </span>
                            )}
                        </div>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            {project.longDescription || project.description}
                        </p>
                    </div>

                    {/* Tech Stack */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-white mb-4">Tech Stack</h3>
                        <div className="flex flex-wrap gap-2">
                            {project.techStack.map((tech) => (
                                <span
                                    key={tech}
                                    className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Thumbnail */}
                    {project.thumbnail && (
                        <div className="mb-8">
                            <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                                <img
                                    src={project.thumbnail}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {project.liveDemoUrl && (
                            <a
                                href={project.liveDemoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors text-center"
                            >
                                View Live Demo
                            </a>
                        )}
                        {project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors text-center flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                                </svg>
                                View on GitHub
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

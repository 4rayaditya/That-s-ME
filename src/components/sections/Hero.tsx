'use client';

import dynamic from 'next/dynamic';
import { Suspense, useMemo } from 'react';
import { useAppStore } from '@/store/appStore';
import { SpaceSceneWrapper } from '@/components/scenes/SpaceSceneWrapper';
import projectsData from '@/data/projects.json';
import type { Project } from '@/types';

export default function Hero() {
    const performanceTier = useAppStore((state) => state.performanceTier);
    const projects = useMemo(() => projectsData as Project[], []);

    // Render 2D fallback for low-end devices
    const shouldRender3D = performanceTier.tier !== 'low';

    return (
        <section className="relative h-screen w-full overflow-hidden bg-black">
            {/* 3D Space Scene */}
            {shouldRender3D ? (
                <div className="absolute inset-0">
                    <Suspense fallback={
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
                            <div className="text-center">
                                <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
                                <p className="mt-4 text-gray-400">Initializing Spaceship...</p>
                            </div>
                        </div>
                    }>
                        <SpaceSceneWrapper projects={projects} />
                    </Suspense>
                </div>
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.1),transparent_50%)]" />
                    <div className="relative z-10 flex items-center justify-center h-full">
                        <div className="text-center px-4">
                            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                                Welcome to the <span className="text-cyan-400">Universe</span>
                            </h1>
                            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                                Explore my portfolio through an immersive 3D space journey
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Welcome Message (fades out) */}
            {shouldRender3D && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center pointer-events-none animate-fade-in">
                    <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 drop-shadow-2xl">
                        <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                            Space Portfolio
                        </span>
                    </h1>
                    <p className="text-2xl text-gray-300 mb-2">
                        Welcome, Commander
                    </p>
                    <p className="text-lg text-cyan-400 animate-pulse">
                        Click anywhere to begin your journey
                    </p>
                </div>
            )}
        </section>
    );
}

'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { useAppStore } from '@/store/appStore';

// Lazy load 3D scene
const HeroScene = dynamic(() => import('./HeroScene'), {
    ssr: false,
    loading: () => (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="mt-4 text-gray-400">Loading experience...</p>
            </div>
        </div>
    ),
});

export default function Hero() {
    const deviceType = useAppStore((state) => state.deviceType);
    const performanceTier = useAppStore((state) => state.performanceTier);

    // Render 2D fallback for low-end devices
    const shouldRender3D = performanceTier.tier !== 'low' && deviceType !== 'mobile';

    return (
        <section className="relative h-screen w-full overflow-hidden">
            {/* 3D Background */}
            {shouldRender3D && (
                <div className="absolute inset-0">
                    <Suspense fallback={null}>
                        <HeroScene />
                    </Suspense>
                </div>
            )}

            {/* 2D Fallback Background */}
            {!shouldRender3D && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.1),transparent_50%)]" />
                </div>
            )}

            {/* Content Overlay */}
            <div className="relative z-10 flex items-center justify-center h-full px-4">
                <div className="text-center animate-fade-in">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6">
                        <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                            Your Name
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Senior Frontend Engineer specializing in{' '}
                        <span className="text-primary-400 font-semibold">
                            high-performance 3D web experiences
                        </span>
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            onClick={() => {
                                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="px-8 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/50"
                        >
                            View Projects
                        </button>
                        <a
                            href="#contact"
                            className="px-8 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors backdrop-blur-sm"
                        >
                            Get in Touch
                        </a>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <div className="flex flex-col items-center gap-2 text-gray-400">
                    <span className="text-sm">Scroll</span>
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                    </svg>
                </div>
            </div>
        </section>
    );
}

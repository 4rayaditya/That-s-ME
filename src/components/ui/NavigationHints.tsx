'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

export function NavigationHints() {
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        const hasSeenHints = localStorage.getItem('hasSeenNavigationHints');
        if (hasSeenHints) {
            setDismissed(true);
        }
    }, []);

    const handleDismiss = () => {
        setDismissed(true);
        localStorage.setItem('hasSeenNavigationHints', 'true');
    };

    if (dismissed) return null;

    return (
        <div className="fixed bottom-6 left-6 z-30 animate-fade-in">
            <div className="bg-black/80 backdrop-blur-lg rounded-2xl p-6 border border-primary-500/30 shadow-xl max-w-sm">
                <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Navigation Controls</h3>
                    <button
                        onClick={handleDismiss}
                        className="text-gray-400 hover:text-white transition-colors"
                        aria-label="Dismiss"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-3">
                    {/* WASD */}
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                            <kbd className="px-2 py-1 bg-gray-700 rounded text-xs font-mono">W</kbd>
                            <kbd className="px-2 py-1 bg-gray-700 rounded text-xs font-mono">A</kbd>
                            <kbd className="px-2 py-1 bg-gray-700 rounded text-xs font-mono">S</kbd>
                            <kbd className="px-2 py-1 bg-gray-700 rounded text-xs font-mono">D</kbd>
                        </div>
                        <span className="text-sm text-gray-300">Move around</span>
                    </div>

                    {/* Arrow Keys */}
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                            <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">↑</kbd>
                            <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">←</kbd>
                            <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">↓</kbd>
                            <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">→</kbd>
                        </div>
                        <span className="text-sm text-gray-300">Alternative movement</span>
                    </div>

                    {/* Mouse */}
                    <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-gray-700 rounded text-xs">
                            🖱️ Mouse
                        </div>
                        <span className="text-sm text-gray-300">Look around & interact</span>
                    </div>

                    {/* Scroll */}
                    <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-gray-700 rounded text-xs">
                            Scroll
                        </div>
                        <span className="text-sm text-gray-300">Traditional navigation</span>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-xs text-primary-400">
                        💡 Click on portals to travel between sections
                    </p>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { useUniverseStore } from '@/store/universeStore';

export function SpaceHUD() {
    const { currentSection, exitGalaxy, galaxiesDiscovered, toggleCockpit, showCockpit } = useUniverseStore();
    const [showHints, setShowHints] = useState(true);

    useEffect(() => {
        // Hide hints after 10 seconds
        const timer = setTimeout(() => setShowHints(false), 10000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-50">
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-6 flex items-start justify-between">
                {/* Current Location */}
                <div className="bg-black/60 backdrop-blur-md border border-cyan-500/30 rounded-lg px-6 py-3 pointer-events-auto">
                    <div className="text-cyan-400 text-sm font-mono mb-1">LOCATION</div>
                    <div className="text-white text-xl font-bold">
                        {currentSection === 'universe' ? 'Open Space' : currentSection.toUpperCase()}
                    </div>
                </div>

                {/* Galaxies Discovered */}
                <div className="bg-black/60 backdrop-blur-md border border-cyan-500/30 rounded-lg px-6 py-3">
                    <div className="text-cyan-400 text-sm font-mono mb-1">DISCOVERED</div>
                    <div className="text-white text-2xl font-bold">{galaxiesDiscovered.size} / 6</div>
                </div>
            </div>

            {/* Navigation Hints */}
            {showHints && (
                <div className="absolute top-1/2 left-8 transform -translate-y-1/2 bg-black/80 backdrop-blur-lg border border-cyan-500/40 rounded-lg p-6 max-w-xs pointer-events-auto">
                    <button
                        onClick={() => setShowHints(false)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                    >
                        ✕
                    </button>
                    <h3 className="text-cyan-400 text-lg font-bold mb-4 flex items-center">
                        <span className="mr-2">🚀</span> Flight Controls
                    </h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center">
                            <kbd className="px-3 py-1 bg-gray-800 border border-gray-600 rounded mr-3 font-mono">W A S D</kbd>
                            <span className="text-gray-300">Navigate</span>
                        </div>
                        <div className="flex items-center">
                            <kbd className="px-3 py-1 bg-gray-800 border border-gray-600 rounded mr-3 font-mono">MOUSE</kbd>
                            <span className="text-gray-300">Look around (click to lock)</span>
                        </div>
                        <div className="flex items-center">
                            <kbd className="px-3 py-1 bg-gray-800 border border-gray-600 rounded mr-3 font-mono">SPACE</kbd>
                            <span className="text-gray-300">Ascend</span>
                        </div>
                        <div className="flex items-center">
                            <kbd className="px-3 py-1 bg-gray-800 border border-gray-600 rounded mr-3 font-mono">SHIFT</kbd>
                            <span className="text-gray-300">Descend</span>
                        </div>
                        <div className="flex items-center">
                            <kbd className="px-3 py-1 bg-gray-800 border border-gray-600 rounded mr-3 font-mono">CLICK</kbd>
                            <span className="text-gray-300">Enter Galaxy</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Controls */}
            <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-4">
                {/* Exit Galaxy Button */}
                {currentSection !== 'universe' && (
                    <button
                        onClick={exitGalaxy}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg shadow-cyan-500/50 transition-all pointer-events-auto transform hover:scale-105"
                    >
                        ← EXIT GALAXY
                    </button>
                )}

                {/* Toggle Cockpit */}
                <button
                    onClick={toggleCockpit}
                    className="bg-black/60 backdrop-blur-md border border-cyan-500/30 hover:border-cyan-500/60 text-white px-6 py-4 rounded-lg font-semibold transition-all pointer-events-auto"
                >
                    {showCockpit ? '👁️ Hide Cockpit' : '🚀 Show Cockpit'}
                </button>

                {/* Show/Hide Hints */}
                <button
                    onClick={() => setShowHints(!showHints)}
                    className="bg-black/60 backdrop-blur-md border border-cyan-500/30 hover:border-cyan-500/60 text-white px-6 py-4 rounded-lg font-semibold transition-all pointer-events-auto"
                >
                    {showHints ? '📖 Hide Guide' : '❓ Show Guide'}
                </button>
            </div>

            {/* Minimap */}
            <div className="absolute bottom-8 right-8 w-48 h-48 bg-black/80 backdrop-blur-lg border border-cyan-500/40 rounded-lg p-4 pointer-events-auto">
                <div className="text-cyan-400 text-xs font-mono mb-2 text-center">STAR MAP</div>
                <div className="relative w-full h-full">
                    {/* Center (you) */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />

                    {/* Galaxy indicators */}
                    <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full" title="Home" />
                    <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-purple-400 rounded-full" title="Projects" />
                    <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-green-400 rounded-full" title="About" />
                    <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-orange-400 rounded-full" title="Skills" />
                    <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-red-400 rounded-full" title="Contact" />
                </div>
            </div>

            {/* Crosshair (center) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative w-8 h-8">
                    <div className="absolute top-1/2 left-0 w-2 h-px bg-cyan-400" />
                    <div className="absolute top-1/2 right-0 w-2 h-px bg-cyan-400" />
                    <div className="absolute left-1/2 top-0 w-px h-2 bg-cyan-400" />
                    <div className="absolute left-1/2 bottom-0 w-px h-2 bg-cyan-400" />
                </div>
            </div>
        </div>
    );
}

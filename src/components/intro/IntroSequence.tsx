'use client';

import { useState, useEffect } from 'react';

interface IntroSequenceProps {
    onComplete: () => void;
}

export function IntroSequence({ onComplete }: IntroSequenceProps) {
    const [stage, setStage] = useState<'dashboard' | 'mission' | 'launching' | 'complete'>('dashboard');
    const [progress, setProgress] = useState(0);
    const [distance, setDistance] = useState(0);
    const [showMissionPopup, setShowMissionPopup] = useState(false);

    useEffect(() => {
        // Dashboard loading animation
        if (stage === 'dashboard') {
            // Progress animation
            const progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(progressInterval);
                        setTimeout(() => setShowMissionPopup(true), 500);
                        return 100;
                    }
                    return prev + 2;
                });
            }, 50);

            // Distance counter
            const distanceInterval = setInterval(() => {
                setDistance(prev => {
                    if (prev >= 149600000) return 149600000; // Earth to Sun distance in km
                    return prev + 2500000;
                });
            }, 100);

            return () => {
                clearInterval(progressInterval);
                clearInterval(distanceInterval);
            };
        }
    }, [stage]);

    const handleAcceptMission = () => {
        setShowMissionPopup(false);
        setStage('launching');
        setTimeout(() => {
            setStage('complete');
            onComplete();
        }, 3000);
    };

    if (stage === 'complete') return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black">
            {/* Dashboard Loading Screen - 4 Panels */}
            {stage === 'dashboard' && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-blue-900">
                    {/* Animated grid background */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)',
                            backgroundSize: '50px 50px'
                        }} />
                    </div>

                    {/* Top Bar */}
                    <div className="absolute top-0 left-0 right-0 bg-cyan-500/20 border-b-2 border-cyan-500 px-6 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                            <span className="text-cyan-400 font-mono font-bold tracking-wider">SPACECRAFT CONTROL SYSTEM v3.7</span>
                        </div>
                        <div className="text-cyan-400 font-mono text-sm">
                            STATUS: <span className="text-green-400">INITIALIZING</span>
                        </div>
                    </div>

                    {/* 4 Panel Grid */}
                    <div className="absolute inset-0 top-16 grid grid-cols-2 grid-rows-2 gap-4 p-6">

                        {/* Panel 1: Current Position */}
                        <div className="border-2 border-cyan-500/50 bg-black/60 backdrop-blur-sm rounded-lg p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
                            <h3 className="text-cyan-400 font-mono font-bold text-xl mb-4 flex items-center gap-2">
                                <span className="text-2xl">📍</span> CURRENT POSITION
                            </h3>
                            <div className="space-y-3 font-mono">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">SYSTEM:</span>
                                    <span className="text-white font-bold">SOL</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">PLANET:</span>
                                    <span className="text-green-400 font-bold">EARTH</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">SECTOR:</span>
                                    <span className="text-cyan-400">ORION ARM</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">COORDINATES:</span>
                                    <span className="text-yellow-400 text-sm">39.8°N 77.1°W</span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-cyan-500/30">
                                    <div className="text-xs text-gray-500 mb-2">ORBITAL STATUS</div>
                                    <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-green-400 to-cyan-400 animate-pulse" style={{ width: `${progress}%` }}></div>
                                    </div>
                                    <div className="text-right text-cyan-400 text-xs mt-1">{progress}%</div>
                                </div>
                            </div>
                        </div>

                        {/* Panel 2: Distance from Earth */}
                        <div className="border-2 border-purple-500/50 bg-black/60 backdrop-blur-sm rounded-lg p-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
                            <h3 className="text-purple-400 font-mono font-bold text-xl mb-4 flex items-center gap-2">
                                <span className="text-2xl">🌍</span> DISTANCE TRACKER
                            </h3>
                            <div className="space-y-4 font-mono">
                                <div>
                                    <div className="text-gray-400 text-sm mb-2">FROM EARTH SURFACE</div>
                                    <div className="text-4xl font-bold text-white mb-1">
                                        {distance.toLocaleString()}
                                    </div>
                                    <div className="text-purple-400 text-sm">KILOMETERS</div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-purple-500/30">
                                    <div>
                                        <div className="text-gray-500 text-xs">TO MOON</div>
                                        <div className="text-cyan-400 font-bold">384,400 km</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 text-xs">TO MARS</div>
                                        <div className="text-orange-400 font-bold">225M km</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 text-xs">TO SUN</div>
                                        <div className="text-yellow-400 font-bold">149.6M km</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 text-xs">SPEED</div>
                                        <div className="text-green-400 font-bold animate-pulse">107,000 km/h</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Panel 3: Next Nearest Galaxy */}
                        <div className="border-2 border-green-500/50 bg-black/60 backdrop-blur-sm rounded-lg p-6 relative overflow-hidden">
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
                            <h3 className="text-green-400 font-mono font-bold text-xl mb-4 flex items-center gap-2">
                                <span className="text-2xl">🌌</span> NEAREST GALAXIES
                            </h3>
                            <div className="space-y-3 font-mono text-sm">
                                <div className="border border-cyan-500/30 rounded p-3 bg-cyan-500/5">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-cyan-400 font-bold">ANDROMEDA</span>
                                        <span className="text-xs text-green-400">APPROACHING</span>
                                    </div>
                                    <div className="text-gray-400 text-xs">2.537M light-years away</div>
                                </div>
                                <div className="border border-purple-500/30 rounded p-3 bg-purple-500/5">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-purple-400 font-bold">TRIANGULUM</span>
                                        <span className="text-xs text-gray-500">STABLE</span>
                                    </div>
                                    <div className="text-gray-400 text-xs">3M light-years away</div>
                                </div>
                                <div className="border border-yellow-500/30 rounded p-3 bg-yellow-500/5">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-yellow-400 font-bold">GALAXY RAY</span>
                                        <span className="text-xs text-red-400 animate-pulse">UNKNOWN</span>
                                    </div>
                                    <div className="text-gray-400 text-xs">??? light-years away</div>
                                </div>
                            </div>
                        </div>

                        {/* Panel 4: System Status & Radar */}
                        <div className="border-2 border-blue-500/50 bg-black/60 backdrop-blur-sm rounded-lg p-6 relative overflow-hidden">
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
                            <h3 className="text-blue-400 font-mono font-bold text-xl mb-4 flex items-center gap-2">
                                <span className="text-2xl">📡</span> SYSTEM STATUS
                            </h3>
                            <div className="space-y-3 font-mono text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">NAVIGATION</span>
                                    <span className="text-green-400 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        ONLINE
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">LIFE SUPPORT</span>
                                    <span className="text-green-400 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        ACTIVE
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">SHIELDS</span>
                                    <span className="text-cyan-400 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                                        CHARGED
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">FUEL</span>
                                    <span className="text-yellow-400">87%</span>
                                </div>

                                {/* Mini Radar */}
                                <div className="mt-4 pt-4 border-t border-blue-500/30">
                                    <div className="text-xs text-gray-500 mb-2">DEEP SPACE RADAR</div>
                                    <div className="relative w-full aspect-square border border-blue-500/50 rounded-full bg-blue-900/20">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                        </div>
                                        {/* Radar sweep */}
                                        <div className="absolute inset-0 rounded-full" style={{
                                            background: 'conic-gradient(from 0deg, transparent 0deg, rgba(0, 255, 255, 0.3) 60deg, transparent 120deg)',
                                            animation: 'spin 4s linear infinite'
                                        }}></div>
                                        {/* Detected objects */}
                                        <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
                                        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
                                        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mission Popup */}
                    {showMissionPopup && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center animate-fade-in">
                            <div className="max-w-2xl w-full mx-4 border-2 border-cyan-500 bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden shadow-2xl shadow-cyan-500/50">
                                <div className="bg-cyan-500 px-6 py-3 flex items-center justify-between">
                                    <span className="text-black font-mono font-bold text-lg">INCOMING TRANSMISSION</span>
                                    <div className="flex gap-1">
                                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                    </div>
                                </div>

                                <div className="p-8 space-y-6">
                                    <div className="text-center space-y-2">
                                        <div className="text-yellow-400 font-mono text-sm">⚠ PRIORITY ALPHA ⚠</div>
                                        <h2 className="text-3xl font-bold text-cyan-400">MISSION BRIEFING</h2>
                                        <div className="h-1 w-24 bg-cyan-500 mx-auto"></div>
                                    </div>

                                    <div className="space-y-4 font-mono text-gray-300">
                                        <p className="text-cyan-400">
                                            &gt; Commander, we have detected an anomaly in deep space.
                                        </p>
                                        <p>
                                            A mysterious galaxy designated <span className="text-yellow-400 font-bold">"RAY"</span> has appeared on our long-range sensors. Its energy signature is unlike anything we've encountered.
                                        </p>
                                        <p>
                                            Your mission: Navigate through uncharted space, explore multiple galactic sectors, and investigate the source of this phenomenon.
                                        </p>
                                        <p className="text-red-400">
                                            &gt; This is a <span className="font-bold">one-way journey</span>. Once you depart, there is no turning back.
                                        </p>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            onClick={handleAcceptMission}
                                            className="flex-1 bg-green-500 hover:bg-green-600 text-black font-bold py-4 rounded-lg transition-all hover:scale-105 font-mono text-lg shadow-lg shadow-green-500/50"
                                        >
                                            &gt; ACCEPT MISSION
                                        </button>
                                        <button
                                            onClick={() => setShowMissionPopup(false)}
                                            className="flex-1 bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500 text-red-400 font-bold py-4 rounded-lg transition-all font-mono text-lg"
                                        >
                                            DECLINE
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Launching Sequence */}
            {stage === 'launching' && (
                <div className="absolute inset-0 bg-black flex items-center justify-center animate-fade-in">
                    <div className="text-center space-y-6">
                        <div className="text-6xl font-bold text-cyan-400 mb-4 animate-pulse">
                            MISSION ACCEPTED
                        </div>
                        <div className="font-mono text-green-400 space-y-2">
                            <p>&gt; Initializing FPV systems...</p>
                            <p>&gt; Engaging quantum drives...</p>
                            <p>&gt; Plotting course to Galaxy RAY...</p>
                        </div>
                        <div className="w-64 mx-auto bg-gray-800 rounded-full h-3 overflow-hidden border-2 border-cyan-500">
                            <div className="h-full bg-gradient-to-r from-cyan-500 to-green-500 animate-progress"></div>
                        </div>
                        <p className="text-yellow-400 font-mono text-xl animate-pulse">LAUNCHING...</p>
                    </div>
                </div>
            )}
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';

interface IntroSequenceProps {
    onComplete: () => void;
}

export function IntroSequence({ onComplete }: IntroSequenceProps) {
    const [stage, setStage] = useState<'dashboard' | 'launching' | 'complete'>('dashboard');
    const [progress, setProgress] = useState(0);
    const [showMissionReady, setShowMissionReady] = useState(false);

    // Spaceship systems
    const [oxygen, setOxygen] = useState(98.5);
    const [power, setPower] = useState(87.3);
    const [battery, setBattery] = useState(92.1);
    const [fuel, setFuel] = useState(76.8);
    const [altitude, setAltitude] = useState(408);
    const [velocity, setVelocity] = useState(27600);
    const [distance, setDistance] = useState(0);

    // Scanner detections - asteroids, satellites, debris
    const [detections, setDetections] = useState([
        { id: 1, name: 'ISS', distance: 420, type: 'station', angle: 45 },
        { id: 2, name: 'HUBBLE', distance: 547, type: 'satellite', angle: 120 },
        { id: 3, name: 'AST-2401', distance: 389, type: 'asteroid', angle: 200 },
        { id: 4, name: 'GPS-III', distance: 820, type: 'satellite', angle: 290 },
        { id: 5, name: 'DEBRIS-A7', distance: 1100, type: 'debris', angle: 15 },
        { id: 6, name: 'AST-9812', distance: 650, type: 'asteroid', angle: 180 },
        { id: 7, name: 'TIANGONG', distance: 395, type: 'station', angle: 330 },
        { id: 8, name: 'AST-5521', distance: 890, type: 'asteroid', angle: 75 },
    ]);

    const [scanAngle, setScanAngle] = useState(0);

    useEffect(() => {
        if (stage === 'dashboard') {
            // System initialization progress
            const progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(progressInterval);
                        setTimeout(() => setShowMissionReady(true), 1000);
                        return 100;
                    }
                    return prev + 2;
                });
            }, 100);

            // System fluctuations (realistic small changes)
            const systemsInterval = setInterval(() => {
                setOxygen(prev => Math.max(95, Math.min(100, prev + Math.random() * 0.4 - 0.2)));
                setPower(prev => Math.max(80, Math.min(95, prev + Math.random() * 2 - 1)));
                setBattery(prev => Math.max(85, Math.min(98, prev + Math.random() * 1 - 0.5)));
                setFuel(prev => Math.max(70, Math.min(80, prev + Math.random() * 0.5 - 0.25)));
                setAltitude(prev => prev + Math.random() * 2 - 1);
                setVelocity(prev => prev + Math.random() * 50 - 25);
                setDistance(prev => prev + Math.random() * 10);
            }, 800);

            // Scanner sweep animation
            const scanInterval = setInterval(() => {
                setScanAngle(prev => (prev + 3) % 360);
            }, 50);

            // Objects movement on scanner
            const detectionInterval = setInterval(() => {
                setDetections(prev => prev.map(d => ({
                    ...d,
                    angle: (d.angle + Math.random() * 2 - 1) % 360,
                    distance: Math.max(300, Math.min(1200, d.distance + Math.random() * 15 - 7.5))
                })));
            }, 1500);

            return () => {
                clearInterval(progressInterval);
                clearInterval(systemsInterval);
                clearInterval(scanInterval);
                clearInterval(detectionInterval);
            };
        }
    }, [stage]);

    const handleLaunch = () => {
        setShowMissionReady(false);
        setStage('launching');
        setTimeout(() => {
            setStage('complete');
            onComplete();
        }, 3000);
    };

    const handleDecline = () => {
        setShowMissionReady(false);
    };

    if (stage === 'complete') return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black font-mono">
            {stage === 'dashboard' && (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
                    {/* Animated grid background */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'linear-gradient(rgba(0, 200, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 200, 255, 0.3) 1px, transparent 1px)',
                            backgroundSize: '40px 40px'
                        }} />
                    </div>

                    {/* Corner brackets */}
                    <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-cyan-400/50"></div>
                    <div className="absolute top-0 right-0 w-24 h-24 border-r-2 border-t-2 border-cyan-400/50"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 border-l-2 border-b-2 border-cyan-400/50"></div>
                    <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 border-cyan-400/50"></div>

                    {/* Top status bar */}
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/20 to-cyan-500/10 border-b border-cyan-400/50 px-8 py-3 backdrop-blur-sm z-20">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50"></div>
                                    <span className="text-cyan-300 font-bold tracking-widest text-sm">
                                        NASA SPACECRAFT CONTROL SYSTEM v4.2
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 text-xs">
                                <div className="text-gray-400">DATE: <span className="text-cyan-300">{new Date().toLocaleDateString()}</span></div>
                                <div className="text-gray-400">TIME: <span className="text-green-300">{new Date().toLocaleTimeString()}</span></div>
                                <div className="text-gray-400">STATUS: <span className="text-green-400 font-bold animate-pulse">ONLINE</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Main content area - 3 columns */}
                    <div className="absolute inset-0 top-14 bottom-16 flex gap-4 p-4">

                        {/* LEFT - Personal & Mission Info */}
                        <div className="w-72 space-y-3 overflow-y-auto">
                            {/* Personal Info */}
                            <div className="border border-cyan-400/30 bg-black/40 backdrop-blur-sm p-4">
                                <div className="text-cyan-300 font-bold text-xs mb-3 pb-2 border-b border-cyan-400/30">
                                    COMMANDER PROFILE
                                </div>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">NAME:</span>
                                        <span className="text-white">ADITYA NARAYAN RAY</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">RANK:</span>
                                        <span className="text-cyan-300">COMMANDER</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">ID:</span>
                                        <span className="text-green-300">NASA-{Math.floor(Math.random() * 9999)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">CLEARANCE:</span>
                                        <span className="text-yellow-300">ALPHA-1</span>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="border border-blue-400/30 bg-black/40 backdrop-blur-sm p-4">
                                <div className="text-blue-300 font-bold text-xs mb-3 pb-2 border-b border-blue-400/30">
                                    NAVIGATION SYSTEMS
                                </div>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">ALTITUDE:</span>
                                        <span className="text-cyan-300">{altitude.toFixed(1)} km</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">VELOCITY:</span>
                                        <span className="text-green-300">{velocity.toLocaleString()} km/h</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">DISTANCE:</span>
                                        <span className="text-yellow-300">{distance.toFixed(1)} km</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">HEADING:</span>
                                        <span className="text-purple-300">{Math.floor(scanAngle)}°</span>
                                    </div>
                                </div>
                            </div>

                            {/* Communications */}
                            <div className="border border-green-400/30 bg-black/40 backdrop-blur-sm p-4">
                                <div className="text-green-300 font-bold text-xs mb-3 pb-2 border-b border-green-400/30">
                                    COMMUNICATIONS
                                </div>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">GROUND LINK:</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                                            <span className="text-green-300">STRONG</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">SIGNAL:</span>
                                        <span className="text-cyan-300">95.8 dB</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">LATENCY:</span>
                                        <span className="text-yellow-300">1.28s</span>
                                    </div>
                                </div>
                            </div>

                            {/* Environmental */}
                            <div className="border border-cyan-400/30 bg-black/40 backdrop-blur-sm p-4">
                                <div className="text-cyan-300 font-bold text-xs mb-3 pb-2 border-b border-cyan-400/30">
                                    ENVIRONMENTAL CONTROL
                                </div>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">TEMP:</span>
                                        <span className="text-cyan-300">22.5°C</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">PRESSURE:</span>
                                        <span className="text-green-300">101.3 kPa</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">HUMIDITY:</span>
                                        <span className="text-blue-300">45%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">CO₂:</span>
                                        <span className="text-green-300">0.04%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CENTER - Circular Scanner */}
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <div className="relative w-full max-w-xl aspect-square">
                                {/* Scanner container */}
                                <div className="absolute inset-0 rounded-full border-2 border-cyan-400/50 bg-gradient-radial from-cyan-500/5 via-blue-500/10 to-transparent shadow-2xl shadow-cyan-500/20">

                                    {/* Concentric circles */}
                                    <div className="absolute inset-[15%] border border-cyan-400/20 rounded-full"></div>
                                    <div className="absolute inset-[30%] border border-cyan-400/20 rounded-full"></div>
                                    <div className="absolute inset-[45%] border border-cyan-400/30 rounded-full"></div>

                                    {/* Cross hairs */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
                                        <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent"></div>
                                    </div>

                                    {/* Center dot (spacecraft) */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="relative">
                                            <div className="w-4 h-4 bg-green-400 rounded-full shadow-lg shadow-green-400/50 animate-pulse"></div>
                                            <div className="absolute inset-0 w-4 h-4 bg-green-400/30 rounded-full animate-ping"></div>
                                        </div>
                                    </div>

                                    {/* Radar sweep */}
                                    <div className="absolute inset-0 rounded-full overflow-hidden">
                                        <div
                                            className="absolute inset-0 rounded-full"
                                            style={{
                                                background: 'conic-gradient(from 0deg, transparent 0deg, rgba(0, 255, 255, 0.3) 30deg, transparent 60deg)',
                                                transform: `rotate(${scanAngle}deg)`,
                                                transition: 'transform 0.05s linear'
                                            }}
                                        />
                                    </div>

                                    {/* Detected objects as triangles */}
                                    {detections.map((detection) => {
                                        const radius = (detection.distance / 1500) * 48;
                                        const angleRad = (detection.angle * Math.PI) / 180;
                                        const x = 50 + radius * Math.cos(angleRad - Math.PI / 2);
                                        const y = 50 + radius * Math.sin(angleRad - Math.PI / 2);

                                        let borderColor = 'border-cyan-400';
                                        let shadowColor = 'shadow-cyan-400/70';

                                        if (detection.type === 'satellite') {
                                            borderColor = 'border-blue-400';
                                            shadowColor = 'shadow-blue-400/70';
                                        } else if (detection.type === 'debris' || detection.type === 'asteroid') {
                                            borderColor = 'border-red-400';
                                            shadowColor = 'shadow-red-400/70';
                                        }

                                        return (
                                            <div
                                                key={detection.id}
                                                className="absolute"
                                                style={{
                                                    left: `${x}%`,
                                                    top: `${y}%`,
                                                    transform: 'translate(-50%, -50%)'
                                                }}
                                            >
                                                <div className="relative group">
                                                    {/* Triangle shape */}
                                                    <div
                                                        className={`w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent ${borderColor} drop-shadow-lg ${shadowColor} animate-pulse`}
                                                        style={{
                                                            filter: 'drop-shadow(0 0 4px currentColor)'
                                                        }}
                                                    ></div>
                                                    {/* Tooltip */}
                                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/95 border border-cyan-400/50 rounded px-2 py-1 whitespace-nowrap pointer-events-none z-10 text-[10px]">
                                                        <div className="text-cyan-300 font-bold">{detection.name}</div>
                                                        <div className="text-gray-400">{Math.round(detection.distance)} km</div>
                                                        <div className="text-gray-500 uppercase">{detection.type}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Scanner label */}
                                    <div className="absolute -bottom-8 left-0 right-0 text-center">
                                        <div className="text-cyan-300 font-bold text-sm">PROXIMITY SCANNER</div>
                                        <div className="text-gray-400 text-xs">RANGE: 1,500 km</div>
                                    </div>
                                </div>
                            </div>

                            {/* Detection list below scanner */}
                            <div className="mt-12 w-full max-w-xl bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent backdrop-blur-sm border-y border-cyan-400/30 p-3">
                                <div className="text-cyan-300 text-[10px] font-bold mb-2 text-center tracking-wider">DETECTED OBJECTS</div>
                                <div className="grid grid-cols-4 gap-2">
                                    {detections.map((detection) => (
                                        <div
                                            key={detection.id}
                                            className="bg-black/40 border border-cyan-400/30 rounded px-2 py-1 text-[10px] text-center"
                                        >
                                            <div className="text-cyan-300 font-bold truncate">{detection.name}</div>
                                            <div className="text-gray-400">{Math.round(detection.distance)}km</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT - Systems Status */}
                        <div className="w-72 space-y-3 overflow-y-auto">
                            {/* Oxygen */}
                            <div className="border border-blue-400/30 bg-black/40 backdrop-blur-sm p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="text-blue-300 font-bold text-xs">OXYGEN</div>
                                    <div className="text-xl font-bold text-cyan-300">{oxygen.toFixed(1)}%</div>
                                </div>
                                <div className="w-full bg-gray-800/50 h-1.5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-500"
                                        style={{ width: `${oxygen}%` }}
                                    ></div>
                                </div>
                                <div className="text-[10px] text-green-400 mt-1">OPTIMAL</div>
                            </div>

                            {/* Power */}
                            <div className="border border-yellow-400/30 bg-black/40 backdrop-blur-sm p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="text-yellow-300 font-bold text-xs">POWER</div>
                                    <div className="text-xl font-bold text-yellow-300">{power.toFixed(1)}%</div>
                                </div>
                                <div className="w-full bg-gray-800/50 h-1.5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-500"
                                        style={{ width: `${power}%` }}
                                    ></div>
                                </div>
                                <div className="text-[10px] text-green-400 mt-1">STABLE</div>
                            </div>

                            {/* Battery */}
                            <div className="border border-green-400/30 bg-black/40 backdrop-blur-sm p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="text-green-300 font-bold text-xs">BATTERY</div>
                                    <div className="text-xl font-bold text-green-300">{battery.toFixed(1)}%</div>
                                </div>
                                <div className="w-full bg-gray-800/50 h-1.5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-green-400 to-emerald-400 transition-all duration-500"
                                        style={{ width: `${battery}%` }}
                                    ></div>
                                </div>
                                <div className="text-[10px] text-green-400 mt-1">CHARGING</div>
                            </div>

                            {/* Fuel */}
                            <div className="border border-purple-400/30 bg-black/40 backdrop-blur-sm p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="text-purple-300 font-bold text-xs">FUEL</div>
                                    <div className="text-xl font-bold text-purple-300">{fuel.toFixed(1)}%</div>
                                </div>
                                <div className="w-full bg-gray-800/50 h-1.5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-500"
                                        style={{ width: `${fuel}%` }}
                                    ></div>
                                </div>
                                <div className="text-[10px] text-yellow-400 mt-1">SUFFICIENT</div>
                            </div>

                            {/* Thrust Systems */}
                            <div className="border border-red-400/30 bg-black/40 backdrop-blur-sm p-4">
                                <div className="text-red-300 font-bold text-xs mb-3 pb-2 border-b border-red-400/30">
                                    THRUST SYSTEMS
                                </div>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">MAIN ENGINE:</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                                            <span className="text-green-300">READY</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">RCS:</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                                            <span className="text-green-300">ACTIVE</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">THROTTLE:</span>
                                        <span className="text-yellow-300">0%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Life Support */}
                            <div className="border border-cyan-400/30 bg-black/40 backdrop-blur-sm p-4">
                                <div className="text-cyan-300 font-bold text-xs mb-3 pb-2 border-b border-cyan-400/30">
                                    LIFE SUPPORT
                                </div>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">STATUS:</span>
                                        <span className="text-green-300">NOMINAL</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">SCRUBBERS:</span>
                                        <span className="text-cyan-300">100%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">WATER:</span>
                                        <span className="text-blue-300">89.2%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom status bar */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/20 to-cyan-500/10 border-t border-cyan-400/50 px-8 py-3 backdrop-blur-sm z-20">
                        <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-400">
                                {progress < 100 ? (
                                    <span className="text-cyan-300">&gt; INITIALIZING SYSTEMS...</span>
                                ) : (
                                    <span className="text-green-400 animate-pulse">&gt; ALL SYSTEMS NOMINAL - READY FOR LAUNCH</span>
                                )}
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-[10px] text-gray-400">SYSTEM INITIALIZATION:</div>
                                <div className="w-64 bg-gray-800/50 h-1.5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-cyan-400 via-blue-400 to-green-400 transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                                <div className="text-cyan-300 font-bold text-xs min-w-[3rem]">{progress}%</div>
                            </div>
                        </div>
                    </div>

                    {/* Mission Ready Popup */}
                    {showMissionReady && (
                        <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50">
                            <div className="max-w-3xl w-full mx-4 border-2 border-cyan-400 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 shadow-2xl shadow-cyan-500/50">
                                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 flex items-center justify-between">
                                    <span className="text-white font-bold text-lg tracking-wider">MISSION CONTROL</span>
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>

                                <div className="p-10 space-y-6">
                                    <div className="text-center space-y-3">
                                        <div className="text-green-400 text-sm tracking-widest animate-pulse">ALL SYSTEMS OPERATIONAL</div>
                                        <h2 className="text-4xl font-bold text-cyan-300 tracking-wide">MISSION BRIEFING</h2>
                                        <div className="h-px w-32 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto"></div>
                                    </div>

                                    <div className="space-y-4 text-gray-300 leading-relaxed text-sm">
                                        <p className="text-cyan-300">
                                            <span className="text-yellow-400">◆</span> Commander, all spacecraft systems are nominal.
                                        </p>
                                        <p>
                                            You are cleared for departure to explore the uncharted regions of deep space. Your mission is to navigate through various galactic sectors and investigate anomalous readings.
                                        </p>
                                        <p className="text-yellow-300">
                                            <span className="text-red-400">WARNING:</span> This is an exploratory mission. Maintain awareness of your surroundings and monitor all ship systems.
                                        </p>
                                        <p className="text-green-300">
                                            <span className="text-cyan-400">READY:</span> Flight systems ready. Awaiting your command to proceed.
                                        </p>
                                    </div>

                                    <div className="flex gap-4 pt-6">
                                        <button
                                            onClick={handleLaunch}
                                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 transition-all hover:scale-105 text-lg shadow-lg shadow-green-500/50 border border-green-400/50"
                                        >
                                            LAUNCH MISSION
                                        </button>
                                        <button
                                            onClick={handleDecline}
                                            className="flex-1 bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500 text-red-400 font-bold py-4 transition-all text-lg"
                                        >
                                            DECLINE
                                        </button>
                                    </div>

                                    <div className="text-center text-[10px] text-gray-500 pt-4">
                                        Press LAUNCH to begin your journey or DECLINE to review systems
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Launching Sequence */}
            {stage === 'launching' && (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
                    <div className="text-center space-y-8 px-8">
                        <div className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-green-400 mb-8 animate-pulse">
                            MISSION ACCEPTED
                        </div>

                        <div className="bg-black/40 border border-cyan-400/50 backdrop-blur-sm max-w-2xl p-8">
                            <div className="text-left space-y-3 text-sm">
                                <p className="text-green-400">&gt; <span className="animate-pulse">█</span> ALL SYSTEMS GO</p>
                                <p className="text-cyan-300">&gt; Initializing flight control systems...</p>
                                <p className="text-blue-300">&gt; Engaging primary thrusters...</p>
                                <p className="text-purple-300">&gt; Activating navigation computer...</p>
                                <p className="text-yellow-300">&gt; Quantum drive online...</p>
                                <p className="text-green-300">&gt; Plotting trajectory to deep space...</p>
                                <p className="text-cyan-400 font-bold animate-pulse">&gt; LAUNCH SEQUENCE INITIATED</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="text-gray-400 text-sm">LAUNCH PROGRESS</div>
                            <div className="w-96 mx-auto bg-gray-800/50 h-3 overflow-hidden border-2 border-cyan-500 shadow-lg shadow-cyan-500/50">
                                <div className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-green-500 animate-progress"></div>
                            </div>
                            <div className="text-yellow-400 text-2xl font-bold animate-pulse">T-MINUS 3... 2... 1...</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

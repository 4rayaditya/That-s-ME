'use client';

import React, { useState, useEffect } from 'react';
import { Terminal, Cpu, HardDrive, Wifi, Clock, Music, ArrowLeft, Maximize2, Radio, BatteryCharging } from 'lucide-react';
import { audio } from '@/lib/audio';

interface TopBarProps {
    activeWorkspace: number;
    onSelectWorkspace: (ws: number) => void;
    onReturnToRoom: () => void;
    isLofiPlaying: boolean;
    onToggleLofi: () => void;
}

export default function TopBar({
    activeWorkspace,
    onSelectWorkspace,
    onReturnToRoom,
    isLofiPlaying,
    onToggleLofi,
}: TopBarProps) {
    const [time, setTime] = useState('');
    const [cpuUsage, setCpuUsage] = useState(12);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(
                now.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                })
            );
        };
        updateTime();
        const tInterval = setInterval(updateTime, 1000);

        // Fluctuate CPU usage realistically
        const cpuInterval = setInterval(() => {
            setCpuUsage(Math.floor(8 + Math.random() * 9));
        }, 3000);

        return () => {
            clearInterval(tInterval);
            clearInterval(cpuInterval);
        };
    }, []);

    const workspaces = [
        { id: 1, label: 'SYS', title: 'System & Terminal' },
        { id: 2, label: 'PRJ', title: 'Flagship Projects' },
        { id: 3, label: 'DEV', title: 'Neovim & Skills' },
        { id: 4, label: 'EXP', title: 'Journey & Timeline' },
        { id: 5, label: 'MSG', title: 'Contact Transmission' },
    ];

    return (
        <header className="h-8 sm:h-9 w-full bg-space-950/90 border-b border-white/10 backdrop-blur-xl flex items-center justify-between px-3 text-xs font-mono select-none z-40 text-zinc-300">
            {/* Left: Distro Logo & Return to Room CTA */}
            <div className="flex items-center gap-2 sm:gap-3">
                {/* Return to Room Button */}
                <button
                    onClick={onReturnToRoom}
                    onMouseEnter={() => audio.playHover()}
                    className="px-2.5 py-1 rounded-md bg-brand-cyan/20 hover:bg-brand-cyan/30 border border-brand-cyan/50 text-brand-cyan font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,245,212,0.3)] transition-all"
                    title="Return to Cyberpunk Room [ESC]"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">ROOM VIEW</span>
                    <span className="text-[10px] opacity-70">[ESC]</span>
                </button>

                {/* Arch Linux Distro Moniker */}
                <div className="hidden md:flex items-center gap-1.5 text-zinc-400 pl-2 border-l border-white/10">
                    <span className="text-brand-cyan font-bold">RayOS</span>
                    <span className="text-[11px] text-zinc-400">6.10.4-arch1-zen (Hyprland)</span>
                </div>
            </div>

            {/* Center: Hyprland Workspaces Switcher */}
            <div className="flex items-center gap-1 bg-white/[0.04] p-0.5 rounded-lg border border-white/5">
                {workspaces.map((ws) => {
                    const isActive = activeWorkspace === ws.id;
                    return (
                        <button
                            key={ws.id}
                            onClick={() => {
                                audio.playClick();
                                onSelectWorkspace(ws.id);
                            }}
                            onMouseEnter={() => audio.playHover()}
                            className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                                isActive
                                    ? 'bg-brand-cyan text-space-950 shadow-[0_0_8px_rgba(0,245,212,0.6)]'
                                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                            }`}
                            title={ws.title}
                        >
                            {ws.id}:{ws.label}
                        </button>
                    );
                })}
            </div>

            {/* Right: System Telemetry & Lofi Audio */}
            <div className="flex items-center gap-2 sm:gap-3">
                {/* Lofi Audio Player Toggle */}
                <button
                    onClick={onToggleLofi}
                    onMouseEnter={() => audio.playHover()}
                    className={`px-2 py-0.5 rounded flex items-center gap-1.5 transition-all ${
                        isLofiPlaying
                            ? 'bg-brand-purple/25 border border-brand-purple/50 text-brand-purple shadow-[0_0_10px_rgba(157,78,221,0.4)]'
                            : 'hover:bg-white/5 text-zinc-400 hover:text-zinc-200'
                    }`}
                    title={isLofiPlaying ? 'Pause Ambient Lofi Synth' : 'Play Ambient Lofi Synth'}
                >
                    <Music className={`w-3.5 h-3.5 ${isLofiPlaying ? 'animate-pulse text-brand-purple' : ''}`} />
                    <span className="hidden lg:inline text-[10px]">
                        {isLofiPlaying ? 'LOFI: CHILLWAVE' : 'LOFI OFF'}
                    </span>
                    {isLofiPlaying && (
                        <span className="flex items-end gap-0.5 h-2.5">
                            <span className="w-0.5 h-2.5 bg-brand-purple animate-pulse" />
                            <span className="w-0.5 h-1.5 bg-brand-purple animate-pulse delay-75" />
                            <span className="w-0.5 h-2 bg-brand-purple animate-pulse delay-150" />
                        </span>
                    )}
                </button>

                {/* Telemetry Stats */}
                <div className="hidden lg:flex items-center gap-2 text-[11px] text-zinc-400 pl-2 border-l border-white/10">
                    <span className="flex items-center gap-1">
                        <Cpu className="w-3 h-3 text-brand-cyan" />
                        {cpuUsage}%
                    </span>
                    <span className="flex items-center gap-1">
                        <HardDrive className="w-3 h-3 text-brand-purple" />
                        4.2G/32G
                    </span>
                    <span className="flex items-center gap-1">
                        <Wifi className="w-3 h-3 text-emerald-400" />
                        1Gbps
                    </span>
                </div>

                {/* Digital Clock */}
                <div className="flex items-center gap-1.5 pl-2 border-l border-white/10 text-white font-bold tracking-wider">
                    <Clock className="w-3.5 h-3.5 text-brand-cyan" />
                    <span>{time || '00:00:00'}</span>
                </div>
            </div>
        </header>
    );
}

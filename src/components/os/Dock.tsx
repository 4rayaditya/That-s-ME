'use client';

import React from 'react';
import { Terminal, FolderGit2, Code2, Briefcase, Send, Music, ArrowLeft, Layers } from 'lucide-react';
import { audio } from '@/lib/audio';

interface DockProps {
    activeWorkspace: number;
    onSelectWorkspace: (ws: number) => void;
    onReturnToRoom: () => void;
    isLofiPlaying: boolean;
    onToggleLofi: () => void;
}

export default function Dock({
    activeWorkspace,
    onSelectWorkspace,
    onReturnToRoom,
    isLofiPlaying,
    onToggleLofi,
}: DockProps) {
    const dockItems = [
        { id: 1, label: 'Terminal / Neofetch', icon: Terminal, color: 'text-brand-cyan', bg: 'bg-brand-cyan/20' },
        { id: 2, label: 'Projects Browser', icon: FolderGit2, color: 'text-brand-blue', bg: 'bg-brand-blue/20' },
        { id: 3, label: 'Neovim / Skills & Code', icon: Code2, color: 'text-brand-purple', bg: 'bg-brand-purple/20' },
        { id: 4, label: 'Career Timeline', icon: Briefcase, color: 'text-amber-400', bg: 'bg-amber-400/20' },
        { id: 5, label: 'Contact Signal', icon: Send, color: 'text-emerald-400', bg: 'bg-emerald-400/20' },
    ];

    return (
        <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40">
            <div className="flex items-center gap-2 sm:gap-3 px-4 py-2 rounded-2xl bg-space-950/85 backdrop-blur-2xl border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
                {dockItems.map((item) => {
                    const isActive = activeWorkspace === item.id;
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                audio.playClick();
                                onSelectWorkspace(item.id);
                            }}
                            onMouseEnter={() => audio.playHover()}
                            className="relative group p-2.5 rounded-xl hover:scale-110 active:scale-95 transition-all duration-200 flex flex-col items-center"
                        >
                            <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                                    isActive
                                        ? `${item.bg} border-brand-cyan shadow-[0_0_15px_rgba(0,245,212,0.4)]`
                                        : 'bg-white/[0.04] border-white/5 group-hover:bg-white/[0.08] group-hover:border-white/20'
                                }`}
                            >
                                <Icon className={`w-5 h-5 ${item.color}`} />
                            </div>

                            {/* Active Indicator Dot */}
                            {isActive && (
                                <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-brand-cyan shadow-[0_0_6px_#00f5d4]" />
                            )}

                            {/* Tooltip */}
                            <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute -top-9 px-2.5 py-1 rounded-md bg-space-900 border border-white/10 text-[10px] font-mono text-zinc-200 whitespace-nowrap shadow-xl">
                                {item.label}
                            </span>
                        </button>
                    );
                })}

                <div className="w-[1px] h-8 bg-white/10 mx-1" />

                {/* Music Player Icon */}
                <button
                    onClick={() => {
                        audio.playClick();
                        onToggleLofi();
                    }}
                    onMouseEnter={() => audio.playHover()}
                    className="relative group p-2.5 rounded-xl hover:scale-110 active:scale-95 transition-all"
                >
                    <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                            isLofiPlaying
                                ? 'bg-brand-purple/20 border-brand-purple shadow-[0_0_15px_rgba(157,78,221,0.5)]'
                                : 'bg-white/[0.04] border-white/5'
                        }`}
                    >
                        <Music className={`w-5 h-5 ${isLofiPlaying ? 'text-brand-purple animate-pulse' : 'text-zinc-400'}`} />
                    </div>
                    <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute -top-9 px-2.5 py-1 rounded-md bg-space-900 border border-white/10 text-[10px] font-mono text-zinc-200 whitespace-nowrap shadow-xl">
                        {isLofiPlaying ? 'Pause Lofi Synth' : 'Play Lofi Synth'}
                    </span>
                </button>

                {/* Return to Room View Button */}
                <button
                    onClick={() => {
                        audio.playClick();
                        onReturnToRoom();
                    }}
                    onMouseEnter={() => audio.playHover()}
                    className="relative group p-2.5 rounded-xl hover:scale-110 active:scale-95 transition-all"
                >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand-cyan/15 border border-brand-cyan/40 hover:border-brand-cyan hover:bg-brand-cyan/25 shadow-[0_0_12px_rgba(0,245,212,0.2)]">
                        <ArrowLeft className="w-5 h-5 text-brand-cyan" />
                    </div>
                    <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity absolute -top-9 px-2.5 py-1 rounded-md bg-space-900 border border-white/10 text-[10px] font-mono text-brand-cyan whitespace-nowrap shadow-xl">
                        Return to Cyber Room [ESC]
                    </span>
                </button>
            </div>
        </div>
    );
}

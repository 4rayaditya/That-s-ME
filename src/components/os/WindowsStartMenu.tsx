'use client';

import React, { useState } from 'react';
import {
    Search,
    Power,
    Briefcase,
    FolderGit2,
    Folder,
    Cpu,
    FileText,
    Terminal,
    Code2,
    Mail,
    Award,
    Music,
    LogOut,
    RotateCcw,
} from 'lucide-react';
import { PERSONAL_INFO } from '@/data/portfolioData';
import { audio } from '@/lib/audio';
import { useIsMobile } from '@/lib/useIsMobile';

interface WindowsStartMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenApp: (appId: string) => void;
    onReturnToRoom: () => void;
}

export default function WindowsStartMenu({
    isOpen,
    onClose,
    onOpenApp,
    onReturnToRoom,
}: WindowsStartMenuProps) {
    const isMobile = useIsMobile();
    const [searchQuery, setSearchQuery] = useState('');
    const [showPowerMenu, setShowPowerMenu] = useState(false);

    if (!isOpen) return null;

    const pinnedApps = [
        { id: 'projects', label: 'Projects', icon: <FolderGit2 className="w-5 h-5 text-cyan-400" />, desc: 'Flagship Systems' },
        { id: 'experience', label: 'Experience', icon: <Briefcase className="w-5 h-5 text-amber-400" />, desc: 'Career History' },
        { id: 'skills', label: 'Skills', icon: <Cpu className="w-5 h-5 text-purple-400" />, desc: 'Tech Matrix' },
        { id: 'resume', label: 'Resume (PDF)', icon: <Award className="w-5 h-5 text-teal-400" />, desc: 'ATS Resume Document' },
        { id: 'notepad', label: 'About Me', icon: <FileText className="w-5 h-5 text-sky-400" />, desc: 'Bio & Principles' },
        { id: 'mail', label: 'Contact', icon: <Mail className="w-5 h-5 text-rose-400" />, desc: 'Send Transmission' },
        { id: 'code', label: 'Code Editor', icon: <Code2 className="w-5 h-5 text-violet-400" />, desc: 'Neovim / VSCode' },
        { id: 'terminal', label: 'Terminal', icon: <Terminal className="w-5 h-5 text-emerald-400" />, desc: 'cmd.exe' },
        { id: 'media', label: 'Music Player', icon: <Music className="w-5 h-5 text-yellow-400" />, desc: 'Lo-Fi Synthesizer' },
    ];

    const filteredApps = pinnedApps.filter((a) =>
        a.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-14 left-1/2 -translate-x-1/2 w-[95vw] max-w-[580px] h-[540px] max-h-[75vh] rounded-xl bg-[#1c1f26]/95 backdrop-blur-3xl border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_40px_rgba(0,245,212,0.1)] z-50 flex flex-col overflow-hidden text-zinc-100 font-sans select-none animate-in fade-in slide-in-from-bottom-3 duration-150"
        >
            {/* Top Search Input */}
            <div className="p-5 pb-3">
                <div className="relative">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Type here to search apps, projects, skills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus={!isMobile}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/[0.05] border border-white/10 rounded-full text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400/60 focus:bg-white/[0.08]"
                    />
                </div>
            </div>

            {/* Pinned Apps Section */}
            <div className="flex-1 overflow-y-auto px-6 py-2 custom-scrollbar">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-zinc-300">Pinned Applications</span>
                    <span className="text-[11px] text-zinc-500 font-mono">Windows 11 Ray Edition</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {filteredApps.map((app) => (
                        <button
                            key={app.id}
                            onClick={() => {
                                audio.playClick();
                                onOpenApp(app.id);
                                onClose();
                            }}
                            className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-white/[0.07] border border-transparent hover:border-white/10 transition-all cursor-pointer group"
                        >
                            <div className="p-2.5 rounded-lg bg-white/[0.04] group-hover:scale-110 group-hover:bg-white/[0.08] transition-all shadow-sm">
                                {app.icon}
                            </div>
                            <span className="text-xs font-medium text-zinc-200 mt-2 text-center truncate w-full">
                                {app.label}
                            </span>
                            <span className="text-[10px] text-zinc-500 truncate w-full text-center">
                                {app.desc}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Recommended Section */}
                <div className="mt-5 pt-4 border-t border-white/10">
                    <span className="text-xs font-bold text-zinc-300">Recommended Milestones</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        <div
                            onClick={() => {
                                audio.playClick();
                                onOpenApp('projects');
                                onClose();
                            }}
                            className="p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 flex items-center gap-2.5 cursor-pointer"
                        >
                            <FolderGit2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                            <div className="truncate">
                                <div className="text-xs font-medium text-white truncate">Sentinel AI Platform</div>
                                <div className="text-[10px] text-zinc-400">NGO Rescue • 30+ Endpoints</div>
                            </div>
                        </div>

                        <div
                            onClick={() => {
                                audio.playClick();
                                onOpenApp('experience');
                                onClose();
                            }}
                            className="p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 flex items-center gap-2.5 cursor-pointer"
                        >
                            <Briefcase className="w-4 h-4 text-amber-400 flex-shrink-0" />
                            <div className="truncate">
                                <div className="text-xs font-medium text-white truncate">Starlight Tech & Labs</div>
                                <div className="text-[10px] text-zinc-400">Senior Creative Technologist</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom User Bar with Power Button */}
            <div className="h-14 px-5 bg-black/40 border-t border-white/10 flex items-center justify-between relative">
                {/* User Profile */}
                <div
                    onClick={() => {
                        audio.playClick();
                        onOpenApp('about');
                        onClose();
                    }}
                    className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-white/[0.06] cursor-pointer transition-colors"
                >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center text-xs font-bold text-black shadow-md">
                        AR
                    </div>
                    <div>
                        <div className="text-xs font-bold text-white">{PERSONAL_INFO.name}</div>
                        <div className="text-[10px] text-zinc-400">{PERSONAL_INFO.role}</div>
                    </div>
                </div>

                {/* Power Button & Popover */}
                <div className="relative">
                    <button
                        onClick={() => {
                            audio.playClick();
                            setShowPowerMenu(!showPowerMenu);
                        }}
                        className="p-2.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        title="Power options"
                    >
                        <Power className="w-4 h-4" />
                    </button>

                    {showPowerMenu && (
                        <div className="absolute bottom-12 right-0 w-52 p-1.5 rounded-lg bg-[#22252e] border border-white/15 shadow-2xl space-y-1 z-10 text-xs">
                            <button
                                onClick={() => {
                                    audio.playWarpOut();
                                    onReturnToRoom();
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-rose-500/20 text-zinc-200 hover:text-rose-300 text-left transition-colors cursor-pointer"
                            >
                                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                                Return to 3D Room (Shut Down)
                            </button>
                            <button
                                onClick={() => {
                                    audio.playClick();
                                    setShowPowerMenu(false);
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-white/10 text-zinc-200 text-left transition-colors cursor-pointer"
                            >
                                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                                Restart Desktop Session
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import {
    Search,
    Wifi,
    Volume2,
    VolumeX,
    BatteryCharging,
    Bell,
    Briefcase,
    FolderGit2,
    Cpu,
    FileText,
    Terminal,
    Code2,
    Mail,
    Award,
    Music,
} from 'lucide-react';
import { audio } from '@/lib/audio';

// Authentic Windows 4-pane icon
const WindowsLogo = () => (
    <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
        <div className="bg-cyan-400 rounded-[1px]" />
        <div className="bg-cyan-400 rounded-[1px]" />
        <div className="bg-cyan-400 rounded-[1px]" />
        <div className="bg-cyan-400 rounded-[1px]" />
    </div>
);

interface OpenWindowInfo {
    id: string;
    title: string;
    isMinimized: boolean;
    isActive: boolean;
}

interface WindowsTaskbarProps {
    isStartMenuOpen: boolean;
    onToggleStartMenu: () => void;
    openWindows: OpenWindowInfo[];
    onTaskbarAppClick: (appId: string) => void;
    onShowDesktop: () => void;
}

export default function WindowsTaskbar({
    isStartMenuOpen,
    onToggleStartMenu,
    openWindows,
    onTaskbarAppClick,
    onShowDesktop,
}: WindowsTaskbarProps) {
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        setIsMuted(audio.getMuted());

        const updateClock = () => {
            const now = new Date();
            setCurrentTime(
                now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
            );
            setCurrentDate(
                now.toLocaleDateString([], { month: '2-digit', day: '2-digit', year: 'numeric' })
            );
        };

        updateClock();
        const timer = setInterval(updateClock, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleToggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        const muted = audio.toggleMute();
        setIsMuted(muted);
    };

    // Apps available in taskbar
    const pinnedTaskbarApps = [
        { id: 'experience', label: 'Experience', icon: <Briefcase className="w-4 h-4 text-amber-400" /> },
        { id: 'projects', label: 'Projects', icon: <FolderGit2 className="w-4 h-4 text-cyan-400" /> },
        { id: 'skills', label: 'Skills', icon: <Cpu className="w-4 h-4 text-purple-400" /> },
        { id: 'terminal', label: 'Terminal', icon: <Terminal className="w-4 h-4 text-emerald-400" /> },
        { id: 'code', label: 'Code Editor', icon: <Code2 className="w-4 h-4 text-violet-400" /> },
        { id: 'mail', label: 'Contact', icon: <Mail className="w-4 h-4 text-rose-400" /> },
        { id: 'media', label: 'Lofi Music', icon: <Music className="w-4 h-4 text-yellow-400" /> },
    ];

    return (
        <footer className="h-12 w-full bg-[#101216]/90 backdrop-blur-2xl border-t border-white/10 z-40 select-none flex items-center justify-between px-3 font-sans text-xs relative">
            {/* Left Spacer (for balance) */}
            <div className="w-32 hidden md:block" />

            {/* Center Taskbar: Windows 11 Centered App Icons */}
            <div className="flex-1 flex items-center justify-center gap-1">
                {/* 1. Windows Start Button */}
                <button
                    onClick={() => {
                        audio.playClick();
                        onToggleStartMenu();
                    }}
                    className={`p-2 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                        isStartMenuOpen
                            ? 'bg-white/15 shadow-inner'
                            : 'hover:bg-white/10'
                    }`}
                    title="Start"
                >
                    <WindowsLogo />
                </button>

                {/* 2. Taskbar Search */}
                <button
                    onClick={() => {
                        audio.playClick();
                        onToggleStartMenu();
                    }}
                    className="p-2 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                    title="Search"
                >
                    <Search className="w-4 h-4" />
                </button>

                <div className="w-[1px] h-5 bg-white/10 mx-1" />

                {/* 3. Pinned & Open Taskbar Icons */}
                {pinnedTaskbarApps.map((app) => {
                    const win = openWindows.find((w) => w.id === app.id);
                    const isOpen = Boolean(win);
                    const isActive = win?.isActive && !win?.isMinimized;

                    return (
                        <button
                            key={app.id}
                            onClick={() => {
                                audio.playClick();
                                onTaskbarAppClick(app.id);
                            }}
                            className={`relative px-2.5 py-2 rounded-lg transition-all cursor-pointer group flex flex-col items-center justify-center ${
                                isActive
                                    ? 'bg-white/15 shadow-sm'
                                    : isOpen
                                    ? 'bg-white/[0.07] hover:bg-white/10'
                                    : 'hover:bg-white/10'
                            }`}
                            title={app.label}
                        >
                            <div className="group-hover:scale-110 transition-transform">
                                {app.icon}
                            </div>

                            {/* Active running indicator pill at bottom */}
                            {isOpen && (
                                <span
                                    className={`absolute bottom-0.5 h-[3px] rounded-full transition-all ${
                                        isActive
                                            ? 'w-4 bg-cyan-400 shadow-[0_0_6px_rgba(0,245,212,0.8)]'
                                            : 'w-1.5 bg-zinc-400'
                                    }`}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Right System Tray */}
            <div className="flex items-center gap-2 text-zinc-400 text-xs">
                {/* Network & Audio & Battery cluster */}
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white/10 transition-colors">
                    <span title="Connected: CyberNet 10Gbps">
                        <Wifi className="w-3.5 h-3.5 text-zinc-300" />
                    </span>
                    <button
                        onClick={handleToggleMute}
                        className="hover:text-white transition-colors cursor-pointer"
                        title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                    >
                        {isMuted ? (
                            <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                        ) : (
                            <Volume2 className="w-3.5 h-3.5 text-zinc-300" />
                        )}
                    </button>
                    <span title="Battery: 100% (Plugged in)">
                        <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                    </span>
                </div>

                {/* Clock & Date */}
                <div
                    onClick={onToggleStartMenu}
                    className="flex flex-col items-end px-2 py-0.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                    title="Date and Time"
                >
                    <span className="text-[11px] font-medium text-zinc-200 leading-tight">
                        {currentTime || '9:15 PM'}
                    </span>
                    <span className="text-[10px] text-zinc-400 leading-tight">
                        {currentDate || '14-09-2026'}
                    </span>
                </div>

                {/* Notifications Bell */}
                <button
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                    title="Notifications"
                >
                    <Bell className="w-3.5 h-3.5 text-zinc-400 hover:text-zinc-200" />
                </button>

                {/* Show Desktop Peek strip (far right edge) */}
                <div
                    onClick={onShowDesktop}
                    className="w-1.5 h-7 border-l border-white/20 hover:bg-white/30 transition-colors cursor-pointer"
                    title="Show Desktop"
                />
            </div>
        </footer>
    );
}

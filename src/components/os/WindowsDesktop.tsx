'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Briefcase,
    FolderGit2,
    Cpu,
    FileText,
    Terminal,
    Code2,
    Mail,
    Award,
    Music,
    LogOut,
    ExternalLink,
    Maximize2,
    RefreshCw,
    Sparkles,
} from 'lucide-react';
import WindowsTaskbar from './WindowsTaskbar';
import WindowsStartMenu from './WindowsStartMenu';
import WindowsWindowFrame from './WindowsWindowFrame';
import WindowsExperienceApp from './WindowsExperienceApp';
import WindowsProjectsApp from './WindowsProjectsApp';
import WindowsSkillsApp from './WindowsSkillsApp';
import WindowsNotepadApp from './WindowsNotepadApp';
import WindowsTerminalApp from './WindowsTerminalApp';
import WindowsMailApp from './WindowsMailApp';
import WindowsResumeViewerApp from './WindowsResumeViewerApp';
import WindowsMediaApp from './WindowsMediaApp';
import CodeEditorApp from './CodeEditorApp';
import { audio } from '@/lib/audio';

interface WindowsDesktopProps {
    onReturnToRoom: () => void;
}

interface WindowState {
    id: string;
    title: string;
    icon: React.ReactNode;
    subtitle?: string;
    component: React.ReactNode;
    isMinimized: boolean;
    isMaximized: boolean;
    zIndex: number;
    initialPosition: { x: number; y: number };
    initialSize: { width: number; height: number };
}

interface DesktopIcon {
    id: string;
    name: string;
    ext?: string;
    icon: React.ReactNode;
    badgeColor: string;
}

export default function WindowsDesktop({ onReturnToRoom }: WindowsDesktopProps) {
    const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
    const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
    const [activeWindowId, setActiveWindowId] = useState<string>('experience');
    const [topZIndex, setTopZIndex] = useState(10);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean }>({
        x: 0,
        y: 0,
        visible: false,
    });

    // Selection marquee drag
    const [selectionBox, setSelectionBox] = useState<{
        startX: number;
        startY: number;
        currentX: number;
        currentY: number;
        isSelecting: boolean;
    }>({ startX: 0, startY: 0, currentX: 0, currentY: 0, isSelecting: false });

    // Desktop icons list (strictly portfolio applications, no generic "My Computer" or "Recycle Bin")
    const desktopIcons: DesktopIcon[] = [
        {
            id: 'experience',
            name: 'Experience',
            ext: '.exe',
            icon: <Briefcase className="w-8 h-8 text-amber-400" />,
            badgeColor: 'border-amber-400/40 bg-amber-500/10',
        },
        {
            id: 'projects',
            name: 'Projects',
            ext: '.exe',
            icon: <FolderGit2 className="w-8 h-8 text-cyan-400" />,
            badgeColor: 'border-cyan-400/40 bg-cyan-500/10',
        },
        {
            id: 'skills',
            name: 'Skills',
            ext: '.exe',
            icon: <Cpu className="w-8 h-8 text-purple-400" />,
            badgeColor: 'border-purple-400/40 bg-purple-500/10',
        },
        {
            id: 'about',
            name: 'About_Aditya',
            ext: '.txt',
            icon: <FileText className="w-8 h-8 text-sky-400" />,
            badgeColor: 'border-sky-400/40 bg-sky-500/10',
        },
        {
            id: 'terminal',
            name: 'cmd',
            ext: '.exe',
            icon: <Terminal className="w-8 h-8 text-emerald-400" />,
            badgeColor: 'border-emerald-400/40 bg-emerald-500/10',
        },
        {
            id: 'code',
            name: 'VSCode',
            ext: '.exe',
            icon: <Code2 className="w-8 h-8 text-violet-400" />,
            badgeColor: 'border-violet-400/40 bg-violet-500/10',
        },
        {
            id: 'mail',
            name: 'Mail',
            ext: '.exe',
            icon: <Mail className="w-8 h-8 text-rose-400" />,
            badgeColor: 'border-rose-400/40 bg-rose-500/10',
        },
        {
            id: 'resume',
            name: 'Resume',
            ext: '.pdf',
            icon: <Award className="w-8 h-8 text-teal-400" />,
            badgeColor: 'border-teal-400/40 bg-teal-500/10',
        },
        {
            id: 'media',
            name: 'Groove_Music',
            ext: '.exe',
            icon: <Music className="w-8 h-8 text-yellow-400" />,
            badgeColor: 'border-yellow-400/40 bg-yellow-500/10',
        },
        {
            id: 'return',
            name: 'Return_To_Room',
            ext: '.lnk',
            icon: <LogOut className="w-8 h-8 text-rose-400" />,
            badgeColor: 'border-rose-400/40 bg-rose-500/10',
        },
    ];

    // Windows state tracking
    const [openWindows, setOpenWindows] = useState<WindowState[]>([
        {
            id: 'experience',
            title: 'Career Experience — Aditya Ray',
            icon: <Briefcase className="w-4 h-4 text-amber-400" />,
            subtitle: 'Verified Track Record & Credentials',
            component: <WindowsExperienceApp />,
            isMinimized: false,
            isMaximized: false,
            zIndex: 10,
            initialPosition: { x: 180, y: 40 },
            initialSize: { width: 840, height: 580 },
        },
    ]);

    // Global keyboard listener (Escape returns to 3D room)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                audio.playWarpOut();
                onReturnToRoom();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onReturnToRoom]);

    // Window creation & activation helper
    const openApp = (appId: string) => {
        if (appId === 'return') {
            audio.playWarpOut();
            onReturnToRoom();
            return;
        }

        audio.playClick();
        const nextZ = topZIndex + 1;
        setTopZIndex(nextZ);
        setActiveWindowId(appId);

        // Check if window already exists in openWindows
        const existingIndex = openWindows.findIndex((w) => w.id === appId);
        if (existingIndex !== -1) {
            setOpenWindows((prev) =>
                prev.map((win) =>
                    win.id === appId
                        ? { ...win, isMinimized: false, zIndex: nextZ }
                        : win
                )
            );
            return;
        }

        // Window specs by appId
        let newWindow: WindowState;
        switch (appId) {
            case 'experience':
                newWindow = {
                    id: 'experience',
                    title: 'Career Experience — Aditya Ray',
                    icon: <Briefcase className="w-4 h-4 text-amber-400" />,
                    subtitle: 'Verified Track Record',
                    component: <WindowsExperienceApp />,
                    isMinimized: false,
                    isMaximized: false,
                    zIndex: nextZ,
                    initialPosition: { x: 160, y: 50 },
                    initialSize: { width: 840, height: 580 },
                };
                break;
            case 'projects':
                newWindow = {
                    id: 'projects',
                    title: 'Projects Explorer — Aditya Ray Flagship Systems',
                    icon: <FolderGit2 className="w-4 h-4 text-cyan-400" />,
                    subtitle: '3D WebGL & Full-Stack Projects',
                    component: <WindowsProjectsApp />,
                    isMinimized: false,
                    isMaximized: false,
                    zIndex: nextZ,
                    initialPosition: { x: 220, y: 70 },
                    initialSize: { width: 920, height: 600 },
                };
                break;
            case 'skills':
                newWindow = {
                    id: 'skills',
                    title: 'System Diagnostics // Tech Stack Matrix',
                    icon: <Cpu className="w-4 h-4 text-purple-400" />,
                    subtitle: 'GPU & Distributed Systems Capabilities',
                    component: <WindowsSkillsApp />,
                    isMinimized: false,
                    isMaximized: false,
                    zIndex: nextZ,
                    initialPosition: { x: 200, y: 60 },
                    initialSize: { width: 820, height: 560 },
                };
                break;
            case 'about':
                newWindow = {
                    id: 'about',
                    title: 'About_Aditya.txt — Notepad',
                    icon: <FileText className="w-4 h-4 text-sky-400" />,
                    subtitle: 'Aditya Ray Bio & Principles',
                    component: <WindowsNotepadApp />,
                    isMinimized: false,
                    isMaximized: false,
                    zIndex: nextZ,
                    initialPosition: { x: 250, y: 80 },
                    initialSize: { width: 720, height: 500 },
                };
                break;
            case 'terminal':
                newWindow = {
                    id: 'terminal',
                    title: 'Command Prompt — cmd.exe',
                    icon: <Terminal className="w-4 h-4 text-emerald-400" />,
                    subtitle: 'C:\\Users\\Aditya',
                    component: <WindowsTerminalApp onReturnToRoom={onReturnToRoom} />,
                    isMinimized: false,
                    isMaximized: false,
                    zIndex: nextZ,
                    initialPosition: { x: 280, y: 100 },
                    initialSize: { width: 740, height: 480 },
                };
                break;
            case 'code':
                newWindow = {
                    id: 'code',
                    title: 'VS Code — /home/aditya/portfolio',
                    icon: <Code2 className="w-4 h-4 text-violet-400" />,
                    subtitle: 'Active Workspace',
                    component: <CodeEditorApp />,
                    isMinimized: false,
                    isMaximized: false,
                    zIndex: nextZ,
                    initialPosition: { x: 240, y: 60 },
                    initialSize: { width: 880, height: 580 },
                };
                break;
            case 'mail':
                newWindow = {
                    id: 'mail',
                    title: 'Windows Mail — Contact Uplink',
                    icon: <Mail className="w-4 h-4 text-rose-400" />,
                    subtitle: 'Encrypted Transmission',
                    component: <WindowsMailApp />,
                    isMinimized: false,
                    isMaximized: false,
                    zIndex: nextZ,
                    initialPosition: { x: 260, y: 80 },
                    initialSize: { width: 760, height: 520 },
                };
                break;
            case 'resume':
                newWindow = {
                    id: 'resume',
                    title: 'Aditya_Ray_Resume.pdf — PDF Reader',
                    icon: <Award className="w-4 h-4 text-teal-400" />,
                    subtitle: 'Verified Curriculum Vitae',
                    component: <WindowsResumeViewerApp />,
                    isMinimized: false,
                    isMaximized: false,
                    zIndex: nextZ,
                    initialPosition: { x: 200, y: 40 },
                    initialSize: { width: 780, height: 620 },
                };
                break;
            case 'media':
                newWindow = {
                    id: 'media',
                    title: 'Groove Music — Lo-Fi Synthesizer',
                    icon: <Music className="w-4 h-4 text-yellow-400" />,
                    subtitle: 'Procedural Audio Stream',
                    component: <WindowsMediaApp />,
                    isMinimized: false,
                    isMaximized: false,
                    zIndex: nextZ,
                    initialPosition: { x: 320, y: 120 },
                    initialSize: { width: 500, height: 380 },
                };
                break;
            default:
                return;
        }

        setOpenWindows((prev) => [...prev, newWindow]);
    };

    const bringToFront = (id: string) => {
        const nextZ = topZIndex + 1;
        setTopZIndex(nextZ);
        setActiveWindowId(id);
        setOpenWindows((prev) =>
            prev.map((win) => (win.id === id ? { ...win, zIndex: nextZ } : win))
        );
    };

    const handleMinimize = (id: string) => {
        setOpenWindows((prev) =>
            prev.map((win) => (win.id === id ? { ...win, isMinimized: true } : win))
        );
    };

    const handleMaximizeToggle = (id: string) => {
        setOpenWindows((prev) =>
            prev.map((win) =>
                win.id === id ? { ...win, isMaximized: !win.isMaximized } : win
            )
        );
    };

    const handleClose = (id: string) => {
        setOpenWindows((prev) => prev.filter((win) => win.id !== id));
    };

    // Taskbar app click: toggles minimize / restore or focuses
    const handleTaskbarAppClick = (appId: string) => {
        const win = openWindows.find((w) => w.id === appId);
        if (!win) {
            openApp(appId);
            return;
        }

        if (win.isMinimized) {
            bringToFront(appId);
            setOpenWindows((prev) =>
                prev.map((w) => (w.id === appId ? { ...w, isMinimized: false } : w))
            );
        } else if (activeWindowId === appId) {
            handleMinimize(appId);
        } else {
            bringToFront(appId);
        }
    };

    // Show Desktop peek
    const handleShowDesktop = () => {
        audio.playClick();
        const anyVisible = openWindows.some((w) => !w.isMinimized);
        setOpenWindows((prev) =>
            prev.map((w) => ({ ...w, isMinimized: anyVisible }))
        );
    };

    // Desktop background selection box handling
    const handleDesktopMouseDown = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('.desktop-icon') || (e.target as HTMLElement).closest('.window-frame')) {
            return;
        }
        setIsStartMenuOpen(false);
        setSelectedIconId(null);
        setContextMenu({ ...contextMenu, visible: false });

        setSelectionBox({
            startX: e.clientX,
            startY: e.clientY,
            currentX: e.clientX,
            currentY: e.clientY,
            isSelecting: true,
        });
    };

    const handleDesktopMouseMove = (e: React.MouseEvent) => {
        if (!selectionBox.isSelecting) return;
        setSelectionBox((prev) => ({
            ...prev,
            currentX: e.clientX,
            currentY: e.clientY,
        }));
    };

    const handleDesktopMouseUp = () => {
        if (selectionBox.isSelecting) {
            setSelectionBox((prev) => ({ ...prev, isSelecting: false }));
        }
    };

    // Right-click context menu
    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setContextMenu({
            x: Math.min(e.clientX, window.innerWidth - 220),
            y: Math.min(e.clientY, window.innerHeight - 260),
            visible: true,
        });
    };

    // Selection marquee dimensions
    const selectLeft = Math.min(selectionBox.startX, selectionBox.currentX);
    const selectTop = Math.min(selectionBox.startY, selectionBox.currentY);
    const selectWidth = Math.abs(selectionBox.currentX - selectionBox.startX);
    const selectHeight = Math.abs(selectionBox.currentY - selectionBox.startY);

    return (
        <div
            onMouseDown={handleDesktopMouseDown}
            onMouseMove={handleDesktopMouseMove}
            onMouseUp={handleDesktopMouseUp}
            onContextMenu={handleContextMenu}
            className="relative w-full h-screen overflow-hidden bg-[#07090e] select-none font-sans text-zinc-100 flex flex-col"
        >
            {/* 1. WINDOWS 11 CYBERPUNK BLOOM WALLPAPER */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Modern Windows Dark Bloom Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-gradient-to-tr from-cyan-600/20 via-blue-600/15 to-purple-600/20 blur-[150px] opacity-80" />
                <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-indigo-600/15 blur-[140px]" />

                {/* Subtle Geometric Cyber Mesh */}
                <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
                        backgroundSize: '40px 40px',
                    }}
                />
            </div>

            {/* 2. TOP FLOATING QUICK RETURN BUTTON */}
            <header className="absolute top-3 right-4 z-30 pointer-events-auto flex items-center gap-2">
                <button
                    onClick={() => {
                        audio.playWarpOut();
                        onReturnToRoom();
                    }}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-rose-500/20 border border-white/10 hover:border-rose-400/40 text-xs font-medium text-zinc-300 hover:text-rose-300 transition-all shadow-lg backdrop-blur-md cursor-pointer group"
                    title="Return to 3D Cyber Room (or press Esc)"
                >
                    <LogOut className="w-3.5 h-3.5 text-rose-400 group-hover:-translate-x-0.5 transition-transform" />
                    <span>Return to 3D Room</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-zinc-400">
                        Esc
                    </kbd>
                </button>
            </header>

            {/* 3. DESKTOP WORKSPACE & ICONS GRID (Instead of My Computer / Recycle Bin) */}
            <div className="flex-1 relative p-4 sm:p-6 overflow-hidden">
                {/* Desktop Icons Column */}
                <div className="inline-grid grid-flow-col grid-rows-6 gap-2 sm:gap-3 z-10 relative">
                    {desktopIcons.map((item) => {
                        const isSelected = selectedIconId === item.id;
                        return (
                            <div
                                key={item.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    audio.playHover();
                                    setSelectedIconId(item.id);
                                }}
                                onDoubleClick={(e) => {
                                    e.stopPropagation();
                                    openApp(item.id);
                                }}
                                className={`desktop-icon group flex flex-col items-center justify-center w-20 sm:w-22 p-2 rounded-lg border transition-all cursor-pointer ${
                                    isSelected
                                        ? 'bg-cyan-500/20 border-cyan-400/50 shadow-[0_0_15px_rgba(0,245,212,0.2)]'
                                        : 'bg-transparent border-transparent hover:bg-white/[0.07] hover:border-white/10'
                                }`}
                                title={`Open ${item.name}${item.ext || ''} (Double-click or Enter)`}
                            >
                                <div className="p-2 rounded-xl bg-black/30 group-hover:scale-110 transition-transform shadow-md">
                                    {item.icon}
                                </div>
                                <span className="text-[11px] text-zinc-200 mt-1.5 text-center font-medium leading-tight line-clamp-2 drop-shadow-md">
                                    {item.name}
                                    <span className="text-zinc-400 font-mono text-[10px] block">
                                        {item.ext}
                                    </span>
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Open Window Frames Canvas */}
                {openWindows.map((win) => (
                    <WindowsWindowFrame
                        key={win.id}
                        id={win.id}
                        title={win.title}
                        icon={win.icon}
                        subtitle={win.subtitle}
                        isActive={activeWindowId === win.id}
                        isMinimized={win.isMinimized}
                        isMaximized={win.isMaximized}
                        onFocus={() => bringToFront(win.id)}
                        onMinimize={() => handleMinimize(win.id)}
                        onMaximizeToggle={() => handleMaximizeToggle(win.id)}
                        onClose={() => handleClose(win.id)}
                        initialPosition={win.initialPosition}
                        initialSize={win.initialSize}
                    >
                        {win.component}
                    </WindowsWindowFrame>
                ))}

                {/* Selection Marquee Rectangle */}
                {selectionBox.isSelecting && (
                    <div
                        style={{
                            left: `${selectLeft}px`,
                            top: `${selectTop}px`,
                            width: `${selectWidth}px`,
                            height: `${selectHeight}px`,
                        }}
                        className="absolute border border-cyan-400/70 bg-cyan-500/20 pointer-events-none z-30"
                    />
                )}
            </div>

            {/* 4. WINDOWS START MENU POPOVER */}
            <WindowsStartMenu
                isOpen={isStartMenuOpen}
                onClose={() => setIsStartMenuOpen(false)}
                onOpenApp={openApp}
                onReturnToRoom={onReturnToRoom}
            />

            {/* 5. DESKTOP RIGHT-CLICK CONTEXT MENU */}
            {contextMenu.visible && (
                <div
                    style={{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute w-56 p-1 rounded-lg bg-[#1e2129]/95 backdrop-blur-xl border border-white/15 shadow-2xl z-50 text-xs font-sans text-zinc-200 space-y-0.5 animate-in fade-in zoom-in-95 duration-100"
                >
                    <button
                        onClick={() => {
                            audio.playClick();
                            openApp('experience');
                            setContextMenu({ ...contextMenu, visible: false });
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md hover:bg-white/10 text-left transition-colors cursor-pointer"
                    >
                        <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                        Open Experience
                    </button>
                    <button
                        onClick={() => {
                            audio.playClick();
                            openApp('projects');
                            setContextMenu({ ...contextMenu, visible: false });
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md hover:bg-white/10 text-left transition-colors cursor-pointer"
                    >
                        <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
                        Open Projects Explorer
                    </button>
                    <button
                        onClick={() => {
                            audio.playClick();
                            openApp('terminal');
                            setContextMenu({ ...contextMenu, visible: false });
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md hover:bg-white/10 text-left transition-colors cursor-pointer"
                    >
                        <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                        Open Command Prompt
                    </button>
                    <div className="h-[1px] bg-white/10 my-1" />
                    <button
                        onClick={() => {
                            audio.playClick();
                            setContextMenu({ ...contextMenu, visible: false });
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md hover:bg-white/10 text-left transition-colors cursor-pointer"
                    >
                        <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
                        Refresh Desktop
                    </button>
                    <div className="h-[1px] bg-white/10 my-1" />
                    <button
                        onClick={() => {
                            audio.playWarpOut();
                            onReturnToRoom();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md hover:bg-rose-500/20 text-rose-300 text-left transition-colors cursor-pointer"
                    >
                        <LogOut className="w-3.5 h-3.5 text-rose-400" />
                        Return to 3D Room
                    </button>
                </div>
            )}

            {/* 6. WINDOWS 11 TASKBAR */}
            <WindowsTaskbar
                isStartMenuOpen={isStartMenuOpen}
                onToggleStartMenu={() => setIsStartMenuOpen(!isStartMenuOpen)}
                openWindows={openWindows.map((w) => ({
                    id: w.id,
                    title: w.title,
                    isMinimized: w.isMinimized,
                    isActive: activeWindowId === w.id,
                }))}
                onTaskbarAppClick={handleTaskbarAppClick}
                onShowDesktop={handleShowDesktop}
            />
        </div>
    );
}

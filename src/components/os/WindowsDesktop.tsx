'use client';

import React, { useState, useEffect } from 'react';
import {
    Briefcase, FolderGit2, Cpu, FileText, Terminal,
    Code2, Mail, Award, Music, LogOut, RefreshCw,
} from 'lucide-react';
import {
    Win7ComputerIcon,
    Win7UserFolderIcon,
    Win7RecycleBinIcon,
    Win7NetworkIcon,
    Win7ControlPanelIcon,
    Win7InternetExplorerIcon,
    Win7NotepadIcon,
    Win7CmdIcon,
    Win7VSCodeIcon,
    Win7PdfIcon,
    Win7MediaPlayerIcon,
    Win7ExitIcon,
} from './Win7Icons';
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
import WindowsFilesFolderApp from './WindowsFilesFolderApp';
import CodeEditorApp from './CodeEditorApp';
import { audio } from '@/lib/audio';
import { useIsMobile } from '@/lib/useIsMobile';
import { Folder } from 'lucide-react';

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
    imgSrc?: string;
}

// Win7 desktop icons — white text with drop-shadow (renders over the Bliss wallpaper)
const ICON_SIZE = 76;
const ICON_SIZE_MOBILE = 64;

export default function WindowsDesktop({ onReturnToRoom }: WindowsDesktopProps) {
    const isMobile = useIsMobile();
    const iconSize = isMobile ? ICON_SIZE_MOBILE : ICON_SIZE;
    const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
    const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
    const [activeWindowId, setActiveWindowId] = useState<string>('');
    const [topZIndex, setTopZIndex] = useState(10);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });
    const [selectionBox, setSelectionBox] = useState<{
        startX: number; startY: number; currentX: number; currentY: number; isSelecting: boolean;
    }>({ startX: 0, startY: 0, currentX: 0, currentY: 0, isSelecting: false });

    const desktopIcons: DesktopIcon[] = [
        { id: 'projects',   name: 'Projects', ext: '', icon: <Win7InternetExplorerIcon className="w-11 h-11 drop-shadow-md" /> },
        { id: 'experience', name: 'Experience', ext: '', icon: <Win7ComputerIcon className="w-11 h-11 drop-shadow-md" /> },
        { id: 'skills',     name: 'Skills', ext: '', icon: <Win7ControlPanelIcon className="w-11 h-11 drop-shadow-md" /> },
        { id: 'resume',     name: 'Resume', ext: '.pdf', icon: <Win7PdfIcon className="w-11 h-11 drop-shadow-md" /> },
        { id: 'notepad',    name: 'About Me', ext: '.txt', icon: <Win7NotepadIcon className="w-11 h-11 drop-shadow-md" /> },
        { id: 'mail',       name: 'Contact Me', ext: '', icon: <Win7NetworkIcon className="w-11 h-11 drop-shadow-md" /> },
        { id: 'code',       name: 'Code Editor', ext: '', icon: <Win7VSCodeIcon className="w-11 h-11 drop-shadow-md" /> },
        { id: 'terminal',   name: 'Terminal', ext: '.exe', icon: <Win7CmdIcon className="w-11 h-11 drop-shadow-md" /> },
        { id: 'media',      name: 'Music Player', ext: '', icon: <Win7MediaPlayerIcon className="w-11 h-11 drop-shadow-md" /> },
        { id: 'return',     name: 'Return to Room', ext: '', icon: <Win7ExitIcon className="w-11 h-11 drop-shadow-md" /> },
    ];

    const [openWindows, setOpenWindows] = useState<WindowState[]>([
        {
            id: 'media',
            title: 'Music Player — Windows Media Player',
            icon: <Win7MediaPlayerIcon className="w-4 h-4" />,
            subtitle: 'Windows Media Player',
            component: <WindowsMediaApp />,
            isMinimized: true,
            isMaximized: false,
            zIndex: 1,
            initialPosition: { x: 300, y: 100 },
            initialSize: { width: 520, height: 420 },
        },
    ]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') { audio.playWarpOut(); onReturnToRoom(); }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onReturnToRoom]);

    const openApp = (rawAppId: string) => {
        const appId = rawAppId === 'about' ? 'notepad' : rawAppId === 'files' ? 'resume' : rawAppId;
        if (appId === 'return') { audio.playWarpOut(); onReturnToRoom(); return; }
        audio.playClick();
        const nextZ = topZIndex + 1;
        setTopZIndex(nextZ);
        setActiveWindowId(appId);
        const existingIndex = openWindows.findIndex((w) => w.id === appId);
        if (existingIndex !== -1) {
            setOpenWindows((prev) => prev.map((win) => win.id === appId ? { ...win, isMinimized: false, zIndex: nextZ } : win));
            return;
        }
        let newWindow: WindowState;
        switch (appId) {
            case 'experience': newWindow = { id:'experience', title:'Career Experience — Aditya Narayan Ray', icon:<Briefcase className="w-4 h-4 text-amber-500"/>, subtitle:'Verified Track Record', component:<WindowsExperienceApp/>, isMinimized:false, isMaximized:false, zIndex:nextZ, initialPosition:{x:160,y:50}, initialSize:{width:840,height:580} }; break;
            case 'resume':
            case 'files':      newWindow = { id:'resume', title:'Resume.pdf — PDF Reader', icon:<Win7PdfIcon className="w-4 h-4 text-teal-400"/>, subtitle:'Aditya Narayan Ray (ATS-Optimized)', component:<WindowsResumeViewerApp/>, isMinimized:false, isMaximized:false, zIndex:nextZ, initialPosition:{x:190,y:40}, initialSize:{width:840,height:640} }; break;
            case 'projects':   newWindow = { id:'projects', title:'Projects Explorer — Aditya Narayan Ray Flagship Systems', icon:<FolderGit2 className="w-4 h-4 text-cyan-500"/>, subtitle:'Full-Stack & Systems Projects', component:<WindowsProjectsApp/>, isMinimized:false, isMaximized:false, zIndex:nextZ, initialPosition:{x:220,y:70}, initialSize:{width:920,height:600} }; break;
            case 'skills':     newWindow = { id:'skills', title:'System Diagnostics // Tech Stack Matrix', icon:<Cpu className="w-4 h-4 text-purple-500"/>, subtitle:'Backend, Systems & Algorithms', component:<WindowsSkillsApp/>, isMinimized:false, isMaximized:false, zIndex:nextZ, initialPosition:{x:200,y:60}, initialSize:{width:820,height:560} }; break;
            case 'about':
            case 'notepad':    newWindow = { id:'notepad', title:'About_Aditya.txt — Notepad', icon:<FileText className="w-4 h-4 text-sky-500"/>, subtitle:'Aditya Narayan Ray Bio & Principles', component:<WindowsNotepadApp/>, isMinimized:false, isMaximized:false, zIndex:nextZ, initialPosition:{x:250,y:80}, initialSize:{width:720,height:500} }; break;
            case 'terminal':   newWindow = { id:'terminal', title:'Command Prompt — cmd.exe', icon:<Terminal className="w-4 h-4 text-emerald-500"/>, subtitle:'C:\\Users\\Aditya', component:<WindowsTerminalApp onReturnToRoom={onReturnToRoom}/>, isMinimized:false, isMaximized:false, zIndex:nextZ, initialPosition:{x:280,y:100}, initialSize:{width:740,height:480} }; break;
            case 'code':       newWindow = { id:'code', title:'VS Code — /home/aditya/portfolio', icon:<Code2 className="w-4 h-4 text-violet-500"/>, subtitle:'Active Workspace', component:<CodeEditorApp/>, isMinimized:false, isMaximized:false, zIndex:nextZ, initialPosition:{x:240,y:60}, initialSize:{width:880,height:580} }; break;
            case 'mail':       newWindow = { id:'mail', title:'Contact Me — Direct Links', icon:<Mail className="w-4 h-4 text-rose-500"/>, subtitle:'GitHub, LinkedIn & Gmail', component:<WindowsMailApp/>, isMinimized:false, isMaximized:false, zIndex:nextZ, initialPosition:{x:260,y:80}, initialSize:{width:580,height:440} }; break;
            case 'media':      newWindow = { id:'media', title:'Music Player — Windows Media Player', icon:<Win7MediaPlayerIcon className="w-4 h-4"/>, subtitle:'Windows Media Player', component:<WindowsMediaApp/>, isMinimized:false, isMaximized:false, zIndex:nextZ, initialPosition:{x:300,y:100}, initialSize:{width:520,height:420} }; break;
            default: return;
        }
        setOpenWindows((prev) => [...prev, newWindow]);
    };

    const bringToFront = (id: string) => {
        const nextZ = topZIndex + 1;
        setTopZIndex(nextZ);
        setActiveWindowId(id);
        setOpenWindows((prev) => prev.map((win) => win.id === id ? { ...win, zIndex: nextZ, isMinimized: false } : win));
    };

    const handleShowDesktop = () => {
        audio.playClick();
        const anyVisible = openWindows.some((w) => !w.isMinimized);
        setOpenWindows((prev) => prev.map((w) => ({ ...w, isMinimized: anyVisible })));
    };

    const [brightness, setBrightness] = useState<number>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('portfolio_brightness');
            return saved !== null ? Number(saved) : 100;
        }
        return 100;
    });

    const handleBrightnessChange = (val: number) => {
        setBrightness(val);
        if (typeof window !== 'undefined') {
            localStorage.setItem('portfolio_brightness', String(val));
        }
    };

    const handleDesktopMouseDown = (e: React.MouseEvent) => {
        if (
            (e.target as HTMLElement).closest('.desktop-icon') ||
            (e.target as HTMLElement).closest('.window-frame') ||
            (e.target as HTMLElement).closest('.desktop-context-menu') ||
            (e.target as HTMLElement).closest('.win7-start-menu') ||
            (e.target as HTMLElement).closest('.win7-taskbar')
        ) return;
        setIsStartMenuOpen(false);
        setSelectedIconId(null);
        setContextMenu({ ...contextMenu, visible: false });
        setSelectionBox({ startX: e.clientX, startY: e.clientY, currentX: e.clientX, currentY: e.clientY, isSelecting: true });
    };
    const handleDesktopMouseMove = (e: React.MouseEvent) => {
        if (!selectionBox.isSelecting) return;
        setSelectionBox((prev) => ({ ...prev, currentX: e.clientX, currentY: e.clientY }));
    };
    const handleDesktopMouseUp = () => {
        if (selectionBox.isSelecting) setSelectionBox((prev) => ({ ...prev, isSelecting: false }));
    };
    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setContextMenu({ x: Math.min(e.clientX, window.innerWidth - 220), y: Math.min(e.clientY, window.innerHeight - 260), visible: true });
    };

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
            className="relative w-full h-dvh overflow-hidden select-none font-sans flex flex-col"
            style={{ fontFamily: '"Segoe UI", Tahoma, Geneva, sans-serif' }}
        >
            {/* ── WINDOWS 7 DESKTOP WALLPAPER (image.png) ── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
                <img
                    src="/image.png"
                    alt="Windows 7 Wallpaper"
                    className="w-full h-full object-cover object-center"
                    draggable={false}
                />
            </div>

            {/* ── DESKTOP ICONS (left column, Win7 style) ── */}
            <div className="flex-1 relative overflow-hidden" style={{ zIndex: 1 }}>
                <div
                    className="touch-manipulation"
                    style={{
                        position: 'absolute', top: 12, left: 12,
                        display: 'grid',
                        gridTemplateRows: isMobile ? 'repeat(5, auto)' : 'repeat(6, auto)',
                        gridAutoFlow: 'column',
                        gap: isMobile ? 4 : 8,
                    }}>
                    {desktopIcons.map((item) => {
                        const isSelected = selectedIconId === item.id;
                        return (
                            <div
                                key={item.id}
                                className="desktop-icon"
                                onClick={(e) => { e.stopPropagation(); audio.playHover(); setSelectedIconId(item.id); if (isMobile) openApp(item.id); }}
                                onDoubleClick={(e) => { e.stopPropagation(); openApp(item.id); }}
                                title={item.id === 'return' ? 'Return to 3D Room (Double-click)' : `Open ${item.name}${item.ext || ''} (Double-click)`}
                                style={{
                                    width: iconSize, display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', padding: '6px 4px', borderRadius: 4,
                                    cursor: 'default',
                                    background: isSelected ? 'rgba(100,160,255,0.30)' : 'transparent',
                                    border: isSelected ? '1px solid rgba(100,160,255,0.55)' : '1px solid transparent',
                                    boxShadow: isSelected ? '0 0 8px rgba(80,140,255,0.25)' : 'none',
                                    transition: 'background 0.1s',
                                }}
                            >
                                {/* Icon */}
                                <div style={{
                                    padding: 8, borderRadius: 8,
                                    background: isSelected ? 'rgba(80,130,255,0.18)' : 'rgba(0,0,0,0.05)',
                                    backdropFilter: 'blur(4px)',
                                    marginBottom: 4,
                                }}>
                                    {item.icon}
                                </div>
                                {/* Label */}
                                <span style={{
                                    fontSize: 11, fontWeight: 600,
                                    color: 'white',
                                    textShadow: '0 1px 3px rgba(0,0,0,0.9), 0 0 6px rgba(0,0,0,0.6)',
                                    textAlign: 'center', lineHeight: 1.3,
                                    wordBreak: 'break-word',
                                    maxWidth: iconSize - 8,
                                }}>
                                    {item.name}
                                    {item.ext && <span style={{ color: 'rgba(220,235,255,0.85)', fontSize: 10, display: 'block' }}>{item.ext}</span>}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* ── Open Window Frames ── */}
                {[...openWindows]
                    .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
                    .map((win) => (
                        <WindowsWindowFrame
                            key={win.id}
                            id={win.id}
                            title={win.title}
                            icon={win.icon}
                            subtitle={win.subtitle}
                            isActive={activeWindowId === win.id}
                            isMinimized={win.isMinimized}
                            isMaximized={win.isMaximized}
                            zIndex={win.zIndex}
                            onFocus={() => bringToFront(win.id)}
                            onMinimize={() => setOpenWindows((prev) => prev.map((w) => w.id === win.id ? { ...w, isMinimized: true } : w))}
                            onMaximizeToggle={() => setOpenWindows((prev) => prev.map((w) => w.id === win.id ? { ...w, isMaximized: !w.isMaximized } : w))}
                            onClose={() => setOpenWindows((prev) => prev.filter((w) => w.id !== win.id))}
                            initialPosition={win.initialPosition}
                            initialSize={win.initialSize}
                        >
                            {win.component}
                        </WindowsWindowFrame>
                    ))}

                {/* Selection marquee */}
                {selectionBox.isSelecting && (
                    <div style={{
                        position: 'absolute',
                        left: selectLeft, top: selectTop,
                        width: selectWidth, height: selectHeight,
                        border: '1px solid rgba(100,160,255,0.80)',
                        background: 'rgba(100,160,255,0.18)',
                        pointerEvents: 'none', zIndex: 30,
                    }} />
                )}
            </div>

            {/* ── Win7 Start Menu ── */}
            <WindowsStartMenu
                isOpen={isStartMenuOpen}
                onClose={() => setIsStartMenuOpen(false)}
                onOpenApp={openApp}
                onReturnToRoom={onReturnToRoom}
            />

            {/* ── Right-click context menu (Win7 styled) ── */}
            {contextMenu.visible && (
                <div
                    className="desktop-context-menu"
                    style={{
                        position: 'absolute',
                        left: contextMenu.x, top: contextMenu.y,
                        width: 220, padding: '4px 0',
                        borderRadius: 4,
                        background: 'linear-gradient(180deg, rgba(235,242,252,0.98) 0%, rgba(218,232,248,0.98) 100%)',
                        border: '1px solid rgba(130,175,230,0.65)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.38)',
                        zIndex: 50,
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                >
                    {[
                        { id: 'projects', label: 'Open Projects', icon: <FolderGit2 className="w-3.5 h-3.5 text-cyan-500"/> },
                        { id: 'experience', label: 'Open Experience', icon: <Briefcase className="w-3.5 h-3.5 text-amber-500"/> },
                        { id: 'skills', label: 'Open Skills', icon: <Cpu className="w-3.5 h-3.5 text-purple-500"/> },
                        { id: 'resume', label: 'Open Resume (PDF)', icon: <Award className="w-3.5 h-3.5 text-teal-500"/> },
                        { id: 'notepad', label: 'Open About Me', icon: <FileText className="w-3.5 h-3.5 text-sky-500"/> },
                        { id: 'terminal', label: 'Open Terminal', icon: <Terminal className="w-3.5 h-3.5 text-emerald-500"/> },
                    ].map(item => (
                        <button key={item.id}
                            onClick={() => { audio.playClick(); openApp(item.id); setContextMenu({ ...contextMenu, visible: false }); }}
                            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                                padding: '5px 16px', cursor: 'pointer', background: 'transparent',
                                border: 'none', fontSize: 13, color: '#1a2a3a', textAlign: 'left',
                                fontFamily: '"Segoe UI", Tahoma, sans-serif' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(90deg, #3c78d8, #4a8ae8)'; e.currentTarget.style.color = 'white'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1a2a3a'; }}
                        >
                            {item.icon} {item.label}
                        </button>
                    ))}
                    <div style={{ height: 1, background: 'rgba(130,175,230,0.5)', margin: '4px 0' }} />
                    <button
                        onClick={() => { audio.playClick(); setContextMenu({ ...contextMenu, visible: false }); }}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                            padding: '5px 16px', cursor: 'pointer', background: 'transparent',
                            border: 'none', fontSize: 13, color: '#1a2a3a', textAlign: 'left',
                            fontFamily: '"Segoe UI", Tahoma, sans-serif' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(90deg, #3c78d8, #4a8ae8)'; e.currentTarget.style.color = 'white'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1a2a3a'; }}
                    >
                        <RefreshCw className="w-3.5 h-3.5 text-gray-500" /> Refresh
                    </button>
                    <div style={{ height: 1, background: 'rgba(130,175,230,0.5)', margin: '4px 0' }} />
                    <button
                        onClick={() => { audio.playWarpOut(); onReturnToRoom(); }}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                            padding: '5px 16px', cursor: 'pointer', background: 'transparent',
                            border: 'none', fontSize: 13, color: '#c0392b', textAlign: 'left',
                            fontFamily: '"Segoe UI", Tahoma, sans-serif' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(90deg, #dc2626, #ef4444)'; e.currentTarget.style.color = 'white'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#c0392b'; }}
                    >
                        <LogOut className="w-3.5 h-3.5 text-red-500" /> Return to 3D Room
                    </button>
                </div>
            )}

            {/* ── Screen Brightness Dimming Layer ── */}
            {brightness < 100 && (
                <div
                    className="pointer-events-none absolute inset-0 transition-opacity duration-150"
                    style={{
                        zIndex: 35,
                        backgroundColor: '#000000',
                        opacity: ((100 - brightness) / 100) * 0.85,
                    }}
                />
            )}

            {/* ── Win7 Aero Glass Taskbar ── */}
            <WindowsTaskbar
                isStartMenuOpen={isStartMenuOpen}
                onToggleStartMenu={() => setIsStartMenuOpen(!isStartMenuOpen)}
                openWindows={openWindows.map((w) => ({ id: w.id, title: w.title, isMinimized: w.isMinimized, isActive: activeWindowId === w.id }))}
                brightness={brightness}
                onBrightnessChange={handleBrightnessChange}
                onTaskbarAppClick={(appId) => {
                    const win = openWindows.find((w) => w.id === appId);
                    if (!win) { openApp(appId); return; }
                    if (win.isMinimized) {
                        bringToFront(appId);
                        setOpenWindows((prev) => prev.map((w) => w.id === appId ? { ...w, isMinimized: false } : w));
                    } else if (activeWindowId === appId) {
                        setOpenWindows((prev) => prev.map((w) => w.id === appId ? { ...w, isMinimized: true } : w));
                        const remaining = openWindows.filter((w) => w.id !== appId && !w.isMinimized);
                        if (remaining.length > 0) {
                            const sortedRemaining = [...remaining].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));
                            setActiveWindowId(sortedRemaining[0].id);
                        } else {
                            setActiveWindowId('');
                        }
                    } else {
                        bringToFront(appId);
                    }
                }}
                onShowDesktop={handleShowDesktop}
            />
        </div>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import {
    Briefcase, FolderGit2, Cpu, FileText, Terminal,
    Code2, Mail, Award, Music, LogOut, RefreshCw,
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
    imgSrc?: string;
}

// Win7 desktop icons — white text with drop-shadow (renders over the Bliss wallpaper)
const ICON_SIZE = 76;

export default function WindowsDesktop({ onReturnToRoom }: WindowsDesktopProps) {
    const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
    const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
    const [activeWindowId, setActiveWindowId] = useState<string>('experience');
    const [topZIndex, setTopZIndex] = useState(10);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });
    const [selectionBox, setSelectionBox] = useState<{
        startX: number; startY: number; currentX: number; currentY: number; isSelecting: boolean;
    }>({ startX: 0, startY: 0, currentX: 0, currentY: 0, isSelecting: false });

    const desktopIcons: DesktopIcon[] = [
        { id: 'experience', name: 'Experience', ext: '.exe', icon: <Briefcase className="w-9 h-9 text-amber-300 drop-shadow-lg" /> },
        { id: 'projects',   name: 'Projects',   ext: '.exe', icon: <FolderGit2 className="w-9 h-9 text-cyan-300 drop-shadow-lg" /> },
        { id: 'skills',     name: 'Skills',     ext: '.exe', icon: <Cpu className="w-9 h-9 text-purple-300 drop-shadow-lg" /> },
        { id: 'about',      name: 'About_Aditya', ext: '.txt', icon: <FileText className="w-9 h-9 text-sky-300 drop-shadow-lg" /> },
        { id: 'terminal',   name: 'cmd',        ext: '.exe', icon: <Terminal className="w-9 h-9 text-emerald-300 drop-shadow-lg" /> },
        { id: 'code',       name: 'VSCode',     ext: '.exe', icon: <Code2 className="w-9 h-9 text-violet-300 drop-shadow-lg" /> },
        { id: 'mail',       name: 'Mail',       ext: '.exe', icon: <Mail className="w-9 h-9 text-rose-300 drop-shadow-lg" /> },
        { id: 'resume',     name: 'Resume',     ext: '.pdf', icon: <Award className="w-9 h-9 text-teal-300 drop-shadow-lg" /> },
        { id: 'media',      name: 'Groove_Music', ext: '.exe', icon: <Music className="w-9 h-9 text-yellow-300 drop-shadow-lg" /> },
        { id: 'return',     name: 'Return_To_Room', ext: '.lnk', icon: <LogOut className="w-9 h-9 text-red-300 drop-shadow-lg" /> },
    ];

    const [openWindows, setOpenWindows] = useState<WindowState[]>([
        {
            id: 'experience', title: 'Career Experience — Aditya Ray',
            icon: <Briefcase className="w-4 h-4 text-amber-500" />,
            subtitle: 'Verified Track Record & Credentials',
            component: <WindowsExperienceApp />,
            isMinimized: false, isMaximized: false, zIndex: 10,
            initialPosition: { x: 180, y: 40 }, initialSize: { width: 840, height: 580 },
        },
    ]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') { audio.playWarpOut(); onReturnToRoom(); }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onReturnToRoom]);

    const openApp = (appId: string) => {
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
            case 'experience': newWindow = { id:'experience', title:'Career Experience — Aditya Ray', icon:<Briefcase className="w-4 h-4 text-amber-500"/>, subtitle:'Verified Track Record', component:<WindowsExperienceApp/>, isMinimized:false, isMaximized:false, zIndex:nextZ, initialPosition:{x:160,y:50}, initialSize:{width:840,height:580} }; break;
            case 'projects':   newWindow = { id:'projects', title:'Projects Explorer — Aditya Ray Flagship Systems', icon:<FolderGit2 className="w-4 h-4 text-cyan-500"/>, subtitle:'3D WebGL & Full-Stack Projects', component:<WindowsProjectsApp/>, isMinimized:false, isMaximized:false, zIndex:nextZ, initialPosition:{x:220,y:70}, initialSize:{width:920,height:600} }; break;
            case 'skills':     newWindow = { id:'skills', title:'System Diagnostics // Tech Stack Matrix', icon:<Cpu className="w-4 h-4 text-purple-500"/>, subtitle:'GPU & Distributed Systems', component:<WindowsSkillsApp/>, isMinimized:false, isMaximized:false, zIndex:nextZ, initialPosition:{x:200,y:60}, initialSize:{width:820,height:560} }; break;
            case 'about':      newWindow = { id:'about', title:'About_Aditya.txt — Notepad', icon:<FileText className="w-4 h-4 text-sky-500"/>, subtitle:'Aditya Ray Bio & Principles', component:<WindowsNotepadApp/>, isMinimized:false, isMaximized:false, zIndex:nextZ, initialPosition:{x:250,y:80}, initialSize:{width:720,height:500} }; break;
            case 'terminal':   newWindow = { id:'terminal', title:'Command Prompt — cmd.exe', icon:<Terminal className="w-4 h-4 text-emerald-500"/>, subtitle:'C:\\Users\\Aditya', component:<WindowsTerminalApp onReturnToRoom={onReturnToRoom}/>, isMinimized:false, isMaximized:false, zIndex:nextZ, initialPosition:{x:280,y:100}, initialSize:{width:740,height:480} }; break;
            case 'code':       newWindow = { id:'code', title:'VS Code — /home/aditya/portfolio', icon:<Code2 className="w-4 h-4 text-violet-500"/>, subtitle:'Active Workspace', component:<CodeEditorApp/>, isMinimized:false, isMaximized:false, zIndex:nextZ, initialPosition:{x:240,y:60}, initialSize:{width:880,height:580} }; break;
            case 'mail':       newWindow = { id:'mail', title:'Windows Mail — Contact Uplink', icon:<Mail className="w-4 h-4 text-rose-500"/>, subtitle:'Encrypted Transmission', component:<WindowsMailApp/>, isMinimized:false, isMaximized:false, zIndex:nextZ, initialPosition:{x:260,y:80}, initialSize:{width:760,height:520} }; break;
            case 'resume':     newWindow = { id:'resume', title:'Aditya_Ray_Resume.pdf — PDF Reader', icon:<Award className="w-4 h-4 text-teal-500"/>, subtitle:'Verified Curriculum Vitae', component:<WindowsResumeViewerApp/>, isMinimized:false, isMaximized:false, zIndex:nextZ, initialPosition:{x:200,y:40}, initialSize:{width:780,height:620} }; break;
            case 'media':      newWindow = { id:'media', title:'Groove Music — Lo-Fi Synthesizer', icon:<Music className="w-4 h-4 text-yellow-500"/>, subtitle:'Procedural Audio Stream', component:<WindowsMediaApp/>, isMinimized:false, isMaximized:false, zIndex:nextZ, initialPosition:{x:320,y:120}, initialSize:{width:500,height:380} }; break;
            default: return;
        }
        setOpenWindows((prev) => [...prev, newWindow]);
    };

    const bringToFront = (id: string) => {
        const nextZ = topZIndex + 1;
        setTopZIndex(nextZ);
        setActiveWindowId(id);
        setOpenWindows((prev) => prev.map((win) => win.id === id ? { ...win, zIndex: nextZ } : win));
    };

    const handleShowDesktop = () => {
        audio.playClick();
        const anyVisible = openWindows.some((w) => !w.isMinimized);
        setOpenWindows((prev) => prev.map((w) => ({ ...w, isMinimized: anyVisible })));
    };

    const handleDesktopMouseDown = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('.desktop-icon') || (e.target as HTMLElement).closest('.window-frame')) return;
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
            className="relative w-full h-screen overflow-hidden select-none font-sans flex flex-col"
            style={{ fontFamily: '"Segoe UI", Tahoma, Geneva, sans-serif' }}
        >
            {/* ── WINDOWS 7 BLISS WALLPAPER ── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
                {/* Sky gradient — the iconic Win7 blue sky */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(180deg, #4a90d9 0%, #6eaae8 18%, #a5c8f5 35%, #c8dff8 50%, #d8ebfa 60%, #c5e0a0 72%, #7dbf45 82%, #5caa28 100%)',
                }} />
                {/* Clouds — upper area */}
                <div style={{ position: 'absolute', top: '8%', left: '15%', width: 180, height: 70,
                    background: 'radial-gradient(ellipse at 40% 60%, rgba(255,255,255,0.96) 30%, rgba(230,240,255,0.70) 65%, transparent 100%)',
                    borderRadius: '50%', filter: 'blur(2px)' }} />
                <div style={{ position: 'absolute', top: '5%', left: '20%', width: 120, height: 55,
                    background: 'radial-gradient(ellipse at 50% 70%, rgba(255,255,255,0.92) 35%, rgba(220,235,255,0.60) 70%, transparent 100%)',
                    borderRadius: '50%', filter: 'blur(1.5px)' }} />
                <div style={{ position: 'absolute', top: '12%', right: '20%', width: 220, height: 80,
                    background: 'radial-gradient(ellipse at 40% 55%, rgba(255,255,255,0.94) 28%, rgba(225,238,255,0.65) 62%, transparent 100%)',
                    borderRadius: '50%', filter: 'blur(2px)' }} />
                <div style={{ position: 'absolute', top: '6%', right: '30%', width: 140, height: 50,
                    background: 'radial-gradient(ellipse at 50% 65%, rgba(255,255,255,0.90) 30%, rgba(220,235,255,0.55) 65%, transparent 100%)',
                    borderRadius: '50%', filter: 'blur(1.5px)' }} />
                <div style={{ position: 'absolute', top: '18%', left: '45%', width: 160, height: 60,
                    background: 'radial-gradient(ellipse at 45% 60%, rgba(255,255,255,0.88) 25%, rgba(215,232,255,0.50) 60%, transparent 100%)',
                    borderRadius: '50%', filter: 'blur(2px)' }} />
                {/* Rolling green hills — the signature Bliss hill */}
                <svg viewBox="0 0 1440 900" preserveAspectRatio="none"
                    style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '55%' }}>
                    {/* Back distant hill */}
                    <ellipse cx="720" cy="1000" rx="900" ry="550" fill="#88c840" opacity="0.5"/>
                    {/* Mid hill right */}
                    <ellipse cx="1200" cy="950" rx="700" ry="500" fill="#72b832" opacity="0.6"/>
                    {/* Mid hill left */}
                    <ellipse cx="240" cy="980" rx="700" ry="520" fill="#78bc38" opacity="0.55"/>
                    {/* Main iconic Bliss hill center */}
                    <ellipse cx="720" cy="920" rx="820" ry="480" fill="#82cc40"/>
                    {/* Bright highlight on hill top */}
                    <ellipse cx="680" cy="840" rx="320" ry="120" fill="#9adc50" opacity="0.7"/>
                    {/* Foreground dark grass at bottom */}
                    <rect x="0" y="820" width="1440" height="80" fill="#5aaa25"/>
                </svg>
                {/* Sun glow upper right */}
                <div style={{
                    position: 'absolute', top: -60, right: '12%', width: 260, height: 260,
                    background: 'radial-gradient(circle, rgba(255,248,200,0.55) 0%, rgba(255,230,100,0.25) 45%, transparent 75%)',
                    borderRadius: '50%',
                }} />
            </div>

            {/* ── DESKTOP ICONS (left column, Win7 style) ── */}
            <div className="flex-1 relative overflow-hidden" style={{ zIndex: 1 }}>
                <div style={{
                    position: 'absolute', top: 16, left: 16,
                    display: 'grid', gridTemplateRows: 'repeat(6, auto)', gridAutoFlow: 'column',
                    gap: 8,
                }}>
                    {desktopIcons.map((item) => {
                        const isSelected = selectedIconId === item.id;
                        return (
                            <div
                                key={item.id}
                                className="desktop-icon"
                                onClick={(e) => { e.stopPropagation(); audio.playHover(); setSelectedIconId(item.id); }}
                                onDoubleClick={(e) => { e.stopPropagation(); openApp(item.id); }}
                                title={`Open ${item.name}${item.ext || ''} (Double-click)`}
                                style={{
                                    width: ICON_SIZE, display: 'flex', flexDirection: 'column',
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
                                    maxWidth: ICON_SIZE - 8,
                                }}>
                                    {item.name}
                                    {item.ext && <span style={{ color: 'rgba(220,235,255,0.85)', fontSize: 10, display: 'block' }}>{item.ext}</span>}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* ── Open Window Frames ── */}
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
                    onClick={(e) => e.stopPropagation()}
                >
                    {[
                        { id: 'experience', label: 'Open Experience', icon: <Briefcase className="w-3.5 h-3.5 text-amber-500"/> },
                        { id: 'projects', label: 'Open Projects', icon: <FolderGit2 className="w-3.5 h-3.5 text-cyan-500"/> },
                        { id: 'terminal', label: 'Open Command Prompt', icon: <Terminal className="w-3.5 h-3.5 text-emerald-500"/> },
                    ].map(item => (
                        <button key={item.id}
                            onClick={() => { audio.playClick(); openApp(item.id); setContextMenu({ ...contextMenu, visible: false }); }}
                            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                                padding: '5px 16px', cursor: 'default', background: 'transparent',
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
                            padding: '5px 16px', cursor: 'default', background: 'transparent',
                            border: 'none', fontSize: 13, color: '#1a2a3a', textAlign: 'left',
                            fontFamily: '"Segoe UI", Tahoma, sans-serif' }}
                    >
                        <RefreshCw className="w-3.5 h-3.5 text-gray-500" /> Refresh
                    </button>
                    <div style={{ height: 1, background: 'rgba(130,175,230,0.5)', margin: '4px 0' }} />
                    <button
                        onClick={() => { audio.playWarpOut(); onReturnToRoom(); }}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                            padding: '5px 16px', cursor: 'default', background: 'transparent',
                            border: 'none', fontSize: 13, color: '#c0392b', textAlign: 'left',
                            fontFamily: '"Segoe UI", Tahoma, sans-serif' }}
                    >
                        <LogOut className="w-3.5 h-3.5 text-red-500" /> Return to 3D Room
                    </button>
                </div>
            )}

            {/* ── Win7 Aero Glass Taskbar ── */}
            <WindowsTaskbar
                isStartMenuOpen={isStartMenuOpen}
                onToggleStartMenu={() => setIsStartMenuOpen(!isStartMenuOpen)}
                openWindows={openWindows.map((w) => ({ id: w.id, title: w.title, isMinimized: w.isMinimized, isActive: activeWindowId === w.id }))}
                onTaskbarAppClick={(appId) => {
                    const win = openWindows.find((w) => w.id === appId);
                    if (!win) { openApp(appId); return; }
                    if (win.isMinimized) {
                        bringToFront(appId);
                        setOpenWindows((prev) => prev.map((w) => w.id === appId ? { ...w, isMinimized: false } : w));
                    } else if (activeWindowId === appId) {
                        setOpenWindows((prev) => prev.map((w) => w.id === appId ? { ...w, isMinimized: true } : w));
                    } else {
                        bringToFront(appId);
                    }
                }}
                onShowDesktop={handleShowDesktop}
            />
        </div>
    );
}

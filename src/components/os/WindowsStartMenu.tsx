'use client';

import React, { useState } from 'react';
import {
    Search,
    Power,
    Briefcase,
    FolderGit2,
    Cpu,
    FileText,
    Terminal,
    Code2,
    Mail,
    Award,
    Music,
    ChevronRight,
    RotateCcw,
    User,
} from 'lucide-react';
import { PERSONAL_INFO } from '@/data/portfolioData';
import { audio } from '@/lib/audio';

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
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'pinned' | 'allPrograms'>('pinned');
    const [showPowerFlyout, setShowPowerFlyout] = useState(false);

    if (!isOpen) return null;

    const pinnedApps = [
        { id: 'projects', label: 'Projects Explorer', icon: <FolderGit2 className="w-6 h-6 text-[#0891b2]" />, desc: 'Flagship Systems & Demos' },
        { id: 'experience', label: 'Career Experience', icon: <Briefcase className="w-6 h-6 text-[#d97706]" />, desc: 'Work History & Internships' },
        { id: 'skills', label: 'Skills Matrix', icon: <Cpu className="w-6 h-6 text-[#7e22ce]" />, desc: 'Technical Competencies' },
        { id: 'resume', label: 'Resume (PDF)', icon: <Award className="w-6 h-6 text-[#0d9488]" />, desc: 'Curriculum Vitae Document' },
        { id: 'notepad', label: 'About Aditya', icon: <FileText className="w-6 h-6 text-[#0284c7]" />, desc: 'Bio, Principles & Notes' },
        { id: 'mail', label: 'Contact Me', icon: <Mail className="w-6 h-6 text-[#e11d48]" />, desc: 'GitHub, LinkedIn & Gmail' },
        { id: 'code', label: 'VS Code Editor', icon: <Code2 className="w-6 h-6 text-[#6366f1]" />, desc: 'Interactive Workspace' },
        { id: 'terminal', label: 'Command Prompt', icon: <Terminal className="w-6 h-6 text-[#16a34a]" />, desc: 'cmd.exe Console' },
        { id: 'media', label: 'Music Player', icon: <Music className="w-6 h-6 text-[#ca8a04]" />, desc: 'Windows Media Player' },
    ];

    const allProgramsCategories = [
        {
            category: 'Portfolio Systems',
            apps: [
                { id: 'projects', label: 'Projects Explorer', icon: <FolderGit2 className="w-4 h-4 text-[#0891b2]" /> },
                { id: 'experience', label: 'Career Experience', icon: <Briefcase className="w-4 h-4 text-[#d97706]" /> },
                { id: 'skills', label: 'Skills Matrix', icon: <Cpu className="w-4 h-4 text-[#7e22ce]" /> },
                { id: 'resume', label: 'Resume Viewer (PDF)', icon: <Award className="w-4 h-4 text-[#0d9488]" /> },
            ]
        },
        {
            category: 'Development & Tools',
            apps: [
                { id: 'code', label: 'VS Code Workspace', icon: <Code2 className="w-4 h-4 text-[#6366f1]" /> },
                { id: 'terminal', label: 'Command Prompt (cmd.exe)', icon: <Terminal className="w-4 h-4 text-[#16a34a]" /> },
                { id: 'notepad', label: 'Notepad (About_Aditya.txt)', icon: <FileText className="w-4 h-4 text-[#0284c7]" /> },
            ]
        },
        {
            category: 'Communications & Media',
            apps: [
                { id: 'mail', label: 'Contact Me (Direct Uplinks)', icon: <Mail className="w-4 h-4 text-[#e11d48]" /> },
                { id: 'media', label: 'Music Player', icon: <Music className="w-4 h-4 text-[#ca8a04]" /> },
            ]
        }
    ];

    const filteredApps = pinnedApps.filter((a) =>
        a.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAppClick = (appId: string, e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
        }
        audio.playClick();
        onOpenApp(appId);
        onClose();
    };

    const handleSwitchOff = (e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
        }
        audio.playWarpOut();
        onClose();
        onReturnToRoom();
    };

    return (
        <div
            className="win7-start-menu fixed bottom-[42px] left-0 sm:left-1 w-[96vw] sm:w-[420px] h-[500px] max-h-[calc(100vh-48px)] rounded-t-lg rounded-b-[2px] bg-gradient-to-b from-[#18395e]/95 via-[#102947]/95 to-[#08182b]/98 backdrop-blur-2xl border border-[#528bbd]/70 shadow-[0_12px_45px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.45)] z-50 flex flex-col p-[5px] select-none text-xs font-sans animate-in fade-in slide-in-from-bottom-2 duration-150"
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
        >
            {/* Inner Windows 7 Two-Column Pane */}
            <div className="flex-1 flex overflow-hidden rounded-[3px] border border-[#3b6388]">
                {/* ── LEFT PANE: Programs & Search (White Windows 7 Canvas) ── */}
                <div className="flex-1 bg-white flex flex-col justify-between overflow-hidden border-r border-[#84a3c2]">
                    {/* Apps Content Area */}
                    <div className="flex-1 overflow-y-auto p-1.5 custom-scrollbar">
                        {searchQuery ? (
                            /* Search Results View */
                            <div className="space-y-1">
                                <div className="text-[10px] font-bold text-[#446688] uppercase px-2 py-0.5 tracking-wider">
                                    Search Results ({filteredApps.length})
                                </div>
                                {filteredApps.length === 0 ? (
                                    <div className="p-4 text-center text-xs text-[#777777]">
                                        No programs match &ldquo;{searchQuery}&rdquo;
                                    </div>
                                ) : (
                                    filteredApps.map((app) => (
                                        <button
                                            key={app.id}
                                            type="button"
                                            onClick={(e) => handleAppClick(app.id, e)}
                                            className="w-full flex items-center gap-2.5 p-2 rounded-[3px] text-left hover:bg-gradient-to-r hover:from-[#e8f2fe] hover:to-[#dbedfc] hover:border-[#b8d6fb] border border-transparent transition-all cursor-pointer group"
                                        >
                                            <div className="p-1 rounded bg-[#f4f7fb] border border-[#d8e2ed] flex-shrink-0 group-hover:scale-105 transition-transform">
                                                {app.icon}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="text-xs font-semibold text-[#1e1e1e] truncate group-hover:text-[#0c4a8a]">
                                                    {app.label}
                                                </div>
                                                <div className="text-[10px] text-[#666666] truncate">
                                                    {app.desc}
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        ) : viewMode === 'pinned' ? (
                            /* Pinned Programs View */
                            <div className="space-y-0.5">
                                {pinnedApps.map((app) => (
                                    <button
                                        key={app.id}
                                        type="button"
                                        onClick={(e) => handleAppClick(app.id, e)}
                                        className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-[3px] text-left hover:bg-gradient-to-r hover:from-[#eaf4fe] hover:to-[#dbedfc] hover:border-[#b8d6fb] border border-transparent transition-all cursor-pointer group"
                                    >
                                        <div className="w-8 h-8 rounded-[3px] bg-[#f2f6fa] border border-[#d2dbe6] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-[inset_0_1px_0_#ffffff]">
                                            {app.icon}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-xs font-semibold text-[#1e1e1e] truncate group-hover:text-[#0c4a8a]">
                                                {app.label}
                                            </div>
                                            <div className="text-[10px] text-[#777777] truncate">
                                                {app.desc}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            /* All Programs Hierarchical Tree View */
                            <div className="space-y-2.5 p-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        audio.playClick();
                                        setViewMode('pinned');
                                    }}
                                    className="text-xs font-semibold text-[#0066cc] hover:underline flex items-center gap-1 mb-2 px-1 cursor-pointer"
                                >
                                    ◀ Back
                                </button>
                                {allProgramsCategories.map((group) => (
                                    <div key={group.category} className="space-y-1">
                                        <div className="text-[10px] font-bold text-[#1e395b] uppercase tracking-wider px-1 pb-0.5 border-b border-[#e2e8f0]">
                                            {group.category}
                                        </div>
                                        <div className="space-y-0.5">
                                            {group.apps.map((app) => (
                                                <button
                                                    key={app.id}
                                                    type="button"
                                                    onClick={(e) => handleAppClick(app.id, e)}
                                                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-[3px] text-left hover:bg-[#eaf4fe] hover:border-[#b8d6fb] border border-transparent transition-colors cursor-pointer"
                                                >
                                                    <span className="flex-shrink-0">{app.icon}</span>
                                                    <span className="text-xs text-[#222222] truncate">{app.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Bottom of Left Pane: All Programs toggle & Windows 7 Search Box */}
                    <div className="p-2 border-t border-[#d5dee8] bg-[#fbfcfe] space-y-1.5 flex-shrink-0">
                        {/* All Programs Toggle Link */}
                        {!searchQuery && (
                            <button
                                type="button"
                                onClick={() => {
                                    audio.playClick();
                                    setViewMode(viewMode === 'pinned' ? 'allPrograms' : 'pinned');
                                }}
                                className="w-full flex items-center justify-between px-2 py-1 text-xs font-semibold text-[#1e395b] hover:bg-[#eaf3fc] hover:border-[#b8d6fb] border border-transparent rounded-[3px] transition-colors cursor-pointer"
                            >
                                <span>{viewMode === 'pinned' ? 'All Programs' : '◀ Back to Pinned'}</span>
                                <ChevronRight className="w-3.5 h-3.5 text-[#3b6ea5]" />
                            </button>
                        )}

                        {/* Classic Windows 7 Search Box */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search programs and files"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-2.5 pr-7 py-1 text-xs bg-white rounded-[2px] border border-[#7d9cb8] focus:border-[#3c7fb1] text-[#1e1e1e] placeholder-[#888888] italic shadow-[inset_0_1px_2px_rgba(0,0,0,0.12)] outline-none"
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7d9cb8]">
                                {searchQuery ? (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="text-[10px] text-[#777777] hover:text-[#000000] cursor-pointer"
                                    >
                                        ✕
                                    </button>
                                ) : (
                                    <Search className="w-3.5 h-3.5" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT PANE: System Links & Switch Off (Translucent Aero Blue) ── */}
                <div className="w-40 sm:w-44 bg-gradient-to-b from-[#183454]/95 to-[#0e2137]/98 p-2 flex flex-col justify-between text-white select-none">
                    <div className="space-y-1">
                        {/* User Account Picture Frame (Classic Windows 7 Photo Frame) */}
                        <div className="flex justify-end pb-2">
                            <button
                                type="button"
                                onClick={(e) => handleAppClick('notepad', e)}
                                className="w-12 h-12 rounded-[4px] bg-gradient-to-b from-white via-slate-100 to-slate-200 border-2 border-white/90 shadow-[0_2px_6px_rgba(0,0,0,0.4)] flex items-center justify-center text-[#183454] font-bold text-sm cursor-pointer hover:scale-105 transition-transform"
                                title="Aditya Narayan Ray Profile"
                            >
                                <User className="w-7 h-7 text-[#265380]" />
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <button
                            type="button"
                            onClick={(e) => handleAppClick('notepad', e)}
                            className="w-full text-left px-2 py-1 rounded-[3px] text-xs font-bold text-white hover:bg-white/15 hover:border-white/20 border border-transparent transition-colors cursor-pointer"
                        >
                            Aditya
                        </button>

                        <button
                            type="button"
                            onClick={(e) => handleAppClick('projects', e)}
                            className="w-full text-left px-2 py-1 rounded-[3px] text-xs text-white/90 hover:bg-white/15 hover:border-white/20 border border-transparent transition-colors cursor-pointer"
                        >
                            Projects
                        </button>

                        <button
                            type="button"
                            onClick={(e) => handleAppClick('experience', e)}
                            className="w-full text-left px-2 py-1 rounded-[3px] text-xs text-white/90 hover:bg-white/15 hover:border-white/20 border border-transparent transition-colors cursor-pointer"
                        >
                            Experience
                        </button>

                        <button
                            type="button"
                            onClick={(e) => handleAppClick('skills', e)}
                            className="w-full text-left px-2 py-1 rounded-[3px] text-xs text-white/90 hover:bg-white/15 hover:border-white/20 border border-transparent transition-colors cursor-pointer"
                        >
                            Skills Matrix
                        </button>

                        <button
                            type="button"
                            onClick={(e) => handleAppClick('resume', e)}
                            className="w-full text-left px-2 py-1 rounded-[3px] text-xs text-white/90 hover:bg-white/15 hover:border-white/20 border border-transparent transition-colors cursor-pointer"
                        >
                            Resume (PDF)
                        </button>

                        <div className="border-b border-white/15 my-1" />

                        <button
                            type="button"
                            onClick={(e) => handleAppClick('terminal', e)}
                            className="w-full text-left px-2 py-1 rounded-[3px] text-xs text-white/90 hover:bg-white/15 hover:border-white/20 border border-transparent transition-colors cursor-pointer"
                        >
                            Command Prompt
                        </button>

                        <button
                            type="button"
                            onClick={(e) => handleAppClick('code', e)}
                            className="w-full text-left px-2 py-1 rounded-[3px] text-xs text-white/90 hover:bg-white/15 hover:border-white/20 border border-transparent transition-colors cursor-pointer"
                        >
                            Code Editor
                        </button>

                        <button
                            type="button"
                            onClick={(e) => handleAppClick('mail', e)}
                            className="w-full text-left px-2 py-1 rounded-[3px] text-xs text-white/90 hover:bg-white/15 hover:border-white/20 border border-transparent transition-colors cursor-pointer"
                        >
                            Contact Me
                        </button>
                    </div>

                    {/* ── Windows 7 Shut Down / Switch Off Split Button ── */}
                    <div className="pt-2 relative">
                        <div className="flex items-center">
                            {/* Switch Off / Shut Down Main Button */}
                            <button
                                type="button"
                                onClick={(e) => handleSwitchOff(e)}
                                className="flex-1 h-7 rounded-l-[3px] bg-gradient-to-b from-[#2d6296] via-[#1f4873] to-[#123152] hover:from-[#d94848] hover:via-[#b92b2b] hover:to-[#8a1c1c] text-white border border-[#4882b5] hover:border-[#e26b6b] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] cursor-pointer transition-colors"
                                title="Switch Off Desktop & Return to 3D Room"
                            >
                                <Power className="w-3.5 h-3.5 text-white drop-shadow" />
                                <span>Switch off</span>
                            </button>

                            {/* Split Menu Arrow */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    audio.playClick();
                                    setShowPowerFlyout(!showPowerFlyout);
                                }}
                                className="w-6 h-7 rounded-r-[3px] bg-gradient-to-b from-[#244f7a] to-[#0f2842] hover:from-[#3168a1] hover:to-[#18395b] text-white border-y border-r border-[#4882b5] flex items-center justify-center cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]"
                                title="More shutdown options"
                            >
                                <span className="text-[9px]">▶</span>
                            </button>
                        </div>

                        {/* Power Flyout Options */}
                        {showPowerFlyout && (
                            <div className="absolute bottom-9 right-0 w-44 p-1 rounded-[3px] bg-[#1a3350] border border-[#4c78a0] shadow-xl space-y-0.5 z-20 text-xs">
                                <button
                                    type="button"
                                    onClick={(e) => handleSwitchOff(e)}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[2px] hover:bg-[#d94848] text-white text-left transition-colors cursor-pointer"
                                >
                                    <Power className="w-3 h-3" />
                                    <span>Shut down (To Room)</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        audio.playClick();
                                        window.location.reload();
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[2px] hover:bg-white/20 text-white text-left transition-colors cursor-pointer"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>Restart OS Session</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

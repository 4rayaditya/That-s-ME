'use client';

import React, { useState } from 'react';
import {
    ArrowLeft,
    ArrowRight,
    Search,
    Folder,
    HardDrive,
    FileText,
    Star,
    Monitor,
    Globe,
    ExternalLink,
    Download,
    Share2,
} from 'lucide-react';
import { Win7NotepadIcon, Win7PdfIcon, Win7InternetExplorerIcon, Win7ComputerIcon } from './Win7Icons';
import { audio } from '@/lib/audio';

interface FileItem {
    id: string;
    appId: string;
    name: string;
    ext: string;
    icon: React.ReactNode;
    type: string;
    size: string;
    date: string;
    description: string;
    downloadUrl?: string;
}

interface WindowsFilesFolderAppProps {
    onOpenFile: (appId: string) => void;
}

export default function WindowsFilesFolderApp({ onOpenFile }: WindowsFilesFolderAppProps) {
    const [selectedFileId, setSelectedFileId] = useState<string>('resume');
    const [searchQuery, setSearchQuery] = useState('');

    const files: FileItem[] = [
        {
            id: 'resume',
            appId: 'resume',
            name: 'Resume',
            ext: '.pdf',
            icon: <Win7PdfIcon className="w-10 h-10 drop-shadow-md" />,
            type: 'Adobe Acrobat Document',
            size: '146 KB',
            date: 'Today, 2:40 PM',
            description: 'Curriculum Vitae — Aditya Ray (Software Engineer & Creative Technologist)',
            downloadUrl: '/resume.pdf',
        },
        {
            id: 'about',
            appId: 'notepad',
            name: 'About_Aditya',
            ext: '.txt',
            icon: <Win7NotepadIcon className="w-10 h-10 drop-shadow-md" />,
            type: 'Text Document',
            size: '2.4 KB',
            date: 'Today, 1:15 PM',
            description: 'Core developer biography, engineering principles, and contact information',
        },
        {
            id: 'projects',
            appId: 'projects',
            name: 'Flagship_Projects',
            ext: '.url',
            icon: <Win7InternetExplorerIcon className="w-10 h-10 drop-shadow-md" />,
            type: 'Internet Shortcut',
            size: '1.2 KB',
            date: 'Yesterday',
            description: 'Interactive 3D WebGL telemetry, full-stack architectures & systems',
        },
        {
            id: 'experience',
            appId: 'experience',
            name: 'Career_TrackRecord',
            ext: '.url',
            icon: <Win7ComputerIcon className="w-10 h-10 drop-shadow-md" />,
            type: 'System Shortcut',
            size: '1.8 KB',
            date: 'Yesterday',
            description: 'Verified track record, achievements, metrics, and production honors',
        },
    ];

    const filteredFiles = files.filter(f =>
        !searchQuery ||
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeFile = files.find(f => f.id === selectedFileId) || files[0];

    const handleFileDoubleClick = (file: FileItem) => {
        audio.playClick();
        onOpenFile(file.appId);
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden font-sans select-none bg-[#0e1420] text-zinc-100 text-xs">
            {/* 1. TOP EXPLORER COMMAND BAR (Back, Forward, Breadcrumbs & Search) */}
            <div className="h-11 px-3 bg-gradient-to-b from-[#243552] to-[#17253d] border-b border-[#3b5982] flex items-center justify-between gap-3 shadow-inner">
                {/* Navigation Buttons */}
                <div className="flex items-center gap-1.5">
                    <button
                        className="w-7 h-7 rounded-full bg-gradient-to-b from-[#3b82f6]/40 to-[#1d4ed8]/40 border border-[#60a5fa]/50 flex items-center justify-center text-blue-200 hover:text-white hover:border-blue-400 transition-colors cursor-pointer"
                        title="Back"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                        className="w-7 h-7 rounded-full bg-gradient-to-b from-[#3b82f6]/20 to-[#1d4ed8]/20 border border-[#60a5fa]/30 flex items-center justify-center text-blue-300/60 cursor-default"
                        title="Forward"
                    >
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Breadcrumbs Address Bar */}
                <div className="flex-1 h-7 rounded px-2.5 bg-[#0a101d] border border-[#2b446a] flex items-center gap-1 text-[11px] text-zinc-300 shadow-inner overflow-hidden">
                    <Folder className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span className="text-zinc-500">Computer</span>
                    <span className="text-zinc-600">▶</span>
                    <span className="text-zinc-500">Users</span>
                    <span className="text-zinc-600">▶</span>
                    <span className="text-zinc-500">Aditya</span>
                    <span className="text-zinc-600">▶</span>
                    <span className="text-white font-semibold">Documents & Files</span>
                </div>

                {/* Search Bar */}
                <div className="w-48 h-7 rounded px-2 bg-[#0a101d] border border-[#2b446a] flex items-center gap-1.5 text-[11px] text-zinc-300 shadow-inner">
                    <Search className="w-3 h-3 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search Files"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent outline-none text-white placeholder:text-zinc-500"
                    />
                </div>
            </div>

            {/* 2. EXPLORER ACTION STRIP */}
            <div className="h-7 px-3 bg-[#131f33] border-b border-[#243754] flex items-center gap-4 text-[11px] text-zinc-300">
                <span className="hover:text-white cursor-pointer transition-colors">Organize</span>
                <span className="text-zinc-600">|</span>
                <button
                    onClick={() => onOpenFile(activeFile.appId)}
                    className="hover:text-white cursor-pointer transition-colors font-medium text-cyan-300 flex items-center gap-1"
                >
                    <ExternalLink className="w-3 h-3" />
                    Open
                </button>
                {activeFile.downloadUrl && (
                    <a
                        href={activeFile.downloadUrl}
                        download="Aditya_Ray_Resume.pdf"
                        className="hover:text-white cursor-pointer transition-colors flex items-center gap-1 text-emerald-300"
                    >
                        <Download className="w-3 h-3" />
                        Download
                    </a>
                )}
                <span className="text-zinc-600">|</span>
                <span className="text-zinc-400 hover:text-white cursor-pointer transition-colors">Share with</span>
                <span className="text-zinc-400 hover:text-white cursor-pointer transition-colors">Burn</span>
            </div>

            {/* 3. TWO-PANE EXPLORER BODY */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Navigation Tree */}
                <div className="w-44 border-r border-[#1d2d47] bg-[#0c1322]/80 p-3 flex flex-col gap-3 overflow-y-auto hidden sm:flex text-[11px]">
                    {/* Favorites */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-zinc-400 font-semibold text-[10px] uppercase tracking-wider">
                            <Star className="w-3 h-3 text-amber-400" />
                            Favorites
                        </div>
                        <div className="pl-3 space-y-1 text-zinc-300">
                            <div className="hover:text-white cursor-pointer py-0.5">Desktop</div>
                            <div className="hover:text-white cursor-pointer py-0.5">Downloads</div>
                            <div className="hover:text-white cursor-pointer py-0.5">Recent Places</div>
                        </div>
                    </div>

                    {/* Libraries */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-zinc-400 font-semibold text-[10px] uppercase tracking-wider">
                            <Folder className="w-3 h-3 text-blue-400" />
                            Libraries
                        </div>
                        <div className="pl-3 space-y-1">
                            <div className="bg-blue-600/30 text-white font-medium px-2 py-0.5 rounded border border-blue-500/40 cursor-pointer flex items-center gap-1.5">
                                <FileText className="w-3 h-3 text-blue-300" />
                                Documents
                            </div>
                            <div className="text-zinc-400 hover:text-white cursor-pointer py-0.5 pl-2">Music</div>
                            <div className="text-zinc-400 hover:text-white cursor-pointer py-0.5 pl-2">Pictures</div>
                            <div className="text-zinc-400 hover:text-white cursor-pointer py-0.5 pl-2">Videos</div>
                        </div>
                    </div>

                    {/* Computer */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-zinc-400 font-semibold text-[10px] uppercase tracking-wider">
                            <Monitor className="w-3 h-3 text-cyan-400" />
                            Computer
                        </div>
                        <div className="pl-3 space-y-1 text-zinc-400">
                            <div className="hover:text-white cursor-pointer py-0.5 flex items-center gap-1.5">
                                <HardDrive className="w-3 h-3 text-zinc-500" />
                                Local Disk (C:)
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Main Files List */}
                <div className="flex-1 bg-[#0b101c] p-4 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {filteredFiles.map((file) => {
                            const isSelected = selectedFileId === file.id;
                            return (
                                <div
                                    key={file.id}
                                    onClick={() => {
                                        audio.playClick();
                                        setSelectedFileId(file.id);
                                    }}
                                    onDoubleClick={() => handleFileDoubleClick(file)}
                                    className={`flex flex-col items-center text-center p-3 rounded transition-all cursor-pointer ${
                                        isSelected
                                            ? 'bg-blue-600/30 border border-blue-400/70 shadow-lg shadow-blue-500/10'
                                            : 'border border-transparent hover:bg-white/[0.06] hover:border-white/10'
                                    }`}
                                >
                                    <div className="mb-2 transition-transform duration-150 hover:scale-105">
                                        {file.icon}
                                    </div>
                                    <div className="text-xs font-medium text-white break-all line-clamp-2">
                                        {file.name}{file.ext}
                                    </div>
                                    <div className="text-[10px] text-zinc-400 mt-0.5">
                                        {file.type}
                                    </div>
                                    <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                                        {file.size}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 4. WINDOWS 7 DETAILS & STATUS BAR */}
            <div className="h-14 px-4 bg-gradient-to-b from-[#131d2e] to-[#0c1320] border-t border-[#1d2d47] flex items-center justify-between text-xs text-zinc-300">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                        {activeFile.icon}
                    </div>
                    <div className="flex flex-col">
                        <div className="font-semibold text-white">
                            {activeFile.name}{activeFile.ext}
                        </div>
                        <div className="text-[11px] text-zinc-400">
                            {activeFile.description}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono hidden sm:flex">
                    <span>{activeFile.type}</span>
                    <span>•</span>
                    <span>{activeFile.size}</span>
                    <span>•</span>
                    <button
                        onClick={() => onOpenFile(activeFile.appId)}
                        className="px-2.5 py-1 rounded bg-blue-600/80 hover:bg-blue-500 text-white font-sans text-xs transition-colors cursor-pointer"
                    >
                        Open File
                    </button>
                </div>
            </div>
        </div>
    );
}

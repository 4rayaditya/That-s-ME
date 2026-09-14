'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Minus, Square, Copy, X } from 'lucide-react';
import { audio } from '@/lib/audio';

interface WindowsWindowFrameProps {
    id: string;
    title: string;
    icon: React.ReactNode;
    subtitle?: string;
    children: React.ReactNode;
    isActive: boolean;
    isMinimized: boolean;
    isMaximized: boolean;
    onFocus: () => void;
    onMinimize: () => void;
    onMaximizeToggle: () => void;
    onClose: () => void;
    initialPosition?: { x: number; y: number };
    initialSize?: { width: number; height: number };
    minWidth?: number;
    minHeight?: number;
}

export default function WindowsWindowFrame({
    id,
    title,
    icon,
    subtitle,
    children,
    isActive,
    isMinimized,
    isMaximized,
    onFocus,
    onMinimize,
    onMaximizeToggle,
    onClose,
    initialPosition = { x: 120, y: 50 },
    initialSize = { width: 880, height: 600 },
    minWidth = 480,
    minHeight = 360,
}: WindowsWindowFrameProps) {
    const [position, setPosition] = useState(initialPosition);
    const [size, setSize] = useState(initialSize);
    const isDragging = useRef(false);
    const dragStart = useRef({ mouseX: 0, mouseY: 0, winX: 0, winY: 0 });

    // Handle dragging by title bar
    const handleMouseDown = (e: React.MouseEvent) => {
        if (isMaximized) return; // Cannot drag when maximized
        if ((e.target as HTMLElement).closest('button')) return; // Don't drag on buttons

        onFocus();
        isDragging.current = true;
        dragStart.current = {
            mouseX: e.clientX,
            mouseY: e.clientY,
            winX: position.x,
            winY: position.y,
        };

        const handleMouseMove = (moveEvent: MouseEvent) => {
            if (!isDragging.current) return;
            const deltaX = moveEvent.clientX - dragStart.current.mouseX;
            const deltaY = moveEvent.clientY - dragStart.current.mouseY;

            // Restrict bounds so title bar is always accessible
            const newX = Math.max(-200, Math.min(window.innerWidth - 150, dragStart.current.winX + deltaX));
            const newY = Math.max(0, Math.min(window.innerHeight - 80, dragStart.current.winY + deltaY));

            setPosition({ x: newX, y: newY });
        };

        const handleMouseUp = () => {
            isDragging.current = false;
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    if (isMinimized) return null;

    return (
        <div
            onMouseDown={onFocus}
            style={{
                left: isMaximized ? 0 : `${position.x}px`,
                top: isMaximized ? 0 : `${position.y}px`,
                width: isMaximized ? '100vw' : `${Math.min(size.width, typeof window !== 'undefined' ? window.innerWidth - 20 : size.width)}px`,
                height: isMaximized ? 'calc(100vh - 48px)' : `${Math.min(size.height, typeof window !== 'undefined' ? window.innerHeight - 80 : size.height)}px`,
            }}
            className={`absolute flex flex-col rounded-lg overflow-hidden transition-[border,box-shadow] duration-150 backdrop-blur-2xl ${
                isMaximized ? 'rounded-none border-none' : 'border'
            } ${
                isActive
                    ? 'bg-[#181a20]/95 border-cyan-500/40 shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_30px_rgba(0,245,212,0.12)] ring-1 ring-cyan-400/20'
                    : 'bg-[#12141a]/90 border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.6)]'
            }`}
        >
            {/* WINDOW TITLE BAR */}
            <div
                onMouseDown={handleMouseDown}
                onDoubleClick={onMaximizeToggle}
                className={`h-10 px-3 flex items-center justify-between select-none cursor-default ${
                    isActive ? 'bg-white/[0.04] text-zinc-100' : 'bg-transparent text-zinc-400'
                } border-b border-white/10`}
            >
                {/* Left: Window Icon, Title, Subtitle */}
                <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="flex-shrink-0 text-cyan-400">
                        {icon}
                    </div>
                    <span className="text-xs font-semibold tracking-wide truncate max-w-[280px] sm:max-w-md">
                        {title}
                    </span>
                    {subtitle && (
                        <span className="hidden sm:inline text-[11px] text-zinc-400 font-mono truncate">
                            — {subtitle}
                        </span>
                    )}
                </div>

                {/* Right: Authentic Windows 11 Window Controls (Minimize, Maximize/Restore, Close) */}
                <div className="flex items-center -mr-3 h-full">
                    {/* Minimize */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            audio.playClick();
                            onMinimize();
                        }}
                        className="h-full px-3.5 hover:bg-white/10 text-zinc-400 hover:text-zinc-100 transition-colors flex items-center justify-center cursor-pointer"
                        title="Minimize"
                    >
                        <Minus className="w-3.5 h-3.5" />
                    </button>

                    {/* Maximize / Restore */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            audio.playClick();
                            onMaximizeToggle();
                        }}
                        className="h-full px-3.5 hover:bg-white/10 text-zinc-400 hover:text-zinc-100 transition-colors flex items-center justify-center cursor-pointer"
                        title={isMaximized ? 'Restore Down' : 'Maximize'}
                    >
                        {isMaximized ? (
                            <Copy className="w-3 h-3 rotate-180" />
                        ) : (
                            <Square className="w-3 h-3" />
                        )}
                    </button>

                    {/* Close */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            audio.playClick();
                            onClose();
                        }}
                        className="h-full px-4 hover:bg-red-600 text-zinc-400 hover:text-white transition-colors flex items-center justify-center cursor-pointer"
                        title="Close"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* WINDOW CLIENT BODY */}
            <div className="flex-1 overflow-hidden relative flex flex-col bg-[#0d0f14]/80 text-zinc-200">
                {children}
            </div>
        </div>
    );
}

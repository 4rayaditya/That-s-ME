'use client';

import React, { ReactNode } from 'react';
import { Minus, Square, X } from 'lucide-react';
import { audio } from '@/lib/audio';

interface WindowFrameProps {
    title: string;
    icon?: ReactNode;
    subtitle?: string;
    children: ReactNode;
    className?: string;
    onClose?: () => void;
}

export default function WindowFrame({
    title,
    icon,
    subtitle,
    children,
    className = '',
    onClose,
}: WindowFrameProps) {
    return (
        <div
            className={`w-full rounded-2xl bg-space-950/90 border border-white/10 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col transition-all ${className}`}
        >
            {/* Titlebar */}
            <div className="h-9 px-4 bg-white/[0.04] border-b border-white/5 flex items-center justify-between select-none shrink-0 font-mono text-xs">
                {/* Left: Window Controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={onClose}
                        className="w-3 h-3 rounded-full bg-rose-500 hover:brightness-125 transition-all flex items-center justify-center group shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                        title="Close Window"
                    >
                        <X className="w-2 h-2 text-space-950 opacity-0 group-hover:opacity-100" />
                    </button>
                    <button
                        className="w-3 h-3 rounded-full bg-amber-500 hover:brightness-125 transition-all flex items-center justify-center group shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                        title="Minimize Window"
                    >
                        <Minus className="w-2 h-2 text-space-950 opacity-0 group-hover:opacity-100" />
                    </button>
                    <button
                        className="w-3 h-3 rounded-full bg-emerald-500 hover:brightness-125 transition-all flex items-center justify-center group shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                        title="Maximize Window"
                    >
                        <Square className="w-1.5 h-1.5 text-space-950 opacity-0 group-hover:opacity-100" />
                    </button>
                </div>

                {/* Center: Title & Icon */}
                <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                    {icon && <span className="text-brand-cyan">{icon}</span>}
                    <span>{title}</span>
                    {subtitle && <span className="text-zinc-500 text-[11px] font-normal">• {subtitle}</span>}
                </div>

                {/* Right: Telemetry tag */}
                <div className="text-[10px] text-zinc-500">
                    bash / zsh
                </div>
            </div>

            {/* Window Content Body */}
            <div className="flex-1 overflow-auto custom-scrollbar">
                {children}
            </div>
        </div>
    );
}

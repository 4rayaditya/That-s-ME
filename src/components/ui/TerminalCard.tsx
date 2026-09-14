'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Sparkles, CornerDownLeft, Maximize2, Minimize2 } from 'lucide-react';
import { TERMINAL_BANNER, EXECUTE_COMMAND, CommandOutput } from '@/data/terminalCommands';
import { audio } from '@/lib/audio';
import confetti from 'canvas-confetti';

interface HistoryItem {
    command: string;
    output: CommandOutput[];
}

export default function TerminalCard() {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<HistoryItem[]>([
        {
            command: 'system.init',
            output: [
                { type: 'text', content: 'Connection established with 4rayaditya mainframe.' },
                { type: 'success', content: 'Type "help" to list available telemetry directives.' },
            ],
        },
    ]);
    const [matrixMode, setMatrixMode] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        audio.playKeypress();

        if (e.key === 'Enter') {
            const trimmed = input.trim();
            if (!trimmed) return;

            if (trimmed.toLowerCase() === 'clear') {
                setHistory([]);
                setInput('');
                return;
            }

            const results = EXECUTE_COMMAND(trimmed);

            // Special easter egg triggers
            if (trimmed.toLowerCase() === 'matrix') {
                setMatrixMode(true);
                setTimeout(() => setMatrixMode(false), 7000);
            }

            if (trimmed.toLowerCase() === 'hire') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#00f5d4', '#9d4edd', '#ffffff'],
                });
            }

            setHistory((prev) => [...prev, { command: trimmed, output: results }]);
            setInput('');
        }
    };

    const handleCardClick = () => {
        inputRef.current?.focus();
    };

    return (
        <div
            onClick={handleCardClick}
            className={`relative w-full h-full flex flex-col rounded-2xl bg-space-950/90 border border-white/10 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.5)] overflow-hidden font-mono text-xs cursor-text transition-all ${
                matrixMode ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]' : ''
            }`}
        >
            {/* Terminal Header Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.04] border-b border-white/5 select-none">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80 shadow-[0_0_6px_rgba(244,63,94,0.6)]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80 shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                    <span className="ml-2 text-[11px] font-medium text-zinc-400 flex items-center gap-1.5">
                        <TerminalIcon className="w-3.5 h-3.5 text-brand-cyan" />
                        bash - 4rayaditya@terminal
                    </span>
                </div>
                <div className="text-[10px] text-zinc-500 font-mono">UTF-8 / zsh</div>
            </div>

            {/* Terminal Output Area */}
            <div className="flex-1 p-4 overflow-y-auto max-h-[300px] space-y-3 custom-scrollbar">
                {/* Banner */}
                <div className="text-[10px] text-zinc-500 leading-tight select-none">
                    {TERMINAL_BANNER.map((line, idx) => (
                        <div key={idx}>{line}</div>
                    ))}
                </div>

                {/* History */}
                {history.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                        <div className="flex items-center gap-2 text-zinc-300">
                            <span className="text-brand-cyan">aditya@portfolio:~$</span>
                            <span className="text-white font-medium">{item.command}</span>
                        </div>
                        <div className="space-y-0.5 pl-4 border-l border-white/5">
                            {item.output.map((out, oIdx) => (
                                <div
                                    key={oIdx}
                                    className={`leading-relaxed ${
                                        out.type === 'success'
                                            ? 'text-brand-cyan'
                                            : out.type === 'error'
                                            ? 'text-rose-400'
                                            : out.type === 'warning'
                                            ? 'text-amber-300'
                                            : out.type === 'matrix'
                                            ? 'text-emerald-400 animate-pulse font-bold'
                                            : 'text-zinc-300'
                                    }`}
                                >
                                    {out.content}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Live Input Line */}
                <div className="flex items-center gap-2 text-zinc-300 pt-1">
                    <span className="text-brand-cyan font-bold select-none">aditya@portfolio:~$</span>
                    <div className="relative flex-1 flex items-center">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            spellCheck={false}
                            autoComplete="off"
                            placeholder="type 'help', 'skills', 'contact'..."
                            className="w-full bg-transparent outline-none text-white font-mono placeholder:text-zinc-600 text-xs caret-brand-cyan"
                        />
                    </div>
                </div>

                <div ref={bottomRef} />
            </div>

            {/* Matrix rain overlay if activated */}
            {matrixMode && (
                <div className="pointer-events-none absolute inset-0 z-30 bg-black/60 flex items-center justify-center font-mono text-emerald-400 text-sm tracking-widest animate-pulse">
                    [NEURAL MATRIX LINK ACTIVE - WELCOME TO THE CONSTRUCT]
                </div>
            )}
        </div>
    );
}

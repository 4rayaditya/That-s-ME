'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TermIcon, Sparkles, CornerDownLeft } from 'lucide-react';
import { EXECUTE_COMMAND, CommandOutput } from '@/data/terminalCommands';
import { audio } from '@/lib/audio';
import confetti from 'canvas-confetti';

interface TerminalAppProps {
    onReturnToRoom?: () => void;
}

const NEOFETCH_ASCII = [
    '       /\\          ',
    '      /  \\         aditya@ray-archbox',
    '     /\\   \\        ------------------',
    '    /      \\       OS: RayOS 6.10-arch1-zen x86_64',
    '   /   ,,   \\      Host: Custom Cyberdeck Station #01',
    '  /   |  |  -\\     Kernel: 6.10.4-zen1-1-zen',
    ' /_-""    ""-_\\    Uptime: 5 years, 3 months, 12 days',
    '                   Packages: 1284 (pacman), 42 (cargo)',
    '                   Shell: zsh 5.9',
    '                   Resolution: 3840x1600 @ 144Hz (UW-OLED)',
    '                   WM: Hyprland (Wayland)',
    '                   Theme: Obsidian Cyberpunk [GTK3]',
    '                   Terminal: kitty',
    '                   CPU: AMD Ryzen 9 7950X (32) @ 5.700GHz',
    '                   GPU: NVIDIA GeForce RTX 4090 24GB',
    '                   Memory: 14210MiB / 32150MiB',
];

export default function TerminalApp({ onReturnToRoom }: TerminalAppProps) {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<{ command: string; output: CommandOutput[] }[]>([]);
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

            if (trimmed.toLowerCase() === 'room' || trimmed.toLowerCase() === 'exit') {
                if (onReturnToRoom) {
                    onReturnToRoom();
                    return;
                }
            }

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

            const results = EXECUTE_COMMAND(trimmed);
            setHistory((prev) => [...prev, { command: trimmed, output: results }]);
            setInput('');
        }
    };

    return (
        <div
            onClick={() => inputRef.current?.focus()}
            className="p-5 font-mono text-xs text-zinc-300 min-h-[440px] flex flex-col justify-between cursor-text"
        >
            <div className="space-y-4">
                {/* Neofetch Output Header */}
                <div className="text-[11px] leading-tight select-none border-b border-white/5 pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-0.5">
                            {NEOFETCH_ASCII.slice(0, 7).map((line, idx) => (
                                <div key={idx} className="text-brand-cyan font-bold">
                                    {line}
                                </div>
                            ))}
                        </div>
                        <div className="space-y-0.5 text-zinc-300">
                            {NEOFETCH_ASCII.slice(7).map((line, idx) => (
                                <div key={idx}>
                                    <span className="text-zinc-400 font-semibold">{line.split(':')[0]}:</span>
                                    <span className="text-zinc-200">{line.split(':')[1]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Linux Color Palette Blocks */}
                    <div className="mt-3 flex gap-1.5">
                        {['#1e293b', '#f43f5e', '#10b981', '#f59e0b', '#0ea5e9', '#9d4edd', '#00f5d4', '#f1f5f9'].map(
                            (col, idx) => (
                                <div
                                    key={idx}
                                    className="w-4 h-3 rounded-sm shadow-sm"
                                    style={{ backgroundColor: col }}
                                />
                            )
                        )}
                    </div>
                </div>

                {/* Interactive Shell Output */}
                <div className="text-[11px] text-zinc-400">
                    Type <span className="text-brand-cyan font-bold">&quot;help&quot;</span> to inspect system directives, or{' '}
                    <span className="text-brand-cyan font-bold">&quot;room&quot;</span> to return to the Cyberpunk Room.
                </div>

                {/* Command History */}
                {history.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-brand-cyan font-bold">aditya@ray-archbox:~$</span>
                            <span className="text-white font-medium">{item.command}</span>
                        </div>
                        <div className="pl-4 border-l border-white/10 space-y-0.5">
                            {item.output.map((out, oIdx) => (
                                <div
                                    key={oIdx}
                                    className={`${
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

                {/* Active Input Line */}
                <div className="flex items-center gap-2 pt-1">
                    <span className="text-brand-cyan font-bold select-none">aditya@ray-archbox:~$</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        spellCheck={false}
                        autoComplete="off"
                        className="flex-1 bg-transparent outline-none text-white font-mono text-xs caret-brand-cyan"
                    />
                </div>

                <div ref={bottomRef} />
            </div>

            {/* Matrix mode banner */}
            {matrixMode && (
                <div className="p-2 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-center font-bold animate-pulse">
                    [NEURAL STREAM MATRIX ACTIVE - ACCESS LEVEL: ROOT]
                </div>
            )}
        </div>
    );
}

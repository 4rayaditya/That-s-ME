'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Play, RotateCcw, Zap, Sparkles, Magnet, ShieldAlert } from 'lucide-react';
import { audio } from '@/lib/audio';

export default function ParticleSandbox() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mode, setMode] = useState<'attract' | 'repel'>('attract');
    const [colorScheme, setColorScheme] = useState<'neon' | 'cyber' | 'fire'>('neon');
    const [particleCount, setParticleCount] = useState<number>(650);
    const [fps, setFps] = useState<number>(60);

    const modeRef = useRef<'attract' | 'repel'>('attract');
    const colorSchemeRef = useRef<'neon' | 'cyber' | 'fire'>('neon');

    useEffect(() => {
        modeRef.current = mode;
    }, [mode]);

    useEffect(() => {
        colorSchemeRef.current = colorScheme;
    }, [colorScheme]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
        let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

        const handleResize = () => {
            if (!canvas.parentElement) return;
            width = canvas.width = canvas.parentElement.clientWidth;
            height = canvas.height = canvas.parentElement.clientHeight;
        };
        window.addEventListener('resize', handleResize);

        const colorPalettes = {
            neon: ['#00f5d4', '#00b4d8', '#9d4edd', '#ff007f'],
            cyber: ['#00f0ff', '#7000ff', '#ffe600', '#ffffff'],
            fire: ['#ff4d4d', '#ff9f43', '#feca57', '#ff6b6b'],
        };

        interface SandParticle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            color: string;
            alpha: number;
        }

        const particles: SandParticle[] = [];

        const initParticles = () => {
            particles.length = 0;
            const currentPalette = colorPalettes[colorSchemeRef.current];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 1.5,
                    vy: (Math.random() - 0.5) * 1.5,
                    size: Math.random() * 2.5 + 1,
                    color: currentPalette[Math.floor(Math.random() * currentPalette.length)],
                    alpha: Math.random() * 0.7 + 0.3,
                });
            }
        };

        initParticles();

        let mouseX = -9999;
        let mouseY = -9999;
        let isMouseDown = false;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        };

        const handleMouseDown = () => {
            isMouseDown = true;
            audio.playClick();
        };

        const handleMouseUp = () => {
            isMouseDown = false;
        };

        const handleMouseLeave = () => {
            mouseX = -9999;
            mouseY = -9999;
            isMouseDown = false;
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        // Frame rate measurement
        let lastTime = performance.now();
        let frameCount = 0;
        let fpsTimer = 0;

        const loop = (now: number) => {
            const delta = now - lastTime;
            lastTime = now;
            frameCount++;
            fpsTimer += delta;

            if (fpsTimer >= 500) {
                setFps(Math.round((frameCount * 1000) / fpsTimer));
                frameCount = 0;
                fpsTimer = 0;
            }

            // Motion blur fade effect
            ctx.fillStyle = 'rgba(6, 9, 17, 0.25)';
            ctx.fillRect(0, 0, width, height);

            const palette = colorPalettes[colorSchemeRef.current];
            const isAttract = modeRef.current === 'attract';
            const forceMultiplier = isMouseDown ? 3.0 : 1.0;

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Mouse gravity calculation
                const dx = mouseX - p.x;
                const dy = mouseY - p.y;
                const distSq = dx * dx + dy * dy;
                const dist = Math.sqrt(distSq);

                if (dist < 260 && dist > 2) {
                    const force = ((260 - dist) / 260) * 0.45 * forceMultiplier;
                    const dirX = (dx / dist) * force;
                    const dirY = (dy / dist) * force;

                    if (isAttract) {
                        p.vx += dirX;
                        p.vy += dirY;
                    } else {
                        p.vx -= dirX * 1.5;
                        p.vy -= dirY * 1.5;
                    }
                }

                // Drag / friction
                p.vx *= 0.97;
                p.vy *= 0.97;

                p.x += p.vx;
                p.y += p.vy;

                // Screen boundaries bounce
                if (p.x < 0) {
                    p.x = 0;
                    p.vx *= -1;
                } else if (p.x > width) {
                    p.x = width;
                    p.vx *= -1;
                }

                if (p.y < 0) {
                    p.y = 0;
                    p.vy *= -1;
                } else if (p.y > height) {
                    p.y = height;
                    p.vy *= -1;
                }

                // Render particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.fill();
            }

            // Draw cursor influence ring if on canvas
            if (mouseX > 0 && mouseY > 0) {
                ctx.beginPath();
                ctx.arc(mouseX, mouseY, isMouseDown ? 45 : 30, 0, Math.PI * 2);
                ctx.strokeStyle = isAttract ? 'rgba(0, 245, 212, 0.4)' : 'rgba(255, 77, 77, 0.4)';
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }

            animationId = requestAnimationFrame(loop);
        };

        animationId = requestAnimationFrame(loop);

        return () => {
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationId);
        };
    }, [particleCount]);

    const handleBurst = () => {
        audio.playClick();
        const canvas = canvasRef.current;
        if (!canvas) return;
        // Trigger visual pulse
    };

    return (
        <div className="relative w-full rounded-2xl bg-space-950/90 border border-white/10 overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-white/[0.03] border-b border-white/5 select-none">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-xs font-mono font-semibold text-white">
                        <Zap className="w-3.5 h-3.5 text-brand-cyan" />
                        GPGPU Gravity Simulation
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan">
                        {fps} FPS
                    </span>
                    <span className="hidden sm:inline text-[10px] font-mono text-zinc-400">
                        {particleCount} particles
                    </span>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                    {/* Attract / Repel Toggle */}
                    <button
                        onClick={() => {
                            audio.playClick();
                            setMode(mode === 'attract' ? 'repel' : 'attract');
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all ${
                            mode === 'attract'
                                ? 'bg-brand-cyan/20 border border-brand-cyan/50 text-brand-cyan shadow-[0_0_12px_rgba(0,245,212,0.2)]'
                                : 'bg-rose-500/20 border border-rose-500/50 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
                        }`}
                    >
                        {mode === 'attract' ? (
                            <>
                                <Magnet className="w-3.5 h-3.5" />
                                Attract Mode
                            </>
                        ) : (
                            <>
                                <ShieldAlert className="w-3.5 h-3.5" />
                                Repel Mode
                            </>
                        )}
                    </button>

                    {/* Color Scheme Picker */}
                    <button
                        onClick={() => {
                            audio.playClick();
                            const next = colorScheme === 'neon' ? 'cyber' : colorScheme === 'cyber' ? 'fire' : 'neon';
                            setColorScheme(next);
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-mono bg-white/[0.04] border border-white/10 hover:border-white/20 text-zinc-300 transition-all flex items-center gap-1.5"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
                        {colorScheme.toUpperCase()}
                    </button>
                </div>
            </div>

            {/* Interactive Canvas */}
            <div className="relative h-72 sm:h-96 w-full cursor-crosshair">
                <canvas ref={canvasRef} className="w-full h-full block" />
                <div className="pointer-events-none absolute bottom-3 left-4 text-[10px] font-mono text-zinc-400 bg-space-950/60 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/5">
                    Click & drag to manipulate particle gravity field
                </div>
            </div>
        </div>
    );
}

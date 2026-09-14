'use client';

import React, { useRef, useEffect } from 'react';

export default function HeroCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
        let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

        const handleResize = () => {
            if (!canvas.parentElement) return;
            width = canvas.width = canvas.parentElement.clientWidth;
            height = canvas.height = canvas.parentElement.clientHeight;
        };

        window.addEventListener('resize', handleResize);

        // Particle class for 3D sphere projection + floating particles
        interface Particle {
            x: number;
            y: number;
            z: number;
            baseX: number;
            baseY: number;
            baseZ: number;
            vx: number;
            vy: number;
            vz: number;
            size: number;
            color: string;
            alpha: number;
        }

        const particles: Particle[] = [];
        const PARTICLE_COUNT = Math.min(180, Math.floor(width / 7));
        const COLORS = ['#00f5d4', '#00b4d8', '#9d4edd', '#7928ca', '#ffffff'];

        // Generate spherical distribution
        const RADIUS = Math.min(width, height) * 0.35;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const r = RADIUS * Math.cbrt(Math.random()); // Even volume distribution

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            particles.push({
                x,
                y,
                z,
                baseX: x,
                baseY: y,
                baseZ: z,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                vz: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 2.2 + 0.8,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                alpha: Math.random() * 0.7 + 0.3,
            });
        }

        // Mouse tracking with inertia
        let targetRotX = 0;
        let targetRotY = 0;
        let rotX = 0;
        let rotY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left - width / 2;
            const mouseY = e.clientY - rect.top - height / 2;

            targetRotY = (mouseX / width) * 1.5;
            targetRotX = -(mouseY / height) * 1.5;
        };

        window.addEventListener('mousemove', handleMouseMove);

        let time = 0;

        const render = () => {
            time += 0.006;
            ctx.clearRect(0, 0, width, height);

            // Interpolate rotation
            rotX += (targetRotX - rotX) * 0.05;
            rotY += (targetRotY - rotY) * 0.05;

            const cx = width / 2;
            const cy = height / 2;
            const fov = 400;

            // Auto orbital drift
            const currentRotY = rotY + time * 0.4;
            const currentRotX = rotX + Math.sin(time * 0.5) * 0.2;

            const cosY = Math.cos(currentRotY);
            const sinY = Math.sin(currentRotY);
            const cosX = Math.cos(currentRotX);
            const sinX = Math.cos(currentRotX);

            // Projected 2D points cache for drawing links
            const projected: { x: number; y: number; z: number; color: string; alpha: number }[] = [];

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Micro particle drift
                p.baseX += p.vx;
                p.baseY += p.vy;
                p.baseZ += p.vz;

                // Bounce in bounds
                const distSq = p.baseX * p.baseX + p.baseY * p.baseY + p.baseZ * p.baseZ;
                if (distSq > RADIUS * RADIUS * 1.3) {
                    p.vx *= -1;
                    p.vy *= -1;
                    p.vz *= -1;
                }

                // 3D Rotation Matrix
                // Y-axis rotation
                let x1 = p.baseX * cosY - p.baseZ * sinY;
                let z1 = p.baseZ * cosY + p.baseX * sinY;

                // X-axis rotation
                let y1 = p.baseY * cosX - z1 * sinX;
                let z2 = z1 * cosX + p.baseY * sinX;

                // Perspective projection
                const scale = fov / (fov + z2 + RADIUS * 1.2);
                const projX = cx + x1 * scale;
                const projY = cy + y1 * scale;

                projected.push({
                    x: projX,
                    y: projY,
                    z: z2,
                    color: p.color,
                    alpha: Math.max(0.1, Math.min(1, (z2 + RADIUS) / (2 * RADIUS))),
                });

                // Render particle
                const drawSize = Math.max(0.6, p.size * scale);
                ctx.beginPath();
                ctx.arc(projX, projY, drawSize, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = projected[i].alpha * 0.8;
                ctx.fill();

                // Glow ring on closer nodes
                if (scale > 0.9) {
                    ctx.beginPath();
                    ctx.arc(projX, projY, drawSize * 2.2, 0, Math.PI * 2);
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = 0.15;
                    ctx.fill();
                }
            }

            // Draw connecting neural lines between nearby nodes
            const maxLinkDist = 75;
            for (let i = 0; i < projected.length; i++) {
                for (let j = i + 1; j < projected.length; j++) {
                    const dx = projected[i].x - projected[j].x;
                    const dy = projected[i].y - projected[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxLinkDist) {
                        const alpha = (1 - dist / maxLinkDist) * 0.22 * ((projected[i].alpha + projected[j].alpha) / 2);
                        ctx.beginPath();
                        ctx.moveTo(projected[i].x, projected[i].y);
                        ctx.lineTo(projected[j].x, projected[j].y);

                        // Gradient line
                        const grad = ctx.createLinearGradient(
                            projected[i].x,
                            projected[i].y,
                            projected[j].x,
                            projected[j].y
                        );
                        grad.addColorStop(0, projected[i].color);
                        grad.addColorStop(1, projected[j].color);

                        ctx.strokeStyle = grad;
                        ctx.globalAlpha = alpha;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }

            ctx.globalAlpha = 1.0;
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            style={{ filter: 'drop-shadow(0 0 30px rgba(0, 245, 212, 0.15))' }}
        />
    );
}

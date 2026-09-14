'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function MagneticCursor() {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isClicking, setIsClicking] = useState(false);

    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        // Disable custom cursor on touch/mobile devices
        if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
            return;
        }

        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target) return;
            const interactive = target.closest('a, button, input, textarea, [data-interactive="true"], [role="button"]');
            setIsHovered(!!interactive);
        };

        const handleMouseLeave = () => setIsVisible(false);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mouseover', handleMouseOver);
        document.body.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mouseover', handleMouseOver);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [isVisible, mouseX, mouseY]);

    if (!isVisible) return null;

    return (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
            {/* Outer trailing aura */}
            <motion.div
                className="fixed top-0 left-0 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
                style={{
                    x: cursorX,
                    y: cursorY,
                    width: isHovered ? 56 : isClicking ? 28 : 36,
                    height: isHovered ? 56 : isClicking ? 28 : 36,
                    border: isHovered
                        ? '1.5px solid rgba(0, 245, 212, 0.7)'
                        : '1px solid rgba(157, 78, 221, 0.4)',
                    backgroundColor: isHovered
                        ? 'rgba(0, 245, 212, 0.08)'
                        : 'rgba(157, 78, 221, 0.03)',
                    boxShadow: isHovered
                        ? '0 0 20px rgba(0, 245, 212, 0.35)'
                        : '0 0 10px rgba(157, 78, 221, 0.15)',
                    transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1), border 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease',
                }}
            />

            {/* Inner precise dot */}
            <motion.div
                className="fixed top-0 left-0 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
                style={{
                    x: mouseX,
                    y: mouseY,
                    width: isHovered ? 8 : isClicking ? 4 : 6,
                    height: isHovered ? 8 : isClicking ? 4 : 6,
                    backgroundColor: isHovered ? '#00f5d4' : '#ffffff',
                    boxShadow: isHovered ? '0 0 12px #00f5d4' : '0 0 6px rgba(255, 255, 255, 0.8)',
                    transition: 'width 0.15s ease, height 0.15s ease, background-color 0.15s ease',
                }}
            />
        </div>
    );
}

'use client';

import React, { useRef, useState, ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps {
    children: ReactNode;
    className?: string;
    glareColor?: string;
    tiltDegree?: number;
    onClick?: () => void;
    onMouseEnter?: () => void;
}

export default function TiltCard({
    children,
    className = '',
    glareColor = 'rgba(0, 245, 212, 0.15)',
    tiltDegree = 12,
    onClick,
    onMouseEnter,
}: TiltCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const x = useMotionValue(0.5);
    const y = useMotionValue(0.5);

    const mouseXSpring = useSpring(x, { stiffness: 220, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 220, damping: 20 });

    const rotateX = useTransform(mouseYSpring, [0, 1], [tiltDegree, -tiltDegree]);
    const rotateY = useTransform(mouseXSpring, [0, 1], [-tiltDegree, tiltDegree]);

    const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();

        const clientX = (e.clientX - rect.left) / rect.width;
        const clientY = (e.clientY - rect.top) / rect.height;

        x.set(clientX);
        y.set(clientY);
        setGlarePos({ x: clientX * 100, y: clientY * 100 });
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (onMouseEnter) onMouseEnter();
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0.5);
        y.set(0.5);
    };

    return (
        <div style={{ perspective: '1200px' }} className="w-full h-full">
            <motion.div
                ref={cardRef}
                onClick={onClick}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d',
                }}
                className={`relative overflow-hidden transition-shadow duration-300 rounded-2xl ${className}`}
            >
                {/* 3D Content Container */}
                <div style={{ transform: 'translateZ(24px)' }} className="relative z-10 w-full h-full">
                    {children}
                </div>

                {/* Specular Spotlight Glare Overlay */}
                <div
                    className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
                    style={{
                        opacity: isHovered ? 1 : 0,
                        background: `radial-gradient(circle 320px at ${glarePos.x}% ${glarePos.y}%, ${glareColor}, transparent 70%)`,
                    }}
                />

                {/* Subtle border shine */}
                <div
                    className="pointer-events-none absolute inset-0 z-30 rounded-2xl transition-opacity duration-300 border border-white/10"
                    style={{
                        borderColor: isHovered ? 'rgba(0, 245, 212, 0.35)' : 'rgba(255, 255, 255, 0.08)',
                    }}
                />
            </motion.div>
        </div>
    );
}

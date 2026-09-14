'use client';

import React, { useRef, useState } from 'react';
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

function Win7Btn({ children, onClick, title, variant }: {
    children: React.ReactNode;
    onClick: (e: React.MouseEvent) => void;
    title: string;
    variant: 'blue' | 'red';
}) {
    const [hover, setHover] = useState(false);
    const bgNormal = variant === 'red'
        ? 'linear-gradient(180deg, rgba(255,160,150,0.85) 0%, rgba(230,65,45,0.78) 50%, rgba(200,35,25,0.85) 100%)'
        : 'linear-gradient(180deg, rgba(225,238,255,0.70) 0%, rgba(155,198,252,0.55) 50%, rgba(100,160,230,0.65) 100%)';
    const bgHover = variant === 'red'
        ? 'linear-gradient(180deg, rgba(255,200,190,0.98) 0%, rgba(240,90,70,0.95) 50%, rgba(220,45,35,0.98) 100%)'
        : 'linear-gradient(180deg, rgba(240,248,255,0.92) 0%, rgba(180,215,255,0.78) 50%, rgba(120,175,240,0.82) 100%)';
    const border = variant === 'red' ? 'rgba(200,45,35,0.72)' : 'rgba(80,140,210,0.55)';
    return (
        <button onClick={onClick} title={title}
            onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
            style={{
                width: 26, height: 22, borderRadius: 4,
                background: hover ? bgHover : bgNormal,
                border: `1px solid ${border}`,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.52)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'background 0.1s',
            }}>
            {children}
        </button>
    );
}

export default function WindowsWindowFrame({
    id, title, icon, subtitle, children, isActive, isMinimized, isMaximized,
    onFocus, onMinimize, onMaximizeToggle, onClose,
    initialPosition = { x: 120, y: 50 },
    initialSize = { width: 880, height: 600 },
    minWidth = 480,
    minHeight = 360,
}: WindowsWindowFrameProps) {
    const [position, setPosition] = useState(initialPosition);
    const [size] = useState(initialSize);
    const isDragging = useRef(false);
    const dragStart = useRef({ mouseX: 0, mouseY: 0, winX: 0, winY: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        if (isMaximized) return;
        if ((e.target as HTMLElement).closest('button')) return;
        onFocus();
        isDragging.current = true;
        dragStart.current = { mouseX: e.clientX, mouseY: e.clientY, winX: position.x, winY: position.y };
        const onMove = (ev: MouseEvent) => {
            if (!isDragging.current) return;
            setPosition({
                x: Math.max(-200, Math.min(window.innerWidth - 150, dragStart.current.winX + ev.clientX - dragStart.current.mouseX)),
                y: Math.max(0, Math.min(window.innerHeight - 80, dragStart.current.winY + ev.clientY - dragStart.current.mouseY)),
            });
        };
        const onUp = () => {
            isDragging.current = false;
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    };

    if (isMinimized) return null;

    const aeroBase = isActive ? 'rgba(190,215,255,0.35)' : 'rgba(190,215,255,0.18)';
    const aeroBorder = isActive ? 'rgba(155,200,255,0.55)' : 'rgba(155,200,255,0.25)';
    const titleBg = isActive
        ? 'linear-gradient(180deg, rgba(220,235,255,0.65) 0%, rgba(165,205,255,0.48) 40%, rgba(115,172,245,0.40) 100%)'
        : 'linear-gradient(180deg, rgba(200,220,255,0.36) 0%, rgba(135,178,235,0.22) 100%)';

    return (
        <div
            id={`window-${id}`}
            className="window-frame absolute flex flex-col select-none"
            onMouseDown={onFocus}
            style={{
                left: isMaximized ? 0 : `${position.x}px`,
                top: isMaximized ? 0 : `${position.y}px`,
                width: isMaximized ? '100vw' : `${Math.min(size.width, typeof window !== 'undefined' ? window.innerWidth - 20 : size.width)}px`,
                height: isMaximized ? 'calc(100vh - 40px)' : `${Math.min(size.height, typeof window !== 'undefined' ? window.innerHeight - 80 : size.height)}px`,
                borderRadius: isMaximized ? 0 : 8,
                overflow: 'hidden',
                background: aeroBase,
                backdropFilter: 'blur(24px) saturate(1.8)',
                WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
                border: `1px solid ${aeroBorder}`,
                boxShadow: isActive
                    ? '0 8px 40px rgba(0,0,0,0.52), inset 0 1px 0 rgba(255,255,255,0.45)'
                    : '0 4px 20px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.22)',
            }}
        >
            {/* Win7 Aero Title Bar */}
            <div
                onMouseDown={handleMouseDown}
                onDoubleClick={onMaximizeToggle}
                style={{
                    height: 32, display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', padding: '0 8px',
                    cursor: 'default', position: 'relative', flexShrink: 0,
                    background: titleBg,
                    borderBottom: '1px solid rgba(100,155,225,0.40)',
                }}
            >
                {/* Top glass gloss line */}
                <div style={{
                    position: 'absolute', top: 0, left: 4, right: 4, height: 1,
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.80) 30%, rgba(255,255,255,0.90) 50%, rgba(255,255,255,0.80) 70%, transparent)',
                }} />
                {/* Icon + Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden', flex: 1 }}>
                    <div style={{ width: 16, height: 16, flexShrink: 0 }}>{icon}</div>
                    <span style={{
                        fontSize: 12, fontWeight: 600,
                        color: isActive ? '#152040' : '#3a4f72',
                        textShadow: '0 1px 0 rgba(255,255,255,0.65)',
                        fontFamily: '"Segoe UI",Tahoma,sans-serif',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                        {title}
                    </span>
                </div>
                {/* Control Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                    <Win7Btn variant="blue" title="Minimize"
                        onClick={(e) => { e.stopPropagation(); audio.playClick(); onMinimize(); }}>
                        <svg width="10" height="2" viewBox="0 0 10 2">
                            <rect x="0" y="0" width="10" height="2" fill="#1e3a6a" rx="1"/>
                        </svg>
                    </Win7Btn>
                    <Win7Btn variant="blue" title={isMaximized ? 'Restore' : 'Maximize'}
                        onClick={(e) => { e.stopPropagation(); audio.playClick(); onMaximizeToggle(); }}>
                        {isMaximized ? (
                            <svg width="10" height="10" viewBox="0 0 10 10">
                                <rect x="2" y="0" width="8" height="8" rx="1" fill="none" stroke="#1e3a6a" strokeWidth="1.5"/>
                                <rect x="0" y="2" width="8" height="8" rx="1" fill="rgba(180,210,255,0.4)" stroke="#1e3a6a" strokeWidth="1.5"/>
                            </svg>
                        ) : (
                            <svg width="10" height="10" viewBox="0 0 10 10">
                                <rect x="0.75" y="0.75" width="8.5" height="8.5" rx="1" fill="none" stroke="#1e3a6a" strokeWidth="1.5"/>
                            </svg>
                        )}
                    </Win7Btn>
                    <Win7Btn variant="red" title="Close"
                        onClick={(e) => { e.stopPropagation(); audio.playClick(); onClose(); }}>
                        <svg width="9" height="9" viewBox="0 0 9 9">
                            <line x1="1" y1="1" x2="8" y2="8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                            <line x1="8" y1="1" x2="1" y2="8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                        </svg>
                    </Win7Btn>
                </div>
            </div>
            {/* Client area - light like Win7 */}
            <div style={{
                flex: 1, overflow: 'hidden',
                background: 'rgba(245,248,252,0.97)',
                display: 'flex', flexDirection: 'column',
            }}>
                {children}
            </div>
        </div>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, Volume2, VolumeX, BatteryCharging } from 'lucide-react';
import { audio } from '@/lib/audio';

// Windows 7 pearl orb logo
const Win7Orb = ({ active }: { active: boolean }) => (
    <div style={{
        width: 52, height: 52, borderRadius: '50%',
        background: active
            ? 'radial-gradient(circle at 38% 30%, rgba(255,255,255,0.90) 0%, rgba(100,175,255,0.85) 35%, rgba(40,120,220,0.95) 65%, rgba(20,80,180,1.0) 100%)'
            : 'radial-gradient(circle at 38% 30%, rgba(255,255,255,0.75) 0%, rgba(80,155,240,0.80) 35%, rgba(30,105,210,0.90) 65%, rgba(15,70,165,1.0) 100%)',
        boxShadow: active
            ? '0 0 18px rgba(80,150,255,0.70), 0 2px 8px rgba(0,0,0,0.50)'
            : '0 0 10px rgba(60,130,230,0.40), 0 2px 6px rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s',
        flexShrink: 0,
        marginLeft: -2,
        zIndex: 5,
        cursor: 'pointer',
    }}>
        {/* Windows 4-pane logo */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, width: 18, height: 18 }}>
            {[0,1,2,3].map(i => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 1.5 }} />
            ))}
        </div>
    </div>
);

interface OpenWindowInfo { id: string; title: string; isMinimized: boolean; isActive: boolean; }
interface WindowsTaskbarProps {
    isStartMenuOpen: boolean; onToggleStartMenu: () => void;
    openWindows: OpenWindowInfo[]; onTaskbarAppClick: (appId: string) => void; onShowDesktop: () => void;
}

export default function WindowsTaskbar({ isStartMenuOpen, onToggleStartMenu, openWindows, onTaskbarAppClick, onShowDesktop }: WindowsTaskbarProps) {
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        setIsMuted(audio.getMuted());
        const updateClock = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
            setCurrentDate(now.toLocaleDateString([], { month: '2-digit', day: '2-digit', year: 'numeric' }));
        };
        updateClock();
        const timer = setInterval(updateClock, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleToggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        const muted = audio.toggleMute();
        setIsMuted(muted);
    };

    // Win7 Aero glass taskbar style
    const taskbarBg = 'linear-gradient(180deg, rgba(60,90,140,0.72) 0%, rgba(30,55,110,0.85) 40%, rgba(15,35,88,0.92) 100%)';
    const taskbarBorder = '1px solid rgba(100,155,230,0.45)';

    return (
        <div style={{
            position: 'relative',
            height: 40, display: 'flex', alignItems: 'center',
            background: taskbarBg,
            backdropFilter: 'blur(18px) saturate(1.6)',
            WebkitBackdropFilter: 'blur(18px) saturate(1.6)',
            borderTop: taskbarBorder,
            boxShadow: '0 -2px 12px rgba(0,0,0,0.38), inset 0 1px 0 rgba(140,190,255,0.22)',
            zIndex: 40, flexShrink: 0,
            fontFamily: '"Segoe UI", Tahoma, sans-serif',
        }}>
            {/* Top shine */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(140,190,255,0.50) 20%, rgba(180,215,255,0.65) 50%, rgba(140,190,255,0.50) 80%, transparent)',
            }} />

            {/* START ORB */}
            <button
                onClick={() => { audio.playClick(); onToggleStartMenu(); }}
                title="Start"
                style={{ background: 'none', border: 'none', padding: '0 0 0 4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
                <Win7Orb active={isStartMenuOpen} />
            </button>

            {/* Quick launch separator */}
            <div style={{ width: 1, height: 28, background: 'rgba(140,190,255,0.28)', margin: '0 6px' }} />

            {/* Open window buttons */}
            <div className="custom-scrollbar" style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, overflowX: 'auto', overflowY: 'hidden', paddingRight: 8 }}>
                {openWindows.map((win) => (
                    <button
                        key={win.id}
                        onClick={() => onTaskbarAppClick(win.id)}
                        title={win.title}
                        style={{
                            height: 32, maxWidth: 160, flexShrink: 0, padding: '0 10px',
                            borderRadius: 3,
                            background: win.isActive && !win.isMinimized
                                ? 'linear-gradient(180deg, rgba(180,215,255,0.35) 0%, rgba(100,165,245,0.28) 50%, rgba(50,120,220,0.38) 100%)'
                                : win.isMinimized
                                ? 'linear-gradient(180deg, rgba(100,140,200,0.22) 0%, rgba(60,100,180,0.18) 100%)'
                                : 'linear-gradient(180deg, rgba(140,185,245,0.25) 0%, rgba(80,140,230,0.20) 100%)',
                            border: win.isActive && !win.isMinimized
                                ? '1px solid rgba(130,185,255,0.55)'
                                : '1px solid rgba(110,160,240,0.30)',
                            boxShadow: win.isActive && !win.isMinimized
                                ? 'inset 0 1px 0 rgba(255,255,255,0.20), 0 1px 3px rgba(0,0,0,0.20)'
                                : 'none',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center',
                            fontSize: 12, color: 'rgba(230,240,255,0.95)',
                            textShadow: '0 1px 2px rgba(0,0,0,0.55)',
                            fontFamily: '"Segoe UI", Tahoma, sans-serif',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            transition: 'all 0.1s',
                        }}
                        onMouseEnter={e => {
                            if (!win.isActive || win.isMinimized) {
                                e.currentTarget.style.background = 'linear-gradient(180deg, rgba(180,215,255,0.32) 0%, rgba(100,165,245,0.25) 100%)';
                            }
                        }}
                        onMouseLeave={e => {
                            if (!win.isActive || win.isMinimized) {
                                e.currentTarget.style.background = win.isMinimized
                                    ? 'linear-gradient(180deg, rgba(100,140,200,0.22) 0%, rgba(60,100,180,0.18) 100%)'
                                    : 'linear-gradient(180deg, rgba(140,185,245,0.25) 0%, rgba(80,140,230,0.20) 100%)';
                            }
                        }}
                    >
                        {win.title.split(' — ')[0].split(' //')[0].split(' - ')[0]}
                    </button>
                ))}
            </div>

            {/* System Tray */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '0 8px',
                height: '100%',
                borderLeft: '1px solid rgba(100,155,230,0.25)',
            }}>
                {/* Volume */}
                <button onClick={handleToggleMute} title={isMuted ? 'Unmute' : 'Mute'}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: 2, color: 'rgba(210,230,255,0.85)' }}>
                    {isMuted ? <VolumeX style={{ width: 14, height: 14 }} /> : <Volume2 style={{ width: 14, height: 14 }} />}
                </button>
                <Wifi className="hidden sm:block" style={{ width: 14, height: 14, color: 'rgba(210,230,255,0.75)' }} />
                <BatteryCharging className="hidden sm:block" style={{ width: 14, height: 14, color: 'rgba(210,230,255,0.75)' }} />
                {/* Clock */}
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    marginLeft: 6, cursor: 'default',
                }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(230,242,255,0.96)', lineHeight: 1.2, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                        {currentTime}
                    </span>
                    <span className="hidden sm:block" style={{ fontSize: 10, color: 'rgba(190,215,250,0.80)', lineHeight: 1.1 }}>
                        {currentDate}
                    </span>
                </div>
                {/* Show Desktop button */}
                <button
                    onClick={onShowDesktop}
                    title="Show Desktop"
                    style={{
                        width: 8, height: 32, cursor: 'pointer',
                        background: 'rgba(140,185,240,0.22)',
                        border: '1px solid rgba(120,170,230,0.35)',
                        borderRadius: 2, marginLeft: 6,
                        transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(180,215,255,0.35)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(140,185,240,0.22)')}
                />
            </div>
        </div>
    );
}

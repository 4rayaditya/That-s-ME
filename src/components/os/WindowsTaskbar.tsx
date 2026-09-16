'use client';

import React, { useState, useEffect } from 'react';
import {
    Wifi,
    WifiOff,
    Volume2,
    VolumeX,
    BatteryCharging,
    Battery,
    Zap,
    Check,
    Lock,
    RefreshCw,
    Sun,
    ChevronRight,
    Activity,
    ShieldCheck,
} from 'lucide-react';
import { audio } from '@/lib/audio';
import { useIsMobile } from '@/lib/useIsMobile';

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
            {[0, 1, 2, 3].map(i => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 1.5 }} />
            ))}
        </div>
    </div>
);

interface OpenWindowInfo { id: string; title: string; isMinimized: boolean; isActive: boolean; }
interface WindowsTaskbarProps {
    isStartMenuOpen: boolean;
    onToggleStartMenu: () => void;
    openWindows: OpenWindowInfo[];
    onTaskbarAppClick: (appId: string) => void;
    onShowDesktop: () => void;
}

interface NetworkItem {
    id: string;
    name: string;
    bars: number;
    secure: boolean;
    speed: string;
}

export default function WindowsTaskbar({
    isStartMenuOpen,
    onToggleStartMenu,
    openWindows,
    onTaskbarAppClick,
    onShowDesktop,
}: WindowsTaskbarProps) {
    const isMobile = useIsMobile();
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [isMuted, setIsMuted] = useState(false);

    // Tray Popover States
    const [activeTrayPopup, setActiveTrayPopup] = useState<'wifi' | 'battery' | null>(null);

    // WiFi States
    const [isWifiConnected, setIsWifiConnected] = useState(true);
    const [activeNetworkName, setActiveNetworkName] = useState('Aditya_Battlestation_5G');
    const [isConnecting, setIsConnecting] = useState(false);

    // Battery & Power States
    const [batteryLevel, setBatteryLevel] = useState(98);
    const [powerPlan, setPowerPlan] = useState<'performance' | 'balanced' | 'saver'>('performance');
    const [brightness, setBrightness] = useState(100);

    const AVAILABLE_NETWORKS: NetworkItem[] = [
        { id: 'home', name: 'Aditya_Battlestation_5G', bars: 5, secure: true, speed: '1.2 Gbps' },
        { id: 'mesh', name: 'CyberLounge_Mesh_5G', bars: 4, secure: true, speed: '850 Mbps' },
        { id: 'fiber', name: 'Neural_Fiber_Edge', bars: 3, secure: true, speed: '10 Gbps' },
        { id: 'guest', name: 'Portfolio_Guest_Hotspot', bars: 3, secure: false, speed: '120 Mbps' },
    ];

    useEffect(() => {
        setIsMuted(audio.getMuted());
        const updateClock = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
            setCurrentDate(now.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' }));
        };
        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, []);

    // Try reading real Battery API if supported by browser
    useEffect(() => {
        if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
            (navigator as any).getBattery?.().then((battery: any) => {
                const updateBat = () => {
                    setBatteryLevel(Math.round(battery.level * 100));
                };
                updateBat();
                battery.addEventListener('levelchange', updateBat);
            }).catch(() => {});
        }
    }, []);

    // Close tray popovers when user clicks anywhere on desktop
    useEffect(() => {
        const handleGlobalClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('[data-tray-popup]') && !target.closest('[data-tray-btn]')) {
                setActiveTrayPopup(null);
            }
        };
        window.addEventListener('mousedown', handleGlobalClick);
        return () => window.removeEventListener('mousedown', handleGlobalClick);
    }, []);

    const handleToggleMute = () => {
        const muted = audio.toggleMute();
        setIsMuted(muted);
    };

    const handleNetworkSelect = (net: NetworkItem) => {
        if (net.name === activeNetworkName && isWifiConnected) return;
        setIsConnecting(true);
        audio.playClick();
        setTimeout(() => {
            setActiveNetworkName(net.name);
            setIsWifiConnected(true);
            setIsConnecting(false);
            audio.playClick();
        }, 700);
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
                            height: 32, maxWidth: isMobile ? 110 : 160, flexShrink: 0, padding: isMobile ? '0 6px' : '0 10px',
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
                display: 'flex', alignItems: 'center', gap: 3,
                padding: '0 8px',
                height: '100%',
                borderLeft: '1px solid rgba(100,155,230,0.25)',
                position: 'relative',
            }}>
                {/* Volume Button */}
                <button
                    onClick={handleToggleMute}
                    title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                    style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        padding: '4px 5px', borderRadius: 2,
                        color: 'rgba(210,230,255,0.85)',
                        transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(180,215,255,0.22)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                    {isMuted ? <VolumeX style={{ width: 14, height: 14 }} /> : <Volume2 style={{ width: 14, height: 14 }} />}
                </button>

                {/* 1. WORKABLE WIFI BUTTON */}
                <button
                    data-tray-btn="wifi"
                    onClick={(e) => {
                        e.stopPropagation();
                        audio.playClick();
                        setActiveTrayPopup(prev => prev === 'wifi' ? null : 'wifi');
                    }}
                    title={isWifiConnected ? `Connected to ${activeNetworkName}` : 'WiFi Disconnected'}
                    style={{
                        background: activeTrayPopup === 'wifi' ? 'rgba(180,215,255,0.35)' : 'none',
                        border: activeTrayPopup === 'wifi' ? '1px solid rgba(130,185,255,0.55)' : '1px solid transparent',
                        cursor: 'pointer', padding: '4px 5px', borderRadius: 2,
                        color: isWifiConnected ? 'rgba(210,230,255,0.95)' : 'rgba(255,140,140,0.85)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                        if (activeTrayPopup !== 'wifi') e.currentTarget.style.background = 'rgba(180,215,255,0.22)';
                    }}
                    onMouseLeave={e => {
                        if (activeTrayPopup !== 'wifi') e.currentTarget.style.background = 'none';
                    }}
                >
                    {isWifiConnected ? <Wifi style={{ width: 14, height: 14 }} /> : <WifiOff style={{ width: 14, height: 14 }} />}
                </button>

                {/* 2. WORKABLE BATTERY BUTTON */}
                <button
                    data-tray-btn="battery"
                    onClick={(e) => {
                        e.stopPropagation();
                        audio.playClick();
                        setActiveTrayPopup(prev => prev === 'battery' ? null : 'battery');
                    }}
                    title={`${batteryLevel}% available (plugged in, charging)`}
                    style={{
                        background: activeTrayPopup === 'battery' ? 'rgba(180,215,255,0.35)' : 'none',
                        border: activeTrayPopup === 'battery' ? '1px solid rgba(130,185,255,0.55)' : '1px solid transparent',
                        cursor: 'pointer', padding: '4px 5px', borderRadius: 2,
                        color: 'rgba(210,230,255,0.95)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                        if (activeTrayPopup !== 'battery') e.currentTarget.style.background = 'rgba(180,215,255,0.22)';
                    }}
                    onMouseLeave={e => {
                        if (activeTrayPopup !== 'battery') e.currentTarget.style.background = 'none';
                    }}
                >
                    <BatteryCharging style={{ width: 14, height: 14 }} />
                </button>

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

                {/* ============================================================ */}
                {/* 1. AUTHENTIC WINDOWS 7 AERO WIFI FLYOUT POPOVER             */}
                {/* ============================================================ */}
                {activeTrayPopup === 'wifi' && (
                    <div
                        data-tray-popup="wifi"
                        style={{
                            position: 'absolute',
                            bottom: 46, right: isMobile ? 8 : 38,
                            width: 295, maxWidth: 'calc(100vw - 16px)',
                            background: 'linear-gradient(180deg, rgba(22,44,80,0.95) 0%, rgba(12,25,50,0.98) 100%)',
                            border: '1px solid rgba(135,190,255,0.60)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.28)',
                            borderRadius: 5,
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            padding: '12px 14px',
                            color: 'rgba(230,242,255,0.95)',
                            fontFamily: '"Segoe UI", Tahoma, sans-serif',
                            fontSize: 12,
                            zIndex: 60,
                        }}
                    >
                        {/* Title */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', marginBottom: 8, borderBottom: '1px solid rgba(140,190,255,0.20)', paddingBottom: 6 }}>
                            <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(190,220,255,0.85)' }}>
                                Wireless Network Connection
                            </span>
                            {isConnecting && (
                                <RefreshCw className="animate-spin" style={{ width: 11, height: 11, color: '#38bdf8', marginLeft: 'auto' }} />
                            )}
                        </div>

                        {/* Currently Connected Network Card */}
                        <div style={{
                            padding: '8px 10px',
                            background: isWifiConnected ? 'rgba(56,189,248,0.12)' : 'rgba(239,68,68,0.10)',
                            border: isWifiConnected ? '1px solid rgba(56,189,248,0.40)' : '1px solid rgba(239,68,68,0.30)',
                            borderRadius: 3,
                            marginBottom: 10,
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    {isWifiConnected ? (
                                        <Wifi style={{ width: 15, height: 15, color: '#38bdf8' }} />
                                    ) : (
                                        <WifiOff style={{ width: 15, height: 15, color: '#f87171' }} />
                                    )}
                                    <span style={{ fontWeight: 600, fontSize: 12, color: '#ffffff' }}>
                                        {activeNetworkName}
                                    </span>
                                </div>
                                <span style={{
                                    fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                                    padding: '2px 5px', borderRadius: 2,
                                    background: isWifiConnected ? 'rgba(56,189,248,0.25)' : 'rgba(239,68,68,0.25)',
                                    color: isWifiConnected ? '#7dd3fc' : '#fca5a5',
                                }}>
                                    {isWifiConnected ? 'Connected' : 'Off'}
                                </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: 'rgba(200,225,255,0.75)' }}>
                                <span>{isWifiConnected ? 'Internet access • 1.2 Gbps' : 'No connection'}</span>
                                <button
                                    onClick={() => {
                                        audio.playClick();
                                        setIsWifiConnected(!isWifiConnected);
                                    }}
                                    style={{
                                        background: 'rgba(255,255,255,0.12)',
                                        border: '1px solid rgba(255,255,255,0.30)',
                                        borderRadius: 2, padding: '2px 8px',
                                        fontSize: 10, color: '#fff', cursor: 'pointer',
                                    }}
                                >
                                    {isWifiConnected ? 'Disconnect' : 'Connect'}
                                </button>
                            </div>
                        </div>

                        {/* Available Networks List */}
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(190,220,255,0.85)', marginBottom: 6 }}>
                            Available Networks
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 150, overflowY: 'auto' }}>
                            {AVAILABLE_NETWORKS.map((net) => {
                                const isCurrent = isWifiConnected && activeNetworkName === net.name;
                                return (
                                    <div
                                        key={net.id}
                                        onClick={() => handleNetworkSelect(net)}
                                        style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            padding: '6px 8px', borderRadius: 3,
                                            background: isCurrent ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.04)',
                                            border: isCurrent ? '1px solid rgba(135,190,255,0.45)' : '1px solid transparent',
                                            cursor: 'pointer',
                                            transition: 'background 0.12s',
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = isCurrent ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.04)')}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Wifi style={{ width: 13, height: 13, color: isCurrent ? '#38bdf8' : 'rgba(200,225,255,0.65)' }} />
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: 11, color: isCurrent ? '#fff' : 'rgba(230,242,255,0.90)', fontWeight: isCurrent ? 600 : 400 }}>
                                                    {net.name}
                                                </span>
                                                <span style={{ fontSize: 9, color: 'rgba(180,210,245,0.60)' }}>
                                                    {net.speed}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            {net.secure && <Lock style={{ width: 10, height: 10, color: 'rgba(200,225,255,0.50)' }} />}
                                            {isCurrent && <Check style={{ width: 12, height: 12, color: '#38bdf8' }} />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer Action Link */}
                        <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(140,190,255,0.20)' }}>
                            <button
                                onClick={() => {
                                    audio.playClick();
                                    setActiveTrayPopup(null);
                                    onTaskbarAppClick('mail');
                                }}
                                style={{
                                    background: 'none', border: 'none',
                                    color: '#7dd3fc', fontSize: 11, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: 3,
                                    padding: 0, textDecoration: 'underline',
                                }}
                            >
                                <span>Open Network and Sharing Center</span>
                                <ChevronRight style={{ width: 11, height: 11 }} />
                            </button>
                        </div>
                    </div>
                )}

                {/* ============================================================ */}
                {/* 2. AUTHENTIC WINDOWS 7 AERO BATTERY FLYOUT POPOVER           */}
                {/* ============================================================ */}
                {activeTrayPopup === 'battery' && (
                    <div
                        data-tray-popup="battery"
                        style={{
                            position: 'absolute',
                            bottom: 46, right: isMobile ? 8 : 10,
                            width: 285, maxWidth: 'calc(100vw - 16px)',
                            background: 'linear-gradient(180deg, rgba(22,44,80,0.95) 0%, rgba(12,25,50,0.98) 100%)',
                            border: '1px solid rgba(135,190,255,0.60)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.28)',
                            borderRadius: 5,
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            padding: '12px 14px',
                            color: 'rgba(230,242,255,0.95)',
                            fontFamily: '"Segoe UI", Tahoma, sans-serif',
                            fontSize: 12,
                            zIndex: 60,
                        }}
                    >
                        {/* Title Header with Battery Visual */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 10, borderBottom: '1px solid rgba(140,190,255,0.20)' }}>
                            <div style={{
                                width: 34, height: 34, borderRadius: '50%',
                                background: 'rgba(56,189,248,0.18)',
                                border: '1px solid rgba(56,189,248,0.45)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#38bdf8',
                            }}>
                                <BatteryCharging style={{ width: 18, height: 18 }} />
                            </div>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>
                                    {batteryLevel}% remaining
                                </div>
                                <div style={{ fontSize: 10, color: 'rgba(180,215,250,0.75)' }}>
                                    Plugged in, charging (AC Wall Power)
                                </div>
                            </div>
                        </div>

                        {/* Power Plans Selector */}
                        <div style={{ marginTop: 10 }}>
                            <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(190,220,255,0.85)', marginBottom: 6 }}>
                                Select a Power Plan:
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                {[
                                    { id: 'performance', name: 'High Performance', desc: 'Unlocked 60 FPS WebGL & RTX GPU', icon: <Zap style={{ width: 12, height: 12, color: '#facc15' }} /> },
                                    { id: 'balanced', name: 'Balanced', desc: 'Optimal frame rate & battery life', icon: <Activity style={{ width: 12, height: 12, color: '#38bdf8' }} /> },
                                    { id: 'saver', name: 'Power Saver', desc: 'Battery conservation mode', icon: <ShieldCheck style={{ width: 12, height: 12, color: '#4ade80' }} /> },
                                ].map(plan => {
                                    const isSelected = powerPlan === plan.id;
                                    return (
                                        <div
                                            key={plan.id}
                                            onClick={() => {
                                                audio.playClick();
                                                setPowerPlan(plan.id as any);
                                            }}
                                            style={{
                                                display: 'flex', alignItems: 'flex-start', gap: 7,
                                                padding: '6px 8px', borderRadius: 3,
                                                background: isSelected ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.03)',
                                                border: isSelected ? '1px solid rgba(135,190,255,0.40)' : '1px solid transparent',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                name="powerPlan"
                                                checked={isSelected}
                                                onChange={() => setPowerPlan(plan.id as any)}
                                                style={{ marginTop: 2, cursor: 'pointer' }}
                                            />
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: 11, fontWeight: isSelected ? 600 : 400, color: isSelected ? '#ffffff' : 'rgba(220,235,255,0.85)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    {plan.icon}
                                                    {plan.name}
                                                </span>
                                                <span style={{ fontSize: 9, color: 'rgba(180,210,245,0.60)' }}>
                                                    {plan.desc}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Adjust Display Brightness */}
                        <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(140,190,255,0.18)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span style={{ fontSize: 10, color: 'rgba(190,220,255,0.85)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Sun style={{ width: 11, height: 11, color: '#facc15' }} />
                                    Adjust display brightness
                                </span>
                                <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>
                                    {brightness}%
                                </span>
                            </div>
                            <input
                                type="range"
                                min={20}
                                max={100}
                                value={brightness}
                                onChange={(e) => setBrightness(Number(e.target.value))}
                                style={{ width: '100%', height: 4, cursor: 'pointer', accentColor: '#38bdf8' }}
                            />
                        </div>

                        {/* Footer Action Link */}
                        <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(140,190,255,0.20)' }}>
                            <button
                                onClick={() => {
                                    audio.playClick();
                                    setActiveTrayPopup(null);
                                    onTaskbarAppClick('skills');
                                }}
                                style={{
                                    background: 'none', border: 'none',
                                    color: '#7dd3fc', fontSize: 11, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: 3,
                                    padding: 0, textDecoration: 'underline',
                                }}
                            >
                                <span>More power options...</span>
                                <ChevronRight style={{ width: 11, height: 11 }} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

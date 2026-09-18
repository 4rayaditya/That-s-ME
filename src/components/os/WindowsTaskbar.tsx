'use client';

import React, { useState, useEffect } from 'react';
import {
    Wifi,
    WifiOff,
    Volume,
    Volume1,
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

// Windows 7 5-bar green signal indicator
const Win7SignalBars = ({ bars = 5 }: { bars?: number }) => (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height: 14 }}>
        {[1, 2, 3, 4, 5].map((level) => (
            <div
                key={level}
                style={{
                    width: 2.5,
                    height: level * 2.6,
                    borderRadius: 0.5,
                    background: level <= bars
                        ? 'linear-gradient(180deg, #3cd070 0%, #16a34a 60%, #15803d 100%)'
                        : '#cbd5e1',
                    border: level <= bars ? '0.5px solid #166534' : '0.5px solid #94a3b8',
                }}
            />
        ))}
    </div>
);

// Windows 7 "Connections are available" icon with golden star
const Win7AvailableIcon = () => (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'flex-end', height: 16, width: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height: 14 }}>
            {[1, 2, 3, 4, 5].map((level) => (
                <div
                    key={level}
                    style={{
                        width: 2.5,
                        height: level * 2.6,
                        borderRadius: 0.5,
                        background: '#94a3b8',
                        border: '0.5px solid #64748b',
                    }}
                />
            ))}
        </div>
        {/* Golden amber star emblem */}
        <div style={{
            position: 'absolute', right: -2, bottom: -1,
            color: '#f59e0b', fontSize: 13, lineHeight: 1,
            filter: 'drop-shadow(0 0 2px rgba(245, 158, 11, 0.8))',
        }}>
            ✦
        </div>
    </div>
);

// Windows 7 battery meter graphic
const Win7BatteryMeter = ({ level = 98, isCharging = true }: { level: number; isCharging?: boolean }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{
            width: 36, height: 18, borderRadius: 2,
            border: '1.5px solid #475569',
            padding: 1.5, position: 'relative',
            background: 'linear-gradient(180deg, #ffffff 0%, #e2e8f0 100%)',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.25)',
        }}>
            <div style={{
                width: `${Math.max(4, Math.min(100, level))}%`,
                height: '100%',
                borderRadius: 1,
                background: level > 20
                    ? 'linear-gradient(180deg, #4ade80 0%, #16a34a 50%, #15803d 100%)'
                    : 'linear-gradient(180deg, #f87171 0%, #dc2626 50%, #991b1b 100%)',
                boxShadow: '0 0 3px rgba(34,197,94,0.4)',
            }} />
            {isCharging && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap style={{ width: 11, height: 11, color: '#eab308', filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.6))' }} />
                </div>
            )}
        </div>
        <div style={{ width: 2.5, height: 8, background: '#475569', borderRadius: '0 1px 1px 0' }} />
    </div>
);

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

// Authentic Windows 7 Aero Glass Flyout Frame Wrapper
const Win7FlyoutFrame = ({
    children,
    width,
    right,
    dataPopup,
}: {
    children: React.ReactNode;
    width: number | string;
    right: number;
    dataPopup: string;
}) => (
    <div
        data-tray-popup={dataPopup}
        style={{
            position: 'absolute',
            bottom: 45,
            right,
            width,
            maxWidth: 'calc(100vw - 16px)',
            // Signature Windows 7 Aero Glass outer border with frosted glass blur
            padding: 4,
            background: 'linear-gradient(180deg, rgba(235, 245, 255, 0.65) 0%, rgba(195, 220, 248, 0.55) 100%)',
            backdropFilter: 'blur(16px) saturate(1.8)',
            WebkitBackdropFilter: 'blur(16px) saturate(1.8)',
            borderRadius: 5,
            border: '1px solid rgba(135, 175, 220, 0.85)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.9), inset 0 -1px 0 rgba(160, 195, 240, 0.5)',
            zIndex: 60,
            fontFamily: '"Segoe UI", Tahoma, Arial, sans-serif',
        }}
    >
        {/* Inner crisp container with authentic 1px slate-gray border */}
        <div
            style={{
                background: '#ffffff',
                border: '1px solid #71889f',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.85)',
            }}
        >
            {children}
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
    brightness?: number;
    onBrightnessChange?: (b: number) => void;
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
    brightness: propBrightness,
    onBrightnessChange,
}: WindowsTaskbarProps) {
    const isMobile = useIsMobile();
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolumeState] = useState<number>(75);

    // Tray Popover States
    const [activeTrayPopup, setActiveTrayPopup] = useState<'wifi' | 'battery' | 'volume' | null>(null);

    // WiFi States
    const [isWifiConnected, setIsWifiConnected] = useState(true);
    const [activeNetworkName, setActiveNetworkName] = useState('TrumanSecureWireless');
    const [selectedWifi, setSelectedWifi] = useState<string>('TrumanSecureWireless');
    const [isConnecting, setIsConnecting] = useState(false);
    const [isRefreshingWifi, setIsRefreshingWifi] = useState(false);

    // Battery & Power States
    const [batteryLevel, setBatteryLevel] = useState(98);
    const [powerPlan, setPowerPlan] = useState<'balanced' | 'saver' | 'performance'>('balanced');
    const [localBrightness, setLocalBrightness] = useState(100);

    const brightness = propBrightness !== undefined ? propBrightness : localBrightness;

    const handleBrightnessChange = (val: number) => {
        setLocalBrightness(val);
        if (onBrightnessChange) {
            onBrightnessChange(val);
        }
    };

    const handleVolumeChange = (newVal: number) => {
        setVolumeState(newVal);
        audio.setVolume(newVal / 100);
        if (newVal > 0 && isMuted) {
            audio.setMuted(false);
            setIsMuted(false);
        }
    };

    const AVAILABLE_NETWORKS: NetworkItem[] = [
        { id: 'truman', name: 'TrumanSecureWireless', bars: 5, secure: true, speed: '866 Mbps' },
        { id: 'home', name: 'Aditya_Battlestation_5G', bars: 5, secure: true, speed: '1.2 Gbps' },
        { id: 'mesh', name: 'CyberLounge_Mesh_5G', bars: 4, secure: true, speed: '850 Mbps' },
        { id: 'guest', name: 'Campus_Guest_Hotspot', bars: 3, secure: false, speed: '120 Mbps' },
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
        if (net.name === activeNetworkName && isWifiConnected) {
            setIsWifiConnected(false);
            return;
        }
        setIsConnecting(true);
        audio.playClick();
        setTimeout(() => {
            setActiveNetworkName(net.name);
            setIsWifiConnected(true);
            setIsConnecting(false);
            audio.playClick();
        }, 600);
    };

    const handleRefreshNetworks = () => {
        setIsRefreshingWifi(true);
        audio.playClick();
        setTimeout(() => setIsRefreshingWifi(false), 700);
    };

    // Win7 Aero glass taskbar style
    const taskbarBg = 'linear-gradient(180deg, rgba(60,90,140,0.72) 0%, rgba(30,55,110,0.85) 40%, rgba(15,35,88,0.92) 100%)';
    const taskbarBorder = '1px solid rgba(100,155,230,0.45)';

    return (
        <div
            className="win7-taskbar"
            style={{
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
                {/* 1. BATTERY BUTTON (Order in Win7: Battery, Wifi, Sound) */}
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

                {/* 2. WIFI BUTTON */}
                <button
                    data-tray-btn="wifi"
                    onClick={(e) => {
                        e.stopPropagation();
                        audio.playClick();
                        setActiveTrayPopup(prev => prev === 'wifi' ? null : 'wifi');
                    }}
                    title={isWifiConnected ? `Connected to ${activeNetworkName} (Internet access)` : 'Not connected - Connections are available'}
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
                    {isWifiConnected ? (
                        <Win7SignalBars bars={5} />
                    ) : (
                        <Win7AvailableIcon />
                    )}
                </button>

                {/* 3. VOLUME / SOUND BUTTON */}
                <button
                    data-tray-btn="volume"
                    onClick={(e) => {
                        e.stopPropagation();
                        audio.playClick();
                        setActiveTrayPopup(prev => prev === 'volume' ? null : 'volume');
                    }}
                    title={isMuted ? 'Speakers: Muted' : `Speakers: ${volume}%`}
                    style={{
                        background: activeTrayPopup === 'volume' ? 'rgba(180,215,255,0.35)' : 'none',
                        border: activeTrayPopup === 'volume' ? '1px solid rgba(130,185,255,0.55)' : '1px solid transparent',
                        cursor: 'pointer', padding: '4px 5px', borderRadius: 2,
                        color: isMuted ? '#fca5a5' : 'rgba(210,230,255,0.85)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                        if (activeTrayPopup !== 'volume') e.currentTarget.style.background = 'rgba(180,215,255,0.22)';
                    }}
                    onMouseLeave={e => {
                        if (activeTrayPopup !== 'volume') e.currentTarget.style.background = 'none';
                    }}
                >
                    {isMuted || volume === 0 ? (
                        <VolumeX style={{ width: 14, height: 14, color: '#fca5a5' }} />
                    ) : volume < 33 ? (
                        <Volume style={{ width: 14, height: 14 }} />
                    ) : volume < 66 ? (
                        <Volume1 style={{ width: 14, height: 14 }} />
                    ) : (
                        <Volume2 style={{ width: 14, height: 14 }} />
                    )}
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

                {/* Show Desktop button (Far right rectangle) */}
                <button
                    onClick={onShowDesktop}
                    title="Show Desktop"
                    style={{
                        width: 10, height: 34, cursor: 'pointer',
                        background: 'rgba(140,185,240,0.25)',
                        border: '1px solid rgba(120,170,230,0.40)',
                        borderRadius: 1, marginLeft: 6,
                        transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(190,225,255,0.45)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(140,185,240,0.25)')}
                />

                {/* ============================================================ */}
                {/* 1. AUTHENTIC WINDOWS 7 SOUND / VOLUME FLYOUT                 */}
                {/* ============================================================ */}
                {activeTrayPopup === 'volume' && (
                    <Win7FlyoutFrame width={86} right={isMobile ? 6 : 28} dataPopup="volume">
                        <div style={{ padding: '12px 10px 8px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {/* Device Name */}
                            <div style={{ fontSize: 11, color: '#1e395b', fontWeight: 600, marginBottom: 2 }}>
                                Speakers
                            </div>

                            {/* Volume Numeric readout */}
                            <div style={{
                                fontSize: 12, fontWeight: 700,
                                color: isMuted ? '#c0392b' : '#1e395b',
                                marginBottom: 8,
                                fontVariantNumeric: 'tabular-nums',
                            }}>
                                {isMuted ? '0' : volume}
                            </div>

                            {/* Vertical Slider Track (Windows 7 Beveled Style) */}
                            <div style={{
                                height: 124,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 32,
                                position: 'relative',
                            }}>
                                <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    value={isMuted ? 0 : volume}
                                    onChange={(e) => handleVolumeChange(Number(e.target.value))}
                                    style={{
                                        width: 108,
                                        height: 5,
                                        transform: 'rotate(-90deg)',
                                        cursor: 'pointer',
                                        accentColor: '#3182ce',
                                        outline: 'none',
                                    }}
                                />
                            </div>

                            {/* Windows 7 Speaker Toggle Button */}
                            <button
                                onClick={() => {
                                    audio.playClick();
                                    handleToggleMute();
                                }}
                                title={isMuted ? 'Unmute' : 'Mute'}
                                style={{
                                    marginTop: 10,
                                    background: isMuted ? '#fef2f2' : '#f8fafc',
                                    border: isMuted ? '1px solid #ef4444' : '1px solid #94a3b8',
                                    borderRadius: 3,
                                    padding: '4px 6px',
                                    cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: 'inset 0 1px 0 #fff, 0 1px 2px rgba(0,0,0,0.1)',
                                }}
                            >
                                {isMuted || volume === 0 ? (
                                    <VolumeX style={{ width: 16, height: 16, color: '#dc2626' }} />
                                ) : volume < 50 ? (
                                    <Volume1 style={{ width: 16, height: 16, color: '#1e395b' }} />
                                ) : (
                                    <Volume2 style={{ width: 16, height: 16, color: '#1e395b' }} />
                                )}
                            </button>
                        </div>

                        {/* Windows 7 "Mixer" Footer Link */}
                        <div style={{
                            background: '#eef3f8',
                            borderTop: '1px solid #d9d9d9',
                            padding: '6px 0',
                            textAlign: 'center',
                        }}>
                            <button
                                onClick={() => {
                                    audio.playClick();
                                    setActiveTrayPopup(null);
                                    onTaskbarAppClick('media');
                                }}
                                style={{
                                    background: 'none', border: 'none',
                                    color: '#135ba2', fontSize: 11, cursor: 'pointer',
                                    textDecoration: 'none', fontFamily: '"Segoe UI", Tahoma, sans-serif',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                                onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                            >
                                Mixer
                            </button>
                        </div>
                    </Win7FlyoutFrame>
                )}

                {/* ============================================================ */}
                {/* 2. AUTHENTIC WINDOWS 7 WI-FI FLYOUT (EXACT REPLICA)          */}
                {/* ============================================================ */}
                {activeTrayPopup === 'wifi' && (
                    <Win7FlyoutFrame width={282} right={isMobile ? 8 : 46} dataPopup="wifi">
                        {/* Top Header Section (Exact replicate of reference photo) */}
                        <div style={{ padding: '10px 12px 10px 12px' }}>
                            {/* Row 1: Connection status & Refresh icon */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ fontSize: 12, color: '#111827', fontWeight: 500 }}>
                                    {isWifiConnected ? 'Currently connected to:' : 'Not connected'}
                                </div>
                                <button
                                    onClick={handleRefreshNetworks}
                                    title="Refresh wireless networks"
                                    style={{
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#135ba2',
                                    }}
                                >
                                    <RefreshCw
                                        style={{
                                            width: 14, height: 14,
                                            transform: isRefreshingWifi ? 'rotate(360deg)' : 'none',
                                            transition: 'transform 0.6s ease',
                                        }}
                                    />
                                </button>
                            </div>

                            {/* Row 2: Status indicator with message */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                                {isWifiConnected ? (
                                    <>
                                        <Win7SignalBars bars={5} />
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>
                                                {activeNetworkName}
                                            </span>
                                            <span style={{ fontSize: 11, color: '#64748b' }}>
                                                Internet access
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Win7AvailableIcon />
                                        <span style={{ fontSize: 12, color: '#1f2937' }}>
                                            Connections are available
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Divider */}
                        <div style={{ height: 1, background: '#e5e7eb', width: '100%' }} />

                        {/* Wireless Network Connection Category Header */}
                        <div style={{
                            padding: '6px 12px 4px 12px',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            color: '#4b5563', fontSize: 11,
                        }}>
                            <span>Wireless Network Connection</span>
                            <span style={{ fontSize: 9 }}>▲</span>
                        </div>

                        {/* Available Networks List */}
                        <div style={{ padding: '2px 4px', maxHeight: 220, overflowY: 'auto' }}>
                            {AVAILABLE_NETWORKS.map((net) => {
                                const isCurrent = isWifiConnected && activeNetworkName === net.name;
                                const isSelected = selectedWifi === net.name;
                                return (
                                    <div
                                        key={net.id}
                                        onClick={() => setSelectedWifi(net.name)}
                                        style={{
                                            padding: '5px 8px',
                                            borderRadius: 2,
                                            background: isSelected ? 'linear-gradient(180deg, #e5f3fb 0%, #d2eaf8 100%)' : 'transparent',
                                            border: isSelected ? '1px solid #70c0e7' : '1px solid transparent',
                                            cursor: 'pointer',
                                            marginBottom: 1,
                                        }}
                                        onMouseEnter={e => {
                                            if (!isSelected) {
                                                e.currentTarget.style.background = '#eef6fc';
                                                e.currentTarget.style.border = '1px solid #bce1f5';
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            if (!isSelected) {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.border = '1px solid transparent';
                                            }
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <span style={{
                                                fontSize: 12,
                                                color: '#10599a',
                                                fontWeight: isCurrent ? 600 : 400,
                                            }}>
                                                {net.name}
                                            </span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                                {net.secure && <Lock style={{ width: 10, height: 10, color: '#94a3b8' }} />}
                                                <Win7SignalBars bars={net.bars} />
                                            </div>
                                        </div>

                                        {/* Windows 7 Expandable Connect Box */}
                                        {isSelected && (
                                            <div style={{
                                                marginTop: 6, paddingTop: 4,
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            }}>
                                                <label style={{
                                                    fontSize: 11, color: '#334155',
                                                    display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer',
                                                }}>
                                                    <input type="checkbox" defaultChecked style={{ cursor: 'pointer' }} />
                                                    Connect automatically
                                                </label>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleNetworkSelect(net);
                                                    }}
                                                    disabled={isConnecting}
                                                    style={{
                                                        background: 'linear-gradient(180deg, #f2f2f2 0%, #ebebeb 50%, #dddddd 51%, #cfcfcf 100%)',
                                                        border: '1px solid #707070',
                                                        borderRadius: 3,
                                                        padding: '2px 14px',
                                                        fontSize: 11,
                                                        color: '#000000',
                                                        cursor: isConnecting ? 'wait' : 'pointer',
                                                        boxShadow: 'inset 0 1px 0 #ffffff, 0 1px 1px rgba(0,0,0,0.15)',
                                                    }}
                                                    onMouseEnter={e => {
                                                        e.currentTarget.style.background = 'linear-gradient(180deg, #eaf6fd 0%, #bee6fd 50%, #a7d9f5 51%, #98d1f2 100%)';
                                                        e.currentTarget.style.borderColor = '#3c7fb1';
                                                    }}
                                                    onMouseLeave={e => {
                                                        e.currentTarget.style.background = 'linear-gradient(180deg, #f2f2f2 0%, #ebebeb 50%, #dddddd 51%, #cfcfcf 100%)';
                                                        e.currentTarget.style.borderColor = '#707070';
                                                    }}
                                                >
                                                    {isConnecting ? 'Connecting...' : (isCurrent ? 'Disconnect' : 'Connect')}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Windows 7 Classic Footer Link (Exact match from photo) */}
                        <div style={{
                            background: '#eef3f8',
                            borderTop: '1px solid #d9d9d9',
                            padding: '8px 12px',
                            textAlign: 'center',
                            marginTop: 4,
                        }}>
                            <button
                                onClick={() => {
                                    audio.playClick();
                                    setActiveTrayPopup(null);
                                    onTaskbarAppClick('mail');
                                }}
                                style={{
                                    background: 'none', border: 'none',
                                    color: '#135ba2', fontSize: 11, cursor: 'pointer',
                                    padding: 0, fontFamily: '"Segoe UI", Tahoma, sans-serif',
                                    textDecoration: 'none',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                                onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                            >
                                Open Network and Sharing Center
                            </button>
                        </div>
                    </Win7FlyoutFrame>
                )}

                {/* ============================================================ */}
                {/* 3. AUTHENTIC WINDOWS 7 BATTERY FLYOUT                        */}
                {/* ============================================================ */}
                {activeTrayPopup === 'battery' && (
                    <Win7FlyoutFrame width={282} right={isMobile ? 8 : 78} dataPopup="battery">
                        <div style={{ padding: '12px 14px' }}>
                            {/* Battery Status Header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Win7BatteryMeter level={batteryLevel} isCharging={true} />
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                                        {batteryLevel}% remaining
                                    </div>
                                    <div style={{ fontSize: 10, color: '#64748b' }}>
                                        Plugged in, charging
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div style={{ height: 1, background: '#e5e7eb', width: '100%' }} />

                        {/* Power Plans Selector */}
                        <div style={{ padding: '10px 14px' }}>
                            <div style={{ fontSize: 11, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                                Select a power plan:
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {[
                                    { id: 'balanced', name: 'Balanced', desc: 'Automatically balances performance with energy consumption' },
                                    { id: 'saver', name: 'Power saver', desc: 'Saves energy by reducing PC performance' },
                                    { id: 'performance', name: 'High performance', desc: 'Favors performance, may use more energy' },
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
                                                padding: '4px 6px', borderRadius: 2,
                                                background: isSelected ? '#e5f3fb' : 'transparent',
                                                border: isSelected ? '1px solid #70c0e7' : '1px solid transparent',
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
                                                <span style={{ fontSize: 11, fontWeight: isSelected ? 600 : 400, color: '#10599a' }}>
                                                    {plan.name}
                                                </span>
                                                <span style={{ fontSize: 9, color: '#64748b' }}>
                                                    {plan.desc}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Divider */}
                        <div style={{ height: 1, background: '#e5e7eb', width: '100%' }} />

                        {/* Adjust Display Brightness (Interactive working slider) */}
                        <div style={{ padding: '10px 14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                                <span style={{ fontSize: 11, color: '#334155', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 500 }}>
                                    <Sun style={{ width: 13, height: 13, color: '#f59e0b' }} />
                                    Adjust display brightness
                                </span>
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#1e395b' }}>
                                    {brightness}%
                                </span>
                            </div>
                            <input
                                type="range"
                                min={15}
                                max={100}
                                value={brightness}
                                onChange={(e) => handleBrightnessChange(Number(e.target.value))}
                                style={{ width: '100%', height: 5, cursor: 'pointer', accentColor: '#3182ce' }}
                            />
                        </div>

                        {/* Windows 7 Clean Footer */}
                        <div style={{
                            background: '#eef3f8',
                            borderTop: '1px solid #d9d9d9',
                            height: 8,
                        }} />
                    </Win7FlyoutFrame>
                )}
            </div>
        </div>
    );
}

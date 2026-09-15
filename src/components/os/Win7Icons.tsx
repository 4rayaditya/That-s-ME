import React from 'react';

// ============================================================================
// AUTHENTIC WINDOWS 7 DESKTOP AERO ICONS (SVG)
// Recreating the iconic Windows 7 Aero Glass & Skeuomorphic Icon Set
// ============================================================================

export function Win7ComputerIcon({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="w7_pc_screen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="40%" stopColor="#60a5fa" />
                    <stop offset="70%" stopColor="#93c5fd" />
                    <stop offset="100%" stopColor="#bfdbfe" />
                </linearGradient>
                <linearGradient id="w7_pc_bezel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <linearGradient id="w7_pc_stand" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="50%" stopColor="#f8fafc" />
                    <stop offset="100%" stopColor="#64748b" />
                </linearGradient>
                <linearGradient id="w7_pc_tower" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="30%" stopColor="#94a3b8" />
                    <stop offset="80%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
                <filter id="w7_drop_shadow" x="-10%" y="-10%" width="130%" height="130%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.45" />
                </filter>
            </defs>
            <g filter="url(#w7_drop_shadow)">
                {/* PC Tower behind monitor */}
                <rect x="30" y="8" width="13" height="32" rx="2" fill="url(#w7_pc_tower)" stroke="#1e293b" strokeWidth="0.8" />
                {/* Optical drive */}
                <rect x="32" y="11" width="9" height="3" rx="0.5" fill="#0f172a" />
                <rect x="39" y="12" width="1.5" height="1" fill="#10b981" />
                {/* Front grill */}
                <line x1="32" y1="20" x2="41" y2="20" stroke="#0f172a" strokeWidth="0.8" />
                <line x1="32" y1="23" x2="41" y2="23" stroke="#0f172a" strokeWidth="0.8" />
                <line x1="32" y1="26" x2="41" y2="26" stroke="#0f172a" strokeWidth="0.8" />
                {/* Power button */}
                <circle cx="36.5" cy="34" r="1.5" fill="#38bdf8" />

                {/* Monitor Stand Base */}
                <ellipse cx="17" cy="40" rx="9" ry="2.5" fill="url(#w7_pc_stand)" stroke="#475569" strokeWidth="0.6" />
                <rect x="15" y="32" width="4" height="8" fill="url(#w7_pc_stand)" />

                {/* Monitor Bezel */}
                <rect x="4" y="10" width="26" height="22" rx="2" fill="url(#w7_pc_bezel)" stroke="#64748b" strokeWidth="0.8" />
                {/* Monitor Screen */}
                <rect x="6" y="12" width="22" height="16" rx="1" fill="url(#w7_pc_screen)" />
                {/* Screen reflection highlight */}
                <path d="M6 12 L28 12 L28 17 L6 23 Z" fill="white" opacity="0.35" />
                {/* Windows logo hint on screen */}
                <rect x="15" y="18" width="2" height="2" fill="#ef4444" opacity="0.85" />
                <rect x="17.5" y="18" width="2" height="2" fill="#22c55e" opacity="0.85" />
                <rect x="15" y="20.5" width="2" height="2" fill="#3b82f6" opacity="0.85" />
                <rect x="17.5" y="20.5" width="2" height="2" fill="#eab308" opacity="0.85" />
                {/* Power LED */}
                <circle cx="17" cy="30.5" r="0.75" fill="#38bdf8" />
            </g>
        </svg>
    );
}

export function Win7UserFolderIcon({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="w7_folder_back" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <linearGradient id="w7_folder_front" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fde047" />
                    <stop offset="40%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
            </defs>
            {/* Back tab */}
            <path d="M6 14 C6 12 7 11 9 11 L19 11 L23 15 L40 15 C42 15 43 16 43 18 L43 36 C43 38 42 39 40 39 L8 39 C6 39 5 38 5 36 Z" fill="url(#w7_folder_back)" />
            {/* White papers inside */}
            <rect x="9" y="16" width="29" height="12" rx="1.5" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
            <line x1="12" y1="20" x2="24" y2="20" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
            <line x1="12" y1="23" x2="30" y2="23" stroke="#cbd5e1" strokeWidth="1" strokeLinecap="round" />
            {/* Front flap */}
            <path d="M5 21 C5 19.5 6.5 18.5 8 18.5 L40 18.5 C41.5 18.5 43 19.5 43 21 L41 38 C41 40 39.5 41 38 41 L8 41 C6.5 41 5 40 5 38 Z" fill="url(#w7_folder_front)" stroke="#d97706" strokeWidth="0.8" />
            {/* Front flap highlight */}
            <path d="M8 20 L40 20 C41 20 42 20.5 42 21.5 L41.5 25 L6.5 25 L7 21.5 C7 20.5 7.5 20 8 20 Z" fill="white" opacity="0.35" />
            {/* User Profile Badge */}
            <circle cx="24" cy="30" r="7.5" fill="#0284c7" stroke="#ffffff" strokeWidth="1.2" />
            {/* User head & shoulders */}
            <circle cx="24" cy="28" r="2.5" fill="#ffffff" />
            <path d="M19.5 35 C19.5 32 21.5 31.5 24 31.5 C26.5 31.5 28.5 32 28.5 35 Z" fill="#ffffff" />
        </svg>
    );
}

export function Win7RecycleBinIcon({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="w7_bin_glass" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                    <stop offset="30%" stopColor="#bae6fd" stopOpacity="0.4" />
                    <stop offset="70%" stopColor="#e0f2fe" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.85" />
                </linearGradient>
                <linearGradient id="w7_bin_rim" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e0f2fe" />
                    <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
            </defs>
            {/* Crumpled paper inside */}
            <path d="M16 18 L22 14 L28 17 L31 13 L33 20 L24 22 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.8" />
            <path d="M18 19 L21 24 L27 21 L26 17 Z" fill="#f1f5f9" />
            {/* Translucent glass can body */}
            <path d="M13 14 L16.5 40 C16.7 41.5 18 42.5 19.5 42.5 L28.5 42.5 C30 42.5 31.3 41.5 31.5 40 L35 14 Z" fill="url(#w7_bin_glass)" stroke="#0284c7" strokeWidth="0.9" />
            {/* Vertical glass ribs */}
            <line x1="18" y1="15" x2="20" y2="40" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
            <line x1="24" y1="15" x2="24" y2="41" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
            <line x1="30" y1="15" x2="28" y2="40" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
            {/* Glass rim top ring */}
            <ellipse cx="24" cy="14" rx="11" ry="3.2" fill="url(#w7_bin_rim)" stroke="#0284c7" strokeWidth="1" />
            <ellipse cx="24" cy="14" rx="9" ry="2.2" fill="#38bdf8" opacity="0.35" />
            {/* Green recycling mobius arrows */}
            <g transform="translate(18, 24) scale(0.6)">
                <path d="M10 2 L13 6 L7 6 Z" fill="#16a34a" />
                <path d="M10 4 C15 4 18 7 18 12 L16 12 C16 8 14 6 10 6 Z" fill="#16a34a" />
                <path d="M19 14 L17 18 L14 13 Z" fill="#16a34a" />
                <path d="M17 16 C15 20 11 21 7 19 L8 17 C11 19 14 18 15 15 Z" fill="#16a34a" />
                <path d="M2 13 L4 8 L6 13 Z" fill="#16a34a" />
                <path d="M4 11 C4 7 7 4 10 4 L10 6 C8 6 6 8 6 11 Z" fill="#16a34a" />
            </g>
        </svg>
    );
}

export function Win7NetworkIcon({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="w7_globe" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
            </defs>
            {/* Glowing globe in background */}
            <circle cx="28" cy="18" r="11" fill="url(#w7_globe)" stroke="#93c5fd" strokeWidth="1" />
            <ellipse cx="28" cy="18" rx="5" ry="10.5" stroke="#bfdbfe" strokeWidth="0.8" fill="none" opacity="0.75" />
            <line x1="17" y1="18" x2="39" y2="18" stroke="#bfdbfe" strokeWidth="0.8" opacity="0.75" />
            {/* Front Computer Screen */}
            <rect x="8" y="16" width="18" height="15" rx="1.5" fill="#1e293b" stroke="#64748b" strokeWidth="0.8" />
            <rect x="9.5" y="17.5" width="15" height="10" fill="#38bdf8" />
            <path d="M9.5 17.5 L24.5 17.5 L24.5 21 L9.5 24 Z" fill="white" opacity="0.3" />
            <rect x="15" y="31" width="4" height="4" fill="#94a3b8" />
            <ellipse cx="17" cy="35" rx="6" ry="1.5" fill="#64748b" />
            {/* Second Computer Screen Right */}
            <rect x="24" y="24" width="18" height="15" rx="1.5" fill="#1e293b" stroke="#64748b" strokeWidth="0.8" />
            <rect x="25.5" y="25.5" width="15" height="10" fill="#38bdf8" />
            <path d="M25.5 25.5 L40.5 25.5 L40.5 29 L25.5 32 Z" fill="white" opacity="0.3" />
            <rect x="31" y="39" width="4" height="4" fill="#94a3b8" />
            <ellipse cx="33" cy="43" rx="6" ry="1.5" fill="#64748b" />
            {/* Connecting network cable */}
            <path d="M17 36 L17 40 L33 40" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="25" cy="40" r="1.5" fill="#10b981" />
        </svg>
    );
}

export function Win7ControlPanelIcon({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="w7_gear_blue" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="50%" stopColor="#0284c7" />
                    <stop offset="100%" stopColor="#0369a1" />
                </linearGradient>
            </defs>
            {/* Large Cog Gear */}
            <g transform="translate(4, 4)">
                <path d="M18 4 L22 4 L23 8 C24.5 8.5 26 9.3 27.2 10.3 L31 8.8 L33.8 11.6 L32.3 15.4 C33.3 16.6 34.1 18.1 34.6 19.6 L38.6 20.6 L38.6 24.6 L34.6 25.6 C34.1 27.1 33.3 28.6 32.3 29.8 L33.8 33.6 L31 36.4 L27.2 34.9 C26 35.9 24.5 36.7 23 37.2 L22 41.2 L18 41.2 L17 37.2 C15.5 36.7 14 35.9 12.8 34.9 L9 36.4 L6.2 33.6 L7.7 29.8 C6.7 28.6 5.9 27.1 5.4 25.6 L1.4 24.6 L1.4 20.6 L5.4 19.6 C5.9 18.1 6.7 16.6 7.7 15.4 L6.2 11.6 L9 8.8 L12.8 10.3 C14 9.3 15.5 8.5 17 8 L18 4 Z" fill="url(#w7_gear_blue)" stroke="#0369a1" strokeWidth="1" />
                <circle cx="20" cy="22.6" r="9" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
                {/* Sliders and knobs inside */}
                <line x1="16" y1="17" x2="16" y2="28" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="16" cy="20" r="2" fill="#0284c7" />
                <line x1="20" y1="17" x2="20" y2="28" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="20" cy="25" r="2" fill="#0284c7" />
                <line x1="24" y1="17" x2="24" y2="28" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="24" cy="19" r="2" fill="#0284c7" />
            </g>
        </svg>
    );
}

export function Win7InternetExplorerIcon({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="w7_ie_blue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="40%" stopColor="#0284c7" />
                    <stop offset="100%" stopColor="#075985" />
                </linearGradient>
                <linearGradient id="w7_ie_gold" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="50%" stopColor="#eab308" />
                    <stop offset="100%" stopColor="#ca8a04" />
                </linearGradient>
            </defs>
            {/* Back part of golden halo */}
            <path d="M8 32 C12 24 24 16 38 12" stroke="url(#w7_ie_gold)" strokeWidth="3.2" strokeLinecap="round" opacity="0.6" />
            {/* Iconic 3D Blue 'e' */}
            <path d="M25 8 C15.5 8 8 15 8 24.5 C8 34 15.5 40 26 40 C32 40 37 37 39.5 33 L32.5 29.5 C31 31.5 28.5 33 25.5 33 C20.5 33 16.5 29.5 16 25 L40 25 C40.2 24 40.5 22.8 40.5 21.5 C40.5 13.8 33.5 8 25 8 Z M16.2 20.5 C17.2 16.5 20.5 13.5 25 13.5 C29.5 13.5 32.5 16.5 33.2 20.5 L16.2 20.5 Z" fill="url(#w7_ie_blue)" />
            {/* 3D Glass specular highlight */}
            <path d="M25 10 C18 10 12 14.5 10.5 21 C13 14 18 11.5 25 11.5 C31 11.5 35.5 14 37.5 18 C36 13 31 10 25 10 Z" fill="#ffffff" opacity="0.5" />
            {/* Front part of golden halo encircling the 'e' */}
            <path d="M6 36 C14 26 30 14 44 11" stroke="url(#w7_ie_gold)" strokeWidth="3.4" strokeLinecap="round" />
            <path d="M6 36 C14 26 30 14 44 11" stroke="#ffffff" strokeWidth="1.0" strokeLinecap="round" opacity="0.75" />
        </svg>
    );
}

export function Win7NotepadIcon({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="w7_pad_cover" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
            </defs>
            {/* Back cover */}
            <rect x="9" y="8" width="28" height="34" rx="2" fill="url(#w7_pad_cover)" stroke="#1e40af" strokeWidth="0.8" />
            {/* Lined notebook paper */}
            <rect x="11" y="9" width="26" height="32" rx="1.5" fill="#f8fafc" />
            {/* Ruled blue lines */}
            <line x1="14" y1="15" x2="34" y2="15" stroke="#93c5fd" strokeWidth="1" />
            <line x1="14" y1="19" x2="34" y2="19" stroke="#93c5fd" strokeWidth="1" />
            <line x1="14" y1="23" x2="34" y2="23" stroke="#93c5fd" strokeWidth="1" />
            <line x1="14" y1="27" x2="34" y2="27" stroke="#93c5fd" strokeWidth="1" />
            <line x1="14" y1="31" x2="30" y2="31" stroke="#93c5fd" strokeWidth="1" />
            {/* Spiral binding rings at top */}
            {([13, 17, 21, 25, 29, 33] as number[]).map((rx, idx) => (
                <rect key={idx} x={rx} y="6" width="2" height="4.5" rx="1" fill="#475569" stroke="#1e293b" strokeWidth="0.4" />
            ))}
            {/* Classic Yellow Pencil angled across pad */}
            <g transform="translate(24, 18) rotate(35)">
                <rect x="0" y="0" width="5" height="24" rx="1" fill="#f59e0b" stroke="#b45309" strokeWidth="0.6" />
                <rect x="0" y="0" width="5" height="4" rx="0.5" fill="#fda4af" />
                <rect x="0" y="3.5" width="5" height="1.5" fill="#cbd5e1" />
                <polygon points="0,24 5,24 2.5,29" fill="#fef3c7" stroke="#b45309" strokeWidth="0.6" />
                <polygon points="1.5,27 3.5,27 2.5,29" fill="#1e293b" />
            </g>
        </svg>
    );
}

export function Win7CmdIcon({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Terminal Window Box */}
            <rect x="6" y="10" width="36" height="28" rx="2.5" fill="#0f172a" stroke="#475569" strokeWidth="1" />
            {/* Windows 7 Aero Classic Blue Titlebar */}
            <path d="M6 12.5 C6 11 7 10 8.5 10 L39.5 10 C41 10 42 11 42 12.5 L42 16 L6 16 Z" fill="#1d4ed8" />
            {/* Titlebar buttons */}
            <rect x="36" y="12" width="4" height="2.5" rx="0.5" fill="#ef4444" />
            <rect x="31" y="12" width="3.5" height="2.5" rx="0.5" fill="#64748b" />
            {/* Terminal Prompt Text */}
            <text x="10" y="25" fill="#22c55e" fontSize="7" fontFamily="monospace" fontWeight="bold">C:\&gt;_</text>
            <text x="10" y="32" fill="#94a3b8" fontSize="5" fontFamily="monospace">system.exe</text>
        </svg>
    );
}

export function Win7VSCodeIcon({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="w7_vsc_1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
                <linearGradient id="w7_vsc_2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#0284c7" />
                    <stop offset="100%" stopColor="#0369a1" />
                </linearGradient>
            </defs>
            <path d="M34 6 L14 21.5 L7 16 L4 18 L10 24 L4 30 L7 32 L14 26.5 L34 42 L42 38 L42 10 Z" fill="url(#w7_vsc_1)" />
            <path d="M34 14 L18 24 L34 34 Z" fill="url(#w7_vsc_2)" opacity="0.9" />
            <path d="M34 6 L42 10 L42 38 L34 42 Z" fill="#0369a1" />
            <path d="M34 6 L42 10 L34 16 Z" fill="#38bdf8" opacity="0.75" />
        </svg>
    );
}

export function Win7PdfIcon({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="w7_pdf_red" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#b91c1c" />
                </linearGradient>
            </defs>
            {/* White Document Page */}
            <path d="M10 8 C10 6.5 11.5 5 13 5 L30 5 L40 15 L40 40 C40 41.5 38.5 43 37 43 L13 43 C11.5 43 10 41.5 10 40 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
            {/* Folded corner */}
            <path d="M30 5 L40 15 L32 15 C30.5 15 30 14.5 30 13 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.8" />
            {/* Red PDF banner ribbon */}
            <rect x="10" y="24" width="30" height="12" rx="1" fill="url(#w7_pdf_red)" />
            <text x="14" y="33" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="sans-serif">PDF</text>
            <path d="M32 27 C34 29 36 31 37 33 M32 33 C33.5 31 35 29 37 27" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

export function Win7MediaPlayerIcon({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="w7_wmp_orange" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#fb923c" />
                    <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
                <linearGradient id="w7_wmp_ring" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
            </defs>
            {/* CD Disc outer circle */}
            <circle cx="24" cy="24" r="18" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
            {/* Blue & orange jewel ring */}
            <circle cx="24" cy="24" r="14" fill="none" stroke="url(#w7_wmp_ring)" strokeWidth="3" />
            <circle cx="24" cy="24" r="9" fill="url(#w7_wmp_orange)" />
            {/* Inner hole */}
            <circle cx="24" cy="24" r="3.5" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.8" />
            {/* Play triangle */}
            <polygon points="22.5,21 27.5,24 22.5,27" fill="#ffffff" />
        </svg>
    );
}

export function Win7ExitIcon({ className = "w-10 h-10" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="w7_exit_orb" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f87171" />
                    <stop offset="50%" stopColor="#dc2626" />
                    <stop offset="100%" stopColor="#991b1b" />
                </linearGradient>
            </defs>
            {/* Aero Red Power Orb */}
            <circle cx="24" cy="24" r="16" fill="url(#w7_exit_orb)" stroke="#fca5a5" strokeWidth="1.5" />
            {/* Top glass reflection arc */}
            <path d="M12 20 C14 13 34 13 36 20 C32 15 16 15 12 20 Z" fill="#ffffff" opacity="0.6" />
            {/* Power symbol */}
            <path d="M18 19 C15 22 15 27 18 30 C21 33 27 33 30 30 C33 27 33 22 30 19" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <line x1="24" y1="13" x2="24" y2="22" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
    );
}

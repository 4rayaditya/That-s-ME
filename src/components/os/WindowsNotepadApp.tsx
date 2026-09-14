'use client';

import React, { useState } from 'react';
import { PERSONAL_INFO } from '@/data/portfolioData';

export default function WindowsNotepadApp() {
    const textContent = `================================================================================
ADITYA RAY — CREATIVE TECHNOLOGIST & FULL-STACK 3D ENGINEER
Handle: ${PERSONAL_INFO.handle}
Location: ${PERSONAL_INFO.location}
Status: ${PERSONAL_INFO.status}
Email: ${PERSONAL_INFO.email}
GitHub: ${PERSONAL_INFO.github}
LinkedIn: ${PERSONAL_INFO.linkedin}
================================================================================

[ABOUT ME]
${PERSONAL_INFO.bio}

[PRODUCTION BENCHMARKS]
• Years Active: ${PERSONAL_INFO.stats[0].value} (since ${PERSONAL_INFO.stats[0].change})
• Concurrent MAU Handled: ${PERSONAL_INFO.stats[1].value}
• Target Runtime Performance: ${PERSONAL_INFO.stats[2].value}
• Production Shipped Projects: ${PERSONAL_INFO.stats[3].value}

[CORE ENGINEERING PRINCIPLES]
1. Extreme Visual Rigor
   Crafting digital spaces that elicit emotional wonder while maintaining
   microsecond reactivity and intuitive affordances.

2. WebGL & GPU-First Architecture
   Harnessing custom GLSL fragment/vertex shaders, instanced mesh geometry,
   and Three.js rendering pipelines without compromising battery or frames.

3. Resilient Distributed Cloud Systems
   Building resilient PostgreSQL data structures, Redis in-memory caches,
   and WebSockets/WebRTC event brokers that never drop a frame.

[SYSTEM ENVIRONMENT]
Current Session: Windows 11 Pro Workstation (Aditya Edition)
Hardware Uplink: Battlestation Cyber Room // 3D Isometric View
Audio Synth: Procedural Web Audio API Lo-fi Engine Active
`;

    const [content, setContent] = useState(textContent);
    const lines = content.split('\n');

    return (
        <div className="flex-1 flex flex-col font-mono text-xs bg-[#19191d] text-zinc-200 select-text overflow-hidden">
            {/* Notepad Menu Bar */}
            <div className="flex items-center gap-4 px-3 py-1 bg-white/[0.03] border-b border-white/10 text-zinc-400 select-none text-[11px]">
                <span className="hover:text-white cursor-default">File</span>
                <span className="hover:text-white cursor-default">Edit</span>
                <span className="hover:text-white cursor-default">Format</span>
                <span className="hover:text-white cursor-default">View</span>
                <span className="hover:text-white cursor-default">Help</span>
            </div>

            {/* Notepad Editor Area */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex">
                {/* Line numbers */}
                <div className="pr-4 mr-3 border-r border-white/10 text-zinc-600 select-none text-right font-mono">
                    {lines.map((_, i) => (
                        <div key={i} className="leading-5">
                            {i + 1}
                        </div>
                    ))}
                </div>

                {/* Text body */}
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="flex-1 bg-transparent resize-none border-none outline-none leading-5 font-mono text-zinc-300 selection:bg-cyan-500 selection:text-black"
                    spellCheck={false}
                />
            </div>

            {/* Notepad Status Bar */}
            <div className="flex items-center justify-between px-3 py-1 bg-white/[0.02] border-t border-white/10 text-[10px] text-zinc-400 select-none">
                <div>Ln {lines.length}, Col 1</div>
                <div className="flex items-center gap-4">
                    <span>100%</span>
                    <span>Windows (CRLF)</span>
                    <span>UTF-8</span>
                </div>
            </div>
        </div>
    );
}

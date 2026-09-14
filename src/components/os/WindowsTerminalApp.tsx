'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PERSONAL_INFO, PROJECTS, EXPERIENCES, SKILL_CATEGORIES } from '@/data/portfolioData';
import { audio } from '@/lib/audio';

interface WindowsTerminalAppProps {
    onReturnToRoom?: () => void;
}

export default function WindowsTerminalApp({ onReturnToRoom }: WindowsTerminalAppProps) {
    const [history, setHistory] = useState<Array<{ type: 'input' | 'output'; text: string }>>([
        { type: 'output', text: 'Microsoft Windows [Version 10.0.22631.3007]' },
        { type: 'output', text: '(c) Microsoft Corporation. All rights reserved.' },
        { type: 'output', text: '' },
        { type: 'output', text: 'Aditya Ray Battlestation Terminal initialized.' },
        { type: 'output', text: 'Type "help" to view available commands, or "dir" to list files.' },
        { type: 'output', text: '' },
    ]);
    const [input, setInput] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cmd = input.trim();
        if (!cmd) return;

        audio.playClick();
        const newHist = [...history, { type: 'input' as const, text: `C:\\Users\\Aditya> ${cmd}` }];
        const lower = cmd.toLowerCase();

        if (lower === 'help') {
            newHist.push({
                type: 'output',
                text: `Available Windows Commands:
  dir            - List portfolio directories and files
  about          - Display Aditya Ray biography and summary
  projects       - List all flagship 3D & Full-Stack projects
  experience     - Display career history & achievements
  skills         - View tech stack and proficiency metrics
  contact        - Display direct email and social uplinks
  systeminfo     - Display workstation telemetry and specs
  cls / clear    - Clear command prompt screen
  exit           - Return to 3D Cyber Room`,
            });
        } else if (lower === 'dir') {
            newHist.push({
                type: 'output',
                text: ` Volume in drive C has no label.
 Volume Serial Number is 4C82-99B1

 Directory of C:\\Users\\Aditya

14/09/2026  09:00 PM    <DIR>          .
14/09/2026  09:00 PM    <DIR>          ..
14/09/2026  09:00 PM    <DIR>          Experience
14/09/2026  09:00 PM    <DIR>          Projects
14/09/2026  09:00 PM    <DIR>          Skills
14/09/2026  09:00 PM             1,420 About_Aditya.txt
14/09/2026  09:00 PM            48,200 Resume.pdf
14/09/2026  09:00 PM             2,048 Contact.exe
               3 File(s)         51,668 bytes
               5 Dir(s)  512,892,108,800 bytes free`,
            });
        } else if (lower === 'about' || lower === 'type about_aditya.txt') {
            newHist.push({
                type: 'output',
                text: `[ADITYA RAY]
${PERSONAL_INFO.bio}
Role: ${PERSONAL_INFO.role}
Status: ${PERSONAL_INFO.status}
Location: ${PERSONAL_INFO.location}`,
            });
        } else if (lower === 'projects') {
            newHist.push({
                type: 'output',
                text: PROJECTS.map(
                    (p) => `• ${p.title} [${p.categoryLabel}] — ${p.subtitle}`
                ).join('\n'),
            });
        } else if (lower === 'experience') {
            newHist.push({
                type: 'output',
                text: EXPERIENCES.map(
                    (e) => `[${e.period}] ${e.role} @ ${e.company} (${e.location})`
                ).join('\n'),
            });
        } else if (lower === 'skills') {
            newHist.push({
                type: 'output',
                text: SKILL_CATEGORIES.map(
                    (c) => `=== ${c.title} ===\n${c.skills.map((s) => `  ${s.name}: ${s.level}%`).join('\n')}`
                ).join('\n\n'),
            });
        } else if (lower === 'contact') {
            newHist.push({
                type: 'output',
                text: `Email:    ${PERSONAL_INFO.email}
GitHub:   ${PERSONAL_INFO.github}
LinkedIn: ${PERSONAL_INFO.linkedin}
Twitter:  ${PERSONAL_INFO.twitter}`,
            });
        } else if (lower === 'systeminfo') {
            newHist.push({
                type: 'output',
                text: `OS Name:                   Microsoft Windows 11 Pro
OS Version:                10.0.22631 N/A Build 22631
System Manufacturer:       Ray Systems Cyber Labs
System Model:              Battlestation 3D Workstation
Processor(s):              Neural Core i9-14900KS @ 6.0 GHz
Installed Memory (RAM):    64,000 MB
Graphics Card:             NVIDIA GeForce RTX 4090 24GB (WebGL 2.0 Active)
Audio Engine:              Procedural Web Audio API Synthesizer`,
            });
        } else if (lower === 'cls' || lower === 'clear') {
            setHistory([]);
            setInput('');
            return;
        } else if (lower === 'exit') {
            if (onReturnToRoom) {
                onReturnToRoom();
            }
            return;
        } else {
            newHist.push({
                type: 'output',
                text: `'${cmd}' is not recognized as an internal or external command, operable program or batch file. Type "help" for valid commands.`,
            });
        }

        setHistory(newHist);
        setInput('');
    };

    return (
        <div
            onClick={() => inputRef.current?.focus()}
            className="flex-1 p-4 bg-[#0c0c0c] text-zinc-100 font-mono text-xs overflow-y-auto custom-scrollbar flex flex-col select-text"
        >
            <div className="space-y-1">
                {history.map((item, idx) => (
                    <div
                        key={idx}
                        className={`whitespace-pre-wrap leading-relaxed ${
                            item.type === 'input' ? 'text-cyan-300 font-bold' : 'text-zinc-300'
                        }`}
                    >
                        {item.text}
                    </div>
                ))}
            </div>

            {/* Input Prompt */}
            <form onSubmit={handleSubmit} className="flex items-center gap-1.5 mt-2">
                <span className="text-zinc-400 select-none whitespace-nowrap">
                    C:\Users\Aditya&gt;
                </span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-zinc-100 font-mono text-xs caret-cyan-400"
                    autoFocus
                    spellCheck={false}
                />
            </form>
            <div ref={bottomRef} />
        </div>
    );
}

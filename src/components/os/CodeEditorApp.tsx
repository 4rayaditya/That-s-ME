'use client';

import React, { useState } from 'react';
import { FileJson, FileCode, FileText, ChevronRight, Folder } from 'lucide-react';
import { SKILL_CATEGORIES, EXPERIENCES, EDUCATION_CERTS, PERSONAL_INFO } from '@/data/portfolioData';
import { audio } from '@/lib/audio';

type ActiveFile = 'skills.json' | 'experience.ts' | 'education.md' | 'manifesto.md';

export default function CodeEditorApp() {
    const [activeFile, setActiveFile] = useState<ActiveFile>('skills.json');
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);

    const files: { name: ActiveFile; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
        { name: 'skills.json', icon: FileJson, color: 'text-amber-400' },
        { name: 'experience.ts', icon: FileCode, color: 'text-sky-400' },
        { name: 'education.md', icon: FileText, color: 'text-purple-400' },
        { name: 'manifesto.md', icon: FileText, color: 'text-emerald-400' },
    ];

    const renderFileContent = () => {
        switch (activeFile) {
            case 'skills.json':
                return JSON.stringify(
                    {
                        engineer: PERSONAL_INFO.name,
                        handle: PERSONAL_INFO.handle,
                        competencies: SKILL_CATEGORIES.map((cat) => ({
                            category: cat.title,
                            skills: cat.skills.map((s) => ({
                                name: s.name,
                                proficiency: `${s.level}%`,
                                specialization: s.highlight,
                            })),
                        })),
                    },
                    null,
                    2
                );

            case 'experience.ts':
                return `// Career Milestones & Production Trajectory
export interface Position {
  company: string;
  role: string;
  period: string;
  location: string;
  metrics: string[];
}

export const CAREER_RECORD: Position[] = [
${EXPERIENCES.map(
    (exp) => `  {
    company: "${exp.company}",
    role: "${exp.role}",
    period: "${exp.period}",
    location: "${exp.location}",
    metrics: [
${exp.achievements.map((a) => `      "${a}"`).join(',\n')}
    ],
    stack: [${exp.technologies.map((t) => `"${t}"`).join(', ')}]
  }`
).join(',\n')}
];`;

            case 'education.md':
                return `# Certified Credentials & Academic History

${EDUCATION_CERTS.map(
    (edu) => `### ${edu.degree}
- Institution: ${edu.institution}
- Period: ${edu.year}
- Distinction: ${edu.badge}
- Focus: ${edu.description}
`
).join('\n---\n\n')}`;

            case 'manifesto.md':
                return `# Aditya Ray // Engineering Manifesto

> "${PERSONAL_INFO.bio}"

## Core Tenets:
${PERSONAL_INFO.principles
    .map((p, i) => `### 0${i + 1}. ${p.title}\n${p.desc}`)
    .join('\n\n')}

- Available Worldwide: Remote / Hybrid
- Response Time: Sub-24h
- Direct Contact: ${PERSONAL_INFO.email}
`;
        }
    };

    const content = renderFileContent();
    const lines = content.split('\n');

    const renderCodeLine = (line: string) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('//') || trimmed.startsWith('#')) {
            return <span className="text-[#6a9955] italic">{line}</span>;
        }
        if (trimmed.startsWith('>') || trimmed.startsWith('-')) {
            return <span className="text-[#ce9178]">{line}</span>;
        }

        const parts = line.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g);
        return (
            <span>
                {parts.map((part, i) => {
                    if (part.startsWith('"') || part.startsWith("'")) {
                        const isKey = line.indexOf(part + ':') !== -1 || line.indexOf(part + ' :') !== -1;
                        return (
                            <span key={i} className={isKey ? 'text-[#9cdcfe]' : 'text-[#ce9178]'}>
                                {part}
                            </span>
                        );
                    }
                    const words = part.split(/\b(export|interface|const|return|null|true|false)\b/g);
                    return (
                        <span key={i}>
                            {words.map((w, j) => {
                                if (['export', 'interface', 'const', 'return', 'null', 'true', 'false'].includes(w)) {
                                    return <span key={j} className="text-[#569cd6] font-semibold">{w}</span>;
                                }
                                if (['Position', 'string', 'number'].includes(w)) {
                                    return <span key={j} className="text-[#4ec9b0]">{w}</span>;
                                }
                                return <span key={j} className="text-[#d4d4d4]">{w}</span>;
                            })}
                        </span>
                    );
                })}
            </span>
        );
    };

    return (
        <div className="flex flex-1 min-h-0 font-mono text-xs overflow-hidden select-text bg-[#1e1e1e] relative">
            {/* Sidebar File Explorer (Collapsible overlay on mobile, fixed column on desktop) */}
            <div className={`${showMobileSidebar ? 'flex absolute inset-y-0 left-0 z-30 shadow-2xl w-52' : 'hidden'} sm:static sm:flex w-48 bg-[#252526] border-r border-[#333333] p-3 shrink-0 select-none flex-col justify-between`}>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[#cccccc] uppercase tracking-wider font-bold">
                            EXPLORER: THAT-S-ME
                        </span>
                        <button
                            onClick={() => setShowMobileSidebar(false)}
                            className="sm:hidden text-xs text-[#888888] hover:text-white px-1"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[#cccccc] text-[11px] font-medium">
                            <ChevronRight className="w-3.5 h-3.5 text-sky-400" />
                            <Folder className="w-3.5 h-3.5 text-sky-400" />
                            <span>src/portfolio</span>
                        </div>
                        <div className="pl-4 space-y-1">
                            {files.map((file) => {
                                const Icon = file.icon;
                                const isActive = activeFile === file.name;
                                return (
                                    <button
                                        key={file.name}
                                        onClick={() => {
                                            audio.playClick();
                                            setActiveFile(file.name);
                                            setShowMobileSidebar(false);
                                        }}
                                        className={`w-full text-left px-2 py-1 rounded flex items-center gap-1.5 transition-colors text-[11px] cursor-pointer ${
                                            isActive
                                                ? 'bg-[#37373d] text-white font-medium border-l-2 border-[#007acc]'
                                                : 'text-[#cccccc] hover:text-white hover:bg-[#2a2d2e]'
                                        }`}
                                    >
                                        <Icon className={`w-3.5 h-3.5 ${file.color}`} />
                                        <span>{file.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="p-2 rounded bg-[#1e1e1e] border border-[#333333] text-[10px] text-[#aaaaaa]">
                    <div>Branch: main*</div>
                    <div className="text-emerald-400 font-medium">0 errors, 0 warnings</div>
                </div>
            </div>

            {/* Editor Body */}
            <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden min-w-0">
                {/* Tabs bar */}
                <div className="h-8 bg-[#252526] border-b border-[#1e1e1e] flex items-center px-1 sm:px-2 gap-1 select-none overflow-x-auto custom-scrollbar flex-shrink-0">
                    {/* Mobile File Explorer Trigger Button */}
                    <button
                        onClick={() => { audio.playClick(); setShowMobileSidebar(!showMobileSidebar); }}
                        className="sm:hidden px-2 h-6 rounded flex items-center gap-1 text-[11px] text-[#cccccc] hover:text-white bg-[#333333] border border-[#444444] cursor-pointer flex-shrink-0"
                        title="Toggle Explorer"
                    >
                        <Folder className="w-3 h-3 text-sky-400" />
                        <span className="text-[10px] font-bold">Files</span>
                    </button>
                    {files.map((file) => {
                        const Icon = file.icon;
                        const isActive = activeFile === file.name;
                        return (
                            <button
                                key={file.name}
                                onClick={() => {
                                    audio.playClick();
                                    setActiveFile(file.name);
                                }}
                                className={`h-full px-3 text-[11px] flex items-center gap-1.5 border-t-2 transition-colors cursor-pointer ${
                                    isActive
                                        ? 'bg-[#1e1e1e] text-white border-[#007acc] font-medium'
                                        : 'bg-[#2d2d2d] text-[#969696] border-transparent hover:text-[#e0e0e0]'
                                }`}
                            >
                                <Icon className={`w-3.5 h-3.5 ${file.color}`} />
                                <span>{file.name}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Code Lines with Line Numbers */}
                <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                    <div className="flex">
                        {/* Line numbers */}
                        <div className="pr-4 select-none text-[#858585] text-right space-y-0.5 border-r border-[#333333] font-mono">
                            {lines.map((_, idx) => (
                                <div key={idx} className="leading-relaxed">
                                    {idx + 1}
                                </div>
                            ))}
                        </div>

                        {/* Code Content */}
                        <div className="pl-4 space-y-0.5 text-[#d4d4d4] overflow-x-auto flex-1 font-mono">
                            {lines.map((line, idx) => (
                                <div key={idx} className="leading-relaxed whitespace-pre font-mono">
                                    {renderCodeLine(line) || ' '}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

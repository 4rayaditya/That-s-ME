'use client';

import React, { useState } from 'react';
import { FileJson, FileCode, FileText, ChevronRight, Folder, Sparkles } from 'lucide-react';
import { SKILL_CATEGORIES, EXPERIENCES, EDUCATION_CERTS, PERSONAL_INFO } from '@/data/portfolioData';
import { audio } from '@/lib/audio';

type ActiveFile = 'skills.json' | 'experience.ts' | 'education.md' | 'manifesto.md';

export default function CodeEditorApp() {
    const [activeFile, setActiveFile] = useState<ActiveFile>('skills.json');

    const files: { name: ActiveFile; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
        { name: 'skills.json', icon: FileJson, color: 'text-amber-400' },
        { name: 'experience.ts', icon: FileCode, color: 'text-brand-blue' },
        { name: 'education.md', icon: FileText, color: 'text-brand-purple' },
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
                            color: cat.color,
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
- **Institution**: ${edu.institution}
- **Period**: ${edu.year}
- **Distinction**: ${edu.badge}
- **Focus**: ${edu.description}
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

    return (
        <div className="flex h-[440px] font-mono text-xs overflow-hidden select-text">
            {/* Sidebar File Explorer */}
            <div className="w-48 bg-space-950/60 border-r border-white/5 p-3 shrink-0 select-none flex flex-col justify-between">
                <div className="space-y-3">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
                        EXPLORER: THAT-S-ME
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
                            <ChevronRight className="w-3.5 h-3.5" />
                            <Folder className="w-3.5 h-3.5 text-brand-cyan" />
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
                                        }}
                                        className={`w-full text-left px-2 py-1 rounded flex items-center gap-1.5 transition-all text-[11px] ${
                                            isActive
                                                ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30'
                                                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
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

                <div className="p-2 rounded bg-white/[0.02] border border-white/5 text-[10px] text-zinc-500">
                    <div>Branch: main*</div>
                    <div className="text-brand-cyan">0 errors, 0 warnings</div>
                </div>
            </div>

            {/* Editor Body */}
            <div className="flex-1 flex flex-col bg-space-950/90 overflow-hidden">
                {/* Tabs bar */}
                <div className="h-8 bg-white/[0.03] border-b border-white/5 flex items-center px-2 gap-1 select-none overflow-x-auto">
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
                                className={`h-full px-3 text-[11px] flex items-center gap-1.5 border-t-2 transition-all ${
                                    isActive
                                        ? 'bg-space-950/80 text-white border-brand-cyan'
                                        : 'text-zinc-500 border-transparent hover:text-zinc-300'
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
                        <div className="pr-4 select-none text-zinc-600 text-right space-y-0.5 border-r border-white/5">
                            {lines.map((_, idx) => (
                                <div key={idx} className="leading-relaxed">
                                    {idx + 1}
                                </div>
                            ))}
                        </div>

                        {/* Code Content */}
                        <div className="pl-4 space-y-0.5 text-zinc-300 overflow-x-auto flex-1">
                            {lines.map((line, idx) => (
                                <div
                                    key={idx}
                                    className={`leading-relaxed whitespace-pre font-mono ${
                                        line.startsWith('//') || line.startsWith('#')
                                            ? 'text-zinc-500 italic'
                                            : line.includes(':') && line.includes('"')
                                            ? 'text-cyan-300'
                                            : line.includes('export') || line.includes('interface')
                                            ? 'text-purple-400 font-semibold'
                                            : 'text-zinc-300'
                                    }`}
                                >
                                    {line || ' '}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

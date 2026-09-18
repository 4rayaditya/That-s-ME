'use client';

import React, { useState } from 'react';
import {
    ArrowLeft,
    ArrowRight,
    ExternalLink,
    Copy,
    Check,
    Mail,
    Share2,
    CheckCircle2,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, GmailIcon } from '@/components/ui/Icons';
import { PERSONAL_INFO } from '@/data/portfolioData';
import { audio } from '@/lib/audio';

interface ContactChannel {
    name: string;
    description: string;
    url: string;
    secondaryUrl?: string;
    secondaryLabel?: string;
    displayValue: string;
    icon: React.ReactNode;
    actionLabel: string;
}

export default function WindowsMailApp() {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const channels: ContactChannel[] = [
        {
            name: 'GitHub',
            description: 'Public repositories, open-source pull requests & engineering activity',
            url: PERSONAL_INFO.github,
            displayValue: 'github.com/4rayaditya',
            icon: <GithubIcon className="w-6 h-6 text-[#24292f]" />,
            actionLabel: 'Visit GitHub',
        },
        {
            name: 'LinkedIn',
            description: 'Professional experience, verified roles & direct messaging',
            url: PERSONAL_INFO.linkedin,
            displayValue: 'linkedin.com/in/4rayaditya',
            icon: <LinkedinIcon className="w-6 h-6 text-[#0a66c2]" />,
            actionLabel: 'Connect on LinkedIn',
        },
        {
            name: 'Gmail',
            description: 'Direct email for internships, systems engineering & inquiries',
            url: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(PERSONAL_INFO.email)}`,
            secondaryUrl: `mailto:${PERSONAL_INFO.email}`,
            secondaryLabel: 'or open in default mail app',
            displayValue: PERSONAL_INFO.email,
            icon: <GmailIcon className="w-6 h-6 text-[#ea4335]" />,
            actionLabel: 'Open Gmail',
        },
    ];

    const handleCopy = (text: string, index: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        audio.playClick();
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden font-sans text-xs bg-[#ffffff] select-none text-[#1e1e1e]">
            {/* 1. Windows 7 Explorer Navigation & Address Command Bar */}
            <div className="h-10 px-2.5 bg-gradient-to-b from-[#f7f9fc] via-[#eaf0f7] to-[#dbe5f1] border-b border-[#b2bcc7] flex items-center justify-between gap-2 shadow-[inset_0_1px_0_#ffffff] flex-shrink-0">
                {/* Back / Forward Buttons */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => audio.playClick()}
                        className="w-6 h-6 rounded-full bg-gradient-to-b from-[#ffffff] to-[#d6e3f2] border border-[#899db4] hover:border-[#4d7ca8] flex items-center justify-center text-[#2a4768] shadow-xs cursor-pointer transition-colors"
                        title="Back"
                    >
                        <ArrowLeft className="w-3 h-3" />
                    </button>
                    <button
                        className="w-6 h-6 rounded-full bg-gradient-to-b from-[#ffffff] to-[#e8edf3] border border-[#b2bcc7] flex items-center justify-center text-[#94a3b8] cursor-default opacity-60"
                        title="Forward"
                        disabled
                    >
                        <ArrowRight className="w-3 h-3" />
                    </button>
                </div>

                {/* Breadcrumbs Address Bar */}
                <div className="flex-1 h-6 rounded-[2px] px-2 bg-white border border-[#828790] hover:border-[#3c7fb1] flex items-center gap-1 text-[11px] text-[#333333] shadow-[inset_0_1px_1px_rgba(0,0,0,0.1)] overflow-hidden transition-colors">
                    <Share2 className="w-3.5 h-3.5 text-[#0284c7] flex-shrink-0" />
                    <span className="text-[#555555]">Computer</span>
                    <span className="text-[#999999] text-[9px]">▶</span>
                    <span className="text-[#555555]">Network &amp; Sharing</span>
                    <span className="text-[#999999] text-[9px]">▶</span>
                    <span className="text-[#1e395b] font-semibold truncate">
                        Contact Channels
                    </span>
                </div>
            </div>

            {/* 2. Main Content Client Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar bg-[#ffffff]">
                {/* Group Header */}
                <div className="flex items-center">
                    <span className="text-xs font-bold text-[#1e395b] flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#2563eb]" />
                        Direct Communication Uplinks
                        <span className="text-[11px] font-normal text-[#666666]">
                            ({channels.length})
                        </span>
                    </span>
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-[#9ec4e8] to-transparent ml-3" />
                </div>

                <p className="text-[11px] text-[#555555]">
                    Select a channel below to initiate direct communication with Aditya Narayan Ray.
                </p>

                {/* 3 Channels Cards */}
                <div className="space-y-2.5 max-w-2xl">
                    {channels.map((channel, idx) => {
                        const isCopied = copiedIndex === idx;

                        return (
                            <div
                                key={channel.name}
                                className="p-3.5 rounded-[3px] bg-white border border-[#d2dbe6] hover:bg-gradient-to-b hover:from-[#f4f8fd] hover:to-[#eaf2fc] hover:border-[#b8d6fb] transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[inset_0_1px_0_#ffffff]"
                            >
                                {/* Left Info */}
                                <a
                                    href={channel.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => audio.playClick()}
                                    className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                                >
                                    <div className="w-10 h-10 rounded-[2px] bg-[#f4f7fb] border border-[#d2dbe6] flex items-center justify-center flex-shrink-0 shadow-[inset_0_1px_0_#ffffff]">
                                        {channel.icon}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xs font-bold text-[#1e1e1e] hover:text-[#0066cc]">
                                                {channel.name}
                                            </span>
                                            {channel.name === 'Gmail' && (
                                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#fee2e2] text-[#b91c1c] border border-[#fca5a5]">
                                                    Web Compose
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-[11px] text-[#0066cc] font-mono hover:underline truncate">
                                            {channel.displayValue}
                                        </div>
                                        <div className="text-[10px] text-[#666666] truncate mt-0.5">
                                            {channel.description}
                                        </div>
                                        {channel.secondaryUrl && (
                                            <div className="mt-0.5">
                                                <a
                                                    href={channel.secondaryUrl}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        audio.playClick();
                                                    }}
                                                    className="text-[10px] text-[#555555] hover:text-[#0066cc] hover:underline"
                                                >
                                                    {channel.secondaryLabel}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </a>

                                {/* Right Actions: Windows 7 Push Buttons */}
                                <div className="flex items-center gap-1.5 self-end sm:self-center flex-shrink-0">
                                    <button
                                        onClick={(e) => handleCopy(channel.displayValue, idx, e)}
                                        className={`px-2.5 py-1 rounded-[3px] border text-[11px] font-normal transition-all flex items-center gap-1 cursor-pointer ${
                                            isCopied
                                                ? 'bg-[#dcedfa] border-[#4a82b5] text-[#103a63] font-bold'
                                                : 'bg-gradient-to-b from-[#f7f8fa] to-[#e4e8ee] border-[#b0bac6] text-[#222222] hover:from-[#f2f8fe] hover:to-[#d2e8f8] hover:border-[#6da1ce] shadow-[inset_0_1px_0_#ffffff]'
                                        }`}
                                        title={isCopied ? 'Copied to clipboard' : 'Copy value'}
                                    >
                                        {isCopied ? (
                                            <>
                                                <Check className="w-3 h-3 text-[#008800]" />
                                                <span>Copied</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-3 h-3 text-[#555555]" />
                                                <span>Copy</span>
                                            </>
                                        )}
                                    </button>

                                    <a
                                        href={channel.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => audio.playClick()}
                                        className="px-2.5 py-1 rounded-[3px] bg-gradient-to-b from-[#f7f8fa] to-[#e4e8ee] hover:from-[#eef6fe] hover:to-[#d4e8f8] border border-[#a8b4c2] hover:border-[#4a82b5] text-[#1e395b] font-bold text-[11px] flex items-center gap-1 shadow-[inset_0_1px_0_#ffffff] cursor-pointer transition-colors"
                                    >
                                        <span>Open</span>
                                        <ExternalLink className="w-3 h-3 text-[#0066cc]" />
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 3. Windows 7 Explorer Status Bar */}
            <div className="h-6 px-3 bg-gradient-to-b from-[#f2f5f9] to-[#e4e9ef] border-t border-[#d0d7e0] flex items-center justify-between text-[11px] text-[#444444] shadow-[inset_0_1px_0_#ffffff] flex-shrink-0">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-[#16a34a]" />
                    <span>3 verified channels online</span>
                </div>
                <div className="text-[11px] text-[#666666]">
                    Computer | Network Uplinks
                </div>
            </div>
        </div>
    );
}

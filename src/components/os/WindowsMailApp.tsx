'use client';

import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, Inbox, SendHorizontal } from 'lucide-react';
import { PERSONAL_INFO } from '@/data/portfolioData';
import { audio } from '@/lib/audio';

export default function WindowsMailApp() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) return;

        audio.playSuccess();
        setIsSent(true);
        setTimeout(() => {
            setForm({ name: '', email: '', subject: '', message: '' });
            setIsSent(false);
        }, 5000);
    };

    return (
        <div className="flex-1 flex flex-col sm:flex-row overflow-hidden font-sans text-sm">
            {/* Left Mail Sidebar */}
            <div className="w-full sm:w-48 bg-white/[0.02] border-r border-white/10 p-3 flex flex-col justify-between">
                <div className="space-y-1">
                    <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-2 py-1">
                        Folders
                    </div>
                    <button className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-cyan-500/15 text-cyan-300 text-xs font-medium cursor-pointer">
                        <span className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5" />
                            Compose
                        </span>
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    </button>
                    <button className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/5 text-zinc-400 text-xs cursor-pointer">
                        <span className="flex items-center gap-2">
                            <Inbox className="w-3.5 h-3.5" />
                            Inbox
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">1</span>
                    </button>
                    <button className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/5 text-zinc-400 text-xs cursor-pointer">
                        <span className="flex items-center gap-2">
                            <SendHorizontal className="w-3.5 h-3.5" />
                            Sent
                        </span>
                    </button>
                </div>

                {/* Direct Uplinks */}
                <div className="pt-3 border-t border-white/10 space-y-1.5 text-xs">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase px-2">
                        Direct Channels
                    </div>
                    <a
                        href={PERSONAL_INFO.github}
                        target="_blank"
                        rel="noreferrer"
                        className="block px-2 py-1 text-zinc-400 hover:text-white rounded hover:bg-white/5 truncate"
                    >
                        GitHub: @4rayaditya
                    </a>
                    <a
                        href={PERSONAL_INFO.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="block px-2 py-1 text-zinc-400 hover:text-white rounded hover:bg-white/5 truncate"
                    >
                        LinkedIn: @4rayaditya
                    </a>
                </div>
            </div>

            {/* Right Message Compose Pane */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar flex flex-col justify-between">
                {isSent ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-bounce">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-white">Transmission Delivered!</h3>
                        <p className="text-xs text-zinc-400 max-w-sm">
                            Thank you for reaching out. Your transmission has been queued and Aditya will respond via email shortly.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-3.5 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-xs text-zinc-400">
                            <span className="w-16 font-mono text-zinc-500">To:</span>
                            <span className="px-2 py-0.5 rounded bg-white/5 text-cyan-300 font-mono border border-white/10">
                                {PERSONAL_INFO.email}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-xs text-zinc-400">
                            <span className="w-16 font-mono text-zinc-500">From Name:</span>
                            <input
                                type="text"
                                placeholder="Your Name or Organization"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                                className="flex-1 bg-transparent border-none outline-none text-white placeholder-zinc-500"
                            />
                        </div>

                        <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-xs text-zinc-400">
                            <span className="w-16 font-mono text-zinc-500">Your Email:</span>
                            <input
                                type="email"
                                placeholder="your.email@company.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                                className="flex-1 bg-transparent border-none outline-none text-white placeholder-zinc-500"
                            />
                        </div>

                        <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-xs text-zinc-400">
                            <span className="w-16 font-mono text-zinc-500">Subject:</span>
                            <input
                                type="text"
                                placeholder="High-Impact Role / Project Collaboration / Inquiry"
                                value={form.subject}
                                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                className="flex-1 bg-transparent border-none outline-none text-white placeholder-zinc-500"
                            />
                        </div>

                        <div className="flex-1 flex flex-col space-y-1.5 pt-1">
                            <textarea
                                placeholder="Write your message to Aditya Ray..."
                                value={form.message}
                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                required
                                className="flex-1 min-h-[140px] bg-white/[0.02] border border-white/10 rounded-lg p-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-400/50 resize-none"
                            />
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/10">
                            <span className="text-[11px] text-zinc-500 font-mono">
                                Security: TLS 1.3 Direct Uplink
                            </span>
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs transition-colors cursor-pointer shadow-md shadow-cyan-500/20"
                            >
                                <Send className="w-3.5 h-3.5" />
                                Send Message
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

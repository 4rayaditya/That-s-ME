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
        <div className="flex-1 flex flex-col sm:flex-row overflow-hidden font-sans text-sm bg-[#f8fafc]">
            {/* Left Mail Sidebar */}
            <div className="w-full sm:w-48 bg-slate-100/90 border-r border-slate-200 p-3 flex flex-col justify-between">
                <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1">
                        Folders
                    </div>
                    <button className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold cursor-pointer shadow-sm">
                        <span className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5" />
                            Compose
                        </span>
                        <span className="w-2 h-2 rounded-full bg-white" />
                    </button>
                    <button className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-200/60 text-slate-700 text-xs cursor-pointer transition-colors">
                        <span className="flex items-center gap-2">
                            <Inbox className="w-3.5 h-3.5 text-slate-500" />
                            Inbox
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono font-medium">1</span>
                    </button>
                    <button className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-200/60 text-slate-700 text-xs cursor-pointer transition-colors">
                        <span className="flex items-center gap-2">
                            <SendHorizontal className="w-3.5 h-3.5 text-slate-500" />
                            Sent
                        </span>
                    </button>
                </div>

                {/* Direct Uplinks */}
                <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs">
                    <div className="text-[10px] font-mono text-slate-500 uppercase px-2 font-semibold">
                        Direct Channels
                    </div>
                    <a
                        href={PERSONAL_INFO.github}
                        target="_blank"
                        rel="noreferrer"
                        className="block px-2 py-1 text-blue-700 hover:text-blue-900 hover:bg-slate-200/50 rounded truncate font-medium transition-colors"
                    >
                        GitHub: @4rayaditya
                    </a>
                    <a
                        href={PERSONAL_INFO.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="block px-2 py-1 text-blue-700 hover:text-blue-900 hover:bg-slate-200/50 rounded truncate font-medium transition-colors"
                    >
                        LinkedIn: @4rayaditya
                    </a>
                </div>
            </div>

            {/* Right Message Compose Pane */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar flex flex-col justify-between bg-white">
                {isSent ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center shadow-md animate-bounce">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900">Transmission Delivered!</h3>
                        <p className="text-xs text-slate-600 max-w-sm leading-relaxed">
                            Thank you for reaching out. Your transmission has been queued and Aditya will respond via email shortly.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-3.5 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-200 text-xs">
                            <span className="w-24 font-semibold text-slate-600">To:</span>
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono border border-blue-200 font-medium">
                                {PERSONAL_INFO.email}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-200 text-xs">
                            <span className="w-24 font-semibold text-slate-600">From Name:</span>
                            <input
                                type="text"
                                placeholder="Your Name or Organization"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                                className="flex-1 bg-transparent border-none outline-none text-slate-900 font-medium placeholder-slate-400"
                            />
                        </div>

                        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-200 text-xs">
                            <span className="w-24 font-semibold text-slate-600">Your Email:</span>
                            <input
                                type="email"
                                placeholder="your.email@company.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                                className="flex-1 bg-transparent border-none outline-none text-slate-900 font-medium placeholder-slate-400"
                            />
                        </div>

                        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-200 text-xs">
                            <span className="w-24 font-semibold text-slate-600">Subject:</span>
                            <input
                                type="text"
                                placeholder="High-Impact Role / Project Collaboration / Inquiry"
                                value={form.subject}
                                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                className="flex-1 bg-transparent border-none outline-none text-slate-900 font-medium placeholder-slate-400"
                            />
                        </div>

                        <div className="flex-1 flex flex-col space-y-1.5 pt-1">
                            <textarea
                                placeholder="Write your message to Aditya Ray..."
                                value={form.message}
                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                required
                                className="flex-1 min-h-[140px] bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none shadow-inner"
                            />
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                            <span className="text-[11px] text-slate-500 font-mono">
                                Security: TLS 1.3 Direct Uplink
                            </span>
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
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

'use client';

import React, { useState } from 'react';
import { Send, Mail, Copy, Check, Terminal, Radio } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterXIcon } from '@/components/ui/Icons';
import { PERSONAL_INFO } from '@/data/portfolioData';
import { audio } from '@/lib/audio';
import confetti from 'canvas-confetti';

export default function ContactApp() {
    const [copied, setCopied] = useState(false);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', message: '' });

    const handleCopy = () => {
        navigator.clipboard.writeText(PERSONAL_INFO.email);
        audio.playSuccess();
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) return;

        audio.playClick();
        setSending(true);

        setTimeout(() => {
            setSending(false);
            setSent(true);
            audio.playSuccess();
            confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#00f5d4', '#9d4edd', '#ffffff'],
            });
            setForm({ name: '', email: '', message: '' });
            setTimeout(() => setSent(false), 5000);
        }, 1200);
    };

    return (
        <div className="p-4 sm:p-6 font-mono text-xs max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-brand-cyan">
                    <Radio className="w-4 h-4 animate-pulse" />
                    <span className="font-bold">SIGNAL DISPATCH // ENCRYPTED UPLINK</span>
                </div>
                <div className="text-[10px] text-emerald-400">NODE STATUS: LISTENING</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <div className="text-[10px] text-zinc-500">INBOX</div>
                    <div className="text-white font-bold truncate">{PERSONAL_INFO.email}</div>
                    <button
                        onClick={handleCopy}
                        className="text-[10px] text-brand-cyan hover:underline flex items-center gap-1 pt-1"
                    >
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copied ? 'COPIED' : 'COPY EMAIL'}
                    </button>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <div className="text-[10px] text-zinc-500">LOCATION</div>
                    <div className="text-white font-bold">{PERSONAL_INFO.location}</div>
                    <div className="text-[10px] text-zinc-400">Available Globally</div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                    <div className="text-[10px] text-zinc-500">PROFILES</div>
                    <div className="flex gap-3 pt-1">
                        <a href={PERSONAL_INFO.github} target="_blank" rel="noreferrer" className="text-zinc-300 hover:text-white">
                            <GithubIcon className="w-4 h-4" />
                        </a>
                        <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className="text-zinc-300 hover:text-brand-blue">
                            <LinkedinIcon className="w-4 h-4" />
                        </a>
                        <a href={PERSONAL_INFO.twitter} target="_blank" rel="noreferrer" className="text-zinc-300 hover:text-brand-cyan">
                            <TwitterXIcon className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Transmission Form */}
            <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="text-[11px] text-zinc-400">Compose transmission packet:</div>

                <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500">CALLSIGN / SENDER NAME</label>
                    <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Alex Vance"
                        className="w-full px-3 py-2 rounded-lg bg-space-950 border border-white/10 focus:border-brand-cyan text-white text-xs outline-none"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500">RETURN FREQUENCY / EMAIL</label>
                    <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="alex@nexus.org"
                        className="w-full px-3 py-2 rounded-lg bg-space-950 border border-white/10 focus:border-brand-cyan text-white text-xs outline-none"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500">PACKET PAYLOAD / MESSAGE</label>
                    <textarea
                        required
                        rows={3}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Inquire about 3D WebGL contracts, full-stack architecture, or creative development roles..."
                        className="w-full px-3 py-2 rounded-lg bg-space-950 border border-white/10 focus:border-brand-cyan text-white text-xs outline-none resize-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-2.5 rounded-lg bg-brand-cyan text-space-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,245,212,0.4)] hover:shadow-[0_0_25px_rgba(0,245,212,0.7)] transition-all disabled:opacity-50"
                >
                    {sending ? (
                        <span>TRANSMITTING PAYLOAD...</span>
                    ) : sent ? (
                        <span className="flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            TRANSMISSION DISPATCHED TO ADITYA!
                        </span>
                    ) : (
                        <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Transmit Packet</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Copy, Check, Sparkles, MessageSquare, Terminal } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterXIcon } from '@/components/ui/Icons';
import { PERSONAL_INFO } from '@/data/portfolioData';
import { audio } from '@/lib/audio';
import confetti from 'canvas-confetti';

export default function ContactSection() {
    const [copied, setCopied] = useState(false);
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
    const [form, setForm] = useState({ name: '', email: '', message: '' });

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(PERSONAL_INFO.email);
        audio.playSuccess();
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) return;

        audio.playClick();
        setStatus('sending');

        setTimeout(() => {
            setStatus('sent');
            audio.playSuccess();
            confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#00f5d4', '#00b4d8', '#9d4edd', '#ffffff'],
            });
            setForm({ name: '', email: '', message: '' });
            setTimeout(() => setStatus('idle'), 5000);
        }, 1200);
    };

    return (
        <section id="contact" className="relative py-24 px-4 sm:px-6 max-w-5xl mx-auto">
            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand-cyan/10 blur-[150px] pointer-events-none -z-10" />

            {/* Section Header */}
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-semibold bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 mb-3">
                    <Send className="w-3.5 h-3.5" />
                    <span>TRANSMISSION CHANNEL</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                    Initiate <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple">Contact</span>
                </h2>
                <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
                    Have an ambitious WebGL concept, high-scale application, or leadership role? Let's build something extraordinary together.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Left Info & Direct Channels (2 cols) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="p-6 sm:p-7 rounded-2xl bg-space-900/80 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center gap-2 text-xs font-mono text-brand-cyan mb-2">
                            <Mail className="w-4 h-4" />
                            DIRECT INBOX
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-white break-all">{PERSONAL_INFO.email}</h3>
                        <p className="text-xs text-zinc-400 mt-1">
                            Monitored daily. Replies typically dispatched within 24 hours.
                        </p>

                        <button
                            onClick={handleCopyEmail}
                            onMouseEnter={() => audio.playHover()}
                            className="mt-5 w-full py-2.5 px-4 rounded-xl bg-white/[0.04] border border-white/10 hover:border-brand-cyan/40 text-xs font-mono text-zinc-200 hover:text-brand-cyan transition-all flex items-center justify-center gap-2"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4 text-emerald-400" />
                                    <span>COPIED TO CLIPBOARD</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    <span>COPY TRANSMISSION ADDRESS</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Social Hub */}
                    <div className="p-6 rounded-2xl bg-space-900/80 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                        <div className="text-xs font-mono text-zinc-400 mb-4">
                            VERIFIED DIGITAL PROFILES
                        </div>
                        <div className="grid grid-cols-3 gap-2.5">
                            <a
                                href={PERSONAL_INFO.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => audio.playClick()}
                                className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/25 flex flex-col items-center gap-1.5 text-zinc-300 hover:text-white transition-all group"
                            >
                                <GithubIcon className="w-5 h-5 group-hover:scale-110 transition-transform text-white" />
                                <span className="text-[11px] font-mono">GitHub</span>
                            </a>
                            <a
                                href={PERSONAL_INFO.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => audio.playClick()}
                                className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-brand-blue/40 flex flex-col items-center gap-1.5 text-zinc-300 hover:text-brand-blue transition-all group"
                            >
                                <LinkedinIcon className="w-5 h-5 group-hover:scale-110 transition-transform text-brand-blue" />
                                <span className="text-[11px] font-mono">LinkedIn</span>
                            </a>
                            <a
                                href={PERSONAL_INFO.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => audio.playClick()}
                                className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-brand-cyan/40 flex flex-col items-center gap-1.5 text-zinc-300 hover:text-brand-cyan transition-all group"
                            >
                                <TwitterXIcon className="w-5 h-5 group-hover:scale-110 transition-transform text-brand-cyan" />
                                <span className="text-[11px] font-mono">Twitter / X</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Right Interactive Transmission Form (3 cols) */}
                <div className="lg:col-span-3">
                    <form
                        onSubmit={handleSubmit}
                        className="p-6 sm:p-8 rounded-2xl bg-space-900/90 border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.6)] space-y-5"
                    >
                        <div className="flex items-center justify-between pb-3 border-b border-white/5 text-xs font-mono">
                            <span className="text-zinc-400 flex items-center gap-1.5">
                                <Terminal className="w-3.5 h-3.5 text-brand-cyan" />
                                DISPATCH PACKET TERMINAL
                            </span>
                            <span className="text-emerald-400">ENCRYPTION: ACTIVE</span>
                        </div>

                        {/* Name Field */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-mono text-zinc-300">YOUR CALLSIGN / NAME</label>
                            <input
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="e.g. Alex Mercer"
                                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-brand-cyan text-white placeholder:text-zinc-600 outline-none text-sm font-sans transition-all"
                            />
                        </div>

                        {/* Email Field */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-mono text-zinc-300">RETURN TRANSMISSION EMAIL</label>
                            <input
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="alex@quantum.io"
                                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-brand-cyan text-white placeholder:text-zinc-600 outline-none text-sm font-sans transition-all"
                            />
                        </div>

                        {/* Message Field */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-mono text-zinc-300">PROJECT SCOPE & DIRECTIVE</label>
                            <textarea
                                required
                                rows={4}
                                value={form.message}
                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                placeholder="Details about your timeline, design vision, 3D requirements, or open engineering role..."
                                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-brand-cyan text-white placeholder:text-zinc-600 outline-none text-sm font-sans transition-all resize-none"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={status === 'sending'}
                            onMouseEnter={() => audio.playHover()}
                            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-space-950 font-bold text-sm shadow-[0_0_20px_rgba(0,245,212,0.4)] hover:shadow-[0_0_35px_rgba(0,245,212,0.7)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {status === 'sending' ? (
                                <span className="flex items-center gap-2 font-mono">
                                    <span className="w-4 h-4 border-2 border-space-950 border-t-transparent rounded-full animate-spin" />
                                    ENCRYPTING & TRANSMITTING...
                                </span>
                            ) : status === 'sent' ? (
                                <span className="flex items-center gap-2 font-mono text-space-950">
                                    <Check className="w-4 h-4" />
                                    TRANSMISSION RECEIVED SUCCESSFULLY!
                                </span>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    <span>Dispatch Secure Message</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

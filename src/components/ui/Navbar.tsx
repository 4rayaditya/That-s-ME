'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Menu, X, Sparkles, Send } from 'lucide-react';
import { audio } from '@/lib/audio';

const NAV_ITEMS = [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Journey', href: '#journey' },
    { label: 'Lab', href: '#lab' },
    { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
    const [activeSection, setActiveSection] = useState('hero');
    const [scrolled, setScrolled] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        setIsMuted(audio.getMuted());

        const handleScroll = () => {
            setScrolled(window.scrollY > 40);

            // Determine active section
            const sections = ['about', 'projects', 'skills', 'journey', 'lab', 'contact'];
            const scrollPos = window.scrollY + 200;

            for (const sectionId of sections) {
                const el = document.getElementById(sectionId);
                if (el) {
                    const top = el.offsetTop;
                    const height = el.offsetHeight;
                    if (scrollPos >= top && scrollPos < top + height) {
                        setActiveSection(sectionId);
                        break;
                    }
                }
            }
            if (window.scrollY < 200) {
                setActiveSection('hero');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSoundToggle = () => {
        const muted = audio.toggleMute();
        setIsMuted(muted);
    };

    const handleNavClick = (href: string) => {
        audio.playClick();
        setMobileOpen(false);
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-40 flex justify-center px-4 py-4 md:py-6 transition-all duration-300">
            <motion.nav
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`w-full max-w-5xl rounded-2xl transition-all duration-300 flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 ${
                    scrolled
                        ? 'bg-space-950/80 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
                        : 'bg-space-950/40 backdrop-blur-md border border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.25)]'
                }`}
            >
                {/* Brand / Moniker */}
                <a
                    href="#hero"
                    onClick={(e) => {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        audio.playClick();
                    }}
                    className="flex items-center gap-2.5 group cursor-pointer"
                    onMouseEnter={() => audio.playHover()}
                >
                    <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-cyan/20 to-brand-purple/20 border border-brand-cyan/30 group-hover:border-brand-cyan transition-all shadow-[0_0_15px_rgba(0,245,212,0.15)] group-hover:shadow-[0_0_20px_rgba(0,245,212,0.4)]">
                        <span className="font-bold text-sm tracking-wider text-brand-cyan font-mono">AR</span>
                        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-brand-cyan animate-ping" />
                        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-brand-cyan" />
                    </div>
                    <div className="hidden sm:flex flex-col text-left">
                        <span className="text-sm font-semibold tracking-wide text-white group-hover:text-brand-cyan transition-colors">
                            Aditya Ray
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400">Creative Technologist</span>
                    </div>
                </a>

                {/* Desktop Nav Items */}
                <div className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/5 rounded-xl px-2 py-1">
                    {NAV_ITEMS.map((item) => {
                        const isActive = activeSection === item.href.substring(1);
                        return (
                            <button
                                key={item.label}
                                onClick={() => handleNavClick(item.href)}
                                onMouseEnter={() => audio.playHover()}
                                className={`relative px-3.5 py-1.5 text-xs font-medium transition-all duration-200 rounded-lg ${
                                    isActive
                                        ? 'text-brand-cyan font-semibold'
                                        : 'text-zinc-300 hover:text-white hover:bg-white/[0.04]'
                                }`}
                            >
                                {item.label}
                                {isActive && (
                                    <motion.div
                                        layoutId="activePill"
                                        className="absolute inset-0 rounded-lg bg-brand-cyan/10 border border-brand-cyan/30 shadow-[0_0_12px_rgba(0,245,212,0.2)]"
                                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Right controls: Sound FX toggle + Let's Talk CTA */}
                <div className="flex items-center gap-2.5">
                    {/* Audio Toggle */}
                    <button
                        onClick={handleSoundToggle}
                        onMouseEnter={() => audio.playHover()}
                        className={`relative p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-mono ${
                            !isMuted
                                ? 'bg-brand-cyan/15 border-brand-cyan/50 text-brand-cyan shadow-[0_0_15px_rgba(0,245,212,0.25)]'
                                : 'bg-white/[0.04] border-white/10 text-zinc-400 hover:text-zinc-200 hover:border-white/20'
                        }`}
                        title={isMuted ? 'Turn Sound ON (synthesized Web Audio)' : 'Mute Sound'}
                    >
                        {!isMuted ? (
                            <>
                                <Volume2 className="w-4 h-4 text-brand-cyan" />
                                <span className="hidden lg:inline text-[10px]">AUDIO ON</span>
                                <span className="flex items-end gap-0.5 h-3">
                                    <span className="w-0.5 h-3 bg-brand-cyan animate-pulse" />
                                    <span className="w-0.5 h-1.5 bg-brand-cyan animate-pulse delay-75" />
                                    <span className="w-0.5 h-2.5 bg-brand-cyan animate-pulse delay-150" />
                                </span>
                            </>
                        ) : (
                            <>
                                <VolumeX className="w-4 h-4" />
                                <span className="hidden lg:inline text-[10px]">SOUND OFF</span>
                            </>
                        )}
                    </button>

                    {/* Contact Button */}
                    <a
                        href="#contact"
                        onClick={(e) => {
                            e.preventDefault();
                            handleNavClick('#contact');
                        }}
                        onMouseEnter={() => audio.playHover()}
                        className="relative hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-space-950 font-semibold text-xs shadow-[0_0_20px_rgba(0,245,212,0.3)] hover:shadow-[0_0_30px_rgba(0,245,212,0.6)] hover:scale-[1.03] active:scale-[0.98] transition-all"
                    >
                        <Send className="w-3.5 h-3.5" />
                        <span>Hire / Connect</span>
                    </a>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => {
                            audio.playClick();
                            setMobileOpen(!mobileOpen);
                        }}
                        className="p-2 md:hidden rounded-xl bg-white/[0.04] border border-white/10 text-zinc-300 hover:text-white"
                        aria-label="Toggle Navigation Menu"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Navigation Dropdown */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-x-4 top-20 z-50 md:hidden bg-space-950/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-[0_12px_40px_rgba(0,0,0,0.8)] flex flex-col gap-2"
                    >
                        {NAV_ITEMS.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => handleNavClick(item.href)}
                                className="w-full py-3 px-4 text-left font-medium text-sm text-zinc-200 hover:text-brand-cyan hover:bg-white/[0.05] rounded-xl transition-all"
                            >
                                {item.label}
                            </button>
                        ))}
                        <button
                            onClick={() => handleNavClick('#contact')}
                            className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-space-950 font-bold text-center text-sm shadow-[0_0_20px_rgba(0,245,212,0.4)]"
                        >
                            Initiate Transmission
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

'use client';

import { useState } from 'react';
import Hero from '@/components/sections/Hero';
import { IntroSequence } from '@/components/intro/IntroSequence';

export default function Home() {
    const [showIntro, setShowIntro] = useState(true);

    return (
        <main className="relative w-full h-screen overflow-hidden">
            {/* Intro Sequence - TV Static & Mission Briefing */}
            {showIntro && <IntroSequence onComplete={() => setShowIntro(false)} />}
            
            {/* Single Page - Space Universe */}
            <Hero />
        </main>
    );
}

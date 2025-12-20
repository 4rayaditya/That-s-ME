'use client';

import { useEffect } from 'react';
import Hero from '@/components/sections/Hero';
import Projects from '@/components/sections/Projects';
import { JourneyMap } from '@/components/ui/JourneyMap';
import { useJourneyStore } from '@/store/journeyStore';

export default function Home() {
    const { currentSection, setCurrentSection } = useJourneyStore();

    const sections = ['Home', 'Projects', 'Contact'];

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;

            const sectionIndex = Math.min(
                Math.floor(scrollPosition / windowHeight),
                sections.length - 1
            );

            if (sectionIndex !== currentSection) {
                setCurrentSection(sectionIndex);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [currentSection, setCurrentSection, sections.length]);

    return (
        <main className="relative w-full">
            {/* Journey Map */}
            <JourneyMap sections={sections} currentSection={currentSection} />

            {/* Hero Section */}
            <Hero />

            {/* Projects Section */}
            <Projects />

            {/* Contact Section */}
            <section id="contact" className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-black to-gray-900 py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Let's Build Something <span className="text-primary-400">Amazing</span>
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                        I'm always interested in new opportunities and collaborations. Feel free to reach out!
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="mailto:your.email@example.com"
                            className="px-8 py-4 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/50"
                        >
                            Send Email
                        </a>
                        <a
                            href="https://linkedin.com/in/yourprofile"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors backdrop-blur-sm"
                        >
                            LinkedIn
                        </a>
                        <a
                            href="https://github.com/yourusername"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors backdrop-blur-sm"
                        >
                            GitHub
                        </a>
                    </div>

                    {/* Footer */}
                    <div className="mt-20 pt-8 border-t border-gray-800">
                        <p className="text-gray-500 text-sm">
                            © {new Date().getFullYear()} Your Name. Built with Next.js & React Three Fiber.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}

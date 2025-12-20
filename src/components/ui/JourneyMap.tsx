'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

interface JourneyMapProps {
    sections: string[];
    currentSection: number;
}

export function JourneyMap({ sections, currentSection }: JourneyMapProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), 3000);
        return () => clearTimeout(timer);
    }, [currentSection]);

    return (
        <div
            className={cn(
                'fixed top-20 right-6 z-30 transition-all duration-500',
                visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
            )}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            <div className="bg-black/80 backdrop-blur-lg rounded-2xl p-4 border border-primary-500/30 shadow-xl">
                <h3 className="text-sm font-semibold text-primary-400 mb-3">Journey Map</h3>

                <div className="space-y-3">
                    {sections.map((section, index) => (
                        <div
                            key={section}
                            className={cn(
                                'flex items-center gap-3 transition-all duration-300',
                                index === currentSection ? 'scale-110' : 'scale-100'
                            )}
                        >
                            {/* Dot */}
                            <div
                                className={cn(
                                    'w-3 h-3 rounded-full transition-all duration-300',
                                    index === currentSection
                                        ? 'bg-primary-400 shadow-lg shadow-primary-500/50 ring-4 ring-primary-400/20'
                                        : index < currentSection
                                            ? 'bg-primary-600'
                                            : 'bg-gray-600'
                                )}
                            />

                            {/* Label */}
                            <span
                                className={cn(
                                    'text-sm transition-colors duration-300',
                                    index === currentSection
                                        ? 'text-white font-semibold'
                                        : index < currentSection
                                            ? 'text-gray-400'
                                            : 'text-gray-600'
                                )}
                            >
                                {section}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Progress bar */}
                <div className="mt-4 pt-3 border-t border-gray-700">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                        <span>Progress</span>
                        <span>{Math.round(((currentSection + 1) / sections.length) * 100)}%</span>
                    </div>
                    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500"
                            style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

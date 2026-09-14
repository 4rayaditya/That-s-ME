import type { Metadata } from 'next';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import MagneticCursor from '@/components/ui/MagneticCursor';

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
    display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-mono',
    display: 'swap',
});

export const metadata: Metadata = {
    metadataBase: new URL('https://adityaray.dev'),
    title: 'Aditya Ray | Creative Technologist & Full-Stack 3D Engineer',
    description:
        'Portfolio of Aditya Ray (@4rayaditya). Crafting high-performance digital worlds at the intersection of creative WebGL engineering and distributed cloud systems.',
    keywords: [
        'Aditya Ray',
        '4rayaditya',
        'Creative Technologist',
        'WebGL Developer',
        'Three.js Portfolio',
        'React Three Fiber',
        'Next.js 14',
        'GLSL Shaders',
        'Frontend Engineer',
        'Full-Stack Developer',
    ],
    authors: [{ name: 'Aditya Ray', url: 'https://github.com/4rayaditya' }],
    creator: 'Aditya Ray',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://github.com/4rayaditya',
        siteName: 'Aditya Ray Portfolio',
        title: 'Aditya Ray | Creative Technologist & Full-Stack 3D Engineer',
        description:
            'Interactive 3D WebGL developer portfolio featuring real-time physics simulations, shader playgrounds, and high-scale full-stack platforms.',
        images: [
            {
                url: '/images/projects/nexus-ai.jpg',
                width: 1200,
                height: 675,
                alt: 'Aditya Ray 3D Portfolio',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Aditya Ray | Creative Technologist',
        description: 'Interactive 3D WebGL developer portfolio featuring real-time physics and high-scale platforms.',
        images: ['/images/projects/nexus-ai.jpg'],
        creator: '@4rayaditya',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`dark ${outfit.variable} ${jetbrainsMono.variable}`}>
            <body className="bg-[#030508] text-zinc-100 min-h-screen">
                <MagneticCursor />
                {children}
            </body>
        </html>
    );
}

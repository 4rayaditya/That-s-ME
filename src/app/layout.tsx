import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { PerformanceDetector } from '@/components/PerformanceDetector';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: '3D Portfolio | Your Name - Frontend Engineer',
    description: 'Senior Frontend Engineer specializing in high-performance 3D web experiences. Explore my projects built with Next.js, React Three Fiber, and WebGL.',
    keywords: ['portfolio', '3D web development', 'React Three Fiber', 'WebGL', 'Next.js', 'Frontend Engineer'],
    authors: [{ name: 'Your Name' }],
    creator: 'Your Name',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://yourportfolio.com',
        siteName: '3D Portfolio',
        title: '3D Portfolio | Your Name - Frontend Engineer',
        description: 'Senior Frontend Engineer specializing in high-performance 3D web experiences.',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Portfolio Preview',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: '3D Portfolio | Your Name',
        description: 'Senior Frontend Engineer specializing in high-performance 3D web experiences.',
        images: ['/og-image.jpg'],
        creator: '@yourhandle',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className={inter.className}>
                <PerformanceDetector />
                {children}
            </body>
        </html>
    );
}

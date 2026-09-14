import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: {
                    cyan: '#00f5d4',
                    blue: '#00b4d8',
                    purple: '#9d4edd',
                    violet: '#7b2cbf',
                    pink: '#ff007f',
                    amber: '#ffb703',
                },
                space: {
                    950: '#030508',
                    900: '#060911',
                    850: '#0a0e1c',
                    800: '#0f172a',
                    700: '#1e293b',
                },
            },
            fontFamily: {
                sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
                display: ['var(--font-space)', 'system-ui', 'sans-serif'],
                mono: ['var(--font-mono)', 'monospace'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'float-slow': 'float 9s ease-in-out infinite',
                'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
                'shimmer': 'shimmer 2.5s linear infinite',
                'spin-slow': 'spin 20s linear infinite',
                'aurora': 'aurora 15s ease infinite alternate',
                'radar': 'radar 4s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-14px)' },
                },
                pulseGlow: {
                    '0%, 100%': { opacity: '0.4', filter: 'blur(20px)' },
                    '50%': { opacity: '0.8', filter: 'blur(30px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                aurora: {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                },
                radar: {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'cyber-grid': 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.07) 1px, transparent 0)',
            },
        },
    },
    plugins: [],
};

export default config;

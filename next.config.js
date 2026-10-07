/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true,
    },

    // Optimize for 3D content
    webpack: (config, { isServer }) => {
        // Handle .glb/.gltf files
        config.module.rules.push({
            test: /\.(glb|gltf)$/,
            type: 'asset/resource',
        });

        // Optimize three.js bundle
        if (!isServer) {
            config.resolve.alias = {
                ...config.resolve.alias,
                three: require.resolve('three'),
            };
        }

        return config;
    },

    // Image optimization
    images: {
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },

    // Performance optimizations
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },

    // Enable experimental features for better performance
    experimental: {
        optimizePackageImports: ['@react-three/fiber', '@react-three/drei'],
    },

    // Rewrite /resume and /cv directly to the PDF file
    async rewrites() {
        return [
            {
                source: '/resume',
                destination: '/resume.pdf',
            },
            {
                source: '/cv',
                destination: '/resume.pdf',
            },
        ];
    },

    // Ensure correct content-type and inline disposition headers so browsers render PDF inline
    async headers() {
        return [
            {
                source: '/resume.pdf',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'application/pdf',
                    },
                    {
                        key: 'Content-Disposition',
                        value: 'inline; filename="Aditya_Narayan_Ray_Resume.pdf"',
                    },
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=3600, must-revalidate',
                    },
                ],
            },
            {
                source: '/resume',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'application/pdf',
                    },
                    {
                        key: 'Content-Disposition',
                        value: 'inline; filename="Aditya_Narayan_Ray_Resume.pdf"',
                    },
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=3600, must-revalidate',
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;

export interface Project {
    id: string;
    title: string;
    subtitle: string;
    category: '3d' | 'fullstack' | 'systems';
    categoryLabel: string;
    description: string;
    longDescription: string;
    tags: string[];
    image: string;
    metrics: { label: string; value: string }[];
    architecture: string[];
    liveUrl: string;
    githubUrl: string;
    featured: boolean;
    year: string;
}

export interface SkillCategory {
    title: string;
    color: string;
    skills: {
        name: string;
        level: number;
        icon: string;
        highlight?: string;
    }[];
}

export interface ExperienceItem {
    id: string;
    role: string;
    company: string;
    period: string;
    location: string;
    description: string;
    achievements: string[];
    technologies: string[];
}

export interface EducationItem {
    degree: string;
    institution: string;
    year: string;
    badge: string;
    description: string;
}

export const PERSONAL_INFO = {
    name: 'Aditya Ray',
    handle: '@4rayaditya',
    role: 'Creative Technologist & Full-Stack 3D Engineer',
    bio: 'Crafting fluid, high-performance digital worlds at the intersection of creative WebGL engineering and distributed cloud systems.',
    location: 'Remote / Global',
    status: 'Available for Select Contracts & High-Impact Roles',
    email: 'aditya.ray.dev@gmail.com',
    github: 'https://github.com/4rayaditya',
    linkedin: 'https://linkedin.com/in/4rayaditya',
    twitter: 'https://twitter.com/4rayaditya',
    stats: [
        { label: 'Years Experience', value: '5+', change: '+2020' },
        { label: 'MAU Handled', value: '250K+', change: 'Global' },
        { label: 'Performance', value: '60 FPS', change: 'Optimized' },
        { label: 'Projects Shipped', value: '32+', change: 'Production' },
    ],
    principles: [
        { title: 'Extreme Visual Rigor', desc: 'Crafting interfaces that elicit emotional wonder while retaining microsecond reactivity.' },
        { title: 'WebGL / GPU First', desc: 'Harnessing shaders and Three.js pipelines without compromising battery or mobile frames.' },
        { title: 'Bulletproof Cloud Backends', desc: 'Building resilient PostgreSQL, Redis caching, and async event queues that never drop a packet.' },
    ]
};

export const PROJECTS: Project[] = [
    {
        id: 'nexus-ai',
        title: 'NexusAI Global Telemetry',
        subtitle: 'Real-time 3D telemetry and neural analytics engine',
        category: '3d',
        categoryLabel: '3D & WebGL',
        description: 'An interactive 3D globe telemetry platform tracking millions of global microservices with real-time neural clustering and sub-50ms streaming updates.',
        longDescription: 'Engineered an interactive 3D globe visualization utilizing custom WebGL fragment shaders and instanced mesh buffers. The platform ingests telemetry from 12,000+ edge nodes globally, running real-time anomaly detection and delivering dynamic 60fps data density to mission-critical operations centers.',
        tags: ['Three.js', 'Next.js 14', 'WebGL', 'TypeScript', 'Tailwind CSS', 'Redis', 'WebSockets'],
        image: '/images/projects/nexus-ai.jpg',
        metrics: [
            { label: 'Live Data Points', value: '4.1M+' },
            { label: 'Render Latency', value: '<16ms' },
            { label: 'Edge Nodes', value: '12,784' },
        ],
        architecture: [
            'Custom GLSL instanced point-cloud sphere rendering 100,000 coordinates in 1 draw call.',
            'WebSocket binary payload compression reducing telemetry bandwidth by 68%.',
            'Full glassmorphic HUD system engineered with hardware-accelerated CSS layers.',
        ],
        liveUrl: 'https://github.com/4rayaditya',
        githubUrl: 'https://github.com/4rayaditya',
        featured: true,
        year: '2024',
    },
    {
        id: 'aerosphere',
        title: 'AeroSphere 3D Configurator',
        subtitle: 'Photorealistic WebXR product customizer with exploded CAD views',
        category: '3d',
        categoryLabel: '3D & WebGL',
        description: 'Next-generation 3D drone studio with real-time PBR material swapper, exploded internal mechanics, and instant WebXR spatial preview.',
        longDescription: 'Created a photorealistic browser-based configurator for autonomous aerial hardware. Features high-fidelity physically based rendering (PBR), dynamic shadow planes, interactive exploded component hierarchies, and zero-loss mobile WebXR AR preview.',
        tags: ['React Three Fiber', 'Three.js', 'GSAP', 'GLTF / PBR', 'TypeScript', 'Zustand'],
        image: '/images/projects/aerosphere.jpg',
        metrics: [
            { label: 'E-Commerce Lift', value: '+42%' },
            { label: 'Load Time', value: '1.2s' },
            { label: 'Material States', value: '64 Variations' },
        ],
        architecture: [
            'Custom Draco-compressed 3D asset pipeline delivering 45MB CAD geometry in 3.8MB.',
            'Procedural micro-roughness shader producing authentic brushed titanium and carbon fiber finishes.',
            'GSAP timeline orchestrator synchronizing camera orbit choreography with UI telemetry panels.',
        ],
        liveUrl: 'https://github.com/4rayaditya',
        githubUrl: 'https://github.com/4rayaditya',
        featured: true,
        year: '2024',
    },
    {
        id: 'hyperverse',
        title: 'HyperVerse Spatial Arena',
        subtitle: 'Massive multiplayer virtual concert hall & interactive festival stage',
        category: 'fullstack',
        categoryLabel: 'Full-Stack Web',
        description: 'Immersive browser-based virtual festival space hosting thousands of synchronized concurrent users with spatial audio and interactive stage lighting.',
        longDescription: 'Conceived and implemented a high-capacity virtual venue supporting synchronized avatar physics, WebRTC spatial multi-channel audio, and live stage DMX laser visualizers driven by real-time audio FFT frequency analysis.',
        tags: ['Next.js', 'WebRTC', 'Three.js', 'Web Audio API', 'Node.js', 'Socket.io', 'AWS'],
        image: '/images/projects/hyperverse.jpg',
        metrics: [
            { label: 'Concurrent Users', value: '15,000+' },
            { label: 'Spatial Audio Channels', value: '128' },
            { label: 'Audio Latency', value: '<25ms' },
        ],
        architecture: [
            'Distributed Node.js cluster with Redis Pub/Sub managing state synchronization across 5 global regions.',
            'Spatial audio engine calculating directional distance attenuation and 3D reverb impulse responses.',
            'Volumetric neon lighting shaders reacting synchronously to beat frequency analysis in real-time.',
        ],
        liveUrl: 'https://github.com/4rayaditya',
        githubUrl: 'https://github.com/4rayaditya',
        featured: true,
        year: '2023',
    },
    {
        id: 'vortexgl',
        title: 'VortexGL Particle Physics Engine',
        subtitle: 'Hardware-accelerated compute simulation running 10M particles in-browser',
        category: 'systems',
        categoryLabel: 'Systems & Shaders',
        description: 'A WebGL 2.0 computational playground simulating n-body gravitational kinematics, fluid vortex dynamics, and chromatic aberration shaders.',
        longDescription: 'Engineered a modular WebGL simulation engine leveraging ping-pong Framebuffer Object (FBO) textures to compute particle acceleration directly on the GPU. Allows users to manipulate gravity wells, turbulence noise, and optical refraction at a blistering 120 FPS.',
        tags: ['WebGL 2.0', 'GLSL Shaders', 'GPGPU / FBO', 'TypeScript', 'Vite', 'Math.js'],
        image: '/images/projects/vortexgl.jpg',
        metrics: [
            { label: 'Simulated Particles', value: '1,000,000+' },
            { label: 'GPU Frame Time', value: '3.2ms' },
            { label: 'Target Refresh', value: '120 FPS' },
        ],
        architecture: [
            'GPGPU texture-based numerical integration solving Newton-Euler equations directly in fragment shaders.',
            'Custom post-processing pass providing bloom, lens flare, and multi-band chromatic dispersion.',
            'In-browser live GLSL shader compiler with instant hot-reload and error syntax highlight.',
        ],
        liveUrl: 'https://github.com/4rayaditya',
        githubUrl: 'https://github.com/4rayaditya',
        featured: true,
        year: '2023',
    },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
    {
        title: 'Frontend & 3D WebGL',
        color: '#00f5d4',
        skills: [
            { name: 'React / Next.js 14', level: 96, icon: '⚛️', highlight: 'App Router & SSR' },
            { name: 'Three.js / WebGL', level: 94, icon: '🪐', highlight: 'Custom Shaders & PBR' },
            { name: 'React Three Fiber', level: 93, icon: '🔮', highlight: 'Declarative 3D' },
            { name: 'TypeScript', level: 95, icon: '📘', highlight: 'Strict Type Safety' },
            { name: 'GSAP & Framer Motion', level: 92, icon: '✨', highlight: 'Timeline Choreography' },
            { name: 'Tailwind CSS', level: 95, icon: '🎨', highlight: 'Design Systems' },
        ],
    },
    {
        title: 'Backend & Distributed Systems',
        color: '#9d4edd',
        skills: [
            { name: 'Node.js / Express', level: 90, icon: '🟢', highlight: 'High Throughput' },
            { name: 'PostgreSQL & Prisma', level: 88, icon: '🐘', highlight: 'Complex Queries' },
            { name: 'Redis / In-Memory', level: 86, icon: '⚡', highlight: 'Pub/Sub & Caching' },
            { name: 'Docker / Kubernetes', level: 82, icon: '🐳', highlight: 'Containerization' },
            { name: 'AWS & Cloudflare Edge', level: 84, icon: '☁️', highlight: 'Serverless Infra' },
            { name: 'WebSockets & WebRTC', level: 89, icon: '📡', highlight: 'Real-time Streaming' },
        ],
    },
    {
        title: 'Architecture & Creative Tools',
        color: '#ff007f',
        skills: [
            { name: 'GLSL Shaders', level: 88, icon: '🌈', highlight: 'Raymarching & Noise' },
            { name: 'Blender 3D Modeling', level: 80, icon: '🍩', highlight: 'Retopology & UVs' },
            { name: 'System Design', level: 90, icon: '📐', highlight: 'Microservices & Event Bus' },
            { name: 'WebXR / Spatial UI', level: 82, icon: '🥽', highlight: 'AR & VR Interaction' },
            { name: 'Web Audio API', level: 87, icon: '🎵', highlight: 'Sound Synthesis' },
            { name: 'Performance Optimization', level: 96, icon: '🚀', highlight: 'Lighthouse 99+' },
        ],
    },
];

export const EXPERIENCES: ExperienceItem[] = [
    {
        id: 'exp-1',
        role: 'Senior Full-Stack & Creative Technologist',
        company: 'Starlight Tech & Labs',
        period: '2023 - PRESENT',
        location: 'Remote',
        description: 'Leading frontend architecture and 3D WebGL interactive initiatives for flagship enterprise and consumer products.',
        achievements: [
            'Architected and deployed interactive 3D WebGL showcase delivering 60 FPS performance across 250,000+ monthly active users.',
            'Spearheaded transition to Next.js 14 App Router and custom GPU asset pipeline, cutting bundle size by 42%.',
            'Mentored 6 software engineers in WebGL shader debugging, React Three Fiber patterns, and TypeScript design systems.',
        ],
        technologies: ['Next.js 14', 'Three.js', 'React Three Fiber', 'GLSL', 'TypeScript', 'Node.js', 'Tailwind CSS'],
    },
    {
        id: 'exp-2',
        role: 'Frontend & 3D Interactive Engineer',
        company: 'Nexus Interactive',
        period: '2021 - 2023',
        location: 'Hybrid',
        description: 'Built high-impact WebXR showrooms, product configurators, and low-latency interactive canvas applications.',
        achievements: [
            'Engineered real-time 3D product customization engine with PBR materials, dynamic lighting, and instant mobile AR preview.',
            'Implemented state management with Zustand and GSAP timeline choreography, decreasing interaction jank to 0%.',
            'Raised Lighthouse Web Vitals scores to 95+ across all high-traffic client portals.',
        ],
        technologies: ['React', 'Three.js', 'GSAP', 'TypeScript', 'WebXR', 'Zustand', 'Tailwind CSS'],
    },
    {
        id: 'exp-3',
        role: 'Software Engineer (Web & Systems)',
        company: 'Quantum Innovations',
        period: '2019 - 2021',
        location: 'Austin, TX / Remote',
        description: 'Developed cloud-native full-stack web platforms, telemetry streaming APIs, and reusable component libraries.',
        achievements: [
            'Built telemetry monitoring dashboard streaming data from 10,000+ IoT sensors with sub-50ms render response.',
            'Authored universal UI design system library adopted across 5 distributed engineering squads.',
            'Optimized PostgreSQL query index layouts and Redis caching strategies to decrease API response times by 55%.',
        ],
        technologies: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'AWS'],
    },
];

export const EDUCATION_CERTS: EducationItem[] = [
    {
        degree: 'B.Tech in Computer Science & Engineering',
        institution: 'Institute of Technology & Science',
        year: '2016 - 2020',
        badge: 'First Class Distinction',
        description: 'Specialization in Computer Graphics, Distributed Operating Systems, and Advanced Data Structures.',
    },
    {
        degree: 'Three.js Journey Master Certification',
        institution: 'Bruno Simon Creative WebGL',
        year: '2022',
        badge: 'Advanced Mastery',
        description: 'Mastery in custom GLSL shaders, GPGPU particles, physics pipelines, and mobile performance tuning.',
    },
    {
        degree: 'AWS Certified Solutions Architect',
        institution: 'Amazon Web Services',
        year: '2023',
        badge: 'Professional',
        description: 'Designing fault-tolerant, highly scalable cloud architectures and edge CDN caching systems.',
    },
];

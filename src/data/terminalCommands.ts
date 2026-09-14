export interface CommandOutput {
    type: 'text' | 'success' | 'warning' | 'error' | 'link' | 'matrix';
    content: string;
    action?: string;
}

export const TERMINAL_BANNER = [
    '   ___   ___  _________________  ___ ',
    '  / _ | / _ \\/  _/_  __/  _/ _ \\/ _ |',
    ' / __ |/ // // /  / / _/ // // / __ |',
    '/_/ |_/____/___/ /_/ /___/____/_/ |_|',
    'Creative Technologist CLI v2.6.0 [Ready]',
    'Type "help" to explore available commands.',
];

export const EXECUTE_COMMAND = (rawCmd: string): CommandOutput[] => {
    const cmd = rawCmd.trim().toLowerCase();

    switch (cmd) {
        case 'help':
            return [
                { type: 'text', content: 'SYSTEM COMMANDS:' },
                { type: 'success', content: '  about        - View identity and creative engineering philosophy' },
                { type: 'success', content: '  skills       - Display core technical capabilities' },
                { type: 'success', content: '  projects     - List flagship 3D & full-stack architectures' },
                { type: 'success', content: '  experience   - Display career journey & achievements' },
                { type: 'success', content: '  contact      - Reach out directly to Aditya Ray' },
                { type: 'success', content: '  matrix       - Initiate Matrix cyber rain mode' },
                { type: 'success', content: '  clear        - Flush terminal buffer' },
                { type: 'warning', content: '  sudo         - Elevate privileges' },
                { type: 'warning', content: '  coffee       - Replenish developer energy' },
            ];

        case 'about':
        case 'bio':
            return [
                { type: 'text', content: 'NAME: Aditya Ray (@4rayaditya)' },
                { type: 'text', content: 'ROLE: Creative Technologist & Senior Full-Stack 3D Engineer' },
                { type: 'text', content: 'MISSION: Bridging computer science rigor with awe-inspiring WebGL visuals.' },
                { type: 'success', content: 'STATUS: Available for Select Contracts & High-Impact Roles' },
                { type: 'text', content: 'LOCATION: Global / Remote (Active across all timezones)' },
            ];

        case 'skills':
            return [
                { type: 'text', content: '--- 3D & CREATIVE WEBGL ---' },
                { type: 'success', content: '  Three.js, React Three Fiber, WebGL 2.0, GLSL Shaders, WebXR, GSAP' },
                { type: 'text', content: '--- FRONTEND & PLATFORMS ---' },
                { type: 'success', content: '  Next.js 14, React 18, TypeScript, Tailwind CSS, Web Audio API, PWA' },
                { type: 'text', content: '--- BACKEND & DISTRIBUTED ---' },
                { type: 'success', content: '  Node.js, PostgreSQL, Redis, Docker, WebSockets, WebRTC, AWS' },
            ];

        case 'projects':
            return [
                { type: 'text', content: 'FLAGSHIP WORKS:' },
                { type: 'success', content: '1. NexusAI Global Telemetry  -> [3D Globe | 4.1M Points | WebSockets]' },
                { type: 'success', content: '2. AeroSphere 3D Studio      -> [WebXR PBR Drone Configurator | 60 FPS]' },
                { type: 'success', content: '3. HyperVerse Spatial Stage   -> [Multiplayer Arena | 15K Concurrents]' },
                { type: 'success', content: '4. VortexGL Particle Engine   -> [1,000,000 GPU Particles | WebGL 2.0]' },
                { type: 'text', content: 'Click any card in the Projects section to explore interactive models.' },
            ];

        case 'experience':
            return [
                { type: 'success', content: '[2023 - PRESENT] Starlight Tech & Labs - Senior Creative Technologist' },
                { type: 'text', content: '  > Led 3D WebGL experience serving 250k+ monthly active users.' },
                { type: 'success', content: '[2021 - 2023] Nexus Interactive - Frontend & 3D Interactive Engineer' },
                { type: 'text', content: '  > Engineered real-time PBR product customizer & AR preview.' },
                { type: 'success', content: '[2019 - 2021] Quantum Innovations - Software Engineer (Web & Systems)' },
                { type: 'text', content: '  > Cloud-native distributed systems, Redis caching, IoT telemetry.' },
            ];

        case 'contact':
            return [
                { type: 'text', content: 'TRANSMISSION COORDINATES:' },
                { type: 'success', content: '  Email:    aditya.ray.dev@gmail.com' },
                { type: 'link', content: '  GitHub:   https://github.com/4rayaditya' },
                { type: 'link', content: '  LinkedIn: https://linkedin.com/in/4rayaditya' },
                { type: 'link', content: '  Twitter:  https://twitter.com/4rayaditya' },
            ];

        case 'matrix':
            return [
                { type: 'matrix', content: 'Initiating Matrix neural stream overlay...' },
            ];

        case 'sudo':
            return [
                { type: 'error', content: 'Permission denied: User "visitor" is not in the sudoers file. This incident will be reported to Santa Claus.' },
            ];

        case 'coffee':
            return [
                { type: 'success', content: '☕ Pouring fresh dark roast espresso... Dev speed multiplied by 2.5x.' },
            ];

        case 'hire':
            return [
                { type: 'success', content: 'Great choice! Scroll down to the contact section or send an email to aditya.ray.dev@gmail.com' },
            ];

        case '':
            return [];

        default:
            return [
                { type: 'error', content: `Command not found: "${rawCmd}". Type "help" for a list of commands.` },
            ];
    }
};

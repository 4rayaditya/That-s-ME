import * as THREE from 'three';

// Procedural dynamic canvas textures for the 3 monitors
export class MonitorTextures {
    public centerCanvas: HTMLCanvasElement;
    public centerCtx: CanvasRenderingContext2D;
    public centerTexture: THREE.CanvasTexture;

    public leftCanvas: HTMLCanvasElement;
    public leftCtx: CanvasRenderingContext2D;
    public leftTexture: THREE.CanvasTexture;

    public rightCanvas: HTMLCanvasElement;
    public rightCtx: CanvasRenderingContext2D;
    public rightTexture: THREE.CanvasTexture;

    private codeLines: string[] = [
        'import { NeuralMatrix } from "@core/quantum";',
        'const agent = new AutonomousAgent({ id: "AR-99" });',
        'async function syncNeuralState(stream: TensorStream) {',
        '    const weights = await stream.fetchTensors();',
        '    const optimized = NeuralMatrix.optimize(weights);',
        '    return optimized.compileShader({',
        '        precision: "highp",',
        '        bloom: 0.85,',
        '        chromaticAberration: 0.04,',
        '    });',
        '}',
        '// Executing hyper-speed WebGL 3D pipeline...',
        'const renderPass = new PostProcessingPass(scene);',
        'renderPass.setLofiMode(true);',
        'system.telemetry.record("60_FPS_LOCKED");',
        'export default RayEngine.initialize({ target: "MONITOR_01" });',
        '// Aditya Ray - Creative Technologist & 3D Engineer',
        'console.log("[SYSTEM] Neural Link established successfully.");',
        'while (alive) {',
        '    await drinkCoffee({ espresso: 2 });',
        '    await writeInfiniteCode();',
        '    await restAndRecharge();',
        '}',
    ];

    private lineOffset = 0;
    private lastCodeUpdate = 0;

    constructor() {
        const isClient = typeof document !== 'undefined';

        // 1. Center Monitor: Real-time Cyberpunk IDE Code Editor
        this.centerCanvas = isClient ? document.createElement('canvas') : ({} as HTMLCanvasElement);
        this.centerCanvas.width = 1024;
        this.centerCanvas.height = 576;
        this.centerCtx = isClient ? this.centerCanvas.getContext('2d')! : ({} as CanvasRenderingContext2D);
        this.centerTexture = new THREE.CanvasTexture(this.centerCanvas);
        this.centerTexture.minFilter = THREE.LinearFilter;
        this.centerTexture.magFilter = THREE.LinearFilter;

        // 2. Left Monitor: System Telemetry, Radar, Network Pings
        this.leftCanvas = isClient ? document.createElement('canvas') : ({} as HTMLCanvasElement);
        this.leftCanvas.width = 512;
        this.leftCanvas.height = 512;
        this.leftCtx = isClient ? this.leftCanvas.getContext('2d')! : ({} as CanvasRenderingContext2D);
        this.leftTexture = new THREE.CanvasTexture(this.leftCanvas);
        this.leftTexture.minFilter = THREE.LinearFilter;
        this.leftTexture.magFilter = THREE.LinearFilter;

        // 3. Right Monitor: Audio Waveform Spectrum & Live Terminal Logs
        this.rightCanvas = isClient ? document.createElement('canvas') : ({} as HTMLCanvasElement);
        this.rightCanvas.width = 512;
        this.rightCanvas.height = 512;
        this.rightCtx = isClient ? this.rightCanvas.getContext('2d')! : ({} as CanvasRenderingContext2D);
        this.rightTexture = new THREE.CanvasTexture(this.rightCanvas);
        this.rightTexture.minFilter = THREE.LinearFilter;
        this.rightTexture.magFilter = THREE.LinearFilter;

        if (isClient) {
            this.renderAll(0);
        }
    }

    public update(time: number) {
        // Update code scroll every 150ms
        if (time - this.lastCodeUpdate > 0.15) {
            this.lineOffset = (this.lineOffset + 1) % this.codeLines.length;
            this.lastCodeUpdate = time;
        }

        this.renderCenter(time);
        this.renderLeft(time);
        this.renderRight(time);

        this.centerTexture.needsUpdate = true;
        this.leftTexture.needsUpdate = true;
        this.rightTexture.needsUpdate = true;
    }

    private renderAll(time: number) {
        this.renderCenter(time);
        this.renderLeft(time);
        this.renderRight(time);
    }

    private renderCenter(time: number) {
        const ctx = this.centerCtx;
        const w = this.centerCanvas.width;
        const h = this.centerCanvas.height;

        // Dark IDE background with cyan tint
        ctx.fillStyle = '#050a12';
        ctx.fillRect(0, 0, w, h);

        // Header bar
        ctx.fillStyle = '#0c1626';
        ctx.fillRect(0, 0, w, 40);

        // Tab indicator
        ctx.fillStyle = '#00f5d4';
        ctx.fillRect(20, 0, 180, 40);
        ctx.fillStyle = '#03070d';
        ctx.font = 'bold 16px "Courier New", monospace';
        ctx.fillText('neural_engine.ts ●', 35, 26);

        // Secondary Tab
        ctx.fillStyle = '#11223a';
        ctx.fillRect(210, 5, 140, 35);
        ctx.fillStyle = '#88a0c0';
        ctx.font = '14px "Courier New", monospace';
        ctx.fillText('portfolio3d.glsl', 225, 28);

        // Line numbers & Code
        ctx.font = '18px "Courier New", monospace';
        const startY = 80;
        const lineHeight = 28;

        for (let i = 0; i < 16; i++) {
            const index = (this.lineOffset + i) % this.codeLines.length;
            const line = this.codeLines[index];
            const y = startY + i * lineHeight;

            // Line numbers
            ctx.fillStyle = '#264263';
            ctx.fillText(`${(index + 1).toString().padStart(2, '0')}`, 25, y);

            // Code syntax coloring
            if (line.startsWith('import') || line.startsWith('export')) {
                ctx.fillStyle = '#f72585';
            } else if (line.startsWith('const') || line.startsWith('async') || line.startsWith('function') || line.startsWith('return')) {
                ctx.fillStyle = '#7209b7';
            } else if (line.startsWith('//')) {
                ctx.fillStyle = '#4cc9f0';
            } else if (line.includes('console.log') || line.includes('drinkCoffee')) {
                ctx.fillStyle = '#ffb703';
            } else {
                ctx.fillStyle = '#00f5d4';
            }
            ctx.fillText(line, 75, y);
        }

        // Blinking cursor
        if (Math.sin(time * 6) > 0) {
            ctx.fillStyle = '#00f5d4';
            ctx.fillRect(w - 200, startY + 15 * lineHeight - 18, 12, 22);
        }

        // CRT Scanline overlay effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        for (let y = 0; y < h; y += 4) {
            ctx.fillRect(0, y, w, 2);
        }

        // Screen edge vignette glow
        const gradient = ctx.createRadialGradient(w / 2, h / 2, h / 3, w / 2, h / 2, w / 1.5);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(1, 'rgba(0, 245, 212, 0.08)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
    }

    private renderLeft(time: number) {
        const ctx = this.leftCtx;
        const w = this.leftCanvas.width;
        const h = this.leftCanvas.height;

        ctx.fillStyle = '#040810';
        ctx.fillRect(0, 0, w, h);

        // Header
        ctx.fillStyle = '#ff0055';
        ctx.font = 'bold 18px "Courier New", monospace';
        ctx.fillText('⚡ TELEMETRY // CORE DIALS', 20, 35);

        // Radar circle in upper half
        const cx = 256;
        const cy = 160;
        const r = 100;

        ctx.strokeStyle = '#1e3a5f';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.arc(cx, cy, r * 0.66, 0, Math.PI * 2);
        ctx.arc(cx, cy, r * 0.33, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshairs
        ctx.beginPath();
        ctx.moveTo(cx - r, cy);
        ctx.lineTo(cx + r, cy);
        ctx.moveTo(cx, cy - r);
        ctx.lineTo(cx, cy + r);
        ctx.stroke();

        // Sweeping radar beam
        const sweep = time * 2;
        ctx.fillStyle = 'rgba(0, 245, 212, 0.15)';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, sweep, sweep + 0.5);
        ctx.closePath();
        ctx.fill();

        // Blinking targets
        ctx.fillStyle = '#00f5d4';
        const blipX = cx + Math.cos(time * 0.5) * 50;
        const blipY = cy + Math.sin(time * 0.5) * 50;
        ctx.beginPath();
        ctx.arc(blipX, blipY, 4, 0, Math.PI * 2);
        ctx.fill();

        // CPU & Memory meters lower half
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px "Courier New", monospace';
        ctx.fillText('CPU LOAD: 34.2%  [OPTIMAL]', 25, 300);

        // CPU Bar
        ctx.fillStyle = '#112233';
        ctx.fillRect(25, 310, w - 50, 16);
        ctx.fillStyle = '#00f5d4';
        const cpuWidth = (w - 50) * (0.35 + Math.sin(time * 3) * 0.1);
        ctx.fillRect(25, 310, cpuWidth, 16);

        // GPU VRAM meter
        ctx.fillStyle = '#ffffff';
        ctx.fillText('GPU VRAM: 14.8 GB / 24 GB', 25, 355);
        ctx.fillStyle = '#112233';
        ctx.fillRect(25, 365, w - 50, 16);
        ctx.fillStyle = '#f72585';
        ctx.fillRect(25, 365, (w - 50) * 0.62, 16);

        // Network Pings graph
        ctx.fillStyle = '#00f5d4';
        ctx.fillText('NEURAL LATENCY: 3.8ms', 25, 410);
        ctx.strokeStyle = '#00f5d4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 25; x < w - 25; x += 8) {
            const y = 460 + Math.sin(x * 0.05 + time * 4) * 15 + Math.sin(x * 0.1 - time * 2) * 8;
            if (x === 25) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    private renderRight(time: number) {
        const ctx = this.rightCtx;
        const w = this.rightCanvas.width;
        const h = this.rightCanvas.height;

        ctx.fillStyle = '#060a12';
        ctx.fillRect(0, 0, w, h);

        // Header
        ctx.fillStyle = '#00f5d4';
        ctx.font = 'bold 18px "Courier New", monospace';
        ctx.fillText('🎵 CYBER LOFI SPECTRUM', 20, 35);

        // Audio Frequency Equalizer Bars
        const numBars = 24;
        const barWidth = (w - 60) / numBars;

        for (let i = 0; i < numBars; i++) {
            const freq = Math.sin(time * 5 + i * 0.4) * 0.5 + 0.5;
            const barHeight = Math.max(8, freq * 180 * (1 - Math.abs(i - 12) / 16));
            const x = 30 + i * barWidth;
            const y = 240 - barHeight;

            const grad = ctx.createLinearGradient(0, y, 0, 240);
            grad.addColorStop(0, '#f72585');
            grad.addColorStop(0.6, '#7209b7');
            grad.addColorStop(1, '#00f5d4');

            ctx.fillStyle = grad;
            ctx.fillRect(x, y, barWidth - 3, barHeight);
        }

        // Baseline divider
        ctx.fillStyle = '#00f5d4';
        ctx.fillRect(25, 245, w - 50, 2);

        // Live Terminal Logs in lower section
        ctx.fillStyle = '#4cc9f0';
        ctx.font = '13px "Courier New", monospace';
        ctx.fillText('LIVE STREAM FEED:', 25, 280);

        const logs = [
            `[${Math.floor(time)}s] GET /api/v2/portfolio/projects 200 OK`,
            `[${Math.floor(time)}s] Shaders compiled: 42 modules`,
            `[${Math.floor(time)}s] Rain simulation active: 600 drops/s`,
            `[${Math.floor(time)}s] Lofi Synth chord sequence: C#m7 -> F#9`,
            `[${Math.floor(time)}s] Aditya status: IN_THE_ZONE`,
        ];

        logs.forEach((log, i) => {
            ctx.fillStyle = i === logs.length - 1 ? '#00f5d4' : '#627d98';
            ctx.fillText(log, 25, 310 + i * 26);
        });
    }

    public destroy() {
        this.centerTexture.dispose();
        this.leftTexture.dispose();
        this.rightTexture.dispose();
    }
}

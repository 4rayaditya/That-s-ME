import * as THREE from 'three';

interface Obstacle {
    x: number;
    type: 'cactus_small' | 'cactus_large' | 'cactus_group' | 'bird';
    width: number;
    height: number;
    y: number;
}

interface Cloud {
    x: number;
    y: number;
    speed: number;
}

// Procedural dynamic canvas texture running the Chrome Offline Dragon/Dino Jump Game
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

    private lastRenderTime = 0;

    // Chrome Dragon Runner Game State
    private score = 0;
    private highScore = 1840;
    private gameSpeed = 7.5;
    private groundY = 440;
    private dragonX = 110;
    private dragonY = 392; // groundY - dragonHeight (48)
    private dragonVy = 0;
    private isJumping = false;
    private legFrame = 0;
    private lastLegToggle = 0;
    private birdFrame = 0;
    private lastBirdToggle = 0;
    private groundOffset = 0;

    private obstacles: Obstacle[] = [];
    private clouds: Cloud[] = [];
    private groundPebbles: { x: number; length: number; y: number }[] = [];

    constructor() {
        const isClient = typeof document !== 'undefined';

        // 1. Center Monitor: Real-time Chrome Offline Dragon Jump Game
        this.centerCanvas = isClient ? document.createElement('canvas') : ({} as HTMLCanvasElement);
        this.centerCanvas.width = 1024;
        this.centerCanvas.height = 576;
        this.centerCtx = isClient ? this.centerCanvas.getContext('2d')! : ({} as CanvasRenderingContext2D);
        this.centerTexture = new THREE.CanvasTexture(this.centerCanvas);
        this.centerTexture.minFilter = THREE.LinearFilter;
        this.centerTexture.magFilter = THREE.LinearFilter;

        // 2. Left Monitor: Vertical Developer IDE & Telemetry Screen
        this.leftCanvas = isClient ? document.createElement('canvas') : ({} as HTMLCanvasElement);
        this.leftCanvas.width = 512;
        this.leftCanvas.height = 1024;
        this.leftCtx = isClient ? this.leftCanvas.getContext('2d')! : ({} as CanvasRenderingContext2D);
        this.leftTexture = new THREE.CanvasTexture(this.leftCanvas);
        this.leftTexture.minFilter = THREE.LinearFilter;
        this.leftTexture.magFilter = THREE.LinearFilter;

        this.rightCanvas = isClient ? document.createElement('canvas') : ({} as HTMLCanvasElement);
        this.rightCanvas.width = 16;
        this.rightCanvas.height = 16;
        this.rightCtx = isClient ? this.rightCanvas.getContext('2d')! : ({} as CanvasRenderingContext2D);
        this.rightTexture = new THREE.CanvasTexture(this.rightCanvas);

        // Initialize clouds
        this.clouds = [
            { x: 200, y: 140, speed: 0.8 },
            { x: 500, y: 180, speed: 0.6 },
            { x: 800, y: 120, speed: 0.9 },
            { x: 1100, y: 160, speed: 0.7 },
        ];

        // Initialize obstacles
        this.obstacles = [
            { x: 600, type: 'cactus_small', width: 22, height: 44, y: 396 },
            { x: 1050, type: 'cactus_group', width: 55, height: 48, y: 392 },
            { x: 1550, type: 'bird', width: 44, height: 32, y: 360 },
            { x: 2050, type: 'cactus_large', width: 34, height: 52, y: 388 },
        ];

        // Initialize ground pebbles
        for (let i = 0; i < 40; i++) {
            this.groundPebbles.push({
                x: i * 28 + Math.random() * 15,
                length: Math.random() * 8 + 2,
                y: this.groundY + Math.random() * 8 + 4,
            });
        }

        if (isClient) {
            this.renderCenter(0);
            this.renderLeft(0);
        }
    }

    public update(time: number) {
        // Run physics and canvas redraw throttled to ~25-30 FPS for optimal performance
        if (time - this.lastRenderTime < 0.038) {
            return;
        }
        const delta = Math.min(0.05, time - this.lastRenderTime || 0.038);
        this.lastRenderTime = time;

        this.updateGamePhysics(delta, time);
        this.renderCenter(time);
        this.centerTexture.needsUpdate = true;

        this.renderLeft(time);
        this.leftTexture.needsUpdate = true;
    }

    private updateGamePhysics(delta: number, time: number) {
        const speed = this.gameSpeed;

        // Score progression
        this.score += speed * delta * 2.2;
        if (this.score > this.highScore) {
            this.highScore = Math.floor(this.score);
        }

        // Ground scroll
        this.groundOffset = (this.groundOffset + speed) % 28;

        // Clouds scroll
        for (const cloud of this.clouds) {
            cloud.x -= cloud.speed;
            if (cloud.x < -80) {
                cloud.x = 1024 + Math.random() * 100;
                cloud.y = 100 + Math.random() * 100;
            }
        }

        // Obstacles scroll & recycling
        for (let i = 0; i < this.obstacles.length; i++) {
            const obs = this.obstacles[i];
            obs.x -= speed;

            // Recycle off-screen obstacles
            if (obs.x < -100) {
                // Find farthest obstacle to position behind it
                const maxObstacleX = Math.max(...this.obstacles.map((o) => o.x));
                obs.x = maxObstacleX + 380 + Math.random() * 260;

                // Randomize obstacle type
                const rand = Math.random();
                if (rand < 0.35) {
                    obs.type = 'cactus_small';
                    obs.width = 22;
                    obs.height = 44;
                    obs.y = this.groundY - obs.height;
                } else if (rand < 0.65) {
                    obs.type = 'cactus_group';
                    obs.width = 54;
                    obs.height = 48;
                    obs.y = this.groundY - obs.height;
                } else if (rand < 0.85) {
                    obs.type = 'cactus_large';
                    obs.width = 34;
                    obs.height = 54;
                    obs.y = this.groundY - obs.height;
                } else {
                    obs.type = 'bird';
                    obs.width = 44;
                    obs.height = 32;
                    obs.y = this.groundY - 72; // flying altitude
                }
            }
        }

        // Autonomous Dragon Jump Logic (Auto-pilot clears all obstacles)
        const nearestObstacle = this.obstacles
            .filter((o) => o.x > this.dragonX - 10)
            .sort((a, b) => a.x - b.x)[0];

        if (nearestObstacle) {
            const dist = nearestObstacle.x - this.dragonX;
            // Jump trigger threshold based on obstacle speed
            if (dist > 30 && dist < 140 && !this.isJumping) {
                this.isJumping = true;
                this.dragonVy = -15.8; // jump impulse
            }
        }

        // Dragon Jump Physics
        if (this.isJumping) {
            this.dragonY += this.dragonVy;
            this.dragonVy += 0.88; // gravity

            const baseFloor = this.groundY - 48;
            if (this.dragonY >= baseFloor) {
                this.dragonY = baseFloor;
                this.dragonVy = 0;
                this.isJumping = false;
            }
        }

        // Running legs animation toggle
        if (time - this.lastLegToggle > 0.08) {
            this.legFrame = (this.legFrame + 1) % 2;
            this.lastLegToggle = time;
        }

        // Bird wings animation toggle
        if (time - this.lastBirdToggle > 0.14) {
            this.birdFrame = (this.birdFrame + 1) % 2;
            this.lastBirdToggle = time;
        }
    }

    private renderCenter(time: number) {
        const ctx = this.centerCtx;
        const w = this.centerCanvas.width;
        const h = this.centerCanvas.height;

        // 1. CHROME BROWSER DARK CANVAS BACKGROUND
        ctx.fillStyle = '#1c1e22';
        ctx.fillRect(0, 0, w, h);

        // 2. TOP CHROME BROWSER TITLE BAR
        ctx.fillStyle = '#121417';
        ctx.fillRect(0, 0, w, 44);

        // Chrome Tab
        ctx.fillStyle = '#282a30';
        ctx.beginPath();
        ctx.roundRect(16, 8, 220, 36, [8, 8, 0, 0]);
        ctx.fill();

        // Mini Dragon Tab Icon
        ctx.fillStyle = '#00f5d4';
        ctx.fillRect(28, 18, 12, 12);

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '500 13px system-ui, -apple-system, sans-serif';
        ctx.fillText('chrome://dino — Offline', 48, 30);

        // Chrome URL Pill Bar
        ctx.fillStyle = '#1e2025';
        ctx.beginPath();
        ctx.roundRect(250, 8, 380, 28, 14);
        ctx.fill();
        ctx.fillStyle = '#71767f';
        ctx.font = '12px system-ui, sans-serif';
        ctx.fillText('🔒  chrome://dino', 270, 26);

        // 3. GAME HUD & HEADLINE
        ctx.fillStyle = '#8e929b';
        ctx.font = '700 15px "Courier New", Courier, monospace';
        ctx.fillText('NO INTERNET', 80, 95);

        ctx.font = '12px "Courier New", Courier, monospace';
        ctx.fillStyle = '#646872';
        ctx.fillText('Try checking the network cables, modem, and router.', 80, 115);

        // Retro 5-Digit Score Display (HI 01840  00452)
        const currentScoreStr = Math.floor(this.score).toString().padStart(5, '0');
        const highScoreStr = this.highScore.toString().padStart(5, '0');

        // Score milestone flash every 100 points
        const isMilestone = Math.floor(this.score) % 100 < 25 && this.score > 90;
        ctx.font = 'bold 20px "Courier New", Courier, monospace';
        ctx.fillStyle = '#5c6069';
        ctx.fillText(`HI ${highScoreStr}`, w - 240, 100);

        ctx.fillStyle = isMilestone ? '#00f5d4' : '#d1d5db';
        ctx.fillText(currentScoreStr, w - 105, 100);

        // 4. CLOUDS IN THE SKY
        for (const cloud of this.clouds) {
            this.drawPixelCloud(ctx, cloud.x, cloud.y);
        }

        // 5. HORIZON GROUND LINE WITH TEXTURED SCROLLING PEBBLES
        ctx.fillStyle = '#53565e';
        ctx.fillRect(0, this.groundY, w, 2);

        // Moving ground gravel / terrain dashes
        ctx.fillStyle = '#454850';
        for (let x = -28; x < w + 28; x += 32) {
            const px = x - this.groundOffset;
            ctx.fillRect(px, this.groundY + 5, 8, 2);
            ctx.fillRect(px + 14, this.groundY + 11, 4, 1.5);
            ctx.fillRect(px + 22, this.groundY + 7, 3, 1.5);
        }

        // 6. DRAW OBSTACLES (CACTI & FLYING DRAGONS/BIRDS)
        for (const obs of this.obstacles) {
            if (obs.type === 'bird') {
                this.drawPixelBird(ctx, obs.x, obs.y, this.birdFrame);
            } else {
                this.drawPixelCactus(ctx, obs.x, obs.y, obs.type);
            }
        }

        // 7. DRAW THE CHROME DRAGON / DINOSAUR
        this.drawPixelDragon(ctx, this.dragonX, this.dragonY, this.isJumping, this.legFrame);

        // Subtle CRT scanline overlay effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
        for (let y = 44; y < h; y += 6) {
            ctx.fillRect(0, y, w, 2);
        }

        // Subtle glowing cyan frame border
        ctx.strokeStyle = 'rgba(0, 245, 212, 0.18)';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, w - 2, h - 2);
    }

    // Draw retro pixel art Dragon / T-Rex
    private drawPixelDragon(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        jumping: boolean,
        leg: number
    ) {
        ctx.save();
        ctx.fillStyle = '#ffffff';

        // Dragon Head & Snout
        ctx.fillRect(x + 22, y, 22, 14);
        ctx.fillRect(x + 18, y + 6, 26, 12);

        // Dragon Horns
        ctx.fillStyle = '#00f5d4';
        ctx.fillRect(x + 18, y - 4, 4, 5);
        ctx.fillRect(x + 24, y - 6, 4, 7);

        // Dragon Eye
        ctx.fillStyle = '#1c1e22';
        ctx.fillRect(x + 26, y + 4, 3, 3);

        // Open Mouth / Jaws
        ctx.fillStyle = '#1c1e22';
        ctx.fillRect(x + 36, y + 12, 10, 3);

        // Dragon Neck & Torso
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 16, y + 16, 16, 20);
        ctx.fillRect(x + 10, y + 22, 22, 14);

        // Dragon Wings / Back Spikes (Cyan Neon Accents)
        ctx.fillStyle = '#00f5d4';
        ctx.fillRect(x + 8, y + 16, 4, 5);
        ctx.fillRect(x + 12, y + 14, 4, 6);
        ctx.fillRect(x + 4, y + 20, 4, 4);

        // Little Dragon Arms
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 28, y + 24, 6, 3);
        ctx.fillRect(x + 32, y + 26, 2, 4);

        // Long Dragon Tail
        ctx.fillRect(x + 2, y + 22, 8, 8);
        ctx.fillRect(x - 4, y + 20, 6, 6);
        ctx.fillRect(x - 8, y + 16, 5, 5);
        ctx.fillRect(x - 12, y + 14, 4, 3);

        // Dragon Legs & Running Animation
        if (jumping) {
            // Tucked legs during jump
            ctx.fillRect(x + 12, y + 36, 4, 6);
            ctx.fillRect(x + 20, y + 36, 4, 6);
            ctx.fillRect(x + 10, y + 42, 6, 2);
            ctx.fillRect(x + 18, y + 42, 6, 2);
        } else if (leg === 0) {
            // Leg Frame 0
            ctx.fillRect(x + 12, y + 36, 4, 12);
            ctx.fillRect(x + 12, y + 46, 6, 2);
            ctx.fillRect(x + 22, y + 36, 4, 6);
        } else {
            // Leg Frame 1
            ctx.fillRect(x + 12, y + 36, 4, 6);
            ctx.fillRect(x + 22, y + 36, 4, 12);
            ctx.fillRect(x + 22, y + 46, 6, 2);
        }

        ctx.restore();
    }

    // Draw pixel art Cactus obstacles
    private drawPixelCactus(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        type: 'cactus_small' | 'cactus_large' | 'cactus_group'
    ) {
        ctx.save();
        ctx.fillStyle = '#a3a9b4';

        if (type === 'cactus_small') {
            // Single Small Cactus
            ctx.fillRect(x + 7, y, 8, 44);
            // Left arm
            ctx.fillRect(x, y + 12, 7, 6);
            ctx.fillRect(x, y + 6, 5, 8);
            // Right arm
            ctx.fillRect(x + 15, y + 16, 7, 6);
            ctx.fillRect(x + 17, y + 10, 5, 8);
        } else if (type === 'cactus_large') {
            // Single Large Cactus
            ctx.fillRect(x + 11, y, 12, 54);
            // Left arm
            ctx.fillRect(x, y + 14, 11, 7);
            ctx.fillRect(x, y + 8, 6, 12);
            // Right arm
            ctx.fillRect(x + 23, y + 20, 11, 7);
            ctx.fillRect(x + 27, y + 12, 7, 14);
        } else {
            // Double / Group Cactus
            ctx.fillRect(x + 6, y + 4, 8, 44);
            ctx.fillRect(x, y + 16, 6, 6);
            ctx.fillRect(x + 14, y + 18, 6, 6);

            ctx.fillRect(x + 26, y, 10, 48);
            ctx.fillRect(x + 18, y + 14, 8, 6);
            ctx.fillRect(x + 36, y + 16, 8, 6);
            ctx.fillRect(x + 40, y + 10, 6, 10);
        }

        ctx.restore();
    }

    // Draw pixel art Pterodactyl / Flying Dragon
    private drawPixelBird(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        wingFrame: number
    ) {
        ctx.save();
        ctx.fillStyle = '#00f5d4'; // Glowing cyber pterodactyl

        // Body & Beak
        ctx.fillRect(x + 10, y + 12, 18, 8);
        ctx.fillRect(x + 28, y + 14, 12, 4); // Beak
        ctx.fillRect(x + 4, y + 10, 6, 4); // Tail

        // Eye
        ctx.fillStyle = '#1c1e22';
        ctx.fillRect(x + 24, y + 13, 2, 2);

        ctx.fillStyle = '#00f5d4';
        if (wingFrame === 0) {
            // Wings Up
            ctx.fillRect(x + 14, y, 6, 12);
            ctx.fillRect(x + 12, y - 6, 8, 6);
        } else {
            // Wings Down
            ctx.fillRect(x + 14, y + 20, 6, 12);
            ctx.fillRect(x + 12, y + 32, 8, 6);
        }

        ctx.restore();
    }

    // Draw pixel cloud
    private drawPixelCloud(ctx: CanvasRenderingContext2D, x: number, y: number) {
        ctx.save();
        ctx.fillStyle = '#32363e';
        ctx.fillRect(x + 10, y + 6, 36, 10);
        ctx.fillRect(x + 16, y, 22, 8);
        ctx.fillRect(x, y + 10, 12, 6);
        ctx.fillRect(x + 44, y + 10, 10, 6);
        ctx.restore();
    }

    // Render High-Tech Portrait Developer IDE & Telemetry Screen for Vertical Monitor
    public renderLeft(time: number) {
        const ctx = this.leftCtx;
        if (!ctx || !this.leftCanvas.width) return;

        const w = 512;
        const h = 1024;

        // Background dark editor theme
        ctx.fillStyle = '#0a0d14';
        ctx.fillRect(0, 0, w, h);

        // Top Window Header / Tabs
        ctx.fillStyle = '#0f1422';
        ctx.fillRect(0, 0, w, 56);

        // macOS / Linux Window Dots
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(24, 28, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(44, 28, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(64, 28, 6, 0, Math.PI * 2);
        ctx.fill();

        // Active Editor Tab
        ctx.fillStyle = '#161e31';
        ctx.fillRect(92, 12, 170, 44);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(92, 54, 170, 2);

        ctx.font = 'bold 15px monospace';
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText('matrix_engine.ts', 108, 38);

        // Status indicator in header
        const blink = Math.floor(time * 2) % 2 === 0;
        ctx.fillStyle = blink ? '#22c55e' : '#15803d';
        ctx.beginPath();
        ctx.arc(460, 28, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '12px monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('READY', 420, 32);

        // Gutter / Line Numbers Background
        ctx.fillStyle = '#0d111a';
        ctx.fillRect(0, 56, 52, 544);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(52, 56);
        ctx.lineTo(52, 600);
        ctx.stroke();

        // Code Lines Data
        const codeLines = [
            { num: 1, text: '// Quantum Pipeline Controller v4.2', color: '#64748b' },
            { num: 2, text: 'import { Engine, Vec3 } from "@core/gl";', color: '#7dd3fc' },
            { num: 3, text: 'import { useQuantumShader } from "@/hooks";', color: '#7dd3fc' },
            { num: 4, text: '', color: '#94a3b8' },
            { num: 5, text: 'interface MatrixCluster {', color: '#c084fc' },
            { num: 6, text: '  nodes: number;', color: '#f1f5f9' },
            { num: 7, text: '  bandwidth: "100Gbps" | "400Gbps";', color: '#f59e0b' },
            { num: 8, text: '  active: boolean;', color: '#38bdf8' },
            { num: 9, text: '}', color: '#c084fc' },
            { num: 10, text: '', color: '#94a3b8' },
            { num: 11, text: 'export async function initRenderMesh() {', color: '#c084fc' },
            { num: 12, text: '  const pipeline = new Engine({', color: '#f1f5f9' },
            { num: 13, text: '    shading: "volumetric_raymarching",', color: '#34d399' },
            { num: 14, text: '    subsurfaceScattering: true,', color: '#f59e0b' },
            { num: 15, text: '    hdrExposure: 1.84,', color: '#f43f5e' },
            { num: 16, text: '    shadowPasses: 4,', color: '#f43f5e' },
            { num: 17, text: '  });', color: '#f1f5f9' },
            { num: 18, text: '', color: '#94a3b8' },
            { num: 19, text: '  await pipeline.compileShaders();', color: '#38bdf8' },
            { num: 20, text: '  pipeline.bindPostProcessing();', color: '#38bdf8' },
            { num: 21, text: '  return pipeline.bootCluster();', color: '#34d399' },
            { num: 22, text: '}', color: '#c084fc' },
            { num: 23, text: '', color: '#94a3b8' },
            { num: 24, text: 'const state = await initRenderMesh();', color: '#38bdf8' },
        ];

        // Render Line Numbers & Code
        ctx.font = '14px monospace';
        let lineY = 82;
        for (const line of codeLines) {
            ctx.fillStyle = '#475569';
            ctx.fillText(line.num.toString().padStart(2, ' '), 16, lineY);

            ctx.fillStyle = line.color;
            ctx.fillText(line.text, 68, lineY);

            if (line.num === 24 && blink) {
                const textWidth = ctx.measureText(line.text).width;
                ctx.fillStyle = '#38bdf8';
                ctx.fillRect(68 + textWidth + 3, lineY - 12, 8, 15);
            }

            lineY += 21;
        }

        // Mid-Section Terminal Split Header
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 600, w, 36);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 600);
        ctx.lineTo(w, 600);
        ctx.stroke();

        ctx.font = 'bold 13px monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('TERMINAL & TELEMETRY [NODE_ENV=PROD]', 16, 623);

        ctx.fillStyle = '#10b981';
        ctx.fillText('● SYNCED', 420, 623);

        // Terminal Background
        ctx.fillStyle = '#050810';
        ctx.fillRect(0, 636, w, 388);

        // Telemetry Data Bar
        ctx.fillStyle = '#111827';
        ctx.fillRect(16, 652, 480, 84);
        ctx.strokeStyle = '#1e293b';
        ctx.strokeRect(16, 652, 480, 84);

        ctx.font = '12px monospace';
        ctx.fillStyle = '#60a5fa';
        ctx.fillText('CPU UTILIZATION: 26.4% [16T @ 4.6GHz]', 28, 674);

        ctx.fillStyle = '#a78bfa';
        ctx.fillText('GPU CORE: RTX 4090 [41°C | VRAM 7.8GB]', 28, 696);

        ctx.fillStyle = '#34d399';
        ctx.fillText('SYS LATENCY: 2.8ms  |  PACKETS: 0 DROP', 28, 718);

        // Live Telemetry Mini Waveform
        ctx.fillStyle = '#0f2937';
        ctx.fillRect(16, 750, 480, 70);
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let x = 0; x < 480; x += 6) {
            const wave = Math.sin((x * 0.08) + (time * 4)) * 14 + Math.cos((x * 0.03) - (time * 2)) * 8;
            const py = 785 + wave;
            if (x === 0) ctx.moveTo(16 + x, py);
            else ctx.lineTo(16 + x, py);
        }
        ctx.stroke();

        ctx.font = '10px monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('CORE FREQUENCY OSCILLOSCOPE', 24, 764);

        // Build logs in console
        const logs = [
            { text: '$ pnpm run build:mesh --target=gpu', color: '#f8fafc' },
            { text: '✓ Compiled shaders [vertex.glsl, frag.glsl] in 42ms', color: '#22c55e' },
            { text: '✓ Dynamic cubemap baked [512x512 HDR]', color: '#22c55e' },
            { text: 'ℹ Optimized 18,400 vertices -> 0 draw calls batched', color: '#38bdf8' },
            { text: '⚡ Local host running at http://localhost:3000', color: '#f59e0b' },
            { text: `> Live loop tick: ${Math.floor(time * 60)} frames`, color: '#64748b' },
        ];

        let logY = 848;
        ctx.font = '12px monospace';
        for (const log of logs) {
            ctx.fillStyle = log.color;
            ctx.fillText(log.text, 24, logY);
            logY += 22;
        }

        // Bottom IDE Status Bar
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(0, 996, w, 28);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(' TypeScript 5.4.5   Ln 24, Col 38   Spaces: 2   UTF-8   rayaditya ', 12, 1014);
    }

    public destroy() {
        this.centerTexture.dispose();
        this.leftTexture.dispose();
        this.rightTexture.dispose();
    }
}

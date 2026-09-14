// Indian Standard Time (IST = UTC+5:30) & Dynamic Environment Engine

export type EnvironmentPhase = 'morning' | 'afternoon' | 'evening' | 'night';

export interface ISTTimeData {
    hour: number;
    minute: number;
    second: number;
    formattedTime: string;
    phase: EnvironmentPhase;
    phaseLabel: string;
}

export interface EnvironmentConfig {
    phase: EnvironmentPhase;
    label: string;
    description: string;
    accentColor: string;
    ambientColor: string;
    ambientIntensity: number;
    sunColor: string;
    sunIntensity: number;
    sunPosition: [number, number, number];
    windowSkyTop: string;
    windowSkyBottom: string;
    showTrees: boolean;
    showRain: boolean;
    showStars: boolean;
    defaultCharacterRoutine: 'coding' | 'brewing_coffee' | 'resting_bed';
}

/**
 * Calculates current Indian Standard Time (IST = UTC + 5 hours 30 mins)
 */
export function getLiveISTTime(): ISTTimeData {
    const now = new Date();
    // UTC milliseconds + 5.5 hours in ms
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
    const istTime = new Date(utcTime + 5.5 * 3600000);

    const hour = istTime.getHours();
    const minute = istTime.getMinutes();
    const second = istTime.getSeconds();

    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    const pad = (n: number) => n.toString().padStart(2, '0');
    const formattedTime = `${pad(displayHour)}:${pad(minute)} ${ampm}`;

    let phase: EnvironmentPhase = 'night';
    let phaseLabel = 'Night 🌙';

    if (hour >= 6 && hour < 12) {
        phase = 'morning';
        phaseLabel = 'Morning 🌿';
    } else if (hour >= 12 && hour < 17) {
        phase = 'afternoon';
        phaseLabel = 'Afternoon ☀️';
    } else if (hour >= 17 && hour < 21) {
        phase = 'evening';
        phaseLabel = 'Evening 🌆';
    } else {
        phase = 'night';
        phaseLabel = 'Night 🌙';
    }

    return {
        hour,
        minute,
        second,
        formattedTime,
        phase,
        phaseLabel,
    };
}

/**
 * Visual styling and scene parameters for each environment phase
 */
export const ENVIRONMENT_CONFIGS: Record<EnvironmentPhase, EnvironmentConfig> = {
    morning: {
        phase: 'morning',
        label: 'Cool Morning',
        description: 'Fresh cool morning sunlight streaming in with lush green trees swaying outside the window',
        accentColor: '#10b981', // Emerald green
        ambientColor: '#a7f3d0', // Fresh cool green/mint
        ambientIntensity: 0.85,
        sunColor: '#fef08a', // Soft morning sunlight
        sunIntensity: 1.4,
        sunPosition: [3, 6, -3], // Low morning sun angle
        windowSkyTop: '#38bdf8', // Clear sky blue
        windowSkyBottom: '#bbf7d0', // Pale morning mist / tree canopy
        showTrees: true,
        showRain: false,
        showStars: false,
        defaultCharacterRoutine: 'brewing_coffee',
    },
    afternoon: {
        phase: 'afternoon',
        label: 'Bright Daylight',
        description: 'High noon bright clarity and active daytime cyber skyline',
        accentColor: '#00f5d4', // Bright cyan
        ambientColor: '#cffafe', // Crisp sky daylight
        ambientIntensity: 0.9,
        sunColor: '#ffffff',
        sunIntensity: 1.5,
        sunPosition: [4, 9, -2],
        windowSkyTop: '#0284c7',
        windowSkyBottom: '#7dd3fc',
        showTrees: true,
        showRain: false,
        showStars: false,
        defaultCharacterRoutine: 'coding',
    },
    evening: {
        phase: 'evening',
        label: 'Twilight Study',
        description: 'Warm golden hour sunset transition, focused studying and coding at the battlestation',
        accentColor: '#ffb703', // Warm golden amber
        ambientColor: '#4a154b', // Deep dusk violet
        ambientIntensity: 0.65,
        sunColor: '#fb923c', // Sunset orange
        sunIntensity: 1.2,
        sunPosition: [-5, 4, -4],
        windowSkyTop: '#3b0764', // Twilight purple
        windowSkyBottom: '#f97316', // Sunset horizon
        showTrees: true,
        showRain: false,
        showStars: false,
        defaultCharacterRoutine: 'coding',
    },
    night: {
        phase: 'night',
        label: 'Cyberpunk Night',
        description: 'Moody neon cyberpunk battlestation, rain on the glass, sleeping peacefully on the cyber futon',
        accentColor: '#f72585', // Neon magenta
        ambientColor: '#070f20', // Dark midnight navy
        ambientIntensity: 0.45,
        sunColor: '#00f5d4', // Cyan neon rim
        sunIntensity: 0.6,
        sunPosition: [5, 8, 4],
        windowSkyTop: '#02040a',
        windowSkyBottom: '#050a18',
        showTrees: false,
        showRain: true,
        showStars: true,
        defaultCharacterRoutine: 'resting_bed',
    },
};

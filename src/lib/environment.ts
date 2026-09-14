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
        label: 'Aesthetic Light Mode',
        description: 'Sun-drenched Scandinavian loft with warm morning sunlight pouring through the window and swaying green trees',
        accentColor: '#10b981', // Botanical emerald
        ambientColor: '#fffbeb', // Warm sunlight ambient
        ambientIntensity: 1.15,
        sunColor: '#fef3c7', // Soft warm golden sun
        sunIntensity: 2.2,
        sunPosition: [3.5, 7.5, -3.2],
        windowSkyTop: '#60a5fa', // Clear sky blue
        windowSkyBottom: '#dcfce7', // Morning garden horizon
        showTrees: true,
        showRain: false,
        showStars: false,
        defaultCharacterRoutine: 'coding',
    },
    afternoon: {
        phase: 'afternoon',
        label: 'Bright Sunlit Loft',
        description: 'Bright natural daylight illuminating the warm wooden desk, acoustic oak slats, and lush plants',
        accentColor: '#059669',
        ambientColor: '#fefce8',
        ambientIntensity: 1.1,
        sunColor: '#fffbeb',
        sunIntensity: 2.0,
        sunPosition: [4, 9, -2],
        windowSkyTop: '#38bdf8',
        windowSkyBottom: '#bae6fd',
        showTrees: true,
        showRain: false,
        showStars: false,
        defaultCharacterRoutine: 'coding',
    },
    evening: {
        phase: 'evening',
        label: 'Aesthetic Golden Hour',
        description: 'Warm golden hour sunset transition with ambient study lamp and rich wooden textures',
        accentColor: '#f59e0b',
        ambientColor: '#451a03',
        ambientIntensity: 0.85,
        sunColor: '#fbbf24',
        sunIntensity: 1.5,
        sunPosition: [-4.5, 4.5, -3.8],
        windowSkyTop: '#4c1d95',
        windowSkyBottom: '#f97316',
        showTrees: true,
        showRain: false,
        showStars: false,
        defaultCharacterRoutine: 'coding',
    },
    night: {
        phase: 'night',
        label: 'Cozy Dark Mode',
        description: 'Intimate night ambiance with warm desk lamp, glowing ember accents, and peaceful night sky',
        accentColor: '#fbbf24', // Warm golden amber
        ambientColor: '#1a1410', // Warm deep espresso
        ambientIntensity: 0.58,
        sunColor: '#f59e0b', // Warm amber glow
        sunIntensity: 0.85,
        sunPosition: [4, 6, 3],
        windowSkyTop: '#090d16',
        windowSkyBottom: '#111827',
        showTrees: true,
        showRain: false,
        showStars: true,
        defaultCharacterRoutine: 'resting_bed',
    },
};

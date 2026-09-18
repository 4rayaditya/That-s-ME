// Environment Configuration & Lighting Engine

export type EnvironmentPhase = 'morning' | 'afternoon' | 'evening' | 'night';
export type RoomMood = 'cyberpunk' | 'stealth';

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
}

export interface RoomMoodConfig {
    id: RoomMood;
    name: string;
    shortName: string;
    description: string;
    icon: string;
    ambientColor: string;
    ambientIntensity: number;
    sunColor: string;
    sunIntensity: number;
    sunPosition: [number, number, number];
    tableUnderglowColor: string;
    biasLightColor: string;
    accentColor: string;
    indicatorColor: string;
}

export const ROOM_MOOD_CONFIGS: Record<RoomMood, RoomMoodConfig> = {
    cyberpunk: {
        id: 'cyberpunk',
        name: 'Cyberpunk Room (Original)',
        shortName: 'Room Lights',
        description: 'Original warm ambient lighting with Battlestation RGB & cozy natural bouclé sofa',
        icon: '',
        ambientColor: '#1a1410',
        ambientIntensity: 0.58,
        sunColor: '#f59e0b',
        sunIntensity: 0.85,
        sunPosition: [4, 6, 3],
        tableUnderglowColor: '#a855f7',
        biasLightColor: '#ff1744',
        accentColor: '#fbbf24',
        indicatorColor: '#f59e0b',
    },
    stealth: {
        id: 'stealth',
        name: 'Dark RGB Blackout',
        shortName: 'Dark RGB',
        description: 'Pitch-dark room blackout — all room lights off except the glowing Battlestation PC RGB',
        icon: '',
        ambientColor: '#010204',
        ambientIntensity: 0.05,
        sunColor: '#000000',
        sunIntensity: 0.0,
        sunPosition: [4, 6, 3],
        tableUnderglowColor: '#00f5d4',
        biasLightColor: '#7928ca',
        accentColor: '#00f5d4',
        indicatorColor: '#a855f7',
    },
};

/**
 * Visual styling and scene parameters for each environment phase
 */
export const ENVIRONMENT_CONFIGS: Record<EnvironmentPhase, EnvironmentConfig> = {
    morning: {
        phase: 'morning',
        label: 'Aesthetic Light Mode',
        description: 'Warm morning sunlight pouring through the room',
        accentColor: '#10b981',
        ambientColor: '#fffbeb',
        ambientIntensity: 1.15,
        sunColor: '#fef3c7',
        sunIntensity: 2.2,
        sunPosition: [3.5, 7.5, -3.2],
    },
    afternoon: {
        phase: 'afternoon',
        label: 'Bright Sunlit Loft',
        description: 'Bright natural daylight illuminating the wooden textures',
        accentColor: '#059669',
        ambientColor: '#fefce8',
        ambientIntensity: 1.1,
        sunColor: '#fffbeb',
        sunIntensity: 2.0,
        sunPosition: [4, 9, -2],
    },
    evening: {
        phase: 'evening',
        label: 'Aesthetic Golden Hour',
        description: 'Warm golden hour sunset transition with ambient glow',
        accentColor: '#f59e0b',
        ambientColor: '#451a03',
        ambientIntensity: 0.85,
        sunColor: '#fbbf24',
        sunIntensity: 1.5,
        sunPosition: [-4.5, 4.5, -3.8],
    },
    night: {
        phase: 'night',
        label: 'Cozy Dark Mode',
        description: 'Intimate night ambiance with warm desk lamp, glowing ember accents, and peaceful lighting',
        accentColor: '#fbbf24', // Warm golden amber
        ambientColor: '#1a1410', // Warm deep espresso
        ambientIntensity: 0.58,
        sunColor: '#f59e0b', // Warm amber glow
        sunIntensity: 0.85,
        sunPosition: [4, 6, 3],
    },
};

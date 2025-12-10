export type AmbienceType = 'calm' | 'daylight' | 'midnight' | 'neon';

export interface AppState {
  tvOn: boolean;
  lightsOn: boolean;
  fanOn: boolean;
  ambience: AmbienceType;
  currentRoom: 'living' | 'bedroom' | 'overview';
}

export interface RoomProps {
  position: [number, number, number];
  name: string;
  floorColor?: string;
}

export const AMBIENCE_SETTINGS: Record<AmbienceType, { 
  bg: string; 
  ambientIntensity: number; 
  bulbColor: string;
  bulbIntensity: number;
  shadowColor: string;
}> = {
  calm: { 
    bg: '#d4bfa8', 
    ambientIntensity: 0.3, 
    bulbColor: '#ffaa00', 
    bulbIntensity: 1.5,
    shadowColor: '#5a4d3b'
  },
  daylight: { 
    bg: '#e0f7fa', 
    ambientIntensity: 0.8, 
    bulbColor: '#ffffff', 
    bulbIntensity: 0.5,
    shadowColor: '#8899a6'
  },
  midnight: { 
    bg: '#0f172a', 
    ambientIntensity: 0.1, 
    bulbColor: '#aaddff', 
    bulbIntensity: 0.8,
    shadowColor: '#000000'
  },
  neon: { 
    bg: '#220022', 
    ambientIntensity: 0.2, 
    bulbColor: '#ff00ff', 
    bulbIntensity: 2,
    shadowColor: '#220033'
  }
};
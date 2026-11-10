import { GameId } from '../types';

export interface GameDefinition {
  id: GameId;
  title: string;
  tagline: string;
  available: boolean;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  accentColor: string;
  durationLabel: string;
}

export const GAME_REGISTRY: GameDefinition[] = [
  {
    id: 'bottle-spin',
    title: 'Bottle Spin',
    tagline: 'The OG decider',
    available: true,
    description: 'Spin the bottle. Whoever it lands on is screwed.',
    minPlayers: 2,
    maxPlayers: 8,
    accentColor: '#C8FF00',
    durationLabel: '< 10s',
  },
  {
    id: 'hot-potato',
    title: 'Hot Potato',
    tagline: 'Don\'t get caught holding it',
    available: true,
    description: 'Pass the phone around. When the timer hits zero, the person holding it pays.',
    minPlayers: 2,
    maxPlayers: 10,
    accentColor: '#FF7700',
    durationLabel: '30–60s',
  },
  {
    id: 'tap-race',
    title: 'Tap Race',
    tagline: 'Fastest finger wins',
    available: true,
    description: 'Each player gets 5 seconds to tap as fast as they can. Fewest taps loses.',
    minPlayers: 2,
    maxPlayers: 8,
    accentColor: '#00E5FF',
    durationLabel: '1–2 min',
  },
  {
    id: 'last-stand',
    title: 'Last Stand',
    tagline: 'Coming soon',
    available: false,
    description: 'Elimination rounds. Last player standing chooses everything.',
    minPlayers: 3,
    maxPlayers: 8,
    accentColor: '#FF1493',
    durationLabel: '2–5 min',
  },
];

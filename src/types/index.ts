export interface Player {
  id: string;
  name: string;
  color: string;
  avatar: string;
  title?: string; // e.g. "The Big Spender", "Free Loader"
  createdAt: number;
}

export type GameId = 'bottle-spin' | 'hot-potato' | 'tap-race' | 'last-stand';

export type DecisionMode = 'loser_pays' | 'winner_takes';

export interface Decision {
  id: string;
  title: string;
  question: string;
  badgeText: string;
  mode: DecisionMode;
  loserLabel: string;
  winnerLabel: string;
}

export interface GameResult {
  id: string;
  gameId: GameId;
  gameTitle: string;
  decision: Decision;
  selectedPlayer: Player;
  allPlayers: Player[];
  timestamp: number;
}

export interface TapRaceRoundResult {
  player: Player;
  taps: number;
  rank: number;
}

export interface PlayerStats {
  playerId: string;
  playerName: string;
  playerAvatar: string;
  playerColor: string;
  timesPaid: number;
  timesWon: number;
  totalGames: number;
  lastSelectedAt?: number;
}

export type ActiveScreen =
  | 'start'
  | 'decisions'
  | 'players'
  | 'game-select'
  | 'bottle-spin'
  | 'hot-potato'
  | 'tap-race'
  | 'history'
  | 'how-to-play';

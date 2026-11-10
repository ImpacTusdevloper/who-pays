import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Player } from '../types';
import { getRandomPlayerColor } from '../constants/colors';
import { getPlayerMonogram, QUICK_NAMES } from '../constants/playerPresets';
import { loadPlayersFromStorage, savePlayersToStorage } from '../utils/storage';
import { triggerHaptic } from '../utils/haptics';

interface PlayerContextType {
  players: Player[];
  addPlayer: (name: string, color?: string) => boolean;
  removePlayer: (id: string) => void;
  updatePlayer: (id: string, updates: Partial<Player>) => void;
  clearPlayers: () => void;
  quickAddPresets: (count?: number) => void;
  shufflePlayers: () => void;
  canStartGame: boolean;
  minRequired: number;
  maxAllowed: number;
  isMaxReached: boolean;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 8;

// Initial default group so app is never in an empty blank state
const DEFAULT_INITIAL_PLAYERS: Player[] = [
  { id: '1', name: 'Rahul', avatar: 'R', color: '#F28BA8', createdAt: 1 },
  { id: '2', name: 'Priya', avatar: 'P', color: '#A9C5E8', createdAt: 2 },
  { id: '3', name: 'Alex', avatar: 'A', color: '#90CDB4', createdAt: 3 },
  { id: '4', name: 'Sam', avatar: 'S', color: '#F3D28A', createdAt: 4 },
];

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>(DEFAULT_INITIAL_PLAYERS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await loadPlayersFromStorage();
      if (stored && stored.length > 0) {
        setPlayers(
          stored.map((player) => {
            return { ...player, avatar: getPlayerMonogram(player.name) };
          })
        );
      }
      setIsLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      savePlayersToStorage(players);
    }
  }, [players, isLoaded]);

  const addPlayer = (name: string, customColor?: string): boolean => {
    const trimmed = name.trim();
    if (!trimmed) return false;
    if (players.length >= MAX_PLAYERS) {
      triggerHaptic('error');
      return false;
    }

    const nextIndex = players.length;
    const newPlayer: Player = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
      name: trimmed,
      avatar: getPlayerMonogram(trimmed),
      color: customColor || getRandomPlayerColor(nextIndex),
      createdAt: Date.now(),
    };

    setPlayers((prev) => [...prev, newPlayer]);
    triggerHaptic('light');
    return true;
  };

  const removePlayer = (id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
    triggerHaptic('light');
  };

  const updatePlayer = (id: string, updates: Partial<Player>) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    triggerHaptic('selection');
  };

  const clearPlayers = () => {
    setPlayers([]);
    triggerHaptic('warning');
  };

  const quickAddPresets = (count = 4) => {
    const targetCount = Math.min(count, MAX_PLAYERS);
    const newGroup: Player[] = [];
    const usedNames = new Set(players.map((p) => p.name.toLowerCase()));

    const availableNames = QUICK_NAMES.filter(
      (n) => !usedNames.has(n.toLowerCase())
    );

    const needed = Math.min(targetCount, MAX_PLAYERS - players.length);
    for (let i = 0; i < needed; i++) {
      const name =
        availableNames[i] || `Player ${players.length + i + 1}`;
      newGroup.push({
        id: Date.now().toString() + '_' + i,
        name,
        avatar: getPlayerMonogram(name),
        color: getRandomPlayerColor(players.length + i),
        createdAt: Date.now() + i,
      });
    }

    if (newGroup.length > 0) {
      setPlayers((prev) => [...prev, ...newGroup]);
      triggerHaptic('success');
    }
  };

  const shufflePlayers = () => {
    setPlayers((prev) => {
      const copy = [...prev];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    });
    triggerHaptic('medium');
  };

  const canStartGame = players.length >= MIN_PLAYERS && players.length <= MAX_PLAYERS;
  const isMaxReached = players.length >= MAX_PLAYERS;

  return (
    <PlayerContext.Provider
      value={{
        players,
        addPlayer,
        removePlayer,
        updatePlayer,
        clearPlayers,
        quickAddPresets,
        shufflePlayers,
        canStartGame,
        minRequired: MIN_PLAYERS,
        maxAllowed: MAX_PLAYERS,
        isMaxReached,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayers = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayers must be used within a PlayerProvider');
  }
  return context;
};

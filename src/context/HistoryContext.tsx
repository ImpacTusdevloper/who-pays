import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { GameResult, PlayerStats } from '../types';
import { loadHistoryFromStorage, saveHistoryToStorage } from '../utils/storage';
import { triggerHaptic } from '../utils/haptics';
import { DEFAULT_DECISIONS } from '../constants/decisions';

interface HistoryContextType {
  history: GameResult[];
  recordResult: (result: Omit<GameResult, 'id' | 'timestamp'>) => Promise<GameResult>;
  clearHistory: () => Promise<void>;
  deleteResult: (id: string) => Promise<void>;
  playerStats: PlayerStats[];
  getPlayerStat: (playerId: string) => PlayerStats | undefined;
  topPayer: PlayerStats | null;
  totalGamesPlayed: number;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<GameResult[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await loadHistoryFromStorage();
      if (stored && stored.length > 0) setHistory(stored);
      setIsLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (isLoaded) saveHistoryToStorage(history);
  }, [history, isLoaded]);

  const recordResult = async (result: Omit<GameResult, 'id' | 'timestamp'>): Promise<GameResult> => {
    const entry: GameResult = {
      ...result,
      id: 'r_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      timestamp: Date.now(),
    };
    setHistory((prev) => [entry, ...prev]);
    return entry;
  };

  const clearHistory = async () => {
    setHistory([]);
    await saveHistoryToStorage([]);
    triggerHaptic('warning');
  };

  const deleteResult = async (id: string) => {
    setHistory((prev) => prev.filter((r) => r.id !== id));
    triggerHaptic('light');
  };

  const playerStats = useMemo<PlayerStats[]>(() => {
    const map: Record<string, PlayerStats> = {};

    history.forEach(({ selectedPlayer, decision, timestamp }) => {
      const { id, name, avatar, color } = selectedPlayer;
      if (!map[id]) {
        map[id] = {
          playerId: id,
          playerName: name,
          playerAvatar: avatar,
          playerColor: color,
          timesPaid: 0,
          timesWon: 0,
          totalGames: 0,
          lastSelectedAt: timestamp,
        };
      }
      map[id].totalGames += 1;
      if (decision.mode === 'loser_pays') map[id].timesPaid += 1;
      else map[id].timesWon += 1;
      if (timestamp > (map[id].lastSelectedAt ?? 0)) map[id].lastSelectedAt = timestamp;
    });

    return Object.values(map).sort((a, b) => b.timesPaid - a.timesPaid);
  }, [history]);

  const getPlayerStat = (playerId: string) =>
    playerStats.find((s) => s.playerId === playerId);

  const topPayer =
    playerStats.length > 0 && playerStats[0].timesPaid > 0 ? playerStats[0] : null;

  return (
    <HistoryContext.Provider
      value={{
        history,
        recordResult,
        clearHistory,
        deleteResult,
        playerStats,
        getPlayerStat,
        topPayer,
        totalGamesPlayed: history.length,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error('useHistory must be inside HistoryProvider');
  return ctx;
};

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Decision, ActiveScreen, GameId } from '../types';
import { DEFAULT_DECISIONS } from '../constants/decisions';
import { triggerHaptic } from '../utils/haptics';

interface GameContextType {
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  activeDecision: Decision;
  setActiveDecision: (decision: Decision) => void;
  allDecisions: Decision[];
  addCustomDecision: (title: string) => Decision;
  removeCustomDecision: (decisionId: string) => void;
  activeGameId: GameId;
  setActiveGameId: (gameId: GameId) => void;
  spinTriggerKey: number;
  triggerRematch: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('start');
  const [activeDecision, setActiveDecisionState] = useState<Decision>(DEFAULT_DECISIONS[0]);
  const [allDecisions, setAllDecisions] = useState<Decision[]>(DEFAULT_DECISIONS);
  const [activeGameId, setActiveGameId] = useState<GameId>('bottle-spin');
  const [spinTriggerKey, setSpinTriggerKey] = useState<number>(0);

  const setActiveDecision = (decision: Decision) => {
    setActiveDecisionState(decision);
    triggerHaptic('selection');
  };

  const addCustomDecision = (title: string): Decision => {
    const trimmed = title.trim();
    const newDecision: Decision = {
      id: 'custom_' + Date.now().toString(),
      title: trimmed,
      question: `Deciding: ${trimmed}`,
      badgeText: 'CUSTOM BET',
      mode: 'loser_pays',
      loserLabel: `has to do: "${trimmed}".`,
      winnerLabel: `is safe from: "${trimmed}".`,
    };

    setAllDecisions((prev) => [newDecision, ...prev]);
    setActiveDecisionState(newDecision);
    triggerHaptic('success');
    return newDecision;
  };

  const removeCustomDecision = (decisionId: string) => {
    const decisionToRemove = allDecisions.find(
      (decision) => decision.id === decisionId
    );
    if (!decisionToRemove?.id.startsWith('custom_')) return;

    setAllDecisions((previous) =>
      previous.filter((decision) => decision.id !== decisionId)
    );

    if (activeDecision.id === decisionId) {
      setActiveDecisionState(DEFAULT_DECISIONS[0]);
    }

    triggerHaptic('light');
  };

  const triggerRematch = () => {
    setSpinTriggerKey((prev) => prev + 1);
    triggerHaptic('medium');
  };

  return (
    <GameContext.Provider
      value={{
        activeScreen,
        setActiveScreen,
        activeDecision,
        setActiveDecision,
        allDecisions,
        addCustomDecision,
        removeCustomDecision,
        activeGameId,
        setActiveGameId,
        spinTriggerKey,
        triggerRematch,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

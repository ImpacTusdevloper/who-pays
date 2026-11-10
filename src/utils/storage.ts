import AsyncStorage from '@react-native-async-storage/async-storage';
import { Player, GameResult, Decision } from '../types';

const STORAGE_KEYS = {
  PLAYERS: '@who_pays_players',
  HISTORY: '@who_pays_history',
  DECISION: '@who_pays_active_decision',
};

export const savePlayersToStorage = async (players: Player[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
  } catch (e) {
    console.error('Error saving players to storage', e);
  }
};

export const loadPlayersFromStorage = async (): Promise<Player[] | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PLAYERS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error loading players from storage', e);
  }
  return null;
};

export const saveHistoryToStorage = async (history: GameResult[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  } catch (e) {
    console.error('Error saving history to storage', e);
  }
};

export const loadHistoryFromStorage = async (): Promise<GameResult[] | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error loading history from storage', e);
  }
  return null;
};

export const saveDecisionToStorage = async (decision: Decision): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.DECISION, JSON.stringify(decision));
  } catch (e) {
    console.error('Error saving decision to storage', e);
  }
};

export const loadDecisionFromStorage = async (): Promise<Decision | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.DECISION);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error loading decision from storage', e);
  }
  return null;
};

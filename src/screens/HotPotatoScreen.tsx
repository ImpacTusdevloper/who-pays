import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { usePlayers } from '../context/PlayerContext';
import { useGame } from '../context/GameContext';
import { useHistory } from '../context/HistoryContext';
import { THEME } from '../constants/colors';
import { HotPotatoGame } from '../games/hot-potato/HotPotatoGame';
import { Button } from '../components/common/Button';
import { Player } from '../types';

export const HotPotatoScreen: React.FC = () => {
  const { players, canStartGame } = usePlayers();
  const { setActiveScreen, activeDecision } = useGame();
  const { recordResult } = useHistory();

  if (!canStartGame) {
    return (
      <View style={styles.error}>
        <Text style={styles.errorTitle}>Not enough players</Text>
        <Button
          title="Add players"
          onPress={() => setActiveScreen('players')}
          color="pink"
        />
      </View>
    );
  }

  const handleResult = async (loser: Player) => {
    await recordResult({
      gameId: 'hot-potato',
      gameTitle: 'Hot Potato',
      decision: activeDecision,
      selectedPlayer: loser,
      allPlayers: players,
    });
  };

  return (
    <HotPotatoGame
      players={players}
      decision={activeDecision}
      onResult={handleResult}
      onRematch={() => {}}
      onExit={() => setActiveScreen('game-select')}
    />
  );
};

const styles = StyleSheet.create({
  error: {
    flex: 1,
    backgroundColor: THEME.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  errorTitle: { fontSize: 20, fontWeight: '800', color: THEME.text },
});

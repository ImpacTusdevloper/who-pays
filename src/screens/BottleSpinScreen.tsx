import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { usePlayers } from '../context/PlayerContext';
import { useGame } from '../context/GameContext';
import { BottleSpinGame } from '../games/bottle-spin/BottleSpinGame';
import { Button } from '../components/common/Button';
import { THEME } from '../constants/colors';

export const BottleSpinScreen: React.FC = () => {
  const { players, canStartGame } = usePlayers();
  const { setActiveScreen } = useGame();

  if (!canStartGame) {
    return (
      <View style={styles.error}>
        <Text style={styles.errorTitle}>Not enough players</Text>
        <Button
          title="Add Players"
          onPress={() => setActiveScreen('players')}
          variant="pink"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BottleSpinGame
        players={players}
        onBackToPlayers={() => setActiveScreen('players')}
        onViewHistory={() => setActiveScreen('history')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bg },
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

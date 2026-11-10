import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  TouchableOpacity,
} from 'react-native';
import { BlurTargetView } from 'expo-blur';
import type { ComponentRef } from 'react';
import { Player } from '../../types';
import { THEME } from '../../constants/colors';
import { BottleGraphic } from '../../components/bottle/BottleGraphic';
import { PlayerRing } from '../../components/bottle/PlayerRing';
import { ResultModal } from '../../components/bottle/ResultModal';
import { GameActionMark } from '../../components/common/GameActionMark';
import { Button } from '../../components/common/Button';
import { useBottlePhysics } from './useBottlePhysics';
import { useGame } from '../../context/GameContext';
import { useHistory } from '../../context/HistoryContext';
import { triggerHaptic } from '../../utils/haptics';

interface BottleSpinGameProps {
  players: Player[];
  onBackToPlayers: () => void;
  onViewHistory: () => void;
}

export const BottleSpinGame: React.FC<BottleSpinGameProps> = ({
  players,
  onBackToPlayers,
  onViewHistory,
}) => {
  const { activeDecision, spinTriggerKey, triggerRematch } = useGame();
  const { recordResult } = useHistory();

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const gameSceneRef = useRef<ComponentRef<typeof View> | null>(null);

  const windowWidth = Dimensions.get('window').width;
  const arenaRadius = Math.min((windowWidth - 32) / 2, 175);

  const handleSpinEnd = (winner: Player) => {
    setSelectedPlayer(winner);
    setModalVisible(true);

    recordResult({
      gameId: 'bottle-spin',
      gameTitle: 'Bottle Spin',
      decision: activeDecision,
      selectedPlayer: winner,
      allPlayers: players,
    });
  };

  const { spinAnim, isSpinning, activePlayerIndex, spinBottle } = useBottlePhysics({
    players,
    onSpinEnd: handleSpinEnd,
  });

  // Watch for external rematch triggers (e.g. from context or modal)
  useEffect(() => {
    if (spinTriggerKey > 0 && !isSpinning) {
      setModalVisible(false);
      setTimeout(() => {
        spinBottle();
      }, 300);
    }
  }, [spinTriggerKey]);

  // Swipe gesture detection to spin the bottle!
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isSpinning,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return !isSpinning && (Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (isSpinning) return;
        const velocity = Math.sqrt(gestureState.vx * gestureState.vx + gestureState.vy * gestureState.vy);
        const intensity = Math.min(Math.max(velocity, 0.9), 1.5);
        spinBottle(intensity);
      },
    })
  ).current;

  const rotateInterpolation = spinAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const handleRematchFromModal = () => {
    setModalVisible(false);
    setTimeout(() => {
      spinBottle();
    }, 400);
  };

  return (
    <View style={styles.container}>
      <BlurTargetView ref={gameSceneRef} collapsable={false} style={styles.gameScene}>
      {/* Game Instruction Hint */}
      <View style={styles.hintContainer}>
        <GameActionMark size={42} action="spin" />
        <Text style={styles.hintText}>
          {isSpinning
            ? 'Mochi is choosing...'
            : 'Swipe or tap to spin!'}
        </Text>
      </View>

      {/* Main Spinning Arena */}
      <View style={styles.arenaWrapper}>
        {/* Radial Players Ring */}
        <PlayerRing
          players={players}
          activePlayerIndex={activePlayerIndex}
          radius={arenaRadius}
        />

        {/* Center Spinning Bottle with Pan Gesture */}
        <View
          style={[styles.bottleTouchZone, { width: arenaRadius * 1.1, height: arenaRadius * 1.1 }]}
          {...panResponder.panHandlers}
        >
          <Animated.View
            style={[
              styles.bottlePivot,
              {
                transform: [{ rotate: rotateInterpolation }],
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              disabled={isSpinning}
              onPress={() => spinBottle(1)}
            >
              <BottleGraphic size={170} isSpinning={isSpinning} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      {/* Control Area */}
      <View style={styles.controlSection}>
        <Button
          title={isSpinning ? 'Mochi is choosing...' : 'Spin Mochi’s bottle'}

          onPress={() => spinBottle(1)}
          disabled={isSpinning}
          size="lg"
          variant="pink"
          style={styles.spinButton}
        />

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.utilityBtn}
            disabled={isSpinning}
            onPress={() => {
              triggerHaptic('light');
              onBackToPlayers();
            }}
          >
            <Text style={styles.utilityText}>Players ({players.length})</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.utilityBtn}
            disabled={isSpinning}
            onPress={() => {
              triggerHaptic('light');
              onViewHistory();
            }}
          >
            <Text style={styles.utilityText}>History</Text>
          </TouchableOpacity>
        </View>
      </View>
      </BlurTargetView>

      {/* Winner/Payer Reveal Modal */}
      <ResultModal
        visible={modalVisible}
        selectedPlayer={selectedPlayer}
        decision={activeDecision}
        onRematch={handleRematchFromModal}
        onClose={() => setModalVisible(false)}
        onViewHistory={() => {
          setModalVisible(false);
          onViewHistory();
        }}
        onManagePlayers={() => {
          setModalVisible(false);
          onBackToPlayers();
        }}
        blurTarget={gameSceneRef}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gameScene: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FFCCD5',
    borderBottomWidth: 3,
    borderBottomColor: '#FFB3C1',
    marginBottom: 8,
    shadowColor: '#FF4D6D',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  hintText: {
    fontSize: 13,
    fontWeight: '900',
    color: THEME.pink,
    textAlign: 'center',
  },
  arenaWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
  },
  bottleTouchZone: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  bottlePivot: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 170,
    height: 170,
  },
  controlSection: {
    width: '100%',
    paddingBottom: 16,
    gap: 12,
  },
  spinButton: {
    width: '100%',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  utilityBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FFCCD5',
    borderBottomWidth: 3,
    borderBottomColor: '#FFB3C1',
    paddingVertical: 10,
    borderRadius: 14,
  },
  utilityText: {
    fontSize: 13,
    fontWeight: '900',
    color: THEME.text,
  },
});

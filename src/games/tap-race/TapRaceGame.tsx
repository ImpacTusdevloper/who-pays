import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { BlurTargetView } from 'expo-blur';
import type { ComponentRef } from 'react';
import { Player, Decision, TapRaceRoundResult } from '../../types';
import { THEME } from '../../constants/colors';
import { Avatar } from '../../components/common/Avatar';
import { GameActionMark } from '../../components/common/GameActionMark';
import { triggerHaptic } from '../../utils/haptics';
import { BlurredResultBackdrop } from '../../components/common/BlurredResultBackdrop';
import { SciFiExileCard } from '../../components/common/SciFiExileCard';

const { width } = Dimensions.get('window');
const TAP_DURATION = 5; // seconds per player

type Phase = 'intro' | 'countdown' | 'tapping' | 'next' | 'results';

interface TapRaceGameProps {
  players: Player[];
  decision: Decision;
  onResult: (loser: Player) => void;
  onRematch: () => void;
  onExit: () => void;
}

export const TapRaceGame: React.FC<TapRaceGameProps> = ({
  players,
  decision,
  onResult,
  onRematch,
  onExit,
}) => {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [taps, setTaps] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(TAP_DURATION);
  const [results, setResults] = useState<TapRaceRoundResult[]>([]);

  const tapScaleAnim = useRef(new Animated.Value(1)).current;
  const countdownAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resultSceneRef = useRef<ComponentRef<typeof View> | null>(null);

  const currentPlayer = players[currentIndex];

  const animateTap = useCallback(() => {
    Animated.sequence([
      Animated.timing(tapScaleAnim, { toValue: 0.88, duration: 60, useNativeDriver: true }),
      Animated.timing(tapScaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  }, [tapScaleAnim]);

  const animateCountdown = useCallback(() => {
    countdownAnim.setValue(1.5);
    Animated.timing(countdownAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, [countdownAnim]);

  // Countdown phase
  useEffect(() => {
    if (phase !== 'countdown') return;
    if (countdown === 0) {
      setPhase('tapping');
      setTimeLeft(TAP_DURATION);
      setTaps(0);
      return;
    }
    animateCountdown();
    const t = setTimeout(() => setCountdown((c) => c - 1), 900);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  // Tapping timer
  useEffect(() => {
    if (phase !== 'tapping') return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  // Time's up — record and move on
  useEffect(() => {
    if (phase === 'tapping' && timeLeft === 0) {
      triggerHaptic('error');
      const roundResult: TapRaceRoundResult = {
        player: currentPlayer,
        taps,
        rank: 0,
      };
      const newResults = [...results, roundResult];

      if (currentIndex + 1 >= players.length) {
        // All done — calc ranks
        const sorted = [...newResults].sort((a, b) => a.taps - b.taps);
        const withRanks = newResults.map((r) => ({
          ...r,
          rank: sorted.findIndex((s) => s.player.id === r.player.id) + 1,
        }));
        setResults(withRanks);
        onResult(sorted[0].player);
        setPhase('results');
      } else {
        setResults(newResults);
        setPhase('next');
      }
    }
  }, [timeLeft, phase, currentIndex, currentPlayer, onResult, results, taps]);

  const startCurrentPlayer = () => {
    setCountdown(3);
    setPhase('countdown');
  };

  const nextPlayer = () => {
    setCurrentIndex((i) => i + 1);
    setPhase('countdown');
    setCountdown(3);
  };

  const handleTap = () => {
    if (phase !== 'tapping') return;
    setTaps((t) => t + 1);
    triggerHaptic('light');
    animateTap();
  };

  // ── INTRO ─────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <View style={styles.container}>
        <GameActionMark size={92} action="tap" />
        <Text style={styles.gameTitle}>MOCHI’S PAW RACE</Text>
        <Text style={styles.gameSub}>
          Each player gets {TAP_DURATION} seconds to tap as fast as they can.
          Fewest taps = loser.
        </Text>
        <View style={styles.rulesCard}>
          {players.map((p, i) => (
            <View key={p.id} style={styles.rulePlayerRow}>
              <Text style={styles.ruleIdx}>{i + 1}.</Text>
              <Avatar avatar={p.avatar} color={p.color} size={28} />
              <Text style={styles.rulePlayerName}>{p.name}</Text>
            </View>
          ))}
        </View>
        <View style={styles.decisionBox}>
          <Text style={styles.decisionBoxLabel}>LOSER WILL...</Text>
          <Text style={styles.decisionBoxText}>{decision.loserLabel}</Text>
        </View>
        <TouchableOpacity style={styles.startBtn} onPress={startCurrentPlayer}>
          <Text style={styles.startBtnText}>START  →  {players[0].name}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── COUNTDOWN ─────────────────────────────────────────────────
  if (phase === 'countdown') {
    return (
      <View style={styles.container}>
        <Text style={styles.holdingLabel}>{currentPlayer.name.toUpperCase()}'S TURN</Text>
        <GameActionMark size={72} action="tap" />
        <Avatar avatar={currentPlayer.avatar} color={currentPlayer.color} size={72} highlighted />
        <Animated.Text
          style={[
            styles.countdownNum,
            { transform: [{ scale: countdownAnim }], color: countdown <= 1 ? THEME.lime : THEME.text },
          ]}
        >
          {countdown === 0 ? 'GO!' : countdown}
        </Animated.Text>
        <Text style={styles.countdownSub}>Get your finger ready...</Text>
      </View>
    );
  }

  // ── NEXT PLAYER ───────────────────────────────────────────────
  if (phase === 'next') {
    const justDone = results[results.length - 1];
    const nextP = players[currentIndex + 1];
    return (
      <View style={styles.container}>
        <GameActionMark size={56} action="tap" />
        <Text style={styles.holdingLabel}>DONE!</Text>
        <Avatar avatar={justDone.player.avatar} color={justDone.player.color} size={64} />
        <Text style={styles.tapCount}>
          <Text style={styles.tapCountNum}>{justDone.taps}</Text> taps
        </Text>
        <View style={styles.nextCard}>
          <Text style={styles.nextLabel}>UP NEXT</Text>
          <Avatar avatar={nextP.avatar} color={nextP.color} size={52} />
          <Text style={styles.nextName}>{nextP.name}</Text>
        </View>
        <TouchableOpacity style={styles.startBtn} onPress={nextPlayer}>
          <Text style={styles.startBtnText}>Go  →  {nextP.name}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── TAPPING ───────────────────────────────────────────────────
  if (phase === 'tapping') {
    const pct = timeLeft / TAP_DURATION;
    const barColor = pct > 0.5 ? THEME.lime : pct > 0.25 ? THEME.orange : THEME.red;
    return (
      <View style={styles.container}>
        {/* Timer bar */}
        <View style={styles.timerBarTrack}>
          <View
            style={[
              styles.timerBarFill,
              { width: `${pct * 100}%` as any, backgroundColor: barColor },
            ]}
          />
        </View>

        <Text style={styles.holdingLabel}>{currentPlayer.name.toUpperCase()}</Text>
        <Text style={styles.tapCount}>
          <Text style={styles.tapCountNum}>{taps}</Text>
          {'\n'}
          <Text style={styles.tapCountLabel}>TAPS</Text>
        </Text>

        <Animated.View style={{ transform: [{ scale: tapScaleAnim }] }}>
          <TouchableOpacity
            style={styles.tapBtn}
            onPress={handleTap}
            activeOpacity={0.7}
          >
            <GameActionMark size={116} action="tap" />
            <Text style={styles.tapBtnText}>TAP!</Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={[styles.timerLabel, timeLeft <= 2 && { color: THEME.red }]}>
          {timeLeft}s left
        </Text>
      </View>
    );
  }

  // ── RESULTS ───────────────────────────────────────────────────
  if (phase === 'results') {
    const sorted = [...results].sort((a, b) => a.taps - b.taps);
    const loser = sorted[0];

    return (
      <View style={styles.resultRoot}>
        <BlurTargetView ref={resultSceneRef} collapsable={false} style={styles.resultScene}>
          <GameActionMark size={76} action="tap" />
          <Text style={styles.holdingLabel}>TAP RACE COMPLETE</Text>
          <View style={styles.resultsList}>
            {sorted.map((result, index) => (
              <View key={result.player.id} style={styles.resultRow}>
                <Avatar avatar={result.player.avatar} color={result.player.color} size={36} />
                <Text style={styles.resultName}>{result.player.name}</Text>
                <Text style={styles.resultTaps}>{result.taps} taps</Text>
              </View>
            ))}
          </View>
        </BlurTargetView>
        <BlurredResultBackdrop target={resultSceneRef} tone="dark" />
        <View style={styles.resultForeground}>
          <ScrollView
            contentContainerStyle={styles.resultContent}
            showsVerticalScrollIndicator={false}
          >
            <GameActionMark size={76} action="tap" />
            <Text style={styles.explodedLabel}>RESULTS</Text>
            <View style={styles.resultsList}>
              {sorted.map((result, index) => (
                <View
                  key={result.player.id}
                  style={[
                    styles.resultRow,
                    index === 0 && styles.resultRowLoser,
                  ]}
                >
                  <Text style={styles.resultRank}>#{index + 1}</Text>
                  <Avatar avatar={result.player.avatar} color={result.player.color} size={36} />
                  <Text style={styles.resultName}>{result.player.name}</Text>
                  <Text style={[styles.resultTaps, index === 0 && { color: THEME.red }]}>
                    {result.taps} taps
                  </Text>
                </View>
              ))}
            </View>

            <SciFiExileCard
              player={loser.player}
              consequence={decision.loserLabel}
              compact
            />

            <View style={styles.explodedActions}>
              <TouchableOpacity
                style={styles.rematchBtn}
                onPress={() => {
                  setPhase('intro');
                  setCurrentIndex(0);
                  setResults([]);
                  onRematch();
                }}
              >
                <Text style={styles.rematchBtnText}>REMATCH</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.exitBtn} onPress={onExit}>
                <Text style={styles.exitBtnText}>Back to games</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },

  // Shared
  gameTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: THEME.text,
    letterSpacing: -1,
  },
  gameSub: {
    fontSize: 15,
    color: THEME.textSub,
    textAlign: 'center',
    lineHeight: 22,
  },
  rulesCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FFCCD5',
    borderBottomWidth: 4,
    borderBottomColor: '#FFB3C1',
    borderRadius: 20,
    padding: 16,
    gap: 10,
    width: '100%',
    shadowColor: '#FF4D6D',
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  rulePlayerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ruleIdx: { fontSize: 13, fontWeight: '800', color: THEME.pink, width: 18 },
  rulePlayerName: { fontSize: 15, fontWeight: '800', color: THEME.text },
  decisionBox: {
    backgroundColor: '#FFF0F5',
    borderWidth: 2,
    borderColor: '#FFCCD5',
    borderRadius: 16,
    padding: 14,
    width: '100%',
  },
  decisionBoxLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: THEME.pink,
    letterSpacing: 1,
    marginBottom: 4,
  },
  decisionBoxText: { fontSize: 15, fontWeight: '800', color: THEME.text },
  startBtn: {
    backgroundColor: THEME.cyan,
    borderRadius: 20,
    borderBottomWidth: 5,
    borderBottomColor: THEME.cyanShadow,
    paddingVertical: 16,
    paddingHorizontal: 36,
    marginTop: 4,
  },
  startBtnText: {
    fontSize: 17,
    fontWeight: '900',
    color: THEME.textDark,
    letterSpacing: 0.5,
  },

  // Countdown
  holdingLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: THEME.yellow,
    letterSpacing: 1.5,
  },
  countdownNum: {
    fontSize: 90,
    fontWeight: '900',
    lineHeight: 100,
    letterSpacing: -2,
  },
  countdownSub: { fontSize: 14, color: THEME.textSub },

  // Tapping
  timerBarTrack: {
    width: '100%',
    height: 8,
    backgroundColor: THEME.surface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  timerBarFill: { height: 8, borderRadius: 4 },
  tapCount: {
    textAlign: 'center',
    fontSize: 16,
    color: THEME.textSub,
    fontWeight: '600',
    lineHeight: 50,
  },
  tapCountNum: {
    fontSize: 72,
    fontWeight: '900',
    color: THEME.text,
    lineHeight: 80,
  },
  tapCountLabel: {
    fontSize: 13,
    color: THEME.yellow,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  tapBtn: {
    backgroundColor: THEME.pink,
    width: width * 0.65,
    height: width * 0.65,
    borderRadius: (width * 0.65) / 2,
    borderWidth: 4,
    borderColor: '#FFF',
    borderBottomWidth: 10,
    borderBottomColor: THEME.pinkShadow,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tapBtnText: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 2,
  },
  timerLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.textMuted,
  },

  // Next player
  nextCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FFCCD5',
    borderBottomWidth: 4,
    borderBottomColor: '#FFB3C1',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    gap: 10,
    width: '100%',
    shadowColor: '#FF4D6D',
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  nextLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: THEME.pink,
    letterSpacing: 1.5,
  },
  nextName: { fontSize: 20, fontWeight: '900', color: THEME.text },

  // Results
  resultRoot: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  resultScene: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  resultForeground: {
    ...StyleSheet.absoluteFill,
    width: '100%',
  },
  resultContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  explodedLabel: {
    fontSize: 42,
    fontWeight: '900',
    color: THEME.text,
    letterSpacing: -1,
  },
  resultsList: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#FFCCD5',
    borderBottomWidth: 4,
    borderBottomColor: '#FFB3C1',
    overflow: 'hidden',
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE5EC',
  },
  resultRowLoser: {
    backgroundColor: '#FFF0F5',
  },
  resultRank: { fontSize: 16, width: 28 },
  resultName: { flex: 1, fontSize: 15, fontWeight: '800', color: THEME.text },
  resultTaps: { fontSize: 15, fontWeight: '900', color: THEME.textSub },
  explodedActions: { gap: 12, width: '100%' },
  rematchBtn: {
    backgroundColor: THEME.mint,
    borderRadius: 18,
    borderBottomWidth: 5,
    borderBottomColor: THEME.mintShadow,
    paddingVertical: 16,
    alignItems: 'center',
  },
  rematchBtnText: {
    fontSize: 17,
    fontWeight: '900',
    color: THEME.textDark,
    letterSpacing: 0.8,
  },
  exitBtn: {
    backgroundColor: THEME.surface,
    borderRadius: 16,
    borderBottomWidth: 3,
    borderBottomColor: THEME.border,
    paddingVertical: 14,
    alignItems: 'center',
  },
  exitBtnText: { fontSize: 14, fontWeight: '800', color: THEME.textSub },
});

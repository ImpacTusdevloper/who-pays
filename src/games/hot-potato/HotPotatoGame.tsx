import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Vibration,
  Dimensions,
} from 'react-native';
import { BlurTargetView } from 'expo-blur';
import type { ComponentRef } from 'react';
import { Player, Decision } from '../../types';
import { THEME } from '../../constants/colors';
import { Avatar } from '../../components/common/Avatar';
import { GameActionMark } from '../../components/common/GameActionMark';
import { triggerHaptic } from '../../utils/haptics';
import { BlurredResultBackdrop } from '../../components/common/BlurredResultBackdrop';
import { SciFiExileCard } from '../../components/common/SciFiExileCard';

const { width } = Dimensions.get('window');

type Phase = 'idle' | 'running' | 'exploded';

interface HotPotatoGameProps {
  players: Player[];
  decision: Decision;
  onResult: (loser: Player) => void;
  onRematch: () => void;
  onExit: () => void;
}

export const HotPotatoGame: React.FC<HotPotatoGameProps> = ({
  players,
  decision,
  onResult,
  onRematch,
  onExit,
}) => {
  const [phase, setPhase] = useState<Phase>('idle');
  const [holderIndex, setHolderIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [loser, setLoser] = useState<Player | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const resultSceneRef = useRef<ComponentRef<typeof View> | null>(null);

  // Shake animation for near-explosion tension
  const startShake = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 5, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -5, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
      ])
    ).start();
  }, [shakeAnim]);

  const stopShake = useCallback(() => {
    shakeAnim.stopAnimation();
    shakeAnim.setValue(0);
  }, [shakeAnim]);

  // Pulse Mochi's hot paw.
  const startPulse = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 300, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.95, duration: 300, useNativeDriver: true }),
      ])
    ).start();
  }, [pulseAnim]);

  const explodeAnim = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.6, duration: 180, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [scaleAnim]);

  const startGame = () => {
    // Random duration 15–45 seconds
    const dur = Math.floor(Math.random() * 30 + 15);
    setTotalTime(dur);
    setTimeLeft(dur);
    setHolderIndex(0);
    setLoser(null);
    setPhase('running');
    pulseAnim.setValue(1);
    scaleAnim.setValue(1);
    startPulse();
  };

  useEffect(() => {
    if (phase !== 'running') return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // EXPLODE
          clearInterval(timerRef.current!);
          return 0;
        }
        // Haptic ticks get more intense as time runs out
        if (prev <= 5) {
          triggerHaptic('heavy');
          if (prev <= 3) Vibration.vibrate(80);
        } else if (prev <= 10) {
          triggerHaptic('medium');
        }
        return prev - 1;
      });
    }, 1000);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  useEffect(() => {
    if (phase === 'running' && timeLeft === 0) {
      // BOOM
      const loserPlayer = players[holderIndex];
      setLoser(loserPlayer);
      setPhase('exploded');
      stopShake();
      pulseAnim.stopAnimation();
      explodeAnim();
      triggerHaptic('error');
      Vibration.vibrate([0, 100, 50, 100, 50, 300]);
      onResult(loserPlayer);
    }

    // Start shaking when < 8 seconds left
    if (phase === 'running' && timeLeft === 8) startShake();
  }, [timeLeft, phase]);

  const passToNext = () => {
    if (phase !== 'running') return;
    triggerHaptic('light');
    setHolderIndex((prev) => (prev + 1) % players.length);
  };

  const handleRematch = () => {
    setPhase('idle');
    onRematch();
  };

  const danger = timeLeft <= 8 && timeLeft > 0 && phase === 'running';
  const progress = totalTime > 0 ? timeLeft / totalTime : 0;
  const barColor =
    progress > 0.6 ? THEME.lime : progress > 0.3 ? THEME.orange : THEME.red;

  const holder = players[holderIndex];

  // ── IDLE ───────────────────────────────────────────────────────
  if (phase === 'idle') {
    return (
      <View style={styles.container}>
        <GameActionMark size={88} action="pass" />
        <Text style={styles.gameTitle}>MOCHI’S HOT PAW</Text>
        <Text style={styles.gameSub}>
          Pass Mochi around. When the timer hits zero, whoever’s holding the phone pays.
        </Text>

        <View style={styles.rulesCard}>
          <Text style={styles.ruleText}>1. Someone presses START</Text>
          <Text style={styles.ruleText}>2. Pass the phone around, tap PASS each time</Text>
          <Text style={styles.ruleText}>3. The timer is hidden — could blow any second</Text>
          <Text style={styles.ruleText}>4. Whoever's holding it when it explodes = loser</Text>
        </View>

        <View style={styles.decisionBox}>
          <Text style={styles.decisionBoxLabel}>THEY WILL...</Text>
          <Text style={styles.decisionBoxText}>{decision.loserLabel}</Text>
        </View>

        <TouchableOpacity style={styles.startBtn} onPress={startGame}>
          <Text style={styles.startBtnText}>START</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── EXPLODED ──────────────────────────────────────────────────
  if (phase === 'exploded' && loser) {
    return (
      <View style={styles.resultRoot}>
        <BlurTargetView ref={resultSceneRef} collapsable={false} style={styles.resultScene}>
          <View style={styles.timerBarTrack}>
            <View style={[styles.timerBarFill, { width: '0%', backgroundColor: THEME.red }]} />
          </View>
          <Text style={[styles.timerLabel, { color: THEME.red }]}>0s</Text>
          <View style={styles.potatoWrap}>
            <GameActionMark size={116} action="pass" />
          </View>
          <Text style={styles.holdingLabel}>HOLDING IT</Text>
          <View style={styles.holderCard}>
            <Avatar avatar={loser.avatar} color={loser.color} size={56} highlighted />
            <Text style={[styles.holderName, { color: loser.color }]}>{loser.name}</Text>
          </View>
          <View style={styles.playerQueue}>
            {players.map((player, index) => (
              <View
                key={player.id}
                style={[
                  styles.queueDot,
                  index === holderIndex && { backgroundColor: player.color },
                ]}
              />
            ))}
          </View>
          <View style={styles.passBtn}>
            <View style={styles.passBtnContent}>
              <GameActionMark size={30} action="pass" />
              <Text style={styles.passBtnText}>PASS</Text>
            </View>
          </View>
        </BlurTargetView>
        <BlurredResultBackdrop target={resultSceneRef} tone="dark" />
        <View style={styles.resultForeground}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <SciFiExileCard
              player={loser}
              consequence={decision.loserLabel}
            />
          </Animated.View>

          <View style={styles.explodedActions}>
            <TouchableOpacity style={styles.rematchBtn} onPress={handleRematch}>
              <Text style={styles.rematchBtnText}>REMATCH</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exitBtn} onPress={onExit}>
              <Text style={styles.exitBtnText}>Back to games</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // ── RUNNING ───────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* Timer bar */}
      <View style={styles.timerBarTrack}>
        <Animated.View
          style={[
            styles.timerBarFill,
            { width: `${progress * 100}%` as any, backgroundColor: barColor },
          ]}
        />
      </View>

      <Text style={[styles.timerLabel, danger && { color: THEME.red }]}>
        {timeLeft}s
      </Text>

      {/* Mochi's hot paw */}
      <Animated.View
        style={[
          styles.potatoWrap,
          {
            transform: [
              { translateX: shakeAnim },
              { scale: pulseAnim },
            ],
          },
        ]}
      >
        <GameActionMark size={132} action="pass" />
      </Animated.View>

      {/* Holder */}
      <Text style={styles.holdingLabel}>HOLDING IT</Text>
      <View style={styles.holderCard}>
        <Avatar avatar={holder.avatar} color={holder.color} size={56} highlighted />
        <Text style={[styles.holderName, { color: holder.color }]}>{holder.name}</Text>
      </View>

      {/* Players queue */}
      <View style={styles.playerQueue}>
        {players.map((p, i) => (
          <View
            key={p.id}
            style={[
              styles.queueDot,
              i === holderIndex && { backgroundColor: p.color },
            ]}
          />
        ))}
      </View>

      {/* PASS button */}
      <TouchableOpacity
        style={[styles.passBtn, danger && styles.passBtnDanger]}
        onPress={passToNext}
        activeOpacity={0.7}
      >
        <View style={styles.passBtnContent}>
          <GameActionMark size={34} action="pass" />
          <Text style={[styles.passBtnText, danger && { color: THEME.red }]}>
            PASS
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 16,
  },

  // Idle
  gameTitle: {
    fontSize: 28,
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
    gap: 8,
    width: '100%',
    shadowColor: '#FF4D6D',
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  ruleText: { fontSize: 13, color: THEME.textSub, lineHeight: 18, fontWeight: '700' },
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
    backgroundColor: THEME.yellow,
    borderRadius: 20,
    borderBottomWidth: 5,
    borderBottomColor: THEME.yellowShadow,
    paddingVertical: 16,
    paddingHorizontal: 48,
    marginTop: 8,
  },
  startBtnText: {
    fontSize: 18,
    fontWeight: '900',
    color: THEME.textDark,
    letterSpacing: 1,
  },

  // Running
  timerBarTrack: {
    width: '100%',
    height: 8,
    backgroundColor: THEME.surface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  timerBarFill: { height: 8, borderRadius: 4 },
  timerLabel: {
    fontSize: 42,
    fontWeight: '900',
    color: THEME.textSub,
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
  },
  potatoWrap: {
    width: 136,
    height: 136,
    borderRadius: 68,
    marginVertical: 8,
    backgroundColor: '#FFF0F5',
    borderWidth: 3,
    borderColor: '#FFCCD5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  holdingLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: THEME.yellow,
    letterSpacing: 1.5,
  },
  holderCard: { alignItems: 'center', gap: 8 },
  holderName: { fontSize: 24, fontWeight: '900' },
  playerQueue: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 8,
  },
  queueDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: THEME.surface,
  },
  passBtn: {
    backgroundColor: THEME.pink,
    borderWidth: 2,
    borderColor: '#FFF',
    borderBottomWidth: 6,
    borderBottomColor: THEME.pinkShadow,
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 48,
    marginTop: 8,
  },
  passBtnDanger: {
    borderColor: THEME.coral,
    backgroundColor: THEME.coral,
    borderBottomColor: THEME.coralShadow,
  },
  passBtnText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 1,
  },
  passBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  // Exploded
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
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

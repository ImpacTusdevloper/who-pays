import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { THEME } from '../constants/colors';
import { useGame } from '../context/GameContext';
import { usePlayers } from '../context/PlayerContext';
import { useAudio } from '../context/AudioContext';
import { Button } from '../components/common/Button';
import { SoundVisualizerPill } from '../components/common/SoundVisualizerPill';
import { triggerHaptic } from '../utils/haptics';
import { CatMark } from '../components/common/CatMark';

export const StartScreen: React.FC = () => {
  const { setActiveScreen } = useGame();
  const { players } = usePlayers();
  const { playSfx } = useAudio();

  // Floating bob animation for the mascot
  const floatAnim = useRef(new Animated.Value(0)).current;
  const bounceScale = useRef(new Animated.Value(1)).current;

  // Mascot interactive tap reaction
  const squishAnim = useRef(new Animated.Value(1)).current;
  const [showHeart, setShowHeart] = useState(false);
  const heartFloatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Gentle floating bob
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1400,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Subtle breath pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceScale, {
          toValue: 1.03,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(bounceScale, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim, bounceScale]);

  const handleMascotTap = () => {
    triggerHaptic('light');
    playSfx('pop');

    // Squash & stretch reaction
    Animated.sequence([
      Animated.timing(squishAnim, {
        toValue: 0.85,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(squishAnim, {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Pop floating heart
    setShowHeart(true);
    heartFloatAnim.setValue(0);
    Animated.timing(heartFloatAnim, {
      toValue: -28,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      setShowHeart(false);
    });
  };

  const handleStartPlay = () => {
    triggerHaptic('heavy');
    setActiveScreen('decisions');
  };

  return (
    <View style={styles.container}>
      {/* Top Controls Bar */}
      <View style={styles.topBar}>
        <View style={styles.arcadeBadge}>
          <View style={styles.arcadeDot} />
          <Text style={styles.arcadeBadgeText}>MOCHI’S CAT CAFE</Text>
        </View>
        <SoundVisualizerPill />
      </View>

      {/* Centered Cute Bouncing Title & Custom Kawaii Mascot */}
      <Animated.View
        style={[
          styles.heroSection,
          {
            transform: [
              { translateY: floatAnim },
              { scale: bounceScale },
            ],
          },
        ]}
      >
        <Text style={styles.titleWho}>WHO</Text>
        <Text style={styles.titlePays}>PAYS?!</Text>

        {/* Interactive Tap-able Mascot */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleMascotTap}
          style={styles.mascotWrapper}
        >
          {showHeart && (
            <Animated.Text
              style={[
                styles.floatingHeart,
                { transform: [{ translateY: heartFloatAnim }] },
              ]}
            >
              ♥
            </Animated.Text>
          )}

          <Animated.View
            style={[
              styles.mascotContainer,
              { transform: [{ scale: squishAnim }] },
            ]}
          >
            <View style={styles.mascotFace}>
              <CatMark size={68} />
            </View>
          </Animated.View>
        </TouchableOpacity>
        <Text style={styles.mascotCaption}>Mochi, your tiny referee</Text>

        {/* Squad Status Pill */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveScreen('players')}
          style={styles.squadStatusChip}
        >
          <View style={styles.squadAvatarDots}>
            {players.slice(0, 4).map((p) => (
              <View
                key={p.id}
                style={[styles.squadDot, { backgroundColor: p.color }]}
              />
            ))}
          </View>
          <Text style={styles.squadStatusText}>
            {players.length} FRIENDS READY
          </Text>
          <Text style={styles.squadStatusArrow}>›</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Exactly 3 Clean Buttons */}
      <View style={styles.buttonGroup}>
        {/* 1. Primary Giant Play Button */}
        <Button
          title="PLAY"
          color="pink"
          size="xl"
          onPress={handleStartPlay}
        />

        {/* 2. Squad Button */}
        <Button
          title="SQUAD"
          color="yellow"
          size="lg"
          onPress={() => setActiveScreen('players')}
        />

        {/* 3. Hall of Shame */}
        <Button
          title="PAST ROUNDS"
          color="mint"
          size="md"
          onPress={() => setActiveScreen('history')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 28,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  arcadeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FFCCD5',
    borderBottomWidth: 2,
    borderBottomColor: '#FFCCD5',
  },
  arcadeDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: THEME.pink,
  },
  arcadeBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: THEME.text,
    letterSpacing: 1,
  },

  heroSection: {
    alignItems: 'center',
    marginTop: 8,
  },
  titleWho: {
    fontSize: 46,
    fontWeight: '900',
    color: THEME.pink,
    letterSpacing: 4,
    lineHeight: 48,
    textShadowColor: 'rgba(255, 77, 109, 0.25)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  titlePays: {
    fontSize: 64,
    fontWeight: '900',
    color: THEME.text,
    letterSpacing: 3,
    lineHeight: 66,
    textShadowColor: 'rgba(255, 255, 255, 0.9)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },

  /* Kawaii Mascot */
  mascotWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    position: 'relative',
  },
  floatingHeart: {
    position: 'absolute',
    top: -8,
    fontSize: 22,
    color: '#FF4D6D',
    fontWeight: '900',
    zIndex: 20,
  },
  mascotContainer: {
    position: 'relative',
    width: 104,
    height: 92,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotFace: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#FFF7F8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#A8808E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  mascotCaption: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.textSub,
    marginTop: 4,
  },

  /* Squad readiness chip */
  squadStatusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#F3DDE3',
    borderBottomWidth: 2,
    borderBottomColor: '#F3DDE3',
  },
  squadAvatarDots: {
    flexDirection: 'row',
    gap: 4,
  },
  squadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  squadStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.text,
  },
  squadStatusArrow: {
    fontSize: 14,
    fontWeight: '900',
    color: THEME.pink,
    marginLeft: 2,
  },

  buttonGroup: {
    width: '100%',
    gap: 14,
    marginBottom: 10,
  },
});

import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions, Platform } from 'react-native';
import { BlurTargetView, BlurView } from 'expo-blur';
import type { ComponentRef } from 'react';
import { THEME } from '../../constants/colors';

const { width, height } = Dimensions.get('window');
const ORB_LAYERS = [
  { scale: 1, opacity: 0.06 },
  { scale: 0.82, opacity: 0.07 },
  { scale: 0.64, opacity: 0.08 },
  { scale: 0.46, opacity: 0.09 },
  { scale: 0.28, opacity: 0.1 },
];

interface FloatingBubble {
  id: number;
  size: number;
  startX: number;
  duration: number;
  delay: number;
  isSparkle: boolean;
  animY: Animated.Value;
  animSway: Animated.Value;
  animOpacity: Animated.Value;
}

export const AnimatedPinkBackground: React.FC<{
  children?: React.ReactNode;
  quiet?: boolean;
}> = ({ children, quiet = false }) => {
  const [bubbles] = useState<FloatingBubble[]>(() =>
    Array.from({ length: 24 }, (_, i) => {
      const size = 8 + Math.random() * 6;
      return {
        id: i,
        size,
        startX: Math.random() * Math.max(width - size, 1),
        duration: 16000 + Math.random() * 10000,
        delay: Math.random() * 1200,
        isSparkle: Math.random() < 0.22,
        animY: new Animated.Value(height * (0.62 + Math.random() * 0.4)),
        animSway: new Animated.Value(0),
        animOpacity: new Animated.Value(0.58 + Math.random() * 0.3),
      };
    })
  );

  // Background ambient pulsing bubble animations
  const [ambientPulse] = useState(() => new Animated.Value(0));
  const backdropTarget = useRef<ComponentRef<typeof View> | null>(null);

  useEffect(() => {
    let active = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const animations = new Set<Animated.CompositeAnimation>();
    const ambientLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(ambientPulse, {
          toValue: 1,
          duration: 7000,
          useNativeDriver: true,
        }),
        Animated.timing(ambientPulse, {
          toValue: 0,
          duration: 7000,
          useNativeDriver: true,
        }),
      ])
    );
    animations.add(ambientLoop);
    ambientLoop.start();

    bubbles.forEach((b) => {
      const runFloat = (fromBottom = false) => {
        if (!active) return;
        if (fromBottom) b.animY.setValue(height + 20);
        const floatLoop = Animated.parallel([
          Animated.timing(b.animY, {
            toValue: -50,
            duration: b.duration,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(b.animSway, {
              toValue: 14,
              duration: b.duration / 4,
              useNativeDriver: true,
            }),
            Animated.timing(b.animSway, {
              toValue: -14,
              duration: b.duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(b.animSway, {
              toValue: 0,
              duration: b.duration / 4,
              useNativeDriver: true,
            }),
          ]),
        ]);
        animations.add(floatLoop);
        floatLoop.start(({ finished }) => {
          animations.delete(floatLoop);
          if (finished && active) runFloat(true);
        });
      };

      timers.push(setTimeout(() => runFloat(), b.delay));
    });

    return () => {
      active = false;
      timers.forEach(clearTimeout);
      animations.forEach((animation) => animation.stop());
    };
  }, [ambientPulse, bubbles]);

  const ambientScale = ambientPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.98, 1.06],
  });
  const washOpacity = ambientPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.28, 0.45],
  });
  const ambientDriftX = ambientPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [-8, 8],
  });
  const ambientDriftY = ambientPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [6, -6],
  });
  const reverseDriftX = ambientPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [8, -8],
  });
  const reverseDriftY = ambientPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [-6, 6],
  });

  return (
    <View style={styles.container}>
      <BlurTargetView
        ref={backdropTarget}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      >
        {Platform.OS === 'android' ? (
          <>
            <Animated.View
              style={[
                styles.softOrb,
                styles.orbPink1,
                quiet && styles.quietOrb,
                { backgroundColor: 'transparent' },
                {
                  transform: [
                    { translateX: ambientDriftX },
                    { translateY: ambientDriftY },
                    { scale: ambientScale },
                  ],
                },
              ]}
            >
              {ORB_LAYERS.map((layer) => (
                <View
                  key={layer.scale}
                  style={[
                    styles.softOrbLayer,
                    {
                      backgroundColor: '#FFCCD5',
                      opacity: layer.opacity,
                      transform: [{ scale: layer.scale }],
                    },
                  ]}
                />
              ))}
            </Animated.View>
            <Animated.View
              style={[
                styles.softOrb,
                styles.orbPink2,
                quiet && styles.quietOrb,
                { backgroundColor: 'transparent' },
                {
                  transform: [
                    { translateX: reverseDriftX },
                    { translateY: reverseDriftY },
                    { scale: ambientScale },
                  ],
                },
              ]}
            >
              {ORB_LAYERS.map((layer) => (
                <View
                  key={layer.scale}
                  style={[
                    styles.softOrbLayer,
                    {
                      backgroundColor: '#F1DDE3',
                      opacity: layer.opacity,
                      transform: [{ scale: layer.scale }],
                    },
                  ]}
                />
              ))}
            </Animated.View>
            <View style={[styles.softOrb, styles.orbWhiteCenter]}>
              {ORB_LAYERS.map((layer) => (
                <View
                  key={layer.scale}
                  style={[
                    styles.softOrbLayer,
                    {
                      backgroundColor: '#FFFFFF',
                      opacity: layer.opacity,
                      transform: [{ scale: layer.scale }],
                    },
                  ]}
                />
              ))}
            </View>
          </>
        ) : (
          <>
            <Animated.View
              style={[
                styles.ambientOrb,
                styles.orbPink1,
                quiet && styles.quietOrb,
                { opacity: washOpacity },
                {
                  transform: [
                    { translateX: ambientDriftX },
                    { translateY: ambientDriftY },
                    { scale: ambientScale },
                  ],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.ambientOrb,
                styles.orbPink2,
                quiet && styles.quietOrb,
                { opacity: washOpacity },
                {
                  transform: [
                    { translateX: reverseDriftX },
                    { translateY: reverseDriftY },
                    { scale: ambientScale },
                  ],
                },
              ]}
            />
            <View style={[styles.ambientOrb, styles.orbWhiteCenter]} />
          </>
        )}
      </BlurTargetView>

      {Platform.OS !== 'web' && (
        <BlurView
          blurTarget={backdropTarget}
          intensity={quiet ? 10 : 16}
          blurMethod={Platform.OS === 'android' ? 'dimezisBlurViewSdk31Plus' : undefined}
          pointerEvents="none"
          style={StyleSheet.absoluteFill}
        />
      )}
      {Platform.OS === 'web' && (
        <BlurView
          intensity={quiet ? 8 : 12}
          pointerEvents="none"
          style={StyleSheet.absoluteFill}
        />
      )}

      <View style={styles.bubbleLayer} pointerEvents="none">
        {bubbles.map((b) => (
          <Animated.View
            key={b.id}
            style={[
              b.isSparkle ? styles.twinkleDot : styles.bubbleOrb,
              {
                left: b.startX,
                width: b.size,
                height: b.size,
                borderRadius: b.size / 2,
                opacity: b.animOpacity,
                transform: [
                  { translateY: b.animY },
                  { translateX: b.animSway },
                  ...(b.isSparkle ? [{ rotate: '45deg' }] : []),
                ],
              },
            ]}
          >
            {!b.isSparkle && <View style={styles.bubbleHighlight} />}
          </Animated.View>
        ))}
      </View>

      {/* Foreground Screen Content */}
      <View style={styles.contentLayer}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
    position: 'relative',
    overflow: 'hidden',
  },
  ambientOrb: {
    position: 'absolute',
    borderRadius: 300,
  },
  softOrb: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  softOrbLayer: {
    ...StyleSheet.absoluteFill,
    borderRadius: 300,
  },
  orbPink1: {
    top: -60,
    left: -40,
    width: 280,
    height: 280,
    backgroundColor: '#FFCCD5',
    opacity: 0.42,
  },
  orbPink2: {
    bottom: -60,
    right: -40,
    width: 320,
    height: 320,
    backgroundColor: '#F1DDE3',
    opacity: 0.35,
  },
  quietOrb: {
    opacity: 0.55,
  },
  orbWhiteCenter: {
    top: '30%',
    left: '15%',
    width: 260,
    height: 260,
    backgroundColor: '#FFFFFF',
    opacity: 0.5,
  },
  bubbleLayer: {
    ...StyleSheet.absoluteFill,
    zIndex: 1,
  },
  bubbleOrb: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.38)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.82)',
    shadowColor: '#FF9DB2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 5,
    elevation: 2,
  },
  bubbleHighlight: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  twinkleDot: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#FF758F',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  contentLayer: {
    flex: 1,
    zIndex: 2,
  },
});

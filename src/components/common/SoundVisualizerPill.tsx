import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
} from 'react-native';
import { useAudio } from '../../context/AudioContext';
import { THEME } from '../../constants/colors';

interface SoundVisualizerPillProps {
  style?: ViewStyle;
  compact?: boolean;
}

export const SoundVisualizerPill: React.FC<SoundVisualizerPillProps> = ({
  style,
  compact = false,
}) => {
  const { isMusicEnabled, toggleMusic } = useAudio();

  // Equalizer wave bar heights
  const bar1 = useRef(new Animated.Value(4)).current;
  const bar2 = useRef(new Animated.Value(10)).current;
  const bar3 = useRef(new Animated.Value(6)).current;

  useEffect(() => {
    let animLoop: Animated.CompositeAnimation | null = null;

    if (isMusicEnabled) {
      animLoop = Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(bar1, { toValue: 12, duration: 240, useNativeDriver: false }),
            Animated.timing(bar1, { toValue: 3, duration: 280, useNativeDriver: false }),
            Animated.timing(bar1, { toValue: 8, duration: 220, useNativeDriver: false }),
            Animated.timing(bar1, { toValue: 4, duration: 260, useNativeDriver: false }),
          ]),
          Animated.sequence([
            Animated.timing(bar2, { toValue: 4, duration: 200, useNativeDriver: false }),
            Animated.timing(bar2, { toValue: 14, duration: 290, useNativeDriver: false }),
            Animated.timing(bar2, { toValue: 5, duration: 250, useNativeDriver: false }),
            Animated.timing(bar2, { toValue: 10, duration: 260, useNativeDriver: false }),
          ]),
          Animated.sequence([
            Animated.timing(bar3, { toValue: 13, duration: 270, useNativeDriver: false }),
            Animated.timing(bar3, { toValue: 4, duration: 220, useNativeDriver: false }),
            Animated.timing(bar3, { toValue: 11, duration: 260, useNativeDriver: false }),
            Animated.timing(bar3, { toValue: 6, duration: 250, useNativeDriver: false }),
          ]),
        ])
      );
      animLoop.start();
    } else {
      Animated.parallel([
        Animated.timing(bar1, { toValue: 3, duration: 150, useNativeDriver: false }),
        Animated.timing(bar2, { toValue: 3, duration: 150, useNativeDriver: false }),
        Animated.timing(bar3, { toValue: 3, duration: 150, useNativeDriver: false }),
      ]).start();
    }

    return () => {
      if (animLoop) animLoop.stop();
    };
  }, [isMusicEnabled]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={toggleMusic}
      style={[
        styles.container,
        isMusicEnabled ? styles.containerActive : styles.containerMuted,
        compact && styles.containerCompact,
        style,
      ]}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      {/* Equalizer Waveform Bars */}
      <View style={styles.eqWrapper}>
        <Animated.View
          style={[
            styles.bar,
            { height: bar1, backgroundColor: isMusicEnabled ? THEME.pink : '#B0B0B0' },
          ]}
        />
        <Animated.View
          style={[
            styles.bar,
            { height: bar2, backgroundColor: isMusicEnabled ? '#FF758F' : '#B0B0B0' },
          ]}
        />
        <Animated.View
          style={[
            styles.bar,
            { height: bar3, backgroundColor: isMusicEnabled ? THEME.pink : '#B0B0B0' },
          ]}
        />
      </View>

      {!compact && (
        <Text
          style={[
            styles.label,
            { color: isMusicEnabled ? THEME.pink : THEME.textMuted },
          ]}
        >
          {isMusicEnabled ? 'MUSIC' : 'MUTED'}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    borderBottomWidth: 3,
  },
  containerCompact: {
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  containerActive: {
    backgroundColor: '#FFF0F5',
    borderColor: '#FFCCD5',
    borderBottomColor: '#FFB3C1',
  },
  containerMuted: {
    backgroundColor: '#F5F5F7',
    borderColor: '#E5E5EA',
    borderBottomColor: '#D1D1D6',
  },
  eqWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2.5,
    height: 14,
    width: 14,
    justifyContent: 'center',
  },
  bar: {
    width: 3,
    borderRadius: 1.5,
  },
  label: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});

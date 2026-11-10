import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  Text,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { triggerHaptic } from '../../utils/haptics';

interface AvatarProps {
  avatar: string;
  color: string;
  size?: number;
  highlighted?: boolean;
  crown?: boolean;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  avatar,
  color,
  size = 52,
  highlighted = false,
  crown = false,
  style,
}) => {
  const fontSize = Math.floor(size * 0.52);
  const radius = Math.floor(size * 0.35); // Cute chubby squircle
  const earHeight = size * 0.22;
  const earWiggle = useRef(new Animated.Value(0)).current;

  const wiggleEars = () => {
    triggerHaptic('light');
    Animated.sequence([
      Animated.timing(earWiggle, {
        toValue: 1,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.timing(earWiggle, {
        toValue: -1,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(earWiggle, {
        toValue: 0,
        speed: 18,
        bounciness: 7,
        useNativeDriver: true,
      }),
    ]).start();
  };
  const leftEarRotation = earWiggle.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-25deg', '-12deg', '2deg'],
  });
  const rightEarRotation = earWiggle.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-2deg', '12deg', '25deg'],
  });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Tap to wiggle the cat ears"
      onPress={wiggleEars}
      style={[styles.wrap, { width: size, height: size + earHeight }, style]}
      hitSlop={4}
    >
      {crown && (
        <View
          style={[
            styles.crownBadge,
            { top: earHeight - size * 0.22 },
          ]}
        >
          <Text style={styles.crownText}>#1</Text>
        </View>
      )}

      <Animated.View
        pointerEvents="none"
        style={[
          styles.ear,
          styles.leftEar,
          {
            top: earHeight,
            borderLeftWidth: size * 0.11,
            borderRightWidth: size * 0.11,
            borderBottomWidth: earHeight,
            borderBottomColor: color,
            left: size * 0.2,
            transform: [{ rotate: leftEarRotation }],
          },
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.ear,
          styles.rightEar,
          {
            top: earHeight,
            borderLeftWidth: size * 0.11,
            borderRightWidth: size * 0.11,
            borderBottomWidth: earHeight,
            borderBottomColor: color,
            right: size * 0.2,
            transform: [{ rotate: rightEarRotation }],
          },
        ]}
      />
      <View
        style={[
          styles.container,
          {
            width: size,
            height: size,
            borderRadius: radius,
            backgroundColor: color + '25',
            borderColor: highlighted ? '#FFF' : color,
            borderWidth: highlighted ? 3 : 2,
            borderBottomWidth: highlighted ? 5 : 3,
            borderBottomColor: highlighted ? color : color + 'CC',
            zIndex: 1,
          },
        ]}
      >
        <Text style={{ fontSize }}>{avatar}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crownBadge: {
    position: 'absolute',
    zIndex: 10,
    alignSelf: 'center',
    minWidth: 24,
    paddingHorizontal: 5,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFF7F8',
    borderWidth: 1,
    borderColor: '#E8C6CF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crownText: { fontSize: 9, fontWeight: '800', color: '#A46674' },
  ear: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  leftEar: {
    zIndex: 0,
  },
  rightEar: {
    zIndex: 0,
  },
});

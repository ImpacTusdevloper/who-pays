import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import type { ComponentRef, RefObject } from 'react';

interface BlurredResultBackdropProps {
  target: RefObject<ComponentRef<typeof View> | null>;
  tone?: 'light' | 'dark';
}

export const BlurredResultBackdrop: React.FC<BlurredResultBackdropProps> = ({
  target,
  tone = 'light',
}) => (
  <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    <BlurView
      blurTarget={target}
      intensity={32}
      tint={tone}
      blurMethod={Platform.OS === 'android' ? 'dimezisBlurViewSdk31Plus' : undefined}
      style={StyleSheet.absoluteFill}
    />
    <View style={[styles.tint, tone === 'dark' && styles.darkTint]} />
  </View>
);

const styles = StyleSheet.create({
  tint: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 246, 248, 0.56)',
  },
  darkTint: {
    backgroundColor: 'rgba(8, 12, 20, 0.76)',
  },
});

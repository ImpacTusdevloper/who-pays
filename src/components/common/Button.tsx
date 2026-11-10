import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { THEME } from '../../constants/colors';
import { triggerHaptic } from '../../utils/haptics';

export type ButtonColor =
  | 'pink'
  | 'yellow'
  | 'mint'
  | 'cyan'
  | 'purple'
  | 'ghost'
  | 'coral'
  | 'lime';

interface ButtonProps {
  title: string;
  onPress: () => void;
  color?: ButtonColor;
  variant?: ButtonColor;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  color,
  variant,
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}) => {
  const activeColor = color || variant || 'pink';

  const getColorConfig = () => {
    switch (activeColor) {
      case 'yellow':
        return { bg: THEME.yellow, shadow: THEME.yellowShadow, text: THEME.textDark };
      case 'mint':
      case 'lime':
        return { bg: THEME.mint, shadow: THEME.mintShadow, text: THEME.textDark };
      case 'cyan':
        return { bg: THEME.cyan, shadow: THEME.cyanShadow, text: THEME.textDark };
      case 'purple':
        return { bg: '#FF758F', shadow: '#D6336C', text: '#FFF' };
      case 'coral':
        return { bg: THEME.coral, shadow: THEME.coralShadow, text: '#FFF' };
      case 'ghost':
        return { bg: '#FFFFFF', shadow: '#FFCCD5', text: THEME.pink };
      case 'pink':
      default:
        return { bg: THEME.pink, shadow: THEME.pinkShadow, text: '#FFF' };
    }
  };

  const getSizeConfig = () => {
    switch (size) {
      case 'sm':
        return {
          container: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 14 },
          text: { fontSize: 13, fontWeight: '900' as const, letterSpacing: 0.5 },
          shadowDepth: 3,
        };
      case 'xl':
        return {
          container: { paddingVertical: 20, paddingHorizontal: 28, borderRadius: 24 },
          text: { fontSize: 20, fontWeight: '900' as const, letterSpacing: 0.8 },
          shadowDepth: 6,
        };
      case 'lg':
        return {
          container: { paddingVertical: 16, paddingHorizontal: 24, borderRadius: 20 },
          text: { fontSize: 17, fontWeight: '900' as const, letterSpacing: 0.6 },
          shadowDepth: 5,
        };
      case 'md':
      default:
        return {
          container: { paddingVertical: 13, paddingHorizontal: 20, borderRadius: 16 },
          text: { fontSize: 15, fontWeight: '900' as const, letterSpacing: 0.5 },
          shadowDepth: 4,
        };
    }
  };

  const conf = getColorConfig();
  const sz = getSizeConfig();

  return (
    <Pressable
      onPress={() => {
        if (disabled || loading) return;
        triggerHaptic('medium');
        onPress();
      }}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      accessibilityLabel={title}
      style={({ pressed }) => [
        styles.base,
        sz.container,
        {
          backgroundColor: conf.bg,
          borderBottomWidth: sz.shadowDepth,
          borderBottomColor: conf.shadow,
          opacity: pressed ? 0.82 : 1,
        },
        disabled && styles.disabled,
        style,
      ]}
    >
      {size !== 'sm' && (
        <>
          <PawPrint color={conf.text} style={styles.leftPaw} />
          <PawPrint color={conf.text} style={styles.rightPaw} />
        </>
      )}
      {loading ? (
        <ActivityIndicator color={conf.text} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {icon ? <Text style={styles.icon}>{icon}</Text> : null}
          <Text
            style={[
              sz.text,
              { color: conf.text },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

const PawPrint: React.FC<{ color: string; style: ViewStyle }> = ({
  color,
  style,
}) => (
  <View pointerEvents="none" style={[styles.pawPrint, style]}>
    <View style={[styles.toe, styles.topToe, { backgroundColor: color }]} />
    <View style={[styles.toe, styles.leftToe, { backgroundColor: color }]} />
    <View style={[styles.toe, styles.rightToe, { backgroundColor: color }]} />
    <View style={[styles.pawPad, { backgroundColor: color }]} />
  </View>
);

const styles = StyleSheet.create({
  base: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 18,
  },
  pawPrint: {
    position: 'absolute',
    width: 18,
    height: 18,
    opacity: 0.2,
  },
  leftPaw: {
    left: 16,
    transform: [{ rotate: '-22deg' }],
  },
  rightPaw: {
    right: 16,
    transform: [{ rotate: '22deg' }],
  },
  toe: {
    position: 'absolute',
    width: 5,
    height: 6,
    borderRadius: 3,
  },
  topToe: {
    top: 0,
    left: 7,
  },
  leftToe: {
    top: 3,
    left: 1,
  },
  rightToe: {
    top: 3,
    right: 1,
  },
  pawPad: {
    position: 'absolute',
    bottom: 1,
    left: 4,
    width: 10,
    height: 8,
    borderRadius: 6,
  },
  disabled: {
    opacity: 0.4,
  },
});

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Rect,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  G,
} from 'react-native-svg';

interface BottleGraphicProps {
  size?: number;
  isSpinning?: boolean;
}

export const BottleGraphic: React.FC<BottleGraphicProps> = ({
  size = 220,
}) => {
  const width = size * 0.45;
  const height = size;

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} viewBox="0 0 100 240">
        <Defs>
          {/* Strawberry Milk Cream Body Gradient */}
          <LinearGradient id="bottleBody" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="30%" stopColor="#FFF0F5" />
            <Stop offset="70%" stopColor="#FFE4EC" />
            <Stop offset="100%" stopColor="#FFCCD5" />
          </LinearGradient>

          {/* Neck gradient */}
          <LinearGradient id="bottleNeck" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="50%" stopColor="#FFE4EC" />
            <Stop offset="100%" stopColor="#FFCCD5" />
          </LinearGradient>

          {/* Cap Strawberry Pink Gradient */}
          <LinearGradient id="capGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#FF758F" />
            <Stop offset="50%" stopColor="#FF4D6D" />
            <Stop offset="100%" stopColor="#C9184A" />
          </LinearGradient>

          {/* Label Gradient - Cute Hot Strawberry */}
          <LinearGradient id="labelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FF4D6D" />
            <Stop offset="100%" stopColor="#FF758F" />
          </LinearGradient>

          {/* Pointer Glow - Strawberry Pink */}
          <LinearGradient id="pointerGlow" x1="0%" y1="100%" x2="0%" y2="0%">
            <Stop offset="0%" stopColor="#FF4D6D" stopOpacity="0" />
            <Stop offset="100%" stopColor="#FF4D6D" stopOpacity="1" />
          </LinearGradient>
        </Defs>

        <G>
          {/* Pointer indicator at top of bottle neck */}
          <Path
            d="M 50 1 L 58 15 L 42 15 Z"
            fill="url(#pointerGlow)"
          />
          <Circle cx="50" cy="4" r="3.5" fill="#FF4D6D" />

          {/* Cute Strawberry Bottle Cap */}
          <Rect
            x="42"
            y="14"
            width="16"
            height="14"
            rx="4"
            fill="url(#capGradient)"
            stroke="#C9184A"
            strokeWidth="1"
          />

          {/* Bottle Body - Strawberry Milk Glass */}
          <Path
            d="M 44 28 L 56 28 L 58 75 C 58 85, 75 105, 80 120 L 80 215 C 80 225, 72 232, 60 232 L 40 232 C 28 232, 20 225, 20 215 L 20 120 C 25 105, 42 85, 42 75 Z"
            fill="url(#bottleBody)"
            stroke="#FFB3C1"
            strokeWidth="2.5"
          />

          {/* Gloss Highlights */}
          <Path
            d="M 28 125 L 28 215 C 28 220, 32 224, 38 224"
            stroke="rgba(255, 255, 255, 0.9)"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          <Path
            d="M 47 34 L 47 70"
            stroke="rgba(255, 255, 255, 0.9)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Cute Center Label */}
          <Rect
            x="24"
            y="135"
            width="52"
            height="50"
            rx="12"
            fill="url(#labelGrad)"
            stroke="#FFFFFF"
            strokeWidth="2"
          />

          {/* Cute Cartoon Face on the Bottle */}
          {/* Mochi's pointed ears and face */}
          <Path
            d="M33 159 31 146l11 6a20 20 0 0 1 16 0l11-6-2 13c-1 9-7 14-17 14s-16-5-17-14Z"
            fill="#FFFFFF"
          />
          <Circle cx="42" cy="158" r="2" fill="#2D161F" />
          <Circle cx="58" cy="158" r="2" fill="#2D161F" />
          <Circle cx="36" cy="164" r="2.5" fill="#FFE5EC" />
          <Circle cx="64" cy="164" r="2.5" fill="#FFE5EC" />
          <Path
            d="M 47 164 Q 50 168 53 164 M 39 163 L 33 161 M 39 167 L 33 168 M 61 163 L 67 161 M 61 167 L 67 168"
            stroke="#805B61"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Bottle Bottom indent */}
          <Path
            d="M 35 232 Q 50 224 65 232"
            stroke="#FFB3C1"
            strokeWidth="2"
            fill="none"
          />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

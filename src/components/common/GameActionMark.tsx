import React from 'react';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

export type GameAction = 'spin' | 'pass' | 'tap';

interface GameActionMarkProps {
  action: GameAction;
  size?: number;
}

const INK = '#805B61';
const PINK = '#FF758F';
const PALE_PINK = '#FFE4EC';
const CREAM = '#FFFDFC';

const CatFace: React.FC<{ x: number; y: number; scale?: number }> = ({
  x,
  y,
  scale = 1,
}) => (
  <G transform={`translate(${x} ${y}) scale(${scale})`}>
    <Path
      d="M8 24 5 4l20 12q10-4 20 0L65 4l-3 20q8 9 5 21c-3 11-14 17-32 17S6 56 3 45q-3-12 5-21Z"
      fill={CREAM}
      stroke={INK}
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <Path
      d="M9 8Q15 12 21 16Q15 16 11 20Q10 14 9 8ZM61 8Q55 12 49 16Q55 16 59 20Q60 14 61 8Z"
      fill={PALE_PINK}
    />
    <Circle cx="25" cy="34" r="2.4" fill={INK} />
    <Circle cx="49" cy="34" r="2.4" fill={INK} />
    <Path
      d="m34 42 3-2 3 2-3 3-3-3Zm3 3c0 3-2 4-5 5m5-5c0 3 2 4 5 5M21 43l-9-2m9 6-10 2m42-6 9-2m-9 8 10 2"
      fill="none"
      stroke={INK}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </G>
);

export const GameActionMark: React.FC<GameActionMarkProps> = ({
  action,
  size = 64,
}) => (
  <Svg width={size} height={size * 0.82} viewBox="0 0 120 100">
    {action === 'spin' ? (
      <>
        <Path
          d="M8 69c5 15 20 24 37 22m-6-7 7 8-9 4M112 30c-5-15-20-24-37-22m6 7-7-8 9-4"
          fill="none"
          stroke={PINK}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <CatFace x={4} y={16} scale={0.76} />
        <G transform="translate(78 20) rotate(24 18 34)">
          <Path
            d="M12 12h16l2 13 9 13v37c0 6-4 10-10 10H13C7 85 3 81 3 75V38l8-13Z"
            fill={PALE_PINK}
            stroke={INK}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <Rect x="12" y="6" width="16" height="10" rx="3" fill={PINK} stroke={INK} strokeWidth="2.5" />
          <Rect x="8" y="43" width="27" height="23" rx="7" fill={PINK} />
          <Path d="M18 53c-4-3-1-7 2-4 3-3 6 1 2 4l-2 2-2-2Z" fill="#FFFFFF" />
        </G>
        <Path d="M53 72c8 2 13 4 17 9" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      </>
    ) : action === 'pass' ? (
      <>
        <Path
          d="M12 19c8-11 21-15 33-11m-7-5 8 5-7 6M108 81c-8 11-21 15-33 11m7 3-8-5 7-6"
          fill="none"
          stroke={PINK}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <CatFace x={28} y={2} scale={0.9} />
        <Path
          d="M27 81c7-12 15-17 25-17m41 17C86 69 78 64 68 64"
          fill="none"
          stroke={INK}
          strokeWidth="6"
          strokeLinecap="round"
        />
        <Circle cx="60" cy="71" r="17" fill={PINK} stroke={INK} strokeWidth="3" />
        <Path
          d="M53 72c-4-4-1-9 3-6 4-3 7 2 3 6l-3 3-3-3Zm-8-12-3-5m40 5 3-5m-28 36-2 5m19-5 2 5"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ) : (
      <>
        <Path
          d="M7 25h18m-13 9h11m57-22h20m-16 9h13"
          fill="none"
          stroke={PINK}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <G transform="translate(19 13) rotate(-8 33 37)">
          <Path
            d="M9 29 5 8l20 9q10-4 20 0l20-9-4 21q7 8 5 20c-4 12-14 17-31 17S8 61 4 49q-2-12 5-20Z"
            fill={CREAM}
            stroke={INK}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <Path
            d="M10 13Q16 16 22 19Q17 20 12 25Q11 19 10 13ZM60 13Q54 16 48 19Q53 20 58 25Q59 19 60 13Z"
            fill={PALE_PINK}
          />
          <Path d="M21 41c3-4 7-4 10 0m8 0c3-4 7-4 10 0M30 50c4 4 8 4 12 0" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
          <Path d="M9 62c-6 8-10 13-15 17m65-16c6 6 11 9 18 11" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        </G>
        <Ellipse cx="91" cy="72" rx="22" ry="17" fill={PALE_PINK} stroke={INK} strokeWidth="3" />
        <Path
          d="M81 68c-3-4-1-8 3-8 3 0 4 3 4 6 0-3 1-6 4-6s5 4 2 8c5 3 5 8 0 9H81c-5-1-5-6 0-9Z"
          fill={PINK}
          stroke={INK}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <Path d="M75 48v-7m8 8-2-7m19 5 4-6" fill="none" stroke={PINK} strokeWidth="3" strokeLinecap="round" />
      </>
    )}
  </Svg>
);

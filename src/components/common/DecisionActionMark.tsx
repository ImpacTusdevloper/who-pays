import React from 'react';
import Svg, { Circle, Ellipse, G, Path, Rect, Text as SvgText } from 'react-native-svg';

export type DecisionAction = 'bill' | 'dishes' | 'drinks';

interface DecisionActionMarkProps {
  action: DecisionAction;
  size?: number;
}

const INK = '#805B61';
const PINK = '#FF758F';
const PALE_PINK = '#FFE4EC';
const CREAM = '#FFFDFC';

const CatHead: React.FC<{ x: number; y: number; scale?: number }> = ({
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

export const DecisionActionMark: React.FC<DecisionActionMarkProps> = ({
  action,
  size = 48,
}) => (
  <Svg width={size} height={size * 0.82} viewBox="0 0 120 100">
    {action === 'bill' ? (
      <>
        <CatHead x={7} y={17} scale={0.75} />
        <Path d="M40 67c9-11 18-14 29-8" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <G transform="translate(67 22) rotate(8 20 30)">
          <Rect x="2" y="3" width="38" height="57" rx="5" fill="#FFFFFF" stroke={INK} strokeWidth="3" />
          <Path d="M10 15h22M10 23h18M10 43h10" stroke={PINK} strokeWidth="3" strokeLinecap="round" />
          <Circle cx="25" cy="43" r="8" fill={PALE_PINK} stroke={INK} strokeWidth="2" />
          <SvgText x="25" y="47" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>$</SvgText>
        </G>
        <Path d="M55 73c6 0 10 4 15 8" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      </>
    ) : action === 'dishes' ? (
      <>
        <Path d="M15 22c8-11 22-15 35-10m-7-5 8 5-7 7" fill="none" stroke={PINK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <CatHead x={25} y={8} scale={0.83} />
        <Ellipse cx="70" cy="73" rx="36" ry="15" fill="#FFFFFF" stroke={INK} strokeWidth="3" />
        <Ellipse cx="70" cy="70" rx="21" ry="7" fill={PALE_PINK} stroke={PINK} strokeWidth="2" />
        <Path d="M69 56c-5-7 2-10 0-16m10 17c-4-7 3-10 1-16m-45 30c2-9 8-13 16-14" fill="none" stroke={PINK} strokeWidth="3" strokeLinecap="round" />
        <Path d="m40 47 4-5m3 8 5-4m-1 8 6-2" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      </>
    ) : (
      <>
        <CatHead x={25} y={5} scale={0.8} />
        <Path d="M13 68c12-12 22-15 34-13m46 13C81 56 70 54 59 56" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <Path d="M26 66h65l-8 9H34Z" fill={PINK} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <Path d="M41 63V43h13v20m12 0V37h14v26" fill="#FFFFFF" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <Path d="M43 52h9m14-5h10" stroke={PINK} strokeWidth="3" strokeLinecap="round" />
        <Path d="M47 36v-5m22-1v-5" stroke={PINK} strokeWidth="3" strokeLinecap="round" />
      </>
    )}
  </Svg>
);

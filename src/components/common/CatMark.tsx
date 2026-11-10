import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface CatMarkProps {
  size?: number;
  fill?: string;
  stroke?: string;
  accent?: string;
  expression?: 'neutral' | 'happy' | 'wink' | 'surprised' | 'love' | 'sleepy';
}

export const CatMark: React.FC<CatMarkProps> = ({
  size = 72,
  fill = '#FFFDFC',
  stroke = '#805B61',
  accent = '#E7A2B0',
  expression = 'neutral',
}) => (
  <Svg width={size} height={size * 0.9} viewBox="0 0 100 90">
    <Path
      d="M18 34 13 9l23 15a39 39 0 0 1 28 0L87 9l-5 25c7 9 10 20 7 31-4 15-18 23-39 23S15 80 11 65c-3-11 0-22 7-31Z"
      fill={fill}
      stroke={stroke}
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <Path
      d="M18 15Q24 19 31 24Q25 23 21 29Q19 22 18 15ZM82 15Q76 19 69 24Q75 23 79 29Q81 22 82 15Z"
      fill={accent}
    />
    {expression === 'happy' || expression === 'sleepy' ? (
      <>
        <Path
          d="M31 50c2-5 8-5 10 0m18 0c2-5 8-5 10 0"
          fill="none"
          stroke={stroke}
          strokeWidth="3"
          strokeLinecap="round"
        />
        {expression === 'happy' ? (
          <Path
            d="m45 57 5-3 5 3c-1 5-3 7-5 7s-4-2-5-7Zm5 7c0 4-3 5-6 5m6-5c0 4 3 5 6 5"
            fill="none"
            stroke={stroke}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <Path
            d="M48 60c2 2 4 2 6 0"
            fill="none"
            stroke={stroke}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        )}
      </>
    ) : expression === 'wink' ? (
      <>
        <Path
          d="M31 50c2-5 8-5 10 0"
          fill="none"
          stroke={stroke}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <Circle cx="64" cy="49" r="2.8" fill={stroke} />
        <Path
          d="m46 58 4-3 4 3-4 4-4-4Zm4 4c0 4-3 6-7 6m7-6c0 4 3 6 7 6"
          fill="none"
          stroke={stroke}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ) : expression === 'surprised' ? (
      <>
        <Circle cx="36" cy="49" r="3.3" fill={stroke} />
        <Circle cx="64" cy="49" r="3.3" fill={stroke} />
        <Circle cx="50" cy="62" r="4" fill="none" stroke={stroke} strokeWidth="2.2" />
      </>
    ) : expression === 'love' ? (
      <>
        <Path
          d="M36 53c-7-5-2-12 3-7 5-5 10 2 3 7l-3 3-3-3Zm24 0c-7-5-2-12 3-7 5-5 10 2 3 7l-3 3-3-3Z"
          fill={accent}
          stroke={stroke}
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <Path
          d="m46 60 4-3 4 3-4 4-4-4Zm4 4c0 4-3 5-6 5m6-5c0 4 3 5 6 5"
          fill="none"
          stroke={stroke}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ) : (
      <>
        <Circle cx="36" cy="49" r="2.8" fill={stroke} />
        <Circle cx="64" cy="49" r="2.8" fill={stroke} />
        <Path
          d="m46 58 4-3 4 3-4 4-4-4Zm4 4c0 4-3 6-7 6m7-6c0 4 3 6 7 6"
          fill="none"
          stroke={stroke}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    )}
    <Path
      d="M34 59l-12-2m12 6-13 2m45-6 12-2m-12 8 13 2"
      fill="none"
      stroke={stroke}
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </Svg>
);

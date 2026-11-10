import { useRef, useState, useEffect, useCallback } from 'react';
import { Animated, Easing } from 'react-native';
import { Player } from '../../types';
import { triggerHaptic } from '../../utils/haptics';

interface UseBottlePhysicsProps {
  players: Player[];
  onSpinEnd: (winner: Player) => void;
}

export const useBottlePhysics = ({ players, onSpinEnd }: UseBottlePhysicsProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [activePlayerIndex, setActivePlayerIndex] = useState<number | null>(null);

  const spinAnim = useRef(new Animated.Value(0)).current;
  const currentRotationRef = useRef<number>(0);
  const lastTickPlayerRef = useRef<number | null>(null);

  const playerCount = players.length;

  // Calculate which player index is pointed at by the bottle at degree `deg`
  const getPlayerIndexForAngle = useCallback(
    (deg: number): number => {
      if (playerCount === 0) return 0;
      const sliceAngle = 360 / playerCount;
      const normalizedDeg = ((deg % 360) + 360) % 360;
      // Bottle points to player 0 at 0 deg, with slice spanning [-sliceAngle/2, sliceAngle/2]
      const shifted = (normalizedDeg + sliceAngle / 2) % 360;
      const index = Math.floor(shifted / sliceAngle);
      return index % playerCount;
    },
    [playerCount]
  );

  useEffect(() => {
    const listenerId = spinAnim.addListener(({ value }) => {
      currentRotationRef.current = value;
      const currentIndex = getPlayerIndexForAngle(value);

      if (currentIndex !== lastTickPlayerRef.current) {
        lastTickPlayerRef.current = currentIndex;
        setActivePlayerIndex(currentIndex);
        // Haptic tick when passing each player
        triggerHaptic('light');
      }
    });

    return () => {
      spinAnim.removeListener(listenerId);
    };
  }, [spinAnim, getPlayerIndexForAngle]);

  const spinBottle = useCallback(
    (intensityMultiplier = 1) => {
      if (isSpinning || playerCount < 2) return;

      setIsSpinning(true);
      triggerHaptic('heavy');

      // Randomly pick winning player with fair probability
      const targetPlayerIndex = Math.floor(Math.random() * playerCount);
      const sliceAngle = 360 / playerCount;
      // Target angle for targetPlayerIndex with slight jitter inside slice (-40% to +40% of half-slice)
      const jitter = (Math.random() - 0.5) * (sliceAngle * 0.7);
      const targetDegInCircle = targetPlayerIndex * sliceAngle + jitter;

      // Current degree modulo 360
      const currentDegMod = currentRotationRef.current % 360;
      let diffDeg = targetDegInCircle - currentDegMod;
      if (diffDeg < 0) {
        diffDeg += 360;
      }

      // Add 5 to 8 full revolutions for excitement
      const fullRotations = (5 + Math.floor(Math.random() * 4)) * 360;
      const totalNewRotation = currentRotationRef.current + fullRotations + diffDeg;

      const duration = Math.floor(3800 + Math.random() * 900) * Math.min(1.2, Math.max(0.8, intensityMultiplier));

      Animated.timing(spinAnim, {
        toValue: totalNewRotation,
        duration,
        easing: Easing.bezier(0.12, 0.8, 0.25, 1.0), // Smooth organic physics deceleration
        useNativeDriver: true,
      }).start(() => {
        setIsSpinning(false);
        const finalWinnerIndex = getPlayerIndexForAngle(totalNewRotation);
        const winner = players[finalWinnerIndex];

        triggerHaptic('success');
        if (winner) {
          onSpinEnd(winner);
        }
      });
    },
    [isSpinning, playerCount, spinAnim, players, getPlayerIndexForAngle, onSpinEnd]
  );

  return {
    spinAnim,
    isSpinning,
    activePlayerIndex,
    spinBottle,
  };
};

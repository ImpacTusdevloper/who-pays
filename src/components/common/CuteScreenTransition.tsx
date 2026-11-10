import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
  Platform,
} from 'react-native';
import type { ComponentRef } from 'react';
import { BlurTargetView, BlurView } from 'expo-blur';
import { triggerHaptic } from '../../utils/haptics';
import { useAudio } from '../../context/AudioContext';
import { CatMark } from './CatMark';
import { THEME } from '../../constants/colors';

const TRANSITION_EMOTES = [
  { expression: 'happy', tilt: -7 },
  { expression: 'wink', tilt: 6 },
  { expression: 'surprised', tilt: -4 },
  { expression: 'love', tilt: 8 },
  { expression: 'sleepy', tilt: -6 },
] as const;

interface CuteScreenTransitionProps {
  currentScreenId: string;
  children: React.ReactNode;
}

export const CuteScreenTransition: React.FC<CuteScreenTransitionProps> = ({
  currentScreenId,
  children,
}) => {
  const { playSfx } = useAudio();

  // Store the currently rendered screen id and its node
  const [renderedScreenId, setRenderedScreenId] = useState(currentScreenId);
  const [renderedChildren, setRenderedChildren] = useState(children);

  // Layout width
  const [containerWidth, setContainerWidth] = useState(
    Dimensions.get('window').width
  );

  // Door animation values: 0 = fully closed (meeting in center), 1 = fully open (offscreen)
  const doorAnim = useRef(new Animated.Value(1)).current; // starts open
  const sealAnim = useRef(new Animated.Value(0)).current; // starts hidden
  const blurAnim = useRef(new Animated.Value(0)).current;
  const previousEmoteIndex = useRef(-1);
  const [emoteIndex, setEmoteIndex] = useState(0);
  const screenTarget = useRef<ComponentRef<typeof View> | null>(null);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Tracking pending screen changes
  const targetScreenRef = useRef(currentScreenId);
  const targetChildrenRef = useRef(children);
  const isTransitioningRef = useRef(false);

  // Keep target children updated
  useEffect(() => {
    targetScreenRef.current = currentScreenId;
    targetChildrenRef.current = children;
  }, [currentScreenId, children]);

  useEffect(() => {
    // Close around Mochi, swap screens, then reveal the new scene.
    if (currentScreenId !== renderedScreenId && !isTransitioningRef.current) {
      let nextEmoteIndex = Math.floor(Math.random() * TRANSITION_EMOTES.length);
      if (TRANSITION_EMOTES.length > 1 && nextEmoteIndex === previousEmoteIndex.current) {
        nextEmoteIndex = (nextEmoteIndex + 1 + Math.floor(Math.random() * (TRANSITION_EMOTES.length - 1))) % TRANSITION_EMOTES.length;
      }
      previousEmoteIndex.current = nextEmoteIndex;
      setEmoteIndex(nextEmoteIndex);
      isTransitioningRef.current = true;
      setIsAnimating(true);

      // Give the scene change enough time to read without interrupting the flow.
      Animated.parallel([
        Animated.timing(doorAnim, {
          toValue: 0,
          duration: 340,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(sealAnim, {
          toValue: 1,
          speed: 16,
          bounciness: 5,
          useNativeDriver: true,
        }),
        Animated.timing(blurAnim, {
          toValue: 1,
          duration: 280,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (!finished) return;
        playSfx('door');
        triggerHaptic('medium');

        setRenderedScreenId(targetScreenRef.current);
        setRenderedChildren(targetChildrenRef.current);

        transitionTimer.current = setTimeout(() => {
          transitionTimer.current = null;
          Animated.parallel([
            Animated.timing(blurAnim, {
              toValue: 0,
              delay: 100,
              duration: 420,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(doorAnim, {
              toValue: 1,
              duration: 440,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(sealAnim, {
              toValue: 0,
              delay: 120,
              duration: 300,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
          ]).start(({ finished: revealFinished }) => {
            if (!revealFinished) return;
            triggerHaptic('light');
            isTransitioningRef.current = false;
            setIsAnimating(false);
          });
        }, 120);
      });
    } else if (!isTransitioningRef.current) {
      // Keep children updated if active screen is unchanged (e.g. state changes inside same screen)
      setRenderedChildren(children);
    }
  }, [currentScreenId, children, isAnimating]);

  useEffect(
    () => () => {
      if (transitionTimer.current) clearTimeout(transitionTimer.current);
      doorAnim.stopAnimation();
      sealAnim.stopAnimation();
      blurAnim.stopAnimation();
    },
    [doorAnim, sealAnim, blurAnim]
  );

  const panelTravel = containerWidth / 2 + 110;

  // Include the circular edge detail in the travel distance so it clears the viewport.
  const leftTranslateX = doorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -panelTravel],
  });

  const rightTranslateX = doorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, panelTravel],
  });

  // Center seal scale
  const sealScale = sealAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.72, 1],
  });
  const sealLift = sealAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 0],
  });
  const sealRotate = sealAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${TRANSITION_EMOTES[emoteIndex].tilt}deg`],
  });
  const emote = TRANSITION_EMOTES[emoteIndex];

  return (
    <View
      style={styles.container}
      onLayout={(e) => {
        const w = e.nativeEvent.layout.width;
        if (w > 0) setContainerWidth(w);
      }}
    >
      {/* Screen Content */}
      <BlurTargetView ref={screenTarget} collapsable={false} style={styles.screenLayer}>
        {renderedChildren}
      </BlurTargetView>

      <Animated.View
        pointerEvents="none"
        style={[styles.transitionBlurLayer, { opacity: blurAnim }]}
      >
        <BlurView
          blurTarget={screenTarget}
          intensity={24}
          tint="light"
          blurMethod={Platform.OS === 'android' ? 'dimezisBlurViewSdk31Plus' : undefined}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.transitionWash} />
      </Animated.View>

      {/* Cute Doors Overlay */}
      <View
        style={[
          styles.doorsOverlay,
          !isAnimating && styles.doorsPointerNone,
        ]}
        pointerEvents={isAnimating ? 'auto' : 'none'}
      >
        {/* Left Shutter / Door */}
        <Animated.View
          style={[
            styles.doorPanel,
            styles.leftDoor,
            {
              width: '51%',
              transform: [{ translateX: leftTranslateX }],
            },
          ]}
        >
          <View style={[styles.doorNotch, styles.leftDoorNotch]} />
          <View style={styles.leftDoorEdge} />
        </Animated.View>

        {/* Right Shutter / Door */}
        <Animated.View
          style={[
            styles.doorPanel,
            styles.rightDoor,
            {
              width: '51%',
              transform: [{ translateX: rightTranslateX }],
            },
          ]}
        >
          <View style={[styles.doorNotch, styles.rightDoorNotch]} />
          <View style={styles.rightDoorEdge} />
        </Animated.View>

        {/* The perforated seal reads like a stamp pressed into the closing card. */}
        <Animated.View
          style={[
            styles.centerSealContainer,
            {
              transform: [
                { translateY: sealLift },
                { rotate: sealRotate },
                { scale: sealScale },
              ],
              opacity: sealAnim,
            },
          ]}
        >
          <View style={styles.centerSealCircle}>
            <View style={styles.sealInner}>
              <CatMark size={68} expression={emote.expression} />
              <View style={styles.sealCaptionRule} />
              <Animated.Text style={styles.sealCaption}>MOCHI APPROVED</Animated.Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  screenLayer: {
    flex: 1,
  },
  doorsOverlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 9999,
    flexDirection: 'row',
  },
  doorsPointerNone: {
    opacity: 0,
  },
  transitionBlurLayer: {
    ...StyleSheet.absoluteFill,
    zIndex: 2,
  },
  transitionWash: {
    ...StyleSheet.absoluteFill,
    backgroundColor: THEME.bg,
  },
  doorPanel: {
    height: '100%',
    backgroundColor: '#F4F1F3',
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#9B6D76',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  leftDoor: {
    left: 0,
    borderRightWidth: 1,
    borderRightColor: '#DED9DE',
    backgroundColor: '#F4F1F3',
  },
  rightDoor: {
    right: 0,
    borderLeftWidth: 1,
    borderLeftColor: '#DED9DE',
    backgroundColor: '#F4F1F3',
  },
  leftDoorEdge: {
    position: 'absolute',
    right: 4,
    top: '20%',
    bottom: '20%',
    width: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(128, 91, 97, 0.12)',
  },
  rightDoorEdge: {
    position: 'absolute',
    left: 4,
    top: '20%',
    bottom: '20%',
    width: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(128, 91, 97, 0.12)',
  },
  doorNotch: {
    position: 'absolute',
    top: '50%',
    width: 180,
    height: 180,
    marginTop: -90,
    borderRadius: 90,
    borderWidth: 3,
    borderColor: '#E8DDE2',
    backgroundColor: '#F4EFF2',
    zIndex: 1,
  },
  leftDoorNotch: {
    right: -90,
  },
  rightDoorNotch: {
    left: -90,
  },
  centerSealContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -78,
    marginTop: -78,
    zIndex: 10000,
  },
  centerSealCircle: {
    width: 156,
    height: 156,
    borderRadius: 78,
    backgroundColor: '#FFE0E7',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#E7A2B0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#805B61',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  sealInner: {
    width: 136,
    height: 136,
    borderRadius: 68,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#FFF0F5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    gap: 3,
  },
  sealCaptionRule: {
    width: 30,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#E7A2B0',
  },
  sealCaption: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.6,
    color: '#805B61',
  },
});

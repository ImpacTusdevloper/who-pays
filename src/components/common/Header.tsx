import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { THEME } from '../../constants/colors';
import { useGame } from '../../context/GameContext';
import { triggerHaptic } from '../../utils/haptics';
import { SoundVisualizerPill } from './SoundVisualizerPill';
import { getPreviousScreen } from '../../utils/navigation';

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ showBack, onBack, title }) => {
  const { activeScreen, setActiveScreen, activeDecision } = useGame();

  if (activeScreen === 'start') {
    return null; // Title screen has its own full arcade layout
  }

  const getTitle = () => {
    if (title) return title;
    switch (activeScreen) {
      case 'decisions':
        return 'The stakes';
      case 'players':
        return 'Your people';
      case 'game-select':
        return 'Pick a game';
      case 'bottle-spin':
        return 'Mochi’s bottle spin';
      case 'hot-potato':
        return 'Mochi’s hot potato';
      case 'tap-race':
        return 'Mochi’s tap race';
      case 'history':
        return 'Past rounds';
      case 'how-to-play':
        return 'How it works';
      default:
        return 'Who pays?';
    }
  };
  const showTitle =
    !!title ||
    activeScreen === 'bottle-spin' ||
    activeScreen === 'hot-potato' ||
    activeScreen === 'tap-race';

  const handleBack = () => {
    triggerHaptic('light');
    if (onBack) {
      onBack();
      return;
    }

    setActiveScreen(getPreviousScreen(activeScreen));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={handleBack}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Text style={styles.backArrow}>‹</Text>
        <Text style={styles.backLabel}>Back</Text>
      </TouchableOpacity>

      {showTitle ? (
        <Text style={styles.title} numberOfLines={1}>
          {getTitle()}
        </Text>
      ) : (
        <View style={styles.arcadeBadge}>
          <View style={styles.arcadeDot} />
          <Text style={styles.arcadeBadgeText} numberOfLines={1}>
            MOCHI’S ARCADE
          </Text>
        </View>
      )}

      <View style={styles.rightGroup}>
        <SoundVisualizerPill compact />
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => {
            triggerHaptic('light');
            setActiveScreen('start');
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.homeLabel}>Menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 8,
    paddingHorizontal: 10,
    paddingTop: 7,
    paddingBottom: 7,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FFCCD5',
    borderBottomWidth: 3,
    borderBottomColor: '#F3DDE3',
    borderRadius: 18,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#FFF0F5',
    borderWidth: 1.5,
    borderColor: '#FFCCD5',
    borderBottomWidth: 2,
    borderBottomColor: '#EFB5C2',
  },
  backArrow: {
    fontSize: 18,
    color: THEME.pink,
    fontWeight: '600',
    marginTop: -2,
  },
  backLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: THEME.text,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '900',
    color: THEME.text,
    letterSpacing: 0.2,
    paddingHorizontal: 6,
  },
  arcadeBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 4,
  },
  arcadeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: THEME.pink,
  },
  arcadeBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: THEME.text,
    letterSpacing: 0.8,
  },
  homeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#FFF0F5',
    borderWidth: 1.5,
    borderColor: '#FFCCD5',
    borderBottomWidth: 2,
    borderBottomColor: '#EFB5C2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.pink,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { THEME } from '../constants/colors';
import { useGame } from '../context/GameContext';
import { usePlayers } from '../context/PlayerContext';
import { triggerHaptic } from '../utils/haptics';
import { CatMark } from '../components/common/CatMark';
import { GameActionMark, GameAction } from '../components/common/GameActionMark';

interface ArcadeGame {
  id: 'bottle-spin' | 'hot-potato' | 'tap-race';
  title: string;
  action: GameAction;
  tagline: string;
  description: string;
  duration: string;
  accent: string;
}

const ARCADE_GAMES: ArcadeGame[] = [
  {
    id: 'bottle-spin',
    title: 'Mochi’s Bottle Spin',
    action: 'spin',
    tagline: 'Mochi lets the bottle decide',
    description: 'Give Mochi’s bottle a spin to choose who pays or picks tonight.',
    duration: '< 10s',
    accent: THEME.pink,
  },
  {
    id: 'hot-potato',
    title: 'Mochi’s Hot Paw',
    action: 'pass',
    tagline: 'Pass Mochi’s hot paw',
    description: 'Pass the phone around. Whoever is holding it when time runs out loses.',
    duration: '30–45s',
    accent: THEME.yellow,
  },
  {
    id: 'tap-race',
    title: 'Mochi’s Paw Race',
    action: 'tap',
    tagline: 'Race Mochi’s quick paws',
    description: 'Tap for five seconds. The fewest taps picks up the tab.',
    duration: '1–2m',
    accent: THEME.cyan,
  },
];

export const GameSelectScreen: React.FC = () => {
  const { setActiveScreen, activeDecision } = useGame();
  const { players } = usePlayers();

  const handleLaunch = (gameId: 'bottle-spin' | 'hot-potato' | 'tap-race') => {
    triggerHaptic('heavy');
    setActiveScreen(gameId);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.header}>
          <Text style={styles.stepTag}>STEP 3 OF 3</Text>
          <View style={styles.introRow}>
            <View style={styles.catStamp}>
              <CatMark size={36} />
            </View>
            <View style={styles.introCopy}>
              <Text style={styles.heading}>Pick a game</Text>
              <Text style={styles.subheading}>
                {activeDecision.title} · {players.length} players
              </Text>
            </View>
          </View>
          <Text style={styles.catNote}>Mochi keeps an eye on the round.</Text>
        </View>

        <View style={styles.cartridgeList}>
          {ARCADE_GAMES.map((game) => (
            <TouchableOpacity
              key={game.id}
              activeOpacity={0.88}
              style={[
                styles.cartridgeCard,
                { borderColor: '#F3DDE3' },
              ]}
              onPress={() => handleLaunch(game.id)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.durationPill}>
                  <Text style={styles.durationText}>{game.duration}</Text>
                </View>
              </View>

              {/* Main Content */}
              <View style={styles.mainRow}>
                <View style={[styles.gameIconBox, { backgroundColor: game.accent + '20' }]}>
                  <GameActionMark size={54} action={game.action} />
                </View>
                <View style={styles.gameInfo}>
                  <Text style={styles.gameTitle}>{game.title}</Text>
                  <Text style={styles.gameTagline}>{game.tagline}</Text>
                </View>
              </View>

              <Text style={styles.gameDesc}>{game.description}</Text>

              <View style={styles.cardAction}>
                <Text style={styles.cardActionText}>Play this game</Text>
                <Text style={styles.cardActionArrow}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 18,
  },
  stepTag: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.pink,
    letterSpacing: 0.4,
  },
  introRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 6,
  },
  catStamp: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE8EE',
  },
  introCopy: { flex: 1 },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: THEME.text,
    marginTop: 5,
  },
  subheading: {
    fontSize: 14,
    color: THEME.textSub,
    marginTop: 2,
  },
  catNote: {
    alignSelf: 'flex-start',
    marginTop: 12,
    marginBottom: 2,
    color: THEME.textSub,
    fontSize: 12,
    fontWeight: '600',
  },

  cartridgeList: {
    gap: 12,
  },
  cartridgeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F3DDE3',
    borderBottomWidth: 3,
    borderBottomColor: '#EBCBD4',
    padding: 16,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  durationPill: {
    backgroundColor: '#FFF5F8',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  durationText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.textSub,
  },

  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  gameIconBox: {
    width: 54,
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameInfo: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: THEME.text,
  },
  gameTagline: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.textSub,
    marginTop: 2,
  },

  gameDesc: {
    fontSize: 13,
    color: THEME.textSub,
    lineHeight: 18,
  },

  cardAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F5E8EC',
    paddingTop: 10,
    marginTop: 2,
  },
  cardActionText: { fontSize: 13, fontWeight: '700', color: THEME.pink },
  cardActionArrow: { fontSize: 22, lineHeight: 22, color: THEME.pink },
});

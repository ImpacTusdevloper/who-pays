import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { usePlayers } from '../context/PlayerContext';
import { useGame } from '../context/GameContext';
import { useHistory } from '../context/HistoryContext';
import { THEME } from '../constants/colors';
import { PlayerInput } from '../components/players/PlayerInput';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { triggerHaptic } from '../utils/haptics';
import { CatMark } from '../components/common/CatMark';

export const PlayerSetupScreen: React.FC = () => {
  const {
    players,
    removePlayer,
    clearPlayers,
    quickAddPresets,
    shufflePlayers,
    canStartGame,
    minRequired,
    maxAllowed,
    isMaxReached,
  } = usePlayers();
  const { setActiveScreen, activeDecision } = useGame();
  const { getPlayerStat, topPayer } = useHistory();

  const handleContinue = () => {
    if (!canStartGame) return;
    triggerHaptic('success');
    setActiveScreen('game-select');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Step Indicator */}
        <View style={styles.header}>
          <Text style={styles.stepTag}>STEP 2 OF 3</Text>
          <View style={styles.titleRow}>
            <Text style={styles.heading}>Who’s playing?</Text>
            <View
              style={[
                styles.countBadge,
                canStartGame && styles.countBadgeReady,
              ]}
            >
              <Text style={styles.countText}>
                {players.length}/{maxAllowed}
              </Text>
            </View>
          </View>
          <Text style={styles.subheading}>
            Add everyone joining {activeDecision.title}.
          </Text>
        </View>

        {/* Input Bar */}
        <PlayerInput />

        {/* Quick Actions Toolbar */}
        <View style={styles.toolbar}>
          <TouchableOpacity
            style={[styles.toolBtn, isMaxReached && styles.toolBtnDisabled]}
            disabled={isMaxReached}
            onPress={() => quickAddPresets(4)}
          >
            <Text style={styles.toolBtnText}>+ 4 players</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolBtn, players.length < 2 && styles.toolBtnDisabled]}
            disabled={players.length < 2}
            onPress={shufflePlayers}
          >
            <Text style={styles.toolBtnText}>Shuffle</Text>
          </TouchableOpacity>

        </View>

        {/* Player Roster Cards */}
        <View style={styles.rosterSection}>
          <View style={styles.rosterHeader}>
            <Text style={styles.rosterSectionLabel}>Players ({players.length})</Text>
            {players.length > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  Alert.alert('Clear the player list?', 'Everyone will need to be added again.', [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Clear all',
                      style: 'destructive',
                      onPress: () => {
                        triggerHaptic('warning');
                        clearPlayers();
                      },
                    },
                  ]);
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.clearPlayersText}>Clear</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {players.length === 0 ? (
            <View style={styles.emptyBox}>
              <CatMark size={42} />
              <Text style={styles.emptyTitle}>Your table is waiting</Text>
              <Text style={styles.emptySub}>
                Add a couple of friends to get started.
              </Text>
            </View>
          ) : (
            players.map((p) => {
              const stat = getPlayerStat(p.id);
              const isTop = topPayer && topPayer.playerId === p.id && topPayer.timesPaid > 0;
              return (
                <View
                  key={p.id}
                  style={[
                    styles.playerCard,
                  ]}
                >
                  <Avatar
                    avatar={p.avatar}
                    color={p.color}
                    size={46}
                    crown={!!isTop}
                  />

                  <View style={styles.playerInfo}>
                    <Text style={styles.playerName} numberOfLines={1}>
                      {p.name}
                    </Text>
                    <Text style={styles.playerTitle}>
                      {stat && stat.timesPaid > 0 ? `Paid ${stat.timesPaid} times` : 'Ready to play'}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => removePlayer(p.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={styles.deleteBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Footer CTA */}
      <View style={styles.footer}>
        <Button
          title={
            canStartGame
              ? `Choose a game · ${players.length} players`
              : `Add ${minRequired - players.length} more players`
          }
          color={canStartGame ? 'pink' : 'ghost'}
          size="lg"
          disabled={!canStartGame}
          onPress={handleContinue}
          style={{ width: '100%' }}
        />
      </View>
    </KeyboardAvoidingView>
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
    paddingBottom: 110,
  },
  header: {
    marginBottom: 16,
  },
  stepTag: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.pink,
    letterSpacing: 0.4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  heading: {
    fontSize: 25,
    fontWeight: '800',
    color: THEME.text,
  },
  countBadge: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3DDE3',
  },
  countBadgeReady: {
    borderColor: THEME.pinkSoft,
    backgroundColor: '#FFF0F5',
  },
  countText: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.text,
  },
  subheading: {
    fontSize: 13,
    color: THEME.textSub,
    marginTop: 4,
    lineHeight: 18,
  },

  toolbar: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 10,
  },
  toolBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3DDE3',
    borderBottomWidth: 3,
    borderBottomColor: '#EBCBD4',
    paddingVertical: 9,
    borderRadius: 12,
  },
  toolBtnDisabled: {
    opacity: 0.45,
  },
  toolBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.textSub,
  },

  rosterSection: {
    marginTop: 6,
    gap: 8,
  },
  rosterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rosterSectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.textMuted,
    marginBottom: 4,
  },
  clearPlayersText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.pink,
  },
  emptyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F3DDE3',
    borderBottomWidth: 3,
    borderBottomColor: '#EBCBD4',
    borderStyle: 'dashed',
    padding: 24,
    alignItems: 'center',
    gap: 6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.text,
  },
  emptySub: {
    fontSize: 13,
    color: THEME.textSub,
    textAlign: 'center',
  },

  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3DDE3',
    borderBottomWidth: 3,
    borderBottomColor: '#EBCBD4',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 10,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.text,
  },
  playerTitle: {
    fontSize: 11,
    fontWeight: '500',
    color: THEME.textMuted,
    marginTop: 1,
  },
  deleteBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.textMuted,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3DDE3',
  },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useHistory } from '../context/HistoryContext';
import { useGame } from '../context/GameContext';
import { THEME } from '../constants/colors';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { triggerHaptic } from '../utils/haptics';
import { CatMark } from '../components/common/CatMark';

export const HistoryScreen: React.FC = () => {
  const {
    history,
    playerStats,
    topPayer,
    clearHistory,
    deleteResult,
  } = useHistory();
  const { setActiveScreen } = useGame();

  const formatTimeAgo = (timestamp: number): string => {
    const diffMs = Date.now() - timestamp;
    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleClear = () => {
    Alert.alert(
      'Clear History',
      'Erase all recorded rounds and debt tallies?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => clearHistory(),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Your history</Text>
            <Text style={styles.sub}>A little record of who picked up the tab</Text>
          </View>
          {history.length > 0 && (
            <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Top Payer Callout */}
        {topPayer ? (
          <View style={styles.topPayerCard}>
            <View style={styles.topPayerTag}>
              <Text style={styles.topPayerTagText}>Most bills paid</Text>
            </View>
            <View style={styles.topPayerBody}>
              <Avatar
                avatar={topPayer.playerAvatar}
                color={topPayer.playerColor}
                size={54}
                highlighted
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.topPayerName}>{topPayer.playerName}</Text>
                <Text style={styles.topPayerStats}>
                  Paid <Text style={{ color: THEME.red, fontWeight: '900' }}>{topPayer.timesPaid}×</Text> across {topPayer.totalGames} decisions
                </Text>
              </View>
            </View>
          </View>
        ) : null}

        {/* Leaderboard */}
        {playerStats.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>By the numbers</Text>
            <View style={styles.boardCard}>
              {playerStats.map((st, i) => (
                <View key={st.playerId} style={styles.boardRow}>
                  <Text style={styles.boardIdx}>#{i + 1}</Text>
                  <Avatar avatar={st.playerAvatar} color={st.playerColor} size={32} />
                  <Text style={styles.boardName} numberOfLines={1}>
                    {st.playerName}
                  </Text>
                  <View style={styles.chipsRow}>
                    <View style={styles.paidChip}>
                      <Text style={styles.paidChipText}>Paid {st.timesPaid}×</Text>
                    </View>
                    {st.timesWon > 0 && (
                      <View style={styles.wonChip}>
                        <Text style={styles.wonChipText}>Won {st.timesWon}×</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Chronological rounds */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Recent rounds · {history.length}</Text>

          {history.length === 0 ? (
            <View style={styles.empty}>
              <CatMark size={44} />
              <Text style={styles.emptyTitle}>No rounds yet</Text>
              <Text style={styles.emptySub}>
                Play a game to start tracking who owes what!
              </Text>
            </View>
          ) : (
            history.map((h) => (
              <View key={h.id} style={styles.logCard}>
                <View style={styles.logHeader}>
                  <Text style={styles.logGameTitle}>
                    {h.gameTitle} · {h.decision.title}
                  </Text>
                  <Text style={styles.logTime}>{formatTimeAgo(h.timestamp)}</Text>
                </View>

                <View style={styles.logBody}>
                  <Avatar
                    avatar={h.selectedPlayer.avatar}
                    color={h.selectedPlayer.color}
                    size={40}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.logPlayerName}>{h.selectedPlayer.name}</Text>
                    <Text style={styles.logConsequence} numberOfLines={2}>
                      {h.decision.mode === 'loser_pays'
                        ? h.decision.loserLabel
                        : h.decision.winnerLabel}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.logDel}
                    onPress={() => deleteResult(h.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={styles.logDelText}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          title="Back to menu"
          onPress={() => {
            triggerHaptic('light');
            setActiveScreen('start');
          }}
          color="pink"
          size="md"
          style={{ width: '100%' }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  scroll: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 90 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 26, fontWeight: '800', color: THEME.text },
  sub: { fontSize: 13, color: THEME.textSub, marginTop: 2 },
  clearBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3DDE3',
    borderRadius: 12,
  },
  clearBtnText: { fontSize: 12, fontWeight: '600', color: THEME.pink },

  topPayerCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3DDE3',
    borderBottomWidth: 3,
    borderBottomColor: '#EBCBD4',
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
  },
  topPayerTag: {
    backgroundColor: '#FFF5F8',
    borderWidth: 1,
    borderColor: '#F3DDE3',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  topPayerTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.pink,
  },
  topPayerBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  topPayerName: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.text,
  },
  topPayerStats: {
    fontSize: 13,
    color: THEME.textSub,
    marginTop: 2,
  },

  section: { marginBottom: 18 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.pink,
    marginBottom: 10,
  },
  boardCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3DDE3',
    borderBottomWidth: 3,
    borderBottomColor: '#EBCBD4',
    borderRadius: 18,
    overflow: 'hidden',
  },
  boardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5E8EC',
    gap: 10,
  },
  boardIdx: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.pink,
    width: 20,
  },
  boardName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: THEME.text,
  },
  chipsRow: { flexDirection: 'row', gap: 6 },
  paidChip: {
    backgroundColor: '#FFF0F5',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  paidChipText: { fontSize: 12, fontWeight: '700', color: THEME.pink },
  wonChip: {
    backgroundColor: '#E8F8FD',
    borderWidth: 1,
    borderColor: '#D5EDF6',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  wonChipText: { fontSize: 12, fontWeight: '700', color: THEME.cyan },

  empty: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F3DDE3',
    borderBottomWidth: 3,
    borderBottomColor: '#EBCBD4',
    borderStyle: 'dashed',
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: THEME.text },
  emptySub: { fontSize: 13, color: THEME.textSub, textAlign: 'center' },

  logCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3DDE3',
    borderBottomWidth: 3,
    borderBottomColor: '#EBCBD4',
    padding: 12,
    marginBottom: 8,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F5E8EC',
  },
  logGameTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.pink,
    letterSpacing: 0.5,
  },
  logTime: { fontSize: 11, color: THEME.textMuted },
  logBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logPlayerName: { fontSize: 15, fontWeight: '700', color: THEME.text },
  logConsequence: { fontSize: 12, color: THEME.textSub, marginTop: 2 },
  logDel: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: '#FFF5F8',
    borderWidth: 1,
    borderColor: '#F3DDE3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logDelText: { fontSize: 11, color: THEME.textMuted, fontWeight: '700' },

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

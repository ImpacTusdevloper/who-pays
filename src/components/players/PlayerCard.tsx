import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Player } from '../../types';
import { THEME } from '../../constants/colors';
import { Avatar } from '../common/Avatar';

interface PlayerCardProps {
  player: Player;
  onRemove: (id: string) => void;
  index: number;
  timePaid?: number;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  onRemove,
  index,
  timePaid = 0,
}) => (
  <View style={[styles.card, { borderLeftColor: player.color, borderLeftWidth: 3 }]}>
    <Text style={styles.idx}>#{index + 1}</Text>
    <Avatar avatar={player.avatar} color={player.color} size={42} />
    <View style={styles.info}>
      <Text style={styles.name} numberOfLines={1}>{player.name}</Text>
      <Text style={timePaid > 0 ? styles.paidBadge : styles.safeBadge}>
        {timePaid > 0 ? `Paid ${timePaid}×` : 'Not yet'}
      </Text>
    </View>
    <TouchableOpacity
      onPress={() => onRemove(player.id)}
      style={styles.del}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
    >
      <Text style={styles.delText}>✕</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.bgCard,
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 6,
    gap: 10,
  },
  idx: { fontSize: 11, fontWeight: '800', color: THEME.textMuted, width: 22 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: THEME.text },
  paidBadge: { fontSize: 11, fontWeight: '600', color: THEME.red, marginTop: 2 },
  safeBadge: { fontSize: 11, fontWeight: '600', color: THEME.textMuted, marginTop: 2 },
  del: {
    width: 28,
    height: 28,
    backgroundColor: THEME.surface,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  delText: { fontSize: 12, color: THEME.textMuted, fontWeight: '700' },
});

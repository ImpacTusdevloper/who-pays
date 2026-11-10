import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Player } from '../../types';
import { Avatar } from '../common/Avatar';
import { THEME } from '../../constants/colors';

interface PlayerRingProps {
  players: Player[];
  activePlayerIndex: number | null;
  radius: number;
}

export const PlayerRing: React.FC<PlayerRingProps> = ({
  players,
  activePlayerIndex,
  radius,
}) => {
  const count = players.length;
  if (count === 0) return null;

  const sliceAngle = 360 / count;

  return (
    <View style={[styles.ringContainer, { width: radius * 2, height: radius * 2 }]}>
      {/* Decorative concentric arena guides */}
      <View
        style={[
          styles.arenaGuideCircle,
          {
            width: radius * 1.8,
            height: radius * 1.8,
            borderRadius: radius * 0.9,
          },
        ]}
      />
      <View
        style={[
          styles.arenaInnerCircle,
          {
            width: radius * 1.2,
            height: radius * 1.2,
            borderRadius: radius * 0.6,
          },
        ]}
      />

      {players.map((player, index) => {
        // Player 0 is positioned at top (-90 degrees), then clockwise
        const deg = index * sliceAngle - 90;
        const rad = (deg * Math.PI) / 180;
        const x = radius + radius * 0.78 * Math.cos(rad);
        const y = radius + radius * 0.78 * Math.sin(rad);

        const isHighlighted = activePlayerIndex === index;

        return (
          <View
            key={player.id}
            style={[
              styles.playerNode,
              {
                left: x - 34,
                top: y - 34,
              },
            ]}
          >
            <Avatar
              avatar={player.avatar}
              color={player.color}
              size={isHighlighted ? 56 : 48}
              highlighted={isHighlighted}
            />
            <View
              style={[
                styles.namePill,
                isHighlighted && {
                  backgroundColor: player.color,
                  borderColor: '#FFFFFF',
                  transform: [{ scale: 1.05 }],
                },
              ]}
            >
              <Text
                style={[
                  styles.nameText,
                  isHighlighted && styles.nameTextHighlighted,
                ]}
                numberOfLines={1}
              >
                {player.name}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  ringContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arenaGuideCircle: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(255, 77, 109, 0.25)',
    borderStyle: 'dashed',
  },
  arenaInnerCircle: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 204, 213, 0.5)',
  },
  playerNode: {
    position: 'absolute',
    width: 68,
    alignItems: 'center',
    justifyContent: 'center',
  },
  namePill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FFCCD5',
    borderBottomWidth: 2.5,
    borderBottomColor: '#FFB3C1',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginTop: 4,
    maxWidth: 80,
    shadowColor: '#FF4D6D',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  nameText: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.text,
    textAlign: 'center',
  },
  nameTextHighlighted: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
});

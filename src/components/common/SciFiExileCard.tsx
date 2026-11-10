import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Player } from '../../types';

interface SciFiExileCardProps {
  player: Player;
  consequence: string;
  compact?: boolean;
  active?: boolean;
}

const MOCHI_MESSAGES = [
  'Mochi will find you.',
  'You can’t hide from Mochi.',
  'Mochi knows you’re still here.',
  'Don’t turn around.',
  'Mochi is already behind you.',
  'It heard you.',
];

const METHODS = [
  'STABBING',
  'SHOOTING',
  'THE RACK',
  'BRAZEN BULL',
  'GUILLOTINE',
  'IRON MAIDEN',
  'BREAKING WHEEL',
  'SCAPHISM',
  'IMPALEMENT',
  'THE PILLORY',
  'THE STOCKS',
  'THE IRON CHAIR',
  'THE GARROTE',
  'THE THUMBSCREW',
  'THE PEAR OF ANGUISH',
];

export const SciFiExileCard: React.FC<SciFiExileCardProps> = ({
  player,
  consequence,
  compact = false,
  active = true,
}) => {
  const [message, setMessage] = useState(MOCHI_MESSAGES[0]);
  const [method, setMethod] = useState(METHODS[0]);

  useEffect(() => {
    if (!active) return;

    setMessage((previousMessage) => {
      const options = MOCHI_MESSAGES.filter((candidate) => candidate !== previousMessage);
      return options[Math.floor(Math.random() * options.length)];
    });
    setMethod((previousMethod) => {
      const options = METHODS.filter((candidate) => candidate !== previousMethod);
      return options[Math.floor(Math.random() * options.length)];
    });
  }, [active, player.id]);

  return (
    <View style={[styles.card, compact && styles.compactCard]}>
      <View style={styles.header}>
        <View style={styles.statusDot} />
        <Text style={styles.headerText}>MOCHI IS NEAR</Text>
        <View style={styles.statusDot} />
      </View>

      <View style={styles.messagePanel}>
        <View style={styles.topRule} />
        <Text style={[styles.message, compact && styles.compactMessage]}>
          {message}
        </Text>
        <View style={styles.bottomRule} />
      </View>

      <Text style={styles.playerName}>{player.name}</Text>
      <Text style={styles.consequence}>{consequence}</Text>
      <Text style={styles.protocol}>MOCHI CHOOSES: {method}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
    gap: 9,
    backgroundColor: '#0A080B',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#403036',
    borderBottomWidth: 3,
    borderBottomColor: '#030203',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 18,
    elevation: 10,
  },
  compactCard: {
    padding: 12,
    gap: 6,
    borderRadius: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#8E313B',
  },
  headerText: {
    color: '#8E8185',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 2.2,
  },
  messagePanel: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 11,
  },
  topRule: {
    width: '34%',
    height: 1,
    backgroundColor: '#5E252D',
  },
  message: {
    color: '#E4DADC',
    fontSize: 25,
    fontWeight: '800',
    letterSpacing: 0.3,
    lineHeight: 32,
    textAlign: 'center',
    textShadowColor: '#721D2A',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  compactMessage: {
    fontSize: 20,
    lineHeight: 26,
  },
  bottomRule: {
    width: '62%',
    height: 1,
    backgroundColor: '#352329',
  },
  playerName: {
    color: '#F0E7E8',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  consequence: {
    color: '#A89B9E',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  protocol: {
    color: '#735C61',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center',
  },
});

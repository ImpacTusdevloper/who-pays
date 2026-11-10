import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import type { ComponentRef, RefObject } from 'react';
import { Player, Decision } from '../../types';
import { THEME } from '../../constants/colors';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { BlurredResultBackdrop } from '../common/BlurredResultBackdrop';
import { SciFiExileCard } from '../common/SciFiExileCard';

interface ResultModalProps {
  visible: boolean;
  selectedPlayer: Player | null;
  decision: Decision;
  onRematch: () => void;
  onClose: () => void;
  onViewHistory: () => void;
  onManagePlayers: () => void;
  blurTarget: RefObject<ComponentRef<typeof View> | null>;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  visible,
  selectedPlayer,
  decision,
  onRematch,
  onClose,
  onViewHistory,
  onManagePlayers,
  blurTarget,
}) => {
  if (!selectedPlayer) return null;
  const isLoser = decision.mode === 'loser_pays';

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurredResultBackdrop target={blurTarget} tone={isLoser ? 'dark' : 'light'} />
      <SafeAreaView style={[styles.overlay, isLoser && styles.exileOverlay]}>
        <View style={[styles.card, isLoser && styles.exileModal]}>
          {isLoser ? (
            <SciFiExileCard
              player={selectedPlayer}
              consequence={decision.loserLabel}
              active={visible}
            />
          ) : (
            <>
              <Text style={styles.resultLead}>And the winner is</Text>
              <Avatar
                avatar={selectedPlayer.avatar}
                color={selectedPlayer.color}
                size={82}
                highlighted
                crown
              />
              <Text style={styles.playerName}>{selectedPlayer.name}</Text>
              <View
                style={[
                  styles.consequenceBox,
                  {
                    backgroundColor: THEME.yellow + '18',
                    borderColor: THEME.yellow + '50',
                  },
                ]}
              >
                <Text style={styles.consequenceText}>
                  {selectedPlayer.name} {decision.winnerLabel}
                </Text>
              </View>
            </>
          )}

          <View style={styles.actionsCol}>
            <Button
              title="Spin again"
              color={isLoser ? 'pink' : 'yellow'}
              size="lg"
              onPress={onRematch}
            />

            <View style={styles.secondaryRow}>
              <Button
                title="History"
                color="ghost"
                size="sm"
                onPress={onViewHistory}
                style={styles.flexBtn}
              />
              <Button
                title="Players"
                color="ghost"
                size="sm"
                onPress={onManagePlayers}
                style={styles.flexBtn}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(45, 22, 31, 0.16)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3DDE3',
    borderRadius: 24,
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    gap: 14,
    shadowColor: '#2D161F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  exileOverlay: {
    backgroundColor: 'rgba(8, 12, 20, 0.62)',
  },
  exileModal: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingVertical: 12,
    paddingHorizontal: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  resultLead: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.pink,
  },
  playerName: {
    fontSize: 30,
    fontWeight: '800',
    color: THEME.text,
  },
  consequenceBox: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    width: '90%',
    alignItems: 'center',
  },
  consequenceText: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.text,
    textAlign: 'center',
    lineHeight: 22,
  },
  actionsCol: {
    width: '90%',
    gap: 10,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  flexBtn: {
    flex: 1,
  },
});

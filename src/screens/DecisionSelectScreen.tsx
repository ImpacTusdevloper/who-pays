import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  SafeAreaView,
} from 'react-native';
import { THEME } from '../constants/colors';
import { useGame } from '../context/GameContext';
import { Decision } from '../types';
import { Button } from '../components/common/Button';
import { CatMark } from '../components/common/CatMark';
import {
  DecisionActionMark,
  DecisionAction,
} from '../components/common/DecisionActionMark';
import { triggerHaptic } from '../utils/haptics';

const DECISION_ACTIONS: Record<string, DecisionAction> = {
  'who-pays': 'bill',
  'dishes-duty': 'dishes',
  'drinks-round': 'drinks',
};

export const DecisionSelectScreen: React.FC = () => {
  const {
    activeDecision,
    setActiveDecision,
    allDecisions,
    addCustomDecision,
    removeCustomDecision,
    setActiveScreen,
  } = useGame();

  const [customModalVisible, setCustomModalVisible] = useState(false);
  const [customTitle, setCustomTitle] = useState('');

  const handleSelect = (dec: Decision) => {
    setActiveDecision(dec);
    triggerHaptic('success');
    // Flow: Decision -> Player Select / Lobby -> Game Select
    setActiveScreen('players');
  };

  const handleCreateCustom = () => {
    if (!customTitle.trim()) return;
    const newDec = addCustomDecision(customTitle.trim());
    setCustomTitle('');
    setCustomModalVisible(false);
    setActiveDecision(newDec);
    setActiveScreen('players');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.header}>
          <Text style={styles.stepTag}>STEP 1 OF 3</Text>
          <Text style={styles.heading}>What are we deciding?</Text>
          <Text style={styles.subheading}>
            Pick what the group gets to decide this round.
          </Text>
        </View>

        <View style={styles.cardsGrid}>
          {allDecisions.map((dec) => {
            const isSelected = dec.id === activeDecision.id;
            const isCustom = dec.id.startsWith('custom_');
            return (
              <View
                key={dec.id}
                style={[
                  styles.card,
                  isSelected && styles.cardSelected,
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.cardContent}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => handleSelect(dec)}
                >
                  <View style={styles.cardTop}>
                    <View style={styles.catStamp}>
                      {DECISION_ACTIONS[dec.id] ? (
                        <DecisionActionMark
                          action={DECISION_ACTIONS[dec.id]}
                          size={48}
                        />
                      ) : (
                        <CatMark size={34} expression="happy" />
                      )}
                    </View>
                  </View>

                  <Text style={styles.cardTitle}>{dec.title}</Text>
                  <Text style={styles.cardQuestion}>{dec.question}</Text>
                </TouchableOpacity>

                <View style={styles.cardFooter}>
                  <Text style={styles.loserCallout}>
                    Loser: {dec.loserLabel}
                  </Text>
                  {isCustom && (
                    <TouchableOpacity
                      accessibilityRole="button"
                      accessibilityLabel={`Remove custom rule ${dec.title}`}
                      hitSlop={8}
                      onPress={() => removeCustomDecision(dec.id)}
                      style={styles.removeButton}
                    >
                      <Text style={styles.removeButtonText}>Remove</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}

          {/* Create Custom Bet Card */}
          <TouchableOpacity
            style={styles.customCard}
            onPress={() => {
              triggerHaptic('light');
              setCustomModalVisible(true);
            }}
          >
            <View style={styles.customCatStamp}>
              <CatMark size={32} expression="wink" />
            </View>
            <Text style={styles.customTitle}>Make up your own rule</Text>
            <Text style={styles.customSub}>Set a rule for this round.</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer next button */}
      <View style={styles.footer}>
        <Button
          title={`Continue · ${activeDecision.title}`}
          color="pink"
          size="lg"
          onPress={() => setActiveScreen('players')}
          style={{ width: '100%' }}
        />
      </View>

      {/* Custom Dare Modal */}
      <Modal
        visible={customModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCustomModalVisible(false)}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalHeading}>Make your own rule</Text>
            <Text style={styles.modalSub}>
              Set a playful rule for this round. Mochi will keep watch.
            </Text>

            <View style={styles.modalCatStamp}>
              <CatMark size={46} expression="happy" />
            </View>

            <TextInput
              value={customTitle}
              onChangeText={setCustomTitle}
              placeholder="Enter your dare or rule..."
              placeholderTextColor={THEME.textMuted}
              style={styles.modalInput}
            />

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                color="ghost"
                size="md"
                onPress={() => setCustomModalVisible(false)}
                style={styles.flexBtn}
              />
              <Button
                title="Save & play"
                color="pink"
                size="md"
                disabled={!customTitle.trim()}
                onPress={handleCreateCustom}
                style={styles.flexBtn}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
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
    paddingBottom: 110,
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
  heading: {
    fontSize: 25,
    fontWeight: '800',
    color: THEME.text,
    marginTop: 5,
  },
  subheading: {
    fontSize: 13,
    color: THEME.textSub,
    marginTop: 4,
    lineHeight: 18,
  },

  cardsGrid: {
    gap: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3DDE3',
    borderBottomWidth: 3,
    borderBottomColor: '#EBCBD4',
    borderRadius: 18,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: THEME.pinkSoft,
    borderBottomColor: THEME.pinkSoft,
    backgroundColor: '#FFF5F8',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  catStamp: {
    width: 48,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFF0F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: THEME.text,
    marginBottom: 3,
  },
  cardQuestion: {
    fontSize: 13,
    color: THEME.textSub,
    lineHeight: 18,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F5E8EC',
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  loserCallout: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: THEME.pink,
  },
  removeButton: {
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 9,
    backgroundColor: '#FFF0F5',
    borderWidth: 1,
    borderColor: '#FFCCD5',
  },
  removeButtonText: {
    fontSize: 11,
    fontWeight: '800',
    color: THEME.textSub,
  },

  customCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0CED8',
    borderBottomWidth: 3,
    borderBottomColor: '#EBCBD4',
    borderStyle: 'dashed',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    gap: 6,
  },
  customCatStamp: {
    width: 44,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#FFF0F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.pink,
  },
  customSub: {
    fontSize: 12,
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

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(45, 22, 31, 0.35)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderTopColor: '#F3DDE3',
    padding: 22,
    gap: 12,
  },
  modalHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.text,
    textAlign: 'center',
  },
  modalSub: {
    fontSize: 12,
    color: THEME.textSub,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalCatStamp: {
    alignSelf: 'center',
    width: 64,
    height: 58,
    borderRadius: 20,
    backgroundColor: '#FFF0F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  modalInput: {
    backgroundColor: '#FFF7F9',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F3DDE3',
    padding: 14,
    fontSize: 16,
    fontWeight: '700',
    color: THEME.text,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  flexBtn: {
    flex: 1,
  },
});

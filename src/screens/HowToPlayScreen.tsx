import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { THEME } from '../constants/colors';
import { useGame } from '../context/GameContext';
import { Button } from '../components/common/Button';

export const HowToPlayScreen: React.FC = () => {
  const { setActiveScreen } = useGame();

  const STEPS = [
    {
      num: '01',
      title: 'Choose the stakes',
      desc: 'Choose who pays, where to eat, who cleans up, or make up a custom bet.',
    },
    {
      num: '02',
      title: 'Add 2–8 friends',
      desc: 'Add names one by one or use quick-add suggestions. Everyone gets a cute avatar.',
    },
    {
      num: '03',
      title: 'Pass the phone',
      desc: 'Spin the bottle, pass the hot potato, or try a five-second tap race.',
    },
    {
      num: '04',
      title: 'See who pays',
      desc: 'See who wins, who pays, and keep track of past rounds.',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <Text style={styles.heading}>How it works</Text>
        <Text style={styles.subheading}>
          Four little steps to settle it.
        </Text>

        <View style={styles.stepsList}>
          {STEPS.map((s) => (
            <View
              key={s.num}
              style={styles.stepCard}
            >
              <View style={styles.stepTop}>
                <View style={styles.numBadge}>
                  <Text style={styles.numText}>{s.num}</Text>
                </View>
              </View>

              <Text style={styles.stepTitle}>{s.title}</Text>
              <Text style={styles.stepDesc}>{s.desc}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Let's play"
          color="pink"
          size="lg"
          onPress={() => setActiveScreen('decisions')}
          style={{ width: '100%' }}
        />
      </View>
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
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: THEME.text,
  },
  subheading: {
    fontSize: 13,
    color: THEME.textSub,
    marginTop: 4,
    marginBottom: 18,
  },
  stepsList: {
    gap: 10,
  },
  stepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F3DDE3',
    borderBottomWidth: 3,
    borderBottomColor: '#EBCBD4',
    padding: 16,
    gap: 7,
  },
  stepTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  numBadge: {
    backgroundColor: '#FFF0F5',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 9,
  },
  numText: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.pink,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.text,
  },
  stepDesc: {
    fontSize: 13,
    color: THEME.textSub,
    lineHeight: 18,
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

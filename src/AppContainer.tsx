import React from 'react';
import { BackHandler, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DeviceFrame } from './components/common/DeviceFrame';
import { AnimatedPinkBackground } from './components/common/AnimatedPinkBackground';
import { Header } from './components/common/Header';
import { StartScreen } from './screens/StartScreen';
import { DecisionSelectScreen } from './screens/DecisionSelectScreen';
import { PlayerSetupScreen } from './screens/PlayerSetupScreen';
import { GameSelectScreen } from './screens/GameSelectScreen';
import { BottleSpinScreen } from './screens/BottleSpinScreen';
import { HotPotatoScreen } from './screens/HotPotatoScreen';
import { TapRaceScreen } from './screens/TapRaceScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { HowToPlayScreen } from './screens/HowToPlayScreen';
import { CuteScreenTransition } from './components/common/CuteScreenTransition';
import { useGame } from './context/GameContext';
import { getPreviousScreen } from './utils/navigation';

export const AppContent: React.FC = () => {
  const { activeScreen, setActiveScreen } = useGame();

  React.useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (activeScreen === 'start') return false;
        setActiveScreen(getPreviousScreen(activeScreen));
        return true;
      }
    );

    return () => subscription.remove();
  }, [activeScreen, setActiveScreen]);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'decisions':
        return <DecisionSelectScreen />;
      case 'players':
        return <PlayerSetupScreen />;
      case 'game-select':
        return <GameSelectScreen />;
      case 'bottle-spin':
        return <BottleSpinScreen />;
      case 'hot-potato':
        return <HotPotatoScreen />;
      case 'tap-race':
        return <TapRaceScreen />;
      case 'history':
        return <HistoryScreen />;
      case 'how-to-play':
        return <HowToPlayScreen />;
      case 'start':
      default:
        return <StartScreen />;
    }
  };

  return (
    <DeviceFrame>
      <AnimatedPinkBackground quiet={activeScreen !== 'start'}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <Header />
            <CuteScreenTransition currentScreenId={activeScreen}>
              <View style={styles.body}>{renderScreen()}</View>
            </CuteScreenTransition>
          </View>
        </SafeAreaView>
      </AnimatedPinkBackground>
    </DeviceFrame>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
});

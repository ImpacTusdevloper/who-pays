import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PlayerProvider } from './src/context/PlayerContext';
import { HistoryProvider } from './src/context/HistoryContext';
import { GameProvider } from './src/context/GameContext';
import { AudioProvider } from './src/context/AudioContext';
import { AppContent } from './src/AppContainer';

export default function App() {
  return (
    <SafeAreaProvider>
      <AudioProvider>
        <PlayerProvider>
          <HistoryProvider>
            <GameProvider>
              <AppContent />
              <StatusBar style="dark" />
            </GameProvider>
          </HistoryProvider>
        </PlayerProvider>
      </AudioProvider>
    </SafeAreaProvider>
  );
}

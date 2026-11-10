import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { triggerHaptic } from '../utils/haptics';

interface AudioContextType {
  isMusicEnabled: boolean;
  toggleMusic: () => void;
  musicVolume: number;
  setMusicVolume: (vol: number) => void;
  isSfxEnabled: boolean;
  toggleSfx: () => void;
  playSfx: (type: 'door' | 'pop') => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const STORAGE_KEY_MUSIC = '@who_pays_music_enabled';
const STORAGE_KEY_SFX = '@who_pays_sfx_enabled';

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [isSfxEnabled, setIsSfxEnabled] = useState(true);
  const [musicVolume, setMusicVolumeState] = useState(0.45);

  const bgmPlayerRef = useRef<any>(null);
  const doorPlayerRef = useRef<any>(null);
  const popPlayerRef = useRef<any>(null);
  const audioInitializedRef = useRef(false);

  // Load preferences
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedMusic = await AsyncStorage.getItem(STORAGE_KEY_MUSIC);
        if (storedMusic !== null) {
          setIsMusicEnabled(storedMusic === 'true');
        }
        const storedSfx = await AsyncStorage.getItem(STORAGE_KEY_SFX);
        if (storedSfx !== null) {
          setIsSfxEnabled(storedSfx === 'true');
        }
      } catch (err) {
        console.warn('Could not load audio settings', err);
      }
    };
    loadSettings();
  }, []);

  // Initialize expo-audio players safely
  useEffect(() => {
    let isCancelled = false;

    const setupAudio = async () => {
      try {
        // Dynamically import expo-audio so if missing native module, it fails gracefully without crashing the app
        const ExpoAudio = require('expo-audio');
        if (!ExpoAudio || !ExpoAudio.createAudioPlayer) {
          console.warn('expo-audio is not available in this environment');
          return;
        }

        // Configure audio mode if available
        if (ExpoAudio.setAudioModeAsync) {
          await ExpoAudio.setAudioModeAsync({
            playsInSilentMode: true,
          }).catch(() => {});
        }

        if (isCancelled) return;

        // Create BGM player
        try {
          const bgm = ExpoAudio.createAudioPlayer(
            require('../../assets/audio/bgm.mp3')
          );
          bgm.loop = true;
          bgm.volume = musicVolume;
          bgmPlayerRef.current = bgm;

          if (isMusicEnabled) {
            bgm.play();
          }
        } catch (e) {
          console.warn('Error loading BGM', e);
        }

        // Create SFX players
        try {
          const door = ExpoAudio.createAudioPlayer(
            require('../../assets/audio/door.mp3')
          );
          door.volume = 0.6;
          doorPlayerRef.current = door;

          const pop = ExpoAudio.createAudioPlayer(
            require('../../assets/audio/pop.mp3')
          );
          pop.volume = 0.5;
          popPlayerRef.current = pop;
        } catch (e) {
          console.warn('Error loading SFX', e);
        }

        audioInitializedRef.current = true;
      } catch (err) {
        console.warn('Native audio initialization warning:', err);
      }
    };

    setupAudio();

    return () => {
      isCancelled = true;
      try {
        if (bgmPlayerRef.current?.pause) {
          bgmPlayerRef.current.pause();
        }
      } catch {}
    };
  }, []);

  // Sync BGM play/pause and volume
  useEffect(() => {
    try {
      if (bgmPlayerRef.current) {
        bgmPlayerRef.current.volume = musicVolume;
        if (isMusicEnabled) {
          bgmPlayerRef.current.play();
        } else {
          bgmPlayerRef.current.pause();
        }
      }
    } catch (e) {
      console.warn('BGM sync warning:', e);
    }
  }, [isMusicEnabled, musicVolume]);

  const toggleMusic = () => {
    triggerHaptic('selection');
    const nextVal = !isMusicEnabled;
    setIsMusicEnabled(nextVal);
    AsyncStorage.setItem(STORAGE_KEY_MUSIC, String(nextVal)).catch(() => {});

    try {
      if (bgmPlayerRef.current) {
        if (nextVal) {
          bgmPlayerRef.current.play();
        } else {
          bgmPlayerRef.current.pause();
        }
      }
    } catch (e) {
      console.warn('Toggle music warning:', e);
    }
  };

  const setMusicVolume = (vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setMusicVolumeState(clamped);
  };

  const toggleSfx = () => {
    triggerHaptic('selection');
    const nextVal = !isSfxEnabled;
    setIsSfxEnabled(nextVal);
    AsyncStorage.setItem(STORAGE_KEY_SFX, String(nextVal)).catch(() => {});
  };

  const playSfx = (type: 'door' | 'pop') => {
    if (!isSfxEnabled) return;
    try {
      const player = type === 'door' ? doorPlayerRef.current : popPlayerRef.current;
      if (player) {
        player.seekTo?.(0);
        player.play();
      }
    } catch {
      // Ignore SFX hiccups
    }
  };

  return (
    <AudioContext.Provider
      value={{
        isMusicEnabled,
        toggleMusic,
        musicVolume,
        setMusicVolume,
        isSfxEnabled,
        toggleSfx,
        playSfx,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextType => {
  const ctx = useContext(AudioContext);
  if (!ctx) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return ctx;
};

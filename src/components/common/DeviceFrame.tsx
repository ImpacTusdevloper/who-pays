import React from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import { THEME } from '../../constants/colors';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const isWeb = Platform.OS === 'web';
  const screenWidth = Dimensions.get('window').width;

  // On wide screens (desktop browsers), wrap into a cute pearl-white phone frame with pastel pink ambient backdrop
  if (isWeb && screenWidth > 500) {
    return (
      <View style={styles.webWrapper}>
        <View style={styles.phoneShell}>
          {/* Cute phone speaker bar */}
          <View style={styles.notchBar}>
            <View style={styles.speakerPill} />
            <View style={styles.cameraDot} />
          </View>
          <View style={styles.phoneScreen}>{children}</View>
        </View>
      </View>
    );
  }

  // On mobile, fill screen naturally
  return <View style={styles.mobileContainer}>{children}</View>;
};

const styles = StyleSheet.create({
  webWrapper: {
    flex: 1,
    backgroundColor: '#E6E3E7',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  phoneShell: {
    width: 420,
    height: '96%',
    maxHeight: 890,
    backgroundColor: '#FFFFFF', // Glossy pearl white
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#FFB3C1', // Cute strawberry border
    overflow: 'hidden',
    shadowColor: '#FF4D6D',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.25,
    shadowRadius: 36,
    elevation: 20,
  },
  notchBar: {
    height: 24,
    backgroundColor: THEME.bg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: '#FFCCD5',
  },
  speakerPill: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFCCD5',
  },
  cameraDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF85A1',
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: THEME.bg,
  },
  mobileContainer: {
    flex: 1,
    backgroundColor: THEME.bg,
  },
});

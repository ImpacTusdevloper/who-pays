import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { THEME } from '../../constants/colors';
import { usePlayers } from '../../context/PlayerContext';
import { getPlayerMonogram } from '../../constants/playerPresets';
import { CatMark } from '../common/CatMark';

export const PlayerInput: React.FC = () => {
  const { addPlayer, isMaxReached } = usePlayers();
  const [name, setName] = useState('');
  const currentAvatar = name.trim() ? getPlayerMonogram(name) : '';
  const inputRef = React.useRef<any>(null);

  const handleAdd = () => {
    if (!name.trim()) return;
    const ok = addPlayer(name);
    if (ok) {
      setName('');
      inputRef.current?.focus();
    }
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <View style={styles.avatarBtn}>
          {currentAvatar ? (
            <Text style={styles.avatarText}>{currentAvatar}</Text>
          ) : (
            <CatMark size={30} />
          )}
        </View>

        <TextInput
          ref={inputRef}
          value={name}
          onChangeText={setName}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
          blurOnSubmit={false}
          editable={!isMaxReached}
          placeholder={isMaxReached ? 'All 8 spots are filled' : 'Add a player name'}
          placeholderTextColor={THEME.textMuted}
          style={styles.input}
        />

        <TouchableOpacity
          onPress={handleAdd}
          disabled={isMaxReached || !name.trim()}
          style={[
            styles.addBtn,
            (isMaxReached || !name.trim()) && styles.addBtnOff,
          ]}
        >
          <Text style={styles.addBtnText}>＋ Add</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: THEME.bgCard,
    borderWidth: 1,
    borderColor: '#F3DDE3',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  avatarBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#FFF0F5',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarText: { fontSize: 19, fontWeight: '700', color: THEME.textSub },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: THEME.text,
    paddingVertical: 8,
  },
  addBtn: {
    backgroundColor: THEME.pink,
    borderBottomWidth: 3,
    borderBottomColor: THEME.pinkShadow,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  addBtnOff: {
    opacity: 0.35,
    backgroundColor: THEME.surface,
    borderBottomColor: THEME.border,
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 0.5,
  },
});

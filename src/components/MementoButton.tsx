import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, borderRadius, letterSpacing } from '../theme/tokens';
import { fonts } from '../theme/fonts';

interface MementoButtonProps {
  label: string;
  onPress: () => void;
}

export const MementoButton: React.FC<MementoButtonProps> = ({ label, onPress }) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
    >
      {({ pressed }) => (
        <Text style={[styles.label, pressed && styles.labelPressed]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 52,
    backgroundColor: 'rgba(20,16,10,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(196,163,90,0.25)',
    borderRadius: borderRadius.md,
  },
  pressed: {
    backgroundColor: 'rgba(196,163,90,0.9)',
    borderColor: colors.gold,
    transform: [{ scale: 0.98 }],
  },
  label: {
    fontFamily: fonts.display,
    fontSize: 13,
    letterSpacing: letterSpacing.wide,
    color: colors.gold,
    textAlign: 'center',
  },
  labelPressed: {
    color: colors.ink,
  },
});

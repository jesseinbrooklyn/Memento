import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, borderRadius, letterSpacing, fontSize } from '../theme/tokens';
import { fonts } from '../theme/fonts';

interface MementoButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export const MementoButton: React.FC<MementoButtonProps> = ({ label, onPress, disabled = false }) => {
  const handlePress = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabledButton,
      ]}
    >
      {({ pressed }) => (
        <Text style={[styles.label, pressed && !disabled && styles.labelPressed, disabled && styles.labelDisabled]}>
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
    backgroundColor: colors.bgPrimary, // opacity 0.5 intentional — see MementoButton pressed state
    borderWidth: 1,
    borderColor: colors.goldDim,
    borderRadius: borderRadius.md,
  },
  pressed: {
    backgroundColor: colors.goldStrong,
    borderColor: colors.gold,
    transform: [{ scale: 0.98 }],
  },
  label: {
    fontFamily: fonts.display,
    fontSize: fontSize.md,
    letterSpacing: letterSpacing.wide,
    color: colors.gold,
    textAlign: 'center',
  },
  labelPressed: {
    color: colors.ink,
  },
  disabledButton: {
    borderColor: colors.ash,
    opacity: 0.5,
  },
  labelDisabled: {
    color: colors.ash,
  },
});

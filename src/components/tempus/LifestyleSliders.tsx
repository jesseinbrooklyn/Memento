import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, letterSpacing, fontSize } from '../../theme/tokens';
import { fonts } from '../../theme/fonts';
import { usePreferencesStore } from '../../stores/preferences';
import { PreferencesRepository } from '../../repositories/preferences';
import { LifeFactors } from '../../utils/lifeCalculator';

const FACTOR_OPTIONS: Record<keyof LifeFactors, { label: string; value: string }[]> = {
  smoking: [
    { label: 'None', value: 'none' },
    { label: 'Former', value: 'former' },
    { label: 'Light', value: 'light' },
    { label: 'Heavy', value: 'heavy' },
  ],
  drinking: [
    { label: 'None', value: 'none' },
    { label: 'Mod', value: 'moderate' },
    { label: 'Heavy', value: 'heavy' },
    { label: 'V.Hvy', value: 'very_heavy' },
  ],
  exercise: [
    { label: 'Daily', value: 'daily' },
    { label: 'Reg', value: 'regular' },
    { label: 'Occ', value: 'occasional' },
    { label: 'None', value: 'none' },
  ],
  diet: [
    { label: 'Excl', value: 'excellent' },
    { label: 'Good', value: 'good' },
    { label: 'Avg', value: 'average' },
    { label: 'Poor', value: 'poor' },
  ],
  sleep: [
    { label: 'Opt', value: 'optimal' },
    { label: 'Good', value: 'good' },
    { label: 'Fair', value: 'fair' },
    { label: 'Poor', value: 'poor' },
  ],
};

interface SegmentedControlProps {
  factor: keyof LifeFactors;
  label: string;
  currentValue: string;
}

// Hoisted out of LifestyleSliders so React doesn't recreate the component
// identity on every render of the parent.
const SegmentedControl: React.FC<SegmentedControlProps> = ({ factor, label, currentValue }) => (
  <View style={styles.controlGroup}>
    <Text style={styles.controlLabel}>{label.toUpperCase()}</Text>
    <View style={styles.segmentedRow}>
      {FACTOR_OPTIONS[factor].map(opt => {
        const isActive = currentValue === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[styles.segmentBtn, isActive && styles.segmentBtnActive]}
            // PreferencesRepository.updateLifeFactor writes to DB then calls setLifeFactors.
            // No need to call setLifeFactors separately — the repo owns both.
            onPress={() => PreferencesRepository.updateLifeFactor(factor, opt.value)}
          >
            <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>{opt.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

export const LifestyleSliders: React.FC = () => {
  const { lifeFactors } = usePreferencesStore();

  return (
    <>
      <SegmentedControl factor="smoking" label="Smoking" currentValue={lifeFactors.smoking} />
      <SegmentedControl factor="drinking" label="Drinking" currentValue={lifeFactors.drinking} />
      <SegmentedControl factor="exercise" label="Exercise" currentValue={lifeFactors.exercise} />
      <SegmentedControl factor="diet" label="Diet" currentValue={lifeFactors.diet} />
      <SegmentedControl factor="sleep" label="Sleep" currentValue={lifeFactors.sleep} />
    </>
  );
};

const styles = StyleSheet.create({
  controlGroup: {
    marginBottom: spacing.lg,
  },
  controlLabel: {
    fontFamily: fonts.body,
    fontSize: fontSize.md,
    color: colors.boneDim,
    letterSpacing: letterSpacing.snug,
    marginBottom: spacing.sm,
  },
  segmentedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgSecondary,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.goldGlow,
    overflow: 'hidden',
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: colors.goldDim,
  },
  segmentText: {
    fontFamily: fonts.display,
    fontSize: fontSize.xs,
    color: colors.boneDim,
    letterSpacing: letterSpacing.tight,
  },
  segmentTextActive: {
    color: colors.bgPrimary,
  },
});

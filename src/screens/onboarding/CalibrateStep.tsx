import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  TextStyle,
} from 'react-native';
import { MementoButton } from '../../components/MementoButton';
import { LifestyleSliders } from '../../components/tempus/LifestyleSliders';
import { PreferencesRepository } from '../../repositories/preferences';
import { usePreferencesStore } from '../../stores/preferences';
import { formatBirthInput, parseBirthDate } from '../../utils/date';
import { colors, spacing, letterSpacing, borderRadius, fontSize } from '../../theme/tokens';
import { fonts } from '../../theme/fonts';

// Typed helper to suppress web outline without casting to any
const webOutlineFix: TextStyle | undefined =
  Platform.OS === 'web' ? ({ outlineStyle: 'none' } as unknown as TextStyle) : undefined;

interface Props {
  onNext: () => void;
}

export const CalibrateStep: React.FC<Props> = ({ onNext }) => {
  const [birthInput, setBirthInput] = useState('');
  const { use24HourTime } = usePreferencesStore();

  const handleNext = async () => {
    // Persist birthdate only if the user provided a valid one
    if (parseBirthDate(birthInput) !== null) {
      await PreferencesRepository.updateBirthDate(birthInput);
    }
    onNext();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.stepTitle}>CALIBRATE</Text>
        <Text style={styles.stepSubtitle}>
          How many days remain is shaped by when you arrived and how you live.
        </Text>

        {/* Birthdate */}
        <View style={styles.group}>
          <Text style={styles.label}>BIRTHDATE (MM/DD/YYYY)</Text>
          <TextInput
            style={[styles.input, webOutlineFix]}
            value={birthInput}
            onChangeText={t => setBirthInput(formatBirthInput(t))}
            placeholder="01/01/1990"
            placeholderTextColor={colors.boneGhost}
            keyboardType="number-pad"
          />
          <Text style={styles.hint}>
            Optional. A default estimate will be used if left blank.
          </Text>
        </View>

        {/* Lifestyle */}
        <LifestyleSliders />

        {/* Time format */}
        <View style={styles.group}>
          <Text style={styles.label}>TIME FORMAT</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, !use24HourTime && styles.toggleBtnActive]}
              onPress={() => PreferencesRepository.updateUse24HourTime(false)}
            >
              <Text style={[styles.toggleText, !use24HourTime && styles.toggleTextActive]}>
                12 HR
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, use24HourTime && styles.toggleBtnActive]}
              onPress={() => PreferencesRepository.updateUse24HourTime(true)}
            >
              <Text style={[styles.toggleText, use24HourTime && styles.toggleTextActive]}>
                24 HR
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <MementoButton label="NEXT" onPress={handleNext} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    padding: spacing.xl,
    paddingTop: spacing.xxxl,
  },
  stepTitle: {
    fontFamily: fonts.display,
    fontSize: fontSize.xl,
    color: colors.bone,
    letterSpacing: letterSpacing.wide,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontFamily: fonts.bodyItalic,
    fontSize: fontSize.body,
    color: colors.boneDim,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xxl,
    lineHeight: 24,
  },
  group: {
    marginBottom: spacing.lg,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: fontSize.md,
    color: colors.boneDim,
    letterSpacing: letterSpacing.snug,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.bgSecondary,
    borderWidth: 1,
    borderColor: colors.goldDim,
    borderRadius: borderRadius.sm,
    color: colors.bone,
    fontFamily: fonts.body,
    fontSize: fontSize.lg,
    padding: spacing.md,
    textAlign: 'center',
  },
  hint: {
    fontFamily: fonts.bodyItalic,
    fontSize: fontSize.sm,
    color: colors.boneGhost,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: colors.bgSecondary,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.goldGlow,
    overflow: 'hidden',
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: colors.goldDim,
  },
  toggleText: {
    fontFamily: fonts.display,
    fontSize: fontSize.xs,
    color: colors.boneDim,
    letterSpacing: letterSpacing.tight,
  },
  toggleTextActive: {
    color: colors.bgPrimary,
  },
  footer: {
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
});

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, TextInput, Platform, TextStyle,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, fontSize, letterSpacing, borderRadius } from '../../theme/tokens';
import { fonts } from '../../theme/fonts';
import { usePreferencesStore } from '../../stores/preferences';
import { usePracticeStore } from '../../stores/practice';
import { PreferencesRepository } from '../../repositories/preferences';
import { LifestyleSliders } from '../../components/tempus/LifestyleSliders';
import { scheduleBells, requestNotificationPermissions } from '../../utils/notifications';
import { formatBirthInput, parseBirthDate } from '../../utils/date';
import { VirtusStackParamList } from '../../navigation/VirtusNavigator';
import { ROUTES } from '../../navigation/routes';

const webOutlineFix: TextStyle | undefined =
  Platform.OS === 'web' ? ({ outlineStyle: 'none' } as unknown as TextStyle) : undefined;

interface Props {
  navigation: NativeStackNavigationProp<VirtusStackParamList, typeof ROUTES.Settings>;
}

// DIM = 0 (default, current look), STANDARD = 0.06, BRIGHT = 0.12
const BRIGHTNESS_LEVELS = [
  { label: 'DIM', value: 0 },
  { label: 'STANDARD', value: 0.06 },
  { label: 'BRIGHT', value: 0.12 },
] as const;

export default function SettingsScreen({ navigation }: Props) {
  const { birthDate, morningBellTime, eveningBellTime, use24HourTime, backgroundBrightness } = usePreferencesStore();
  const { morningComplete, eveningComplete } = usePracticeStore();
  const [birthInput, setBirthInput] = useState(birthDate ?? '');
  const [morning, setMorning] = useState(morningBellTime ?? '06:30');
  const [evening, setEvening] = useState(eveningBellTime ?? '20:00');

  const handleBirthBlur = async () => {
    if (parseBirthDate(birthInput) !== null) await PreferencesRepository.updateBirthDate(birthInput);
  };
  const handleToggle24hr = () => PreferencesRepository.updateUse24HourTime(!use24HourTime);
  const handleSaveBells = async () => {
    await PreferencesRepository.updateBellTimes(morning, evening);
    const granted = await requestNotificationPermissions();
    if (granted) await scheduleBells(morning, evening, morningComplete, eveningComplete);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>BACK</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SETTINGS</Text>
        <View style={styles.backButton} />
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.section}>CALCULATE</Text>
        <View style={styles.card}>
          <Text style={styles.label}>DATE OF BIRTH</Text>
          <TextInput style={[styles.input, webOutlineFix]} value={birthInput}
            onChangeText={(t) => setBirthInput(formatBirthInput(t))} onBlur={handleBirthBlur}
            placeholder="MM/DD/YYYY" placeholderTextColor={colors.boneGhost}
            keyboardType="numbers-and-punctuation" maxLength={10} />
          <View style={styles.divider} />
          <LifestyleSliders />
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>TIME FORMAT</Text>
            <TouchableOpacity style={[styles.toggle, use24HourTime && styles.toggleOn]} onPress={handleToggle24hr}>
              <Text style={[styles.toggleText, use24HourTime && styles.toggleTextOn]}>
                {use24HourTime ? '24 HR' : '12 HR'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.section}>ROUTINE</Text>
        <View style={styles.card}>
          <Text style={styles.label}>MORNING BELL</Text>
          <TextInput style={[styles.input, webOutlineFix]} value={morning} onChangeText={setMorning}
            placeholder="06:30" placeholderTextColor={colors.boneGhost} keyboardType="numbers-and-punctuation" />
          <View style={styles.divider} />
          <Text style={styles.label}>EVENING BELL</Text>
          <TextInput style={[styles.input, webOutlineFix]} value={evening} onChangeText={setEvening}
            placeholder="20:00" placeholderTextColor={colors.boneGhost} keyboardType="numbers-and-punctuation" />
          <View style={styles.divider} />
          <TouchableOpacity style={styles.saveBtn} onPress={handleSaveBells}>
            <Text style={styles.saveBtnText}>SAVE BELLS</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.section}>DISPLAY</Text>
        <View style={styles.card}>
          <Text style={styles.label}>BACKGROUND BRIGHTNESS</Text>
          <View style={styles.segmentedRow}>
            {BRIGHTNESS_LEVELS.map(({ label, value }) => {
              const active = backgroundBrightness === value;
              return (
                <TouchableOpacity
                  key={label}
                  style={[styles.segment, active && styles.segmentActive]}
                  onPress={() => PreferencesRepository.updateBackgroundBrightness(value)}
                >
                  <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <Text style={styles.section}>ABOUT</Text>
        <View style={styles.card}>
          <Text style={styles.version}>MEMENTO V2.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.goldGlow,
  },
  backButton: { width: 64 },
  backText: { fontFamily: fonts.display, fontSize: fontSize.sm, color: colors.gold, letterSpacing: letterSpacing.snug },
  headerTitle: { fontFamily: fonts.display, fontSize: fontSize.xl, color: colors.bone, letterSpacing: letterSpacing.wide, textAlign: 'center' },
  scroll: { padding: spacing.md, paddingBottom: spacing.xxxl },
  section: {
    fontFamily: fonts.display, fontSize: fontSize.sm, color: colors.gold,
    letterSpacing: letterSpacing.medium, marginTop: spacing.xl, marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.bgSecondary, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.goldDim, padding: spacing.md,
  },
  label: { fontFamily: fonts.display, fontSize: fontSize.xs, color: colors.boneDim, letterSpacing: letterSpacing.snug, marginBottom: spacing.sm },
  input: {
    fontFamily: fonts.display, fontSize: fontSize.md, color: colors.bone,
    backgroundColor: colors.bgTertiary, borderRadius: borderRadius.sm,
    borderWidth: 1, borderColor: colors.goldDim,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm, marginBottom: spacing.md,
  },
  divider: { height: 1, backgroundColor: colors.goldDim, marginVertical: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toggle: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm, borderWidth: 1,
    borderColor: colors.goldDim, backgroundColor: colors.bgTertiary,
  },
  toggleOn: { backgroundColor: colors.goldDim },
  toggleText: { fontFamily: fonts.display, fontSize: fontSize.xs, color: colors.boneDim, letterSpacing: letterSpacing.snug },
  toggleTextOn: { color: colors.bone },
  saveBtn: { backgroundColor: colors.goldDim, borderRadius: borderRadius.md, paddingVertical: spacing.md, alignItems: 'center' },
  saveBtnText: { fontFamily: fonts.display, fontSize: fontSize.sm, color: colors.bone, letterSpacing: letterSpacing.medium },
  version: { fontFamily: fonts.display, fontSize: fontSize.xs, color: colors.goldDim, letterSpacing: letterSpacing.medium, textAlign: 'center', paddingVertical: spacing.sm },
  segmentedRow: {
    flexDirection: 'row',
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.goldDim,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    backgroundColor: colors.bgTertiary,
  },
  segmentActive: {
    backgroundColor: colors.goldDim,
  },
  segmentText: {
    fontFamily: fonts.display,
    fontSize: fontSize.xs,
    color: colors.boneDim,
    letterSpacing: letterSpacing.snug,
  },
  segmentTextActive: {
    color: colors.bone,
  },
});

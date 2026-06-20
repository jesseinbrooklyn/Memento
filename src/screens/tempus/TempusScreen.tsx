import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';
import { useEntranceAnimation } from '../../hooks/useEntranceAnimation';
import { colors, spacing, letterSpacing, fontSize } from '../../theme/tokens';
import { fonts } from '../../theme/fonts';
import { usePreferencesStore } from '../../stores/preferences';
import { calculateRemainingDays, calculateLifeExpectancy } from '../../utils/lifeCalculator';
import { parseBirthDate } from '../../utils/date';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OrnateHourglass } from '../../components/OrnateHourglass';

// Shown when no birthdate is set — roughly 40.6 years, a neutral starting point.
const DEFAULT_DAYS_REMAINING = 14827;

export const TempusScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { birthDate, lifeFactors } = usePreferencesStore();

  const lifeExpectancy = calculateLifeExpectancy(lifeFactors);
  const parsedBirth = parseBirthDate(birthDate);
  const isValidDate = parsedBirth !== null;
  const daysRemaining = isValidDate
    ? calculateRemainingDays(parsedBirth!, lifeFactors)
    : DEFAULT_DAYS_REMAINING;

  const metricsAnim = useEntranceAnimation({ delay: 200 });
  const secondaryAnim = useEntranceAnimation({ delay: 400 });

  let elapsedPercent = 50;
  if (isValidDate) {
    const totalDays = lifeExpectancy * 365.25;
    elapsedPercent = ((totalDays - daysRemaining) / totalDays) * 100;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.headerTitle}>TEMPUS</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <Animated.View style={[styles.metricsContainer, metricsAnim]}>
          <Text style={styles.mainMetric}>{daysRemaining.toLocaleString()}</Text>
          <Text style={styles.metricLabel}>DAYS REMAINING</Text>

          <View style={styles.secondaryRow}>
            <View style={styles.subMetric}>
              <Text style={styles.subMetricVal}>{Math.floor(daysRemaining / 7).toLocaleString()}</Text>
              <Text style={styles.subMetricLbl}>WEEKS</Text>
            </View>
            <View style={styles.subMetric}>
              <Text style={styles.subMetricVal}>{Math.floor(daysRemaining / 365.25).toLocaleString()}</Text>
              <Text style={styles.subMetricLbl}>BIRTHDAYS</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.hourglassContainer, secondaryAnim]}>
          <OrnateHourglass percentage={elapsedPercent} />
          <Text style={styles.progressText}>{elapsedPercent.toFixed(1)}% OF LIFE ELAPSED</Text>
          <Text style={styles.settingsHint}>Adjust your variables in Settings.</Text>
        </Animated.View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.goldGlow,
  },
  headerTitle: {
    fontFamily: fonts.display,
    fontSize: fontSize.xl,
    color: colors.bone,
    letterSpacing: letterSpacing.wide,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  metricsContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    borderBottomWidth: 1,
    borderBottomColor: colors.goldGlow,
  },
  mainMetric: {
    fontFamily: fonts.display,
    fontSize: fontSize.titan,
    color: colors.bone,
    letterSpacing: letterSpacing.snug,
  },
  metricLabel: {
    fontFamily: fonts.body,
    fontSize: fontSize.body,
    color: colors.goldDim,
    letterSpacing: letterSpacing.medium,
    marginTop: spacing.sm,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: spacing.xxxl,
    marginTop: spacing.xl,
  },
  subMetric: {
    alignItems: 'center',
  },
  subMetricVal: {
    fontFamily: fonts.display,
    fontSize: fontSize.xxl,
    color: colors.bone,
  },
  subMetricLbl: {
    fontFamily: fonts.body,
    fontSize: fontSize.xs,
    color: colors.goldDim,
    letterSpacing: letterSpacing.snug,
    marginTop: spacing.xs,
  },
  hourglassContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  progressText: {
    fontFamily: fonts.display,
    fontSize: fontSize.sm,
    color: colors.boneDim,
    letterSpacing: letterSpacing.snug,
    marginTop: spacing.lg,
  },
  settingsHint: {
    fontFamily: fonts.bodyItalic,
    fontSize: fontSize.md,
    color: colors.boneGhost,
    marginTop: spacing.md,
  },
});

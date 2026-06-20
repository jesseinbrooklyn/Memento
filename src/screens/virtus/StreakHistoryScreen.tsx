import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, fontSize, letterSpacing, borderRadius } from '../../theme/tokens';
import { fonts } from '../../theme/fonts';
import { usePracticeStore } from '../../stores/practice';
import { PracticeCalendar } from '../../components/PracticeCalendar';
import { VirtusStackParamList } from '../../navigation/VirtusNavigator';
import { ROUTES } from '../../navigation/routes';

interface Props {
  navigation: NativeStackNavigationProp<VirtusStackParamList, typeof ROUTES.StreakHistory>;
}

function computeStreak(completedDates: string[]): number {
  const today = new Date();
  let streak = 0;
  let cursor = new Date(today);
  const set = new Set(completedDates);
  while (true) {
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`;
    if (!set.has(key)) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export default function StreakHistoryScreen({ navigation }: Props) {
  const { totalDays, completedDates } = usePracticeStore();
  const streak = computeStreak(completedDates);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>BACK</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>HISTORIA</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.metricsRow}>
          <View style={styles.metricBlock}>
            <Text style={styles.metricNumber}>{totalDays.toLocaleString()}</Text>
            <Text style={styles.metricLabel}>DAYS OF DISCIPLINE</Text>
          </View>
          <View style={styles.dividerVertical} />
          <View style={styles.metricBlock}>
            <Text style={styles.metricNumber}>{streak}</Text>
            <Text style={styles.metricLabel}>CURRENT STREAK</Text>
          </View>
        </View>

        <View style={styles.calendarSection}>
          <Text style={styles.calendarLabel}>LAST 90 DAYS</Text>
          <PracticeCalendar completedDates={completedDates} days={90} />
        </View>

        <Text style={styles.inscription}>
          THE DISCIPLINE OF THE MIND IS THE DISCIPLINE OF THE WILL.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.goldGlow,
  },
  backButton: {
    width: 64,
  },
  backText: {
    fontFamily: fonts.display,
    fontSize: fontSize.sm,
    color: colors.gold,
    letterSpacing: letterSpacing.snug,
  },
  headerTitle: {
    fontFamily: fonts.display,
    fontSize: fontSize.xl,
    color: colors.bone,
    letterSpacing: letterSpacing.wide,
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
    alignItems: 'center',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
    borderBottomWidth: 1,
    borderBottomColor: colors.goldGlow,
    width: '100%',
  },
  metricBlock: {
    flex: 1,
    alignItems: 'center',
  },
  metricNumber: {
    fontFamily: fonts.display,
    fontSize: fontSize.titan,
    color: colors.bone,
    letterSpacing: letterSpacing.snug,
  },
  metricLabel: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    color: colors.goldDim,
    letterSpacing: letterSpacing.medium,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  dividerVertical: {
    width: 1,
    height: 64,
    backgroundColor: colors.goldGlow,
  },
  calendarSection: {
    marginTop: spacing.xxxl,
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  calendarLabel: {
    fontFamily: fonts.display,
    fontSize: fontSize.sm,
    color: colors.gold,
    letterSpacing: letterSpacing.snug,
    marginBottom: spacing.lg,
  },
  inscription: {
    fontFamily: fonts.display,
    fontSize: fontSize.xs,
    color: colors.goldDim,
    letterSpacing: letterSpacing.medium,
    textAlign: 'center',
    marginTop: spacing.xxxl,
    paddingHorizontal: spacing.xl,
    lineHeight: 18,
  },
});

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { useEntranceAnimation } from '../../hooks/useEntranceAnimation';
import { colors, spacing, letterSpacing, fontSize } from '../../theme/tokens';
import { fonts } from '../../theme/fonts';
import { usePracticeStore } from '../../stores/practice';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { VirtusStackParamList } from '../../navigation/VirtusNavigator';
import { PracticeCalendar } from '../../components/PracticeCalendar';
import { ROUTES } from '../../navigation/routes';

type NavigationProp = NativeStackNavigationProp<VirtusStackParamList, typeof ROUTES.TabVirtus>;

interface Props {
  navigation: NavigationProp;
}

export const VirtusScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { totalDays, completedDates } = usePracticeStore();

  const metricsAnim = useEntranceAnimation({ delay: 200 });
  const actionsAnim = useEntranceAnimation({ delay: 400 });

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.headerTitle}>VIRTUS</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <Animated.View style={[styles.metricsContainer, metricsAnim]}>
          <Text style={styles.mainMetric}>{totalDays.toLocaleString()}</Text>
          <Text style={styles.metricLabel}>DAYS OF DISCIPLINE</Text>

          <View style={styles.calendarContainer}>
            <Text style={styles.calendarLabel}>LAST 30 DAYS</Text>
            <PracticeCalendar completedDates={completedDates} days={30} />
          </View>
        </Animated.View>

        <Animated.View style={[styles.actionsContainer, actionsAnim]}>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => navigation.navigate(ROUTES.StreakHistory)}
          >
            <Text style={styles.actionLabel}>FULL HISTORY</Text>
            <Text style={styles.actionChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => navigation.navigate(ROUTES.Settings)}
          >
            <Text style={styles.actionLabel}>SETTINGS</Text>
            <Text style={styles.actionChevron}>›</Text>
          </TouchableOpacity>
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
  calendarContainer: {
    marginTop: spacing.xxxl,
    alignItems: 'center',
  },
  calendarLabel: {
    fontFamily: fonts.display,
    fontSize: fontSize.sm,
    color: colors.gold,
    letterSpacing: letterSpacing.snug,
    marginBottom: spacing.lg,
  },
  actionsContainer: {
    paddingTop: spacing.lg,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.goldGlow,
  },
  actionLabel: {
    fontFamily: fonts.display,
    fontSize: fontSize.md,
    color: colors.bone,
    letterSpacing: letterSpacing.medium,
  },
  actionChevron: {
    fontFamily: fonts.display,
    fontSize: fontSize.xxl,
    color: colors.goldMuted,
  },
});

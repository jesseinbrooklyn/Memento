import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, letterSpacing } from '../theme/tokens';
import { fonts } from '../theme/fonts';

interface Props {
  completedDates: string[];
  days?: number;
}

const DAY_INITIALS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function toDateString(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const PracticeCalendar: React.FC<Props> = ({ completedDates, days = 30 }) => {
  const today = new Date();

  const dots = Array.from({ length: days }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (days - 1 - i));
    const dateStr = toDateString(d);
    const isCompleted = completedDates.includes(dateStr);
    const dayIndex = d.getDay(); // 0=Sun
    return { dateStr, isCompleted, dayInitial: DAY_INITIALS[dayIndex] };
  });

  return (
    <View style={styles.container}>
      <View style={styles.dayRow}>
        {DAY_INITIALS.map((initial, idx) => (
          <View key={idx} style={styles.dayCell}>
            <Text style={styles.dayInitial}>{initial}</Text>
          </View>
        ))}
      </View>
      <View style={styles.grid}>
        {dots.map(({ dateStr, isCompleted }) => (
          <View
            key={dateStr}
            style={[styles.dot, isCompleted ? styles.dotComplete : styles.dotMissed]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  dayRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
    width: 7 * (22 + spacing.sm),
    justifyContent: 'flex-start',
  },
  dayCell: {
    width: 22,
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  dayInitial: {
    fontFamily: fonts.display,
    fontSize: fontSize.xs,
    color: colors.boneGhost,
    letterSpacing: letterSpacing.tight,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    width: 7 * (22 + spacing.sm),
  },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  dotComplete: {
    backgroundColor: colors.goldDim,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  dotMissed: {
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.dividerSubtle,
  },
});

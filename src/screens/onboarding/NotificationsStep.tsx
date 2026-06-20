import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MementoButton } from '../../components/MementoButton';
import { PreferencesRepository } from '../../repositories/preferences';
import { usePracticeStore } from '../../stores/practice';
import { usePreferencesStore } from '../../stores/preferences';
import {
  requestNotificationPermissions,
  scheduleBells,
} from '../../utils/notifications';
import { colors, spacing, letterSpacing, fontSize } from '../../theme/tokens';
import { fonts } from '../../theme/fonts';

interface Props {
  onComplete: () => Promise<void>;
}

export const NotificationsStep: React.FC<Props> = ({ onComplete }) => {
  const [requesting, setRequesting] = useState(false);
  const [declined, setDeclined] = useState(false);

  const prefs = usePreferencesStore.getState();
  const practice = usePracticeStore.getState();

  // Default times are already set in the store (06:30 / 20:00)
  const morningDisplay = prefs.morningBellTime ?? '06:30';
  const eveningDisplay = prefs.eveningBellTime ?? '20:00';

  // Format HH:MM → "6:30 AM" style for display
  const formatTime = (hhmm: string): string => {
    const [h, m] = hhmm.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return hhmm;
    const suffix = h < 12 ? 'AM' : 'PM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
  };

  const handleAllow = async () => {
    if (requesting) return;
    setRequesting(true);
    try {
      const granted = await requestNotificationPermissions();
      if (granted) {
        // Persist bell times and schedule notifications
        await PreferencesRepository.updateBellTimes(morningDisplay, eveningDisplay);
        await scheduleBells(
          morningDisplay,
          eveningDisplay,
          practice.morningComplete,
          practice.eveningComplete,
        );
      }
    } finally {
      setRequesting(false);
    }
    await onComplete();
  };

  const handleSkip = async () => {
    setDeclined(true);
    await onComplete();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Bell icon row */}
        <Text style={styles.bellGlyph}>◈</Text>

        <Text style={styles.title}>THE DAILY BELLS</Text>
        <Text style={styles.subtitle}>
          Two reminders. One to begin the day with intention. One to close it with reflection.
        </Text>

        {/* Time display */}
        <View style={styles.timesBlock}>
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>MORNING</Text>
            <Text style={styles.timeValue}>{formatTime(morningDisplay)}</Text>
          </View>
          <View style={styles.timeDivider} />
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>EVENING</Text>
            <Text style={styles.timeValue}>{formatTime(eveningDisplay)}</Text>
          </View>
        </View>

        <Text style={styles.note}>
          You can change these times in Settings at any moment.
        </Text>
      </View>

      <View style={styles.footer}>
        <MementoButton
          label={requesting ? 'REQUESTING...' : 'ALLOW NOTIFICATIONS'}
          onPress={handleAllow}
          disabled={requesting || declined}
        />
        <TouchableOpacity onPress={handleSkip} disabled={requesting}>
          <Text style={styles.skipLink}>Not now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  bellGlyph: {
    fontFamily: fonts.body,
    fontSize: fontSize.hero,
    color: colors.goldDim,
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: fontSize.xl,
    color: colors.bone,
    letterSpacing: letterSpacing.wide,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.bodyItalic,
    fontSize: fontSize.body,
    color: colors.boneDim,
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 26,
    maxWidth: 320,
  },
  timesBlock: {
    marginTop: spacing.xxl,
    width: '100%',
    maxWidth: 300,
    borderWidth: 0.5,
    borderColor: colors.goldDim,
    borderRadius: 4,
    backgroundColor: colors.bgSecondary,
    overflow: 'hidden',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  timeDivider: {
    height: 0.5,
    backgroundColor: colors.goldDim,
    marginHorizontal: spacing.lg,
  },
  timeLabel: {
    fontFamily: fonts.display,
    fontSize: fontSize.xs,
    color: colors.goldMuted,
    letterSpacing: letterSpacing.snug,
  },
  timeValue: {
    fontFamily: fonts.body,
    fontSize: fontSize.body,
    color: colors.bone,
    letterSpacing: letterSpacing.tight,
  },
  note: {
    fontFamily: fonts.bodyItalic,
    fontSize: fontSize.sm,
    color: colors.boneGhost,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  footer: {
    paddingBottom: spacing.xxl,
    alignItems: 'center',
    gap: spacing.lg,
  },
  skipLink: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    color: colors.boneGhost,
    letterSpacing: letterSpacing.tight,
  },
});

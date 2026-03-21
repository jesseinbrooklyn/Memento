import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import Animated from 'react-native-reanimated';
import { useEntranceAnimation } from '../../hooks/useEntranceAnimation';
import { colors, spacing, letterSpacing, borderRadius } from '../../theme/tokens';
import { fonts } from '../../theme/fonts';
import { usePracticeStore } from '../../stores/practice';
import { usePreferencesStore } from '../../stores/preferences';
import { PreferencesRepository } from '../../repositories/preferences';
import { scheduleBells, requestNotificationPermissions } from '../../utils/notifications';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const VirtusScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { totalDays, completedDates } = usePracticeStore();
  const { morningBellTime, eveningBellTime } = usePreferencesStore();

  const metricsAnim = useEntranceAnimation({ delay: 200 });
  const settingsAnim = useEntranceAnimation({ delay: 400 });

  const [morning, setMorning] = useState(morningBellTime || '06:30');
  const [evening, setEvening] = useState(eveningBellTime || '20:00');

  const handleSaveSettings = async () => {
    PreferencesRepository.savePreference('morningBellTime', morning);
    PreferencesRepository.savePreference('eveningBellTime', evening);
    usePreferencesStore.getState().setPreferences({ morningBellTime: morning, eveningBellTime: evening });
    
    const granted = await requestNotificationPermissions();
    if (granted) {
       await scheduleBells(morning, evening);
    }
  };

  const dots = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const isCompleted = completedDates.includes(dStr);
    return isCompleted;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.headerTitle}>VIRTUS</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Animated.View style={[styles.metricsContainer, metricsAnim]}>
          <Text style={styles.mainMetric}>{totalDays.toLocaleString()}</Text>
          <Text style={styles.metricLabel}>DAYS OF DISCIPLINE</Text>

          <View style={styles.gridContainer}>
             <Text style={styles.gridLabel}>LAST 30 DAYS</Text>
             <View style={styles.grid}>
                {dots.map((isComplete, idx) => (
                   <View key={idx} style={[styles.dot, isComplete ? styles.dotComplete : styles.dotMissed]} />
                ))}
             </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.settingsContainer, settingsAnim]}>
           <Text style={styles.sectionTitle}>ROUTINE SETTINGS</Text>
           
           <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>MORNING AWAKENING</Text>
              <TextInput 
                 style={styles.timeInput} 
                 value={morning} 
                 onChangeText={setMorning} 
                 onBlur={handleSaveSettings}
                 placeholder="06:30"
                 placeholderTextColor={colors.boneGhost}
                 keyboardType="numbers-and-punctuation"
              />
           </View>

           <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>EVENING REFLECTION</Text>
              <TextInput 
                 style={styles.timeInput} 
                 value={evening} 
                 onChangeText={setEvening} 
                 onBlur={handleSaveSettings}
                 placeholder="20:00"
                 placeholderTextColor={colors.boneGhost}
                 keyboardType="numbers-and-punctuation"
              />
           </View>

           <Text style={styles.settingsFootnote}>Local notifications are scheduled at these times.</Text>
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
    fontSize: 20,
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
    fontSize: 72,
    color: colors.bone,
    letterSpacing: 2,
  },
  metricLabel: {
    fontFamily: 'CormorantGaramond-Regular',
    fontSize: 16,
    color: colors.goldDim,
    letterSpacing: 4,
    marginTop: spacing.sm,
  },
  gridContainer: {
    marginTop: spacing.xxxl,
    alignItems: 'center',
  },
  gridLabel: {
    fontFamily: fonts.display,
    fontSize: 12,
    color: colors.gold,
    letterSpacing: 2,
    marginBottom: spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 200,
    gap: 8,
    justifyContent: 'center',
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingsContainer: {
    padding: spacing.xl,
  },
  sectionTitle: {
    fontFamily: fonts.display,
    fontSize: 14,
    color: colors.gold,
    letterSpacing: 2,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  settingLabel: {
    fontFamily: 'CormorantGaramond-Regular',
    fontSize: 16,
    color: colors.bone,
    letterSpacing: 2,
  },
  timeInput: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.gold,
    backgroundColor: colors.bgSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.goldDim,
    textAlign: 'center',
    width: 100,
  },
  settingsFootnote: {
    fontFamily: 'CormorantGaramond-Italic',
    fontSize: 14,
    color: colors.boneGhost,
    textAlign: 'center',
    marginTop: spacing.xl,
    lineHeight: 20,
  }
});

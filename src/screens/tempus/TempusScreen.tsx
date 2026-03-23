import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import Animated from 'react-native-reanimated';
import { useEntranceAnimation } from '../../hooks/useEntranceAnimation';
import { colors, spacing, letterSpacing, borderRadius } from '../../theme/tokens';
import { fonts } from '../../theme/fonts';
import { usePreferencesStore } from '../../stores/preferences';
import { PreferencesRepository } from '../../repositories/preferences';
import { calculateRemainingDays, calculateLifeExpectancy, LifeFactors } from '../../utils/lifeCalculator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OrnateHourglass } from '../../components/OrnateHourglass';
import { LifestyleSliders } from '../../components/tempus/LifestyleSliders';

export const TempusScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { birthDate, lifeFactors, use24HourTime } = usePreferencesStore();
  
  const lifeExpectancy = calculateLifeExpectancy(lifeFactors);
  const parsedBirth = (() => {
    if (birthDate == null || birthDate.length !== 10) return null;
    const parts = birthDate.split('/');
    if (parts.length === 3) {
      const [mm, dd, yyyy] = parts;
      return new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd));
    }
    return null;
  })();
  const isValidDate = parsedBirth != null && !isNaN(parsedBirth.getTime());
  const daysRemaining = isValidDate ? calculateRemainingDays(parsedBirth, lifeFactors) : 14827;

  const metricsAnim = useEntranceAnimation({ delay: 200 });
  const controlsAnim = useEntranceAnimation({ delay: 400 });

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

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
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

            <View style={styles.progressContainer}>
               <OrnateHourglass percentage={elapsedPercent} />
               <Text style={styles.progressText}>{elapsedPercent.toFixed(1)}% OF LIFE ELAPSED</Text>
            </View>
          </Animated.View>

          <Animated.View style={[styles.controlsContainer, controlsAnim]}>
            <Text style={styles.sectionTitle}>ADJUST ALGORITHM</Text>
            <View style={styles.controlGroup}>
              <Text style={styles.controlLabel}>BIRTHDATE (MM/DD/YYYY)</Text>
              <TextInput
                style={[styles.dateInput, Platform.OS === 'web' && { outlineStyle: 'none' } as any]}
                value={birthDate || ''}
                onChangeText={t => {
                   let cleaned = t.replace(/[^\d]/g, '');
                   if (cleaned.length > 2) cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
                   if (cleaned.length > 5) cleaned = cleaned.slice(0, 5) + '/' + cleaned.slice(5);
                   const formatted = cleaned.slice(0, 10);
                   usePreferencesStore.getState().setBirthDate(formatted);
                   PreferencesRepository.updateBirthDate(formatted);
                }}
                placeholder="01/01/1990"
                placeholderTextColor={colors.boneGhost}
                keyboardType="number-pad"
              />
            </View>

            <LifestyleSliders />

            <View style={styles.controlGroup}>
              <Text style={styles.controlLabel}>TIME FORMAT</Text>
              <View style={styles.timeFormatRow}>
                <TouchableOpacity
                  style={[styles.timeFormatBtn, !use24HourTime && styles.timeFormatBtnActive]}
                  onPress={() => PreferencesRepository.updateUse24HourTime(false)}
                >
                  <Text style={[styles.timeFormatText, !use24HourTime && styles.timeFormatTextActive]}>12 HR</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.timeFormatBtn, use24HourTime && styles.timeFormatBtnActive]}
                  onPress={() => PreferencesRepository.updateUse24HourTime(true)}
                >
                  <Text style={[styles.timeFormatText, use24HourTime && styles.timeFormatTextActive]}>24 HR</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>

        </ScrollView>
      </KeyboardAvoidingView>
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
  secondaryRow: {
    flexDirection: 'row',
    gap: spacing.xxxl,
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
  subMetric: {
    alignItems: 'center',
  },
  subMetricVal: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.bone,
  },
  subMetricLbl: {
    fontFamily: 'CormorantGaramond-Regular',
    fontSize: 10,
    color: colors.goldDim,
    letterSpacing: 2,
    marginTop: 4,
  },
  progressContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  progressText: {
    fontFamily: fonts.display,
    fontSize: 12,
    color: colors.boneDim,
    letterSpacing: 2,
    marginTop: spacing.lg,
  },
  controlsContainer: {
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
  controlGroup: {
    marginBottom: spacing.lg,
  },
  controlLabel: {
    fontFamily: 'CormorantGaramond-Regular',
    fontSize: 14,
    color: colors.boneDim,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  dateInput: {
    backgroundColor: colors.bgSecondary,
    borderWidth: 1,
    borderColor: colors.goldDim,
    borderRadius: borderRadius.sm,
    color: colors.bone,
    fontFamily: 'CormorantGaramond-Regular',
    fontSize: 18,
    padding: spacing.md,
    textAlign: 'center',
  },
  timeFormatRow: {
    flexDirection: 'row',
    backgroundColor: colors.bgSecondary,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.goldGlow,
    overflow: 'hidden',
  },
  timeFormatBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  timeFormatBtnActive: {
    backgroundColor: colors.goldDim,
  },
  timeFormatText: {
    fontFamily: fonts.display,
    fontSize: 10,
    color: colors.boneDim,
    letterSpacing: 1,
  },
  timeFormatTextActive: {
    color: colors.bgPrimary,
  },
});

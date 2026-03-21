import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
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
  const { birthDate, lifeFactors } = usePreferencesStore();
  
  const lifeExpectancy = calculateLifeExpectancy(lifeFactors);
  const parsedBirth = birthDate != null && birthDate.length === 10 ? new Date(birthDate.replace(/\//g, '-')) : null;
  const isValidDate = parsedBirth != null && !isNaN(parsedBirth.getTime());
  const daysRemaining = isValidDate ? calculateRemainingDays(parsedBirth, lifeFactors) : 14827;

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
          
          <View style={styles.metricsContainer}>
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
          </View>

          <View style={styles.controlsContainer}>
            <Text style={styles.sectionTitle}>ADJUST ALGORITHM</Text>
            <View style={styles.controlGroup}>
              <Text style={styles.controlLabel}>BIRTHDATE (YYYY/MM/DD)</Text>
              <TextInput
                style={[styles.dateInput, Platform.OS === 'web' && { outlineStyle: 'none' } as any]}
                value={birthDate || ''}
                onChangeText={t => {
                   let cleaned = t.replace(/[^\d]/g, '');
                   if (cleaned.length > 4) cleaned = cleaned.slice(0, 4) + '/' + cleaned.slice(4);
                   if (cleaned.length > 7) cleaned = cleaned.slice(0, 7) + '/' + cleaned.slice(7);
                   const formatted = cleaned.slice(0, 10);
                   usePreferencesStore.getState().setBirthDate(formatted);
                   PreferencesRepository.updateBirthDate(formatted);
                }}
                placeholder="1990/01/01"
                placeholderTextColor={colors.boneGhost}
                keyboardType="number-pad"
              />
            </View>

            <LifestyleSliders />
          </View>

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
  }
});

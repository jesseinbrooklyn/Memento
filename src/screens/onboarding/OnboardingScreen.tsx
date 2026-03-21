import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { colors, spacing, letterSpacing, borderRadius } from '../../theme/tokens';
import { fonts } from '../../theme/fonts';
import { MementoButton } from '../../components/MementoButton';
import { OrnateHourglass } from '../../components/OrnateHourglass';
import { LifestyleSliders } from '../../components/tempus/LifestyleSliders';
import { PreferencesRepository } from '../../repositories/preferences';
import { usePreferencesStore } from '../../stores/preferences';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

interface Props {
  navigation: NavigationProp;
}

export default function OnboardingScreen({ navigation }: Props) {
  const [step, setStep] = useState(0);
  const [birthInput, setBirthInput] = useState('');

  const handleComplete = async () => {
    if (birthInput.length === 10) {
      usePreferencesStore.getState().setBirthDate(birthInput);
      PreferencesRepository.updateBirthDate(birthInput);
    }
    await PreferencesRepository.markOnboardingComplete();
    navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] });
  };

  const formatBirthInput = (t: string) => {
    let cleaned = t.replace(/[^\d]/g, '');
    if (cleaned.length > 4) cleaned = cleaned.slice(0, 4) + '/' + cleaned.slice(4);
    if (cleaned.length > 7) cleaned = cleaned.slice(0, 7) + '/' + cleaned.slice(7);
    setBirthInput(cleaned.slice(0, 10));
  };

  if (step === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.welcomeContent}>
          <OrnateHourglass percentage={50} />
          <Text style={styles.title}>MEMENTO MORI</Text>
          <Text style={styles.subtitle}>
            Remember that you will die.{'\n'}
            Let this knowledge guide how you live.
          </Text>
          <Text style={styles.body}>
            A daily practice in the Stoic tradition.{'\n'}
            Morning intention. Evening reflection.{'\n'}
            The wisdom of those who came before.
          </Text>
        </View>
        <View style={styles.footer}>
          <MementoButton label="BEGIN" onPress={() => setStep(1)} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.setupContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.setupTitle}>CALIBRATE</Text>
          <Text style={styles.setupSubtitle}>
            How many days remain is shaped by when you arrived and how you live.
          </Text>

          <View style={styles.controlGroup}>
            <Text style={styles.controlLabel}>BIRTHDATE (YYYY/MM/DD)</Text>
            <TextInput
              style={[styles.dateInput, Platform.OS === 'web' && { outlineStyle: 'none' } as any]}
              value={birthInput}
              onChangeText={formatBirthInput}
              placeholder="1990/01/01"
              placeholderTextColor={colors.boneGhost}
              keyboardType="number-pad"
            />
            <Text style={styles.optionalNote}>Optional. A default estimate will be used if left blank.</Text>
          </View>

          <LifestyleSliders />
        </ScrollView>

        <View style={styles.footer}>
          <MementoButton label="ENTER" onPress={handleComplete} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  welcomeContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.bone,
    letterSpacing: letterSpacing.ultra,
    marginTop: spacing.xl,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.bodyItalic,
    fontSize: 18,
    color: colors.boneDim,
    textAlign: 'center',
    marginTop: spacing.xl,
    lineHeight: 28,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.boneGhost,
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 26,
  },
  setupContent: {
    padding: spacing.xl,
    paddingTop: spacing.xxxl,
  },
  setupTitle: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.bone,
    letterSpacing: letterSpacing.wide,
    textAlign: 'center',
  },
  setupSubtitle: {
    fontFamily: fonts.bodyItalic,
    fontSize: 16,
    color: colors.boneDim,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xxl,
    lineHeight: 24,
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
  optionalNote: {
    fontFamily: fonts.bodyItalic,
    fontSize: 13,
    color: colors.boneGhost,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  footer: {
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
});

import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TextInput, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { colors, spacing, letterSpacing } from '../../theme/tokens';
import { fonts } from '../../theme/fonts';
import { MementoButton } from '../../components/MementoButton';
import { PracticeRepository } from '../../repositories/practice';
import { getTodaysGratitudePrompt } from '../../utils/dailyContent';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'EveningReflection'>;

interface Props {
  navigation: NavigationProp;
}

const PROMPTS = [
  "What went well today?",
  "Where did you fall short of your own standards?",
  "What didn't matter as much as you thought it would?",
];

export const EveningReflectionScreen: React.FC<Props> = ({ navigation }) => {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState({ well: '', short: '', trivial: '', gratitude: '' });
  const [isSaving, setIsSaving] = useState(false);

  const gratitudePrompt = getTodaysGratitudePrompt();
  
  const currentPrompt = step < 3 ? PROMPTS[step] : gratitudePrompt;
  const currentKey = step === 0 ? 'well' : step === 1 ? 'short' : step === 2 ? 'trivial' : 'gratitude';

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      if (isSaving) return;
      setIsSaving(true);
      try {
        await PracticeRepository.markEveningComplete(responses);
        navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] });
      } catch (e) {
        // Silently capture local db issues
      }
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
        <Text style={styles.step}>{(step + 1)} / 4</Text>
        <Text style={styles.prompt}>{currentPrompt}</Text>
        <TextInput
          style={[styles.input, Platform.OS === 'web' && { outlineStyle: 'none' } as any]}
          placeholder="Reflect..."
          placeholderTextColor="rgba(212,197,160,0.25)"
          value={responses[currentKey as keyof typeof responses]}
          onChangeText={(text) => setResponses({ ...responses, [currentKey]: text })}
          multiline
          blurOnSubmit
          returnKeyType={step < 3 ? "next" : "done"}
          onSubmitEditing={handleNext}
          autoFocus
        />
      </KeyboardAvoidingView>
      <View style={styles.footer}>
        <MementoButton label={step < 3 ? "NEXT" : "DONE"} onPress={handleNext} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  step: {
    fontFamily: fonts.display,
    fontSize: 12,
    color: colors.goldDim,
    letterSpacing: letterSpacing.wide,
    marginBottom: spacing.md,
  },
  prompt: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.gold,
    letterSpacing: letterSpacing.wide,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  input: {
    fontFamily: 'CormorantGaramond-Regular',
    fontSize: 22,
    color: colors.bone,
    textAlign: 'center',
    width: '100%',
    minHeight: 120,
  },
  footer: {
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
});

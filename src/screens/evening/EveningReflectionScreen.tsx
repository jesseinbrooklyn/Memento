import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TextInput, Text, KeyboardAvoidingView, Platform, TouchableOpacity, Keyboard, TextStyle } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { colors, spacing, letterSpacing, fontSize } from '../../theme/tokens';
import { fonts } from '../../theme/fonts';
import { MementoButton } from '../../components/MementoButton';
import { PracticeRepository } from '../../repositories/practice';
import { getTodaysGratitudePrompt } from '../../utils/dailyContent';
import * as Haptics from 'expo-haptics';
import { ROUTES } from '../../navigation/routes';

// Typed helper so we avoid `as any` for the web outline reset
const webOutlineFix: TextStyle | undefined =
  Platform.OS === 'web' ? ({ outlineStyle: 'none' } as unknown as TextStyle) : undefined;

type NavigationProp = NativeStackNavigationProp<RootStackParamList, typeof ROUTES.EveningReflection>;

interface Props {
  navigation: NavigationProp;
}

const PROMPTS = [
  "What went well today?",
  "Where did you fall short of your own standards?",
  "What didn't matter as much as you thought it would?",
];

// Ordered response keys match the PROMPTS array plus the gratitude step.
// Using an array avoids the chained ternary and stays in sync when prompts change.
const RESPONSE_KEYS = ['well', 'short', 'trivial', 'gratitude'] as const;
type ResponseKey = typeof RESPONSE_KEYS[number];

export const EveningReflectionScreen: React.FC<Props> = ({ navigation }) => {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState({ well: '', short: '', trivial: '', gratitude: '' });
  const [isSaving, setIsSaving] = useState(false);

  const gratitudePrompt = getTodaysGratitudePrompt();
  
  const currentPrompt = step < 3 ? PROMPTS[step] : gratitudePrompt;
  const currentKey: ResponseKey = RESPONSE_KEYS[step];

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      if (isSaving) return;
      setIsSaving(true);
      try {
        await PracticeRepository.markEveningComplete(responses);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        navigation.reset({ index: 0, routes: [{ name: ROUTES.Tabs }] });
      } catch (e) {
        // Silently capture local db issues
      }
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss} style={styles.content}>
          <Text style={styles.step}>{(step + 1)} / 4</Text>
          <Text style={styles.prompt}>{currentPrompt}</Text>
          <TextInput
            style={[styles.input, webOutlineFix]}
            placeholder="Reflect..."
            placeholderTextColor={colors.boneGhost}
            value={responses[currentKey as keyof typeof responses]}
            onChangeText={(text) => setResponses({ ...responses, [currentKey]: text })}
            multiline
            blurOnSubmit
            returnKeyType={step < 3 ? "next" : "done"}
            onSubmitEditing={handleNext}
          />
        </TouchableOpacity>
        <View style={styles.footer}>
          <MementoButton label={step < 3 ? "NEXT" : "DONE"} onPress={handleNext} />
        </View>
      </KeyboardAvoidingView>
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
    fontSize: fontSize.sm,
    color: colors.goldDim,
    letterSpacing: letterSpacing.wide,
    marginBottom: spacing.md,
  },
  prompt: {
    fontFamily: fonts.display,
    fontSize: fontSize.xl,
    color: colors.gold,
    letterSpacing: letterSpacing.wide,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  input: {
    fontFamily: fonts.body,
    fontSize: fontSize.xl,
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

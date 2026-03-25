import React, { useState, useMemo } from 'react';
import { View, StyleSheet, SafeAreaView, TextInput, Text, Platform, TouchableOpacity, KeyboardAvoidingView, Keyboard } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { colors, spacing, letterSpacing, borderRadius } from '../../theme/tokens';
import { fonts } from '../../theme/fonts';
import { MementoButton } from '../../components/MementoButton';
import { PracticeRepository } from '../../repositories/practice';
import * as Haptics from 'expo-haptics';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MorningIntention'>;

interface Props {
  navigation: NavigationProp;
}

const INTENTION_SUGGESTIONS = [
  "I will act only on what is within my control.",
  "I will meet difficulty without complaint.",
  "I will speak less and listen more.",
  "I will not postpone what matters.",
  "I will practice patience with those around me.",
  "I will do my work as if someone I respect were watching.",
  "I will let go of one thing I cannot change.",
  "I will be present for the people who need me.",
  "I will choose courage over comfort.",
  "I will not waste time on what does not deserve it.",
  "I will respond to frustration with stillness.",
  "I will treat my body as something borrowed.",
  "I will finish what I start today.",
  "I will forgive one thing I have been holding onto.",
  "I will remember that this day will not come again.",
];

function pickRandom(arr: string[], count: number): string[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export const MorningIntentionScreen: React.FC<Props> = ({ navigation }) => {
  const [intention, setIntention] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const suggestions = useMemo(() => pickRandom(INTENTION_SUGGESTIONS, 3), []);

  const handleComplete = async () => {
    if (!intention.trim() || isSaving) return;
    setIsSaving(true);
    try {
      await PracticeRepository.markMorningComplete(intention.trim());
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] });
    } catch (e) {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss} style={styles.content}>
          <Text style={styles.prompt}>What is your intention for today?</Text>
          <TextInput
            style={[styles.input, Platform.OS === 'web' && { outlineStyle: 'none' } as any]}
            placeholder="I will..."
            placeholderTextColor="rgba(212,197,160,0.25)"
            value={intention}
            onChangeText={setIntention}
            multiline
            blurOnSubmit
            returnKeyType="done"
            onSubmitEditing={handleComplete}
            maxLength={140}
          />
          <View style={styles.suggestions}>
            {suggestions.map((s, i) => (
              <TouchableOpacity key={i} style={styles.chip} onPress={() => setIntention(s)}>
                <Text style={styles.chipText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
        <View style={styles.footer}>
          <MementoButton label="BEGIN DAY" onPress={handleComplete} />
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
    fontSize: 24,
    color: colors.bone,
    textAlign: 'center',
    width: '100%',
    minHeight: 100,
  },
  suggestions: {
    marginTop: spacing.xl,
    gap: spacing.sm,
    width: '100%',
    alignItems: 'center',
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.goldDim,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    maxWidth: '100%',
  },
  chipText: {
    fontFamily: fonts.bodyItalic,
    fontSize: 16,
    color: colors.boneDim,
    textAlign: 'center',
  },
  footer: {
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
});

import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TextInput, Text, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { colors, spacing, letterSpacing } from '../../theme/tokens';
import { fonts } from '../../theme/fonts';
import { MementoButton } from '../../components/MementoButton';
import { PracticeRepository } from '../../repositories/practice';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MorningIntention'>;

interface Props {
  navigation: NavigationProp;
}

export const MorningIntentionScreen: React.FC<Props> = ({ navigation }) => {
  const [intention, setIntention] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleComplete = async () => {
    if (!intention.trim() || isSaving) return;
    setIsSaving(true);
    try {
      await PracticeRepository.markMorningComplete(intention.trim());
      navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] });
    } catch (e) {
      // Silently swallow db exceptions
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
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
          autoFocus
          maxLength={140}
        />
      </View>
      <View style={styles.footer}>
        <MementoButton label="BEGIN DAY" onPress={handleComplete} />
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
  footer: {
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
});

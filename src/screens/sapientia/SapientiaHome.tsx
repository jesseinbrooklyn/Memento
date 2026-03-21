import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SapientiaStackParamList } from '../../navigation/SapientiaNavigator';
import { colors, spacing, letterSpacing } from '../../theme/tokens';
import { fonts } from '../../theme/fonts';
import { getTodaysQuote } from '../../utils/dailyContent';
import { DailyQuote } from '../../components/DailyQuote';
import { MementoButton } from '../../components/MementoButton';
import { useQuotesStore } from '../../stores/quotes';
import { QuoteRepository } from '../../repositories/quotes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type NavigationProp = NativeStackNavigationProp<SapientiaStackParamList, 'SapientiaHome'>;

interface Props {
  navigation: NavigationProp;
}

export const SapientiaHome: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const todaysQuote = getTodaysQuote();
  const savedQuotes = useQuotesStore(state => state.savedQuotes);
  const [isSaving, setIsSaving] = useState(false);

  const existingSave = savedQuotes.find(q => q.quote_id === todaysQuote.id);
  const isSaved = !!existingSave;

  const toggleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      if (isSaved) {
        await QuoteRepository.removeQuote(existingSave.id);
      } else {
        await QuoteRepository.saveQuote(todaysQuote.id);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.headerTitle}>SAPIENTIA</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CommonplaceBook')}>
          <Text style={styles.headerBook}>LIBER</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <DailyQuote quote={todaysQuote} showContext={true} />

        <View style={styles.themeTags}>
          {todaysQuote.themes.map(t => (
            <Text key={t} style={styles.tagLabel}>#{t.toUpperCase()}</Text>
          ))}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={toggleSave} disabled={isSaving}>
            <Text style={[styles.saveAction, isSaved && styles.savedAction]}>
              {isSaved ? '[ SAVED ]' : '[ SAVE ]'}
            </Text>
          </TouchableOpacity>

          <MementoButton
            label="VIEW MORE"
            onPress={() => navigation.navigate('QuoteLibrary')}
          />
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
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
  headerBook: {
    fontFamily: fonts.display,
    fontSize: 14,
    color: colors.gold,
    letterSpacing: letterSpacing.wide,
  },
  content: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  themeTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
  },
  tagLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.goldDim,
    letterSpacing: 1,
  },
  actions: {
    marginTop: spacing.xxl,
    alignItems: 'center',
    gap: spacing.lg,
  },
  saveAction: {
    fontFamily: fonts.display,
    fontSize: 12,
    color: colors.boneDim,
    letterSpacing: 2,
  },
  savedAction: {
    color: colors.gold,
  },
});

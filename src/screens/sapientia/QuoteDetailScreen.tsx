import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { SapientiaStackParamList } from '../../navigation/SapientiaNavigator';
import { colors, spacing, letterSpacing } from '../../theme/tokens';
import { fonts } from '../../theme/fonts';
import { DailyQuote } from '../../components/DailyQuote';
import { useQuotesStore } from '../../stores/quotes';
import { QuoteRepository } from '../../repositories/quotes';
import * as Haptics from 'expo-haptics';

type QuoteDetailRouteProp = RouteProp<SapientiaStackParamList, 'QuoteDetail'>;
type NavigationProp = NativeStackNavigationProp<SapientiaStackParamList, 'QuoteDetail'>;

interface Props {
  route: QuoteDetailRouteProp;
  navigation: NavigationProp;
}

export const QuoteDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { quote } = route.params;
  const savedQuotes = useQuotesStore(state => state.savedQuotes);
  const [isSaving, setIsSaving] = useState(false);

  const existingSave = savedQuotes.find(q => q.quote_id === quote.id);
  const isSaved = !!existingSave;

  const toggleSave = async () => {
    if (isSaving) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsSaving(true);
    try {
      if (isSaved) {
        await QuoteRepository.removeQuote(existingSave.id);
      } else {
        await QuoteRepository.saveQuote(quote.id);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          navigation.goBack();
        }}>
          <Text style={styles.headerAction}>[ BACK ]</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleSave} disabled={isSaving}>
          <Text style={[styles.headerAction, isSaved && styles.savedAction]}>
            {isSaved ? '[ SAVED ]' : '[ SAVE ]'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <DailyQuote quote={quote} showContext={true} />
        
        <View style={styles.themeTags}>
          {quote.themes.map(t => (
             <Text key={t} style={styles.tagLabel}>#{t.toUpperCase()}</Text>
          ))}
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
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.goldGlow,
  },
  headerAction: {
    fontFamily: fonts.display,
    fontSize: 12,
    color: colors.boneDim,
    letterSpacing: 2,
  },
  savedAction: {
    color: colors.gold,
  },
  content: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  themeTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
  },
  tagLabel: {
    fontFamily: 'CormorantGaramond-Regular',
    fontSize: 14,
    color: colors.goldDim,
    letterSpacing: 1,
  },
});

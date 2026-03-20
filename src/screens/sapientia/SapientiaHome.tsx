import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SapientiaStackParamList } from '../../navigation/SapientiaNavigator';
import { colors, spacing, letterSpacing, borderRadius } from '../../theme/tokens';
import { fonts } from '../../theme/fonts';
import { getTodaysQuote } from '../../utils/dailyContent';
import quotesData from '../../content/quotes.json';
import { Quote } from '../../components/DailyQuote';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type NavigationProp = NativeStackNavigationProp<SapientiaStackParamList, 'SapientiaHome'>;

interface Props {
  navigation: NavigationProp;
}

const THEMES = Array.from(new Set(quotesData.flatMap(q => q.themes))).sort();

export const SapientiaHome: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  
  const todaysQuote = getTodaysQuote();
  const filteredQuotes = selectedTheme 
    ? (quotesData as Quote[]).filter(q => q.themes.includes(selectedTheme))
    : (quotesData as Quote[]);

  const renderQuoteItem = ({ item }: { item: Quote }) => (
    <TouchableOpacity 
      style={styles.quoteCard} 
      onPress={() => navigation.navigate('QuoteDetail', { quote: item })}
    >
      <Text style={styles.quotePreview} numberOfLines={3}>"{item.text}"</Text>
      <Text style={styles.quoteAuthor}>— {item.author.toUpperCase()}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.headerTitle}>SAPIENTIA</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CommonplaceBook')}>
          <Text style={styles.headerBook}>LIBER</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.todayCard}>
        <Text style={styles.sectionLabel}>TODAY's QUOTE</Text>
        <TouchableOpacity 
          style={styles.quoteCard}
          onPress={() => navigation.navigate('QuoteDetail', { quote: todaysQuote })}
        >
          <Text style={styles.quotePreview} numberOfLines={2}>"{todaysQuote.text}"</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.themesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.themesScroll}>
          <TouchableOpacity 
            style={[styles.themeChip, !selectedTheme && styles.themeChipActive]}
            onPress={() => setSelectedTheme(null)}
          >
            <Text style={[styles.themeText, !selectedTheme && styles.themeTextActive]}>All</Text>
          </TouchableOpacity>
          {THEMES.map(theme => (
            <TouchableOpacity 
              key={theme} 
              style={[styles.themeChip, selectedTheme === theme && styles.themeChipActive]}
              onPress={() => setSelectedTheme(theme)}
            >
              <Text style={[styles.themeText, selectedTheme === theme && styles.themeTextActive]}>{theme}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredQuotes}
        keyExtractor={q => q.id}
        renderItem={renderQuoteItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  todayCard: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.goldGlow,
  },
  sectionLabel: {
    fontFamily: fonts.display,
    fontSize: 10,
    color: colors.goldDim,
    letterSpacing: letterSpacing.wide,
    marginBottom: spacing.md,
  },
  themesContainer: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.goldGlow,
  },
  themesScroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  themeChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.goldDim,
  },
  themeChipActive: {
    backgroundColor: colors.goldGlow,
    borderColor: colors.gold,
  },
  themeText: {
    fontFamily: 'CormorantGaramond-Regular',
    fontSize: 16,
    color: colors.boneGhost,
  },
  themeTextActive: {
    color: colors.gold,
  },
  listContent: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  quoteCard: {
    backgroundColor: colors.bgSecondary,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.goldGlow,
  },
  quotePreview: {
    fontFamily: 'CormorantGaramond-Italic',
    fontSize: 18,
    color: colors.bone,
    lineHeight: 28,
  },
  quoteAuthor: {
    fontFamily: fonts.display,
    fontSize: 10,
    color: colors.gold,
    marginTop: spacing.md,
    letterSpacing: 2,
  },
});

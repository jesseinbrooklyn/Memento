import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SapientiaStackParamList } from '../../navigation/SapientiaNavigator';
import { colors, spacing, letterSpacing, borderRadius } from '../../theme/tokens';
import { fonts } from '../../theme/fonts';
import quotesData from '../../content/quotes.json';
import { Quote } from '../../types';

type NavigationProp = NativeStackNavigationProp<SapientiaStackParamList, 'QuoteLibrary'>;

interface Props {
  navigation: NavigationProp;
}

const THEMES = Array.from(new Set(quotesData.flatMap(q => q.themes))).sort();

export const QuoteLibraryScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerAction}>[ BACK ]</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>WISDOM LIBRARY</Text>
        <View style={{ width: 60 }} />
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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {selectedTheme ? `No passages on ${selectedTheme}.` : 'The library is empty.'}
            </Text>
          </View>
        }
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
  headerAction: {
    fontFamily: fonts.display,
    fontSize: 12,
    color: colors.boneDim,
    letterSpacing: 2,
  },
  headerTitle: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.bone,
    letterSpacing: letterSpacing.wide,
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
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.goldDim,
  },
  themeChipActive: {
    backgroundColor: colors.goldGlow,
    borderColor: colors.gold,
  },
  themeText: {
    fontFamily: fonts.body,
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
    fontFamily: fonts.bodyItalic,
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
  emptyContainer: {
    alignItems: 'center',
    marginTop: spacing.xxxl,
  },
  emptyText: {
    fontFamily: 'CormorantGaramond-Italic',
    fontSize: 18,
    color: colors.boneDim,
    textAlign: 'center',
  },
});

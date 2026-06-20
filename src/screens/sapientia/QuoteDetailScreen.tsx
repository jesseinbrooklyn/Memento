import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { SapientiaStackParamList } from '../../navigation/SapientiaNavigator';
import { colors, spacing, letterSpacing, fontSize } from '../../theme/tokens';
import { fonts } from '../../theme/fonts';
import { useQuotesStore } from '../../stores/quotes';
import { QuoteRepository } from '../../repositories/quotes';
import * as Haptics from 'expo-haptics';

type QuoteDetailRouteProp = RouteProp<SapientiaStackParamList, 'QuoteDetail'>;
type NavigationProp = NativeStackNavigationProp<SapientiaStackParamList, 'QuoteDetail'>;

interface Props {
  route: QuoteDetailRouteProp;
  navigation: NavigationProp;
}

// Discipline labels match the three Stoic disciplines of Epictetus
const DISCIPLINE_LABELS: Record<string, string> = {
  desire: 'DISCIPLINE OF DESIRE',
  action: 'DISCIPLINE OF ACTION',
  assent: 'DISCIPLINE OF ASSENT',
};

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
    <SafeAreaView style={styles.safe}>
      {/* ── Header ─────────────────────────────────────────────── */}
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

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Quote ──────────────────────────────────────────────── */}
        <View style={styles.quoteBlock}>
          <Text style={styles.openingMark}>"</Text>
          <Text style={styles.quoteText}>{quote.text}</Text>
          <Text style={styles.closingMark}>"</Text>
        </View>

        {/* ── Attribution ────────────────────────────────────────── */}
        <View style={styles.attributionBlock}>
          <Text style={styles.authorName}>— {quote.author.toUpperCase()} —</Text>
          <Text style={styles.authorDates}>{quote.authorDates}</Text>
          <View style={styles.sourcePill}>
            <Text style={styles.sourceText}>{quote.source}</Text>
          </View>
        </View>

        {/* ── Divider ────────────────────────────────────────────── */}
        <View style={styles.divider} />

        {/* ── Context ────────────────────────────────────────────── */}
        {!!quote.context && (
          <View style={styles.contextBlock}>
            <Text style={styles.sectionLabel}>CONTEXT</Text>
            <Text style={styles.contextText}>{quote.context}</Text>
          </View>
        )}

        {/* ── Discipline + Themes ────────────────────────────────── */}
        <View style={styles.metaBlock}>
          {!!quote.discipline && (
            <View style={styles.disciplineBadge}>
              <Text style={styles.disciplineText}>
                {DISCIPLINE_LABELS[quote.discipline] ?? quote.discipline.toUpperCase()}
              </Text>
            </View>
          )}

          {quote.themes.length > 0 && (
            <View style={styles.tagRow}>
              {quote.themes.map(t => (
                <View key={t} style={styles.tagPill}>
                  <Text style={styles.tagText}>{t.toUpperCase()}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.goldDim,
  },
  headerAction: {
    fontFamily: fonts.display,
    fontSize: fontSize.sm,
    color: colors.boneDim,
    letterSpacing: letterSpacing.snug,
  },
  savedAction: {
    color: colors.gold,
  },

  // ── Scroll container ────────────────────────────────────────────────────────
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },

  // ── Quote block ─────────────────────────────────────────────────────────────
  quoteBlock: {
    alignItems: 'center',
    maxWidth: 440,
    width: '100%',
  },
  openingMark: {
    fontFamily: fonts.bodyItalic,
    fontSize: fontSize.massive,
    color: colors.goldDim,
    lineHeight: fontSize.massive * 0.7,
    alignSelf: 'flex-start',
    marginLeft: -spacing.sm,
  },
  quoteText: {
    fontFamily: fonts.bodyItalic,
    fontSize: fontSize.xl,
    color: colors.bone,
    lineHeight: fontSize.xl * 1.75,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  closingMark: {
    fontFamily: fonts.bodyItalic,
    fontSize: fontSize.massive,
    color: colors.goldDim,
    lineHeight: fontSize.massive * 0.7,
    alignSelf: 'flex-end',
    marginRight: -spacing.sm,
    marginTop: spacing.xs,
  },

  // ── Attribution ─────────────────────────────────────────────────────────────
  attributionBlock: {
    alignItems: 'center',
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  authorName: {
    fontFamily: fonts.display,
    fontSize: fontSize.sm,
    color: colors.gold,
    letterSpacing: letterSpacing.wide,
  },
  authorDates: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    color: colors.boneDim,
    letterSpacing: letterSpacing.tight,
  },
  sourcePill: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 0.5,
    borderColor: colors.goldDim,
    borderRadius: 2,
  },
  sourceText: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    color: colors.boneGhost,
    letterSpacing: letterSpacing.snug,
  },

  // ── Divider ─────────────────────────────────────────────────────────────────
  divider: {
    width: 48,
    height: 0.5,
    backgroundColor: colors.goldDim,
    marginVertical: spacing.xxl,
  },

  // ── Context ─────────────────────────────────────────────────────────────────
  contextBlock: {
    width: '100%',
    maxWidth: 440,
    alignItems: 'center',
  },
  sectionLabel: {
    fontFamily: fonts.display,
    fontSize: fontSize.xs,
    color: colors.goldMuted,
    letterSpacing: letterSpacing.ultra,
    marginBottom: spacing.md,
  },
  contextText: {
    fontFamily: fonts.body,
    fontSize: fontSize.lg,
    color: colors.boneDim,
    lineHeight: fontSize.lg * 1.8,
    textAlign: 'center',
  },

  // ── Meta (discipline + themes) ───────────────────────────────────────────────
  metaBlock: {
    alignItems: 'center',
    marginTop: spacing.xxl,
    gap: spacing.md,
    width: '100%',
    maxWidth: 440,
  },
  disciplineBadge: {
    borderWidth: 0.5,
    borderColor: colors.goldDim,
    borderRadius: 2,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  disciplineText: {
    fontFamily: fonts.display,
    fontSize: fontSize.xs,
    color: colors.gold,
    letterSpacing: letterSpacing.wide,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  tagPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: 'rgba(196,163,90,0.15)',
    backgroundColor: colors.goldGlow,
  },
  tagText: {
    fontFamily: fonts.body,
    fontSize: fontSize.sm,
    color: colors.boneGhost,
    letterSpacing: letterSpacing.tight,
  },
});

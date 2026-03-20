import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, letterSpacing } from '../theme/tokens';
import { fonts } from '../theme/fonts';

export interface Quote {
  id: string;
  text: string;
  author: string;
  source: string;
  authorDates: string;
  context: string;
  themes: string[];
  discipline: 'desire' | 'action' | 'assent';
}

interface DailyQuoteProps {
  quote: Quote;
  showContext?: boolean;
}

export const DailyQuote: React.FC<DailyQuoteProps> = ({ quote, showContext = false }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>"{quote.text}"</Text>
      <Text style={styles.author}>— {quote.author.toUpperCase()}</Text>
      <Text style={styles.source}>
        {quote.source} · {quote.authorDates}
      </Text>
      {showContext && <Text style={styles.context}>{quote.context}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    maxWidth: 480,
  },
  text: {
    fontFamily: fonts.bodyItalic,
    fontSize: 20,
    color: colors.bone,
    lineHeight: 36,
    textAlign: 'center',
    opacity: 0.85,
  },
  author: {
    fontFamily: fonts.display,
    fontSize: 11,
    color: colors.gold,
    letterSpacing: letterSpacing.wide,
    marginTop: spacing.md,
  },
  source: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.boneGhost,
    letterSpacing: 2,
    marginTop: spacing.xs,
  },
  context: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.boneDim,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
});

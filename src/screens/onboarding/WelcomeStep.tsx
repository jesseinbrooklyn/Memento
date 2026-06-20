import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { OrnateHourglass } from '../../components/OrnateHourglass';
import { MementoButton } from '../../components/MementoButton';
import { colors, spacing, letterSpacing, fontSize } from '../../theme/tokens';
import { fonts } from '../../theme/fonts';

interface Props {
  onNext: () => void;
}

export const WelcomeStep: React.FC<Props> = ({ onNext }) => {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <OrnateHourglass percentage={50} />

        <Text style={styles.title}>MEMENTO MORI</Text>

        <Text style={styles.subtitle}>
          Remember that you will die.
        </Text>

        <View style={styles.divider} />

        <Text style={styles.body}>
          Every day begins with a question: what matters, given that your time
          is limited. Every day ends with an accounting: did you live it well.
        </Text>

        <Text style={styles.body}>
          Memento is a daily Stoic practice — morning intention, evening
          reflection, and the wisdom of those who faced the same questions
          long before you.
        </Text>
      </View>

      <View style={styles.footer}>
        <MementoButton label="BEGIN" onPress={onNext} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: fontSize.hero,
    color: colors.bone,
    letterSpacing: letterSpacing.ultra,
    marginTop: spacing.xl,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.bodyItalic,
    fontSize: fontSize.xl,
    color: colors.boneDim,
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 30,
  },
  divider: {
    width: 32,
    height: 0.5,
    backgroundColor: colors.goldDim,
    marginVertical: spacing.xl,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: fontSize.body,
    color: colors.boneGhost,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 26,
  },
  footer: {
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
});

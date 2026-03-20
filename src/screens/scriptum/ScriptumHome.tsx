import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScriptumStackParamList } from '../../navigation/ScriptumNavigator';
import { colors, spacing, letterSpacing, borderRadius } from '../../theme/tokens';
import { fonts } from '../../theme/fonts';
import { useJournalStore, JournalEntry } from '../../stores/journal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type NavigationProp = NativeStackNavigationProp<ScriptumStackParamList, 'ScriptumHome'>;

interface Props {
  navigation: NavigationProp;
}

export const ScriptumHome: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const entries = useJournalStore(state => state.entries);

  const renderItem = ({ item }: { item: JournalEntry }) => {
    const isEvening = item.mode === 'evening_reflection';
    const isMorning = item.mode === 'morning';
    const isPrompt = item.mode === 'prompt';
    
    let tagLabel = 'FREEFORM';
    if (isEvening) tagLabel = 'EVENING REFLECTION';
    if (isMorning) tagLabel = 'MORNING INTENTION';
    if (isPrompt) tagLabel = 'STOIC PROMPT';

    return (
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => navigation.navigate('JournalEditor', { entry: item })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.dateLabel}>{item.date}</Text>
          <Text style={styles.tagLabel}>{tagLabel}</Text>
        </View>
        {item.prompt_key && <Text style={styles.promptKey}>"{item.prompt_key}"</Text>}
        <Text style={styles.previewText} numberOfLines={3}>{item.content}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.headerTitle}>SCRIPTUM</Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity 
          style={styles.actionBtn}
          onPress={() => navigation.navigate('JournalEditor', { isPromptMode: false })}
        >
          <Text style={styles.actionBtnText}>+ FREEFORM</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionBtn, styles.actionBtnGold]}
          onPress={() => navigation.navigate('JournalEditor', { isPromptMode: true })}
        >
          <Text style={[styles.actionBtnText, styles.actionBtnTextDark]}>+ STOIC PROMPT</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={entries}
        keyExtractor={e => e.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>The ledger is completely blank.</Text>}
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
    alignItems: 'center',
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
  actionsRow: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.goldGlow,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.goldDim,
    alignItems: 'center',
  },
  actionBtnGold: {
    backgroundColor: colors.goldDim,
  },
  actionBtnText: {
    fontFamily: fonts.display,
    fontSize: 12,
    color: colors.bone,
    letterSpacing: 2,
  },
  actionBtnTextDark: {
    color: colors.bgPrimary,
    fontWeight: 'bold',
  },
  listContent: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.bgSecondary,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.goldGlow,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  dateLabel: {
    fontFamily: fonts.display,
    fontSize: 10,
    color: colors.gold,
    letterSpacing: 1,
  },
  tagLabel: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.boneDim,
    letterSpacing: 1,
  },
  promptKey: {
    fontFamily: 'CormorantGaramond-Italic',
    fontSize: 14,
    color: colors.goldDim,
    marginBottom: spacing.sm,
  },
  previewText: {
    fontFamily: 'CormorantGaramond-Regular',
    fontSize: 18,
    color: colors.bone,
    lineHeight: 26,
    opacity: 0.9,
  },
  emptyText: {
    fontFamily: 'CormorantGaramond-Italic',
    fontSize: 18,
    color: colors.boneDim,
    textAlign: 'center',
    marginTop: spacing.xxxl,
  },
});

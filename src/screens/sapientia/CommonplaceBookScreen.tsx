import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SapientiaStackParamList } from '../../navigation/SapientiaNavigator';
import { colors, spacing, letterSpacing, borderRadius } from '../../theme/tokens';
import { fonts } from '../../theme/fonts';
import { useQuotesStore, SavedQuoteRecord } from '../../stores/quotes';
import quotesData from '../../content/quotes.json';
import { Quote } from '../../types';
import { QuoteRepository } from '../../repositories/quotes';

type NavigationProp = NativeStackNavigationProp<SapientiaStackParamList, 'CommonplaceBook'>;

interface Props {
  navigation: NavigationProp;
}

export const CommonplaceBookScreen: React.FC<Props> = ({ navigation }) => {
  const savedQuotes = useQuotesStore(state => state.savedQuotes);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');

  const startEditing = (record: SavedQuoteRecord) => {
    setEditingId(record.id);
    setNoteDraft(record.personal_note || '');
  };

  const saveNote = async (id: string) => {
    await QuoteRepository.updateNote(id, noteDraft.trim());
    setEditingId(null);
    setNoteDraft('');
  };

  const renderItem = ({ item }: { item: SavedQuoteRecord }) => {
    const rawQuote = (quotesData as Quote[]).find(q => q.id === item.quote_id);
    if (!rawQuote) return null;

    const isEditing = editingId === item.id;

    return (
      <View style={styles.card}>
        <Text style={styles.quoteText}>"{rawQuote.text}"</Text>
        <Text style={styles.quoteAuthor}>— {rawQuote.author.toUpperCase()}</Text>
        
        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.noteInput}
              value={noteDraft}
              onChangeText={setNoteDraft}
              placeholder="Add your reflections here..."
              placeholderTextColor={colors.boneGhost}
              multiline
              autoFocus
            />
            <TouchableOpacity onPress={() => saveNote(item.id)} style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>SAVE NOTE</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => startEditing(item)} style={styles.noteContainer}>
            <Text style={[styles.noteText, !item.personal_note && styles.noteEmpty]}>
              {item.personal_note || "Tap to add a personal note..."}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.headerAction}>BACK</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>COMMONPLACE BOOK</Text>
          <View style={{ width: 40 }} />
        </View>

        <FlatList
          data={savedQuotes}
          keyExtractor={q => q.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Your commonplace book is empty.</Text>
              <Text style={styles.emptyCta}>Save wisdom that strikes you.</Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
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
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.goldGlow,
  },
  headerTitle: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.bone,
    letterSpacing: letterSpacing.wide,
  },
  headerAction: {
    fontFamily: fonts.display,
    fontSize: 12,
    color: colors.goldDim,
    letterSpacing: 2,
  },
  listContent: {
    padding: spacing.lg,
    gap: spacing.xl,
  },
  card: {
    backgroundColor: colors.bgSecondary,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.goldGlow,
  },
  quoteText: {
    fontFamily: 'CormorantGaramond-Italic',
    fontSize: 18,
    color: colors.boneDim,
    lineHeight: 28,
  },
  quoteAuthor: {
    fontFamily: fonts.display,
    fontSize: 10,
    color: colors.gold,
    marginTop: spacing.md,
    letterSpacing: 2,
  },
  noteContainer: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.goldGlow,
  },
  noteText: {
    fontFamily: 'CormorantGaramond-Regular',
    fontSize: 16,
    color: colors.bone,
    lineHeight: 24,
  },
  noteEmpty: {
    color: colors.boneGhost,
    fontStyle: 'italic',
  },
  editContainer: {
    marginTop: spacing.lg,
  },
  noteInput: {
    fontFamily: 'CormorantGaramond-Regular',
    fontSize: 16,
    color: colors.bone,
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: colors.bgTertiary,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.goldDim,
  },
  saveBtn: {
    marginTop: spacing.sm,
    alignSelf: 'flex-end',
    padding: spacing.sm,
  },
  saveBtnText: {
    fontFamily: fonts.display,
    fontSize: 10,
    color: colors.gold,
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
  emptyCta: {
    fontFamily: fonts.display,
    fontSize: 14,
    color: colors.gold,
    letterSpacing: letterSpacing.wide,
    marginTop: spacing.md,
  },
});

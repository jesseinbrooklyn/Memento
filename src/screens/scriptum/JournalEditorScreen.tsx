import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { ScriptumStackParamList } from '../../navigation/ScriptumNavigator';
import { colors, spacing, letterSpacing } from '../../theme/tokens';
import { fonts } from '../../theme/fonts';
import { JournalRepository } from '../../repositories/journal';
import { getRandomStoicPrompt } from '../../utils/dailyContent';

type EditorRouteProp = RouteProp<ScriptumStackParamList, 'JournalEditor'>;
type NavigationProp = NativeStackNavigationProp<ScriptumStackParamList, 'JournalEditor'>;

interface Props {
  route: EditorRouteProp;
  navigation: NavigationProp;
}

export const JournalEditorScreen: React.FC<Props> = ({ route, navigation }) => {
  const { entry, isPromptMode } = route.params || {};

  const [content, setContent] = useState(entry?.content || '');
  const [prompt, setPrompt] = useState(entry?.prompt_key || (isPromptMode ? getRandomStoicPrompt() : null));
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (isSaving || !content.trim()) {
      navigation.goBack();
      return;
    }
    
    setIsSaving(true);
    try {
      if (entry) {
        await JournalRepository.updateEntry(entry.id, content.trim());
      } else {
        const mode = isPromptMode ? 'prompt' : 'freeform';
        await JournalRepository.createEntry(mode, content.trim(), prompt);
      }
      navigation.goBack();
    } catch (e) {
      // Silently swallow local errors on exit
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (entry && !isSaving) {
      setIsSaving(true);
      await JournalRepository.deleteEntry(entry.id);
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} disabled={isSaving}>
            <Text style={styles.headerAction}>CANCEL</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{entry ? 'EDIT RECORD' : 'NEW RECORD'}</Text>
          <TouchableOpacity onPress={handleSave} disabled={isSaving}>
            <Text style={[styles.headerAction, { color: colors.gold }]}>SAVE</Text>
          </TouchableOpacity>
        </View>

        {prompt && (
          <View style={styles.promptContainer}>
            <Text style={styles.promptText}>"{prompt}"</Text>
          </View>
        )}

        <TextInput
          style={[styles.input, Platform.OS === 'web' && { outlineStyle: 'none' } as any]}
          value={content}
          onChangeText={setContent}
          placeholder="Begin writing..."
          placeholderTextColor={colors.boneGhost}
          multiline
          autoFocus={!entry}
        />

        {entry && (
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.deleteText}>DELETE RECORD</Text>
          </TouchableOpacity>
        )}

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
  headerTitle: {
    fontFamily: fonts.display,
    fontSize: 14,
    color: colors.bone,
    letterSpacing: 2,
  },
  promptContainer: {
    padding: spacing.xl,
    paddingBottom: 0,
    alignItems: 'center',
  },
  promptText: {
    fontFamily: 'CormorantGaramond-Italic',
    fontSize: 20,
    color: colors.gold,
    textAlign: 'center',
    lineHeight: 28,
  },
  input: {
    flex: 1,
    fontFamily: 'CormorantGaramond-Regular',
    fontSize: 22,
    color: colors.bone,
    padding: spacing.xl,
    textAlignVertical: 'top',
    lineHeight: 32,
  },
  deleteBtn: {
    padding: spacing.xl,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 0, 0, 0.2)',
  },
  deleteText: {
    fontFamily: fonts.display,
    fontSize: 10,
    color: '#ff4444',
    letterSpacing: 2,
  },
});

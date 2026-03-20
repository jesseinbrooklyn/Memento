import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScriptumHome } from '../screens/scriptum/ScriptumHome';
import { JournalEditorScreen } from '../screens/scriptum/JournalEditorScreen';
import { JournalEntry } from '../stores/journal';

export type ScriptumStackParamList = {
  ScriptumHome: undefined;
  JournalEditor: { entry?: JournalEntry, isPromptMode?: boolean };
};

const Stack = createNativeStackNavigator<ScriptumStackParamList>();

export const ScriptumNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, presentation: 'fullScreenModal' }}>
      <Stack.Screen name="ScriptumHome" component={ScriptumHome} />
      <Stack.Screen name="JournalEditor" component={JournalEditorScreen} />
    </Stack.Navigator>
  );
};

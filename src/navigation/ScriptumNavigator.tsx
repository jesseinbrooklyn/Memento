import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScriptumHome } from '../screens/scriptum/ScriptumHome';
import { JournalEditorScreen } from '../screens/scriptum/JournalEditorScreen';
import { JournalEntry } from '../stores/journal';
import { ROUTES } from './routes';

export type ScriptumStackParamList = {
  [ROUTES.ScriptumHome]: undefined;
  [ROUTES.JournalEditor]: { entry?: JournalEntry; isPromptMode?: boolean };
};

const Stack = createNativeStackNavigator<ScriptumStackParamList>();

export const ScriptumNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, presentation: 'fullScreenModal' }}>
      <Stack.Screen name={ROUTES.ScriptumHome} component={ScriptumHome} />
      <Stack.Screen name={ROUTES.JournalEditor} component={JournalEditorScreen} />
    </Stack.Navigator>
  );
};

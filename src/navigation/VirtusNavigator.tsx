import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { VirtusScreen } from '../screens/virtus/VirtusScreen';
import StreakHistoryScreen from '../screens/virtus/StreakHistoryScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import { ROUTES } from './routes';

export type VirtusStackParamList = {
  [ROUTES.TabVirtus]: undefined;
  [ROUTES.StreakHistory]: undefined;
  [ROUTES.Settings]: undefined;
};

const Stack = createNativeStackNavigator<VirtusStackParamList>();

export const VirtusNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.TabVirtus} component={VirtusScreen} />
      <Stack.Screen name={ROUTES.StreakHistory} component={StreakHistoryScreen} />
      <Stack.Screen name={ROUTES.Settings} component={SettingsScreen} />
    </Stack.Navigator>
  );
};

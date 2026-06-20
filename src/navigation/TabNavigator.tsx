import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AwakenScreen } from '../screens/awaken/AwakenScreen';
import { SapientiaNavigator } from './SapientiaNavigator';
import { TempusScreen } from '../screens/tempus/TempusScreen';
import { ScriptumNavigator } from './ScriptumNavigator';
import { VirtusNavigator } from './VirtusNavigator';
import { colors } from '../theme/tokens';
import { AwakenIcon, SapientiaIcon, TempusIcon, ScriptumIcon, VirtusIcon } from '../components/icons';
import { ROUTES } from './routes';

const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, React.FC<{ color: string; size?: number }>> = {
  [ROUTES.TabAwaken]: AwakenIcon,
  [ROUTES.TabSapientia]: SapientiaIcon,
  [ROUTES.TabTempus]: TempusIcon,
  [ROUTES.TabScriptum]: ScriptumIcon,
  [ROUTES.TabVirtus]: VirtusIcon,
};

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bgSecondary,
          borderTopWidth: 0.5,
          borderTopColor: colors.goldDim,
        },
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.goldMuted,
        tabBarIcon: ({ color, size }) => {
          const Icon = TAB_ICONS[route.name];
          return Icon ? <Icon color={color} size={size} /> : null;
        },
      })}
    >
      <Tab.Screen name={ROUTES.TabAwaken} component={AwakenScreen} />
      <Tab.Screen name={ROUTES.TabSapientia} component={SapientiaNavigator} />
      <Tab.Screen name={ROUTES.TabTempus} component={TempusScreen} />
      <Tab.Screen name={ROUTES.TabScriptum} component={ScriptumNavigator} />
      <Tab.Screen name={ROUTES.TabVirtus} component={VirtusNavigator} />
    </Tab.Navigator>
  );
};

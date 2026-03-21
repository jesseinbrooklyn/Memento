import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AwakenScreen } from '../screens/awaken/AwakenScreen';
import { SapientiaNavigator } from './SapientiaNavigator';
import { TempusScreen } from '../screens/tempus/TempusScreen';
import { ScriptumNavigator } from './ScriptumNavigator';
import { VirtusScreen } from '../screens/virtus/VirtusScreen';
import { colors } from '../theme/tokens';
import { AwakenIcon, SapientiaIcon, TempusIcon, ScriptumIcon, VirtusIcon } from '../components/icons';

const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, React.FC<{ color: string; size?: number }>> = {
  AWAKEN: AwakenIcon,
  SAPIENTIA: SapientiaIcon,
  TEMPUS: TempusIcon,
  SCRIPTUM: ScriptumIcon,
  VIRTUS: VirtusIcon,
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
        tabBarInactiveTintColor: 'rgba(196,163,90,0.35)',
        tabBarIcon: ({ color, size }) => {
          const Icon = TAB_ICONS[route.name];
          return Icon ? <Icon color={color} size={size} /> : null;
        },
      })}
    >
      <Tab.Screen name="AWAKEN" component={AwakenScreen} />
      <Tab.Screen name="SAPIENTIA" component={SapientiaNavigator} />
      <Tab.Screen name="TEMPUS" component={TempusScreen} />
      <Tab.Screen name="SCRIPTUM" component={ScriptumNavigator} />
      <Tab.Screen name="VIRTUS" component={VirtusScreen} />
    </Tab.Navigator>
  );
};

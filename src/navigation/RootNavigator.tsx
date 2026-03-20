import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';
import { MorningQuoteScreen } from '../screens/morning/MorningQuoteScreen';
import { MorningIntentionScreen } from '../screens/morning/MorningIntentionScreen';
import { EveningReflectionScreen } from '../screens/evening/EveningReflectionScreen';

export type RootStackParamList = {
  Tabs: undefined;
  MorningQuote: undefined;
  MorningIntention: undefined;
  EveningReflection: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="MorningQuote" component={MorningQuoteScreen} />
      <Stack.Screen name="MorningIntention" component={MorningIntentionScreen} />
      <Stack.Screen name="EveningReflection" component={EveningReflectionScreen} />
    </Stack.Navigator>
  );
};

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';
import { MorningQuoteScreen } from '../screens/morning/MorningQuoteScreen';
import { MorningIntentionScreen } from '../screens/morning/MorningIntentionScreen';
import { EveningReflectionScreen } from '../screens/evening/EveningReflectionScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import { usePreferencesStore } from '../stores/preferences';

export type RootStackParamList = {
  Onboarding: undefined;
  Tabs: undefined;
  MorningQuote: undefined;
  MorningIntention: undefined;
  EveningReflection: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const hasSeenIntro = usePreferencesStore(state => state.hasSeenIntro);

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={hasSeenIntro ? 'Tabs' : 'Onboarding'}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="MorningQuote" component={MorningQuoteScreen} />
      <Stack.Screen name="MorningIntention" component={MorningIntentionScreen} />
      <Stack.Screen name="EveningReflection" component={EveningReflectionScreen} />
    </Stack.Navigator>
  );
};

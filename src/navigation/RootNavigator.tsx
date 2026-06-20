import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';
import { MorningQuoteScreen } from '../screens/morning/MorningQuoteScreen';
import { MorningIntentionScreen } from '../screens/morning/MorningIntentionScreen';
import { EveningReflectionScreen } from '../screens/evening/EveningReflectionScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import { usePreferencesStore } from '../stores/preferences';
import { ROUTES } from './routes';

export type RootStackParamList = {
  [ROUTES.Onboarding]: undefined;
  [ROUTES.Tabs]: undefined;
  [ROUTES.MorningQuote]: undefined;
  [ROUTES.MorningIntention]: undefined;
  [ROUTES.EveningReflection]: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const hasSeenIntro = usePreferencesStore(state => state.hasSeenIntro);

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={hasSeenIntro ? ROUTES.Tabs : ROUTES.Onboarding}
    >
      <Stack.Screen name={ROUTES.Onboarding} component={OnboardingScreen} />
      <Stack.Screen name={ROUTES.Tabs} component={TabNavigator} />
      <Stack.Screen name={ROUTES.MorningQuote} component={MorningQuoteScreen} />
      <Stack.Screen name={ROUTES.MorningIntention} component={MorningIntentionScreen} />
      <Stack.Screen name={ROUTES.EveningReflection} component={EveningReflectionScreen} />
    </Stack.Navigator>
  );
};

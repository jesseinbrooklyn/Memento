import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SapientiaHome } from '../screens/sapientia/SapientiaHome';
import { QuoteLibraryScreen } from '../screens/sapientia/QuoteLibraryScreen';
import { QuoteDetailScreen } from '../screens/sapientia/QuoteDetailScreen';
import { CommonplaceBookScreen } from '../screens/sapientia/CommonplaceBookScreen';
import { Quote } from '../types';
import { ROUTES } from './routes';

export type SapientiaStackParamList = {
  [ROUTES.SapientiaHome]: undefined;
  [ROUTES.QuoteLibrary]: undefined;
  [ROUTES.QuoteDetail]: { quote: Quote };
  [ROUTES.CommonplaceBook]: undefined;
};

const Stack = createNativeStackNavigator<SapientiaStackParamList>();

export const SapientiaNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.SapientiaHome} component={SapientiaHome} />
      <Stack.Screen name={ROUTES.QuoteLibrary} component={QuoteLibraryScreen} />
      <Stack.Screen name={ROUTES.QuoteDetail} component={QuoteDetailScreen} />
      <Stack.Screen name={ROUTES.CommonplaceBook} component={CommonplaceBookScreen} />
    </Stack.Navigator>
  );
};

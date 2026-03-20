import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SapientiaHome } from '../screens/sapientia/SapientiaHome';
import { QuoteDetailScreen } from '../screens/sapientia/QuoteDetailScreen';
import { CommonplaceBookScreen } from '../screens/sapientia/CommonplaceBookScreen';
import { Quote } from '../components/DailyQuote';

export type SapientiaStackParamList = {
  SapientiaHome: undefined;
  QuoteDetail: { quote: Quote };
  CommonplaceBook: undefined;
};

const Stack = createNativeStackNavigator<SapientiaStackParamList>();

export const SapientiaNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SapientiaHome" component={SapientiaHome} />
      <Stack.Screen name="QuoteDetail" component={QuoteDetailScreen} />
      <Stack.Screen name="CommonplaceBook" component={CommonplaceBookScreen} />
    </Stack.Navigator>
  );
};

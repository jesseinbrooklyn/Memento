import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform, View } from 'react-native';
import {
  useFonts,
  Cinzel_400Regular,
  Cinzel_500Medium,
  Cinzel_600SemiBold,
} from '@expo-google-fonts/cinzel';
import {
  CormorantGaramond_300Light,
  CormorantGaramond_400Regular,
  CormorantGaramond_500Medium,
  CormorantGaramond_400Regular_Italic,
  CormorantGaramond_500Medium_Italic,
} from '@expo-google-fonts/cormorant-garamond';

import { initDb } from './src/repositories/db';
import { PracticeRepository } from './src/repositories/practice';
import { QuoteRepository } from './src/repositories/quotes';
import { PreferencesRepository } from './src/repositories/preferences';
import { JournalRepository } from './src/repositories/journal';
import { usePreferencesStore } from './src/stores/preferences';
import { requestNotificationPermissions, scheduleBells } from './src/utils/notifications';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors } from './src/theme/tokens';

export default function App() {
  const [dbStatus, setDbStatus] = useState<'loading' | 'ready'>('loading');

  const [fontsLoaded] = useFonts({
    'Cinzel': Cinzel_400Regular,
    'Cinzel-Medium': Cinzel_500Medium,
    'Cinzel-SemiBold': Cinzel_600SemiBold,
    'CormorantGaramond-Light': CormorantGaramond_300Light,
    'CormorantGaramond-Regular': CormorantGaramond_400Regular,
    'CormorantGaramond-Medium': CormorantGaramond_500Medium,
    'CormorantGaramond-Italic': CormorantGaramond_400Regular_Italic,
    'CormorantGaramond-MediumItalic': CormorantGaramond_500Medium_Italic,
  });

  useEffect(() => {
    if (Platform.OS === 'web') {
      // expo-sqlite hangs on web — skip DB init
      setDbStatus('ready');
      return;
    }
    initDb()
      .then(() => Promise.all([
        PracticeRepository.loadTodaysProgress(),
        PracticeRepository.loadHistoricalData(),
        QuoteRepository.loadSavedQuotes(),
        PreferencesRepository.loadPreferences(),
        JournalRepository.loadEntries()
      ]))
      .then(async () => {
         const granted = await requestNotificationPermissions();
         if (granted) {
            const state = usePreferencesStore.getState();
            await scheduleBells(state.morningBellTime, state.eveningBellTime);
         }
      })
      .then(() => setDbStatus('ready'))
      .catch(() => {
        setDbStatus('ready');
      });
  }, []);

  if (!fontsLoaded || dbStatus === 'loading') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bgPrimary, justifyContent: 'center', alignItems: 'center' }}>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={{ dark: true, colors: { primary: colors.gold, background: colors.bgPrimary, card: colors.bgSecondary, text: colors.bone, border: colors.goldDim, notification: colors.gold }, fonts: { regular: { fontFamily: 'System', fontWeight: '400' }, medium: { fontFamily: 'System', fontWeight: '500' }, bold: { fontFamily: 'System', fontWeight: '700' }, heavy: { fontFamily: 'System', fontWeight: '900' } } }}>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

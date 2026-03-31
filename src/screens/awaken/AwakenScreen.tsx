import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, AppState, Platform } from 'react-native';
import Animated from 'react-native-reanimated';
import { useEntranceAnimation } from '../../hooks/useEntranceAnimation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, letterSpacing } from '../../theme/tokens';
import { fonts } from '../../theme/fonts';
import { VanitasBackground } from '../../components/VanitasBackground';
import { MementoButton } from '../../components/MementoButton';
import { calculateRemainingDays } from '../../utils/lifeCalculator';
import { usePreferencesStore } from '../../stores/preferences';
import { usePracticeStore } from '../../stores/practice';
import { PracticeRepository } from '../../repositories/practice';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

export const AwakenScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [timeStr, setTimeStr] = useState('');
  
  const { morningComplete, eveningComplete, intention } = usePracticeStore(state => state);
  const [isEvening, setIsEvening] = useState(new Date().getHours() >= 17);
  
  const headerAnim = useEntranceAnimation({ delay: 200 });
  const centerAnim = useEntranceAnimation({ delay: 350 });
  const footerAnim = useEntranceAnimation({ delay: 500 });

  const { birthDate, lifeFactors, use24HourTime } = usePreferencesStore(state => state);
  const daysRemaining = (() => {
    if (!birthDate || birthDate.length !== 10) return 14827;
    const parts = birthDate.split('/');
    if (parts.length !== 3) return 14827;
    const [mm, dd, yyyy] = parts;
    const parsed = new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd));
    if (isNaN(parsed.getTime())) return 14827;
    return calculateRemainingDays(parsed, lifeFactors);
  })();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: !use24HourTime, hour: '2-digit', minute: '2-digit' }));
      setIsEvening(now.getHours() >= 17);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [use24HourTime]);

  // Reload today's practice state when app returns to foreground (handles day rollover)
  useEffect(() => {
    if (Platform.OS === 'web') return;
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        PracticeRepository.loadTodaysProgress();
      }
    });
    return () => sub.remove();
  }, []);

  return (
    <View style={styles.container}>
      <VanitasBackground />
      
      <View style={[styles.content, { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, spacing.xxl) }]}>
        
        <Animated.View style={[styles.header, headerAnim]}>
          <Text style={styles.title}>MEMENTO MORI</Text>
          <Text style={[styles.clockText, { marginTop: spacing.xxl }, morningComplete && { fontSize: 56 }]}>
            {timeStr}
          </Text>
        </Animated.View>

        <Animated.View style={[styles.centerStage, { flex: 1, justifyContent: 'flex-end', paddingBottom: spacing.xl }, centerAnim]}>
          <Text style={styles.daysText}>{daysRemaining.toLocaleString()} days remaining</Text>
          {morningComplete && intention && (
            <Text style={styles.intentionText}>"{intention}"</Text>
          )}
        </Animated.View>

        <Animated.View style={[styles.footer, footerAnim]}>
          {!morningComplete ? (
            <MementoButton 
              label="I AM AWAKE" 
              onPress={() => navigation.navigate('MorningQuote')} 
            />
          ) : (
            isEvening && !eveningComplete ? (
               <MementoButton 
                 label="REFLECT" 
                 onPress={() => navigation.navigate('EveningReflection')} 
               />
            ) : null
          )}
        </Animated.View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  header: {
    paddingTop: spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.bone,
    letterSpacing: letterSpacing.wide,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  centerStage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  clockText: {
    fontFamily: fonts.display,
    fontSize: 64,
    color: colors.bone,
    letterSpacing: 2,
    opacity: 0.95,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  daysText: {
    fontFamily: 'CormorantGaramond-Regular',
    fontSize: 20,
    color: colors.boneDim,
    marginTop: spacing.sm,
    opacity: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  intentionText: {
    fontFamily: 'CormorantGaramond-Italic',
    fontSize: 24,
    color: colors.bone,
    marginTop: spacing.xl,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
  },
});

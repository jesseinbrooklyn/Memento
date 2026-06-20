import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { PreferencesRepository } from '../../repositories/preferences';
import { ROUTES } from '../../navigation/routes';
import { colors, spacing } from '../../theme/tokens';
import { WelcomeStep } from './WelcomeStep';
import { CalibrateStep } from './CalibrateStep';
import { NotificationsStep } from './NotificationsStep';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, typeof ROUTES.Onboarding>;

interface Props {
  navigation: NavigationProp;
}

// Onboarding is 3 steps: 0 = Welcome, 1 = Calibrate, 2 = Notifications
const TOTAL_CONFIG_STEPS = 2; // steps 1 and 2 show progress dots

interface ProgressDotsProps {
  step: number; // 1-based config step index
}

const ProgressDots: React.FC<ProgressDotsProps> = ({ step }) => {
  return (
    <View style={dotStyles.row}>
      {Array.from({ length: TOTAL_CONFIG_STEPS }).map((_, i) => (
        <View
          key={i}
          style={[dotStyles.dot, i < step && dotStyles.dotActive]}
        />
      ))}
    </View>
  );
};

const dotStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingTop: spacing.md,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.ash,
  },
  dotActive: {
    backgroundColor: colors.gold,
  },
});

export default function OnboardingScreen({ navigation }: Props) {
  const [step, setStep] = useState(0);

  const handleComplete = async () => {
    await PreferencesRepository.markOnboardingComplete();
    navigation.reset({ index: 0, routes: [{ name: ROUTES.Tabs }] });
  };

  // Step 0 is fullscreen welcome — no chrome
  if (step === 0) {
    return <WelcomeStep onNext={() => setStep(1)} />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ProgressDots step={step} />

      {step === 1 && (
        <CalibrateStep onNext={() => setStep(2)} />
      )}

      {step === 2 && (
        <NotificationsStep onComplete={handleComplete} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
});

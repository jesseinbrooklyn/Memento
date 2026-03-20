import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS, Easing } from 'react-native-reanimated';
import { colors, spacing, letterSpacing } from '../theme/tokens';
import { fonts } from '../theme/fonts';
import { OrnateHourglass } from './OrnateHourglass';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePreferencesStore } from '../stores/preferences';
import * as Haptics from 'expo-haptics';

export const IntroOverlay = () => {
  const hasSeenIntro = usePreferencesStore(state => state.hasSeenIntro);
  const setHasSeenIntro = usePreferencesStore(state => state.setHasSeenIntro);
  const [isRendered, setIsRendered] = useState(true);
  const opacity = useSharedValue(1);
  const insets = useSafeAreaInsets();

  const handleEnter = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // 1500ms luxurious cinematic fade-out
    opacity.value = withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) }, (finished) => {
      if (finished) {
        runOnJS(setIsRendered)(false);
        runOnJS(setHasSeenIntro)(true);
      }
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!isRendered || hasSeenIntro) return null;

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.container, animatedStyle]}>
      <TouchableOpacity 
        activeOpacity={1} 
        onPress={handleEnter} 
        style={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}
      >
        <OrnateHourglass percentage={50} />
        <Text style={styles.title}>MEMENTO MORI</Text>
        <Text style={styles.subtitle}>ENTER</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, // Guarantee infinite elevation over RootNavigator
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 32,
    color: colors.bone,
    letterSpacing: letterSpacing.wide,
    marginTop: spacing.xxxl,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontFamily: 'CormorantGaramond-Italic',
    fontSize: 16,
    color: colors.goldDim,
    letterSpacing: 4,
    marginTop: spacing.lg,
    opacity: 0.6,
  }
});

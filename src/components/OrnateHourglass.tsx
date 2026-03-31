import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';
import { colors } from '../theme/tokens';

interface OrnateHourglassProps {
  percentage?: number;
}

const PARTICLE_COUNT = 6;
const HOURGLASS_HEIGHT = 220;
const HOURGLASS_WIDTH = 140;

// Each particle falls from the neck area to the bottom bulb
// Staggered start times, slightly different horizontal drift
const PARTICLE_CONFIGS = [
  { delay: 0, driftX: -1.5, duration: 1800, size: 2 },
  { delay: 300, driftX: 0.8, duration: 1600, size: 1.5 },
  { delay: 600, driftX: -0.5, duration: 2000, size: 2.5 },
  { delay: 900, driftX: 1.2, duration: 1700, size: 1.5 },
  { delay: 1200, driftX: -0.8, duration: 1900, size: 2 },
  { delay: 1500, driftX: 0.3, duration: 1500, size: 2 },
];

interface SandParticleProps {
  config: typeof PARTICLE_CONFIGS[0];
  active: boolean;
}

const SandParticle: React.FC<SandParticleProps> = ({ config, active }) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!active || prefersReducedMotion) return;

    // Fall distance: from neck (~48% down) to bottom bulb (~82% down)
    const fallStart = 0;
    const fallEnd = HOURGLASS_HEIGHT * 0.34;

    translateY.value = withDelay(
      config.delay,
      withRepeat(
        withSequence(
          withTiming(fallStart, { duration: 0 }),
          withTiming(fallEnd, { duration: config.duration, easing: Easing.in(Easing.quad) }),
        ),
        -1,
        false
      )
    );

    opacity.value = withDelay(
      config.delay,
      withRepeat(
        withSequence(
          withTiming(0.7, { duration: 100 }),
          withTiming(0.7, { duration: config.duration - 300 }),
          withTiming(0, { duration: 200 }),
        ),
        -1,
        false
      )
    );
  }, [active, prefersReducedMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: config.driftX },
    ],
    opacity: opacity.value,
  }));

  if (!active || prefersReducedMotion) return null;

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          // Start at the neck of the hourglass
          top: HOURGLASS_HEIGHT * 0.48,
          left: HOURGLASS_WIDTH / 2 - config.size / 2,
          width: config.size,
          height: config.size,
          borderRadius: config.size / 2,
          backgroundColor: '#b8973e',
        },
        animatedStyle,
      ]}
    />
  );
};

export const OrnateHourglass: React.FC<OrnateHourglassProps> = ({ percentage = 50 }) => {
  const isFlowing = percentage < 100;

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/newhour.png')}
        style={styles.image}
        resizeMode="contain"
      />
      {/* Sand particles overlay */}
      {PARTICLE_CONFIGS.map((config, i) => (
        <SandParticle key={i} config={config} active={isFlowing} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: HOURGLASS_WIDTH,
    height: HOURGLASS_HEIGHT,
  },
  image: {
    width: HOURGLASS_WIDTH,
    height: HOURGLASS_HEIGHT,
  },
});

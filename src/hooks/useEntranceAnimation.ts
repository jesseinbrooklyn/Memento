import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useReducedMotion } from 'react-native-reanimated';

interface EntranceAnimationOptions {
  delay?: number;
}

export function useEntranceAnimation({ delay = 200 }: EntranceAnimationOptions = {}) {
  const prefersReducedMotion = useReducedMotion();
  const opacity = useSharedValue(prefersReducedMotion ? 1 : 0);
  const translateY = useSharedValue(prefersReducedMotion ? 0 : 12);

  useEffect(() => {
    if (prefersReducedMotion) return;
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 1200, easing: Easing.out(Easing.ease) })
    );
    translateY.value = withDelay(
      delay,
      withTiming(0, { duration: 1200, easing: Easing.out(Easing.ease) })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return animatedStyle;
}

import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  useSharedValue,
  Easing,
  useReducedMotion
} from 'react-native-reanimated';

export const VanitasBackground: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (prefersReducedMotion) return;
    scale.value = withRepeat(
      withTiming(1.02, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [prefersReducedMotion, scale]);

  const breathingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View style={[styles.paintingContainer, breathingStyle]}>
        <ImageBackground 
          source={require('../../assets/vanitas_bg.png')} 
          style={styles.painting}
          resizeMode="cover"
        />
      </Animated.View>

      <View style={styles.vignette} />
      <View style={styles.grain} />
    </View>
  );
};

const styles = StyleSheet.create({
  paintingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0c0a07',
    overflow: 'hidden',
  },
  painting: {
    width: '105%',
    height: '105%',
    opacity: 0.45,
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 80,
    borderColor: 'rgba(10, 8, 5, 0.55)',
  },
  grain: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
  },
});

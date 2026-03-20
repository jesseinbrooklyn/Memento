import React from 'react';
import { View, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  useSharedValue,
  Easing,
  useReducedMotion
} from 'react-native-reanimated';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

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

      <View style={StyleSheet.absoluteFill}>
        <Svg width={SCREEN_W} height={SCREEN_H}>
          <Defs>
            <RadialGradient id="vignette" cx="50%" cy="50%" rx="60%" ry="55%">
              <Stop offset="0" stopColor="#0a0805" stopOpacity="0" />
              <Stop offset="0.7" stopColor="#0a0805" stopOpacity="0.15" />
              <Stop offset="1" stopColor="#0a0805" stopOpacity="0.7" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width={SCREEN_W} height={SCREEN_H} fill="url(#vignette)" />
        </Svg>
      </View>

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
  grain: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
  },
});

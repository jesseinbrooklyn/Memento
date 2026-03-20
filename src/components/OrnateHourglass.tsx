import React, { useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Path, Rect, Defs, LinearGradient, Stop, ClipPath, Line } from 'react-native-svg';
import Animated, { useSharedValue, withRepeat, withTiming, Easing, useAnimatedProps } from 'react-native-reanimated';

const AnimatedLine = Animated.createAnimatedComponent(Line);
import { colors } from '../theme/tokens';

interface OrnateHourglassProps {
  percentage?: number;
}

export const OrnateHourglass: React.FC<OrnateHourglassProps> = ({ percentage = 50 }) => {
  const dashOffset = useSharedValue(0);

  useEffect(() => {
    if (percentage < 100) {
      dashOffset.value = withRepeat(
        withTiming(-8, { duration: 400, easing: Easing.linear }),
        -1, 
        false
      );
    }
  }, [percentage]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: dashOffset.value
  }));

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: 140, height: 220 }}>
      {/* 
        This is a purely SVG-based drawing for the mockup's Reliquary Hourglass. 
        It uses MEMENTO's tokens for coloring.
      */}
      <Svg width="140" height="220" viewBox="0 0 140 220">
        <Defs>
          <LinearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#ab8c42" />
            <Stop offset="50%" stopColor={colors.gold} />
            <Stop offset="100%" stopColor="#8d712f" />
          </LinearGradient>
          <ClipPath id="topSandClip">
            <Rect x="0" y={33 + 77 * (percentage / 100)} width="140" height="77" />
          </ClipPath>
          <ClipPath id="bottomSandClip">
            <Rect x="0" y={187 - 77 * (percentage / 100)} width="140" height="77" />
          </ClipPath>
        </Defs>

        {/* Top/Bottom Cap Rings */}
        <Rect x="30" y="10" width="80" height="15" rx="4" fill="url(#gold)" />
        <Rect x="20" y="25" width="100" height="8" rx="2" fill="url(#gold)" />

        <Rect x="30" y="195" width="80" height="15" rx="4" fill="url(#gold)" />
        <Rect x="20" y="187" width="100" height="8" rx="2" fill="url(#gold)" />
        
        {/* Intricate Pillars (Reliquary Style) */}
        <Rect x="34" y="33" width="6" height="154" fill="url(#gold)" />
        <Rect x="100" y="33" width="6" height="154" fill="url(#gold)" />

        {/* Gothic Arches Top & Bottom */}
        <Path d="M40 33 Q 70 80, 100 33 Z" fill="none" stroke="url(#gold)" strokeWidth="3" />
        <Path d="M40 187 Q 70 140, 100 187 Z" fill="none" stroke="url(#gold)" strokeWidth="3" />

        {/* Jewels on Pillars */}
        <Rect x="33" y="106" width="8" height="8" rx="4" fill={colors.ember} />
        <Rect x="99" y="106" width="8" height="8" rx="4" fill={colors.ember} />
        
        <Path d="M46 33 Q 46 90, 70 110 Q 94 90, 94 33 Z" fill="rgba(255,255,255,0.03)" stroke={colors.goldDim} strokeWidth="1" />
        <Path d="M70 110 Q 46 130, 46 187 L 94 187 Q 94 130, 70 110 Z" fill="rgba(255,255,255,0.03)" stroke={colors.goldDim} strokeWidth="1" />
        
        {/* Sand */}
        <Path d="M52 70 Q 60 95, 70 110 Q 80 95, 88 70 Z" fill={colors.gold} opacity="0.85" clipPath="url(#topSandClip)" />
        <Path d="M70 110 Q 62 145, 52 187 L 88 187 Q 78 145, 70 110 Z" fill={colors.gold} opacity="0.85" clipPath="url(#bottomSandClip)" />
        
        {/* Falling Sand Stream */}
        {percentage < 100 && (
          <AnimatedLine
            x1="70"
            y1="108"
            x2="70"
            y2="187"
            stroke={colors.gold}
            strokeWidth="1.5"
            strokeDasharray="4, 4"
            animatedProps={animatedProps}
            opacity="0.85"
          />
        )}
      </Svg>
    </View>
  );
};

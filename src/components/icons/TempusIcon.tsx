import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  color: string;
  size?: number;
}

export const TempusIcon: React.FC<IconProps> = ({ color, size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 2h12M6 22h12M7 2v4.2C7 8.4 8.5 10.5 12 12c-3.5 1.5-5 3.6-5 5.8V22M17 2v4.2c0 2.2-1.5 4.3-5 5.8 3.5 1.5 5 3.6 5 5.8V22"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

import React from 'react';
import Svg, { Path, Line } from 'react-native-svg';

interface IconProps {
  color: string;
  size?: number;
}

export const VirtusIcon: React.FC<IconProps> = ({ color, size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Capital */}
    <Path
      d="M7 4h10M8 4v2h8V4"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Shaft with fluting */}
    <Line x1="9" y1="6" x2="9.5" y2="18" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    <Line x1="14.5" y1="6" x2="15" y2="18" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    <Line x1="12" y1="6" x2="12" y2="18" stroke={color} strokeWidth={0.75} strokeLinecap="round" opacity={0.5} />
    {/* Base */}
    <Path
      d="M8 18h8M7 20h10"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

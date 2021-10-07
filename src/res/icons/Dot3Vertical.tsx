import React from 'react';
import Svg, { SvgProps, Circle } from 'react-native-svg';

export default function Dot3Vertical({ color, ...props }: SvgProps) {
  return (
    <Svg width="4" height="20" viewBox="0 0 4 20" fill="none">
      <Circle cx="2" cy="2" r="2" fill={color} />
      <Circle cx="2" cy="10" r="2" fill={color} />
      <Circle cx="2" cy="18" r="2" fill={color} />
    </Svg>
  )
}
import React from 'react';
import Svg, { Line, SvgProps } from 'react-native-svg';

export default function Plus({ color, ...props }: SvgProps) {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <Line x1="10" y1="4.37114e-08" x2="10" y2="20" stroke={color} strokeWidth="2" />
      <Line x1="20" y1="10" y2="10" stroke={color} strokeWidth="2" />
    </Svg>
  )
}
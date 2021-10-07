import React from 'react';
import Svg, { Line, SvgProps } from 'react-native-svg';

export default function More({ color, ...props }: SvgProps) {
  return (
    <Svg width="24" height="16" viewBox="0 0 24 16" fill="none">
      <Line y1="1" x2="24" y2="1" stroke={color} strokeWidth="2" />
      <Line y1="8" x2="24" y2="8" stroke={color} strokeWidth="2" />
      <Line y1="15" x2="24" y2="15" stroke={color} strokeWidth="2" />
    </Svg>
  )
}
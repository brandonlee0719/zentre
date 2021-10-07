import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export default function Tick({ color, ...props }: SvgProps) {
  return (
    <Svg width="13" height="10" viewBox="0 0 13 10" fill="none">
      <Path d="M1 4.23077L4.85 8L12 1" stroke={color} strokeWidth="2" />
    </Svg>
  )
}
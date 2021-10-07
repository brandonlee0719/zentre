import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export default function Back({ color, ...props }: SvgProps) {
  return (
    <Svg width="11" height="17" viewBox="0 0 11 17" fill="none">
      <Path d="M9.5 1L2 8.5L9.5 16" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  )
}
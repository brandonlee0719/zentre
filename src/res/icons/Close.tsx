import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export default function Close({ color, ...props }: SvgProps) {
  return (
    <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <Path d="M0.749756 11.25L11.2497 0.750001" stroke={color}
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M11.2498 11.25L0.74982 0.750001" stroke={color}
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}
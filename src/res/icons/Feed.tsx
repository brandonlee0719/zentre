import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export default function Feed({ color, ...props }: SvgProps) {
  return (
    <Svg width="30" height="30" viewBox="0 0 30 30" fill="none">
      <Path d="M15 27.5C21.9036 27.5 27.5 21.9036 27.5 15C27.5 8.09644 21.9036 2.5 15 2.5C8.09644 2.5 2.5 8.09644 
      2.5 15C2.5 21.9036 8.09644 27.5 15 27.5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M20.3 9.7L17.65 17.65L9.70001 20.3L12.35 12.35L20.3 9.7Z" stroke={color} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}
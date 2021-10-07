import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export default function Search({ color, width, height, ...props }: SvgProps) {
  return (
    <Svg width={width || "20"} height={height || "20"} viewBox="0 0 20 20" fill="none">
      <Path d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 
      2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M17.5 17.5L13.875 13.875" stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}
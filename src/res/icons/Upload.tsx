import React from 'react';
import Svg, {
  Path,
  SvgProps,
  Circle
} from 'react-native-svg';

export default function Upload({ color, ...props }: SvgProps) {
  return (
    <Svg width="30" height="30" viewBox="0 0 30 30" fill="none">
      <Circle cx="15" cy="15" r="15" fill={color} />
      <Path d="M15 25V6M15 6L10 11M15 6L20 11" stroke="white" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}
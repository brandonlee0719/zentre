import React from 'react';
import Svg, {
  Path,
  SvgProps,
} from 'react-native-svg';

export default function ArrowDown({ color, ...props }: SvgProps) {
  return (
    <Svg width="10" height="5" viewBox="0 0 10 5" fill="none">
      <Path d="M0 0H10L5 5L0 0Z" fill={color} />
    </Svg>
  )
}
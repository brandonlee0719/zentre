import React from 'react';
import Svg, {
  Path,
  SvgProps,
} from 'react-native-svg';

export default function ArrowRight({ color, ...props }: SvgProps) {
  return (
    <Svg width="15" height="12" viewBox="0 0 6 11" fill="none">
      <Path d="M0.5 10.5L0.5 0.5L5.5 5.5L0.5 10.5Z" fill={color} />
    </Svg>
  )
}
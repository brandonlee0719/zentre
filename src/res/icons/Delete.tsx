import React from 'react';
import Svg, {
  Path,
  SvgProps,
} from 'react-native-svg';

export default function Delete({ color, ...props }: SvgProps) {
  return (
    <Svg width="13" height="16" viewBox="0 0 13 16" fill="none">
      <Path d="M0.928711 14.2223C0.928711 15.2046 1.75977 16.0001 2.78587 16.0001H10.2145C11.2405 16.0001 12.0716 15.2046 12.0716 14.2223V3.55566H0.928711V14.2223Z" fill="#DF1313" />
      <Path d="M9.75002 0.888875L8.82142 0H4.17858L3.24998 0.888875H0V2.66667H13V0.888875H9.75002Z" fill="#DF1313" />
    </Svg>
  )
}
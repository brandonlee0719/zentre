import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export default function Contacts({ color, ...props }: SvgProps) {
  return (
    <Svg width="30" height="30" viewBox="0 0 30 30" fill="none">
      <Path d="M2.5 3.75H10C11.3261 3.75 12.5979 4.27678 13.5355 5.21447C14.4732 6.15215 15 7.42392 15 
      8.75V26.25C15 25.2554 14.6049 24.3016 13.9017 23.5983C13.1984 22.8951 12.2446 22.5 11.25 22.5H2.5V3.75Z"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M27.5 3.75H20C18.6739 3.75 17.4021 4.27678 16.4645 5.21447C15.5268 6.15215 15 7.42392 15 
      8.75V26.25C15 25.2554 15.3951 24.3016 16.0983 23.5983C16.8016 22.8951 17.7554 22.5 18.75 22.5H27.5V3.75Z"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}
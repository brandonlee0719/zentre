import React from 'react';
import { View } from 'react-native'
import Svg, { SvgProps, Circle } from 'react-native-svg';

export default function Dot3({ color, ...props }: SvgProps) {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Svg width="4" height="4" viewBox="0 0 4 4" fill="none"
        style={{ marginEnd: 5 }}>
        <Circle cx="2" cy="2" r="2" fill={color} />
      </Svg>

      <Svg width="4" height="4" viewBox="0 0 4 4" fill="none"
        style={{ marginEnd: 5 }}>
        <Circle cx="2" cy="2" r="2" fill={color} />
      </Svg>

      <Svg width="4" height="4" viewBox="0 0 4 4" fill="none" >
        <Circle cx="2" cy="2" r="2" fill={color} />
      </Svg>
    </View>
  )
}
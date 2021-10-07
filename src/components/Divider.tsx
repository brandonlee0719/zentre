import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
export default function Divider() {
  return <View style={[styles.divider]} />;
}

const styles = ScaledSheet.create({
  divider: {
    borderWidth: 0.8,
    borderColor: '#000000',
    marginVertical: '20@vs',
    marginHorizontal: '10@vs',
  },
});

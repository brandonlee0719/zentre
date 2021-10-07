import React, {
  memo
} from 'react'
import {
  ActivityIndicator,
  View
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'

import { Colors } from '../res'

interface OverlayLoadingProps {
  loading: boolean
}

function OverlayLoading({ loading }: OverlayLoadingProps) {
  if (!loading)
    return null

  return (
    <View style={styles.container}>
      <ActivityIndicator color={Colors.primary} size={'large'} />
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    right: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  }
})

export default memo(OverlayLoading)
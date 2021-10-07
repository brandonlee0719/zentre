import { Dimensions } from 'react-native'
import { moderateScale } from 'react-native-size-matters'

export const WIDTH = Dimensions.get('window').width
export const HEIGHT = Dimensions.get('window').height

export const spacing = {
  s: moderateScale(8),
  m: moderateScale(10),
  l: moderateScale(12),
  xl: moderateScale(16),
  xxl: moderateScale(20)
}

export const radius = {
  m: moderateScale(10)
}
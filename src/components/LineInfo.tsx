import React from 'react'
import {
  View,
  TouchableOpacity,
  ViewStyle
} from 'react-native'
import { moderateScale, ScaledSheet } from 'react-native-size-matters'

import { Styles, Colors } from '../res'
import { Text } from '../components'

interface TextStyle {
  color?: string
  size?: number
  font?:
  'black' |
  'bold' |
  'italic' |
  'light' |
  'medium' |
  'regular' |
  'thin'
}

interface Props {
  postfixText: string
  prefixText: string
  hasBorder?: boolean
  hasUnderLine?: boolean
  onClick?: () => void

  prefixTextStyles?: TextStyle
  postfixTextStyles?: TextStyle

  containerStyle?: ViewStyle,
}

const LineInfo: React.FC<Props> = ({
  prefixText,
  postfixText,
  hasBorder = false,
  hasUnderLine = false,
  onClick,

  prefixTextStyles = { color: Colors.black, size: moderateScale(16), font: 'medium' },
  postfixTextStyles = { color: Colors.black, size: moderateScale(16), font: 'medium' },

  containerStyle
}) => {

  return (
    <View style={[styles.container, { ...containerStyle }]}>
      <TouchableOpacity
        onPress={() => onClick && onClick()}
        activeOpacity={onClick ? .7 : 1}
        style={[styles.info, {
          borderWidth: hasBorder ? 1 : 0,
          borderColor: Colors.grey1,
          borderRadius: 4,
          paddingHorizontal: hasBorder ? 10 : 0,
        }]}>

        <Text
          text={prefixText}
          size={prefixTextStyles.size}
          font={prefixTextStyles.font}
          color={prefixTextStyles.color}
        />

        <Text
          text={postfixText}
          size={postfixTextStyles.size}
          font={postfixTextStyles.font}
          color={postfixTextStyles.color}
        />

      </TouchableOpacity>
      {
        hasUnderLine && (
          <View style={styles.separator} />
        )
      }
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    width: Styles.WIDTH,
    paddingHorizontal: '10@ms',
  },
  info: {
    paddingHorizontal: '10@ms',
    flexDirection: 'row',
    width: '100%',
    height: '56@ms',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  separator: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.grey1,
    //marginVertical: '16@ms'
  }
})

export default React.memo(LineInfo)
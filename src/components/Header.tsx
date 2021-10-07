import React from 'react'
import {
  View,
  TouchableOpacity
} from 'react-native'
import { moderateScale, ScaledSheet } from 'react-native-size-matters';
import Text from './Text'

import { Colors, Styles } from '../res'

interface Props {
  text?: string
  prefix?: JSX.Element | null,
  postfix?: JSX.Element | null,
  onPrefix?: () => void,
  onPostfix?: (x?: number, y?: number) => void
}

const Header = ({
  text,
  prefix,
  postfix,
  onPrefix,
  onPostfix
}: Props) => {
  return (
    <View style={styles.container}>
      {
        text && (
          <Text
            text={text}
            size={16}
            color={Colors.black}
            font={'regular'}
            align={'center'}
          />
        )
      }
      {
        prefix && (
          <TouchableOpacity
            onPress={() => {
              onPrefix && onPrefix()
            }}
            activeOpacity={.6}
            style={styles.prefixContainer}>
            {prefix}
          </TouchableOpacity>
        )
      }
      {
        postfix && (
          <TouchableOpacity
            onPress={() => {
              onPostfix && onPostfix()
            }}
            activeOpacity={.6}
            style={styles.postfixContainer}>
            {postfix}
          </TouchableOpacity>
        )
      }
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    width: Styles.WIDTH,
    backgroundColor: 'white',
    height: "60@ms",
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  prefixContainer: {
    height: "44@ms",
    minWidth: '24@ms',
    left: '16@ms',
    //backgroundColor: 'red',
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderRadius: '12@ms',
    marginTop: '8@ms'
  },
  postfixContainer: {
    height: "44@ms",
    minWidth: '24@ms',
    right: '16@ms',
    //backgroundColor: 'red',
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'flex-end',
    justifyContent: 'center',
    borderRadius: '12@ms',
    marginTop: '8@ms'
  }
})

export default React.memo(Header)
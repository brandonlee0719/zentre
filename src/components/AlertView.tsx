import React from 'react'
import {
  View,
  TouchableOpacity
} from 'react-native'
import { View as AnimView } from 'react-native-animatable'
import { ScaledSheet, moderateScale } from 'react-native-size-matters'

import { Colors } from '../res'
import { Text } from '../components'
import { t, useAppDispatch } from '../utils'
import { showAlert } from '../utils/store/controllers/alert'

interface Props {
  show: boolean
  title?: string
  message?: string
  onPositive?: () => void
  positiveText?: string
  onNegative?: () => void
  negativeText?: string
}

function AlertView({
  show,
  message = '',
  title = '',
  onPositive,
  positiveText = '',
  onNegative,
  negativeText = '',
}: Props) {
  if (!show)
    return null

  const dispatch = useAppDispatch()

  const _onNegative = () => {
    dispatch(showAlert({ show: false }))
    onNegative && onNegative()
  }

  const _onPositive = () => {
    dispatch(showAlert({ show: false }))
    onPositive && onPositive()
  }

  return (
    <View style={styles.container}>
      <AnimView
        animation={'bounceIn'}
        style={styles.alertContainer}>
        {
          title !== '' && (
            <Text
              text={title}
              size={18}
              align={'center'}
              color={Colors.black}
              font={'bold'}
            />
          )
        }
        {
          message !== '' && (
            <Text
              text={message}
              size={16}
              align={'center'}
              color={Colors.black}
              font={'bold'}
              contentContainer={{ marginTop: title ? moderateScale(12) : 0 }}
            />
          )
        }

        <View style={styles.buttonsContainer}>
          {
            (onNegative || negativeText !== '') && (
              <TouchableOpacity
                onPress={_onNegative}
                activeOpacity={.7}
                style={styles.negativeContainer}>
                <Text
                  text={negativeText || t('cancel')}
                  size={16}
                  font={'bold'}
                  align={'center'}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            )
          }
          <TouchableOpacity
            onPress={_onPositive}
            activeOpacity={.7}
            style={styles.positiveContainer}>
            <Text
              text={positiveText !== '' ? positiveText : t('ok')}
              size={16}
              font={'bold'}
              align={'center'}
              color={'white'}
            />
          </TouchableOpacity>
        </View>
      </AnimView>
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0, .6)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '24@ms'
  },
  alertContainer: {
    padding: '16@ms',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '10@ms'
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '18@ms',
    justifyContent: 'center',
    marginTop: '16@ms'
  },
  positiveContainer: {
    height: '52@ms',
    width: '128@ms',
    borderRadius: '10@ms',
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  negativeContainer: {
    height: '52@ms',
    width: '128@ms',
    borderRadius: '10@ms',
    borderColor: Colors.primary,
    borderWidth: '2@ms',
    marginEnd: '8@ms',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default React.memo(AlertView)
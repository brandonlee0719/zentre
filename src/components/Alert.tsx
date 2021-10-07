import React from 'react'
import {
  View,
  TouchableOpacity
} from 'react-native'
import { ScaledSheet, moderateScale } from 'react-native-size-matters'
import { View as AnimView } from 'react-native-animatable'

import Text from './Text'
import { Colors } from '../res'
import { t, useAppDispatch } from '../utils'
import { showAlert } from '../utils/store/controllers/alert'
import Input from './Input'

interface Props {
  show: boolean
  categoryInput?: boolean
  rowButton?: boolean
  onCategoryText?: (value: string) => void
  message?: string
  categoryText?: string
  onPositive?: () => void
  positiveText?: string
  onNegative?: () => void
  negativeText?: string
}

const Alert: React.FC<Props> = ({
  show,
  message,
  onPositive,
  positiveText,
  rowButton,
  onNegative,
  negativeText,
  categoryInput,
  onCategoryText,
  categoryText
}) => {

  if (!show)
    return null

  const dispatch = useAppDispatch()

  const _onPositive = () => {
    dispatch(showAlert({ show: false }))
    onPositive && onPositive()
  }

  const _onNegative = () => {
    dispatch(showAlert({ show: false }))
    onNegative && onNegative()
  }

  return (
    <View style={styles.container}>
      <AnimView
        animation={'bounceIn'}
        style={styles.alert}>
        {
          message && (
            <Text
              text={message}
              size={16}
              align={'center'}
              color={Colors.black}
              font={'regular'}
            //contentContainer={{ marginTop: title ? moderateScale(12) : 0 }}
            />
          )
        }
        {
          categoryInput &&
          <View style={{ width: '100%' }}>
            <Input
              defaultValue={categoryText}
              containerStyle={{ marginTop: moderateScale(20), width: '100%' }}
              title={t('categoryName')}
              isRequired={true}
              onTextChanged={onCategoryText}
            />
          </View>
        }
        <View style={{ flexDirection: rowButton ? 'row' : 'column' }}>
          {
            <TouchableOpacity
              onPress={_onPositive}
              activeOpacity={.7}
              style={[styles.positiveContainer, { width: rowButton ? 120 : 'auto', marginLeft: rowButton ? -30 : -5 }]}>
              <Text
                text={positiveText || t('ok')}
                size={18}
                align={'center'}
                color={Colors.primary}
                font={'medium'}
              />

            </TouchableOpacity>
          }

          {
            <TouchableOpacity
              onPress={_onNegative}
              activeOpacity={.7}
              style={[styles.negativeContainer, rowButton && styles.negativeContainerMargin]}>
              <Text
                text={negativeText || t('cancel')}
                size={18}
                align={'center'}
                color={rowButton ? Colors.grey2 : Colors.primary}
                font={'regular'}
              />
            </TouchableOpacity>
          }
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
  alert: {
    paddingVertical: '28@ms',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '4@ms'
  },
  positiveContainer: {
    height: '28@ms',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '32@ms',
    borderRadius: '10@ms'
  },
  negativeContainer: {
    height: '28@ms',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '10@ms'
  },
  negativeContainerMargin: { marginTop: '32@ms' }
})

export default React.memo(Alert)
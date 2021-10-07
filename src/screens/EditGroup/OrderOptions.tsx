import React, {
  useState
} from 'react'
import {
  View,
  Platform
} from 'react-native'
import { moderateScale, ScaledSheet } from 'react-native-size-matters'
import CheckBox from '@react-native-community/checkbox'

import { t } from '../../utils'
import { Colors, Styles, Ic_Arrow_Down } from '../../res'
import { Text } from '../../components'

interface Props {
  onCheckBox: (type: string, value: boolean) => void
}

const OrderOptions: React.FC<Props> = ({
  onCheckBox
}) => {

  const [memberCheck, setMemberCheck] = useState(true)
  const [staffCheck, setStaffCheck] = useState(true)

  return (
    <>
      <View style={styles.container}>
        <View style={styles.checkBoxContainer}>
          {
            Platform.OS === 'android' ?
              (
                <CheckBox
                  disabled={false}
                  value={memberCheck}
                  onValueChange={(newValue) => {
                    setMemberCheck(newValue)
                    onCheckBox && onCheckBox('students', newValue)
                  }}
                  tintColors={{ true: Colors.primary, false: Colors.primary }}
                />
              )
              :
              (
                <CheckBox
                  disabled={false}
                  value={memberCheck}
                  onValueChange={(newValue) => {
                    setMemberCheck(newValue)
                    onCheckBox && onCheckBox('students', newValue)
                  }}
                  onCheckColor={Colors.primary}
                  onFillColor={Colors.primary}
                  onTintColor={Colors.primary}
                />
              )
          }
          <Text
            text={t('students')}
            color={Colors.black}
            size={16}
            font={'regular'}
          />
        </View>
        <View style={styles.checkBoxContainer}>
          {
            Platform.OS === 'android' ?
              (
                <CheckBox
                  disabled={false}
                  value={staffCheck}
                  onValueChange={(newValue) => {
                    setStaffCheck(newValue)
                    onCheckBox && onCheckBox('staffs', newValue)
                  }}
                  tintColors={{ true: Colors.primary, false: Colors.primary }}
                />
              )
              :
              (
                <CheckBox
                  disabled={false}
                  value={staffCheck}
                  onValueChange={(newValue) => {
                    setStaffCheck(newValue)
                    onCheckBox && onCheckBox('staffs', newValue)
                  }}
                  onCheckColor={Colors.primary}
                  onFillColor={Colors.primary}
                  onTintColor={Colors.primary}
                />
              )
          }
          <Text
            text={t('staffs')}
            color={Colors.black}
            size={16}
            font={'regular'}
          />
        </View>
      </View>
      <View style={styles.sortContainer}>
        <Text
          text={t('sortBy:')}
          color={Colors.grey2}
          size={16}
          font={'regular'}
        />
        <Text
          text={t('nameAZ')}
          color={Colors.primary}
          size={16}
          font={'regular'}
          contentContainer={{
            marginHorizontal: moderateScale(6)
          }}
        />
        <Ic_Arrow_Down color={Colors.primary} />
      </View>
    </>
  )
}

const styles = ScaledSheet.create({
  container: {
    paddingHorizontal: '10@ms',
    marginTop: '36@ms',
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '10@ms',
    marginVertical: '36@ms'
  }
})

export default React.memo(OrderOptions)
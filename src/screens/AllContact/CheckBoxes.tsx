import React, {
  useState
} from 'react'
import {
  View,
  Platform
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import CheckBox from '@react-native-community/checkbox'

import { Colors } from '../../res'
import { Text } from '../../components'
import { t } from '../../utils'

interface Props {
  onCheckBox: (type: 'student' | 'staff', check: boolean) => void
}

const CheckBoxes: React.FC<Props> = ({
  onCheckBox
}) => {

  const [memberCheck, setMemberCheck] = useState(true)
  const [staffCheck, setStaffCheck] = useState(true)

  return (
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
                  onCheckBox && onCheckBox('student', newValue)
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
                  onCheckBox && onCheckBox('student', newValue)
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
                  onCheckBox && onCheckBox('staff', newValue)
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
                  onCheckBox && onCheckBox('staff', newValue)
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
  )
}

const styles = ScaledSheet.create({
  container: {
    paddingHorizontal: '10@ms',
    marginVertical: '36@ms',
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
})

export default React.memo(CheckBoxes)
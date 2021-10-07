import React, {
  useState
} from 'react'
import {
  View,
  TouchableOpacity,
  Platform
} from 'react-native'
import { ScaledSheet, moderateScale } from 'react-native-size-matters'
import CheckBox from '@react-native-community/checkbox'

import { Ic_Arrow_Down, Colors, Styles } from '../../../res'
import { t } from '../../../utils'
import { Text } from '../../../components'

interface Props {
  memberType: 'Students' | 'Staffs'
  onShowMembers: (memberType: 'Students' | 'Staffs') => void
  onAllMembers: (memberType: 'Students' | 'Staffs', value: boolean) => void
  numberOfMembers: { selected: number, default: number }
}

const AddMemberHeader: React.FC<Props> = ({
  memberType,
  onShowMembers,
  onAllMembers,
  numberOfMembers
}) => {

  const [allMembers, setAllMembers] = useState(false)

  let title = memberType === 'Students' ? t('students') : t('staffs')
  return (
    <TouchableOpacity
      activeOpacity={.7}
      onPress={() => {
        onShowMembers && onShowMembers(memberType)
      }}
      style={[styles.container, {
        marginTop: memberType === 'Students' ? 0 : 36
      }]}>
      <CheckBox
        disabled={false}
        value={allMembers}
        onValueChange={(newValue) => {
          setAllMembers(newValue)
          onAllMembers && onAllMembers(memberType, newValue)
        }}
        tintColors={Platform.OS === 'android' ?
          { true: Colors.primary, false: Colors.primary } : undefined}
        onCheckColor={Platform.OS === 'android' ? undefined : Colors.primary}
        onFillColor={Platform.OS === 'android' ? undefined : Colors.primary}
        onTintColor={Platform.OS === 'android' ? undefined : Colors.primary}
      />

      <Text
        text={title + (' (' + numberOfMembers.selected + '/' + numberOfMembers.default + ')')}
        size={18}
        color={Colors.black}
        font={'medium'}
        contentContainer={{
          marginStart: moderateScale(10),
          width: Styles.WIDTH - moderateScale(74),
        }}
      />

      <Ic_Arrow_Down color={Colors.primary} />
    </TouchableOpacity>
  )
}

const styles = ScaledSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '10@ms'
  }
})

export default React.memo(AddMemberHeader)
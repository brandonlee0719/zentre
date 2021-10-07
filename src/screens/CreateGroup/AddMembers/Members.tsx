import React, {
  useEffect,
  useState
} from "react"
import {
  View,
  ScrollView
} from 'react-native'
import { moderateScale, ScaledSheet } from 'react-native-size-matters'

import { Styles, Colors, Ic_Arrow_Down } from '../../../res'
import { Text, Input } from '../../../components'
import { t } from '../../../utils'

interface Props {
  classID?: string

  addedMembers: UserInfo[]
  addedStaffs: UserInfo[]

  onAddMembers: (type: 'Students' | 'Staffs') => void
}

import MemberList from "./MemberList"

const Members: React.FC<Props> = ({
  classID = '59366a15-ffdc-4e30-923d-7f5e70f0e2e0',
  addedMembers,
  addedStaffs,
  onAddMembers
}) => {

  const _onAdd = (type: 'Students' | 'Staffs') => {
    onAddMembers && onAddMembers(type)
  }

  return (
    <View style={styles.container}>
      {
        <ScrollView
          showsVerticalScrollIndicator={false}
          horizontal={false}>
          <Text
            text={t('addMember')}
            size={18}
            color={Colors.black}
            font={'medium'}
            contentContainer={{
              marginStart: moderateScale(10),
              marginVertical: moderateScale(36)
            }}
          />

          <MemberList
            type={'Students'}
            members={addedMembers}
            onAdd={_onAdd}
          />

          <MemberList
            type={'Staffs'}
            members={addedStaffs}
            onAdd={_onAdd}
          />
        </ScrollView>
      }
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    width: Styles.WIDTH,
  },
})

export default React.memo(Members)
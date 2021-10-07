import React from 'react'
import {
  View,
  TouchableOpacity,
  Image
} from 'react-native'
import { ScaledSheet, moderateScale } from 'react-native-size-matters'

import { Styles, Colors, Ic_Arrow_Down } from '../../../res'
import { Text } from '../../../components'
import { t } from '../../../utils'

interface Props {
  type: 'Students' | 'Staffs',
  members: UserInfo[]
  onAdd: (type: 'Students' | 'Staffs') => void
}

const MemberList: React.FC<Props> = ({
  type,
  members,
  onAdd
}) => {

  const renderSelected = (member: UserInfo, index: number) => {
    return (
      <View
        key={'member- ' + index}
        style={styles.memberContainer}>
        {
          member.HeadSculpture ?
            (
              <Image source={{ uri: member.HeadSculpture }} style={styles.avatar} />
            )
            :
            (
              <Image source={require('../../../../assets/images/placeHolder.png')}
                style={styles.avatar} />
            )
        }
        <Text
          text={member.FirstName + ' ' + member.LastName}
          color={Colors.black}
          size={14}
          font={'regular'}
          contentContainer={{
            marginStart: 8
          }}
        />
      </View>
    )
  }

  return (
    <View style={[styles.container, {
      marginTop: type === 'Students' ? 0 : 36
    }]}>
      <TouchableOpacity
        onPress={() => {
          onAdd && onAdd(type)
        }}
        activeOpacity={.7}
        style={styles.addUserContainer}>
        <Text
          text={members.length + ' ' +
            (type === 'Students' ? t('addStudents') : t('addStaffs'))}
          color={Colors.black}
          size={16}
          font={'regular'}
        />
        <Ic_Arrow_Down color={Colors.grey2} />

        <View style={styles.titleContainer}>
          <Text
            text={t('students')}
            color={Colors.grey2}
            size={12}
            font={'regular'}
          />
        </View>
      </TouchableOpacity>
      {
        members.length === 0 && (
          <Text
            text={type === 'Students' ? t('noStudents') : t('noStaffs')}
            color={Colors.grey2}
            size={16}
            font={'regular'}
            contentContainer={{
              marginTop: moderateScale(24)
            }}
          />
        )
      }
      {
        members.length > 0 && (
          members.map((member, i) => {
            return renderSelected(member, i)
          })
        )
      }
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    paddingHorizontal: '10@ms'
  },
  addUserContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.grey1,
    borderRadius: '4@ms',
    height: '56@ms',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '10@ms'
  },
  titleContainer: {
    position: 'absolute',
    left: '10@ms',
    top: -8,
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: '6@ms'
  },
  memberContainer: {
    width: '100%',
    marginVertical: '6@ms',
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: '28@ms',
    height: '28@ms',
    borderRadius: '14@ms'
  }
})

export default React.memo(MemberList)
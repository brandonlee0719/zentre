import React, {
  useState
} from 'react'
import {
  View,
  TouchableOpacity
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'

import { Styles, Colors, Ic_Tick } from '../../../res'
import { Text } from '../../../components'
import { t, MEMBER_STATUS, STAFF_STATUS, useAppDispatch } from '../../../utils'
import { changeContactStatus } from '../../../utils/store/controllers/contacts'

interface Props {
  userStatus: string
  roleName: string
  userId: string
  roleBindingId: string
  onChangeStatus: (statusId) => void
}

const Change: React.FC<Props> = ({
  userStatus,
  roleName,
  userId,
  roleBindingId,
  onChangeStatus,
}) => {
  const [selected, setSelected] = useState(userStatus)

  const _onStatus = async (status: { name: string, id: number }) => {
    //console.debug(status)

    setSelected(status.name)
    onChangeStatus(status)

    /*let res = await dispatch(
      changeContactStatus({
        UserID: userId,
        RoleBindingID: roleBindingId,
        Status: status.id.toString()
      })
    )

    if (res.meta.requestStatus !== 'rejected') {
      let payload: any = res.payload
      if (payload) {
        //{ text: data.Remark, success: true }
        if (payload.success) {
          setSelected(status.name)
          onChangeStatus(status.name)
        } else {
          //Error
        }
        return
      }
    }*/
    //Error
  }

  let status = roleName === 'Member' ? MEMBER_STATUS : STAFF_STATUS
  return (
    <View style={styles.container}>
      {
        status.map((s, i) => {
          return (
            <TouchableOpacity
              style={styles.statusContainer}
              activeOpacity={.7}
              key={'key ' + i}
              onPress={() => { _onStatus(s) }}>
              <View style={styles.textContainer}>
                <Text
                  text={s.name}
                  size={16}
                  font={'regular'}
                  color={selected === s.name ? Colors.primary : Colors.black}
                />
                {
                  selected === s.name && (
                    <Ic_Tick color={Colors.primary} />
                  )
                }
              </View>
            </TouchableOpacity>
          )
        })
      }
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    width: Styles.WIDTH,
    paddingHorizontal: '10@ms',
  },
  statusContainer: {
    width: '100%',
    borderColor: Colors.grey3,
    borderWidth: 1,
    borderRadius: '4@ms',
    marginTop: '12@ms',
  },
  textContainer: {
    width: '100%',
    paddingHorizontal: '10@ms',
    paddingVertical: '16@ms',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
})

export default React.memo(Change)
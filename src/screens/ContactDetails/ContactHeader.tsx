import React from 'react'
import {
  View,
  Image
} from 'react-native'
import { ScaledSheet, moderateScale } from 'react-native-size-matters'

import { Colors, Styles } from '../../res'
import { Text } from '../../components'
import moment from 'moment'

interface Props {
  info: UserInfo
  userStatus: any
}

function ContactHeader({
  info,
  userStatus
}: Props) {

  console.warn('info', info)



  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {
          info.HeadSculpture ?
            (
              <Image source={{ uri: 'https://contacts.ichild.com.sg' + info.HeadSculpture }}
                style={styles.avatar} />
            )
            :
            (
              <Image source={require('../../../assets/images/placeHolder.png')}
                style={styles.avatar} />
            )
        }
      </View>
      <View style={styles.textContainer}>
        <Text
          text={info.FirstName + ' ' + info.LastName}
          size={18}
          font={'medium'}
          color={Colors.black}
          maxLine={1}
        />

        <Text
          text={userStatus() + ' since  ' + moment(info.InsertDate).format("DD MMM YYYY")}
          size={14}
          font={'regular'}
          color={Colors.grey2}
          maxLine={1}
          contentContainer={{
            marginTop: moderateScale(6),
          }}
        />
      </View>
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    width: '100%',
    marginTop: '32@ms',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: '42@ms',
    paddingHorizontal: '10@ms',
  },
  iconContainer: {
    height: '80@ms',
    width: '80@ms',
    borderColor: Colors.grey2,
    borderWidth: 1,
    borderRadius: '40@ms',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textContainer: {
    marginStart: '16@ms',
    width: Styles.WIDTH - moderateScale(48 + 80)
  },
  avatar: {
    width: '80@ms',
    height: '80@ms',
    borderRadius: '40@ms'
  }
})

export default React.memo(ContactHeader)
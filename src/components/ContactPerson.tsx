import React from 'react'
import {
  View,
  TouchableOpacity,
  Image
} from 'react-native'
import { moderateScale, ScaledSheet } from 'react-native-size-matters';
import Text from './Text'

import { Colors, Styles, Ic_Dot3_Vertical } from '../res'

interface Props {
  contact: Contact
  onClick?: (contact: Contact) => void
  withSeparator?: boolean
}

const ContactPerson = ({
  contact,
  onClick,
  withSeparator = true
}: Props) => {
  console.warn('contact.HeadSculpture', contact.FirstName, contact.HeadSculpture);

  return (
    <TouchableOpacity
      onPress={() => {
        onClick && onClick(contact)
      }}
      activeOpacity={.7}
      style={styles.container}>
      <View style={styles.contactContainer}>
        {
          contact.HeadSculpture !== "" ?
            (
              <Image source={{
                uri: 'https://contacts.ichild.com.sg' + contact.HeadSculpture,
              }} style={styles.avatar} />
            )
            :
            (
              <Image
                source={require('../../assets/images/placeHolder.png')}
                style={styles.avatar} />
            )
        }

        <Text
          text={contact.FirstName + ' ' + contact.LastName}
          size={16}
          color={Colors.black}
          font={'regular'}
          contentContainer={{
            marginHorizontal: moderateScale(12),
            width: Styles.WIDTH - moderateScale(20 + 24 + 36 + 24)
          }}
        />
        {/* <View style={styles.iconContainer}>
          <Ic_Dot3_Vertical color={Colors.primary} />
        </View> */}
      </View>
      {
        withSeparator && (
          <View style={styles.separator} />
        )
      }
    </TouchableOpacity>
  )
}

const styles = ScaledSheet.create({
  container: {
    width: '100%',
  },
  avatar: {
    width: '36@ms',
    height: '36@ms',
    borderRadius: '18@ms'
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: '12@ms'
  },
  iconContainer: {
    width: '24@ms',
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    width: '100%',
    backgroundColor: Colors.grey3,
    height: 1
  }
})

export default React.memo(ContactPerson)
import React, {
  useState,
  useRef,
  useEffect
} from 'react'
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Keyboard
} from 'react-native'
import { moderateScale, ScaledSheet } from 'react-native-size-matters'

import { Styles, Colors } from '../../../res'
import { Input, DropDownList, Text } from '../../../components'
import { t, useAppDispatch, isEmailValid } from '../../../utils'

import ContactHeader from './ContactHeader'

interface Props {
  relation: Relation | null
  relationships: { name: string, id: string }[] | null
  onFistName: (text) => void,
  onLastName: (text) => void
  onMobileNumber: (text) => void
  onEmail: (text) => void
  onRelationship: (r: { name: string, id: string }) => void
  onPickAvatar: (avatarUri) => void
}

const Edit: React.FC<Props> = ({
  relation,
  relationships,
  onFistName,
  onLastName,
  onMobileNumber,
  onEmail,
  onRelationship,
  onPickAvatar
}) => {
  if (relation === null || relationships === null)
    return null

  /*const [p, sP] = useState(16)
  const padding = useRef(16)
  const pageHeight = useRef(0)
  const touchPos = useRef(0)

  useEffect(() => {
    const kShown = Keyboard.addListener("keyboardDidShow", _keyboardDidShow)
    const kHide = Keyboard.addListener("keyboardDidHide", _keyboardDidHide)

    return () => {
      kShown.remove()
      kHide.remove()
    }
  }, [])

  const _keyboardDidShow = (e) => {
    //console.debug('_keyboardDidShow')
    //console.debug(e)
    let keyboardHeight = e.endCoordinates.height
    let visibleArea = pageHeight.current - keyboardHeight

    if (visibleArea > touchPos.current) {
      //console.debug('Top of the keyboard: ', touchPos.current)
      padding.current = keyboardHeight - moderateScale(18)
      sP(keyboardHeight - moderateScale(18))
    } else {
      //console.debug('Under the keyboard: ', touchPos.current)
      let p = pageHeight.current - touchPos.current
      padding.current = p - moderateScale(28) < 0 ? p : p - moderateScale(28)
      sP(p - moderateScale(28) < 0 ? p : p - moderateScale(28))
    }

  }

  const _keyboardDidHide = () => {
    padding.current = 16
    sP(16)
  }

  const _onLayout = ({ nativeEvent }) => {
    pageHeight.current = nativeEvent.layout.height
  }

  const _onTouchStart = ({ nativeEvent }) => {
    touchPos.current = nativeEvent.pageY
  }*/

  return (
    <View
      //onLayout={_onLayout}
      style={styles.container}>
      <ScrollView
        horizontal={false}
        //onTouchStart={_onTouchStart}
        //contentContainerStyle={{ paddingBottom: padding.current }}
        showsVerticalScrollIndicator={false}>
        <ContactHeader
          name={relation.FirstName + ' ' + relation.LastName}
          avatar={relation.HeadSculpture}
          email={relation.Email}
          editing
          onPick={(uri) => { onPickAvatar(uri) }}
        />

        <Input
          containerStyle={{ marginTop: moderateScale(20) }}
          title={t('firstName')}
          onTextChanged={(text) => { onFistName(text) }}
          defaultValue={relation.FirstName}
          isRequired
        />

        <Input
          containerStyle={{ marginTop: moderateScale(20) }}
          title={t('lastName')}
          onTextChanged={(text) => { onLastName(text) }}
          defaultValue={relation.LastName}
          isRequired
        />

        <DropDownList
          containerStyle={{ marginTop: moderateScale(20) }}
          title={t('relationships')}
          onSelected={(item) => { onRelationship(item) }}
          items={relationships || []}
          value={_getRelation(relationships, relation.UserRelationship)}
          isRequired
        />

        <Input
          containerStyle={{ marginTop: moderateScale(20) }}
          title={t('mobileNumber')}
          onTextChanged={(text) => { onMobileNumber(text) }}
          defaultValue={relation.Phone}
          isRequired
        />

        <Input
          containerStyle={{ marginTop: moderateScale(20) }}
          title={t('guardianEmail|LoginId')}
          defaultValue={relation.Email}
          onTextChanged={(text) => { onEmail(text) }}
          isRequired
        />
      </ScrollView>
    </View>
  )
}

const _getRelation = (relationships, UserRelationship) => {
  if (relationships) {
    //let r: { name: string, id: string } = relationships[0]
    for (let i = 0; relationships?.length; ++i) {
      if (relationships[i].id === UserRelationship) {
        return relationships[i]
      }
    }
  }
}

const styles = ScaledSheet.create({
  container: {
    width: Styles.WIDTH
  },
  headerContainer: {
    paddingHorizontal: '16@ms',
    flexDirection: 'row'
  },
  avatar: {
    width: '82@ms',
    height: '82@ms',
    borderRadius: '41@ms'
  },
  avatarContainer: {
    width: '82@ms',
    height: '82@ms',
    borderRadius: '41@ms',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.grey2,
    borderWidth: 1,
  },
  textContainer: {
    marginStart: '12@ms',
    alignSelf: 'center'
  },
  buttonContainer: {
    backgroundColor: 'white',
    paddingBottom: '16@ms',
    paddingHorizontal: '16@ms',
    flexDirection: 'row'
  },
  doneButton: {
    width: (Styles.WIDTH - moderateScale(48)) / 2,
    backgroundColor: Colors.primary,
    height: '50@ms',
    marginEnd: '8@ms',
    borderRadius: '10@ms',
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteButton: {
    width: (Styles.WIDTH - moderateScale(48)) / 2,
    backgroundColor: Colors.white,
    height: '50@ms',
    marginStart: '8@ms',
    borderRadius: '10@ms',
    borderWidth: '2@ms',
    borderColor: Colors.red,
    alignItems: 'center',
    justifyContent: 'center'
  },
})

export default React.memo(Edit)
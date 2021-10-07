import React, {
  useEffect,
  useState,
  useRef
} from 'react'
import {
  View,
  ScrollView,
  Keyboard
} from 'react-native'
import { ScaledSheet, moderateScale } from 'react-native-size-matters'

import { Styles, Colors } from '../../../res'
import {
  Text,
  Input,
  DropDownList
} from '../../../components'
import { t } from '../../../utils'

interface Props {
  relations: { name: string, id: string }[] | null
  onFistName: (text) => void,
  onLastName: (text) => void
  onMobileNumber: (text) => void
  onEmail: (text) => void
  onRelationship: (r: { name: string, id: string }) => void
}

const NewRelationInfo: React.FC<Props> = ({
  relations,
  onFistName,
  onLastName,
  onMobileNumber,
  onEmail,
  onRelationship
}) => {

  /*const [p, sP] = useState(16)
  const padding = useRef(16)
  const pageHeight = useRef(0)
  const touchPos = useRef(0)*/

  useEffect(() => {
    /*const kShown = Keyboard.addListener("keyboardDidShow", _keyboardDidShow)
    const kHide = Keyboard.addListener("keyboardDidHide", _keyboardDidHide)

    return () => {
      kShown.remove()
      kHide.remove()
    }*/
  }, [])

  /*const _keyboardDidShow = (e) => {
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
        <Text
          text={t('information')}
          size={18}
          font={'medium'}
          color={Colors.black}
          contentContainer={{
            marginStart: moderateScale(10),
            marginTop: moderateScale(20)
          }}
        />

        <Input
          containerStyle={{ marginTop: moderateScale(20) }}
          title={t('firstName')}
          isRequired={true}
          onTextChanged={(text) => { onFistName(text) }}
        />

        <Input
          containerStyle={{ marginTop: moderateScale(20) }}
          title={t('lastName')}
          isRequired={true}
          onTextChanged={(text) => { onLastName(text) }}
        />
        {
          relations && (
            <DropDownList
              containerStyle={{ marginTop: moderateScale(20) }}
              title={t('relationships')}
              isRequired={true}
              onSelected={(item) => { onRelationship(item) }}
              items={relations}
            />
          )
        }

        <Input
          containerStyle={{ marginTop: moderateScale(20) }}
          title={t('mobileNumber')}
          isRequired={true}
          onTextChanged={(text) => { onMobileNumber(text) }}
        />

        <Input
          containerStyle={{ marginTop: moderateScale(20) }}
          title={t('guardianEmail|LoginId')}
          isRequired={true}
          onTextChanged={(text) => { onEmail(text) }}
        />
      </ScrollView>
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
  }
})

export default React.memo(NewRelationInfo)
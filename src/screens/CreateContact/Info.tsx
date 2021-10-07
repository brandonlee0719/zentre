import React, {
  useState,
  useRef,
  useEffect
} from 'react'
import {
  View,
  ScrollView,
  Keyboard,
} from 'react-native'
import { moderateScale } from 'react-native-size-matters'

import { Styles } from '../../res'
import { t } from '../../utils'
import {
  Input,
  DropDownList,
  DatePicker,
} from '../../components'

interface Props {
  onFirstName: (text) => void
  onLastName: (text) => void
  onGender: (item) => void
  onResidency: (item) => void
  onBirthDate: (date: string) => void
  onMobileNo: (mobile) => void
  onPassword: (password) => void
  onCountry: (country) => void
  onEmail: (email) => void
  genders: Gender[]
  nationalities: Nationality[]
  countries: Country[]
  type: string
  checkEmail?: any
  checkFirstName?: any
  checkLastName?: any
  valueEmpty?: any
  gender?: any
  nationality?: any
  country?: any
}

const Info: React.FC<Props> = ({
  onFirstName,
  onLastName,
  onGender,
  onResidency,
  onBirthDate,
  onMobileNo,
  onPassword,
  onCountry,
  genders,
  nationalities,
  countries,
  onEmail,
  type,
  checkEmail,
  checkLastName,
  checkFirstName,
  valueEmpty,
  gender,
  nationality,
  country
}) => {
  const [p, sP] = useState(0)
  const padding = useRef(0)
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
    padding.current = 0
    sP(0)
  }


  const _onLayout = ({ nativeEvent }) => {
    pageHeight.current = nativeEvent.layout.height
  }

  const _onTouchStart = ({ nativeEvent }) => {
    touchPos.current = nativeEvent.pageY
  }

  return (
    <View
      onLayout={_onLayout}
      style={{
        width: Styles.WIDTH,
      }}>
      <ScrollView
        horizontal={false}
        onTouchStart={_onTouchStart}
        contentContainerStyle={{ paddingBottom: padding.current }}
        showsVerticalScrollIndicator={false}>
        <Input
          containerStyle={{ marginTop: moderateScale(20) }}
          title={t('firstName')}
          valueEmpty={valueEmpty}
          isRequired={true}
          onBlur={checkFirstName}
          onTextChanged={onFirstName}
        />

        <Input
          containerStyle={{ marginTop: moderateScale(20) }}
          title={t('lastName')}
          onBlur={checkLastName}
          valueEmpty={valueEmpty}
          isRequired={true}
          onTextChanged={onLastName}
        />

        <DropDownList
          containerStyle={{ marginTop: moderateScale(20) }}
          title={t('gender')}
          value={gender}
          isRequired={true}
          items={genders}
          onSelected={onGender}
        />

        <DatePicker
          containerStyle={{ marginTop: moderateScale(20) }}
          onDateSelected={onBirthDate} />

        <Input
          containerStyle={{ marginTop: moderateScale(20) }}
          title={type === 'student' ? t('id|fin|passport') : t('sid|fin|passport')}
          onTextChanged={onPassword}
        />

        <Input
          containerStyle={{ marginTop: moderateScale(20) }}
          title={t('mobileNumber')}
          keyboardType={"number-pad"}
          isRequired={true}
          onTextChanged={onMobileNo}
        />

        <Input
          containerStyle={{ marginTop: moderateScale(20) }}
          title={t('emailLoginId')}
          valueEmpty={valueEmpty}
          onBlur={checkEmail}
          isRequired={true}
          onTextChanged={onEmail}
        />

        <DropDownList
          containerStyle={{ marginTop: moderateScale(20) }}
          title={t('country')}
          value={country}
          isRequired={true}
          items={countries}
          onSelected={onCountry}
        />

        <DropDownList
          containerStyle={{
            marginTop: moderateScale(20),
            marginBottom: moderateScale(20)
          }}
          title={t('residency')}
          isRequired={true}
          value={nationality}
          items={nationalities}
          onSelected={onResidency}
        />
      </ScrollView>
    </View>
  )
}

export default React.memo(Info)
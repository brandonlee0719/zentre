import React, {
  useState,
  useRef,
  useEffect
} from 'react'
import {
  View,
  ScrollView,
  Keyboard
} from 'react-native'
import { ScaledSheet, moderateScale } from 'react-native-size-matters'
import moment from 'moment'

import {
  Styles
} from '../../../res'
import {
  t,
  checkIfHasInvalidChar,
  useAppDispatch,
  isEmailValid
} from '../../../utils'
import {
  Input,
  DropDownList,
  DatePicker,
} from '../../../components'
import { showAlert } from '../../../utils/store/controllers/alert'
import {
  editContact,
  uploadFile
} from '../../../utils/store/controllers/contacts'

import ProfileHeader from './ProfileHeader'

interface Props {
  genders: Gender[]
  nationalities: Nationality[]
  userInfo: UserInfo
  roleName: string
  onRef?: (ref) => void
  onBack: () => void
}

function Edit({
  genders,
  userInfo,
  roleName,
  nationalities,
  onRef,
  onBack
}: Props) {

  const dispatch = useAppDispatch()

  const firstName = useRef<string>(userInfo.FirstName)
  const lastName = useRef<string>(userInfo.LastName)
  const avatar = useRef<string>('')
  const birthDate = useRef<string>(userInfo.Birthday)
  const gender = useRef<any>(null)
  const pass = useRef<string>(userInfo.INBC)
  const email = useRef<string>(userInfo.Email)
  const tel = useRef<string>(userInfo.Phone)
  const citizen = useRef<string>(userInfo.CountryID)

  const [p, sP] = useState(12)
  const padding = useRef(12)
  const pageHeight = useRef(0)
  const touchPos = useRef(0)

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow)
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide)

    onRef && onRef({
      onSave: onSave
    })

    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow)
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide)

      onRef && onRef({
        onSave: null
      })
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
    padding.current = 12
    sP(12)
  }

  const _onLayout = ({ nativeEvent }) => {
    pageHeight.current = nativeEvent.layout.height
  }

  const _onTouchStart = ({ nativeEvent }) => {
    touchPos.current = nativeEvent.pageY
  }

  const _getGender = () => {
    for (let i = 0; i < genders.length; ++i) {
      console.warn('gender.current', gender.current);

      if (parseInt(genders[i].name) === gender.current) {
        return genders[i]
      }
      if (parseInt(genders[i].id) === userInfo.Sex) {
        return genders[i]
      }
    }

    return genders[0]
  }

  const _getNationality = () => {
    for (let i = 0; i < nationalities.length; ++i) {
      if (nationalities[i].name.toUpperCase() === citizen.current.toUpperCase()) {
        return nationalities[i]
      }
      if (nationalities[i].id.toUpperCase() === userInfo.CountryID.toUpperCase()) {
        return nationalities[i]
      }
    }

    return nationalities[0]
  }

  const _onPick = (uri: string) => {
    avatar.current = uri
  }

  const [state, setState] = useState({
    gender: _getGender(),
    citizenship: _getNationality(),
  })

  const getCountryID = (data, name) => {
    const filtered = data?.filter(e => e.name.toLowerCase() == name.toLowerCase())
    const value = filtered?.length && filtered[0].id
    return value
  }

  const onSave = () => {
    const _onSave = async () => {
      let selectedGender = _getGender()
      if (gender.current) {
        selectedGender = gender.current
      }


      if (firstName.current === '' || lastName.current === '' ||
        selectedGender.name === 'Select' || email.current === '') {

        dispatch(
          showAlert({
            show: true,
            title: t('warning'),
            message: t('fillParts')
          })
        )
        return
      }

      if (checkIfHasInvalidChar(pass.current)) {
        dispatch(
          showAlert({
            show: true,
            title: t('warning'),
            message: t('canNotInclude')
          })
        )
        return
      }

      if (!isEmailValid(email.current)) {
        dispatch(
          showAlert({
            show: true,
            title: t('warning'),
            message: t('emailAddressFormat')
          })
        )
        return
      }


      let avatarPath = ''
      //console.debug('Enter: ', avatar.current)
      if (avatar.current !== '') {
        let resAvatar = await dispatch(
          uploadFile({ file: avatar.current })
        )
        if (resAvatar.meta.requestStatus !== 'rejected') {
          if (resAvatar.payload) {
            let payload: any = resAvatar.payload
            if (payload.success) {
              //console.debug(payload.text)
              avatarPath = 'https://contacts.ichild.com.sg' + payload.text

              //console.debug('Inside: ', avatarPath)
            } else {
              dispatch(
                showAlert({
                  show: true,
                  title: t('warning'),
                  message: payload.text
                })
              )
              return
            }
          } else return
        }
      }


      const citizenship = getCountryID(nationalities, citizen.current)
      const citizenship1 = _getNationality()
      console.warn('citizenship', citizenship);
      console.warn('citizenship1', citizenship1);


      let res = await dispatch(
        editContact({
          editedUser: userInfo.UserID,
          FirstName: firstName.current,
          LastName: lastName.current,
          Sex: selectedGender?.id?.toString(),
          Birthday: moment(birthDate.current).format('YYYY-MM-DD'),
          INBC: pass.current,
          Email: email.current,
          Phone: tel.current,
          CountryBorn: userInfo.CountryBornID,
          Country: !citizenship ? citizenship1.id : citizenship,
          HeadPic: avatarPath
        })
      )

      if (res.meta.requestStatus !== 'rejected') {
        if (res.payload) {
          let payload: any = res.payload
          if (payload.success) {
            onBack && onBack()
          } else {
            dispatch(
              showAlert({
                show: true,
                title: t('warning'),
                message: payload.text
              })
            )
          }
          return
        }
      }

      dispatch(
        showAlert({
          show: true,
          title: t('error'),
          message: t('somethingWrong')
        })
      )
    }

    dispatch(
      showAlert({
        show: true,
        message: t('wannaSave'),
        positiveText: t('save'),
        onPositive: _onSave,
        negativeText: t('cancel')
      })
    )
  }
  console.warn('userInfo', userInfo);

  return (
    <View
      onLayout={_onLayout}
      style={styles.container}>
      <ScrollView
        horizontal={false}
        onTouchStart={_onTouchStart}
        contentContainerStyle={{ paddingBottom: padding.current }}
        showsVerticalScrollIndicator={false}>

        <ProfileHeader
          HeadSculpture={userInfo.HeadSculpture}
          FirstName={userInfo.FirstName}
          LastName={userInfo.LastName}
          Email={userInfo.Email}
          RoleName={roleName}
          editing
          onPick={_onPick}
        />

        <Input
          title={t('firstName')}
          defaultValue={userInfo.FirstName}
          onTextChanged={(f) => firstName.current = f}
          isRequired
        />

        <Input
          title={t('lastName')}
          defaultValue={userInfo.LastName}
          containerStyle={{ marginTop: moderateScale(20) }}
          onTextChanged={(l) => {
            //console.debug(l)
            lastName.current = l
          }}
          isRequired
        />

        <DatePicker
          title={t('birthDate')}
          containerStyle={{ marginTop: moderateScale(20) }}
          valueDate={userInfo.Birthday}
          futureDateDisalbed={true}
          onDateSelected={(d) => {
            //console.debug(moment(d).format('YYYY-MM-DD'))
            birthDate.current = moment(d).format('YYYY-MM-DD')
          }}
        />

        <DropDownList
          containerStyle={{ marginTop: moderateScale(20) }}
          title={t('gender')}
          items={genders}

          onSelected={(g) => {
            console.warn(g)
            setState(pre => ({ ...pre, gender: g }))
            gender.current = g
          }}
          value={state.gender}
          isRequired
        />

        <Input
          title={t('idFinPass')}
          defaultValue={userInfo.INBC}
          containerStyle={{ marginTop: moderateScale(20) }}
          onTextChanged={(i) => {
            //console.debug(i)
            pass.current = i
          }}
        />

        <Input
          title={t('emailLoginId')}
          defaultValue={userInfo.Email}
          containerStyle={{ marginTop: moderateScale(20) }}
          isRequired
          onTextChanged={(e) => {
            //console.debug(e)
            email.current = e
          }}
        />

        <Input
          title={t('mobileNumber')}
          defaultValue={userInfo.Phone}
          containerStyle={{ marginTop: moderateScale(20) }}
          onTextChanged={(t) => {
            //console.debug(t)
            tel.current = t
          }}
        />

        <DropDownList
          containerStyle={{ marginTop: moderateScale(20) }}
          title={t('citizenship')}
          items={nationalities}
          value={state.citizenship}
          onSelected={(n) => {
            setState(pre => ({ ...pre, citizenship: n }))
            //console.debug(n)
            citizen.current = n
          }}
        />
      </ScrollView>
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
  },
})

export default React.memo(Edit)
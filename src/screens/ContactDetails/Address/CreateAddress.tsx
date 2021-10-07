import React, {
  useState,
  useRef,
  useEffect
} from 'react'
import {
  View,
  ScrollView,
  TouchableOpacity,
  Keyboard
} from 'react-native'
import { ScaledSheet, moderateScale } from 'react-native-size-matters'

import { Styles, Colors } from '../../../res'
import { DropDownList, Input, Text } from '../../../components'
import { t, useAppDispatch } from '../../../utils'
import { getProvince, getCity } from '../../../utils/store/controllers/appData'
import { showAlert } from '../../../utils/store/controllers/alert'
import { createContactAddress } from '../../../utils/store/controllers/contacts'

interface Props {
  userId: string
  creating: boolean
  addressTypes: AddressType[]
  countryOfAddress: CountryOfAddress[]
  onCancel: () => void
}

const CreateAddress: React.FC<Props> = ({
  userId,
  creating,
  addressTypes,
  countryOfAddress,
  onCancel
}) => {
  if (!creating)
    return null

  /*console.debug(userId)
  console.debug(creating)
  console.debug(addressTypes)
  console.debug(countryOfAddress)*/

  const dispatch = useAppDispatch()

  const [p, sP] = useState(16)
  const padding = useRef(16)
  const pageHeight = useRef(0)
  const touchPos = useRef(0)

  const [addressType, setAddressType] = useState<AddressType | null>(null)
  const [countryAddress, setCountryOfAddress] = useState<CountryOfAddress | null>(null)
  const [province, setProvince] = useState<Province | null>(null)
  const [city, setCity] = useState<City | null>(null)
  const [street, setStreet] = useState('')
  const [buildName, setBuildName] = useState('')
  const [unitNo, setUnitNo] = useState('')
  const [floorNo, setFloorNo] = useState('')
  const [houseNo, setHouseNo] = useState('')
  const [postalCode, setPostalCode] = useState('')

  const [provinces, setProvinces] = useState<Province[] | null>(null)
  const [cities, setCities] = useState<City[] | null>(null)


  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow)
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide)

    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow)
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide)
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
  }

  const _setCountryOfAddress = async (item: CountryOfAddress) => {
    if (item.name === 'Select') {
      setCountryOfAddress(item)
      setProvinces(null)
      setProvince(null)
      setCities(null)
      _setInitValue()
      return
    }

    if (item.id !== countryAddress?.id) {
      setCountryOfAddress(item)
      setProvinces(null)
      setProvince(null)
      setCities(null)
      _setInitValue()

      let res = await dispatch(getProvince(item.id))
      if (res.meta.requestStatus !== 'rejected') {
        if (res.payload) {
          setProvinces(res.payload)
          if (res.payload?.length === 0) {
            setCities([])
            setCity({ name: 'Select', id: '0' })
          }
          return
        }
      }
      //Error
    }
  }

  const _setProvince = async (item: Province) => {
    if (item.name === 'Select') {
      setProvince(item)
      setCities(null)
      _setInitValue()
      return
    }

    if (item.id !== province?.id) {
      setProvince(item)
      setCities(null)
      _setInitValue()

      let res = await dispatch(getCity(item.id))
      if (res.meta.requestStatus !== 'rejected') {
        if (res.payload) {
          setCities(res.payload)
          if (res.payload?.length === 0) {
            setCity({ name: 'Select', id: '0' })
          }
          return
        }
      }
      //Error
    }
  }

  const _setInitValue = () => {
    setCity(null)
    setStreet('')
    setBuildName('')
    setUnitNo('')
    setFloorNo('')
    setHouseNo('')
    setPostalCode('')
  }

  const _create = async () => {
    if (addressType === null || addressType?.name === 'Select') {
      dispatch(showAlert({
        show: true,
        title: t('warning'),
        message: t('fillParts')
      }))
      return
    }

    let address: {
      UserID: string,
      CreateID: string,
      AddressType: string,
      HouseNo?: string,
      FloorNo?: string,
      UnitNo?: string,
      BuildName?: string,
      Street?: string,
      AddressCountry?: string,
      Province?: string,
      City?: string,
      PostalCode?: string
    } = {
      UserID: '',
      CreateID: '',
      AddressType: ''
    }

    address.UserID = userId
    address.AddressType = addressType.id

    if (countryAddress?.name !== 'Select' && countryAddress !== null)
      address.AddressCountry = countryAddress.id

    if (province?.name !== 'Select' && province !== null)
      address.Province = province.id

    if (city !== null && city?.name !== 'Select')
      address.City = city.id

    if (street !== '')
      address.Street = street

    if (buildName !== '')
      address.BuildName = buildName

    if (unitNo !== '')
      address.UnitNo = unitNo

    if (floorNo !== '')
      address.FloorNo = floorNo

    if (houseNo !== '')
      address.HouseNo = houseNo

    if (postalCode !== '')
      address.PostalCode = postalCode

    //console.debug(address)
    //return
    let res = await dispatch(
      createContactAddress(address)
    )

    if (res.meta.requestStatus !== 'rejected') {
      if (res.payload) {
        let payload: any = res.payload
        if (payload.success) {
          onCancel()
        } else {
          dispatch(showAlert({
            show: true,
            title: t('warning'),
            message: payload.text
          }))
        }
        return
      }
    }

    dispatch(showAlert({
      show: true,
      title: t('error'),
      message: t('somethingWrong')
    }))
  }

  const addSelectToList = (list): { name: string, id: string }[] => {
    if (list && list.length === 0)
      return list

    if (list[0].name === 'Select')
      return list

    let tempList = JSON.parse(JSON.stringify(list))

    tempList.unshift({ name: 'Select', id: '0' })
    return tempList
  }

  return (
    <View
      onLayout={_onLayout}
      style={styles.container}>
      <ScrollView
        horizontal={false}
        onTouchStart={_onTouchStart}
        contentContainerStyle={{ paddingBottom: padding.current }}
        showsVerticalScrollIndicator={false}>

        {
          addressTypes && addressTypes.length > 0 && (
            <DropDownList
              containerStyle={{ marginTop: moderateScale(20) }}
              title={t('type')}
              isRequired
              onSelected={(item) => { setAddressType(item) }}
              items={addSelectToList(addressTypes)}
            />
          )
        }

        {
          countryOfAddress && countryOfAddress.length > 0 && (
            <DropDownList
              containerStyle={{ marginTop: moderateScale(20) }}
              title={t('country')}
              onSelected={_setCountryOfAddress}
              items={addSelectToList(countryOfAddress)}
            />
          )
        }

        {
          provinces !== null && (
            <DropDownList
              containerStyle={{ marginTop: moderateScale(20) }}
              title={t('province')}
              onSelected={_setProvince}
              items={addSelectToList(provinces)}
            />
          )
        }
        {
          cities !== null && provinces !== null && (
            <DropDownList
              containerStyle={{ marginTop: moderateScale(20) }}
              title={t('city')}
              onSelected={(item) => setCity(item)}
              items={addSelectToList(cities)}
            />
          )
        }
        {
          city !== null && (
            <>
              <Input
                containerStyle={{ marginTop: moderateScale(20) }}
                title={t('street')}
                onTextChanged={(text) => setStreet(text)}
              />

              <Input
                containerStyle={{ marginTop: moderateScale(20) }}
                title={t('buildName')}
                onTextChanged={(text) => setBuildName(text)}
              />

              <Input
                containerStyle={{ marginTop: moderateScale(20) }}
                title={t('unitNo')}
                onTextChanged={(text) => setUnitNo(text)}
              />

              <Input
                containerStyle={{ marginTop: moderateScale(20) }}
                title={t('floorNo')}
                onTextChanged={(text) => setFloorNo(text)}
              />

              <Input
                containerStyle={{ marginTop: moderateScale(20) }}
                title={t('houseNo')}
                onTextChanged={(text) => setHouseNo(text)}
              />

              <Input
                containerStyle={{ marginTop: moderateScale(20) }}
                title={t('postalCode')}
                onTextChanged={(text) => setPostalCode(text)}
              />
            </>
          )
        }

      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={_create}
          activeOpacity={.7}
          style={styles.createButton}>
          <Text
            text={t('create')}
            size={16}
            font={'medium'}
            color='white'
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onCancel}
          activeOpacity={.7}
          style={styles.cancelButton}>
          <Text
            text={t('cancel')}
            size={16}
            font={'medium'}
            color={Colors.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    width: Styles.WIDTH
  },
  buttonContainer: {
    backgroundColor: 'white',
    paddingBottom: '16@ms',
    paddingHorizontal: '16@ms',
    flexDirection: 'row'
  },
  createButton: {
    width: (Styles.WIDTH - moderateScale(48)) / 2,
    backgroundColor: Colors.primary,
    height: '50@ms',
    marginEnd: '8@ms',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelButton: {
    width: (Styles.WIDTH - moderateScale(48)) / 2,
    backgroundColor: Colors.white,
    height: '50@ms',
    marginStart: '8@ms',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
})

export default React.memo(CreateAddress)
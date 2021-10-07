import React, {
  useState,
  useEffect,
  useRef
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
import { editContactAddress } from '../../../utils/store/controllers/contacts'

interface Props {
  selectedAddress: UserAddress | null
  userId: string
  addressTypes: AddressType[]
  countryOfAddress: CountryOfAddress[]
  onCancel: () => void
}

const Edit: React.FC<Props> = ({
  selectedAddress,
  userId,
  onCancel,
  addressTypes,
  countryOfAddress
}) => {
  if (addressTypes.length === 0 || countryOfAddress.length === 0)
    return null

  if (!selectedAddress)
    return null

  const dispatch = useAppDispatch()

  //const [padding, setPadding] = useState(16)
  const [p, sP] = useState(16)
  const padding = useRef(16)
  const pageHeight = useRef(0)
  const touchPos = useRef(0)

  const [addressType, setAddressType] = useState<AddressType>(
    getSelected(addressTypes, selectedAddress.ContactType)
  )
  const [countryAddress, setCountryOfAddress] = useState<CountryOfAddress>(
    getSelected(countryOfAddress, selectedAddress.ConatctCountry)
  )
  const [province, setProvince] = useState<Province | null>(null)
  const [city, setCity] = useState<City | null>(null)
  const [street, setStreet] = useState(selectedAddress.Address || '')
  const [buildName, setBuildName] = useState(selectedAddress.BuildName || '')
  const [unitNo, setUnitNo] = useState(selectedAddress.UnitNo || '')
  const [floorNo, setFloorNo] = useState(selectedAddress.FloorNo || '')
  const [houseNo, setHouseNo] = useState(selectedAddress.HouseNo || '')
  const [postalCode, setPostalCode] = useState(selectedAddress.ZipCode || '')

  const [provinces, setProvinces] = useState<Province[] | null>(null)
  const [cities, setCities] = useState<City[] | null>(null)

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow)
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide)

    if (selectedAddress.ConatctCountry !== "") {
      _setCountryOfAddress(countryAddress, selectedAddress.ContactProvince)
    }
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

  const _setCountryOfAddress = async (
    item: CountryOfAddress,
    selectedProvinceId?: string) => {

    setCountryOfAddress(item)
    setProvinces(null)
    setProvince(null)
    setCities(null)
    _setInitValue()

    if (item.name !== 'Select') {
      let res = await dispatch(getProvince(item.id))
      if (res.meta.requestStatus !== 'rejected') {
        if (res.payload) {
          setProvinces(res.payload)
          if (res.payload?.length === 0) {
            setCities([])
            setCity({ name: 'Select', id: '0' })
          }

          if (res.payload?.length > 0 && selectedProvinceId && selectedProvinceId !== "") {
            _setProvince(
              getSelected(res.payload, selectedProvinceId),
              selectedAddress.ContactCity
            )
          }
          return
        }
      }
      //Error*/
    }
  }

  const _setProvince = async (item: Province, selectedCityId?: string) => {

    setProvince(item)
    setCities(null)
    _setInitValue()

    if (item.id !== 'Select') {
      let res = await dispatch(getCity(item.id))
      if (res.meta.requestStatus !== 'rejected') {
        if (res.payload) {
          //console.debug(res.payload)
          setCities(addSelect(res.payload))
          if (res.payload.length === 0) {
            setCity({ name: 'Select', id: '0' })
          }

          if (res.payload.length > 0 && selectedCityId && selectedCityId !== "") {
            setCity(getSelected(res.payload, selectedCityId))
          }
          return
        }
      }
      //Error
    }
  }

  const _setInitValue = () => {
    setCity(null)
    setStreet(selectedAddress.Address)
    setBuildName(selectedAddress.BuildName)
    setUnitNo(selectedAddress.UnitNo)
    setFloorNo(selectedAddress.FloorNo)
    setHouseNo(selectedAddress.HouseNo)
    setPostalCode(selectedAddress.ZipCode)
  }

  const _done = async () => {
    if (addressType === null || addressType?.name === 'Select') {
      dispatch(showAlert({
        show: true,
        title: t('warning'),
        message: t('fillParts')
      }))
      return
    }

    let address: {
      AddressID: string,
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
      AddressID: '',
      UserID: '',
      CreateID: '',
      AddressType: ''
    }

    address.AddressID = selectedAddress.ContactID
    address.UserID = userId
    address.AddressType = addressType.id

    /*console.debug(addressType)
    console.debug(houseNo)
    console.debug(floorNo)
    console.debug(unitNo)
    console.debug(buildName)
    console.debug(street)
    console.debug(city)
    console.debug(province)
    console.debug(countryAddress)
    console.debug(postalCode)*/

    //return
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

    let res = await dispatch(
      editContactAddress(address)
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

  return (
    <View
      onLayout={_onLayout}
      style={styles.container}>
      <ScrollView
        horizontal={false}
        onTouchStart={_onTouchStart}
        contentContainerStyle={{ paddingBottom: padding.current }}
        showsVerticalScrollIndicator={false}>
        <DropDownList
          containerStyle={{ marginTop: moderateScale(20) }}
          title={t('type')}
          onSelected={(item) => setAddressType(item)}
          value={addressType}
          items={addressTypes}
        />
        <DropDownList
          containerStyle={{ marginTop: moderateScale(20) }}
          title={t('country')}
          value={countryAddress}
          onSelected={_setCountryOfAddress}
          items={countryOfAddress}
        />

        {
          provinces !== null && (
            <DropDownList
              containerStyle={{ marginTop: moderateScale(20) }}
              title={t('province')}
              onSelected={_setProvince}
              value={getSelected(provinces, selectedAddress.ContactProvince)}
              items={addSelect(provinces)}
            />
          )
        }
        {
          cities !== null && provinces !== null && (
            <DropDownList
              containerStyle={{ marginTop: moderateScale(20) }}
              title={t('city')}
              value={getSelected(cities, selectedAddress.ContactCity)}
              onSelected={(item) => setCity(item)}
              items={cities}
            />
          )
        }

        <Input
          containerStyle={{ marginTop: moderateScale(20) }}
          title={t('street')}
          //value={street}
          onTextChanged={(text) => setStreet(text)}
          defaultValue={selectedAddress.Address}
        />

        <Input
          containerStyle={{ marginTop: moderateScale(20) }}
          title={t('buildName')}
          //value={buildName}
          onTextChanged={(text) => setBuildName(text)}
          defaultValue={selectedAddress.BuildName}
        />

        <Input
          containerStyle={{ marginTop: moderateScale(20) }}
          title={t('unitNo')}
          //value={unitNo}
          onTextChanged={(text) => setUnitNo(text)}
          defaultValue={selectedAddress.UnitNo}
        />

        <Input
          containerStyle={{ marginTop: moderateScale(20) }}
          title={t('floorNo')}
          //value={floorNo}
          onTextChanged={(text) => setFloorNo(text)}
          defaultValue={selectedAddress.FloorNo}
        />

        <Input
          containerStyle={{ marginTop: moderateScale(20) }}
          title={t('houseNo')}
          //value={houseNo}
          onTextChanged={(text) => setHouseNo(text)}
          defaultValue={selectedAddress.HouseNo}
        />

        <Input
          containerStyle={{ marginTop: moderateScale(20) }}
          title={t('postalCode')}
          //value={postalCode}
          onTextChanged={(text) => setPostalCode(text)}
          defaultValue={selectedAddress.ZipCode}
        />
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={_done}
          activeOpacity={.7}
          style={styles.createButton}>
          <Text
            text={t('done')}
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

const getSelected = (a: { name: string, id: string }[], selectedId: string) => {
  let array = addSelect(a)
  let s = array[0]


  array.forEach(c => {
    if (c.id === selectedId) {
      s = c
    }
  })

  return s
}

const addSelect = (array): { name: string, id: string }[] => {
  if (array?.length === 0) {
    array = []
    array.push({ name: 'Select', id: '0' })
    return array
  }

  if (array[0].name === 'Select')
    return array

  let tempList = JSON.parse(JSON.stringify(array))

  tempList.unshift({ name: 'Select', id: '0' })
  return tempList
}

const styles = ScaledSheet.create({
  container: {
    width: Styles.WIDTH
  },
  buttonContainer: {
    backgroundColor: 'white',
    paddingBottom: '16@ms',
    paddingHorizontal: '10@ms',
    flexDirection: 'row'
  },
  createButton: {
    width: (Styles.WIDTH - moderateScale(48)) / 2,
    backgroundColor: Colors.primary,
    height: '56@ms',
    marginEnd: '8@ms',
    borderRadius: '4@ms',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelButton: {
    width: (Styles.WIDTH - moderateScale(48)) / 2,
    backgroundColor: Colors.white,
    height: '56@ms',
    marginStart: '8@ms',
    borderRadius: '4@ms',
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
})

export default React.memo(Edit)
import React, {
  useEffect,
  useState
} from 'react'
import {
  View,
  TouchableOpacity
} from 'react-native'
import { moderateScale, ScaledSheet } from 'react-native-size-matters'

import { Styles, Colors, Ic_Dot3 } from '../../../res'
import { Text } from '../../../components'
import { t, useAppDispatch } from '../../../utils'
import { getCity, getProvince } from '../../../utils/store/controllers/appData'
import { showPopup } from '../../../utils/store/controllers/popup'

interface Props {
  address: UserAddress
  country: CountryOfAddress
  onEdit: (address: UserAddress) => void
  onDelete: (id: string) => void
}

const AddressInfo: React.FC<Props> = ({
  address,
  country,
  onEdit,
  onDelete
}) => {

  const dispatch = useAppDispatch()
  const [province, setProvince] = useState('')
  const [city, setCity] = useState('')

  useEffect(() => {
    fetchProvince()
    fetchCity()
  }, [address])

  const fetchProvince = async () => {
    if (address.ContactProvince !== "") {
      let res = await dispatch(
        getProvince(address.ConatctCountry)
      )

      if (res.meta.requestStatus !== 'rejected') {
        if (res.payload) {
          mapProvince(res.payload)
        }
      }
    } else {
      setProvince("")
    }
  }

  const mapProvince = (provinces: Province[]) => {
    if (typeof provinces === 'object') {
      let p: Province = provinces[0]
      for (let i = 0; i < provinces.length; ++i) {
        if (address.ContactProvince === provinces[i].id) {
          p = provinces[i]
          break
        }
      }
      setProvince(p.name)
    }
  }

  const fetchCity = async () => {
    if (address.ContactCity !== "") {
      let res = await dispatch(
        getCity(address.ContactProvince)
      )

      if (res.meta.requestStatus !== 'rejected') {
        if (res.payload) {
          mapCity(res.payload)
        }
      }
    } else {
      setCity("")
    }
  }

  const mapCity = (cities: City[]) => {
    if (typeof cities === 'object') {
      let c: City = cities[0]
      for (let i = 0; i < cities.length; ++i) {
        if (address.ContactCity === cities[i].id) {
          c = cities[i]
          break
        }
      }
      setCity(c.name)
    }
  }

  const _onOption = ({ nativeEvent }) => {
    dispatch(
      showPopup({
        show: true,
        position: { x: nativeEvent.pageX, y: nativeEvent.pageY },
        options: [
          {
            text: t('edit'),
            onClick: () => { onEdit && onEdit(address) }
          },
          {
            text: t('delete'),
            onClick: () => { onDelete && onDelete(address.ContactID) }
          }
        ]
      })
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.addressContainer}>
        <View style={styles.fieldContainer}>
          <Text
            text={t('country') + ' : '}
            font={'medium'}
            size={16}
            color={Colors.black}
          />
          <Text
            text={country.name === 'Select' ? '' : country.name}
            font={'medium'}
            size={16}
            color={Colors.black}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text
            text={t('province') + ' : '}
            font={'medium'}
            size={16}
            color={Colors.black}
          />
          <Text
            text={province === 'Select' ? '' : province}
            font={'medium'}
            size={16}
            color={Colors.black}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text
            text={t('city') + ' : '}
            font={'medium'}
            size={16}
            color={Colors.black}
          />
          <Text
            text={city === 'Select' ? '' : city}
            font={'regular'}
            size={16}
            color={Colors.black}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text
            text={t('address') + ' : '}
            font={'medium'}
            size={16}
            color={Colors.black}
          />
          <Text
            text={address.Address}
            font={'regular'}
            size={16}
            color={Colors.black}
            contentContainer={{
              width: Styles.WIDTH - moderateScale(144),
            }}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text
            text={t('buildName') + ' : '}
            font={'medium'}
            size={16}
            color={Colors.black}
          />
          <Text
            text={address.BuildName}
            font={'regular'}
            size={16}
            color={Colors.black}
            contentContainer={{
              width: Styles.WIDTH - moderateScale(144),
            }}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text
            text={t('unitNo') + ' : '}
            font={'medium'}
            size={16}
            color={Colors.black}
          />
          <Text
            text={address.UnitNo}
            font={'regular'}
            size={16}
            color={Colors.black}
            contentContainer={{
              width: Styles.WIDTH - moderateScale(144),
            }}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text
            text={t('houseNo') + ' : '}
            font={'medium'}
            size={16}
            color={Colors.black}
          />
          <Text
            text={address.HouseNo}
            font={'regular'}
            size={16}
            color={Colors.black}
            contentContainer={{
              width: Styles.WIDTH - moderateScale(144),
            }}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text
            text={t('floorNo') + ' : '}
            font={'medium'}
            size={16}
            color={Colors.black}
          />
          <Text
            text={address.FloorNo}
            font={'regular'}
            size={16}
            color={Colors.black}
            contentContainer={{
              width: Styles.WIDTH - moderateScale(144),
            }}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text
            text={t('postalCode') + ' : '}
            font={'medium'}
            size={16}
            color={Colors.black}
          />
          <Text
            text={address.ZipCode}
            font={'regular'}
            size={16}
            color={Colors.black}
            contentContainer={{
              width: Styles.WIDTH - moderateScale(144),
            }}
          />
        </View>
        <TouchableOpacity
          onPress={_onOption}
          activeOpacity={.7}
          style={styles.optionContainer}>
          <Ic_Dot3 color={Colors.black} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    width: Styles.WIDTH,
    paddingHorizontal: '16@ms',
    marginTop: '16@ms'
  },
  addressContainer: {
    borderColor: Colors.grey1,
    borderWidth: 1,
    width: '100%',
    marginTop: '12@ms',
    borderRadius: '10@ms',
    paddingHorizontal: '16@ms',
    paddingVertical: '8@ms'
  },
  fieldContainer: {
    flexDirection: 'row',
    //alignItems: 'center',
    marginTop: '8@ms',
    width: Styles.WIDTH - moderateScale(64),
  },
  optionContainer: {
    position: 'absolute',
    right: 8,
    top: 4,
    width: '32@ms',
    height: '32@ms',
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'red'
  }
})

export default React.memo(AddressInfo)
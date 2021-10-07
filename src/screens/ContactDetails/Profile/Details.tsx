import React from 'react'
import {
  View,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import { moderateScale, ScaledSheet } from 'react-native-size-matters'

import { Styles, Colors, Ic_Arrow_Right } from '../../../res'
import { Text } from '../../../components'
import { t, GENDER } from '../../../utils'

const fields = [
  "Gender",
  "Birth Date",
  "ID / FIN / Password",
  "Email / Login ID",
  "Mobile Number",
  "Country",
  // "Postal Code",
  "Citizenship"
]

interface Props {
  Sex: number
  Birthday: string
  INBC: string
  Email: string
  Address: string
  ZipCode: string
  Tel: string
  CountryID: string
  CountryBornID: string
  nationalities: any
  genders: any
  countries: any
}

const Details: React.FC<Props> = ({
  Sex,
  Birthday,
  INBC,
  Email,
  genders,
  countries,
  nationalities,
  Tel,
  CountryID,
  CountryBornID
}) => {

  const getCountryName = (data, id) => {
    const filtered = data?.filter(e => e.id.toLowerCase() == id.toLowerCase())
    const value = filtered?.length && filtered[0].name
    return value
  }


  const renderField = (field, i) => {
    return (
      <View
        key={'key - ' + i}>
        <View style={styles.fieldContainer}>
          <View style={styles.field}>
            <Text
              text={field}
              color={Colors.grey2}
              size={16}
              font={'regular'}
              maxLine={1}
            />
          </View>
          <View style={styles.field}>
            <Text
              text={getValue(field)}
              color={Colors.black}
              size={16}
              font={'regular'}
              maxLine={1}
              align={'right'}
            />
          </View>
        </View>
        <View style={styles.separator} />
      </View>
    )
  }

  const getValue = (field) => {
    switch (field) {
      case 'Gender':
        return Sex === 0 ? "Male" : "Female"
      case 'Birth Date':
        return Birthday.split(' ')[0]
      case 'ID / FIN / Password':
        return INBC
      case 'Email / Login ID':
        return Email
      case 'Mobile Number':
        return Tel
      case 'Country':
        return getCountryName(countries, CountryBornID)
      case 'Citizenship':
        return getCountryName(nationalities, CountryID)

      default:
        return ''
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal={false}
        showsVerticalScrollIndicator={false}>
        {
          fields.map((field, i) => {
            return renderField(field, i)
          })
        }
      </ScrollView>

    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    paddingHorizontal: '10@ms',
  },
  fieldContainer: {
    width: '100%',
    paddingVertical: '16@ms',
    flexDirection: 'row',
    alignItems: 'center'
  },
  field: {
    flex: 1,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.grey3
  }
})

export default React.memo(Details)
import React, {
  useState,
  useEffect
} from 'react'
import {
  View,
  Image,
  Platform
} from 'react-native'
import { ScaledSheet, moderateScale } from 'react-native-size-matters'
import CheckBox from '@react-native-community/checkbox'

import { Colors, Styles } from '../../../res'
import { Text } from '../../../components'

interface Props {
  item: UserInfo
  onSelectUser: (value: boolean, item: UserInfo, typeOfMember: 'Students' | 'Staffs') => void
  typeOfMember: 'Students' | 'Staffs'
  isSelected: boolean
}

const Member: React.FC<Props> = ({
  item,
  onSelectUser,
  typeOfMember,
  isSelected
}) => {

  const [selected, setSelected] = useState(isSelected)

  useEffect(() => {
    setSelected(isSelected)
  }, [isSelected])

  return (
    <>
      <View style={styles.container}>
        {
          item.HeadSculpture ?
            (
              <Image source={{ uri: item.HeadSculpture }} style={styles.avatar} />
            )
            :
            (
              <Image source={require('../../../../assets/images/placeHolder.png')}
                style={styles.avatar} />
            )
        }
        <Text
          text={item.FirstName + ' ' + item.LastName}
          size={18}
          color={Colors.black}
          font={'medium'}
          contentContainer={{
            marginStart: moderateScale(10),
            width: Styles.WIDTH - moderateScale(20 + 10 + 36 + 24),
          }}
        />
        <CheckBox
          disabled={false}
          value={selected}
          onValueChange={(newValue) => {
            //console.debug('onValueChange')
            setSelected(newValue)
            onSelectUser(newValue, item, typeOfMember)
          }}
          tintColors={Platform.OS === 'android' ?
            { true: Colors.primary, false: Colors.primary } : undefined}
          onCheckColor={Platform.OS === 'android' ? undefined : Colors.primary}
          onFillColor={Platform.OS === 'android' ? undefined : Colors.primary}
          onTintColor={Platform.OS === 'android' ? undefined : Colors.primary}
        />
      </View>
      <View style={styles.separator} />
    </>
  )
}

const styles = ScaledSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: '12@ms'
  },
  avatar: {
    width: '36@ms',
    height: '36@ms',
    borderRadius: '18@ms',
    borderWidth: 1,
    borderColor: Colors.grey1
  },
  separator: {
    width: Styles.WIDTH - moderateScale(20),
    height: 1,
    backgroundColor: Colors.grey1,
  }
})

export default React.memo(Member)
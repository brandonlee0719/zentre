import React, {
  useState,
  useEffect
} from 'react'
import {
  View,
  Image,
  TouchableOpacity
} from 'react-native'
import { ScaledSheet, moderateScale } from 'react-native-size-matters'

import { Colors, Styles, Ic_Close, Ic_Plus } from '../../res'
import { Text } from '../../components'

interface Props {
  editMode: boolean
  item: UserInfo
  typeOfMember: 'Students' | 'Staffs'
  isSelected: boolean
  onSelected: (type: 'Students' | 'Staffs', user: UserInfo, isSelected: boolean) => void
}

const Member: React.FC<Props> = ({
  editMode,
  item,
  typeOfMember,
  isSelected,
  onSelected
}) => {

  const [selected, setSelected] = useState(isSelected)

  useEffect(() => {
    setSelected(isSelected)
  }, [isSelected])

  const onAdd = () => {
    setSelected(true)
    onSelected(typeOfMember, item, true)
  }

  const onRemove = () => {
    setSelected(false)
    onSelected(typeOfMember, item, false)
  }

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
              <Image source={require('../../../assets/images/placeHolder.png')}
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
            width: Styles.WIDTH - moderateScale(20 + 10 + 36 + 30),
          }}
        />
        {
          editMode && (
            selected ?
              (
                <TouchableOpacity
                  onPress={onRemove}
                  activeOpacity={.7}
                  style={styles.iconContainer}>
                  <Ic_Close color={Colors.grey2} />
                </TouchableOpacity>
              )
              :
              (
                <TouchableOpacity
                  onPress={onAdd}
                  activeOpacity={.7}
                  style={styles.iconContainer}>
                  <Ic_Plus color={Colors.grey2} />
                </TouchableOpacity>
              )
          )
        }
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
  },
  iconContainer: {
    width: '30@ms',
    height: '30@ms',
    borderRadius: '8@ms',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default React.memo(Member)
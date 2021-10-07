import React from 'react'
import {
  View,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import { moderateScale, ScaledSheet } from 'react-native-size-matters'

import { Styles, Colors } from '../../../res'
import { Text, SearchBar } from '../../../components'

interface Props {
  onHistory: () => void
}

const GroupList: React.FC<Props> = ({
  onHistory
}) => {

  return (
    <View style={styles.container}>
      <SearchBar
        containerStyle={{
          marginTop: moderateScale(24),
          marginBottom: moderateScale(36)
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        horizontal={false}>
        <View style={styles.groupContainer}>
          <Text
            text={'K2 2020'}
            size={16}
            color={Colors.black}
            font={'regular'}
          />
          <Text
            text={'Active'}
            size={16}
            color={Colors.primary}
            font={'regular'}
          />
        </View>
        <View style={styles.groupContainer}>
          <Text
            text={'K1 2019'}
            size={16}
            color={Colors.grey2}
            font={'regular'}
          />
          <Text
            text={'Left'}
            size={16}
            color={Colors.grey2}
            font={'regular'}
          />
        </View>
        <View style={styles.groupContainer}>
          <Text
            text={'Nur 2018'}
            size={16}
            color={Colors.grey2}
            font={'regular'}
          />
          <Text
            text={'Left'}
            size={16}
            color={Colors.grey2}
            font={'regular'}
          />
        </View>

        <TouchableOpacity
          onPress={onHistory}
          activeOpacity={.7}>
          <Text
            text={'See Groups History'}
            size={18}
            color={Colors.primary}
            font={'medium'}
            contentContainer={{
              marginTop: moderateScale(72),
              marginStart: moderateScale(10)
            }}
          />
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    width: Styles.WIDTH,
  },
  groupContainer: {
    width: Styles.WIDTH - moderateScale(20),
    marginStart: '10@ms',
    height: '56@ms',
    borderWidth: 1,
    borderRadius: '4@ms',
    borderColor: Colors.grey1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '10@ms',
    marginTop: '12@ms'
  }
})

export default React.memo(GroupList)
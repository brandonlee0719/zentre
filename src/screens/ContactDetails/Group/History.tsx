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

}

const History: React.FC<Props> = ({

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

        <View style={styles.historyContainer}>
          <Text
            text={'K1 2019'}
            size={16}
            color={Colors.black}
            font={'regular'}
          />
          <Text
            text={'Left 31 Dec 2019'}
            size={16}
            color={Colors.grey2}
            font={'regular'}
          />
        </View>

        <View style={styles.separator} />

        <View style={styles.historyContainer}>
          <Text
            text={'K2 2020'}
            size={16}
            color={Colors.black}
            font={'regular'}
          />
          <Text
            text={'Joined 31 Dec 2019'}
            size={16}
            color={Colors.grey2}
            font={'regular'}
          />
        </View>

        <View style={styles.separator} />

        <View style={styles.historyContainer}>
          <Text
            text={'Withdrawn'}
            size={16}
            color={Colors.black}
            font={'regular'}
          />
          <Text
            text={'Left 31 Dec 2019'}
            size={16}
            color={Colors.grey2}
            font={'regular'}
          />
        </View>

        <View style={styles.separator} />

        <View style={styles.historyContainer}>
          <Text
            text={'Nur 18'}
            size={16}
            color={Colors.black}
            font={'regular'}
          />
          <Text
            text={'Joined 31 Dec 2019'}
            size={16}
            color={Colors.grey2}
            font={'regular'}
          />
        </View>

      </ScrollView>
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    width: Styles.WIDTH,
  },
  historyContainer: {
    paddingHorizontal: '10@ms',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  separator: {
    width: Styles.WIDTH - moderateScale(20),
    marginStart: '10@ms',
    height: 1,
    backgroundColor: Colors.grey1,
    marginVertical: '16@ms'
  }
})

export default React.memo(History)
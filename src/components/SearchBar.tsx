import React from 'react'
import { Platform } from 'react-native'
import {
  View,
  TextInput,
  ViewStyle
} from 'react-native'
import { moderateScale, ScaledSheet } from 'react-native-size-matters'

import { Colors, Ic_Search, Styles } from '../res'
import { t } from '../utils'

interface Props {
  onSearch?: (text: string) => void
  containerStyle?: ViewStyle,
  large?: boolean
}
//44 = icon, 12 = paddingEnd, 32 = paddingHorizontal
const searchBarWidth = Styles.WIDTH - moderateScale(44) - moderateScale(12) - moderateScale(32)

function SearchBar({
  onSearch,
  containerStyle,
}: Props) {

  return (
    <View style={[styles.container, { ...containerStyle }]}>
      {
        <View style={styles.searchBarContainer}>
          <View style={styles.iconContainer}>
            <Ic_Search color={Colors.grey2} />
          </View>
          <TextInput
            onChangeText={(text) => { onSearch && onSearch(text) }}
            style={styles.input}
            placeholderTextColor={Colors.grey2}
            placeholder={t('search')}
          />
        </View>
      }
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    width: Styles.WIDTH,
    paddingHorizontal: '10@ms',
  },
  searchBarContainer: {
    height: '40@ms',
    width: '100%',
    paddingEnd: '12@ms',
    borderRadius: Styles.radius.m,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.grey1,
  },
  input: {
    fontFamily: Platform.OS === 'android' ? 'RobotoRegular' : 'Roboto-Regular',
    fontSize: '14@ms',
    width: searchBarWidth
  },
  iconContainer: {
    width: '44@ms',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default React.memo(SearchBar)
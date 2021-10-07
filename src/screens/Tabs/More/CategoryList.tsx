import React from 'react'
import {
  View,
  TouchableWithoutFeedback,
  FlatList,
  TouchableOpacity
} from 'react-native'
import { ScaledSheet, moderateScale } from 'react-native-size-matters'
import { } from 'react-native-svg'

import { Colors, Styles, Ic_Dot3_Vertical } from '../../../res'
import { t } from '../../../utils'
import { Text } from '../../../components'

interface Props {
  categoryList: any
  onClickCategory: (item) => void
  onClickOption: (item, pagePosition) => void
}

function CategoryList({
  onClickCategory,
  onClickOption,
  categoryList
}: Props) {

  const _renderGroup = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity activeOpacity={.7} onPress={() => {
          onClickCategory && onClickCategory(item)
        }}>
          <View style={styles.groupContainer}>
            <View style={styles.nameContainer}>
              <Text
                text={item?.Title}
                font={'regular'}
                size={16}
                color={Colors.primary}
              />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableWithoutFeedback onPress={({ nativeEvent }) => {
          onClickOption && onClickOption(item, {
            x: nativeEvent.pageX,
            y: nativeEvent.pageY
          })
        }}>
          <View style={styles.dot3Container}>
            <Ic_Dot3_Vertical color={Colors.primary} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  //console.debug(groups)
  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{
          paddingBottom: Styles.spacing.xl
        }}
        horizontal={false}
        showsVerticalScrollIndicator={false}
        data={categoryList}
        renderItem={_renderGroup}
        keyExtractor={(_, index) => 'key|' + index}
      />
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '10@ms',
  },
  itemContainer: {
    width: '100%',
    height: '56@ms',
    borderWidth: 1,
    borderColor: Colors.grey2,
    borderRadius: '4@ms',
    paddingHorizontal: '10@ms',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '12@ms'
  },
  groupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameContainer: {
    marginHorizontal: '12@ms',
    width: Styles.WIDTH - moderateScale(20 + 50 + 24 + 24),
  },
  iconContainer: {
    width: '50@ms',
    height: '50@ms',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.grey1,
    borderRadius: '25@ms'
  },
  dot3Container: {
    height: '50@ms',
    width: '24@ms',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12@ms'
  },
})

export default React.memo(CategoryList)
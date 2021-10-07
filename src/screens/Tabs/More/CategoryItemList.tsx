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
  category: any
  categoryItemList: any
  onClickCategory: (item) => void
  onClickOption: (item, pagePosition) => void
}

function CategoryItemList({
  onClickCategory,
  onClickOption,
  categoryItemList,
  category
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
                text={item?.Goods_Titile}
                font={'regular'}
                size={16}
                color={Colors.black}
              />
              <Text
                text={item?.Goods_Description}
                font={'regular'}
                size={12}
                color={Colors.grey2}
              />
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.rightContainer}>
          <View style={styles.priceContainer}>
            <Text
              text={"$" + parseFloat(item?.UnitPrice).toFixed(2)}
              font={'regular'}
              size={13}
              color={Colors.primary}
            />
          </View>
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
        data={categoryItemList}
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
    height: '65@ms',
    borderWidth: 1,
    borderColor: Colors.grey1,
    borderRadius: '4@ms',
    paddingHorizontal: '10@ms',
    alignItems: 'center',
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '12@ms',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  priceContainer: {
    marginLeft: -5,
    marginRight: 5
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
    height: '35@ms',
    width: '24@ms',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12@ms',
  },
})

export default React.memo(CategoryItemList)
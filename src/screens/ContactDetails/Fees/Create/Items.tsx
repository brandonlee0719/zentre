import React from 'react'
import {
  View,
  ScrollView
} from 'react-native'
import { moderateScale, ScaledSheet } from 'react-native-size-matters'

import { Styles } from '../../../../res'

interface Props {
  onDiscountItem: (item) => void,
  feeItems: any,
  setFeeItems?: (item, deleteItem) => void,
}

const items = [
  '1',
  '2',
  '3'
]

import Entry from './Entry'

const Items: React.FC<Props> = ({
  onDiscountItem,
  feeItems,
  setFeeItems
}) => {
  console.warn('feeItems', feeItems);

  const renderItem = (item, i) => {
    return (
      <View
        key={'item-' + i}
        style={{ marginTop: i === 0 ? 0 : 6 }}>
        <Entry
          localItems={true}
          item={item}
          setFeeItems={setFeeItems}
          onDiscount={onDiscountItem}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        horizontal={false}>
        {
          feeItems && feeItems?.map((item, i) => {
            return renderItem(item, i)
          })
        }
      </ScrollView>
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    width: Styles.WIDTH,
    paddingTop: '36@ms'
  },
})

export default React.memo(Items)
import React, { useEffect, useState } from 'react'
import {
  View,
  ScrollView
} from 'react-native'
import { moderateScale, ScaledSheet } from 'react-native-size-matters'

import { Styles, Colors } from '../../../../res'
import { SearchBar, Text } from '../../../../components'

interface Props {
  allItems: any,
  setFeeItems?: (item, deleteItem) => void,

}


// const allItems = [
//   '1a',
//   '2a',
//   '3a'
// ]

import Entry from './Entry'

const AddItem: React.FC<Props> = ({
  allItems,
  setFeeItems
}) => {

  const [recentItems, setrecentItems] = useState([])

  useEffect(() => {
    const recentItemsList: any = []
    if (allItems?.lenght > 0) {
      for (let i = 0; i < 2; i++) {
        const element = allItems[i];
        if (element) {
          recentItemsList.push(element)
        }
      }
      setrecentItems(recentItemsList)
    }

  }, [allItems])


  const renderItem = (item, i) => {
    return (
      <View
        key={'item-' + i}
        style={{ marginTop: i === 0 ? 0 : 6 }}>
        <Entry
          setFeeItems={setFeeItems}
          item={item}
        />
      </View>
    )
  }


  return (
    <View style={styles.container}>
      <SearchBar
        containerStyle={{ marginTop: moderateScale(24) }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        horizontal={false}>
        {
          allItems?.length === 0 ?
            <Text
              text={'There are no Items yet.'}
              size={18}
              color={Colors.black}
              font={'medium'}
              contentContainer={{
                marginTop: moderateScale(40),
                marginBottom: moderateScale(20),
                marginStart: moderateScale(10)
              }}
            />
            :
            <>
              <Text
                text={'Recent Items'}
                size={18}
                color={Colors.black}
                font={'medium'}
                contentContainer={{
                  marginTop: moderateScale(40),
                  marginBottom: moderateScale(20),
                  marginStart: moderateScale(10)
                }}
              />

              {
                recentItems.map((item, i) => {
                  return renderItem(item, i)
                })
              }

              <Text
                text={'All Items'}
                size={18}
                color={Colors.black}
                font={'medium'}
                contentContainer={{
                  marginTop: moderateScale(40),
                  marginBottom: moderateScale(20),
                  marginStart: moderateScale(10)
                }}
              />

              {
                allItems?.map((item, i) => {
                  return renderItem(item, i)
                })
              }
            </>
        }
      </ScrollView>
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    width: Styles.WIDTH,
  }
})

export default React.memo(AddItem)
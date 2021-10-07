import React, {
  useState,
} from 'react'
import {
  View,
  ViewStyle
} from 'react-native'
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { ScaledSheet, moderateScale } from 'react-native-size-matters'
import Animated from "react-native-reanimated"
const {
  interpolateNode,
} = Animated

import { useTransition, mix } from './helper'
import { Colors, Ic_Arrow_Down, Ic_Delete, Styles } from '../../res'
import { Text } from '../../components'
import Contacts from 'src/res/icons/Contacts'

import CheckBox from '@react-native-community/checkbox'

interface Props {
  year: string,
  capacity: any,
  isRequired?: boolean,
  items: { name: string, id: string }[],
  contacts: Contact[],
  containerStyle?: ViewStyle
  onSelected?: (item: any) => void,
  clearFeedMonth?: (item: any) => void,
  multi: Boolean | false,

  value?: { name: string, id: string } | null
}
const LIST_ITEM_HEIGHT = 54

function StorageList({
  year,
  capacity,
  items,
  containerStyle,
  clearFeedMonth,
  onSelected,
  value
}: Props) {
  if (items.length === 0)
    return null

  const [open, setOpen] = useState(false)
  const transition = useTransition(open)
  const height = mix(transition, 0, LIST_ITEM_HEIGHT * items.length)
  const bottomRadius = interpolateNode(transition, {
    inputRange: [0, 16 / 400],
    outputRange: [4, 0],
  })

  const borderBottomWidth = interpolateNode(transition, {
    inputRange: [0, 1],
    outputRange: [1, 0],
  })

  return (
    <View style={[styles.container, { ...containerStyle }]}>
      <TouchableWithoutFeedback onPress={() => setOpen((prev) => !prev)}>
        <View>
          <Animated.View
            style={[styles.AnimatedContainer, {
              borderBottomWidth: borderBottomWidth,
              borderBottomLeftRadius: bottomRadius,
              borderBottomRightRadius: bottomRadius,
            }]}>
            <Text
              text={year}
              size={14}
              font={'regular'}
              color={Colors.primary}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                text={capacity}
                size={14}
                font={'regular'}
                color={Colors.grey2}
              />
              {
                open ?
                  <View style={{ marginLeft: 10, transform: [{ rotate: '180deg' }] }}>
                    <Ic_Arrow_Down color={Colors.primary} />
                  </View>
                  :
                  <View style={{ marginLeft: 10 }}>
                    <Ic_Arrow_Down color={Colors.primary} />
                  </View>
              }
            </View>
          </Animated.View>
          <View style={{
            width: Styles.WIDTH - moderateScale(40),
            height: 1,
            backgroundColor: Colors.grey1,
            alignSelf: 'center',
            marginTop: -1,
          }} />
        </View>
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.items, {
        height,
        borderColor: Colors.grey2
      }]}>

        {items.map((item, key) => (
          <TouchableWithoutFeedback
            key={key}
            onPress={() => {
              onSelected && onSelected(item)
            }}>
            <Item
              clearFeedMonth={clearFeedMonth}
              isLast={key === items.length - 1}
              item={item}
            />
          </TouchableWithoutFeedback>
        ))
        }
      </Animated.View>
    </View>
  )
}

function Item({ isLast, item, clearFeedMonth }) {
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  const bottomRadius = isLast ? 4 : 0
  if (item.MonthName !== " ") {
    return (
      <View style={[styles.itemContainer, {
        borderBottomLeftRadius: bottomRadius,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: isLast ? 1 : 0,
        borderColor: Colors.grey1,
        borderBottomRightRadius: bottomRadius,
        justifyContent: 'space-between'

      }]}>

        <Text
          text={item.MonthName ? item.MonthName : "none"}
          size={14}
          font={'regular'}
          color={Colors.black}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            text={formatBytes(item.FeedTotalUsedSpace)}
            size={14}
            font={'regular'}
            color={Colors.grey2}
          />
          <TouchableOpacity onPress={() => clearFeedMonth(item.YearMonth)} style={{ marginLeft: 10 }}>
            <Ic_Delete />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  else return null
}

const styles = ScaledSheet.create({
  container: {
    width: Styles.WIDTH,
    paddingHorizontal: '10@ms'
  },
  AnimatedContainer: {
    height: '56@ms',
    backgroundColor: "white",
    paddingHorizontal: '10@ms',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.grey1,
  },
  items: {
    overflow: "hidden",
  },
  itemContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: '10@ms',
    borderBottomWidth: 1,
    borderColor: Colors.grey1,
    height: LIST_ITEM_HEIGHT,
  },
  titleContainer: {
    position: 'absolute',
    left: '20@ms',
    top: -8,
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: '6@ms'
  },
})

export default StorageList
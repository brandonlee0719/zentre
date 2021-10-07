import React, {
  useState,
} from 'react'
import {
  View,
  ViewStyle
} from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { ScaledSheet, moderateScale } from 'react-native-size-matters'
import Animated from "react-native-reanimated"
const {
  interpolateNode,
} = Animated

import { useTransition, mix } from './helper'
import { Colors, Ic_Arrow_Down, Styles, Ic_Tick } from '../../res'
import { Text } from '../../components'
import Contacts from 'src/res/icons/Contacts'

import CheckBox from '@react-native-community/checkbox'

interface Props {
  title: string,
  isRequired?: boolean,
  items: { name: string, id: string }[],
  contacts: Contact[],
  containerStyle?: ViewStyle
  onSelected?: (item) => void,
  multi: Boolean | false,
  justifyContent?: any,

  value?: { name: string, id: string } | null
}
const LIST_ITEM_HEIGHT = 54

function DropDownList({
  title,
  isRequired,
  items,
  containerStyle,
  contacts,
  justifyContent,
  multi,

  onSelected,
  value
}: Props) {
  if (items.length === 0)
    return null

  const [selectedText, setSelectedText] = useState(value ? value : items[0])

  const [checkedlist, setchecked] = useState<[number]>([])

  const [data, Setdata] = useState<[number]>([])
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
              // borderBottomWidth:  1,
              borderWidth: 1,
              borderColor: !open ? Colors.grey1 : Colors.primary,
              borderBottomColor: open ? 'transparent' : !open ? Colors.grey1 : Colors.primary,
              borderBottomLeftRadius: bottomRadius,
              borderBottomRightRadius: bottomRadius,
            }]}>
            <Text
              text={selectedText.name}
              size={14}
              font={'regular'}
              color={Colors.black}
            />
            <Ic_Arrow_Down color={Colors.grey2} />
          </Animated.View>

        </View>
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.items, {
        height,
        borderColor: Colors.grey1
      }]}>
        {(contacts) ?

          contacts.map((item, key) => {
            return (

              <TouchableWithoutFeedback

                key={key}

                onPress={() => {

                  if (multi) {

                    let arr: [number] = []

                    if (checkedlist.indexOf(key) < 0) {

                      arr = [key]

                      arr = arr.concat(checkedlist)



                      setchecked(arr)

                    } else if (checkedlist.indexOf(key) > -1) {

                      checkedlist.splice(checkedlist.indexOf(key), 1)

                      arr = checkedlist

                      setchecked(checkedlist)

                    }

                    let name = '';

                    let data = []

                    arr.map((d) => {

                      name = contacts[d].FirstName + " " + contacts[d].LastName + ", " + name;

                      data.push({ UserID: contacts[d].UserID, RoleBindingID: contacts[d].RoleBindingID, SchoolID: contacts[d].SchoolID })

                    })

                    onSelected && onSelected(data)

                    setSelectedText({ name: name, id: item.UserID, UserID: item.UserID, RoleBindingID: item.RoleBindingID, SchoolID: item.SchoolID })

                  } else {

                    setSelectedText({ name: item.FirstName + " " + item.LastName, id: item.UserID })

                    setOpen((prev) => !prev)

                  }

                }}>

                <Item

                  isLast={key === contacts.length - 1}
                  justifyContent={justifyContent}
                  multi={multi}

                  item={{ name: item.FirstName + " " + item.LastName }}

                  checked={(checkedlist.indexOf(key) < 0) ? false : true}

                />

              </TouchableWithoutFeedback>

            )
          }) :
          items.map((item: { name: string, id: string }, key) => {
            if (item.name === "Select") return null
            else {
              return (
                <TouchableWithoutFeedback
                  key={key}
                  onPress={() => {
                    onSelected && onSelected(item)
                    if (multi) {

                      let arr: [number] = []

                      if (checkedlist.indexOf(key) < 0) {

                        arr = [key]

                        arr = arr.concat(checkedlist)

                        setchecked(arr)

                      } else if (checkedlist.indexOf(key) > -1) {

                        checkedlist.splice(checkedlist.indexOf(key), 1)

                        arr = checkedlist

                        setchecked(checkedlist)

                      }

                      let name = ''

                      let data = []

                      arr.map((d) => {

                        name = items[d].name + ", " + name;

                        data.push(items[d].name)

                      })

                      setSelectedText({ name: name })

                      onSelected && onSelected(data)

                    } else {

                      setSelectedText(item)
                      onSelected && onSelected(item.name)
                      setOpen((prev) => !prev)
                    }
                  }}>
                  <Item
                    isLast={key === items.length - 1}
                    item={item}
                    justifyContent={justifyContent}
                    checked={(checkedlist.indexOf(key) < 0) ? false : true}
                    selectedText={value}
                    multi={multi}

                  />
                </TouchableWithoutFeedback>
              )
            }
          })
        }
      </Animated.View>

      <View style={styles.titleContainer}>
        <Text
          text={title}
          color={Colors.grey2}
          size={12}
          font={'regular'}
        />
        {
          isRequired && (
            <Text
              text={" *"}
              color={Colors.grey2}
              size={12}
              font={'regular'}
            />
          )
        }
      </View>
    </View>
  )
}

function Item({ isLast, item, selectedText, justifyContent, checked = false, multi = false }) {
  const bottomRadius = isLast ? 4 : 0
  if (item.name !== " ") {
    return (
      <View style={[styles.itemContainer, {
        borderBottomLeftRadius: bottomRadius,
        borderBottomWidth: isLast ? 1 : 0,
        borderBottomColor: Colors.primary,
        borderBottomRightRadius: bottomRadius,
        // justifyContent: 'flex-start'

      }]}>
        <View style={{
          width: Styles.WIDTH - moderateScale(40),
          height: 1,
          backgroundColor: Colors.grey3,
          alignSelf: 'center',
          // marginTop: -1,
          marginBottom: 15
        }} />
        <View style={{
          flexDirection: "row",
          justifyContent: justifyContent ? justifyContent : "space-between",
          alignItems: "center",
        }}>
          {
            (multi) ?
              <CheckBox
                style={{
                  marginRight: 10,
                  transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
                }}
                tintColor="#818181"
                tintColors={{ true: '#599F41', false: '#818181' }}
                onTintColor="#599F41"
                onFillColor="#599F41"
                onCheckColor={'#599F41'}
                value={checked ? true : false}
                boxType="square"
                onCheckColor="white"

              /> : null

          }
          <Text
            text={item.name ? item.name : "none"}
            size={14}
            font={'regular'}
            color={selectedText === item.name ? Colors.primary : Colors.black}
          />
          {
            selectedText === item.name &&
            <Ic_Tick color={Colors.primary} />
          }
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

    // borderRightWidth: 1,
    // borderWidth: 1,
    // borderLeftColor: Colors.primary,
    // borderRightColor: Colors.primary,
    // borderBottomColor: Colors.primary,
  },
  items: {
    overflow: "hidden",
  },
  itemContainer: {
    backgroundColor: "white",
    // flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: "center",
    // paddingVertical: 8,
    paddingHorizontal: '10@ms',
    borderLeftWidth: 1,
    borderLeftColor: Colors.primary,
    borderRightWidth: 1,
    borderRightColor: Colors.primary,
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

export default DropDownList
import React, {
  useState
} from 'react'
import {
  View,
  TouchableOpacity
} from 'react-native'
import { ScaledSheet, moderateScale } from 'react-native-size-matters'

import { Styles, Colors, Ic_Arrow_Right, Ic_Close } from '../../../../res'
import { Text } from '../../../../components'
import { useEffect } from 'react'

interface Props {
  onDiscount?: (item) => void,
  setFeeItems?: any,
  localItems?: any,
  item: any,
}

const Entry: React.FC<Props> = ({
  onDiscount,
  item,
  setFeeItems,
  localItems
}) => {

  const [quantity, setQuantity] = useState(0)
  const _setFeeItems = (item, quantity, deleteItem) => {
    setQuantity(quantity)
    const data = {
      ...item, quantity: quantity
    }
    setFeeItems(data, deleteItem)
  }

  useEffect(() => {
    if (item?.quantity) {
      setQuantity(item?.quantity)
    }
    if (item) {
    }
  }, [item])



  return (
    <View style={styles.baseContainer}>
      <View style={styles.container}>
        <View style={styles.layer}>
          <View style={styles.textContainer}>
            <Text
              text={item?.Goods_Titile?.slice(0, 15) + (item?.Goods_Titile?.length > 15 ? ' ....' : "")}
              size={16}
              font='medium'
              color={Colors.black}
            />
            <Text
              text={' ($' + item?.UnitPrice + ")"}
              size={16}
              font='regular'
              color={Colors.grey2}
            />
          </View>
          <View style={styles.textContainer}>
            <Text
              text={'Total'}
              size={16}
              font='regular'
              color={Colors.grey2}
            />
            <Text
              text={" $" + ((item?.UnitPrice * (item.quantity ? item.quantity : quantity)) - (item.TotalDiscount ? (item.TotalDiscount * (item.quantity ? item.quantity : quantity)) : 0)).toFixed(2)}
              size={16}
              font='medium'
              color={Colors.primary}
            />
          </View>
        </View>

        <View style={[styles.layer, {
          marginVertical: 20
        }]}>
          <View style={styles.quantityContainer}>
            <Text
              text={'Quantity'}
              size={12}
              font='regular'
              color={Colors.grey2}

            />
            <TouchableOpacity
              onPress={() => {
                if (quantity === 0) {
                  console.log('')
                } else {
                  _setFeeItems(item, quantity - 1, false)
                }
              }}
              activeOpacity={.7}>
              <Text
                text={'-'}
                size={20}
                font='bold'
                color={Colors.grey2}
                align={'center'}
                contentContainer={{
                  width: 20,
                  borderRadius: 6
                }}
              />
            </TouchableOpacity>
            <Text
              text={item.quantity ? item.quantity : quantity}
              size={16}
              font='medium'
              color={Colors.black}
              contentContainer={{
                marginHorizontal: moderateScale(10)
              }}
            />
            <TouchableOpacity
              onPress={() => {
                _setFeeItems(item, quantity + 1, false)
              }}
              activeOpacity={.7}>
              <Text
                text={'+'}
                size={20}
                font='bold'
                align={'center'}
                color={Colors.grey2}
                contentContainer={{
                  width: 20,
                  borderRadius: 6
                }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.textContainer}>
            <Text
              text={'Tax'}
              size={16}
              font='regular'
              color={Colors.grey2}
            />
            <Text
              text={" $" + item?.Tate}
              size={16}
              font='medium'
              color={Colors.black}
            />
          </View>
        </View>


        <TouchableOpacity
          onPress={() => {
            onDiscount && onDiscount(item)
          }}
          activeOpacity={.7}
          style={styles.discountContainer}>
          <Text
            text={'Discount (' + (item.TotalDiscount ? (item.TotalDiscount * (item.quantity ? item.quantity : quantity)).toFixed(2) : "0") + ")"}
            size={16}
            font='regular'
            color={Colors.primary}
          />
          <Ic_Arrow_Right color={Colors.primary} />
        </TouchableOpacity>

        {
          localItems &&
          <TouchableOpacity onPress={() => {
            _setFeeItems(item, 0, true)
          }} style={styles.closeContainer}>
            <Ic_Close color={Colors.grey2} />
          </TouchableOpacity>
        }
      </View>
    </View>
  )
}

const styles = ScaledSheet.create({
  baseContainer: {
    paddingVertical: '8@ms',
    paddingHorizontal: '10@ms',
    //backgroundColor: 'red'
  },
  container: {
    width: '100%',
    paddingHorizontal: '10@ms',
    paddingVertical: '16@ms',
    borderColor: Colors.grey1,
    borderWidth: 1,
    borderRadius: '4@ms',
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  layer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  discountContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.grey1,
    borderRadius: '4@ms',
    height: '40@ms',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '10@ms'
  },
  closeContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    right: -8,
    top: -8,
    width: '24@ms',
    height: '24@ms',
    borderRadius: '12@ms',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.grey1
  }
})

export default React.memo(Entry)
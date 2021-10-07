import React, {
  useState,
  useEffect
} from 'react'
import {
  View,
  ScrollView,
  Platform
} from 'react-native'
import { moderateScale, ScaledSheet } from 'react-native-size-matters'
import CheckBox from '@react-native-community/checkbox'

import { Styles, Colors } from '../../../../res'
import { SearchBar, Text } from '../../../../components'

interface Props {
  subsidiesItems: any,
  setSubsidiesItems?: any,
}

const list = [
  {
    name: 'FD WM',
    prize: '$300.00',
    selected: false
  },
  {
    name: 'Half Day - WM',
    prize: '$150.00',
    selected: true
  },
  {
    name: 'Baby Bonus',
    prize: '$600.00',
    selected: true
  },
  {
    name: 'Subsidy',
    prize: '$440.00',
    selected: false
  },
  {
    name: 'Financial Assistance',
    prize: '$546.00',
    selected: false
  },
  {
    name: 'Additional Subsidy',
    prize: '$320.00',
    selected: false
  },
]

const Subsides: React.FC<Props> = ({
  subsidiesItems,
  setSubsidiesItems,
}) => {
  const [state, setstate]: any = useState({
    subsidiesItem: [],
    totalAmount: 0
  })

  useEffect(() => {
    if (subsidiesItems) {

      const selectedsubsidiesItems = selectedSubsidies(subsidiesItems)
      // setsubsidiesItem(subsidiesItems)
      let allSubsidies: Array<any> = []
      for (let i = 0; i < subsidiesItems.length; i++) {
        const element = subsidiesItems[i];
        const body = {
          selected: false
        }
        const a = { ...element, ...body }
        allSubsidies.push(a)
      }
      console.warn('allSubsidies', allSubsidies);
      setstate(pre => ({ ...pre, subsidiesItem: allSubsidies }))
      var totalAmount = 0
      selectedsubsidiesItems?.forEach(element => {
        totalAmount += element.UnitPrice
      });
      // settotalAmount(totalAmount)
      setstate(pre => ({ ...pre, totalAmount: totalAmount }))
    }
  }, [])

  // const [totalAmounts, settotalAmount]: any = useState(0)

  const _setSubsidiesItems = (index, newValue) => {
    if (newValue) {
      state.subsidiesItem[index]['selected'] = true
      state.totalAmount += state.subsidiesItem[index].UnitPrice
    } else {
      state.subsidiesItem[index]['selected'] = false
      state.totalAmount -= state.subsidiesItem[index].UnitPrice
    }

    setstate((pre: any) => ({ ...pre }))
    setSubsidiesItems(state.subsidiesItem)
  }


  const selectedSubsidies = (data: any) => {
    return data?.filter(e => e.selected)
  }



  const renderItem = (item: any, i: any) => {
    return (
      <View
        key={'item- ' + i}
        style={[styles.itemContainer, {
          marginTop: i === 0 ? 0 : moderateScale(12)
        }]}>
        <View style={styles.checkContainer}>
          {
            Platform.OS === 'android' ?
              (
                <CheckBox
                  // disabled={false}
                  value={item.selected}
                  onValueChange={(newValue) => _setSubsidiesItems(i, newValue)}
                  tintColors={{ true: Colors.primary, false: Colors.primary }}
                />
              )
              :
              (
                <CheckBox
                  disabled={false}
                  // value={item.selected}
                  onValueChange={(newValue) => {
                    _setSubsidiesItems(item, newValue)
                  }}
                  onCheckColor={Colors.primary}
                  onFillColor={Colors.primary}
                  onTintColor={Colors.primary}
                />
              )
          }
        </View>
        <View style={styles.infoContainer}>
          <Text
            text={item?.Goods_Titile?.slice(0, 15) + (item?.Goods_Titile?.length > 15 ? ' ....' : "")}
            size={16}
            font={'regular'}
            color={Colors.primary}
          />
          <Text
            text={" $" + item?.UnitPrice}
            size={16}
            font={'regular'}
            color={Colors.grey2}
          />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        horizontal={false}>
        <View style={styles.totalContainer}>
          <Text
            text={"Total Subsides"}
            size={16}
            font={'regular'}
            color={Colors.grey2}
          />
          <Text
            text={"$" + state.totalAmount}
            size={18}
            font={'medium'}
            color={Colors.primary}
          />
        </View>
        {
          state.subsidiesItem?.map((item: any, i) => {
            return renderItem(item, i)
          }
          )}
      </ScrollView>
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    width: Styles.WIDTH,
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '10@ms',
    marginTop: '40@ms',
    marginBottom: '20@ms'
  },
  itemContainer: {
    width: '100%',
    paddingHorizontal: '10@ms',
    flexDirection: 'row',
    alignItems: 'center'
  },
  infoContainer: {
    width: Styles.WIDTH - moderateScale(20 + 34),
    height: '56@ms',
    borderRadius: '4@ms',
    borderWidth: 1,
    borderColor: Colors.grey1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '10@ms'
  },
  checkContainer: {
    width: '34@ms',
    height: '56@ms',
    justifyContent: 'center'
  }
})

export default React.memo(Subsides)
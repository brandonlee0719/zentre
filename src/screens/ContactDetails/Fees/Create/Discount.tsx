import React, { useEffect, useState } from 'react'
import {
  View,
  ScrollView,
  Platform
} from 'react-native'
import { moderateScale, ScaledSheet } from 'react-native-size-matters'
import CheckBox from '@react-native-community/checkbox'

import { Styles, Colors, Ic_Arrow_Down } from '../../../../res'
import { Text } from '../../../../components'

interface Props {
  discountItems: any
  selectDiscount: any
  getTotalAmount: any
}

const Discount: React.FC<Props> = ({
  discountItems,
  selectDiscount,
  getTotalAmount
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        horizontal={false}>
        {
          discountItems?.map((discount: any, index: any) => {
            return (
              <React.Fragment key={index}>
                <View style={styles.titleContainer}>
                  <View style={styles.nameContainer}>
                    {
                      Platform.OS === 'android' ?
                        (
                          <CheckBox
                            disabled={false}
                            value={discount.selected}
                            onValueChange={(newValue) => {
                              selectDiscount(newValue, discount)
                            }}
                            tintColors={{ true: Colors.primary, false: Colors.primary }}
                          />
                        )
                        :
                        (
                          <CheckBox
                            disabled={false}
                            //value={item.selected}
                            onValueChange={(newValue) => {
                              //setChecked(newValue)
                              selectDiscount(newValue, discount)
                            }}
                            onCheckColor={Colors.primary}
                            onFillColor={Colors.primary}
                            onTintColor={Colors.primary}
                          />
                        )
                    }
                    <Text
                      text={discount?.Goods_Titile}
                      font={'regular'}
                      size={16}
                      color={Colors.black}
                    />
                  </View>
                  <Text
                    text={discount?.UnitPrice + (discount?.Tate_Type === "1" ? "$" : "%")}
                    font={'regular'}
                    size={16}
                    color={Colors.black}
                  />
                </View>

                <View style={styles.content}>
                  <Text
                    text={discount?.Goods_Description}
                    font={'regular'}
                    size={16}
                    color={Colors.grey2}
                  />
                  <Ic_Arrow_Down color={Colors.grey2} />
                </View>

                <View style={styles.separator} />
              </React.Fragment>
            )
          })
        }
        <View style={styles.totalContainer}>
          <Text
            text={'Total Discount'}
            font={'medium'}
            size={16}
            color={Colors.black}

          />
          <Text
            text={"$" + getTotalAmount()}
            font={'medium'}
            size={16}
            color={Colors.primary}
            contentContainer={{
              marginStart: 24
            }}
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
    paddingTop: '36@ms'
  },
  titleContainer: {
    width: '100%',
    paddingHorizontal: '10@ms',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    width: Styles.WIDTH - moderateScale(20),
    marginStart: '10@ms',
    height: 1,
    backgroundColor: Colors.black,
    marginTop: '30@ms',
    marginBottom: '12@ms'
  },
  content: {
    width: Styles.WIDTH - moderateScale(20),
    height: '56@ms',
    borderWidth: 1,
    borderRadius: '4@ms',
    borderColor: Colors.grey1,
    marginStart: '10@ms',
    marginTop: '10@ms',
    flexDirection: 'row',
    paddingHorizontal: '10@ms',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  totalContainer: {
    flexDirection: 'row',
    paddingHorizontal: '10@ms',
    marginTop: '36@ms'
  }
})

export default React.memo(Discount)
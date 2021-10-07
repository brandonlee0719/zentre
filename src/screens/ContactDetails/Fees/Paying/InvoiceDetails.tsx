import React from 'react'
import {
  View,
  ScrollView
} from 'react-native'
import { moderateScale, ScaledSheet } from 'react-native-size-matters'

import { Styles, Colors, Ic_Arrow_Right } from '../../../../res'
import { Text, LineInfo } from '../../../../components'
import moment from 'moment'

interface Props {
  singleInvoice: any
}

const InvoiceDetails: React.FC<Props> = ({
  singleInvoice,
}) => {

  console.warn('singleInvoice',singleInvoice);
  
  const payable: any = (Number(singleInvoice?.Invoice?.SubTotal) + Number(singleInvoice?.Invoice?.TotalTax) + Number(singleInvoice?.Invoice?.TotalDiscount))

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal={false}
        contentContainerStyle={{
          paddingBottom: 30
        }}
        showsVerticalScrollIndicator={false}>
        <LineInfo
          containerStyle={{ marginVertical: 16 }}
          prefixText={singleInvoice?.Invoice?.InvoiceName}
          prefixTextStyles={{ size: 22, color: Colors.black, font: 'medium' }}
          postfixText={'$' + payable?.toFixed(2)}
          postfixTextStyles={{ size: 22, color: Colors.primary, font: 'medium' }}
        />

        <LineInfo
          hasUnderLine
          prefixText={'Invoice Number'}
          prefixTextStyles={{ size: 16, color: Colors.grey2, font: 'regular' }}
          postfixText={singleInvoice?.Invoice?.InvoiceNumber}
          postfixTextStyles={{ size: 16, color: Colors.black, font: 'regular' }}
        />

        <LineInfo
          hasUnderLine
          prefixText={'Invoice Date'}
          prefixTextStyles={{ size: 16, color: Colors.grey2, font: 'regular' }}
          postfixText={moment(singleInvoice?.Invoice?.Date).format("LL")}
          postfixTextStyles={{ size: 16, color: Colors.black, font: 'regular' }}
        />

        <LineInfo
          prefixText={'Due Date'}
          prefixTextStyles={{ size: 16, color: Colors.grey2, font: 'regular' }}
          postfixText={moment(singleInvoice?.Invoice?.DueDate).format("LL")}
          postfixTextStyles={{ size: 16, color: Colors.black, font: 'regular' }}
        />
        <View style={styles.separator} />

        {
          singleInvoice?.FeeItems?.map((feeitem, index) => (
            <View key={index} style={styles.infoContainer}>
              <View style={{}}>
                <Text
                  text={feeitem?.Item__Titile + "(x" + (feeitem?.Item_Quantity ? feeitem?.Item_Quantity : 1) + ")"}
                  size={16}
                  font={'regular'}
                  color={Colors.black}
                />

                <View style={styles.discContainer}>
                  <Text
                    text={'Disc: $' + Number(feeitem?.Item_TotalDiscount).toFixed(2)}
                    size={12}
                    font={'regular'}
                    color={Colors.grey2}
                  />
                  <Text
                    text={'Tax: $' + Number(feeitem?.Item_TotalTax).toFixed(2)}
                    size={12}
                    font={'regular'}
                    color={Colors.grey2}
                    contentContainer={{
                      marginStart: 12,
                      marginTop: 6
                    }}
                  />
                </View>
              </View>

              <Text
                text={'$' + Number(feeitem?.Item_Total).toFixed(2)}
                size={16}
                font={'medium'}
                color={Colors.primary}
              />
            </View>
          ))
        }



        {/* <View style={[styles.infoContainer, {
          marginTop: 12,
          marginBottom: 36
        }]}>
          <View style={{}}>
            <Text
              text={'Materials (x1)'}
              size={16}
              font={'regular'}
              color={Colors.black}
            />

            <View style={styles.discContainer}>
              <Text
                text={'Disc: $2.00'}
                size={12}
                font={'regular'}
                color={Colors.grey2}
              />
              <Text
                text={'Tax: $1.00'}
                size={12}
                font={'regular'}
                color={Colors.grey2}
                contentContainer={{
                  marginStart: 12,
                  marginTop: 6
                }}
              />
            </View>
          </View>

          <Text
            text={'$20.00'}
            size={16}
            font={'medium'}
            color={Colors.primary}
          />
        </View> */}

        <LineInfo
          hasUnderLine
          prefixText={'Total'}
          prefixTextStyles={{ size: 16, color: Colors.grey2, font: 'regular' }}
          postfixText={'$' + Number(singleInvoice?.Invoice?.SubTotal).toFixed(2)}
          postfixTextStyles={{ size: 16, color: Colors.black, font: 'regular' }}
        />
        <LineInfo
          hasUnderLine
          prefixText={'Tax'}
          prefixTextStyles={{ size: 16, color: Colors.grey2, font: 'regular' }}
          postfixText={'$' + Number(singleInvoice?.Invoice?.TotalTax).toFixed(2)}
          postfixTextStyles={{ size: 16, color: Colors.black, font: 'regular' }}
        />
        <LineInfo
          hasUnderLine
          prefixText={'Discount'}
          prefixTextStyles={{ size: 16, color: Colors.grey2, font: 'regular' }}
          postfixText={'$' + Number(singleInvoice?.Invoice?.TotalDiscount).toFixed(2)}
          postfixTextStyles={{ size: 16, color: Colors.black, font: 'regular' }}
        />
        <LineInfo
          hasUnderLine
          prefixText={'Subsidy/Grants'}
          prefixTextStyles={{ size: 16, color: Colors.grey2, font: 'regular' }}
          postfixText={'$' + Number(singleInvoice?.Invoice?.TotalSubsidy).toFixed(2)}
          postfixTextStyles={{ size: 16, color: Colors.black, font: 'regular' }}
        />
        <LineInfo
          prefixText={'Net payable'}
          prefixTextStyles={{ size: 16, color: Colors.black, font: 'regular' }}
          postfixText={'$' + payable?.toFixed(2)}
          postfixTextStyles={{ size: 16, color: Colors.primary, font: 'medium' }}
        />
      </ScrollView>
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    width: Styles.WIDTH,
  },
  separator: {
    width: Styles.WIDTH - moderateScale(20),
    height: 1,
    backgroundColor: Colors.black,
    marginVertical: '40@ms',
    marginStart: '10@ms'
  },
  infoContainer: {
    width: Styles.WIDTH - moderateScale(20),
    padding: '10@ms',
    borderWidth: 1,
    borderColor: Colors.grey1,
    borderRadius: '4@ms',
    marginStart: '10@ms',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  discContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})

export default React.memo(InvoiceDetails)

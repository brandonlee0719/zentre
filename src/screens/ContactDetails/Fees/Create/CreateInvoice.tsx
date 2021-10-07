import React from 'react'
import {
  View,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import { moderateScale, ScaledSheet } from 'react-native-size-matters'

import { Styles, Colors, Ic_Arrow_Right } from '../../../../res'
import { Input, DatePicker, Text } from '../../../../components'

interface Props {
  onItems: () => void
  feeItems?: any
  subsidiesItems?: any
  invoiceTitle?: any
  invoiceDate?: any
  invoiceDueDate?: any
  onSubsides: () => void
  handleChange?: any
}

const CreateInvoice: React.FC<Props> = ({
  onItems,
  onSubsides,
  feeItems,
  subsidiesItems,
  handleChange,
  invoiceTitle,
  invoiceDate,
  invoiceDueDate
}) => {

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        horizontal={false}>
        <Text
          text={'Invoice Details'}
          color={Colors.black}
          font={'medium'}
          size={18}
          contentContainer={{
            marginVertical: moderateScale(36),
            marginStart: moderateScale(10)
          }}
        />
        <Input
          title={'Invoice Title'}
          defaultValue={invoiceTitle}
          onTextChanged={(text) => handleChange('invoiceTitle', text)}

        />
        <DatePicker
          title={'Invoice Date'}
          valueDate={invoiceDate}
          onDateSelected={(text) => handleChange('invoiceDate', text)}
          containerStyle={{ marginTop: moderateScale(24) }}
        />
        <DatePicker
          title={'Due Date'}
          valueDate={invoiceDueDate}
          onDateSelected={(text) => handleChange('invoiceDueDate', text)}
          containerStyle={{ marginTop: moderateScale(24) }}
        />

        <View style={styles.separator} />

        <TouchableOpacity
          onPress={onItems}
          activeOpacity={.7}
          style={styles.buttonContainer}>
          <Text
            text={'Items(' + feeItems?.length + ")"}
            color={Colors.primary}
            font={'medium'}
            size={18}
          />

          <Ic_Arrow_Right color={Colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSubsides}
          activeOpacity={.7}
          style={[styles.buttonContainer, {
            marginTop: moderateScale(24)
          }]}>
          <Text
            text={'Subsides (' + subsidiesItems?.length + ")"}
            color={Colors.primary}
            font={'medium'}
            size={18}
          />

          <Ic_Arrow_Right color={Colors.primary} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    width: Styles.WIDTH
  },
  separator: {
    width: Styles.WIDTH - moderateScale(20),
    height: 1,
    marginStart: '10@ms',
    backgroundColor: Colors.black,
    marginVertical: '36@ms'
  },
  buttonContainer: {
    width: Styles.WIDTH - moderateScale(20),
    marginStart: '10@ms',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: '4@ms',
    borderWidth: 1,
    borderColor: Colors.grey1,
    height: '56@ms',
    paddingHorizontal: '10@ms',
    justifyContent: 'space-between'
  },

})

export default React.memo(CreateInvoice)
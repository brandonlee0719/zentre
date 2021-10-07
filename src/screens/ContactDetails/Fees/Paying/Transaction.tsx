import React, {
  useState
} from 'react'
import {
  View,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'

import { Styles, Colors } from '../../../../res'
import { Text } from '../../../../components'

interface Props {

}

const Transaction: React.FC<Props> = ({

}) => {

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        horizontal={false}>
        <View style={styles.moneyContainer}>
          <Text
            text={'Pay'}
            font={'regular'}
            size={16}
            color={Colors.black}
          />
          <Text
            text={'$50'}
            font={'medium'}
            size={22}
            color={Colors.primary}
          />
          <Text
            text={'Transaction Completed'}
            font={'regular'}
            size={16}
            color={Colors.black}
          />
        </View>

        <View style={styles.stepsContainer}>
          <Text
            text={'Details'}
            font={'regular'}
            size={16}
            color={Colors.grey2}
          />
          <View style={styles.line} />
          <Text
            text={'Payment'}
            font={'regular'}
            size={16}
            color={Colors.grey2}
          />
          <View style={styles.line} />
          <Text
            text={'Outcome'}
            font={'medium'}
            size={16}
            color={Colors.primary}
          />
        </View>

        <View style={[styles.infoContainer, {
          marginTop: 72
        }]}>
          <Text
            text={'Merchant'}
            font={'regular'}
            size={16}
            color={Colors.grey2}
          />
          <Text
            text={'IChild Company Pte Ltd'}
            font={'regular'}
            size={16}
            color={Colors.black}
          />
        </View>

        <View style={styles.separator} />
        <View style={styles.infoContainer}>
          <Text
            text={'Mode'}
            font={'regular'}
            size={16}
            color={Colors.grey2}
          />
          <Text
            text={'Pay Now QR'}
            font={'regular'}
            size={16}
            color={Colors.black}
          />
        </View>

        <View style={styles.separator} />
        <View style={styles.infoContainer}>
          <Text
            text={'Transaction ID'}
            font={'regular'}
            size={16}
            color={Colors.grey2}
          />
          <Text
            text={'999999898989111'}
            font={'regular'}
            size={16}
            color={Colors.black}
          />
        </View>

        <View style={styles.separator} />
        <View style={styles.infoContainer}>
          <Text
            text={'Time'}
            font={'regular'}
            size={16}
            color={Colors.grey2}
          />
          <Text
            text={'20 Dec, 2021 03:20 PM'}
            font={'regular'}
            size={16}
            color={Colors.black}
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
    paddingHorizontal: '10@ms'
  },
  moneyContainer: {
    width: '100%',
    height: '128@ms',
    borderRadius: '4@ms',
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: Colors.grey1,
    marginVertical: '36@ms',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepsContainer: {
    width: Styles.WIDTH,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  line: {
    height: 1,
    width: '30@ms',
    backgroundColor: Colors.grey2,
    marginHorizontal: '4@ms'
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.grey1,
    marginVertical: '16@ms'
  }
})

export default React.memo(Transaction)

import React from 'react'
import {
  View,
  ScrollView
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'

import { Styles, Colors, Ic_Arrow_Right } from '../../../../res'
import { Text } from '../../../../components'

interface Props {

}

const FeeDetails: React.FC<Props> = ({

}) => {
  return (
    <View style={styles.container}>
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
      </View>

      <View style={styles.shareContainer}>
        <Text
          text={'Share Invoice to Email'}
          font={'medium'}
          size={16}
          color={Colors.black}
        />
        <Ic_Arrow_Right color={Colors.primary} />
      </View>
      <View style={[styles.shareContainer, {
        marginTop: 12
      }]}>
        <Text
          text={'Share Invoice to Whatsapp'}
          font={'medium'}
          size={16}
          color={Colors.black}
        />
        <Ic_Arrow_Right color={Colors.primary} />
      </View>
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
  shareContainer: {
    width: '100%',
    height: '56@ms',
    borderRadius: '4@ms',
    borderWidth: 1,
    borderColor: Colors.grey1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '10@ms'
  }
})

export default React.memo(FeeDetails)

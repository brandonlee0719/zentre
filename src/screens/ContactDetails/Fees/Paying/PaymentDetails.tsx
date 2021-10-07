import React, {
  useState
} from 'react'
import {
  View,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'

import { Styles, Colors, Ic_Tick } from '../../../../res'
import { Text } from '../../../../components'

interface Props {

}

const PaymentDetails: React.FC<Props> = ({

}) => {
  const [selected, setSelected] = useState(1)

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
        </View>

        <View style={styles.stepsContainer}>
          <Text
            text={'Details'}
            font={'medium'}
            size={16}
            color={Colors.primary}
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
            font={'regular'}
            size={16}
            color={Colors.grey2}
          />
        </View>

        <Text
          text={'Choose method of payment'}
          font={'medium'}
          size={18}
          color={Colors.black}
          contentContainer={{
            marginVertical: 36
          }}
        />

        <TouchableOpacity
          onPress={() => setSelected(1)}
          activeOpacity={.7}
          style={styles.methodContainer}>
          <Text
            text={'Pay Now QR'}
            font={'regular'}
            size={16}
            color={selected === 1 ? Colors.primary : Colors.black}
          />
          {
            selected === 1 && (<Ic_Tick color={Colors.primary} />)
          }
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelected(2)}
          activeOpacity={.7}
          style={[styles.methodContainer, {
            marginTop: 12
          }]}>
          <Text
            text={'PayAnyOne'}
            font={'regular'}
            size={16}
            color={selected === 2 ? Colors.primary : Colors.black}
          />
          {
            selected === 2 && (<Ic_Tick color={Colors.primary} />)
          }
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelected(3)}
          activeOpacity={.7}
          style={[styles.methodContainer, {
            marginTop: 12
          }]}>
          <Text
            text={'GrapPay'}
            font={'regular'}
            size={16}
            color={selected === 3 ? Colors.primary : Colors.black}
          />
          {
            selected === 3 && (<Ic_Tick color={Colors.primary} />)
          }
        </TouchableOpacity>
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
  methodContainer: {
    width: '100%',
    height: '56@ms',
    borderWidth: 1,
    borderColor: Colors.grey1,
    borderRadius: '4@ms',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: '10@ms'
  }
})

export default React.memo(PaymentDetails)

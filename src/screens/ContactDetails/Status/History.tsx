import React, {
  useEffect
} from 'react'
import {
  View,
  Text,
  Dimensions,
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'

import { Colors } from '../../../res'
import { t } from '../../../utils'

interface HistoryProps {

}

function History({ }: HistoryProps) {

  return (
    <View style={[styles.container]}>

      <View style={styles.textContainer}>
        <Text style={styles.text}>
          {t('withdraw')}
        </Text>
        <Text style={[styles.text, { fontFamily: 'MontserratRegular' }]}>
          31 Dec 2019
        </Text>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.text}>
          {t('join')}
        </Text>
        <Text style={[styles.text, { fontFamily: 'MontserratRegular' }]}>
          31 Dec 2019
        </Text>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.text}>
          {t('withdraw')}
        </Text>
        <Text style={[styles.text, { fontFamily: 'MontserratRegular' }]}>
          31 Dec 2019
        </Text>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.text}>
          {t('join')}
        </Text>
        <Text style={[styles.text, { fontFamily: 'MontserratRegular' }]}>
          31 Dec 2019
        </Text>
      </View>

    </View>
  )

}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '16@ms',
    paddingTop: "15@ms"
  },
  textContainer: {
    width: '100%',
    paddingHorizontal: '20@ms',
    paddingVertical: '16@ms',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.grey2,
    borderRadius: 10,
    marginTop: '5@ms'
  },
  text: {
    fontSize: '18@ms',
    lineHeight: '22@ms',
    color: Colors.black,
    fontFamily: 'MontserratSemiBold'
  }
})

export default React.memo(History)
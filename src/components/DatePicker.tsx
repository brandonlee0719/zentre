import React, {
  useState
} from 'react'
import {
  View,
  ViewStyle,
  TouchableWithoutFeedback,
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'

import { t } from '../utils'
import { Colors, Styles, Ic_Arrow_Down } from '../res'
import Text from './Text'

interface Props {
  onDateSelected?: (date: string) => void
  containerStyle?: ViewStyle,
  title?: string,
  valueDate?: string,
  isRequired?: boolean
  futureDateDisalbed?: boolean
}

function DatePicker({
  containerStyle,
  title,
  onDateSelected,
  valueDate,
  isRequired = false,
  futureDateDisalbed = false
}: Props) {
  const [date, setDate] = useState(valueDate ? new Date(valueDate) : new Date())
  const [show, setShow] = useState(false)

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate
    setShow(false)

    if (selectedDate) {
      setDate(currentDate)
      onDateSelected && onDateSelected(moment(currentDate).format('YYYY-MM-DD'))
    }
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setShow(true)
      }}>
      <View style={[styles.container, { ...containerStyle }]}>
        <View style={styles.birthDateContainer}>
          <Text
            text={moment(date).format('YYYY-MM-DD')}
            size={14}
            color={'black'}
            font={'regular'}
          />
          <Ic_Arrow_Down color={Colors.grey2} />
        </View>
        {
          show && (
            <DateTimePicker
              value={date}
              mode={'date'}
              maximumDate={futureDateDisalbed ? new Date() : new Date('2050-01-01')}
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )
        }

        <View style={styles.titleContainer}>
          <Text
            text={title || t('birthDate')}
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
    </TouchableWithoutFeedback>
  )
}

const styles = ScaledSheet.create({
  container: {
    width: Styles.WIDTH,
    paddingHorizontal: '10@ms'
  },
  birthDateContainer: {
    width: '100%',
    height: '56@ms',
    borderWidth: 1,
    borderColor: Colors.grey1,
    borderRadius: '4@ms',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '10@ms',
    alignItems: 'center'
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

export default React.memo(DatePicker)
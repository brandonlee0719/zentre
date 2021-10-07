import React from 'react'
import {
  View,
  FlatList,
  TouchableOpacity
} from 'react-native'
import { moderateScale, ScaledSheet } from 'react-native-size-matters'

import { Styles, Colors, Ic_Dot3_Vertical } from '../../../../res'
import { SearchBar, Text } from '../../../../components'
import { showPopup } from '../../../../utils/store/controllers/popup'
import { useAppDispatch } from '../../../../utils'
import moment from 'moment'

interface Props {
  onPay: () => void
  onVoid: (item) => void
  onDetails: (item) => void
  invoices: any
}

const feesArr = [
  '1',
  '2',
  '3',
  '4'
]

const Fees: React.FC<Props> = ({
  onPay,
  onVoid,
  onDetails,
  invoices
}) => {

  const dispatch = useAppDispatch()

  const _renderItem = ({ item, index }) => {
    return (
      <View style={[styles.itemContainer, {
        marginTop: index === 0 ? 0 : moderateScale(36)
      }]}>
        <Fee item={item} onDetails={onDetails} onOption={item?.InvoiceState === -1 ? _onVoidOptions : _onOptions} />
      </View>
    )
  }

  const _onOptions = (params, item) => {
    dispatch(
      showPopup(
        {
          show: true,
          position: { x: params.x, y: params.y },
          options: [
            {
              text: 'Pay',
              onClick: () => { onPay && onPay() }
            },
            {
              text: 'View',
              onClick: () => {
                onDetails && onDetails(item)
              }
            },
            {
              text: 'Share',
              onClick: () => { }
            },
            {
              text: 'History',
              onClick: () => { }
            },
            {
              text: 'Void',
              onClick: () => { onVoid && onVoid(item) }
            },
            {
              text: 'Copy',
              onClick: () => { }
            },
          ]
        }
      )
    )
  }
  const _onVoidOptions = (params, item) => {
    dispatch(
      showPopup(
        {
          show: true,
          position: { x: params.x, y: params.y },
          options: [
            {
              text: 'View',
              onClick: () => {
                onDetails && onDetails(item)
              }
            },
            {
              text: 'Share',
              onClick: () => { }
            },
          ]
        }
      )
    )
  }

  return (
    <View style={styles.container}>
      <SearchBar
        containerStyle={{ marginVertical: moderateScale(36) }}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        horizontal={false}
        data={invoices}
        renderItem={_renderItem}
        keyExtractor={(_, i) => 'fee-' + i}
        contentContainerStyle={{
          paddingVertical: 10
        }}
      />
    </View>
  )

}

interface FeeProps {
  onOption: (params: { x: number, y: number }, item) => void
  onDetails: (item) => void
  item: any
}

const Fee: React.FC<FeeProps> = ({
  onOption,
  onDetails,
  item
}) => {

  return (
    <View style={styles.feeContainer}>
      <View style={styles.contentContainer}>
        <TouchableOpacity
          onPress={() => { onDetails && onDetails(item) }}
          activeOpacity={.7}
          style={styles.infoContainer}>
          <View style={styles.titleContainer}>
            <Text
              text={item?.InvoiceName}
              font={'regular'}
              size={16}
              color={Colors.black}
            />
            <Text
              text={"$" + item?.Total}
              font={'medium'}
              size={16}
              color={Colors.red}
            />
          </View>
          <View style={[styles.titleContainer, { marginTop: 5 }]}>
            <Text
              text={moment(item?.Date).format('LL')}
              font={'regular'}
              size={12}
              color={Colors.grey2}
            />
            <Text
              text={'Due: ' + moment(item?.DueDate).format('LL')}
              font={'regular'}
              size={12}
              color={Colors.grey2}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={.7}
          onPress={({ nativeEvent }) => {
            onOption && onOption({ x: nativeEvent.pageX, y: nativeEvent.pageY }, item)
          }}
          style={styles.iconContainer}>
          <Ic_Dot3_Vertical color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.headerContainer}>
        <Text
          text={item?.InvoiceNumber}
          font={'regular'}
          size={12}
          color={Colors.grey2}
        />
      </View>
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    width: Styles.WIDTH
  },
  itemContainer: {
    width: '100%',
    paddingHorizontal: '10@ms'
  },
  feeContainer: {
    width: '100%',
    paddingHorizontal: '10@ms',
    paddingVertical: '12@ms',
    borderRadius: '4@ms',
    borderColor: Colors.grey1,
    borderWidth: 1,
  },
  headerContainer: {
    position: 'absolute',
    left: 8,
    top: -10,
    backgroundColor: 'white'
  },
  iconContainer: {
    width: '24@ms',
    height: '30@ms',
    borderRadius: '8@ms',
    alignItems: 'flex-end',
    justifyContent: 'center',
    //backgroundColor: 'blue',
    paddingEnd: '4@ms'
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContainer: {
    width: Styles.WIDTH - moderateScale(40 + 24),
    //backgroundColor: 'green',
    height: '100%'
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})

export default React.memo(Fees)


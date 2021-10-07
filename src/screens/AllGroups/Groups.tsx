import React from 'react'
import {
  View,
  TouchableWithoutFeedback,
  FlatList
} from 'react-native'
import { ScaledSheet, moderateScale } from 'react-native-size-matters'
import { } from 'react-native-svg'

import { Colors, Styles, Ic_Dot3_Vertical } from '../../res'
import { t } from '../../utils'
import { Text, SearchBar } from '../../components'

interface Props {
  groups: Group[]
  onClickGroup: (group: Group) => void
  onClickOption: (group: Group, pagePosition) => void
  _onSearch: any
}

function Groups({
  onClickGroup,
  onClickOption,
  groups,
  _onSearch
}: Props) {

  const _renderGroup = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <TouchableWithoutFeedback onPress={() => {
          onClickGroup && onClickGroup(item)
        }}>
          <View style={styles.groupContainer}>
            <View style={styles.iconContainer}>
              <Text
                text={item.ClassName.charAt(0)}
                font={'medium'}
                size={32}
                color={Colors.white}
              />
            </View>
            <View style={styles.nameContainer}>
              <Text
                text={item.ClassName}
                font={'medium'}
                size={16}
                color={Colors.black}
              />
              <Text
                text={item.V3MemberNum + item.V3TeacherNum + ' ' + t('members')}
                font={'regular'}
                size={12}
                color={Colors.grey2}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={({ nativeEvent }) => {
          onClickOption && onClickOption(item, {
            x: nativeEvent.pageX,
            y: nativeEvent.pageY
          })
        }}>
          <View style={styles.dot3Container}>
            <Ic_Dot3_Vertical color={Colors.primary} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }


  const getHeader = () => {
    return (
      <SearchBar
        containerStyle={{ width: '100%', marginTop: moderateScale(18) }}
        onSearch={_onSearch} />
    )
  }

  //console.debug(groups)
  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{
          paddingBottom: Styles.spacing.xl
        }}
        horizontal={false}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={getHeader}
        data={groups}
        renderItem={_renderGroup}
        keyExtractor={(_, index) => 'key|' + index}
      />
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '10@ms',
  },
  itemContainer: {
    width: '100%',
    marginVertical: '10@ms',
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameContainer: {
    marginHorizontal: '12@ms',
    width: Styles.WIDTH - moderateScale(20 + 50 + 24 + 24),
  },
  iconContainer: {
    width: '50@ms',
    height: '50@ms',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.grey1,
    borderRadius: '25@ms'
  },
  dot3Container: {
    height: '50@ms',
    width: '24@ms',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12@ms'
  },
})

export default React.memo(Groups)
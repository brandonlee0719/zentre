import React, {
  useEffect
} from 'react'
import {
  View,
  FlatList,
  Image,
  TouchableOpacity
} from 'react-native'
import { moderateScale, ScaledSheet } from 'react-native-size-matters'

import { Colors, Styles } from '../../../res'
import { t, useAppDispatch, useAppSelector } from '../../../utils'
import { getSchoolClassList } from '../../../utils/store/controllers/group'
import { Text } from '../../../components'

interface Props {
  onClickGroup: (group: Group) => void
  viewAllGroup: (groups: Group[] | null) => void
}

function Groups({
  onClickGroup,
  viewAllGroup
}: Props) {

  const dispatch = useAppDispatch()
  const groups = useAppSelector(state => state.groupController.groups)

  useEffect(() => {
    if (!groups)
      fetchGroups()
  }, [])

  const fetchGroups = async () => {
    await dispatch(
      getSchoolClassList()
    )
  }

  const _renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={.7}
        onPress={() => { onClickGroup(item) }}>
        <View style={{
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <View style={styles.groupContainer}>
            <Text
              text={item.ClassName.charAt(0).toUpperCase()}
              size={32}
              color={Colors.white}
              font={'bold'}
            />
          </View>
          <Text
            text={item.ClassName}
            maxLine={1}
            size={16}
            color={Colors.black}
            font={'medium'}
            contentContainer={{
              marginTop: 8,
              maxWidth: moderateScale(84)
            }}
          />
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.textsContainer}>
        <View style={{
          flexDirection: 'row'
        }}>
          <Text
            text={t('groups')+" "}
            color={Colors.black}
            font={'medium'}
            size={18}
          />
          {
            groups && groups.length > 0 && (
              <Text
                text={' (' + groups.length + ')'}
                color={Colors.grey2}
                font={'medium'}
                size={18}
              />
            )
          }
        </View>

        <TouchableOpacity
          activeOpacity={.7}
          onPress={() => {
            viewAllGroup && viewAllGroup(groups)
          }}>
          <Text
            text={t('viewAllGroups')}
            color={Colors.primary}
            font={'medium'}
            size={18}
          />
        </TouchableOpacity>
      </View>

      {
        groups && groups.length > 0 && (
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            data={groups.slice(0, 10)}
            renderItem={_renderItem}
            keyExtractor={(_, index) => "key|" + index}
            contentContainerStyle={{ marginTop: moderateScale(20),paddingLeft: moderateScale(10) }}
          />
        )
      }
    </View>
  )
}

const styles = ScaledSheet.create({
  container: {
    width: Styles.WIDTH,
    marginTop: '20@ms'
  },
  textsContainer: {
    paddingHorizontal: '10@ms',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  groupContainer: {
    width: '50@ms',
    height: '50@ms',
    backgroundColor: Colors.grey1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '25@ms',
    marginHorizontal: '12@ms'
  },
})

export default React.memo(Groups)
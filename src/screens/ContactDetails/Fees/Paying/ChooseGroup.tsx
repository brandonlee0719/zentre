import React, { useState } from 'react'
import {
  View,
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native'
import { moderateScale, ScaledSheet } from 'react-native-size-matters'

import { Styles, Colors, Ic_Back, Ic_Tick } from '../../../../res'
import { SearchBar, Text, Header } from '../../../../components'
import { showPopup } from '../../../../utils/store/controllers/popup'
import { useAppDispatch } from '../../../../utils'
import moment from 'moment'

interface Props {
  route: any
  navigation: any
}

const ChooseGroup: React.FC<Props> = ({
  route,
  navigation
}) => {
  const [state, setState] = useState({
    classID: ''
  })

  const onClick = (id) => {
    setState(pre => ({ ...pre, classID: id }))
  }
  const _renderItem = ({ item, index, }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          onClick(item.ClassID)
        }}
        activeOpacity={.7}
        key={'key - ' + index}
        style={styles.optionContainer}>
        <Text
          text={item?.ClassName}
          font={'regular'}
          size={16}
          color={Colors.primary}
        />
        {
          state.classID === item.ClassID &&
          <View style={styles.endContainer}>
            <Ic_Tick color={Colors.primary} />
          </View>
        }
      </TouchableOpacity>
    )
  }

  const _onPostfix = () => {
    if (state.classID === '') {
      Alert.alert("Alert", "Please Choose Group")
    } else if (state.classID != '') {
      const userInfo = route.params?.userInfo
      const roleName = route.params?.roleName
      navigation.navigate('CreateInvoice', { userInfo: userInfo, roleName: roleName, ClassID: state.classID })
    }
  }

  const data = route.params?.userClasses
  return (
    <View style={styles.container}>
      <Header
        text={'Choose Group'}
        prefix={<Ic_Back color={Colors.primary} />}
        onPrefix={() => navigation.goBack()}
        postfix={<Text
          text={'Next'}
          font={'medium'}
          size={20}
          color={Colors.primary}
        />}
        onPostfix={_onPostfix}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        horizontal={false}
        data={data}
        renderItem={_renderItem}
        keyExtractor={(_, i) => 'fee-' + i}
        contentContainerStyle={{
          padding: 10
        }}
      />
    </View>
  )

}



const styles = ScaledSheet.create({
  container: {
    flex: 1,
    width: Styles.WIDTH,
    backgroundColor: Colors.white,

  },
  optionContainer: {
    width: '100%',
    height: '56@ms',
    borderWidth: 1,
    borderColor: Colors.grey3,
    borderRadius: '4@ms',
    paddingHorizontal: '10@ms',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '12@ms'
  },
  endContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})

export default React.memo(ChooseGroup)


import React from 'react'
import {
  View,
  FlatList,
  Image,
  TouchableOpacity
} from 'react-native'
import { moderateScale, ScaledSheet } from 'react-native-size-matters'

import { Text, Header, SearchBar } from '../../components'
import { t } from '../../utils'
import { Colors, Ic_Back, Styles } from '../../res'

//import CheckBoxes from './CheckBoxes'

interface State {
  members: UserInfo[]
}

class AllGroupMembers extends React.Component<any, State> {

  members: UserInfo[]
  type: 'students' | 'staffs'

  isSearching: boolean
  constructor(props) {
    super(props)

    this.members = this.props.route.params.members
    this.type = this.props.route.params.type

    this.isSearching = false

    this.state = {
      members: this.members
    }
  }


  renderItem = ({ item, index }) => {
    return (
      <>
        <TouchableOpacity
          onPress={() => { this.onUser(item) }}
          activeOpacity={.7}
          style={styles.itemContainer}>
          <View style={styles.contactContainer}>
            {
              item.HeadSculpture ?
                (
                  <Image source={{ uri: 'https://contacts.ichild.com.sg' + item.HeadSculpture }} style={styles.avatar} />
                )
                :
                (
                  <Image source={require('../../../assets/images/placeHolder.png')}
                    style={styles.avatar} />
                )
            }
            <Text
              text={item.FirstName + ' ' + item.LastName}
              color={Colors.black}
              size={16}
              font={'regular'}
              contentContainer={{
                marginStart: moderateScale(10)
              }}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
      </>
    )
  }

  onUser = (user: UserInfo) => {
    this.props.navigation.navigate('ContactDetailsNav', {
      contact: user,
      roleName: this.type === 'staffs' ? 'Staff' : 'Member',
      navigatedFrom: 'Group'
    })
  }

  _onSearch = (text) => {
    if (this.isSearching)
      return

    if (text.length === 0) {
      this.setState({ members: this.members })
      this.isSearching = false
      return
    }

    this.isSearching = true

    let filteredMembers = this.members.filter(
      member => (member.FirstName.includes(text) || member.LastName.includes(text))
    )

    this.setState({ members: filteredMembers })

    this.isSearching = false
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          text={t('members')}
          prefix={<Ic_Back color={Colors.primary} />}
          onPrefix={() => this.props.navigation.goBack()}
        />

        <SearchBar
          containerStyle={{
            marginTop: moderateScale(36)
          }}
          onSearch={this._onSearch}
        />
        <Text
          text={this.type === 'students' ? t('students') : t('staffs')}
          color={Colors.black}
          size={18}
          font={'medium'}
          contentContainer={{
            marginTop: 30,
            marginStart: 10
          }}
        />

        <FlatList
          data={this.state.members}
          renderItem={this.renderItem}
          showsVerticalScrollIndicator={false}
          horizontal={false}
          keyExtractor={(_, i) => 'item-' + i}
        />
      </View>
    )
  }
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  itemContainer: {
    width: Styles.WIDTH,
    paddingHorizontal: '10@ms'
  },
  contactContainer: {
    width: '100%',
    //backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: '12@ms'
  },
  avatar: {
    width: '32@ms',
    height: '32@ms',
    borderRadius: '16@ms',
    //borderWidth: 1,
    //borderColor: Colors.gr,
  },
  separator: {
    width: Styles.WIDTH - moderateScale(20),
    marginStart: '10@ms',
    height: 1,
    backgroundColor: Colors.grey1,
  }
})

export default AllGroupMembers
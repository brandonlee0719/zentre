import React from 'react'
import {
  View,
  ScrollView,
  Animated,
  BackHandler
} from 'react-native'
import { moderateScale, ScaledSheet } from 'react-native-size-matters'
import { connect } from 'react-redux';

import { t } from '../../../utils'
import { Header, Text, SearchBar, Alert } from '../../../components'
import {
  Ic_Plus,
  Colors,
  Styles
} from '../../../res'
import { logout } from '../../../utils/store/controllers/auth'
import { showPopup } from '../../../utils/store/controllers/popup'

import { createSupply, createCategory } from '../../../utils/store/controllers/fees'


import Groups from './Groups'
import ContactsList from './Contacts'
interface State {

}

class Contacts extends React.Component<any, State> {

  offset = new Animated.Value(0);
  offset1 = 0
  constructor(props) {
    super(props)

    this.state = {
      showSearch: true
    }
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }



  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    this.props.navigation.addListener('blur', () => {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    });
    this.props.navigation.addListener('focus', () => {
      console.warn('s');

      BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    });
    //console.debug('Create-Category')
    //console.debug('Contact-Component-Did-Mount')
    //this.props.createCategory()
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    BackHandler.exitApp()
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    return true;
  }

  _onPostfix = (x, y) => {
    this.props.showPopup({
      show: true,
      position: { x: Styles.WIDTH - 20, y: 36 },
      options: [
        {
          text: t('createStudent'),
          onClick: () => {
            this.props.navigation.navigate('CreateNewContact', {
              type: 'student'
            })
          }
        },
        {
          text: t('createStaff'),
          onClick: () => {
            this.props.navigation.navigate('CreateNewContact', {
              type: 'staff'
            })
          }
        },
        {
          text: t('createGroup'),
          onClick: () => {
            this.props.navigation.navigate('CreateGroup')
          }
        },
        {
          text: t('logout'),
          onClick: () => {
            this.props.logout()
          }
        }
      ]
    })
  }

  _onSearch = (text) => {

  }

  _onClickGroup = (group) => {
    this.props.navigation.navigate('GroupProfile', {
      group: group
    })

    //this.props.navigation.navigate('AddMembers')
  }

  _onClickContact = (contact: Contact) => {
    this.props.navigation.navigate('ContactDetailsNav', {
      contact: contact
    })
  }

  _viewAll = (contacts: Contact[]) => {
    this.props.navigation.navigate('AllContact', {
      contacts: contacts
    })
  }

  _viewAllGroup = (groups: Group[] | null) => {
    this.props.navigation.navigate('AllGroups')
  }

  onScroll = event => {
    // const currentOffset = event.nativeEvent.contentOffset.y;
    // const dif = currentOffset - (this.offset1 || 0);

    // if (Math.abs(dif) < 3) {
    //   console.log('unclear');
    // } else if (dif < 0) {
    //   console.log('up');
    //   this.setState({ showSearch: true })
    // } else {
    //   this.setState({ showSearch: false })
    //   console.log('down');
    // }
    // // if(currentOffset )
    // if (this.offset1 <= 70) {
    //   this.offset1 = -currentOffset;
    // }
    // // Animated.event(
    // //   [{ nativeEvent: { contentOffset: { y: this.offset } } }],
    // //   { useNativeDriver: false }
    // // )
  };

  render() {

    const HEADER_HEIGHT = 70;
    const headerHeight = this.offset.interpolate({
      inputRange: [0, HEADER_HEIGHT],
      outputRange: [HEADER_HEIGHT, 60],
      extrapolate: 'clamp'
    });
    console.warn(this.offset1);

    return (
      <View style={styles.container}>
        <Header
          text={t('contacts')}
          postfix={<Ic_Plus color={Colors.primary} />}
          onPostfix={this._onPostfix}
        />
        {/* <Animated.View
          style={{
            // position: 'absolute',
            top: this.offset1,
            zIndex: 10,
            height: this.offset1,
            backgroundColor: 'blue',
          }}>


         
        </Animated.View> */}
        <ScrollView
          horizontal={false}
          onScroll={this.onScroll}
          contentContainerStyle={{
            paddingBottom: moderateScale(20)
          }}
          showsVerticalScrollIndicator={false}>
          <SearchBar
            containerStyle={{ marginTop: moderateScale(18) }}
            onSearch={this._onSearch} />
          <Groups
            viewAllGroup={this._viewAllGroup}
            onClickGroup={this._onClickGroup} />
          <ContactsList
            viewAll={this._viewAll}
            onClickContact={this._onClickContact} />
        </ScrollView>
      </View >
    )
  }
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
})

const mapStateToProps = state => {
  return {

  }
}

const mapDispatchToProps = {
  showPopup,
  logout,
  createSupply,
  createCategory
}

export default connect(mapStateToProps, mapDispatchToProps)(Contacts)
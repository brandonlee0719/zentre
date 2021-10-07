import React, { createRef } from 'react'
import {
  View,
  ScrollView,
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import { connect } from 'react-redux'

import { t, MEMBER_STATUS, STAFF_STATUS } from '../../utils'
import { Colors, Ic_Back, Styles } from '../../res'
import {
  getUserInfo,
  setUserInfo,
  setFamily,
  setAddress
} from '../../utils/store/controllers/contacts'

import { Header } from '../../components'

import ContactHeader from './ContactHeader'
import Options from './Options'

interface State {
  userStatus: string
}

class ContactsDetail extends React.Component<any, State> {

  scrollViewRef: any
  contact: Contact
  userInfo: any

  roleName: string
  navigatedFrom: string
  constructor(props) {
    super(props)

    this.scrollViewRef = createRef<ScrollView>()

    this.contact = this.props.route.params.contact
    this.navigatedFrom = this.props.route.params.navigatedFrom

    
    if (this.navigatedFrom === 'Group') {
      this.roleName = this.props.route.params.roleName
    } else {
      this.roleName = this.contact.RoleName
    }

    this.state = {
      userStatus: this._getStatus()
    }

    //console.debug(this.contact)
  }

  async componentDidMount() {
    let res = await this.props.getUserInfo(this.contact.UserID)
  }

  _getStatus = (): string => {
    if (this.roleName === "Member") {
      let status = MEMBER_STATUS
      for (let index = 0; index < status.length; index++) {
        
        if (status[index].id === this.props.route.params.contact.UserRoleBindingState) {
          return status[index].name
        }
      }
    } else if (this.roleName === "Staff") {
      let status = STAFF_STATUS
      for (let index = 0; index < status.length; index++) {
        if (status[index].id === this.props.route.params.contact.UserRoleBindingState) {
          return status[index].name
        }
      }
    }

    return ''
  }

  _onChangeStatus = (status: string) => {
    this.setState({ userStatus: status })
  }

  onBack = () => {
    this.props.navigation.goBack()
    this.props.setUserInfo(null)
    this.props.setFamily(null)
    this.props.setAddress(null)
  }

  _onClickOption = (option) => {
    if (option === t('status')) {
      this.props.navigation.navigate('Status', {
        roleName: this.roleName,
        status: this.state.userStatus,
        contact: this.contact,
        onChangeStatus: this._onChangeStatus
      })
    } else if (option === t('address')) {
      this.props.navigation.navigate('Address', {
        userId: this.contact.UserID
      })
    } else if (option === t('family')) {
      this.props.navigation.navigate('Family', {
        userId: this.contact.UserID,
        email: this.userInfo.Email,
        contactName: this.userInfo.FirstName +
          ' ' + this.userInfo.LastName + ' (' + this.roleName + ')',
        avatar: this.userInfo.HeadSculpture
      })
    } else if (option === t('profile')) {
      this.props.navigation.navigate('ProfileContact', {
        user: this.contact
      })
    } else if (option === t('fees')) {
      this.props.navigation.navigate('Fees', {
        roleName: this.roleName,
        userInfo: this.userInfo
      })
    } else if (option === t('groups')) {
      this.props.navigation.navigate('Groups')
    }
  }

  render() {
    console.warn(this.contact.UserRoleBindingState);
    console.warn(this.roleName);
    
    this.userInfo = this.props.userInfo

    return (
      <View style={styles.container}>
        <Header
          text={this.roleName === "Member" ? 'Student' : 'Staff'}
          prefix={<Ic_Back color={Colors.primary} />}
          onPrefix={this.onBack}
        />
        <ScrollView
          ref={(ref) => { this.scrollViewRef = ref }}
          horizontal
          scrollEnabled={false}
          pagingEnabled
          showsHorizontalScrollIndicator={false}>
          {
            this.userInfo && (
              <View style={{ width: Styles.WIDTH }}>
                <ContactHeader userStatus={this._getStatus} info={this.userInfo} />
                <Options
                  onClick={this._onClickOption}
                  isStaff={this.roleName === 'Staff'}
                />
              </View>
            )
          }
        </ScrollView>
      </View>
    )
  }
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  }
})

const mapStateToProps = state => {
  return {
    userInfo: state.contactsCController.userInfo,
  }
}

const mapDispatchToProps = {
  getUserInfo,
  setUserInfo,
  setFamily,
  setAddress
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactsDetail)

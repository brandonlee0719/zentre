import React from 'react'
import {
  ScrollView,
  View,
  Image,
  TouchableOpacity
} from 'react-native'
import { ScaledSheet, moderateScale } from 'react-native-size-matters'
import { connect } from 'react-redux'

import {
  Header,
  Text
} from '../../components'

import { t } from '../../utils'
import {
  Colors,
  Ic_Back,
  Styles,
  Ic_Dot3_Vertical
} from '../../res'
import {
  getClassMemberList,
  getClassStaffList,
  getClass,
  deleteGroup,
  leaveGroup
} from '../../utils/store/controllers/group'
import { showPopup } from '../../utils/store/controllers/popup'

interface State {
  staffs: UserInfo[],
  members: UserInfo[],
  group: Group
}

class GroupProfile extends React.Component<any, State> {

  staffs: UserInfo[]
  members: UserInfo[]

  isSearching: boolean

  focusListener: any
  onEditing: boolean
  constructor(props) {
    super(props)

    this.staffs = []
    this.members = []
    this.isSearching = true
    this.onEditing = false

    this.state = {
      staffs: [],
      members: [],
      group: this.props.route.params.group
    }

    this.focusListener = this.props.navigation.addListener('focus', this._onFocus)
  }

  componentDidMount() {
    this.fetchStaffList()
    this.fetchMemberList()
  }

  componentWillUnmount() {
    this.focusListener()
  }

  _onFocus = () => {
    if (this.onEditing) {
      console.debug('On focus')
      this.onEditing = false
      this.fetchStaffList()
      this.fetchMemberList()
      this.fetchClass()
    }
  }

  fetchMemberList = async () => {
    let res = await this.props.getClassMemberList(this.state.group.ClassID)

    if (res.meta.requestStatus !== 'rejected') {
      if (res.payload) {
        this.members = res.payload
        this.setState({ members: res.payload })
        return
      }
    }

    //Error
  }

  fetchStaffList = async () => {
    let res = await this.props.getClassStaffList(this.state.group.ClassID)

    if (res.meta.requestStatus !== 'rejected') {
      if (res.payload) {
        this.staffs = res.payload
        this.setState({ staffs: res.payload })
        return
      }
    }
  }

  fetchClass = async () => {
    let res = await this.props.getClass(this.state.group.ClassID)

    if (res.meta.requestStatus !== 'rejected') {
      if (res.payload) {
        this.setState({
          group: res.payload
        })
        return
      }
    }

    //Error
  }

  sortUsers = (users: UserInfo[]): UserInfo[] => {
    return users.sort((a, b) => {
      let f = a.FirstName && a.FirstName.length > 0 ? a.FirstName[0] : ""
      let s = b.FirstName && b.FirstName.length > 0 ? b.FirstName : ""

      return f.localeCompare(s)
    })
  }

  _onSearch = (text: string) => {
    if (text.length === 0) {
      this.setState({ members: this.members, staffs: this.staffs })
      return
    }

    this.isSearching = true

    let filteredMembers = this.members.filter(
      user =>
        user.FirstName.includes(text) ||
        user.LastName.includes(text)
    )

    let filteredStaffs = this.staffs.filter(
      user =>
        user.FirstName.includes(text) ||
        user.LastName.includes(text)
    )

    this.setState({ members: filteredMembers, staffs: filteredStaffs })

    this.isSearching = false
  }

  onUser = (user: UserInfo, isStaff: boolean) => {
    this.props.navigation.navigate('ContactDetailsNav', {
      contact: user,
      roleName: isStaff ? 'Staff' : 'Member',
      navigatedFrom: 'Group'
    })
  }

  renderUser = (user: UserInfo, i, isStaff: boolean) => {
    return (
      <TouchableOpacity
        onPress={() => this.onUser(user, isStaff)}
        activeOpacity={.7}
        key={'key - ' + i}
        style={styles.userContainer}>
        {
          user.HeadSculpture ?
            (
              <Image source={{ uri: user.HeadSculpture }} style={styles.avatar} />
            )
            :
            (
              <Image source={require('../../../assets/images/placeHolder.png')} style={styles.avatar} />
            )
        }
        <Text
          text={user.FirstName + ' ' + user.LastName}
          size={16}
          color={Colors.black}
          font={'regular'}
          contentContainer={{ marginHorizontal: 16 }}
          decorationLine='underline'
        />
      </TouchableOpacity>
    )
  }

  _onPrefix = () => {
    this.props.showPopup({
      show: true,
      position: { x: Styles.WIDTH - 20, y: 30 },
      options: [
        {
          text: t('editGroup'),
          onClick: () => {
            this.onEditing = true
            this.props.navigation.navigate('EditGroup', {
              group: this.state.group
            })
          }
        },
        {
          text: t('upgradeGroup'),
          onClick: () => {
          }
        },
        {
          text: t('attendanceReport'),
          onClick: () => {
          }
        },
        {
          text: t('massInvoice'),
          onClick: () => {
          }
        },
        {
          text: t('sendMessage'),
          onClick: () => {
          }
        },
        {
          text: t('deleteGroup'),
          textColor: Colors.red,
          onClick: () => {
            this._delete()
          }
        }
      ]
    })
  }

  _delete = async () => {
    let users: UserInfo[] = [...this.members, ...this.staffs]

    //console.debug(users.length)

    let deletedUsersRes: boolean = true
    if (users.length > 0) {
      let usersWillBeRemoved: { UserID: string, RoleBindingID: string }[] = []

      for (let i = 0; i < users.length; ++i) {
        usersWillBeRemoved.push({
          UserID: users[i].UserID,
          RoleBindingID: users[i].RoleBindingID
        })
      }

      //console.debug('Removing... ', usersWillBeRemoved.length)
      let res = await this.props.leaveGroup(usersWillBeRemoved)
      //console.debug('Removed: ', res.payload)

      if (res.meta.requestStatus !== 'rejected') {
        deletedUsersRes = res.payload
      } else {
        deletedUsersRes = false
      }
    }

    if (deletedUsersRes) {
      let res = await this.props.deleteGroup([{ ClassID: this.state.group.ClassID }])
      if (res.meta.requestStatus !== 'rejected') {
        if (res.payload) {
          this.props.navigation.goBack()
        } else {
          //Error
        }
      } else {
        //Error
      }
    }
  }

  _onViewAllMembers = (type: 'students' | 'staffs') => {
    this.props.navigation.navigate('AllGroupMembers', {
      type: type,
      members: type === 'students' ? this.state.members : this.state.staffs,
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          text={this.state.group.ClassName}
          prefix={<Ic_Back color={Colors.primary} />}
          onPrefix={() => this.props.navigation.goBack()}
          postfix={<Ic_Dot3_Vertical color={Colors.primary} />}
          onPostfix={this._onPrefix}
        />

        <ScrollView
          horizontal={false}
          contentContainerStyle={{ paddingBottom: moderateScale(24) }}
          showsVerticalScrollIndicator={false}>

          <Text
            text={this.state.group.ClassName}
            font={'medium'}
            color={Colors.black}
            size={24}
            contentContainer={{
              marginHorizontal: moderateScale(10),
              marginVertical: moderateScale(30)
            }}
          />

          <View style={styles.labelContainer}>
            <Text
              text={t('groupName')}
              font={'regular'}
              color={Colors.grey2}
              size={16}
              contentContainer={{

              }}
            />
            <Text
              text={this.state.group.ClassName}
              font={'regular'}
              color={Colors.black}
              size={16}
              contentContainer={{

              }}
            />
          </View>

          <View style={styles.line} />

          <View style={styles.labelContainer}>
            <Text
              text={t('groupLevel')}
              font={'regular'}
              color={Colors.grey2}
              size={16}
              contentContainer={{

              }}
            />
            <Text
              text={this.state.group.SchoolLevelName}
              font={'regular'}
              color={Colors.black}
              size={16}
              contentContainer={{

              }}
            />
          </View>

          <View style={styles.separator} />
          {
            this.state.staffs.length > 0 && (
              <Text
                text={t('staffs') + ' (' + this.state.staffs.length + ')'}
                font={'medium'}
                color={Colors.black}
                size={16}
                contentContainer={{
                  marginHorizontal: moderateScale(10),
                  marginTop: moderateScale(30)
                }}
              />
            )
          }

          {
            this.sortUsers(this.state.staffs).map((staff, i) => {
              return this.renderUser(staff, i, true)
            })
          }

          {
            this.state.staffs.length > 5 && (
              <TouchableOpacity
                activeOpacity={.7}
                onPress={() => { this._onViewAllMembers('staffs') }}>
                <Text
                  text={t('viewAll')}
                  font={'medium'}
                  color={Colors.primary}
                  size={16}
                  contentContainer={{
                    marginHorizontal: moderateScale(10),
                    marginTop: moderateScale(30)
                  }}
                />
              </TouchableOpacity>
            )
          }

          {
            this.state.members.length > 0 && (
              <Text
                text={t('students') + ' (' + this.state.members.length + ')'}
                font={'medium'}
                color={Colors.black}
                size={16}
                contentContainer={{
                  marginHorizontal: moderateScale(10),
                  marginTop: moderateScale(30)
                }}
              />
            )
          }

          {
            this.sortUsers(this.state.members).map((member, i) => {
              if (i >= 5)
                return null
              return this.renderUser(member, i, false)
            })
          }

          {
            this.state.members.length > 5 && (
              <TouchableOpacity
                activeOpacity={.7}
                onPress={() => { this._onViewAllMembers('students') }}>
                <Text
                  text={t('viewAll')}
                  font={'medium'}
                  color={Colors.primary}
                  size={16}
                  contentContainer={{
                    marginHorizontal: moderateScale(10),
                    marginTop: moderateScale(30)
                  }}
                />
              </TouchableOpacity>
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
    backgroundColor: 'white'
  },
  userContainer: {
    width: '100%',
    marginTop: '16@ms',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '16@ms',
  },
  avatar: {
    width: '24@ms',
    height: '24@ms',
    borderRadius: '12@ms',
    justifyContent: 'center',
    alignItems: 'center'
  },
  separator: {
    width: Styles.WIDTH - moderateScale(20),
    marginStart: '10@ms',
    height: 1,
    backgroundColor: Colors.black,
    marginTop: '36@ms'
  },
  labelContainer: {
    width: Styles.WIDTH - moderateScale(20),
    marginStart: '10@ms',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  line: {
    width: Styles.WIDTH - moderateScale(20),
    marginStart: '10@ms',
    height: 1,
    backgroundColor: Colors.grey2,
    marginVertical: '16@ms'
  }
})

const mapStateToProps = state => {
  return {

  }
}
const mapDispatchToProps = {
  getClassMemberList,
  getClassStaffList,
  getClass,
  showPopup,
  deleteGroup,
  leaveGroup
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupProfile)
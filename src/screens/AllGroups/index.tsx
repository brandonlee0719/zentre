import React from 'react'
import {
  View,
} from 'react-native'
import { moderateScale, ScaledSheet } from 'react-native-size-matters'
import { connect } from 'react-redux'

import { Colors, Ic_Back, Ic_Plus } from '../../res'
import { t } from '../../utils'
import { SearchBar, Header } from '../../components'
import {
  getSchoolClassList,
  getClassStaffList,
  getClassMemberList,
  deleteGroup,
  leaveGroup
} from '../../utils/store/controllers/group'
import { showPopup } from '../../utils/store/controllers/popup'

import Groups from './Groups'

interface State {
  groups: Group[]
}

class AllGroups extends React.Component<any, State>{

  groups: Group[]
  isSearching: boolean
  constructor(props) {
    super(props)

    this.isSearching = false
    this.groups = this.props.groups

    this.state = {
      groups: []
    }
  }

  componentDidMount() {
    if (!this.groups) {
      this.fetchGroups()
    } else {
      this.setState({ groups: this.groups })
    }
  }

  fetchGroups = async () => {
    await this.props.getSchoolClassList()

    setTimeout(() => {
      this.setState({ groups: this.props.groups })
    }, 150)
  }

  _onPostfix = () => {
    this.props.navigation.navigate('CreateGroup')
  }

  _onClickGroup = (group) => {
    this.props.navigation.navigate('GroupProfile', {
      group: group
    })
  }

  _onSearch = (text: string) => {
    if (text.length === 0) {
      this.setState({ groups: this.groups })
      return
    }

    this.isSearching = true

    let filteredGroups = this.groups.filter(
      group =>
        group.ClassName.includes(text)
    )

    this.setState({ groups: filteredGroups })

    this.isSearching = false
  }

  _onClickOptions = (group, pagePosition) => {
    this.props.showPopup({
      show: true,
      position: { x: pagePosition.x, y: pagePosition.y },
      options: [
        {
          text: t('editGroup'),
          onClick: () => {
            this.props.navigation.navigate('EditGroup', {
              group: group
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
            this._delete(group)
          }
        }
      ]
    })
  }

  _delete = async (group: Group) => {

    let members = await this.fetchMemberList(group.ClassID)
    if (members === undefined) {
      //Error
      return
    }

    let staffs = await this.fetchStaffList(group.ClassID)
    if (staffs === undefined) {
      //Error
      return
    }

    let users: UserInfo[] = [...members, ...staffs]

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
      let res = await this.props.deleteGroup([{ ClassID: group.ClassID }])
      if (res.meta.requestStatus !== 'rejected') {
        if (res.payload) {
          //this.props.navigation.goBack()
        } else {
          //Error
        }
      } else {
        //Error
      }
    }
  }

  fetchStaffList = async (ClassID) => {
    let res = await this.props.getClassStaffList(ClassID)

    if (res.meta.requestStatus !== 'rejected') {
      if (res.payload) {
        return res.payload
      }
    }
    //Error
    return undefined
  }

  fetchMemberList = async (ClassID) => {
    let res = await this.props.getClassMemberList(ClassID)

    if (res.meta.requestStatus !== 'rejected') {
      if (res.payload) {
        return res.payload
      }
    }

    //Error
    return undefined
  }

  render() {
    this.groups = this.props.groups

    //console.debug(this.groups)

    return (
      <View style={styles.container}>
        <Header
          text={t('groups')}
          prefix={<Ic_Back color={Colors.primary} />}
          onPrefix={() => { this.props.navigation.goBack() }}
          postfix={<Ic_Plus color={Colors.primary} />}
          onPostfix={this._onPostfix}
        />
       

        {
          this.groups && this.groups.length > 0 && (
            <Groups
              groups={this.groups}
              onClickGroup={this._onClickGroup}
              onClickOption={this._onClickOptions}
            />
          )
        }
      </View>
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
    groups: state.groupController.groups
  }
}
const mapDispatchToProps = {
  getSchoolClassList,
  showPopup,
  getClassStaffList,
  getClassMemberList,
  deleteGroup,
  leaveGroup
}

export default connect(mapStateToProps, mapDispatchToProps)(AllGroups)
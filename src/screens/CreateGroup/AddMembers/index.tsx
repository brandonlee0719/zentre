import React from 'react'
import {
  View,
  ScrollView,
  BackHandler
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import { connect } from 'react-redux'

import {
  getSchoolMemberList,
  getSchoolStaffList,
  joinGroup,
  getClass
} from '../../../utils/store/controllers/group'
import { Styles, Ic_Back, Colors } from '../../../res'
import { Header, Text } from '../../../components'
import { t } from '../../../utils'

interface State {
  staffs: UserInfo[] | null
  members: UserInfo[] | null
  group: Group | null

  selectedMembers: UserInfo[]
  selectedStaffs: UserInfo[]

  currentPage: string
  pages: string[]
}

const pages = {
  main: 'Main',
  addMembers: 'AddMembers',
}

import Members from './Members'
import Add from './Add'

class AddMembers extends React.Component<any, State> {

  scrollViewRef: any
  addRef: any

  selectedType: 'Students' | 'Staffs'
  classID: string
  constructor(props) {
    super(props)

    this.selectedType = 'Students'
    this.classID = this.props.route?.params?.classID

    this.state = {
      staffs: null,
      members: null,
      group: null,

      selectedMembers: [],
      selectedStaffs: [],

      currentPage: pages.main,
      pages: []
    }

    //console.debug(this.classID)
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onHardwareBackPress)
    this.getGroup()
    this.fetchMemberList()
    this.fetchStaffList()
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onHardwareBackPress)
  }

  onHardwareBackPress = (): any => {
    let { currentPage } = this.state

    if (currentPage === pages.addMembers) {
      this.scrollViewRef?.scrollTo({ x: 0, y: 0, animated: true })

      setTimeout(() => {
        this.setState({
          pages: [],
          currentPage: pages.main,
        })
      }, 150)

      return true
    }

    return false
  }

  onBack = () => {
    let { currentPage } = this.state

    if (currentPage === pages.addMembers) {
      this.scrollViewRef?.scrollTo({ x: 0, y: 0, animated: true })

      setTimeout(() => {
        this.setState({
          pages: [],
          currentPage: pages.main,
        })
      }, 150)
    } else {
      this.props.navigation.goBack()
    }
  }

  getGroup = async () => {
    if (!this.classID)
      return

    let res = await this.props.getClass(this.classID)

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

  fetchMemberList = async () => {
    let res = await this.props.getSchoolMemberList()

    if (res.meta.requestStatus !== 'rejected') {
      if (res.payload) {
        this.setState({
          members: res.payload
        })
        return
      }
    }

    //Error
  }

  fetchStaffList = async () => {
    let res = await this.props.getSchoolStaffList()

    if (res.meta.requestStatus !== 'rejected') {
      if (res.payload) {
        this.setState({
          staffs: res.payload
        })

        return
      }
    }

    //Error
  }

  getPage = (page: string) => {
    if (page === pages.addMembers) {
      if (!this.state.staffs || !this.state.members)
        return null

      return (
        <Add
          sStaffs={this.state.selectedStaffs}
          sStudents={this.state.selectedMembers}
          staffs={this.state.staffs}
          students={this.state.members}
          onRef={(ref) => this.addRef = ref}
          type={this.selectedType} />
      )
    }

    return null
  }

  getHeaderText = () => {
    let { currentPage } = this.state
    if (currentPage === pages.addMembers) {
      return t('addMember')
    }

    return t('members')
  }

  _onPostfix = () => {
    let { currentPage } = this.state
    if (currentPage === pages.addMembers) {
      this.onAddMembers(this.addRef.onAdd())
    } else if (currentPage === pages.main) {
      this.onSave()
    }
  }

  onAddMembers = (members: { students: UserInfo[], staffs: UserInfo[] }) => {

    //console.debug('onAddMembers: ', members.students.length)
    this.scrollViewRef?.scrollTo({ x: 0, y: 0, animated: true })

    setTimeout(() => {
      this.setState({
        currentPage: pages.main,
        pages: [],
        selectedMembers: members.students,
        selectedStaffs: members.staffs
      })
    }, 150)
  }

  getPostfix = () => {
    let { currentPage } = this.state
    if (currentPage === pages.addMembers) {
      return (
        <Text
          text={t('add')}
          size={18}
          font={'medium'}
          color={Colors.primary}
        />
      )
    } else if (currentPage === pages.main) {
      return (
        <Text
          text={t('save')}
          size={18}
          font={'medium'}
          color={Colors.primary}
        />
      )
    }

    return null
  }

  _onAddMember = (type: 'Students' | 'Staffs') => {
    this.selectedType = type
    this.setState({
      pages: [pages.addMembers],
      currentPage: pages.addMembers
    }, () => {
      this.scrollViewRef?.scrollTo({ x: Styles.WIDTH, y: 0, animated: true })
    })
  }

  onSave = async () => {
    let { selectedMembers, selectedStaffs } = this.state

    if (selectedMembers.length === 0 && selectedStaffs.length === 0) {
      //Noting added
      return
    }

    let staffsWillBeAdded = this._getUsersWillBeAdded(
      selectedStaffs,
      true
    )

    let membersWillBeAdded = this._getUsersWillBeAdded(
      selectedMembers,
      false
    )

    if (!staffsWillBeAdded || !membersWillBeAdded) {
      return
    }

    let added = true
    let res = await this.props.joinGroup(staffsWillBeAdded.concat(membersWillBeAdded))
    //console.debug('Adding...')
    if (res.meta.requestStatus !== 'rejected') {
      added = res.payload
    } else {
      added = false
    }

    if (added) {
      this.props.navigation.goBack()
    } else {
      //Handle Error
    }

  }

  _getUsersWillBeAdded = (selected: UserInfo[], isStaff: boolean) => {
    //console.debug(selected)
    if (!this.state.group)
      return undefined

    let users: { UserID: string, RoleBindingID: string }[] = []

    for (let i = 0; i < selected.length; ++i) {
      users.push({
        UserID: selected[i].UserID,
        RoleBindingID: isStaff ?
          this.state.group.ClassTeacherRoleBindingID
          :
          this.state.group.ClassMemberRoleBindingID
      })
    }

    return users
  }

  render() {
    //console.debug(this.state.group)
    return (
      <View style={styles.container}>
        <Header
          text={this.getHeaderText()}
          prefix={<Ic_Back color={Colors.primary} />}
          onPrefix={this.onBack}
          onPostfix={this._onPostfix}
          postfix={this.getPostfix()}
        />
        {
          this.state.staffs && this.state.members && this.state.group && (
            <ScrollView
              ref={(ref) => { this.scrollViewRef = ref }}
              horizontal
              scrollEnabled={false}
              pagingEnabled
              showsHorizontalScrollIndicator={false}>
              <Members
                addedMembers={this.state.selectedMembers}
                addedStaffs={this.state.selectedStaffs}
                onAddMembers={this._onAddMember}
              />
              {
                this.state.pages.length > 0 ? (
                  this.state.pages.map((page, i) => {
                    return (
                      <View
                        key={'page-' + i}
                        style={styles.pageContainer}>
                        {this.getPage(page)}
                      </View>
                    )
                  })
                ) : null
              }
            </ScrollView>
          )
        }
      </View>
    )
  }
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  pageContainer: {
    width: Styles.WIDTH
  }
})

const mapStateToProps = state => {
  return {

  }
}

const mapDispatchToProps = {
  getSchoolMemberList,
  getSchoolStaffList,
  joinGroup,
  getClass
}

export default connect(mapStateToProps, mapDispatchToProps)(AddMembers)

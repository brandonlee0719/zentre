import React, {
  createRef
} from 'react'
import {
  View,
  ScrollView,
  BackHandler,
  TouchableOpacity
} from 'react-native'
import { ScaledSheet, moderateScale } from 'react-native-size-matters'
import { connect } from 'react-redux'

import {
  Colors,
  Ic_Back,
  Styles,
  Ic_Arrow_Right,
  Ic_Plus
} from '../../res'
import { t } from '../../utils'
import {
  getClassStaffList,
  getClassMemberList,
  getSchoolMemberList,
  getSchoolStaffList,
  deleteGroup,
  editGroup,
  leaveGroup,
  joinGroup
} from '../../utils/store/controllers/group'
import {
  fetchAppData,
} from '../../utils/store/controllers/appData'

import {
  Header,
  Input,
  DropDownList,
  Text
} from '../../components'

import AddMember from './AddMember'

interface State {
  pages: string[],
  currentPage: string,

  defaultStaffList: UserInfo[] | null,
  defaultMemberList: UserInfo[] | null,

  selectedMembers: UserInfo[]
  selectedStaffs: UserInfo[]

  onEditMode: boolean
}

const pages = {
  main: 'Main',
  addMembers: 'AddMembers'
}

class EditGroup extends React.Component<any, State> {
  scrollViewRef: any
  addMembersRef: any

  group: Group

  groupName: string
  selectedLevel: { name: string, id: string }

  members: UserInfo[] | undefined
  staff: UserInfo[] | undefined
  editing: boolean
  constructor(props) {
    super(props)

    this.scrollViewRef = createRef<ScrollView>()
    this.group = this.props.route.params.group

    this.groupName = ''
    this.selectedLevel = { name: 'Select', id: '0000' }

    this.members = undefined
    this.staff = undefined
    this.editing = false

    this.state = {
      pages: [],
      currentPage: pages.main,

      selectedMembers: [],
      selectedStaffs: [],

      defaultStaffList: null,
      defaultMemberList: null,

      onEditMode: false
    }

    //console.debug('Group: ', this.group)
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onHardwareBackPress)

    //this.fetchMemberList()
    //this.fetchStaffList()

    this.fetchAllLevels()
    this.fetchGroupStaffList()
    this.fetchGroupMemberList()
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onHardwareBackPress)
  }

  onHardwareBackPress = (): any => {
    if (this.state.currentPage === pages.addMembers) {
      this.scrollViewRef?.scrollTo({ x: 0, y: 0, animated: true })

      setTimeout(() => {
        this.setState({
          pages: [],
          currentPage: pages.main,
          onEditMode: false
        })
      }, 150)
      return true
    }

    return false
  }

  _onBack = () => {
    if (this.state.currentPage === pages.addMembers) {
      this.scrollViewRef?.scrollTo({ x: 0, y: 0, animated: true })
      setTimeout(() => {
        this.setState({
          pages: [],
          currentPage: pages.main,
          onEditMode: false
        })
      }, 150)

    } else {
      this.props.navigation.goBack()
    }
  }

  fetchGroupMemberList = async () => {
    let res = await this.props.getClassMemberList(this.group.ClassID)

    if (res.meta.requestStatus !== 'rejected') {
      if (res.payload) {
        this.setState({
          defaultMemberList: res.payload,
          selectedMembers: res.payload
        })
        return
      }
    }

    //Error
  }

  fetchGroupStaffList = async () => {
    let res = await this.props.getClassStaffList(this.group.ClassID)

    if (res.meta.requestStatus !== 'rejected') {
      if (res.payload) {
        this.setState({
          defaultStaffList: res.payload,
          selectedStaffs: res.payload
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
        return res.payload
      }
    }

    return undefined
    //Error
  }

  fetchStaffList = async () => {
    let res = await this.props.getSchoolStaffList()

    if (res.meta.requestStatus !== 'rejected') {
      if (res.payload) {
        return res.payload
      }
    }

    return undefined
    //Error
  }

  fetchAllLevels = async () => {
    let res = await this.props.fetchAppData(['levelListSchool'])

    if (res.meta.requestStatus !== 'rejected') {
      if (res.payload) {
        return
      }
    }
    //Error
  }

  _getMappedLevelList = (levels: Level[]) => {
    let mapped: { name: string, id: string }[] = []

    mapped.push({
      name: 'Select',
      id: '0000'
    })

    levels.forEach(level => {
      mapped.push({
        name: level.SchoolLevelName,
        id: level.SchLevID
      })
    })

    return mapped
  }

  _getSelectedLevel = (levels: Level[]) => {
    if (levels.length === 0)
      return

    let selected: { name: string, id: string } = { name: 'Select', id: '0000' }

    for (let i = 0; i < levels.length; ++i) {
      if (levels[i].SchLevID === this.group.SchLevID) {
        selected = { name: levels[i].SchoolLevelName, id: levels[i].SchLevID }
      }
    }

    return selected
  }

  _getHeaderText = (): string => {
    let { currentPage } = this.state

    if (currentPage === pages.main) {
      return t('editGroup')
    } else if (currentPage === pages.addMembers) {
      return t('addMember')
    }

    return ''
  }

  _onAddMembers = async (editing: boolean) => {
    this.editing = editing

    if (!this.members) {
      this.members = await this.fetchMemberList()
    }

    if (!this.staff) {
      this.staff = await this.fetchStaffList()
    }

    //console.debug(this.staff)
    //console.debug(this.members)

    if (this.staff && this.members) {
      this.setState({
        pages: [pages.addMembers],
        currentPage: pages.addMembers
      }, () => {
        this.scrollViewRef?.scrollTo({ x: Styles.WIDTH, y: 0, animated: true })
      })
    }
  }

  getPage = (name) => {
    if (name === pages.addMembers) {
      if (this.staff === undefined || this.members === undefined)
        return null

      return (
        <AddMember
          editing={this.editing}
          members={this.members}
          staff={this.staff}
          selectedMembers={this.state.selectedMembers}
          selectedStaffs={this.state.selectedStaffs}
          onRef={(ref) => this.addMembersRef = ref}
          onEdit={() => {
            this.editing = true
            this.setState({
              onEditMode: true
            })
          }}
        />
      )
    }

    return null
  }

  getPostfix = () => {
    let { currentPage, onEditMode } = this.state

    if (onEditMode) {
      return (
        <Text
          text={t('save')}
          size={18}
          font={'medium'}
          color={Colors.primary}
        />
      )
    }

    if (currentPage === pages.main) {
      return (
        <Text
          text={t('save')}
          size={18}
          font={'medium'}
          color={Colors.primary}
        />
      )
    } else if (currentPage === pages.addMembers) {
      return (
        <Text
          text={this.editing ? t('save') : t('edit')}
          size={18}
          font={'medium'}
          color={Colors.primary}
        />
      )
    }

    return null
  }

  onPostfix = () => {
    let { currentPage } = this.state

    if (currentPage === pages.main) {
      this._onSave()
    } else if (currentPage === pages.addMembers) {
      if (this.editing) {
        console.debug('Save Click')
        let selected = this.addMembersRef.onPostfixClick(false)

        console.debug(selected.students.length)
        console.debug(selected.staffs.length)

        this.editing = false
        this.setState({
          selectedMembers: selected.students,
          selectedStaffs: selected.staffs
        }, () => {
          this._onBack()
        })
      } else {
        this.editing = true
        this.addMembersRef.onPostfixClick(true)
      }
    }
  }

  _onSave = async () => {
    if (this.state.defaultStaffList && this.state.defaultMemberList) {

      let staffsWillBeAdded = this._getUsersWillBeAdded(
        this.state.defaultStaffList,
        this.state.selectedStaffs,
        true
      )

      let membersWillBeAdded = this._getUsersWillBeAdded(
        this.state.defaultMemberList,
        this.state.selectedMembers,
        false
      )

      let staffsWillBeRemoved = this._getUsersWillBeRemove(
        this.state.defaultStaffList,
        this.state.selectedStaffs
      )

      let membersWillBeRemoved = this._getUsersWillBeRemove(
        this.state.defaultMemberList,
        this.state.selectedMembers
      )

      /*console.debug(this.groupName)
      console.debug(this.selectedLevel)

      console.debug(membersWillBeAdded.length)
      console.debug(membersWillBeRemoved.length)
      console.debug(staffsWillBeRemoved.length)
      console.debug(staffsWillBeAdded.length)*/


      let basic = true
      if (!(this.groupName === '' && this.selectedLevel.name === 'Select' && this.selectedLevel.id === '0000')) {
        if (!(this.groupName === this.group.ClassName && this.selectedLevel.id === this.group.SchLevID)) {
          console.debug('Updating-Basic...')
          let res = await this.props.editGroup({
            ClassID: this.group.ClassID,
            ClassName: this.groupName === '' ? this.group.ClassName : this.groupName,
            SchLevID: this.selectedLevel.id === '0000' ? this.group.SchLevID : this.selectedLevel.id
          })

          if (res.meta.requestStatus !== 'rejected') {
            basic = res.payload
          } else {
            basic = false
          }
        }
      }

      //console.debug('Adding: ', staffsWillBeAdded.concat(membersWillBeAdded).length)

      let added = true
      if (staffsWillBeAdded.concat(membersWillBeAdded).length > 0) {
        let res = await this.props.joinGroup(staffsWillBeAdded.concat(membersWillBeAdded))
        //console.debug('Adding...')
        if (res.meta.requestStatus !== 'rejected') {
          added = res.payload
        } else {
          added = false
        }
      }

      //console.debug('Removing...', staffsWillBeRemoved.concat(membersWillBeRemoved).length)

      let deleted = true
      if (staffsWillBeRemoved.concat(membersWillBeRemoved).length > 0) {
        let res = await this.props.leaveGroup(staffsWillBeRemoved.concat(membersWillBeRemoved))
        //console.debug('Removing...')
        if (res.meta.requestStatus !== 'rejected') {
          deleted = res.payload
        } else {
          deleted = false
        }
      }

      //console.debug(basic, ' ', added, ' ', deleted)
      if (basic && added && deleted) {
        this.props.navigation.goBack()
      } else {
        //Error
      }
    }
  }

  _getUsersWillBeAdded = (defaults: UserInfo[], selected: UserInfo[], isStaff: boolean) => {
    //console.debug(selected)

    let users: { UserID: string, RoleBindingID: string }[] = []

    for (let i = 0; i < selected.length; ++i) {
      const found = defaults.some(d => d.UserID === selected[i].UserID)
      if (!found) {
        users.push({
          UserID: selected[i].UserID,
          RoleBindingID: isStaff ?
            this.group.ClassTeacherRoleBindingID
            :
            this.group.ClassMemberRoleBindingID // selected[i].RoleBindingID
        })
      }
    }

    return users
  }

  _getUsersWillBeRemove = (defaults: UserInfo[], selected: UserInfo[]) => {
    let users: { UserID: string, RoleBindingID: string }[] = []

    for (let i = 0; i < defaults.length; ++i) {
      const found = selected.some(d => d.UserID === defaults[i].UserID)
      if (!found) {
        users.push({
          UserID: defaults[i].UserID,
          RoleBindingID: defaults[i].RoleBindingID
        })
      }
    }

    return users
  }

  render() {
    const { levelList } = this.props
    const { defaultMemberList, defaultStaffList } = this.state

    return (
      <View style={styles.container}>
        <Header
          text={this._getHeaderText()}
          prefix={<Ic_Back color={Colors.primary} />}
          onPrefix={this._onBack}
          postfix={this.getPostfix()}
          onPostfix={this.onPostfix}
        />
        {
          levelList && defaultMemberList && defaultStaffList && (
            <ScrollView
              ref={(ref) => { this.scrollViewRef = ref }}
              horizontal
              scrollEnabled={false}
              pagingEnabled
              showsHorizontalScrollIndicator={false}>
              <View style={{
                width: Styles.WIDTH,
              }}>
                <ScrollView
                  horizontal={false}
                  contentContainerStyle={{ paddingBottom: 16 }}
                  showsVerticalScrollIndicator={false}>

                  <Input
                    containerStyle={{ marginTop: moderateScale(20) }}
                    title={t('groupName')}
                    isRequired={true}
                    defaultValue={this.group.ClassName}
                    onTextChanged={(text) => { this.groupName = text }} />

                  <DropDownList
                    containerStyle={{ marginTop: moderateScale(20) }}
                    title={t('groupLevel')}
                    isRequired={true}
                    items={this._getMappedLevelList(levelList)}
                    onSelected={(item) => this.selectedLevel = item}
                    value={this._getSelectedLevel(levelList)}
                  />

                  <View style={styles.memberContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        this._onAddMembers(false)
                      }}
                      activeOpacity={.7}
                      style={styles.userContainer}>
                      <Text
                        text={t('viewContacts') + ' (' +
                          (this.state.selectedMembers.length + this.state.selectedStaffs.length) + ')'}
                        size={16}
                        font={'medium'}
                        color={Colors.primary}
                      />
                      <Ic_Arrow_Right color={Colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        this._onAddMembers(true)
                      }}
                      activeOpacity={.7}
                      style={styles.plusContainer}>
                      <Ic_Plus color={Colors.primary} />
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
              {
                this.state.pages.map(page => {
                  return (
                    <View
                      key={'key-' + page}
                      style={{ width: Styles.WIDTH }}>
                      {
                        this.getPage(page)
                      }
                    </View>
                  )
                })
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
  memberContainer: {
    width: '100%',
    paddingHorizontal: '10@ms',
    flexDirection: 'row',
    height: '56@ms',
    marginTop: '48@ms'
  },
  userContainer: {
    flex: 5,
    height: '100%',
    borderRadius: '4@ms',
    borderWidth: 1,
    borderColor: Colors.grey1,
    paddingHorizontal: '10@ms',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  plusContainer: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

const mapStateToProps = state => {
  return {
    levelList: state.appDataController.levelListSchool,
  }
}

const mapDispatchToProps = {
  getClassStaffList,
  getClassMemberList,
  getSchoolMemberList,
  getSchoolStaffList,
  fetchAppData,
  deleteGroup,
  editGroup,
  leaveGroup,
  joinGroup
}

export default connect(mapStateToProps, mapDispatchToProps)(EditGroup)
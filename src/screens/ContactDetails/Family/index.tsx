import React, {
  createRef
} from 'react'
import {
  View,
  ScrollView,
  BackHandler
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import { connect } from 'react-redux'

import { Colors, Ic_Back, Styles } from '../../../res'
import { t, isEmailValid } from '../../../utils'
import {
  Header,
  Text
} from '../../../components'
import {
  getFamilyList,
  createContactFamily,
  uploadFile,
  editContactFamily
} from '../../../utils/store/controllers/contacts'
import { fetchAppData } from '../../../utils/store/controllers/appData'
import { showAlert } from '../../../utils/store/controllers/alert'
import { showPopup } from '../../../utils/store/controllers/popup'

import Relationships from './Relationships'
import Edit from './Edit'
import ContactHeader from './ContactHeader'
import NewRelationInfo from './NewRelationInfo'
import NewRelationImagePicker from './NewRelationImagePicker'

const pages = {
  main: 'Main',
  newRelationInfo: 'NewRelationInfo',
  newRelationImagePick: 'NewRelationImagePick',
  edit: "Edit"
}

interface State {
  headerText: string

  relationships: { name: string, id: string }[] | null

  pages: string[],
  currentPage: string
}

class Family extends React.Component<any, State> {

  userId: string
  contactName: string
  contactEmail: string
  contactAvatar: string

  scrollViewRef: any

  newFirstName: string
  newLastName: string
  newRelationShip: Relationship | null
  newMobileNumber: string
  newEmail: string
  newAvatar: string

  selectedRelation: Relation | null

  constructor(props) {
    super(props)

    this.userId = this.props.route.params.userId
    this.contactName = this.props.route.params.contactName
    this.contactEmail = this.props.route.params.email
    this.contactAvatar = this.props.route.params.avatar

    this.newEmail = ''
    this.newFirstName = ''
    this.newLastName = ''
    this.newMobileNumber = ''
    this.newAvatar = ''
    this.newRelationShip = null

    this.selectedRelation = null

    this.scrollViewRef = createRef<ScrollView>()

    this.state = {
      headerText: t('family'),
      relationships: null,

      pages: [],
      currentPage: pages.main,
    }
  }

  async componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onHardwareBackPress)
    await this.fetchFamily()
    this.fetchData()
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onHardwareBackPress)
  }

  onHardwareBackPress = (): any => {
    let { currentPage } = this.state

    if (currentPage === pages.newRelationInfo || currentPage === pages.edit) {
      this.newRelationShip = null
      this.setNew()

      this.scrollViewRef?.scrollTo({ x: 0, y: 0, animated: true })
      setTimeout(() => {
        this.setState({
          currentPage: pages.main,
          pages: [],
          headerText: t('family')
        })
      }, 150)
      return true
    } else if (currentPage === pages.newRelationImagePick) {
      this.scrollViewRef?.scrollTo({ x: Styles.WIDTH, y: 0, animated: true })
      setTimeout(() => {
        this.setState({
          currentPage: pages.newRelationInfo,
        })
      }, 150)
      return true
    }

    return false
  }

  _onBack = () => {
    let { currentPage } = this.state

    if (currentPage === pages.newRelationInfo || currentPage === pages.edit) {
      this.newRelationShip = null
      this.setNew()

      this.scrollViewRef?.scrollTo({ x: 0, y: 0, animated: true })
      setTimeout(() => {
        this.setState({
          currentPage: pages.main,
          pages: [],
          headerText: t('family')
        })
      }, 150)
    } else if (currentPage === pages.newRelationImagePick) {
      this.scrollViewRef?.scrollTo({ x: Styles.WIDTH, y: 0, animated: true })
      setTimeout(() => {
        this.setState({
          currentPage: pages.newRelationInfo,
        })
      }, 150)
    } else if (currentPage === pages.edit) {

    } else {
      this.props.navigation.goBack()
    }

  }

  fetchFamily = async () => {
    if (!this.props.family)
      await this.props.getFamilyList(this.userId)
  }

  fetchData = () => {
    this.props.fetchAppData(['parent', 'sibling', 'guardian'])
  }

  _getParents = (relations: Relation[]): Relation[] => {
    let parents: Relation[] = []
    relations.map(relation => {
      for (let i = 0; i < this.props.relationshipParent.length; ++i) {
        if (relation.UserRelationship === this.props.relationshipParent[i].id) {
          parents.push(relation)
        }
      }
    })

    return parents
  }

  _getSiblings = (relations: Relation[]): Relation[] => {
    let siblings: Relation[] = []
    relations.map(relation => {
      for (let i = 0; i < this.props.relationshipSiblings.length; ++i) {
        if (relation.UserRelationship === this.props.relationshipSiblings[i].id) {
          siblings.push(relation)
        }
      }
    })

    return siblings
  }

  _getGuardians = (relations: Relation[]): Relation[] => {
    let guardians: Relation[] = []
    relations.map(relation => {
      for (let i = 0; i < this.props.relationshipGuardian.length; ++i) {
        if (relation.UserRelationship === this.props.relationshipGuardian[i].id) {
          guardians.push(relation)
        }
      }
    })

    return guardians
  }

  _onOptions = (relation: Relation,
    pos: { x: number, y: number },
    r: 'parent' | 'guardian' | 'sibling') => {
    //console.debug(relation)

    this.props.showPopup({
      show: true,
      position: pos,
      options: [{
        text: t('edit'),
        onClick: () => {
          console.debug('edit')
          this._onEditRelationship(r, relation)
        }
      },
      {
        text: t('setAuth'),
        onClick: () => { }
      },
      {
        text: t('delete'),
        onClick: () => { }
      }]
    })
  }

  getPostfix = () => {
    let currentPage = this.state.currentPage

    if (currentPage === pages.newRelationInfo) {
      return (
        <Text
          text={t('next')}
          size={18}
          font={'medium'}
          color={Colors.primary}
        />
      )
    } else if (currentPage === pages.newRelationImagePick) {
      return (
        <Text
          text={t('create')}
          size={18}
          font={'medium'}
          color={Colors.primary}
        />
      )
    } else if (currentPage === pages.edit) {
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

  _onPostfix = () => {
    let currentPage = this.state.currentPage

    if (currentPage === pages.newRelationInfo) {
      if (this.newFirstName === '' || this.newLastName === '' ||
        this.newEmail === '' || this.newMobileNumber === '') {

        this.props.showAlert({
          show: true,
          title: t('warning'),
          message: t('fillParts')
        })
        return
      }

      this.setState({
        currentPage: pages.newRelationImagePick
      }, () => {
        this.scrollViewRef?.scrollTo({ x: 2 * Styles.WIDTH, y: 0, animated: true })
      })
    } else if (currentPage === pages.newRelationImagePick) {
      //Create
      this.onCreate()
    } else if (currentPage === pages.edit) {
      //Save
      this.onSave()
    }
  }

  _onAddRelationship = (r: 'parent' | 'guardian' | 'sibling') => {
    if (r === 'guardian') {
      this.newRelationShip = this.props.relationshipGuardian[0]
      this.setNew()

      this.setState({
        pages: [pages.newRelationInfo, pages.newRelationImagePick],
        currentPage: pages.newRelationInfo,
        headerText: t('newGuardian'),
        relationships: this.props.relationshipGuardian
      }, () => {
        this.scrollViewRef?.scrollTo({ x: Styles.WIDTH, y: 0, animated: true })
      })
    } else if (r === 'parent') {
      this.newRelationShip = this.props.relationshipParent[0]
      this.setNew()

      this.setState({
        pages: [pages.newRelationInfo, pages.newRelationImagePick],
        currentPage: pages.newRelationInfo,
        headerText: t('newParent'),
        relationships: this.props.relationshipParent
      }, () => {
        this.scrollViewRef?.scrollTo({ x: Styles.WIDTH, y: 0, animated: true })
      })
    } else if (r === 'sibling') {
      this.newRelationShip = this.props.relationshipSiblings[0]
      this.setNew()

      this.setState({
        pages: [pages.newRelationInfo, pages.newRelationImagePick],
        currentPage: pages.newRelationInfo,
        headerText: t('newSibling'),
        relationships: this.props.relationshipSiblings
      }, () => {
        this.scrollViewRef?.scrollTo({ x: Styles.WIDTH, y: 0, animated: true })
      })
    }
  }

  _onEditRelationship = (r: 'parent' | 'guardian' | 'sibling', relation: Relation) => {
    this.selectedRelation = relation

    if (r === 'guardian') {
      this.newRelationShip = null
      this.setNew()

      this.setState({
        pages: [pages.edit],
        currentPage: pages.edit,
        headerText: t('edit'),
        relationships: this.props.relationshipGuardian
      }, () => {
        this.scrollViewRef?.scrollTo({ x: Styles.WIDTH, y: 0, animated: true })
      })
    } else if (r === 'parent') {
      this.newRelationShip = null
      this.setNew()

      this.setState({
        pages: [pages.edit],
        currentPage: pages.edit,
        headerText: t('edit'),
        relationships: this.props.relationshipParent
      }, () => {
        this.scrollViewRef?.scrollTo({ x: Styles.WIDTH, y: 0, animated: true })
      })
    } else if (r === 'sibling') {
      this.newRelationShip = null
      this.setNew()

      this.setState({
        pages: [pages.edit],
        currentPage: pages.edit,
        headerText: t('edit'),
        relationships: this.props.relationshipSiblings
      }, () => {
        this.scrollViewRef?.scrollTo({ x: Styles.WIDTH, y: 0, animated: true })
      })
    }
  }

  setNew = () => {
    this.newFirstName = ''
    this.newLastName = ''
    this.newMobileNumber = ''
    this.newEmail = ''
    this.newAvatar = ''
  }

  getPage = (name) => {
    if (name === pages.newRelationInfo) {
      return (
        <NewRelationInfo
          relations={this.state.relationships}
          onFistName={(text) => this.newFirstName = text}
          onLastName={(text) => this.newLastName = text}
          onEmail={(text) => this.newEmail = text}
          onMobileNumber={(text) => this.newMobileNumber = text}
          onRelationship={(relation) => this.newRelationShip = relation}
        />
      )
    } else if (name === pages.newRelationImagePick) {
      return (
        <NewRelationImagePicker
          onPickAvatar={(uri) => this.newAvatar = uri}
          onFinish={this.onCreate}
        />
      )
    } else if (name === pages.edit) {
      return (
        <Edit
          relation={this.selectedRelation}
          relationships={this.state.relationships}
          onFistName={(text) => this.newFirstName = text}
          onLastName={(text) => this.newLastName = text}
          onEmail={(text) => this.newEmail = text}
          onMobileNumber={(text) => this.newMobileNumber = text}
          onRelationship={(relation) => this.newRelationShip = relation}
          onPickAvatar={(uri) => this.newAvatar = uri}
        />
      )
    }

    return null
  }

  onCreate = async () => {
    if (this.newFirstName === '' || this.newLastName === '' ||
      this.newEmail === '' || this.newMobileNumber === '') {

      this.props.showAlert({
        show: true,
        title: t('warning'),
        message: t('fillParts')
      })
      return
    }

    if (!isEmailValid(this.newEmail)) {
      this.props.showAlert({
        show: true,
        title: t('warning'),
        message: t('emailAddressFormat')
      })
      return
    }

    let avatarPath = ''
    if (this.newAvatar !== '') {

      let resAvatar = await this.props.uploadFile({ file: this.newAvatar })
      if (resAvatar.meta.requestStatus !== 'rejected') {
        if (resAvatar.payload) {
          let payload = resAvatar.payload
          if (payload.success) {
            //console.debug(payload.text)
            avatarPath = 'https://contacts.ichild.com.sg' + payload.text
          } else {
            this.props.showAlert({
              show: true,
              title: t('warning'),
              message: payload.text
            })
            return
          }
        } else return
      }
    }

    //console.debug(avatarPath)

    let res = await this.props.createContactFamily({
      UserID: this.userId,
      FirstName: this.newFirstName,
      LastName: this.newLastName,
      Relationship: this.newRelationShip?.id,
      Email: this.newEmail,
      HeadPic: avatarPath
    })

    if (res.meta.requestStatus !== 'rejected') {
      if (res.payload) {
        let payload: any = res.payload
        if (payload.success) {
          this.setNew()

          this.scrollViewRef?.scrollTo({ x: 0, y: 0, animated: true })
          setTimeout(() => {
            this.setState({
              currentPage: pages.main,
              pages: [],
              headerText: t('family')
            })
          }, 150)
        } else {
          this.props.showAlert({
            show: true,
            title: t('warning'),
            message: payload.text
          })
        }
        return
      }
    }

    this.props.showAlert({
      show: true,
      title: t('error'),
      message: t('somethingWrong')
    })
  }

  onSave = () => {
    const onSave = async () => {
      let e = this.newEmail !== '' ? this.newEmail : this.selectedRelation?.Email

      if (!isEmailValid(e || '')) {
        this.props.showAlert({
          show: true,
          title: t('warning'),
          message: t('emailAddressFormat')
        })
        return
      }

      let avatarPath = this.selectedRelation?.HeadSculpture
      if (this.newAvatar !== '') {
        let resAvatar = await this.props.uploadFile({ file: this.newAvatar })
        if (resAvatar.meta.requestStatus !== 'rejected') {
          if (resAvatar.payload) {
            let payload: any = resAvatar.payload
            if (payload.success) {
              //console.debug(payload.text)
              avatarPath = 'https://contacts.ichild.com.sg' + payload.text
            } else {
              this.props.showAlert({
                show: true,
                title: t('warning'),
                message: payload.text
              })
              return
            }
          } else return
        }
      }

      let res = await this.props.editContactFamily({
        sUserId: this.userId,
        tUserId: this.selectedRelation?.TUserID,
        FirstName: this.newFirstName !== '' ? this.newFirstName : this.selectedRelation?.FirstName,
        LastName: this.newLastName !== '' ? this.newLastName : this.selectedRelation?.LastName,
        Relationship: this.newRelationShip ? this.newRelationShip.id : this.selectedRelation?.UserRelationship,
        Phone: this.newMobileNumber !== '' ? this.newMobileNumber : this.selectedRelation?.Phone,
        Email: this.newEmail !== '' ? this.newEmail : this.selectedRelation?.Email,
        HeadPic: avatarPath
      })

      if (res.meta.requestStatus !== 'rejected') {
        if (res.payload) {
          let payload: any = res.payload
          if (payload.success) {
            this.setNew()

            this.scrollViewRef?.scrollTo({ x: 0, y: 0, animated: true })
            setTimeout(() => {
              this.setState({
                currentPage: pages.main,
                pages: [],
                headerText: t('family')
              })
            }, 150)
          } else {
            this.props.showAlert({
              show: true,
              title: t('warning'),
              message: payload.text
            })
          }
          return
        }
      }

      this.props.showAlert({
        show: true,
        title: t('error'),
        message: t('somethingWrong')
      })
    }

    this.props.showAlert({
      show: true,
      message: t('wannaSave'),
      positiveText: t('save'),
      onPositive: onSave,
      negativeText: t('cancel')
    })
  }

  render() {
    let {
      headerText,
      pages
    } = this.state

    let {
      relationshipParent,
      relationshipSiblings,
      relationshipGuardian,
      family
    } = this.props


    //console.debug(family)
    /*console.debug(relationshipParent)
    console.debug(relationshipSiblings)
    console.debug(relationshipGuardian)*/

    //console.debug(this._getGuardians(family))
    //console.debug(this._getParents(family))
    //console.debug(this._getSiblings(family))
    return (
      <View style={styles.container}>
        <Header
          text={headerText}
          prefix={<Ic_Back color={Colors.black} />}
          onPrefix={this._onBack}
          postfix={this.getPostfix()}
          onPostfix={this._onPostfix}
        />
        {
          relationshipParent && relationshipSiblings &&
          relationshipGuardian && family && (
            <ScrollView
              ref={(ref) => this.scrollViewRef = ref}
              >
              <View
                key={'page-main'}
                style={{ width: Styles.WIDTH }}>
                <ContactHeader
                  email={this.contactEmail}
                  avatar={this.contactAvatar}
                  name={this.contactName}
                />
                <Relationships
                  onOptions={this._onOptions}
                  guardians={this._getGuardians(family)}
                  parents={this._getParents(family)}
                  siblings={this._getSiblings(family)}
                  onAddRelationShip={this._onAddRelationship}
                />
              </View>
              {
                pages.length > 0 && (
                  pages.map((page, i) => {
                    return (
                      <View
                        key={'page-' + i}
                        style={styles.pageContainer}>
                        {this.getPage(page)}
                      </View>
                    )
                  })
                )
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
    backgroundColor: 'white'
  },
  pageContainer: {
    width: Styles.WIDTH
  }
})

const mapStateToProps = state => {
  return {
    relationshipParent: state.appDataController.relationshipParent,
    relationshipSiblings: state.appDataController.relationshipSiblings,
    relationshipGuardian: state.appDataController.relationshipGuardian,
    family: state.contactsCController.family
  }
}
const mapDispatchToProps = {
  fetchAppData,
  showAlert,
  getFamilyList,
  createContactFamily,
  showPopup,
  uploadFile,
  editContactFamily
}

export default connect(mapStateToProps, mapDispatchToProps)(Family)
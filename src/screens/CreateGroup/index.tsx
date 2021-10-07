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
import { StackActions } from '@react-navigation/native';

import {
  fetchAppData,
} from '../../utils/store/controllers/appData'
import { showAlert } from '../../utils/store/controllers/alert'


import {
  Header,
  Text,
} from '../../components'
import { t } from '../../utils'
import { Colors, Ic_Back, Styles } from '../../res'

interface State {
  currentPage: string
  pages: string[]
}

const pages = {
  main: 'Main',
  createLevel: 'CreateLevel',
  groupInfo: 'GroupInfo',
}

import Levels from './Levels'
import CreateLevel from './CreateLevel'
import GroupInfo from './GroupInfo'

class CreateGroup extends React.Component<any, State> {

  scrollViewRef: any
  createLevelRef: any
  createGroupRef: any

  selectedLevel: Level | null
  createdClassId: string
  constructor(props) {
    super(props)

    this.scrollViewRef = createRef<ScrollView>()
    this.selectedLevel = null
    this.createdClassId = ''

    this.state = {
      currentPage: pages.main,
      pages: [],
    }
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onHardwareBackPress)
    this.fetchAllLevels()
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onHardwareBackPress)
  }

  fetchAllLevels = async () => {
    let res = await this.props.fetchAppData(['allLevelByUserID'])
    if (res.meta.requestStatus !== 'rejected') {
      if (res.payload) {

        return
      }
    }

    //Error
  }

  onHardwareBackPress = (): any => {
    let { currentPage } = this.state

    if (currentPage === pages.createLevel || currentPage === pages.groupInfo) {
      this.scrollViewRef?.scrollTo({ x: 0, y: 0, animated: true })

      setTimeout(() => {
        this.setState({
          pages: [],
          currentPage: pages.main
        })
      }, 150)

      return true
    }

    return false
  }

  _onBack = () => {
    let { currentPage } = this.state

    if (currentPage === pages.createLevel || currentPage === pages.groupInfo) {
      this.scrollViewRef?.scrollTo({ x: 0, y: 0, animated: true })

      setTimeout(() => {
        this.setState({
          pages: [],
          currentPage: pages.main
        })
      }, 150)

    } else {
      this.props.navigation.goBack()
    }
  }

  getHeaderText = () => {
    let { currentPage } = this.state

    if (currentPage === pages.main || currentPage === pages.groupInfo) {
      return t('createGroup')
    } else if (currentPage === pages.createLevel) {
      return t('createLevel')
    }

    return ''
  }

  getPage = (page: string) => {
    if (page === pages.createLevel) {
      return (
        <CreateLevel
          onRef={(ref) => this.createLevelRef = ref}
        />
      )
    } else if (page === pages.groupInfo) {
      let level: Level | null = null
      if (this.selectedLevel === null) {
        if (this.props.levelListByUserID && this.props.levelListByUserID.length > 0) {
          level = this.props.levelListByUserID[0]
        }
      } else {
        level = this.selectedLevel
      }

      if (level === null)
        return null

      return (
        <GroupInfo
          onRef={(ref) => this.createGroupRef = ref}
          level={level}
        />
      )
    }
    return null
  }

  getPostfix = () => {
    let { currentPage } = this.state

    if (currentPage === pages.main) {
      return (
        <Text
          text={t('next')}
          size={18}
          font={'medium'}
          color={Colors.primary}
        />
      )
    } else if (currentPage === pages.createLevel || currentPage === pages.groupInfo) {
      return (
        <Text
          text={t('create')}
          size={18}
          font={'medium'}
          color={Colors.primary}
        />
      )
    }
    return null
  }

  _onPostfix = async () => {
    let { currentPage } = this.state

    if (currentPage === pages.main) {
      this.setState({
        pages: [pages.groupInfo],
        currentPage: pages.groupInfo
      }, () => {
        this.scrollViewRef?.scrollTo({ x: Styles.WIDTH, y: 0, animated: true })
      })
    } else if (currentPage === pages.createLevel) {
      if (this.createLevelRef) {
        let res = await this.createLevelRef.onCreate()
        //console.debug('Index:RES - ', res)
        if (res) {
          this._onBack()
        } else {
          //Error
        }
      }
    } else if (currentPage === pages.groupInfo) {
      if (this.createGroupRef) {
        let classID = await this.createGroupRef.onCreate()
        console.debug('Index:classID - ', classID)
        if (classID) {
          this.createdClassId = classID
          //Success
          this.props.showAlert({
            show: true,
            message: t('createSuccessGroup'),
            positiveText: t('addContactsToGroup'),
            onPositive: () => {
              this.props.navigation.dispatch(
                StackActions.replace('AddMembers', {
                  classID: classID,
                })
              )
            },
            negativeText: t('skip'),
            onNegative: () => { this.props.navigation.goBack() }
          })
        } else {
          //Error
        }
      }
    }
  }

  _onCreateLvl = () => {
    this.setState({
      pages: [pages.createLevel],
      currentPage: pages.createLevel
    }, () => {
      this.scrollViewRef?.scrollTo({ x: Styles.WIDTH, y: 0, animated: true })
    })
  }

  _onLevel = (level: Level) => {
    this.selectedLevel = level
  }

  render() {
    const { levelListByUserID } = this.props

    //console.debug("levelList: ", levelListByUserID)

    return (
      <View style={styles.container}>
        <Header
          text={this.getHeaderText()}
          postfix={this.getPostfix()}
          onPostfix={this._onPostfix}
          prefix={<Ic_Back color={Colors.primary} />}
          onPrefix={this._onBack}
        />
        {
          levelListByUserID && (
            <ScrollView
              ref={(ref) => { this.scrollViewRef = ref }}
              horizontal
              scrollEnabled={false}
              pagingEnabled
              showsHorizontalScrollIndicator={false}>

              <Levels
                onCreateLvl={this._onCreateLvl}
                levels={levelListByUserID}
                onLevel={this._onLevel}
              />

              {
                this.state.pages.length > 0 && (
                  this.state.pages.map((page, i) => {
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
    backgroundColor: 'white',
  },
  pageContainer: {
    width: Styles.WIDTH
  }
})

const mapStateToProps = state => {
  return {
    levelListByUserID: state.appDataController.levelListByUserID,
  }
}

const mapDispatchToProps = {
  fetchAppData,
  showAlert
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateGroup)
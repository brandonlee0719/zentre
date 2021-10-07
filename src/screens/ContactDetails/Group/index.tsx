import React from 'react'
import {
  View,
  BackHandler,
  ScrollView
} from 'react-native'
import { ScaledSheet, moderateScale } from 'react-native-size-matters'

import { Colors, Styles, Ic_Back } from '../../../res'
import { Header } from '../../../components'

interface State {
  currentPage: string
}

import GroupList from './GroupList'
import History from './History'

const pages = {
  groupList: 'GroupList',
  history: 'History'
}

class Groups extends React.Component<any, State> {

  scrollViewRef: any
  constructor(props) {
    super(props)

    this.state = {
      currentPage: pages.groupList
    }
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onHardwareBackPress)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onHardwareBackPress)
  }

  onHardwareBackPress = (): any => {
    let { currentPage } = this.state

    if (currentPage === pages.history) {
      this.scrollViewRef?.scrollTo({ x: 0, y: 0, animated: true })

      setTimeout(() => {
        this.setState({
          currentPage: pages.groupList
        })
      }, 150)

      return true
    }

    return false
  }

  _onBack = () => {
    let { currentPage } = this.state

    if (currentPage === pages.history) {
      this.scrollViewRef?.scrollTo({ x: 0, y: 0, animated: true })

      setTimeout(() => {
        this.setState({
          currentPage: pages.groupList
        })
      }, 150)

    } else {
      this.props.navigation.goBack()
    }
  }

  getHeaderText = () => {
    let { currentPage } = this.state

    if (currentPage === pages.history) {
      return 'Groups History'
    } else if (currentPage === pages.groupList) {
      return "Member's Groups"
    }

    return ''
  }

  _onHistory = () => {
    this.setState({
      currentPage: pages.history
    }, () => {
      this.scrollViewRef?.scrollTo({ x: Styles.WIDTH, y: 0, animated: true })
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          text={this.getHeaderText()}
          prefix={<Ic_Back color={Colors.primary} />}
          onPrefix={this._onBack}
        />
        <ScrollView
          ref={(ref) => { this.scrollViewRef = ref }}
          horizontal
          scrollEnabled={false}
          pagingEnabled
          showsHorizontalScrollIndicator={false}>

          <GroupList onHistory={this._onHistory} />
          <History />
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
  groupsContainer: {
    width: Styles.WIDTH - moderateScale(32),
    backgroundColor: Colors.grey2,
    borderRadius: 10,
    marginTop: '20@ms',
    marginHorizontal: '16@ms'
  },
  textContainer: {
    width: '100%',
    paddingHorizontal: '20@ms',
    paddingVertical: '16@ms',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  text1: {
    fontSize: '18@ms',
    lineHeight: '22@ms',
    fontFamily: 'MontserratRegular',
    color: Colors.black
  },
  text2: {
    fontSize: '16@ms',
    lineHeight: '20@ms',
    fontFamily: 'MontserratRegular',
    color: Colors.primary
  },
})


export default Groups

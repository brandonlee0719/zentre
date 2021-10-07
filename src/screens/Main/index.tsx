import React from 'react'
import {
  LogBox
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import { SafeAreaView } from 'react-native-safe-area-context'
import { connect } from 'react-redux';

import { MainTabNav } from '../../navigation'
import Login from '../Login'

LogBox.ignoreLogs(
  [
    "Warning: Cannot update a component (`BottomTabNavigator`) while rendering a different component (`ContactsStackNav`)"
  ]
)

interface State {

}

class Main extends React.Component<any, State> {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  componentDidMount() {

  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {
          this.props.auth?.accessToken ?
            (
              <MainTabNav />
            )
            :
            (
              <Login />
            )
        }
      </SafeAreaView>
    )
  }
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
})

const mapStateToProps = (state) => {
  return {
    auth: state.authController
  }
}

export default connect(mapStateToProps, undefined)(Main)
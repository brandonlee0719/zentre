import React, {
  useEffect
} from 'react'
import {
  Image,
  StatusBar,
} from 'react-native'
import { CommonActions } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScaledSheet } from 'react-native-size-matters'

import {
  useAppDispatch,
  LocalStorage,
  AUTH
} from '../../utils'
import { setAuth, refreshToken } from '../../utils/store/controllers/auth'

function Splash({ navigation }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    loadAuth()
  }, [])

  const loadAuth = async () => {
    let auth = await LocalStorage.getInstance()
      .load(AUTH)

    if (auth) {
      dispatch(setAuth(auth))
      let refresh = await dispatch(refreshToken())
    }
    setTimeout(_navigateHome, 150)
  }

  const _navigateHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: 'Main' }
        ],
      })
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'white'} />
      {/* <Image source={require('../../../assets/images/logo.png')}
        style={styles.logo} /> */}
    </SafeAreaView>
  )
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: '220@ms',
    height: '90@ms',
    resizeMode: 'contain'
  }
})

export default Splash
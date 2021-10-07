import React from 'react'
import {
  View,
  Image,
} from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import { connect } from 'react-redux';

import { t } from '../../utils'
import {
  Header,
  Text
} from '../../components'
import { login } from '../../utils/store/controllers/auth'
import { Colors } from '../../res'

import { createCategory } from '../../utils/store/controllers/fees'

import {
  authorize,
  refresh,
  revoke,
  AuthConfiguration,
} from 'react-native-app-auth';

interface State {

}

class Login extends React.Component<any, State> {
  constructor(props) {
    super(props)

    this.state = {

    }
  }


  _onLogin = async () => {

    /*const config: AuthConfiguration = {
      usePKCE: true,
      warmAndPrefetchChrome: true,
      issuer: 'https://identity.xero.com',
      clientId: 'EFDB34E9660E4CAC9277E4640AD1EE51',
      redirectUrl: 'https://com.zentre.app/oauth2redirect',
      scopes: ['openid', 'profile', 'email'],
      additionalParameters: {
        prompt: 'login'
      },
      clientAuthMethod: 'basic',
      serviceConfiguration: {
        authorizationEndpoint: 'https://login.xero.com/identity/connect/authorize',
        tokenEndpoint: 'https://identity.xero.com/connect/token',
        revocationEndpoint: 'https://identity.xero.com/connect/revocation',
      },
    }

    const result = await authorize(config)
      .catch(err => {
        console.debug('err: ', err)
      })

    console.debug(result)
    return*/

    
    let res = await this.props.login()
    if (res.meta.requestStatus !== 'rejected') {

    } else {
      //Error
      //Handle Error
    }

    //this.props.createCategory()
  }

  headerPostfixIcon = () => {
    return (
      <Text
        text={t('login')}
        size={18}
        color={Colors.primary}
        font={'medium'}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          postfix={this.headerPostfixIcon()}
          onPostfix={this._onLogin}
        />
        <View style={styles.logoContainer}>
          <Image style={styles.logo}
            source={require('../../../assets/images/logo.png')} />
        </View>
      </View>
    )
  }
}

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
    marginTop:'-60@ms',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: '170@ms',
    height: '60@ms',
  },
})

const mapDispatchToProps = {
  login,
  createCategory
}

export default connect(undefined, mapDispatchToProps)(Login)
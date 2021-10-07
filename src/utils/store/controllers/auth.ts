import {
  createAsyncThunk,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit'
import {
  authorize,
  refresh,
  revoke,
  AuthConfiguration,
} from 'react-native-app-auth';
import LocalStorage from '../../Storage'
import { AUTH } from '../../Constants'

import { LoadingController } from './index'
import { setGroupLogout } from './group'
import { setContactLogout } from './contacts'

interface State {
  accessToken: string,
  accessTokenExpirationDate: string,
  authorizeAdditionalParameters: { session_state: string } | null
  idToken: string,
  refreshToken: string | null,
}

const name = 'authentication';

const initialState: State = {
  accessToken: '',
  accessTokenExpirationDate: '',
  authorizeAdditionalParameters: null,
  idToken: '',
  refreshToken: null,
}

const scopes_supported = [
  "openid",
  "profile",
  "roles",
  "scope1",
  "scope2",
  "OCBC_User_API_Scope",
  "OCBC_AccountAPI_Scope",
  "HangFire_API_Scope",
  "Contact_API_Scope",
  "Fee_API_Scope",
  "offline_access"
]

const config: AuthConfiguration = {
  warmAndPrefetchChrome: true,
  issuer: 'https://id4.ichild.com.sg',
  clientId: 'com_zentre_app',
  clientSecret: '69E3949F-BFE2-4AA0-AAFD-287B3B18BEAE',
  redirectUrl: 'com.zentre.app://Zentre_oauth2callback',
  scopes: ['openid', 'profile', 'roles', 'Contact_API_Scope', 'Fee_API_Scope', 'offline_access'],
  additionalParameters: {
    prompt: 'login'
  },
  clientAuthMethod: 'basic',
  serviceConfiguration: {
    authorizationEndpoint: 'https://id4.ichild.com.sg/connect/authorize',
    tokenEndpoint: 'https://id4.ichild.com.sg/connect/token',
    revocationEndpoint: 'https://id4.ichild.com.sg/connect/revocation',
  },
}

/*const config: AuthConfiguration = {
  usePKCE: true,
  warmAndPrefetchChrome: true,
  issuer: 'https://id4.preschooltalent.com',
  clientId: 'com_zentre_app',
  clientSecret: '69E3949F-BFE2-4AA0-AAFD-287B3B18BEAE',
  redirectUrl: 'com.zentre.app://Zentre_oauth2callback',
  scopes: ['openid', 'profile', 'roles', 'Contact_API_Scope', 'Fee_API_Scope', 'offline_access'],
  additionalParameters: {
    prompt: 'login'
  },
  clientAuthMethod: 'basic',
  serviceConfiguration: {
    authorizationEndpoint: 'https://id4.preschooltalent.com/connect/authorize',
    tokenEndpoint: 'https://id4.preschooltalent.com/connect/token',
    revocationEndpoint: 'https://id4.preschooltalent.com/connect/revocation',
  },
}*/

const login = createAsyncThunk(
  `${name}/login`,
  async (_, { dispatch }) => {
    dispatch(LoadingController.setLoading({ loading: true }))
    try {
      const result: any = await authorize(config)

      console.log('accessToken: ', result.accessToken)
      LocalStorage.getInstance().save(AUTH, result)
      dispatch(setAuth(result))

      /*const accessToken = result.accessToken
      const idToken = result.idToken
      const payload = idToken.split('.')[1]
      const userId = JSON.parse(base64.decode(payload)).sub*/

      //dispatch(LoadingController.setLoading({ loading: false }))
    } catch (error) {
      //Handle Error
      console.debug('Error-login: ', error)
      dispatch(LoadingController.setLoading({ loading: false }))
    }
  }
)

const logout = createAsyncThunk(
  `${name}/logout`,
  async (_, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState();
    let accessToken = state.authController.accessToken

    try {
      const res: any = await revoke(config, {
        tokenToRevoke: accessToken,
        sendClientId: true,
        includeBasicAuth: true
      })

      //console.debug(res)

      LocalStorage.getInstance().save(AUTH, null)

      dispatch(
        setAuth({
          accessToken: '',
          accessTokenExpirationDate: '',
          authorizeAdditionalParameters: null,
          idToken: '',
          refreshToken: null,
        })
      )

      dispatch(setContactLogout())
      dispatch(setGroupLogout())

      dispatch(LoadingController.setLoading({ loading: false }))
    } catch (error) {
      //Handle Error
      console.debug('Error-logout: ', error.response.data)

      dispatch(LoadingController.setLoading({ loading: false }))
    }
  }
)

const refreshToken = createAsyncThunk(
  `${name}/refreshToken`,
  async (_, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState();
    let refreshToken = state.authController.refreshToken

    //console.debug(refreshToken)
    //console.debug(state.authController)
    try {
      const res: any = await refresh(config, {
        refreshToken: refreshToken,
      })

      //console.debug(res)

      LocalStorage.getInstance().save(AUTH, res)
      dispatch(setAuth(res))
      dispatch(LoadingController.setLoading({ loading: false }))
    } catch (error) {
      //Handle Error
      console.debug('Error-refreshToken: ', error.response)
      LocalStorage.getInstance().save(AUTH, null)
      dispatch(setAuth({
        accessToken: '',
        accessTokenExpirationDate: '',
        authorizeAdditionalParameters: null,
        idToken: '',
        refreshToken: null,
      }))
      dispatch(LoadingController.setLoading({ loading: false }))
    }
  }
)

const {
  actions: { setAuth },
  reducer,
} = createSlice({
  name,
  initialState,
  reducers: {
    setAuth: (_, action: PayloadAction<State>) => action.payload
  },
});

export { reducer, login, setAuth, logout, refreshToken }
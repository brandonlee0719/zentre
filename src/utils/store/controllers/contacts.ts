import {
  createAsyncThunk,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit'
import base64 from 'base-64'

import { LoadingController } from './index'
import client from '../../client'

const SCHOOL_ID = '79AF1B80-1983-4CFB-B16A-3EAB3B1DE845'

interface State {
  contacts: Contact[] | null
  userInfo: UserInfo | null
  family: Relation[] | null
  address: UserAddress[] | null
}

const name = 'contacts';
const initialState: State = {
  contacts: null,
  userInfo: null,
  family: null,
  address: null
}

const createContact = createAsyncThunk(
  `${name}/createContact`,
  async (params: {
    CreateType: string,
    INBC: string,
    Birthday: string,
    FirstName: string,
    LastName: string,
    Status: string,
    Phone: string,
    Email: string,
    Sex: string,
    CountryBorn: string,
    Country: string,
    HeadPic: string
  }, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState();
    let accessToken = state.authController.accessToken;
    let idToken = state.authController.idToken;

    const id = idToken.split('.')[1];
    const userId = JSON.parse(base64.decode(id)).sub;

    try {
      let res = await client.post(
        '/CreateContact/',
        {
          SchoolID: SCHOOL_ID,
          CreateID: userId,
          INBC: params.INBC,
          CreateType: params.CreateType,
          Birthday: params.Birthday,
          FirstName: params.FirstName,
          LastName: params.LastName,
          Status: params.Status,
          Phone: params.Phone,
          Email: params.Email,
          Sex: params.Sex,
          CountryBorn: params.CountryBorn,
          Country: params.Country,
          HeadPic: params.HeadPic
        },
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )

      //console.debug(res.data)
      dispatch(LoadingController.setLoading({ loading: false }))
      let data = res.data
      if (data.Status === "Success") {
        dispatch(getContactList())
        return { text: data.Remark, success: true }
      } else {
        return { text: data.Remark, success: false }
      }
    } catch (error) {
      //Handle Error
      console.debug('Error-createContact: ', error.response?.data)
      console.debug('Error-createContact: ', error.response?.data?.errors)
      dispatch(LoadingController.setLoading({ loading: false }))
      return { text: '', success: false }
    }
  }
)

const uploadFile = createAsyncThunk(
  `${name}/uploadFile`,
  async (params: {
    uploadType?: 'photo' | 'file',
    file: string
  }, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState();
    let accessToken = state.authController.accessToken;
    let idToken = state.authController.idToken;

    const id = idToken.split('.')[1];
    const userId = JSON.parse(base64.decode(id)).sub;

    let formData = new FormData()
    formData.append('uploadType', params?.uploadType || 'photo')
    formData.append('CreateID', userId)

    formData.append('file', {
      uri: params.file,
      name: params.file.substring(params.file.lastIndexOf('/') + 1),
      type: 'image/jpeg',
    })

    try {
      let res = await client.post(
        '/UploadFile/',
        formData,
        {
          headers: {
            'content-type': 'multipart/form-data',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )

      dispatch(LoadingController.setLoading({ loading: false }))
      let data = res.data
      if (data.Status === 'Success') {
        return { text: JSON.parse(data.TipID)[0], success: true }
      } else {
        return { text: data.Remark, success: false }
      }
    } catch (error) {
      //Handle Error
      console.debug('Error-uploadFile: ', error.response)
      console.debug('Error-uploadFile: ', error.response?.data)
      dispatch(LoadingController.setLoading({ loading: false }))
      return { text: '', success: false }
    }
  }
)

const editContact = createAsyncThunk(
  `${name}/editContact`,
  async (params: {
    editedUser: string
    FirstName: string,
    LastName: string,
    Sex: string,
    Birthday: string,
    INBC: string,
    Email: string,
    Phone: string,
    CountryBorn: string,
    Country: string,
    HeadPic?: string
  }, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState()
    let accessToken = state.authController.accessToken
    let idToken = state.authController.idToken

    const id = idToken.split('.')[1]
    const userId = JSON.parse(base64.decode(id)).sub

    console.debug(params)
    try {
      let res = await client.post(
        '/EditContact/',
        {
          UserID: params.editedUser,
          CreateID: userId,
          INBC: params.INBC,
          Birthday: params.Birthday,
          FirstName: params.FirstName,
          LastName: params.LastName,
          Email: params.Email,
          Sex: params.Sex,
          Phone: params.Phone,
          CountryBorn: params.CountryBorn,
          Country: params.Country,
          HeadPic: params.HeadPic
        },
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )

      //console.debug(res.data)
      dispatch(LoadingController.setLoading({ loading: false }))
      let data = res.data
      if (data.Status === "Success") {
        dispatch(getUserInfo(params.editedUser))
        return { text: data.Remark, success: true }
      } else {
        return { text: data.Remark, success: false }
      }
    } catch (error) {
      //Handle Error
      console.debug('Error-editContact: ', error.response?.data)
      console.debug('Error-editContact: ', error.response?.data?.errors)
      dispatch(LoadingController.setLoading({ loading: false }))
      return { text: '', success: false }
    }
  }
)

const editContactFamily = createAsyncThunk(
  `${name}/editContactFamily`,
  async (params: {
    sUserId: string,
    tUserId: string,
    FirstName: string,
    LastName: string,
    Relationship: string,
    Phone: string,
    Email: string,
    HeadPic: string
  }, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState()
    let accessToken = state.authController.accessToken
    let idToken = state.authController.idToken

    const id = idToken.split('.')[1]
    const userId = JSON.parse(base64.decode(id)).sub

    //console.debug(params)
    try {
      let res = await client.post(
        '/EditContactFamily/',
        {
          UserID: params.sUserId,
          TUserID: params.tUserId,
          CreateID: userId,
          FirstName: params.FirstName,
          LastName: params.LastName,
          Relationship: params.Relationship,
          Phone: params.Phone,
          Email: params.Email,
          HeadPic: params.HeadPic
        },
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )

      console.debug(res.data)
      dispatch(LoadingController.setLoading({ loading: false }))
      let data = res.data
      if (data.Status === "Success") {
        dispatch(getFamilyList(params.sUserId))
        return { text: data.Remark, success: true }
      } else {
        return { text: data.Remark, success: false }
      }
    } catch (error) {
      //Handle Error
      console.debug('Error-editContactFamily: ', error.response?.data)
      console.debug('Error-editContactFamily: ', error.response?.data?.errors)
      dispatch(LoadingController.setLoading({ loading: false }))
      return { text: '', success: false }
    }
  }
)

const getContactList = createAsyncThunk(
  `${name}/getContactList`,
  async (_, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState()
    let accessToken = state.authController.accessToken
    let idToken = state.authController.idToken

    const id = idToken.split('.')[1]
    const userId = JSON.parse(base64.decode(id)).sub

    try {
      //1 = Active 2 = Suspended 3 = Graduated 4 = Withdraw/Resigned 10 = Trial
      let response = await client.get(
        `/GetAllContactList/${userId}/${"1,2,3,4,10"}`,
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )

      //console.debug(response.data.Remark)

      dispatch(setContacts(JSON.parse(response.data.Remark)))
      dispatch(LoadingController.setLoading({ loading: false }))
    } catch (error) {
      //Handle Error
      console.debug('getContactList: ', error.response)
      dispatch(LoadingController.setLoading({ loading: false }))
    }
  }
)

const getFamilyList = createAsyncThunk(
  `${name}/getFamilyList`,
  async (userId: string, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState()
    let accessToken = state.authController.accessToken

    try {
      //1 = Active 2 = Suspended 3 = Graduated 4 = Withdraw/Resigned 10 = Trial
      let response = await client.get(
        `/GetFamilyMemberList/${userId}/`,
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )

      //console.debug(response.data.Remark)

      dispatch(setFamily(JSON.parse(response.data.Remark)))
      dispatch(LoadingController.setLoading({ loading: false }))
    } catch (error) {
      //Handle Error
      console.debug('getFamilyList: ', error.response)
      dispatch(LoadingController.setLoading({ loading: false }))
    }
  }
)

const createContactFamily = createAsyncThunk(
  `${name}/createContactFamily`,
  async (params: {
    UserID: string,
    FirstName: string,
    LastName: string,
    Relationship: string,
    Email: string,
    HeadPic: string
  }, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState();
    let accessToken = state.authController.accessToken;
    let idToken = state.authController.idToken;

    const id = idToken.split('.')[1];
    const userId = JSON.parse(base64.decode(id)).sub;

    try {
      let res = await client.post(
        '/CreateContactFamily/',
        {
          UserID: params.UserID,
          CreateID: userId,
          FirstName: params.FirstName,
          LastName: params.LastName,
          Relationship: params.Relationship,
          Email: params.Email,
          HeadPic: params.HeadPic
        },
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )

      //dispatch(setContacts(JSON.parse(response.data.Remark)))
      dispatch(LoadingController.setLoading({ loading: false }))

      let data = res.data
      //console.debug(data)
      if (data.Status === "Success") {
        dispatch(getFamilyList(params.UserID))
        return { text: data.Remark, success: true }
      } else {
        return { text: data.Remark, success: false }
      }

    } catch (error) {
      //Handle Error
      console.debug('createContactFamily: ', error.response)
      dispatch(LoadingController.setLoading({ loading: false }))
      return { text: '', success: false }
    }
  }
)

const changeContactStatus = createAsyncThunk(
  `${name}/changeContactStatus`,
  async (params: {
    UserID: string,
    RoleBindingID: string,
    Status: string,
  }, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState();
    let accessToken = state.authController.accessToken;
    let idToken = state.authController.idToken;

    const id = idToken.split('.')[1];
    const userId = JSON.parse(base64.decode(id)).sub;

    try {
      let res = await client.post(
        '/ChangeContactStatus/',
        {
          UserID: params.UserID,
          CreateID: userId,
          RoleBindingID: params.RoleBindingID,
          Status: params.Status,
        },
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )

      //dispatch(setContacts(JSON.parse(response.data.Remark)))
      dispatch(LoadingController.setLoading({ loading: false }))

      let data = res.data
      //console.debug(data)
      if (data.Status === "Success") {
        dispatch(getContactList())
        return { text: data.Remark, success: true }
      } else {
        return { text: data.Remark, success: false }
      }

    } catch (error) {
      //Handle Error
      console.debug('createContactFamily: ', error.response)
      dispatch(LoadingController.setLoading({ loading: false }))
      return { text: '', success: false }
    }
  }
)

const getUserInfo = createAsyncThunk(
  `${name}/getUserInfo`,
  async (userId: string, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState()
    let accessToken = state.authController.accessToken
    let idToken = state.authController.idToken
    const id = idToken.split('.')[1]

    // const userId = JSON.parse(base64.decode(id)).sub


    //let idToken = state.authController.idToken

    //const id = idToken.split('.')[1]
    //const userId = JSON.parse(base64.decode(id)).sub

    try {
      let response = await client.get(
        `/GetUserInfo/${userId}/`,
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )

      //console.debug(response.data.Remark)
      dispatch(setUserInfo(JSON.parse(response.data.Remark)))
      dispatch(LoadingController.setLoading({ loading: false }))
    } catch (error) {
      //Handle Error
      console.debug('getUserInfo: ', error.response)
      dispatch(LoadingController.setLoading({ loading: false }))
    }
  }
)

const getContactAddressList = createAsyncThunk(
  `${name}/getContactAddressList`,
  async (userId: string, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState()
    let accessToken = state.authController.accessToken
    //let idToken = state.authController.idToken

    //const id = idToken.split('.')[1]
    //const userId = JSON.parse(base64.decode(id)).sub

    try {
      let response = await client.get(
        `/GetAddressList/${userId}/`,
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )

      //console.debug(response.data.Remark)
      dispatch(setAddress(JSON.parse(response.data.Remark)))
      dispatch(LoadingController.setLoading({ loading: false }))
    } catch (error) {
      //Handle Error
      console.debug('getContactAddressList: ', error.response)
      dispatch(LoadingController.setLoading({ loading: false }))
    }
  }
)

const createContactAddress = createAsyncThunk(
  `${name}/createContactAddress`,
  async (params: {
    UserID: string,
    CreateID: string,
    AddressType: string,
    HouseNo?: string,
    FloorNo?: string,
    UnitNo?: string,
    BuildName?: string,
    Street?: string,
    AddressCountry?: string,
    Province?: string,
    City?: string,
    PostalCode?: string
  }, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState()
    let accessToken = state.authController.accessToken
    let idToken = state.authController.idToken

    const id = idToken.split('.')[1]
    const userId = JSON.parse(base64.decode(id)).sub

    params.CreateID = userId

    try {

      let res = await client.post(
        '/CreateAddress/',
        [params],
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )

      //console.debug('createContactAddress')
      //console.debug(res.data)
      dispatch(LoadingController.setLoading({ loading: false }))
      let data = res.data
      if (data.Status === "Success") {
        dispatch(getContactAddressList(params.UserID))
        return { text: data.Remark, success: true }
      } else {
        return { text: data.Remark, success: false }
      }
    } catch (error) {
      //Handle Error
      console.debug('Error-createContactAddress: ', error.response?.data)
      console.debug('Error-createContactAddress: ', error.response?.data?.errors)
      dispatch(LoadingController.setLoading({ loading: false }))
      return { text: '', success: false }
    }
  }
)

const editContactAddress = createAsyncThunk(
  `${name}/editContactAddress`,
  async (params: {
    AddressID: string,
    UserID: string,
    CreateID: string,
    AddressType: string,
    HouseNo?: string,
    FloorNo?: string,
    UnitNo?: string,
    BuildName?: string,
    Street?: string,
    AddressCountry?: string,
    Province?: string,
    City?: string,
    PostalCode?: string
  }, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState()
    let accessToken = state.authController.accessToken
    let idToken = state.authController.idToken

    const id = idToken.split('.')[1]
    const userId = JSON.parse(base64.decode(id)).sub

    params.CreateID = userId

    try {

      let res = await client.post(
        '/EditAddress/',
        params,
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )

      //console.debug(res.data)
      dispatch(LoadingController.setLoading({ loading: false }))
      let data = res.data
      if (data.Status === "Success") {
        dispatch(getContactAddressList(params.UserID))
        return { text: data.Remark, success: true }
      } else {
        return { text: data.Remark, success: false }
      }
    } catch (error) {
      //Handle Error
      console.debug('Error-editContactAddress: ', error.response?.data)
      console.debug('Error-editContactAddress: ', error.response?.data?.errors)
      dispatch(LoadingController.setLoading({ loading: false }))
      return { text: '', success: false }
    }
  }
)

const deleteContactAddress = createAsyncThunk(
  `${name}/deleteContactAddress`,
  async (params: {
    addressId: string,
    userId: string
  }, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState()
    let accessToken = state.authController.accessToken
    let idToken = state.authController.idToken

    const id = idToken.split('.')[1]
    const userId = JSON.parse(base64.decode(id)).sub
    try {
      let res = await client.delete(
        '/DeleteAddress/',
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          data: {
            AddressIDListJson: [{ AddressID: params.addressId }],
            CreateID: userId
          },
        }
      )

      console.debug(res.data)
      dispatch(LoadingController.setLoading({ loading: false }))
      let data = res.data
      if (data.Status === "Success") {
        dispatch(getContactAddressList(params.userId))
        return { text: data.Remark, success: true }
      } else {
        return { text: data.Remark, success: false }
      }
    } catch (error) {
      //Handle Error
      console.debug('Error-deleteContactAddress: ', error.response?.data)
      console.debug('Error-deleteContactAddress: ', error.response?.data?.errors)
      dispatch(LoadingController.setLoading({ loading: false }))
      return { text: '', success: false }
    }
  }
)

const {
  actions: {
    setContacts,
    setUserInfo,
    setFamily,
    setAddress,
    setContactLogout
  },
  reducer,
} = createSlice({
  name,
  initialState,
  reducers: {
    setContacts: (state, action: PayloadAction<Contact[]>) => {
      let newState = Object.assign({}, state)
      newState.contacts = action.payload
      return newState
    },
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      let newState = Object.assign({}, state)
      newState.userInfo = action.payload
      return newState
    },
    setFamily: (state, action: PayloadAction<Relation[]>) => {
      let newState = Object.assign({}, state)
      newState.family = action.payload
      return newState
    },
    setAddress: (state, action: PayloadAction<UserAddress[]>) => {
      let newState = Object.assign({}, state)
      newState.address = action.payload
      return newState
    },
    setContactLogout: (state) => {
      let newState = Object.assign({}, state)
      newState.address = null
      newState.contacts = null
      newState.family = null
      newState.userInfo = null
      return newState
    },
  },
})

export {
  reducer,
  createContact,
  getContactList,
  getUserInfo,
  setUserInfo,
  getFamilyList,
  createContactFamily,
  setFamily,
  setAddress,
  editContact,
  editContactFamily,
  getContactAddressList,
  createContactAddress,
  deleteContactAddress,
  editContactAddress,
  changeContactStatus,
  uploadFile,
  setContactLogout
}
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  
} from '@reduxjs/toolkit'
import client from '../../client'
import { LoadingController } from './index'
import base64 from 'base-64'

const SCHOOL_ID = '79AF1B80-1983-4CFB-B16A-3EAB3B1DE845'

interface State {
  genders: Gender[] | null
  relationshipParent: Relationship[] | null //1=Parents，2=Siblings，3=Guardian => Ids
  relationshipSiblings: Relationship[] | null
  relationshipGuardian: Relationship[] | null
  countries: Country[] | null
  nationalities: Nationality[] | null
  addressTypes: AddressType[] | null
  countryOfAddress: CountryOfAddress[] | null
  levelListByUserID: Level[] | null
  levelListSchool: Level[] | null
  recipientsList: Contact[] | null,

  feedType: FeedType[] | null,

  FeedList:any|null

}

const name = 'appData';
let initialState: State = {
  genders: null,
  relationshipParent: null,
  relationshipSiblings: null,
  relationshipGuardian: null,
  countries: null,
  nationalities: null,
  addressTypes: null,
  countryOfAddress: null,
  levelListByUserID: null,
  levelListSchool: null,

  recipientsList:null,

  feedType:null,

  FeedList:null

}

const fetchAppData = createAsyncThunk(
  `${name}/fetchAppData`,
  async (params: string[], { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))
    try {
      let state: any = getState()

      //console.debug(params)
      for (let i = 0; i < params.length; ++i) {
        if (params[i] === 'genders') {
          let genders = state.appDataController.genders
          if (genders === null)
            await dispatch(getGenders())
        } else if (params[i] === 'parent') {

          let relationshipParent = state.appDataController.relationshipParent
          if (relationshipParent === null)
            await dispatch(getRelationships(1))

        } else if (params[i] === 'sibling') {

          let relationshipSiblings = state.appDataController.relationshipSiblings
          if (relationshipSiblings === null)
            await dispatch(getRelationships(2))

        } else if (params[i] === 'guardian') {

          let relationshipGuardian = state.appDataController.relationshipGuardian
          if (relationshipGuardian === null)
            await dispatch(getRelationships(3))

        } else if (params[i] === 'countries') {
          let countries = state.appDataController.countries
          if (countries === null)
            await dispatch(getCountries())
        } else if (params[i] === 'nationalities') {
          let nationalities = state.appDataController.nationalities
          if (nationalities === null)
            await dispatch(getNationalities())
        } else if (params[i] === 'addressTypes') {
          let addressTypes = state.appDataController.addressTypes
          if (addressTypes === null)
            await dispatch(getAddressTypes())
        } else if (params[i] === 'countryOfAddress') {
          let countryOfAddress = state.appDataController.countryOfAddress
          if (countryOfAddress === null)
            await dispatch(getCountryOfAddress())
        } else if (params[i] === 'allLevelByUserID') {
          let levelListByUserID = state.appDataController.levelListByUserID
          if (levelListByUserID === null)
            await dispatch(getAllLevelByUserID())
        } else if (params[i] === 'levelListSchool') {
          let levelListSchool = state.appDataController.levelListSchool
          if (levelListSchool === null)
            await dispatch(getLevelList())
        }else if (params[i] === 'recipientsList') {

          let levelListSchool = state.appDataController.recipientsList

          if (levelListSchool === null)

            await dispatch(GetRecipientsListByUserID())

        } else if (params[i] === 'feedType') {

          let levelListSchool = state.appDataController.feedType

          if (levelListSchool === null)

            await dispatch(GetFeedType())

        }
      }

      dispatch(LoadingController.setLoading({ loading: false }))
    } catch (error) {
      //Handle Error
      console.debug('Error-login: ', error)
      dispatch(LoadingController.setLoading({ loading: false }))
    }
  }
)

const getGenders = createAsyncThunk(
  `${name}/getGenders`,
  async (_, { dispatch, getState }) => {
    //dispatch(LoadingController.setLoading({ loading: true }))
    try {
      let state: any = getState()
      let accessToken = state.authController.accessToken

      let res = await client.get(
        '/GetGender',
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )

      console.warn('JSON.parse(res.data.Remark)',JSON.parse(res.data.Remark))
      dispatch(setGenders(JSON.parse(res.data.Remark)))
      //dispatch(LoadingController.setLoading({ loading: false }))
    } catch (error) {
      //Handle Error
      console.debug('Error-getGenders: ', error)
      //dispatch(LoadingController.setLoading({ loading: false }))
    }
  }
)

const getRelationships = createAsyncThunk(
  `${name}/getRelationships`,
  async (id: number, { dispatch, getState }) => {
    //dispatch(LoadingController.setLoading({ loading: true }))

    //1=Parents，2=Siblings，3=Guardian => Ids

    //console.debug('getRelationships: ', id)
    try {
      let state: any = getState()
      let accessToken = state.authController.accessToken

      let res = await client.get(
        `/GetRelationship/${id}`,
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )

      //console.debug(res.data.Remark)
      if (id === 1) {
        dispatch(setRelationShipParent(JSON.parse(res.data.Remark)))
      } else if (id === 2) {
        dispatch(setRelationShipSiblings(JSON.parse(res.data.Remark)))
      } else if (id === 3) {
        dispatch(setRelationShipGuardian(JSON.parse(res.data.Remark)))
      }
      //dispatch(LoadingController.setLoading({ loading: false }))
    } catch (error) {
      //Handle Error
      console.debug('Error-getRelationships: ', error)
      //dispatch(LoadingController.setLoading({ loading: false }))
    }
  }
)

const getCountries = createAsyncThunk(
  `${name}/getCountries`,
  async (_, { dispatch, getState }) => {
    //dispatch(LoadingController.setLoading({ loading: true }))

    try {
      let state: any = getState()
      let accessToken = state.authController.accessToken

      let res = await client.get(
        `/GetCountry/`,
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )

      console.warn('conttt',res.data.Remark)
      dispatch(setCountries(JSON.parse(res.data.Remark)))
      //dispatch(LoadingController.setLoading({ loading: false }))
    } catch (error) {
      //Handle Error
      console.debug('Error-getCountries: ', error)
      //dispatch(LoadingController.setLoading({ loading: false }))
    }
  }
)

const getNationalities = createAsyncThunk(
  `${name}/getNationalities`,
  async (_, { dispatch, getState }) => {
    //dispatch(LoadingController.setLoading({ loading: true }))

    try {
      let state: any = getState()
      let accessToken = state.authController.accessToken
      let idToken = state.authController.idToken;


      const id = idToken.split('.')[1];

      const userId = JSON.parse(base64.decode(id)).sub;


      let res = await client.get(
        `/GetNationality/`,
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )

      //console.debug(res.data.Remark)
      dispatch(setNationalities(JSON.parse(res.data.Remark)))
      //dispatch(LoadingController.setLoading({ loading: false }))
    } catch (error) {
      //Handle Error
      console.debug('Error-getNationalities: ', error)
      //dispatch(LoadingController.setLoading({ loading: false }))
    }
  }
)

const getAddressTypes = createAsyncThunk(
  `${name}/getAddressTypes`,
  async (_, { dispatch, getState }) => {
    //dispatch(LoadingController.setLoading({ loading: true }))

    try {
      let state: any = getState()
      let accessToken = state.authController.accessToken

      let res = await client.get(
        `/GetAddressType/`,
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )

      //console.debug(res.data.Remark)
      dispatch(setAddressTypes(JSON.parse(res.data.Remark)))
      //dispatch(LoadingController.setLoading({ loading: false }))
    } catch (error) {
      //Handle Error
      console.debug('Error-getAddressTypes: ', error)
      //dispatch(LoadingController.setLoading({ loading: false }))
    }
  }
)

const getCountryOfAddress = createAsyncThunk(
  `${name}/getCountryOfAddress`,
  async (_, { dispatch, getState }) => {
    //dispatch(LoadingController.setLoading({ loading: true }))

    try {
      let state: any = getState()
      let accessToken = state.authController.accessToken

      let res = await client.get(
        `/GetCountryOfAddress/`,
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )

      //console.debug(res.data.Remark)
      dispatch(setCountryOfAddress(JSON.parse(res.data.Remark)))
      //dispatch(LoadingController.setLoading({ loading: false }))
    } catch (error) {
      //Handle Error
      console.debug('Error-getCountryOfAddress: ', error)
      //dispatch(LoadingController.setLoading({ loading: false }))
    }
  }
)

const getProvince = createAsyncThunk(
  `${name}/getProvince`,
  async (countryCode: string, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    try {
      let state: any = getState()
      let accessToken = state.authController.accessToken

      let res = await client.get(
        `/GetProvince/${countryCode}`,
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )

      //console.debug(res.data.Remark)
      dispatch(LoadingController.setLoading({ loading: false }))

      return JSON.parse(res.data.Remark)
    } catch (error) {
      //Handle Error
      console.debug('Error-getProvince: ', error)
      dispatch(LoadingController.setLoading({ loading: false }))

      return false
    }
  }
)

const getCity = createAsyncThunk(
  `${name}/getCity`,
  async (provinceId: string, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    try {
      let state: any = getState()
      let accessToken = state.authController.accessToken

      let res = await client.get(
        `/GetCity/${provinceId}`,
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )

      //console.debug(res.data.Remark)
      dispatch(LoadingController.setLoading({ loading: false }))

      return JSON.parse(res.data.Remark)
    } catch (error) {
      //Handle Error
      console.debug('Error-getCity: ', error)
      dispatch(LoadingController.setLoading({ loading: false }))

      return false
    }
  }
)

const getLevelList = createAsyncThunk(
  `${name}/getLevelList`,
  async (_, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    //console.debug('getLevelList: --- HERE')

    try {
      let state: any = getState()
      let accessToken = state.authController.accessToken

      let res = await client.get(
        `/GetLevelList/${SCHOOL_ID}`,
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )

      //console.debug(res.data)
      dispatch(setLevelListSchool(JSON.parse(res.data.Remark)))
      dispatch(LoadingController.setLoading({ loading: false }))
    } catch (error) {
      //Handle Error
      console.debug('Error-getLevelList: ', error)
      dispatch(LoadingController.setLoading({ loading: false }))

      return false
    }
  }
)

const getAllLevelByUserID = createAsyncThunk(
  `${name}/getAllLevelByUserID`,
  async (_, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    //console.debug('getAllLevelByUserID: --- HERE')

    try {
      let state: any = getState()
      let accessToken = state.authController.accessToken
      let idToken = state.authController.idToken;

      const id = idToken.split('.')[1];
      const userId = JSON.parse(base64.decode(id)).sub;

      let res = await client.get(
        `/GetAllLevelByUserID/${userId}`,
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )

      //console.debug(res.data)
      dispatch(setLevelListByUserID(JSON.parse(res.data.Remark)))
      dispatch(LoadingController.setLoading({ loading: false }))
      //return JSON.parse(res.data.Remark)
    } catch (error) {
      //Handle Error
      console.debug('Error-getAllLevelByUserID: ', error)
      dispatch(LoadingController.setLoading({ loading: false }))
    }
  }
)
const CreateFeed = createAsyncThunk(

  `${name}/CreateFeed`,

  async (data:{}, { dispatch, getState }) => {

    dispatch(LoadingController.setLoading({ loading: true }))


    //console.debug('getAllLevelByUserID: --- HERE')


    try {

      let state: any = getState()

      let accessToken = state.authController.accessToken

      let idToken = state.authController.idToken;


      const id = idToken.split('.')[1];

      data.SchoolID ='79af1b80-1983-4cfb-b16a-3eab3b1de845'

      data.FromPuserID ='79af1b80-1983-4cfb-b16a-3eab3b1de845'

      data.CreateID =JSON.parse(base64.decode(id)).sub

      let res = await client.post(

        `/CreateFeed`,data,{

          headers: {

            'content-type': 'application/json',

            'Authorization': `Bearer ${accessToken}`

          }

        }

      )


      dispatch(LoadingController.setLoading({ loading: false }))

      return (res.data)

    } catch (error) {

      //Handle Error

      console.debug('Error-getAllLevelByUserID: ', error)

      dispatch(LoadingController.setLoading({ loading: false }))

      return false

    }

  }

)


const GetFeedType = createAsyncThunk(

  `${name}/GetFeedType`,

  async (_, { dispatch, getState }) => {

    //dispatch(LoadingController.setLoading({ loading: true }))


    //1=Parents，2=Siblings，3=Guardian => Ids


    //console.debug('getRelationships: ', id)

    try {

      let state: any = getState()

      let accessToken = state.authController.accessToken

      let idToken = state.authController.idToken;

      const id = idToken.split('.')[1];

      const userId = JSON.parse(base64.decode(id)).sub;

      console.log( JSON.parse(base64.decode(id)))

      console.log( JSON.parse(base64.decode( idToken.split('.')[0])))

      let res = await client.get(

        `/GetFeedType`,

        {

          headers: {

            'content-type': 'application/json',

            'Authorization': `Bearer ${accessToken}`

          },

        }

      )


      //console.debug(res.data.Remark)

      dispatch(setFeedType(JSON.parse(res.data.Remark)))

    } catch (error) {

      //Handle Error

      console.debug('Error-getRelationships: ', error)

      //dispatch(LoadingController.setLoading({ loading: false }))

    }

  }

)


const GetRecipientsListByUserID = createAsyncThunk(

  `${name}/GetRecipientsListByUserID/`,

  async (_, { dispatch, getState }) => {

    try {

      let state: any = getState()

      let accessToken = state.authController.accessToken

      let idToken = state.authController.idToken;

      const id = idToken.split('.')[1];

      const userId = JSON.parse(base64.decode(id)).sub;

      console.log(userId)


      let res = await client.get(

        `/GetRecipientsListByUserID/${userId}`,

        {

          headers: {

            'content-type': 'application/json',

            'Authorization': `Bearer ${accessToken}`

          },

        }

      )

      dispatch(setRecipientsListByUserID(JSON.parse(res.data.Remark)))

    } catch (error) {

      //Handle Error

      console.debug('Error-getRelationships: ', error)

      //dispatch(LoadingController.setLoading({ loading: false }))

    }

  }

)


const GetFeedList = createAsyncThunk(

  `${name}/GetFeedList/`,

  async (_, { dispatch, getState }) => {

    try {

      let state: any = getState()

      let accessToken = state.authController.accessToken

      let idToken = state.authController.idToken;

      const id = idToken.split('.')[1];

      const userId = JSON.parse(base64.decode(id)).sub;

      console.log(userId)


      let res = await client.get(

        `/GetFeedList/${userId}`,

        {

          headers: {

            'content-type': 'application/json',

            'Authorization': `Bearer ${accessToken}`

          },

        }

      )

      console.log(JSON.parse(res.data.Remark))

      // return JSON.parse(res.data.Remark)

      dispatch(setFeedList(JSON.parse(res.data.Remark)))

    } catch (error) {

      //Handle Error

      console.debug('Feild Error----------------------------------------: ', error)

      //dispatch(LoadingController.setLoading({ loading: false }))

    }

  }

)

const FeedAddLike = createAsyncThunk(

  `${name}/FeedAddLike/`,

  async (BaseID, { dispatch, getState }) => {

    try {

      let state: any = getState()

      let accessToken = state.authController.accessToken

      let idToken = state.authController.idToken;

      const id = idToken.split('.')[1];

      const userId = JSON.parse(base64.decode(id)).sub;

      let data = {}

      data.CreateID = userId;

      data.BaseID = BaseID

      let res = await client.post(

        `/FeedAddLike/`, data,

        {

          headers: {

            'content-type': 'application/json',

            'Authorization': `Bearer ${accessToken}`

          },

        }

      )

      return JSON.parse(res.data)

    } catch (error) {

      //Handle Error

      console.debug('Feild Error----------------------------------------: ', error)

      //dispatch(LoadingController.setLoading({ loading: false }))

    }

  }

)


const {
  actions: {
    setGenders,
    setRelationShipParent,
    setRelationShipSiblings,
    setRelationShipGuardian,
    setCountries,
    setNationalities,
    setAddressTypes,
    setCountryOfAddress,
    setLevelListByUserID,
    setLevelListSchool,
    setRecipientsListByUserID,

    setFeedType,

    setFeedList

  },
  reducer,
} = createSlice({
  name,
  initialState,
  reducers: {
    setGenders: (state, action: PayloadAction<Gender[]>) => {
      let newState = Object.assign({}, state)
      newState.genders = action.payload
      return newState
    },
    setRelationShipParent: (state, action: PayloadAction<Relationship[]>) => {
      let newState = Object.assign({}, state)
      newState.relationshipParent = action.payload
      return newState
    },
    setRelationShipSiblings: (state, action: PayloadAction<Relationship[]>) => {
      let newState = Object.assign({}, state)
      newState.relationshipSiblings = action.payload
      return newState
    },
    setRelationShipGuardian: (state, action: PayloadAction<Relationship[]>) => {
      let newState = Object.assign({}, state)
      newState.relationshipGuardian = action.payload
      return newState
    },
    setCountries: (state, action: PayloadAction<Country[]>) => {
      let newState = Object.assign({}, state)
      newState.countries = action.payload
      return newState
    },
    setNationalities: (state, action: PayloadAction<Nationality[]>) => {
      let newState = Object.assign({}, state)
      newState.nationalities = action.payload
      return newState
    },
    setAddressTypes: (state, action: PayloadAction<AddressType[]>) => {
      let newState = Object.assign({}, state)
      newState.addressTypes = action.payload
      return newState
    },
    setCountryOfAddress: (state, action: PayloadAction<CountryOfAddress[]>) => {
      let newState = Object.assign({}, state)
      newState.countryOfAddress = action.payload
      return newState
    },
    setLevelListByUserID: (state, action: PayloadAction<Level[]>) => {
      let newState = Object.assign({}, state)
      newState.levelListByUserID = action.payload
      return newState
    },
    setLevelListSchool: (state, action: PayloadAction<Level[]>) => {
      let newState = Object.assign({}, state)
      newState.levelListSchool = action.payload
      return newState
    },
    setRecipientsListByUserID: (state, action: PayloadAction<Contact[]>) => {

      let newState = Object.assign({}, state)

      newState.recipientsList = action.payload

      return newState

    },

    setFeedType: (state, action: PayloadAction<FeedType[]>) => {

      let newState = Object.assign({}, state)

      newState.feedType = action.payload

      return newState

    },

    setFeedList: (state, action: any) => {

      let newState = Object.assign({}, state)

      newState.FeedList = action.payload

      return newState

    },

  },
})

export {
  reducer,
  fetchAppData,
  getGenders,
  getRelationships,
  getCountries,
  getNationalities,
  getAddressTypes,
  getCountryOfAddress,
  getProvince,
  getCity,
  getLevelList,
  getAllLevelByUserID,
  GetRecipientsListByUserID,
  CreateFeed,
  GetFeedList,
  FeedAddLike

}
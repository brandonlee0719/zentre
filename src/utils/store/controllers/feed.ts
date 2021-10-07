import {
  createAsyncThunk,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit'
import base64 from 'base-64'
import axios from 'axios'

import { LoadingController } from './index'


const SCHOOL_ID = '79AF1B80-1983-4CFB-B16A-3EAB3B1DE845'

interface State {

}

const name = 'feed';
const initialState: State = {

}




const getFeedCapacityByUser = createAsyncThunk(
  `${name}/getFeedCapacityByUser`,
  async (params: {
  }, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState()
    let accessToken = state.authController.accessToken
    let idToken = state.authController.idToken;

    const id = idToken.split('.')[1];
    const userId = JSON.parse(base64.decode(id)).sub;
    try {
      let response = await axios.get(
        `https://contacts.ichild.com.sg/api/v1.0/SchoolManagement/GetFeedUsedCapacity/${userId}`,
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )
      // dispatch(setCategories(JSON.parse(response.data.Remark)))

      dispatch(LoadingController.setLoading({ loading: false }))
      return JSON.parse(response.data.Remark)
    } catch (error) {
      //Handle Error
      dispatch(LoadingController.setLoading({ loading: false }))
      return false
    }
  }
)


const clearFeedCapacityByUser = createAsyncThunk(
  `${name}/clearFeedCapacityByUser`,
  async (params: {
    YearMonth: any
  }, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState()
    let accessToken = state.authController.accessToken
    let idToken = state.authController.idToken;

    const id = idToken.split('.')[1];
    const userId = JSON.parse(base64.decode(id)).sub;
    try {
      let response = await axios.post(
        `https://contacts.ichild.com.sg/api/v1.0/SchoolManagement/ClearFeed`,
        {
          'YearMonth': params.YearMonth,
          'CreateID': userId,
        },
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )
      // dispatch(setCategories(JSON.parse(response.data.Remark)))

      dispatch(LoadingController.setLoading({ loading: false }))
      return JSON.parse(response.data.Status)
    } catch (error) {
      //Handle Error
      dispatch(LoadingController.setLoading({ loading: false }))
      return false
    }
  }
)


function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


const {
  actions: {

  },
  reducer,
} = createSlice({
  name,
  initialState,
  reducers: {

  },
})

export {
  reducer,
  getFeedCapacityByUser,
  clearFeedCapacityByUser
}
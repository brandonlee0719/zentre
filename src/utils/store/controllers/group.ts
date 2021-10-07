import {
  createAsyncThunk,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit'
import base64 from 'base-64'

import { LoadingController, AppDataController } from './index'
import client, { generateUrl } from '../../client'
import axios from 'axios'

const SCHOOL_ID = '79AF1B80-1983-4CFB-B16A-3EAB3B1DE845'

interface State {
  groups: Group[] | null
}

const name = 'group';
const initialState: State = {
  groups: null
}

const getSchoolMemberList = createAsyncThunk(
  `${name}/getSchoolMemberList`,
  async (_, { dispatch, getState }): Promise<any> => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState()
    let accessToken = state.authController.accessToken

    try {
      //1 = Active 2 = Suspended 3 = Graduated 4 = Withdraw/Resigned 10 = Trial
      let response = await client.get(
        `/GetSchoolMemberList/${SCHOOL_ID}/${"1"}`,
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )

      //console.debug(response.data.Remark)
      let members: UserInfo[] = JSON.parse(response.data.Remark)
      dispatch(LoadingController.setLoading({ loading: false }))
      return members
    } catch (error) {
      //Handle Error
      console.debug('getSchoolMemberList: ', error.response)
      dispatch(LoadingController.setLoading({ loading: false }))
      return false
    }
  }
)

const getSchoolStaffList = createAsyncThunk(
  `${name}/getSchoolStaffList`,
  async (_, { dispatch, getState }): Promise<any> => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState()
    let accessToken = state.authController.accessToken

    try {
      //1 = Active 2 = Suspended 3 = Graduated 4 = Withdraw/Resigned 10 = Trial
      let response = await client.get(
        `/GetSchoolStaffList/${SCHOOL_ID}/${"1"}`,
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )

      //console.debug(response.data.Remark)
      let staffs: UserInfo[] = JSON.parse(response.data.Remark)
      dispatch(LoadingController.setLoading({ loading: false }))
      return staffs
    } catch (error) {
      //Handle Error
      console.debug('getSchoolStaffList: ', error.response)
      dispatch(LoadingController.setLoading({ loading: false }))
      return false
    }
  }
)

const getSchoolClassList = createAsyncThunk(
  `${name}/getSchoolClassList`,
  async (_, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState()
    let accessToken = state.authController.accessToken

    try {
      //1 = Active 5 = Deleted "1,5" 
      let response = await client.get(
        `/GetClassList/${SCHOOL_ID}/${"1"}`,
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )

      //console.debug('getSchoolClassList')
      //console.debug(JSON.parse(response.data.Remark))
      dispatch(setGroups(JSON.parse(response.data.Remark)))
      dispatch(LoadingController.setLoading({ loading: false }))
    } catch (error) {
      //Handle Error
      console.debug('getSchoolClassList: ', error.response)
      dispatch(LoadingController.setLoading({ loading: false }))
    }
  }
)

const getClassMemberList = createAsyncThunk(
  `${name}/getClassMemberList`,
  async (classId: string, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState()
    let accessToken = state.authController.accessToken

    try {
      //1 = Active 2 = Suspended 3 = Graduated 4 = Withdraw/Resigned 10 = Trial
      let response = await client.get(
        `/GetClassMemberList/${classId}/${"1"}`,
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )

      //console.debug(JSON.parse(response.data.Remark))
      dispatch(LoadingController.setLoading({ loading: false }))
      return JSON.parse(response.data.Remark)
    } catch (error) {
      //Handle Error
      console.debug('getClassMemberList: ', error.response)
      dispatch(LoadingController.setLoading({ loading: false }))
      return false
    }
  }
)

const getClassStaffList = createAsyncThunk(
  `${name}/getClassStaffList`,
  async (classId: string, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState()
    let accessToken = state.authController.accessToken

    try {
      //1 = Active 2 = Suspended 3 = Graduated 4 = Withdraw/Resigned 10 = Trial
      let response = await client.get(
        `/GetClassStaffList/${classId}/${"1"}`,
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )

      //console.debug(JSON.parse(response.data.Remark))
      dispatch(LoadingController.setLoading({ loading: false }))
      return JSON.parse(response.data.Remark)
    } catch (error) {
      //Handle Error
      console.debug('getClassStaffList: ', error.response)
      dispatch(LoadingController.setLoading({ loading: false }))
      return false
    }
  }
)

const getClass = createAsyncThunk(
  `${name}/getClass`,
  async (classId: string, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState()
    let accessToken = state.authController.accessToken

    try {
      let response = await client.get(
        `/GetClass/${classId}`,
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )

      //console.debug(JSON.parse(response.data.Remark))
      dispatch(LoadingController.setLoading({ loading: false }))
      return JSON.parse(response.data.Remark)
    } catch (error) {
      //Handle Error
      console.debug('getClass: ', error.response)
      dispatch(LoadingController.setLoading({ loading: false }))
      return false
    }
  }
)

const createLevel = createAsyncThunk(
  `${name}/createLevel`,
  async (name: string, { dispatch, getState }): Promise<any> => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState()
    let accessToken = state.authController.accessToken
    let idToken = state.authController.idToken

    const id = idToken.split('.')[1]
    const userId = JSON.parse(base64.decode(id)).sub

    try {
      let res = await client.post(
        '/CreateLevel/',
        {
          SchoolID: SCHOOL_ID,
          CreateID: userId,
          LevelName: name,
        },
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )

      //console.debug(res.data)
      if (res.data.Status === "Success") {

        await dispatch(AppDataController.getAllLevelByUserID())
        dispatch(LoadingController.setLoading({ loading: false }))
        return true
      } else {

        dispatch(LoadingController.setLoading({ loading: false }))
        return false
      }
    } catch (error) {
      //Handle Error
      console.debug('createLevel: ', error.response)
      dispatch(LoadingController.setLoading({ loading: false }))
      return false
    }
  }
)

const createGroup = createAsyncThunk(
  `${name}/createGroup`,
  async (params: {
    ClassName: string
    SchLevID: string
    //TeacherListJson: { UserID: string }[]
    //MemberListJson: { UserID: string }[]
  }, { dispatch, getState }): Promise<any> => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState()
    let accessToken = state.authController.accessToken
    let idToken = state.authController.idToken

    const id = idToken.split('.')[1]
    const userId = JSON.parse(base64.decode(id)).sub

    try {
      let res = await client.post(
        '/CreateClass/',
        {
          ClassName: params.ClassName,
          SchLevID: params.SchLevID,
          CreateID: userId,
          //TeacherListJson: params.TeacherListJson,
          //MemberListJson: params.MemberListJson
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
      if (res.data.Status === "Success") {
        console.debug('ClassID: ', res.data.TipID)
        await dispatch(getSchoolClassList())
        return res.data.TipID
      } else {
        return false
      }
    } catch (error) {
      //Handle Error
      console.debug('createGroup: ', error.response)
      dispatch(LoadingController.setLoading({ loading: false }))
      return false
    }
  }
)

const editGroup = createAsyncThunk(
  `${name}/editGroup`,
  async (params: {
    ClassID: string
    ClassName: string
    SchLevID: string
  }, { dispatch, getState }): Promise<any> => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState()
    let accessToken = state.authController.accessToken
    let idToken = state.authController.idToken

    const id = idToken.split('.')[1]
    const userId = JSON.parse(base64.decode(id)).sub

    try {
      let res = await client.post(
        '/EditClass/',
        {
          ClassID: params.ClassID,
          ClassName: params.ClassName,
          SchLevID: params.SchLevID,
          CreateID: userId,
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
      if (res.data.Status === "Success") {
        await dispatch(getSchoolClassList())
        return true
      } else {
        return false
      }
    } catch (error) {
      //Handle Error
      console.debug('editGroup: ', error.response)
      dispatch(LoadingController.setLoading({ loading: false }))
      return false
    }
  }
)

const joinGroup = createAsyncThunk(
  `${name}/joinGroup`,
  async (list: {
    UserID: string
    RoleBindingID: string
  }[],
    { dispatch, getState }): Promise<any> => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState()
    let accessToken = state.authController.accessToken
    let idToken = state.authController.idToken

    const id = idToken.split('.')[1]
    const userId = JSON.parse(base64.decode(id)).sub

    try {
      let res = await client.post(
        '/JoinGroup/',
        {
          JoinGroupListJson: list,
          CreateID: userId,
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
      if (res.data.Status === "Success") {
        await dispatch(getSchoolClassList())
        return true
      } else {
        return false
      }
    } catch (error) {
      //Handle Error
      console.debug('joinGroup: ', error.response)
      dispatch(LoadingController.setLoading({ loading: false }))
      return false
    }
  }
)

const leaveGroup = createAsyncThunk(
  `${name}/leaveGroup`,
  async (list: {
    UserID: string
    RoleBindingID: string
  }[],
    { dispatch, getState }): Promise<any> => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState()
    let accessToken = state.authController.accessToken
    let idToken = state.authController.idToken

    const id = idToken.split('.')[1]
    const userId = JSON.parse(base64.decode(id)).sub

    try {
      let res = await client.post(
        '/LeaveGroup/',
        {
          LeaveGroupListJson: list,
          CreateID: userId,
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
      if (res.data.Status === "Success") {
        await dispatch(getSchoolClassList())
        return true
      } else {
        return false
      }
    } catch (error) {
      //Handle Error
      console.debug('leaveGroup: ', error.response)
      dispatch(LoadingController.setLoading({ loading: false }))
      return false
    }
  }
)

const deleteGroup = createAsyncThunk(
  `${name}/deleteGroup`,
  async (classIDListJson: any, { dispatch, getState }): Promise<any> => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState()
    let accessToken = state.authController.accessToken
    let idToken = state.authController.idToken

    const id = idToken.split('.')[1]
    const userId = JSON.parse(base64.decode(id)).sub
    try {
      let res = await client.delete(
        '/DeleteClass/',
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          data: {
            ClassIDListJson: classIDListJson,
            CreateID: userId
          },
        }
      )

      console.debug(res.data)
      dispatch(LoadingController.setLoading({ loading: false }))
      if (res.data.Status === "Success") {
        await dispatch(getSchoolClassList())
        return true
      } else {
        return false
      }
    } catch (error) {
      //Handle Error
      console.debug('deleteGroup: ', error.response)
      dispatch(LoadingController.setLoading({ loading: false }))
      return false
    }
  }
)

const {
  actions: {
    setGroups,
    setGroupLogout
  },
  reducer,
} = createSlice({
  name,
  initialState,
  reducers: {
    setGroups: (state, action: PayloadAction<Group[]>) => {
      let newState = Object.assign({}, state)
      newState.groups = action.payload
      return newState
    },
    setGroupLogout: (state) => {
      let newState = Object.assign({}, state)
      newState.groups = null
      return newState
    },
  },
});

export {
  reducer,
  getSchoolMemberList,
  getSchoolStaffList,
  createLevel,
  createGroup,
  getSchoolClassList,
  getClassMemberList,
  getClassStaffList,
  deleteGroup,
  editGroup,
  joinGroup,
  leaveGroup,
  getClass,
  setGroupLogout
}
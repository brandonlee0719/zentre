import {
  createAsyncThunk,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit'
import base64 from 'base-64'
import axios from 'axios'

import { LoadingController } from './index'

const client = axios.create({
  baseURL: 'https://SGPAY.xsecurepay.com/V1/Fee',
  headers: { 'content-type': 'application/json' },
})


const SCHOOL_ID = '79AF1B80-1983-4CFB-B16A-3EAB3B1DE845'

interface State {
  categories: any,
  categoryItems: any,
  subsidiesItems: any,
}

const name = 'fees';
const initialState: State = {
  categories: null,
  categoryItems: null,
  subsidiesItems: null,
}

const createSupply = createAsyncThunk(
  `${name}/createSupply`,
  async (params: {

  }, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState();
    let accessToken = state.authController.accessToken;

    //console.debug('Creat-In-Supply')
    //console.debug(accessToken)

    try {
      let res = await axios.post(
        'https://SGPAY.xsecurepay.com/V1/Fee/CreateSupply',
        {

        },
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )

      console.debug(res.data)
      let data = res.data;
      if (data.Code === "201") {
        dispatch(LoadingController.setLoading({ loading: false }))
        return { text: data.Remark, success: true }
      } else {
        dispatch(LoadingController.setLoading({ loading: false }))
        return { text: data.Remark, success: false }
      }
    } catch (error) {
      //Handle Error
      dispatch(LoadingController.setLoading({ loading: false }))
    }
  }
)


const getCreateCategory = createAsyncThunk(
  `${name}/getCategory`,
  async (params: {
    CategoryType: string,
  }, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState()
    let accessToken = state.authController.accessToken
    let idToken = state.authController.idToken;

    const id = idToken.split('.')[1];
    const userId = JSON.parse(base64.decode(id)).sub;
    try {
      //1 = Active 2 = Suspended 3 = Graduated 4 = Withdraw/Resigned 10 = Trial
      let response = await axios.post(
        `https://SGPAY.xsecurepay.com/V1/Fee/GetCateGorys`,
        {
          UsedFor: "FeeCateGory",
          CategoryType: params.CategoryType,
          CurrentID: userId
        },
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )
      dispatch(setCategories(JSON.parse(response.data.Remark)))
      dispatch(LoadingController.setLoading({ loading: false }))
      return JSON.parse(response.data.Remark)
    } catch (error) {
      //Handle Error
      dispatch(LoadingController.setLoading({ loading: false }))
      return false
    }
  }
)

const createCategory = createAsyncThunk(
  `${name}/createCategory`,
  async (params: {
    Name: string,
    CategoryType: any
  }, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState();
    let accessToken = state.authController.accessToken;

    let idToken = state.authController.idToken;

    const id = idToken.split('.')[1];
    const userId = JSON.parse(base64.decode(id)).sub;

    let categoryId = uuidv4()
    try {
      let res = await axios.post(
        'https://SGPAY.xsecurepay.com/V1/Fee/CreateCategory',
        {
          CategoryID: categoryId,
          UsedFor: "FeeCateGory",
          CategoryType: params.CategoryType,
          Title: params.Name,
          CategoryBindingID: uuidv4(),
          Root_ID: categoryId,
          Node_ID: categoryId,
          CurrentID: userId
        },
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )

      dispatch(LoadingController.setLoading({ loading: false }))
      let data = res.data;
      if (data.Code === "201") {
        return { text: data.Remark, success: true }
      } else {
        return { text: data.Remark, success: false }
      }
    } catch (error) {
      //Handle Error
      dispatch(LoadingController.setLoading({ loading: false }))
    }
  }
)

const updateCategory = createAsyncThunk(
  `${name}/updateCategory`,
  async (params: {
    Name: string,
    categoryId: string,
    CategoryBindingID: string,
    OperType: string
  }, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState();
    let accessToken = state.authController.accessToken;
    let idToken = state.authController.idToken;
    const id = idToken.split('.')[1];
    const userId = JSON.parse(base64.decode(id)).sub;

    try {
      console.debug('Error-createCategory: ', params)

      let res = await axios.post(
        'https://SGPAY.xsecurepay.com/V1/Fee/OperCateGory',
        {
          CategoryID: params.categoryId,
          OperType: params.OperType,
          Title: params.Name,
          CurrentID: userId,
          UsedFor: "FeeCateGory",
          CategoryType: 11000000,
          CategoryBindingID: params.CategoryBindingID,
          Root_ID: params.categoryId,
          Node_ID: params.categoryId,
        },
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )

      dispatch(LoadingController.setLoading({ loading: false }))
      let data = res.data;
      console.debug('Error-createCategory: ', data)
      if (data.Code === "201") {
        return { text: data.Remark, success: true }
      } else {
        return { text: data.Remark, success: false }
      }
    } catch (error) {
      //Handle Error
      dispatch(LoadingController.setLoading({ loading: false }))
    }
  }
)

const createGoods = createAsyncThunk(
  `${name}/createGoods`,
  async (params: {
    Name: string,
    Description: string,
    CategoryBindingID: string | null,
    IsTaxIncluded: boolean,
    Tate: string,
    UnitPrice: number,
    Tate_Type: number

  }, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState();
    let accessToken = state.authController.accessToken;

    let Id = uuidv4()
    let Id2 = uuidv4()
    let Id3 = uuidv4()
    try {
      let res = await axios.post(
        'https://SGPAY.xsecurepay.com/V1/Fee/CreateGoods',
        {
          ID: Id,
          Goods_Description: params.Description,
          Goods_Titile: params.Name,
          Purchashs: [{
            ID: Id2,
            GoodsID: Id,
            Goods_CategoryBindingID: params.CategoryBindingID,
            AccountInfoID: SCHOOL_ID,
            UnitPrice: params.UnitPrice,
            Tate_Type: params.Tate_Type,
            Tate: params.Tate,
            IsTaxIncluded: params.IsTaxIncluded
          }],
          Sales: [{
            ID: Id3,
            GoodsID: Id,
            Goods_Titile: params.Name,
            Goods_Description: params.Description,
            Sale_CategoryBindingID: params.CategoryBindingID,
            AccountInfoID: SCHOOL_ID,
            UnitPrice: params.UnitPrice,
            Tate: params.Tate,
            Tate_Type: params.Tate_Type,
            IsTaxIncluded: params.IsTaxIncluded
          }]
        },
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )
      // console.debug('goods request',res)
      console.debug(res.data)
      dispatch(LoadingController.setLoading({ loading: false }))
      let data = res.data;
      if (data.Code === "201") {
        return { text: data.Remark, success: true }
      } else {
        return { text: data.Remark, success: false }
      }
    } catch (error) {
      //Handle Error
      dispatch(LoadingController.setLoading({ loading: false }))
    }
  }
)

const getGoodsSales = createAsyncThunk(
  `${name}/getGoodsSales`,
  async (params: {
    body: any,
    Subsidies: boolean
  }, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState()
    let accessToken = state.authController.accessToken
    let idToken = state.authController.idToken;

    const id = idToken.split('.')[1];
    const userId = JSON.parse(base64.decode(id)).sub;
    try {

      //1 = Active 2 = Suspended 3 = Graduated 4 = Withdraw/Resigned 10 = Trial
      let response = await axios.post(
        `https://SGPAY.xsecurepay.com/V1/Fee/GetSales`,
        params.body,
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )
      if (params.Subsidies) {
        dispatch(setSubsidiesItems(JSON.parse(response.data.Remark)))
      } else {
        dispatch(setCategoryItems(JSON.parse(response.data.Remark)))
      }
      dispatch(LoadingController.setLoading({ loading: false }))
      return JSON.parse(response.data.Remark)
    } catch (error) {
      //Handle Error
      console.warn('error', error);
      dispatch(LoadingController.setLoading({ loading: false }))
      return false
    }
  }
)


const updateGoodsSales = createAsyncThunk(
  `${name}/updateGoodsSales`,
  async (params: {
    Sales: string,
  }, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState()
    let accessToken = state.authController.accessToken
    let idToken = state.authController.idToken;

    const id = idToken.split('.')[1];
    const userId = JSON.parse(base64.decode(id)).sub;
    try {
      console.warn('params.Sales', params.Sales)
      //1 = Active 2 = Suspended 3 = Graduated 4 = Withdraw/Resigned 10 = Trial
      let response = await axios.post(
        `https://SGPAY.xsecurepay.com/V1/Fee/OperSales`,
        {
          "Sales": params.Sales
        },
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )
      console.warn('JSON.parse(response.data.Remark)', response);
      dispatch(LoadingController.setLoading({ loading: false }))
      // return JSON.parse(response.data.Remark)
    } catch (error) {
      //Handle Error
      console.warn('error', error);
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
    setCategories,
    setCategoryItems,
    setSubsidiesItems
  },
  reducer,
} = createSlice({
  name,
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Group[]>) => {
      let newState = Object.assign({}, state)
      newState.categories = action.payload
      return newState
    },
    setCategoryItems: (state, action: PayloadAction<Group[]>) => {
      let newState = Object.assign({}, state)
      newState.categoryItems = action.payload
      return newState
    },
    setSubsidiesItems: (state, action: PayloadAction<Group[]>) => {
      let newState = Object.assign({}, state)
      newState.subsidiesItems = action.payload
      return newState
    },
  },
})

export {
  reducer,
  createSupply,
  createCategory,
  createGoods,
  getCreateCategory,
  updateCategory,
  getGoodsSales,
  updateGoodsSales
}
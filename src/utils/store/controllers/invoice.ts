import {
  createAsyncThunk,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit'
import base64 from 'base-64'
import axios from 'axios'

import { LoadingController } from './index'
import moment from 'moment'


const SCHOOL_ID = '79AF1B80-1983-4CFB-B16A-3EAB3B1DE845'

interface State {
  feeItems: any,
  subsidiesItems: any,
  discountItems: any,
  categoryItems: any,
  basicItems: any,
  allInvoices: any,
  voidInvoices: any,
  outstandingInvoices: any,
  singleInvoice: any,
  userClasses: any,
}

const name = 'invoice';
const initialState: State = {
  feeItems: [],
  subsidiesItems: [],
  discountItems: [],
  allInvoices: [],
  voidInvoices: [],
  outstandingInvoices: [],
  userClasses: [],
  singleInvoice: null,
  categoryItems: null,
  basicItems: null,
}


const _setFeeItems = createAsyncThunk(
  `${name}/_setFeeItems`,
  async (params: {
    item: any,
    deleteItem: any,
    isDiscount: boolean
  }, { dispatch, getState }) => {
    let state: any = getState();
    dispatch(LoadingController.setLoading({ loading: true }))
    var oldData: Array<any> = state.invoiceController.feeItems
    var data: Array<any> = [];
    const filterData: any = oldData.filter(e => e.GoodsID === params.item?.GoodsID)
    if (filterData?.length) {
      for (let l = 0; l < oldData?.length; l++) {
        var newElement: any;
        const element1 = oldData[l];
        if (params.isDiscount && element1?.GoodsID === params.item?.GoodsID) {
          newElement = {
            ...element1, TotalDiscount: (params?.item?.TotalDiscount ? params.item.TotalDiscount : 0),
            selectedDiscountItems: params?.item?.selectedDiscountItems
          }
        }
        if (!params.isDiscount && element1?.GoodsID === params.item?.GoodsID) {
          newElement = {
            ...element1,
            TotalDiscount: (element1.TotalDiscount ? element1.TotalDiscount : 0),
            quantity: params?.item?.quantity ? params.item.quantity : 1
          }
        }
        if (newElement) {
          data.push(newElement)
        } else {
          data.push(element1)
        }
        newElement = null
      }



      if (params.deleteItem) {
        var deleteData: any = data
        deleteData = deleteData.filter(e => e.GoodsID !== params.item?.GoodsID)
        data = deleteData
      }

    } else {
      data = [...oldData, params.item]
    }

    dispatch(setFeeItems(data))
    dispatch(LoadingController.setLoading({ loading: false }))
  }
)

const _setSubsidiesItems = createAsyncThunk(
  `${name}/_setSubsidiesItems`,
  async (params: {
    items: any,
  }, { dispatch }) => {

    // dispatch(setSubsidiesItems([]))
    dispatch(setSubsidiesItems(params.items))
  }
)



const getGoodsSalesSubsidies = createAsyncThunk(
  `${name}/getGoodsSalesSubsidies`,
  async (params: {
    body: any,
    Subsidies: boolean,
    isDiscount: boolean
  }, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState()
    let accessToken = state.authController.accessToken

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
      const data: any = JSON.parse(response.data.Remark).Sales
      data.forEach(element => {
        element.selected = false
      });
      if (params.isDiscount) {
        dispatch(setDiscountItems(data))
      } else {
        dispatch(setSubsidiesItems(data))
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

const getInvoices = createAsyncThunk(
  `${name}/getInvoices`,
  async (params: {
    body: any
    Void: any
  }, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState()
    let accessToken = state.authController.accessToken

    try {

      //1 = Active 2 = Suspended 3 = Graduated 4 = Withdraw/Resigned 10 = Trial
      let response = await axios.post(
        `https://SGPAY.xsecurepay.com/V1/Fee/Invoices/GetInvoices`,
        params.body,
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )
      const data: any = JSON.parse(response.data.Remark)
      if (params.Void) {
        dispatch(setVoidInvoices(data.Invoices))
      } else {

        dispatch(setOutstandingInvoices(data.Invoices))
      }
      dispatch(setInvoices(data))

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

const getClassesByUserID = createAsyncThunk(
  `${name}/getClassesByUserID`,
  async (params: {
    UserID: any
  }, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState()
    let accessToken = state.authController.accessToken

    try {

      //1 = Active 2 = Suspended 3 = Graduated 4 = Withdraw/Resigned 10 = Trial
      let response = await axios.get(
        `https://contacts.ichild.com.sg/api/v1.0/SchoolManagement/GetClassListByUserID/${params.UserID}`,
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )
      const data: any = JSON.parse(response.data.Remark)
      dispatch(setUserClasses(data))
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

const getInvoiceByID = createAsyncThunk(
  `${name}/getInvoiceByID`,
  async (params: {
    IDType: any
    ID: any
  }, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState()
    let accessToken = state.authController.accessToken

    try {

      //1 = Active 2 = Suspended 3 = Graduated 4 = Withdraw/Resigned 10 = Trial
      let response = await axios.get(
        `https://SGPAY.xsecurepay.com/V1/Fee/Invoices/GetInvoice/${params.ID}/${params.IDType}`,
        {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }
      )
      const data: any = JSON.parse(response.data.Remark)
      dispatch(setInvoiceByID(data))

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


const createInvoice = createAsyncThunk(
  `${name}/createInvoice`,
  async (params: {
    Name: string,
    Date: any,
    DueDate: any,
    SubTotal: number,
    TotalDiscount: number,
    TotalSubsidy: number,
    TotalTax: number,
    Total: number,
    SubsidyPaid: number,
    AmountPaid: number,
    FeeItems: any,
    PaymentNotice: any,
    ToUserID: any,
    ClassID: any,
  }, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState();
    let accessToken = state.authController.accessToken;

    let idToken = state.authController.idToken;

    const id = idToken.split('.')[1];
    const userId = JSON.parse(base64.decode(id)).sub;

    let InvoiceID = uuidv4()
    const CurrentID = params.ClassID ? {
      "SchoolID": SCHOOL_ID, "ClassID": params.ClassID
    } : SCHOOL_ID
    console.warn('CurrentID',CurrentID);
    
    try {

      let res = await axios.post(
        'https://SGPAY.xsecurepay.com/V1/Fee/Invoices/CreateInvoices',
        {
          "PaymentMethods": [],
          "Invoices": [
            {
              "InvoiceID": InvoiceID,
              "PaymentNotice": params.PaymentNotice,
              "IsJsonCurrentID": params.ClassID ? true : false,
              "CurrentID": CurrentID,
              "ToUserID": params.ToUserID,
              "IsAllowEdit": false,
              "InvoiceType": 0,
              "InvoiceName": params.Name,
              "InvoiceNumber": "",
              "VoidNumber": "",
              "Reference": "",
              "Date": params.Date,
              "DueDate": params.DueDate,
              // "VoidDateUTC": params.Date,
              "IsLimitPaymentTime": true,
              "limitPaymnetTime": 900,
              "SentToContact": false,
              "SentToCollection": 0,
              // "SentToCollectionDateUTC": params.Date,
              "IsSubsidy": false,
              "InvoiceState": 0,
              "PreStatistics": 0,
              "IsRestrictedPayment": false,
              "RestrictedPayment": "",
              "CurrencyCode": "en-us",
              "SubsidyStatus": 0,
              "SubTotal": params.SubTotal,
              "TotalDiscount": params.TotalDiscount,
              "TotalSubsidy": params.TotalSubsidy,
              "TotalTax": params.TotalTax,
              "Total": params.Total,
              "SubsidyPaid": params.SubsidyPaid,
              "AmountPaid": params.AmountPaid,
              "IsJson": false,
              "CreateFrom": "Zentre",
            }
          ],
          "FeeItems": params.FeeItems,
          "Receipts": []
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
        const emptyData: any = [];
        dispatch(setFeeItems(emptyData))
        dispatch(setSubsidiesItems(emptyData))
        return { text: data.Remark, success: true }
      } else {
        return { text: data.Remark, success: false }
      }
    } catch (error) {
      //Handle Error
      console.warn('error', error);
      dispatch(LoadingController.setLoading({ loading: false }))
    }
  }
)

const voidInvoice = createAsyncThunk(
  `${name}/voidInvoice`,
  async (params: {
    VoidAmount: string,
    InvoiceID: any,
    PaymentNotice: any,
  }, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState();
    let accessToken = state.authController.accessToken;
    const InvoiceID = uuidv4()
    try {
      const body = {
        "InvoiceID": InvoiceID,
        "PaymentNotice": params.PaymentNotice,
        "InvoiceState": -1,
        "VoidDateUTC": moment().format("YYYY-MM-DD hh:mm:ss"),
        "SentToContact": true,
        "SentToCollection": 0,
        "SentToCollectionDateUTC": moment().format("YYYY-MM-DD hh:mm:ss"),
        "CurrencyCode": "en-us",
        "VoidAmount": params.VoidAmount,
        "Remark": "",
        "UpdatedDateUTC": moment().format("YYYY-MM-DD hh:mm:ss")
      }
      console.warn('params', body);
      let res = await axios.post(
        ' https://SGPAY.xsecurepay.com/V1/Fee/Invoices/VoidInvoice',
        body
        ,
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
        const emptyData: any = [];
        dispatch(setFeeItems(emptyData))
        dispatch(setSubsidiesItems(emptyData))
        return { text: data.Remark, success: true }
      } else {
        return { text: data.Remark, success: false }
      }
    } catch (error) {
      //Handle Error
      console.warn('error', error);
      dispatch(LoadingController.setLoading({ loading: false }))
    }
  }
)


const getGoodsSales = createAsyncThunk(
  `${name}/getGoodsSales`,
  async (params: {
    body: any,
    CategoryType: any,
    Subsidies: boolean
  }, { dispatch, getState }) => {
    dispatch(LoadingController.setLoading({ loading: true }))

    let state: any = getState()
    let accessToken = state.authController.accessToken
    let idToken = state.authController.idToken;

    const id = idToken.split('.')[1];
    const userId = JSON.parse(base64.decode(id)).sub;

    try {
      var categories: any = await axios.post(
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

      categories = JSON.parse(categories.data.Remark)
      const itemLists: any = []
      // categories.forEach(async (element) => {

      // });
      const ID = uuidv4()
      const ID1 = uuidv4()
      for (let j = 0; j < categories?.length; j++) {
        const element = categories[j];
        const body = {
          "Wheres": [
            {
              "ID": ID,
              "KeyName": "AccountInfoID",
              "KeyValue": '79AF1B80-1983-4CFB-B16A-3EAB3B1DE845'
            },
            {
              "ID": ID1,
              "KeyName": "CategoryBindingID",
              "KeyValue": element?.CategoryBindingID
            }],
        }

        //1 = Active 2 = Suspended 3 = Graduated 4 = Withdraw/Resigned 10 = Trial
        const categoryitems = await axios.post(
          `https://SGPAY.xsecurepay.com/V1/Fee/GetSales`,
          body,
          {
            headers: {
              'content-type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            },
          }
        )
        const categoryitem: any = JSON.parse(categoryitems.data.Remark)
        if (categoryitem.Sales.length > 0) {
          categoryitem.Sales.forEach((element2: any) => {
            if (element2) {
              itemLists.push(element2)
            }
          });
        }

      }

      if (params.Subsidies) {
        dispatch(setSubsidiesItems(itemLists))
      } else {
        dispatch(setCategoryItems(itemLists))
      }
      dispatch(LoadingController.setLoading({ loading: false }))
      return itemLists
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
    setFeeItems,
    setSubsidiesItems,
    setDiscountItems,
    setInvoices,
    setOutstandingInvoices,
    setVoidInvoices,
    setInvoiceByID,
    setCategoryItems,
    setUserClasses
  },
  reducer,
} = createSlice({
  name,
  initialState,
  reducers: {
    setFeeItems: (state, action: PayloadAction<State>) => {
      let newState = Object.assign({}, state)
      newState.feeItems = action.payload
      return newState
    },
    setDiscountItems: (state, action: PayloadAction<State>) => {
      let newState = Object.assign({}, state)
      newState.discountItems = action.payload
      return newState
    },
    setSubsidiesItems: (state, action: PayloadAction<State>) => {
      let newState = Object.assign({}, state)
      newState.subsidiesItems = action.payload
      return newState
    },
    setInvoices: (state, action: PayloadAction<State>) => {
      let newState = Object.assign({}, state)
      newState.allInvoices = action.payload
      return newState
    },
    setVoidInvoices: (state, action: PayloadAction<State>) => {
      let newState = Object.assign({}, state)
      newState.voidInvoices = action.payload
      return newState
    },
    setOutstandingInvoices: (state, action: PayloadAction<State>) => {
      let newState = Object.assign({}, state)
      newState.outstandingInvoices = action.payload
      return newState
    },
    setInvoiceByID: (state, action: PayloadAction<State>) => {
      let newState = Object.assign({}, state)
      newState.singleInvoice = action.payload
      return newState
    },
    setCategoryItems: (state, action: PayloadAction<State>) => {
      let newState = Object.assign({}, state)
      newState.basicItems = action.payload
      return newState
    },
    setUserClasses: (state, action: PayloadAction<State>) => {
      let newState = Object.assign({}, state)
      newState.userClasses = action.payload
      return newState
    },
  },
})

export {
  reducer,
  createInvoice,
  _setFeeItems,
  _setSubsidiesItems,
  getGoodsSalesSubsidies,
  getInvoices,
  getGoodsSales,
  getInvoiceByID,
  voidInvoice,
  getClassesByUserID
}
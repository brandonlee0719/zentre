import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

import {
  LoadingController,
  AuthController,
  ContactsCController,
  AppDataController,
  AlertController,
  PopupController,
  GroupController,
  FeesController,
  InvoiceController
} from './controllers'


export const store = configureStore({
  reducer: {
    authController: AuthController.reducer,
    loadingController: LoadingController.reducer,
    contactsCController: ContactsCController.reducer,
    appDataController: AppDataController.reducer,
    alertController: AlertController.reducer,
    popupController: PopupController.reducer,
    groupController: GroupController.reducer,
    feesController: FeesController.reducer,
    invoiceController: InvoiceController.reducer
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
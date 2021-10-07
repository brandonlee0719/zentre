import {
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit'


interface Alert {
  show: boolean
  title?: string
  message?: string
  positiveText?: string
  onPositive?: () => void
  negativeText?: string
  onNegative?: () => void
}

const name = 'alert';
const initialState: Alert = {
  show: false
}

const {
  actions: { showAlert },
  reducer,
} = createSlice({
  name,
  initialState,
  reducers: {
    showAlert: (_, action: PayloadAction<Alert>) =>
      action.payload,
  },
});

export { reducer, showAlert }
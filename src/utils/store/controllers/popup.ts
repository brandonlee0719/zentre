import {
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit'

interface Position {
  x: number
  y: number
}
interface Option {
  text: string
  icon?: JSX.Element
  textColor?: string
  onClick: () => void
}
interface Props {
  show: boolean
  position?: Position
  options?: Option[]
}

const name = 'popup';
const initialState: Props = {
  show: false,
}

const {
  actions: { showPopup },
  reducer,
} = createSlice({
  name,
  initialState,
  reducers: {
    showPopup: (_, action: PayloadAction<Props>) =>
      action.payload,
  },
})

export { reducer, showPopup }
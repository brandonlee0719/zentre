import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const name = 'loading'

interface LoadingState {
  loading: boolean
}

const initialState: LoadingState = {
  loading: false,
}

const {
  actions: { setLoading },
  reducer,
} = createSlice({
  name,
  initialState: initialState,
  reducers: {
    setLoading: (_, action: PayloadAction<LoadingState>) => action.payload,
  },
})

export { reducer, setLoading }
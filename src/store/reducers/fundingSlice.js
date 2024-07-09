import { createSlice } from '@reduxjs/toolkit'
import { PURGE } from 'redux-persist'

const initialState = {
  fundingData: [],
  isLoading: false,
}

const fundingSlice = createSlice({
  name: 'funding',
  initialState,
  reducers: {
    getFundingData: (state) => {
      state.isLoading = true
    },
    getFundingDataSuccess: (state, action) => {
      state.fundingData = action.payload
      state.isLoading = false
    },
    getFundingDataFailure: (state) => {
      state.isLoading = false
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => {
      return initialState
    })
  },
})

export const {
  getFundingData,
  getFundingDataSuccess,
  getFundingDataFailure,
} = fundingSlice.actions
export default fundingSlice.reducer

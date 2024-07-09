import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFundingDetails } from '../../utils/api/apis';
import { returnErrors } from '../reducers/error';

// Thunk for fetching funding details
export const fetchFundingDetails = createAsyncThunk(
  'funding/fetchFundingDetails',
  async (idToken, { dispatch, rejectWithValue }) => {
    try {
      const response = await getFundingDetails(idToken);
      if (response.status < 399) {
        console.log(response)
        return response.data;
      } else {
        const msg = response.response?.data?.detail || 'Error getting funding details';
        dispatch(returnErrors(msg, response.status));
        return rejectWithValue(msg);
      }
    } catch (error) {
      const msg = error.response?.data?.detail || 'Error getting funding details';
      dispatch(returnErrors(msg, error.response?.status || 500));
      return rejectWithValue(msg);
    }
  }
);

const fundingSlice = createSlice({
  name: 'funding',
  initialState: {
    fundingData: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    getFundingDataSuccess: (state, action) => {
      state.fundingData = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    getFundingDataFailure: (state) => {
      state.fundingData = null;
      state.isLoading = false;
      state.error = 'Failed to fetch funding data';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFundingDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFundingDetails.fulfilled, (state, action) => {
        state.fundingData = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchFundingDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { getFundingDataSuccess, getFundingDataFailure } = fundingSlice.actions;

export default fundingSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getNewFundingDetails } from '../../utils/api/apis';
import { returnErrors } from '../reducers/error';


export const fetchNewFundingDetails = createAsyncThunk(
  'funding/fetchNewFundingDetails',
  async (idToken, { dispatch, rejectWithValue }) => {
    try {
      const response = await getNewFundingDetails(idToken);
      if (response.status < 399) {
        console.log(response)
        return response.data;
      } else {
        const msg = response.response?.data?.detail || 'Error getting new funding details';
        dispatch(returnErrors(msg, response.status));
        return rejectWithValue(msg);
      }
    } catch (error) {
      const msg = error.response?.data?.detail || 'Error getting new funding details';
      dispatch(returnErrors(msg, error.response?.status || 500));
      return rejectWithValue(msg);
    }
  }
);

const newFundingSlice = createSlice({
  name: 'new-funding',
  initialState: {
    newFundingData: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    getFundingDataSuccess: (state, action) => {
      state.newFundingData = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    getFundingDataFailure: (state) => {
      state.newFundingData = null;
      state.isLoading = false;
      state.error = 'Failed to fetch new funding data';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewFundingDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNewFundingDetails.fulfilled, (state, action) => {
        state.newFundingData = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchNewFundingDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { getFundingDataSuccess, getFundingDataFailure } = newFundingSlice.actions;

export default newFundingSlice.reducer;

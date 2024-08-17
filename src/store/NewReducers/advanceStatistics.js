import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { returnErrors } from '../reducers/error';
import { getDailyStats, getPassRate, getWithdrawalsDetails, getWithdrawalsStatus } from '../../utils/api/apis';

// Thunk for fetching withdrawals status with pagination
export const fetchWithdrawalsStatus = createAsyncThunk(
  'advanceStats/fetchWithdrawalsStatus',
  async ({ idToken , query }, { dispatch, rejectWithValue }) => {
    try {
      const response = await getWithdrawalsStatus(idToken , query);
      console.log(query)
      return response;
    } catch (error) {
      const msg = error.response?.data?.detail || 'Error fetching withdrawals status';
      dispatch(returnErrors(msg, 400));
      return rejectWithValue(msg);
    }
  }
);

// Thunk for fetching withdrawals details with pagination
export const fetchWithdrawalsDetails = createAsyncThunk(
  'advanceStats/fetchWithdrawalsDetails',
  async ({ idToken , query }, { dispatch, rejectWithValue }) => {
    try {
      const response = await getWithdrawalsDetails(idToken , query);
      return response;
    } catch (error) {
      const msg = error.response?.data?.detail || 'Error fetching withdrawals details';
      dispatch(returnErrors(msg, 400));
      return rejectWithValue(msg);
    }
  }
);

// Thunk for fetching pass rate
export const fetchPassRate = createAsyncThunk(
  'advanceStats/fetchPassRate',
  async ({ login_id, idToken }, { dispatch, rejectWithValue }) => {
    try {
      const response = await getPassRate(login_id, idToken);
      return response;
    } catch (error) {
      const msg = error.response?.data?.detail || 'Error fetching pass rate';
      dispatch(returnErrors(msg, 400));
      return rejectWithValue(msg);
    }
  }
);

// Thunk for fetching daily stats 
export const fetchDailyStats = createAsyncThunk(
  'advanceStats/fetchDailyStats',
  async ({ idToken  , query  }, { dispatch, rejectWithValue }) => {
    try {
      const response = await getDailyStats(idToken , query);
      return response;
    } catch (error) {
      const msg = error.response?.data?.detail || 'Error fetching daily stats';
      dispatch(returnErrors(msg, 400));
      return rejectWithValue(msg);
    }
  }
);

const advanceStatisticsSlice = createSlice({
  name: 'advanceStatistics',
  initialState: {
    withdrawalsStatus: null,
    withdrawalsDetails: null,
    passRate: null,
    dailyStats: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWithdrawalsStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWithdrawalsStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.withdrawalsStatus = action.payload.data;
      })
      .addCase(fetchWithdrawalsStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchWithdrawalsDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWithdrawalsDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.withdrawalsDetails = action.payload.data;
      })
      .addCase(fetchWithdrawalsDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchPassRate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPassRate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.passRate = action.payload;
      })
      .addCase(fetchPassRate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchDailyStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDailyStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dailyStats = action.payload.data;
      })
      .addCase(fetchDailyStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default advanceStatisticsSlice.reducer;

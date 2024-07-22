// store/slices/amSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { returnErrors } from '../reducers/error';
import { getAccountDetails, getAccountInsights, getTradeJournal, getTradingAccountOverview, getObjectives } from '../../utils/api/apis';

// Thunk for fetching trading account overview
export const fetchTradingAccountOverview = createAsyncThunk(
  'amSlice/fetchTradingAccountOverview',
  async ({ login_id, platform, idToken }, { dispatch, rejectWithValue }) => {
    try {
      const response = await getTradingAccountOverview(login_id, platform, idToken);
      return response;
    } catch (error) {
      const msg = error.response?.data?.detail || 'Error fetching trading account overview';
      dispatch(returnErrors(msg, 400));
      return rejectWithValue(msg);
    }
  }
);

// Thunk for fetching account details
export const fetchAccountDetails = createAsyncThunk(
  'amSlice/fetchAccountDetails',
  async ({ login_id, platform, idToken }, { dispatch, rejectWithValue }) => {
    try {
      const response = await getAccountDetails(login_id, platform, idToken);
      return response;
    } catch (error) {
      const msg = error.response?.data?.detail || 'Error fetching account details';
      dispatch(returnErrors(msg, 400)); 
      return rejectWithValue(msg);
    }
  }
);

// Thunk for fetching account insights
export const fetchAccountInsights = createAsyncThunk(
  'amSlice/fetchAccountInsights',
  async ({ login_id, platform, idToken }, { dispatch, rejectWithValue }) => {
    try {
      const response = await getAccountInsights(login_id, platform, idToken);
      return response;
    } catch (error) {
      const msg = error.response?.data?.detail || 'Error fetching account insights';
      dispatch(returnErrors(msg, 400));
      return rejectWithValue(msg);
    }
  }
);

// Thunk for fetching trade journal
export const fetchTradeJournal = createAsyncThunk(
  'amSlice/fetchTradeJournal',
  async ({ login_id, platform, idToken }, { dispatch, rejectWithValue }) => {
    try {
      const response = await getTradeJournal(login_id, platform, idToken);
      return response;
    } catch (error) {
      const msg = error.response?.data?.detail || 'Error fetching trade journal';
      dispatch(returnErrors(msg, 400));
      return rejectWithValue(msg);
    }
  }
);

// Thunk for fetching objectives
export const fetchObjectives = createAsyncThunk(
  'amSlice/fetchObjectives',
  async ({ login_id, platform, idToken }, { dispatch, rejectWithValue }) => {
    try {
      const response = await getObjectives(login_id, platform, idToken);
      return response;
    } catch (error) {
      const msg = error.response?.data?.detail || 'Error fetching objectives';
      dispatch(returnErrors(msg, 400));
      return rejectWithValue(msg);
    }
  }
);

const amSlice = createSlice({
  name: 'amSlice',
  initialState: {
    tradingAccountOverview: null,
    accountDetails: null,
    accountInsights: null,
    tradeJournal: null,
    objectives: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    // You can add reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTradingAccountOverview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTradingAccountOverview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tradingAccountOverview = action.payload;
      })
      .addCase(fetchTradingAccountOverview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchAccountDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAccountDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accountDetails = action.payload;
      })
      .addCase(fetchAccountDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchAccountInsights.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAccountInsights.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accountInsights = action.payload;
      })
      .addCase(fetchAccountInsights.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchTradeJournal.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTradeJournal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tradeJournal = action.payload;
      })
      .addCase(fetchTradeJournal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchObjectives.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchObjectives.fulfilled, (state, action) => {
        state.isLoading = false;
        state.objectives = action.payload;
      })
      .addCase(fetchObjectives.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default amSlice.reducer;

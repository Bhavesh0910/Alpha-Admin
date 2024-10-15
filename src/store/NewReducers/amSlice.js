import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { returnErrors } from '../reducers/error';
import { getAccountDetails, getAccountInsights, getTradeJournal, getTradingAccountOverview, getObjectives, getPerformanceChart, getAccountAnalysis, getTransactionHistory, baseUrl, getCertificatesDetails, createCertificateApi } from '../../utils/api/apis';
import axios from 'axios';
import { returnMessages } from '../reducers/message';

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

export const fetchAccountAnalysis = createAsyncThunk(
  'amSlice/fetchAccountAnalysis',
  async ({ platform, login_id, idToken }, { dispatch, rejectWithValue }) => {
    try {
      const response = await getAccountAnalysis(platform, login_id, idToken);
      return response;
    } catch (error) {
      const msg = error.response?.data?.detail || 'Error fetching account analysis';
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
      console.log(response)
      return response;
    } catch (error) {
      console.log(error.response.data)
      const msg = error.response?.data?.message || 'Error fetching account insights';
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

export const fetchTransactionHistory = createAsyncThunk(
  'amSlice/fetchTransactionHistory',
  async ({ idToken , user_id }, { dispatch, rejectWithValue }) => {
    try {
      const response = await getTransactionHistory(idToken , user_id);
      return response;
    } catch (error) {
      const msg = error.response?.data?.detail || 'Error fetching transaction history';
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

// Thunk for fetching performance chart
export const fetchPerformanceChart = createAsyncThunk(
  'amSlice/fetchPerformanceChart',
  async ({ login_id, platform, idToken }, { dispatch, rejectWithValue }) => {
    try {
      const response = await getPerformanceChart(login_id,platform, idToken);
      return response;
    } catch (error) {
      const msg = error.response?.data?.detail || 'Error fetching performance chart';
      dispatch(returnErrors(msg, 400));
      return rejectWithValue(msg);
    }
  }
);

export const getUserProfileData = createAsyncThunk(
  'fetchUserProfileData',
  async ({ idToken, id , dispatch }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      };
      const response = await axios(`${baseUrl}v2/admin/user-profile/${id}`, config);
      return response.data;
    } catch (error) {
      dispatch(returnErrors(error.response?.data?.detail || 'Error while fetching User Data!', 400));
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk for fetching certificate details
export const fetchCertificatesDetails = createAsyncThunk(
  'amSlice/fetchCertificatesDetails',
  async ({ idToken, user_id , query }, { dispatch, rejectWithValue }) => {
    try {
      const response = await getCertificatesDetails(idToken, user_id , query );
      return response.data; 
    } catch (error) {
      const msg = error.response?.data?.detail || 'Error fetching certificate details';
      dispatch(returnErrors(msg, 400));
      return rejectWithValue(msg);
    }
  }
);

export const createCertificates = createAsyncThunk(
  'amSlice/createCertificates',
  async ({ idToken, certificateData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await createCertificateApi(idToken, certificateData );
      dispatch(returnMessages("Certificate Created successfully" , 200))
      return response.data; 
    } catch (error) {
      const msg = error.response?.data?.detail || 'Error creating certificate';
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
    transactionHistory: null,
    objectives: null,
    accountAnalysis: null, 
    performanceChart: null,
    userProfileData: null,
    certificatesDetails: null, 
    createdCertificate: null,
    isLoading: false,
    error: null,
  },
  reducers: {
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
      .addCase(fetchTransactionHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactionHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactionHistory = action.payload;
      })
      .addCase(fetchTransactionHistory.rejected, (state, action) => {
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
      })
      .addCase(fetchAccountAnalysis.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAccountAnalysis.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accountAnalysis = action.payload;
      })
      .addCase(fetchAccountAnalysis.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchPerformanceChart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPerformanceChart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.performanceChart = action.payload;
      })
      .addCase(fetchPerformanceChart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getUserProfileData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserProfileData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userProfileData = action.payload;
      })
      .addCase(getUserProfileData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchCertificatesDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCertificatesDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.certificatesDetails = action.payload; 
      })
      .addCase(fetchCertificatesDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createCertificates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCertificates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.createdCertificate = action.payload; 
      })
      .addCase(createCertificates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default amSlice.reducer;

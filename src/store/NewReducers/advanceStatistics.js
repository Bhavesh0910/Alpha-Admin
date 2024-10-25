import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {returnErrors} from "../reducers/error";
import {getDailyStats, getPassRate, getPassStageChart, getPayoutDetails, getTotalMethod, getTotatPayments, getWithdrawalsDetails, getWithdrawalsStatus} from "../../utils/api/apis";

// Thunk for fetching withdrawals status with pagination
export const fetchWithdrawalsStatus = createAsyncThunk("advanceStats/fetchWithdrawalsStatus", async ({idToken, query , activeTab}, {dispatch, rejectWithValue}) => {
  try {
    const response = await getWithdrawalsStatus(idToken, query , activeTab);
    // console.log(query);
    return response;
  } catch (error) {
    const msg = error.response?.data?.detail || "Error fetching withdrawals status";
    dispatch(returnErrors(msg, 400));
    return rejectWithValue(msg);
  }
});

// Thunk for fetching withdrawals details with pagination
export const fetchWithdrawalsDetails = createAsyncThunk("advanceStats/fetchWithdrawalsDetails", async ({idToken, query}, {dispatch, rejectWithValue}) => {
  try {
    const response = await getWithdrawalsDetails(idToken, query);
    return response;
  } catch (error) {
    const msg = error.response?.data?.detail || "Error fetching withdrawals details";
    dispatch(returnErrors(msg, 400));
    return rejectWithValue(msg);
  }
});

// Thunk for fetching pass rate
export const fetchPassRate = createAsyncThunk("advanceStats/fetchPassRate", async ({idToken, query}, {dispatch, rejectWithValue}) => {
  try {
    const response = await getPassRate(idToken, query);
    return response;
  } catch (error) {
    const msg = error.response?.data?.detail || "Error fetching pass rate";
    dispatch(returnErrors(msg, 400));
    return rejectWithValue(msg);
  }
});

export const fetchStageChart = createAsyncThunk("advanceStats/fetchStageChart", async ({idToken, stage, startDate, endDate , filter_type}, {dispatch, rejectWithValue}) => {
  try {
    const response = await getPassStageChart(idToken, stage, startDate, endDate , filter_type);
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.detail || "Error fetching stage chart data";
    dispatch(returnErrors(msg, 400));
    return rejectWithValue(msg);
  }
});

export const fetchFailData = createAsyncThunk("advanceStats/fetchFailData", async ({idToken, stage, startDate, endDate , filter_type}, {dispatch, rejectWithValue}) => {
  try {
    const response = await getPassStageChart(idToken, stage, startDate, endDate , filter_type);
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.detail || "Error fetching stage chart data";
    dispatch(returnErrors(msg, 400));
    return rejectWithValue(msg);
  }
});
export const fetchPayoutDetails = createAsyncThunk(
  "advanceStats/fetchPayoutDetails",
  async ({ idToken, query }, { dispatch, rejectWithValue }) => {
    try {
      const response = await getPayoutDetails(idToken, query);
      return response;
    } catch (error) {
      const msg = error.response?.data?.detail || "Error fetching payout details";
      dispatch(returnErrors(msg, 400));
      return rejectWithValue(msg);
    }
  }
);


export const fetchTotalPayments = createAsyncThunk(
  "advanceStats/fetchTotalPayments",
  async ({ idToken , query }, { dispatch, rejectWithValue }) => {
    try {
      const response = await getTotatPayments(idToken , query );
      // console.log(response)
      return response.result;
    } catch (error) {
      const msg = error.response?.data?.detail || "Error fetching total payments details";
      dispatch(returnErrors(msg, 400));
      return rejectWithValue(msg);
    }
  }
);

export const fetchTotalMethod = createAsyncThunk(
  "advanceStats/fetchTotalMethod",
  async ({ idToken, query }, { dispatch, rejectWithValue }) => {
    try {
      const response = await getTotalMethod(idToken, query);
      return response.result;
    } catch (error) {
      const msg = error.response?.data?.detail || "Error fetching total method";
      dispatch(returnErrors(msg, 400));
      return rejectWithValue(msg);
    }
  }
);


// Thunk for fetching daily stats
export const fetchDailyStats = createAsyncThunk("advanceStats/fetchDailyStats", async ({idToken, query}, {dispatch, rejectWithValue}) => {
  try {
    const response = await getDailyStats(idToken, query);
    return response;
  } catch (error) {
    const msg = error.response?.data?.detail || "Error fetching daily stats";
    dispatch(returnErrors(msg, 400));
    return rejectWithValue(msg);
  }
});

const advanceStatisticsSlice = createSlice({
  name: "advanceStatistics",
  initialState: {
    withdrawalsStatus: null,
    withdrawalsDetails: null,
    passRate: null,
    stage1ChartData: null,
    stage2ChartData: null,
    stage1FailData: null,
    stage2FailData: null,
    isLoadingStage1: null,
    totalPayments: null,
    totalMethod: null,
    isTotalMethodLoading: null,
    dailyStats: null,
    payoutDetails: null, 
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
        state.passRate = action.payload.data;
      })
      .addCase(fetchPassRate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchStageChart.pending, (state) => {
        state.isLoadingStage1 = true;
        state.error = null;
      })
      .addCase(fetchStageChart.fulfilled, (state, action) => {
        state.isLoadingStage1 = false;
        if (action.meta.arg.stage === 1) {
          state.stage1ChartData = action.payload;
        } else if (action.meta.arg.stage === 2) {
          state.stage2ChartData = action.payload;
        }
      })
      .addCase(fetchStageChart.rejected, (state, action) => {
        state.isLoadingStage1 = false;
        state.error = action.payload;
      })
      .addCase(fetchFailData.pending, (state) => {
        state.isLoadingStage1 = true;
        state.error = null;
      })
      .addCase(fetchFailData.fulfilled, (state, action) => {
        state.isLoadingStage1 = false;
        if (action.meta.arg.stage === 1) {
          state.stage1FailData = action.payload;
        } else if (action.meta.arg.stage === 2) {
          state.stage1FailData = action.payload;
        }
      })
      .addCase(fetchFailData.rejected, (state, action) => {
        state.isLoadingStage1 = false;
        state.error = action.payload;
      })
      .addCase(fetchDailyStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDailyStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dailyStats = action.payload;
      })
      .addCase(fetchDailyStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchPayoutDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPayoutDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.payoutDetails = action.payload.data; 
      })
      .addCase(fetchPayoutDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchTotalPayments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTotalPayments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.totalPayments = action.payload; 
      })
      .addCase(fetchTotalPayments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchTotalMethod.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTotalMethod.fulfilled, (state, action) => {
        state.isLoading = false;
        state.totalMethod = action.payload;
      })
      .addCase(fetchTotalMethod.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default advanceStatisticsSlice.reducer;

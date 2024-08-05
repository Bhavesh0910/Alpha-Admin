import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {returnErrors} from "../reducers/error";
import {getAccountOverviewStats, getFundingChart, getStageChart} from "../../utils/api/apis";

// Thunk for fetching account overview stats
export const fetchAccountOverviewStats = createAsyncThunk("risk/fetchAccountOverviewStats", async ({idToken, startDate, endDate}, {dispatch, rejectWithValue}) => {
  try {
    const response = await getAccountOverviewStats(idToken, startDate, endDate);
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.detail || "Error fetching account overview stats";
    dispatch(returnErrors(msg, 400));
    return rejectWithValue(msg);
  }
});

export const fetchStageChart = createAsyncThunk("risk/fetchStageChart", async ({idToken, stage, startDate, endDate}, {dispatch, rejectWithValue}) => {
  try {
    const response = await getStageChart(idToken, stage, startDate, endDate);
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.detail || "Error fetching stage chart data";
    dispatch(returnErrors(msg, 400));
    return rejectWithValue(msg);
  }
});

export const fetchFundingChart = createAsyncThunk("risk/fetchFundingChart", async ({idToken, startDate, endDate}, {dispatch, rejectWithValue}) => {
  try {
    const response = await getFundingChart(idToken, startDate, endDate);
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.detail || "Error fetching funding chart data";
    dispatch(returnErrors(msg, 400));
    return rejectWithValue(msg);
  }
});

const riskSlice = createSlice({
  name: "risk",
  initialState: {
    accountOverviewData: null,
    stage1ChartData: null,
    stage2ChartData: null,
    fundingChartData: null,
    isLoadingStats: false,
    isLoadingStage1: false,
    isLoadingStage2: false,
    isLoadingFundingdata: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountOverviewStats.pending, (state) => {
        state.isLoadingStats = true;
        state.error = null;
      })
      .addCase(fetchAccountOverviewStats.fulfilled, (state, action) => {
        state.isLoadingStats = false;
        state.accountOverviewData = action.payload;
      })
      .addCase(fetchAccountOverviewStats.rejected, (state, action) => {
        state.isLoadingStats = false;
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
      .addCase(fetchFundingChart.pending, (state) => {
        state.isLoadingFundingdata = true;
        state.error = null;
      })
      .addCase(fetchFundingChart.fulfilled, (state, action) => {
        state.isLoadingFundingdata = false;
        state.fundingChartData = action.payload;
      })
      .addCase(fetchFundingChart.rejected, (state, action) => {
        state.isLoadingFundingdata = false;
        state.error = action.payload;
      });
  },
});

export default riskSlice.reducer;

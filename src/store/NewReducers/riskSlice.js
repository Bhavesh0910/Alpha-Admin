import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { returnErrors } from "../reducers/error";
import { getAccountOverviewStats, getStageChart } from "../../utils/api/apis";

// Thunk for fetching account overview stats
export const fetchAccountOverviewStats = createAsyncThunk(
  "risk/fetchAccountOverviewStats",
  async ({ idToken, startDate, endDate }, { dispatch, rejectWithValue }) => {
    try {
      const response = await getAccountOverviewStats(idToken, startDate, endDate);
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.detail || "Error fetching account overview stats";
      dispatch(returnErrors(msg, 400));
      return rejectWithValue(msg);
    }
  }
);

export const fetchStageChart = createAsyncThunk(
  "risk/fetchStageChart",
  async ({ idToken, stage, startDate, endDate }, { dispatch, rejectWithValue }) => {
    try {
      const response = await getStageChart(idToken, stage, startDate, endDate);
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.detail || "Error fetching stage chart data";
      dispatch(returnErrors(msg, 400));
      return rejectWithValue(msg);
    }
  }
);

const riskSlice = createSlice({
  name: "risk",
  initialState: {
    accountOverviewData: null,
    stage1ChartData: null,
    stage2ChartData: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountOverviewStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAccountOverviewStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accountOverviewData = action.payload;
      })
      .addCase(fetchAccountOverviewStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchStageChart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStageChart.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.meta.arg.stage === 1) {
          state.stage1ChartData = action.payload;
        } else if (action.meta.arg.stage === 2) {
          state.stage2ChartData = action.payload;
        }
      })
      .addCase(fetchStageChart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default riskSlice.reducer;

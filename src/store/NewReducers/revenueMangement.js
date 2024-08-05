import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {returnErrors} from "../reducers/error";
import {baseUrl} from "../../utils/api/apis";
import axios from "axios";

const payoutPaymentApi = async (idToken, query) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    const response = await axios.get(`${baseUrl}user/payout-payment/${query}`, config);
    return response.data;
  } catch (error) {
    console.error("Error during billingdata request", error);
    throw error;
  }
};

const revenueStatsApi = async (idToken, query) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };

    let response;

    if (query) {
      response = await axios.get(`${baseUrl}v3/revenue-management/${query}`, config);
    } else {
      response = await axios.get(`${baseUrl}v3/revenue-management/`, config);
    }
    return response.data;
  } catch (error) {
    console.error("Error during billingdata request", error);
    throw error;
  }
};

const payoutStatsApi = async (idToken, query) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    const response = await axios.get(`${baseUrl}v3/statistics/`, config);
    return response.data;
  } catch (error) {
    console.error("Error during billingdata request", error);
    throw error;
  }
};
// bar chart
const qualifiedAccountApi = async (idToken, query) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    const response = await axios.get(`${baseUrl}v3/funded_accounts/`, config);
    return response.data;
  } catch (error) {
    console.error("Error during kyclistdata request:", error);
    throw error;
  }
};

export const payoutPaymentReq = createAsyncThunk("revenue/payoutPaymentApi", async ({idToken, query, dispatch}, {rejectWithValue}) => {
  try {
    const response = await payoutPaymentApi(idToken, query);
    return response;
  } catch (error) {
    dispatch(returnErrors(error.response.data.detail || "Error Fetching List...", 400));
    return rejectWithValue(error.response.data);
  }
});

export const statsReq = createAsyncThunk("revenue/statsApi", async ({idToken, query, dispatch}, {rejectWithValue}) => {
  try {
    const response = await revenueStatsApi(idToken, query);
    return response;
  } catch (error) {
    dispatch(returnErrors(error.response.data.detail || "Error Fetching List...", 400));
    return rejectWithValue(error.response.data);
  }
});

export const payoutStatsReq = createAsyncThunk("revenue/payoutStats", async ({idToken, query, dispatch}, {rejectWithValue}) => {
  try {
    const response = await payoutStatsApi(idToken, query);
    return response;
  } catch (error) {
    dispatch(returnErrors(error.response.data.detail || "Error Fetching List...", 400));
    return rejectWithValue(error.response.data);
  }
});

export const qualifiedAccountReq = createAsyncThunk("revenue/qualifiedAccounts", async ({idToken, query, dispatch}, {rejectWithValue}) => {
  try {
    const response = await qualifiedAccountApi(idToken, query);
    return response;
  } catch (error) {
    dispatch(returnErrors(error.response.data.detail || "Error Fetching List...", 400));
    return rejectWithValue(error.response.data);
  }
});

const revenueManagementSlice = createSlice({
  name: "revenueManagement",
  initialState: {
    isLoading: false,
    isError: false,
    barData: [],
    chartData: [],
    statsData: [],
    tableData: [],
    barDataLoader: false,
    chartDataLoader: false,
    statsDataLoader: false,
    tableDataLoader: false,
    count: 1,
    tableDataCount: 1,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(statsReq.pending, (state) => {
        state.statsDataLoader = true;
        state.isError = false;
      })
      .addCase(statsReq.fulfilled, (state, action) => {
        console.log("Action payload oof statsReq : ", action.payload);
        state.statsDataLoader = false;
        state.statsData = action.payload; // Update state with fetched data
      })
      .addCase(statsReq.rejected, (state) => {
        state.statsDataLoader = false;
        state.isError = true;
      })
      .addCase(payoutStatsReq.pending, (state) => {
        state.chartDataLoader = true;
        state.isError = false;
      })
      .addCase(payoutStatsReq.fulfilled, (state, action) => {
        console.log("Action payload oof payoutStatsReq : ", action.payload);
        state.chartData = action.payload; // Update state with fetched data
        state.chartDataLoader = false;
      })
      .addCase(payoutStatsReq.rejected, (state) => {
        state.chartDataLoader = false;
        state.isError = true;
      })
      .addCase(qualifiedAccountReq.pending, (state) => {
        state.barDataLoader = true;
        state.isError = false;
      })
      .addCase(qualifiedAccountReq.fulfilled, (state, action) => {
        console.log("Action payload oof qualifiedAccountReq : ", action.payload);
        state.barDataLoader = false;
        state.barData = action.payload; // Update state with fetched data
      })
      .addCase(qualifiedAccountReq.rejected, (state) => {
        state.barDataLoader = false;
        state.isError = true;
      })
      .addCase(payoutPaymentReq.pending, (state) => {
        state.tableDataLoader = true;
        state.isError = false;
      })
      .addCase(payoutPaymentReq.fulfilled, (state, action) => {
        state.tableDataLoader = false;
        console.log(action.payload, " nsbcjsabdcjhsbd ")
        state.tableData = action.payload?.results; // Update state with fetched data
        state.tableDataCount = action.payload?.count; // Update state with fetched data
      })
      .addCase(payoutPaymentReq.rejected, (state) => {
        state.tableDataLoader = false;
        state.isError = true;
      });
  },
});

// Export the async thunk and any reducers if needed
export default revenueManagementSlice.reducer;

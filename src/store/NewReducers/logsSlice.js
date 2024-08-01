import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../utils/api/apis";
import { returnErrors } from "../reducers/error";

const logsListApi = async (idToken, url) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    const response = await axios.get(`${baseUrl}${url}`, config);
    return response?.data;
  } catch (error) {
    console.error("Error during logsListApi request:", error);
    throw error;
  }
};

// Define the async thunk for fetching logs
export const logsListReq = createAsyncThunk(
  "logs/fetchLogsList",
  async ({ idToken, url, key, dispatch }, { rejectWithValue }) => {
    try {
      const response = await logsListApi(idToken, url);
      return { response, key };
    } catch (error) {
      dispatch(returnErrors(error?.response?.data?.detail, 400));
      return rejectWithValue(error.response.data);
    }
  }
);

const logSlice = createSlice({
  name: "logs",
  initialState: {
    isLoading: false,
    isError: false,
    traderLogData: [],
    fundedLogData: [], 
    stage1LogsData: [],
    stage2LogsData: [],
    paymentLogData: [],
    affiliateLogData: [],
    changeEmailLogData: [],
    userSupportLogData: [],
    userIpLogData: [],
    changeEmailLogData: [],
    userLogData: [],
    couponLogData: [],
    payoutLogData: [],
    competitionLogData: [],
    count: 1,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logsListReq.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(logsListReq.fulfilled, (state, action) => {
        state.isLoading = false;
        state[action.payload?.key] = action.payload?.response?.results;
        state.count = action.payload?.response?.count;
      })
      .addCase(logsListReq.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default logSlice.reducer;

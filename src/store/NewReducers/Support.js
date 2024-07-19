import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {accountListReq} from "../../utils/apis/accountsApi";
import {returnErrors} from "../reducers/error";
import {returnMessages} from "../reducers/message";
import {PURGE} from "redux-persist";
import axios from "axios";
import {baseUrl} from "../../utils/api/apis";

async function supportListApi(idToken, query, url) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    let response;
    if (url) {
      response = await axios(`${baseUrl}${url}${query}`, config);
    } else {
      response = await axios(`${baseUrl}support/admin/get/cases/${query}`, config);
    }
    return response;
  } catch (error) {
    throw error;
  }
}

async function nestedTableApi(idToken, url, flag) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    let response;
    if (flag === true && url) {
      response = await axios.post(`${baseUrl}${url}`, {}, config);
    }
    if (flag === false && url) {
      response = await axios.get(`${baseUrl}${url}`, config);
    }
    return response;
  } catch (error) {
    console.log("error :", error);
    throw error;
  }
}

// Define the async thunk for account list
export const supportListReq = createAsyncThunk("support/fetchPhase1List", async ({idToken, query, url, dispatch}, {rejectWithValue}) => {
  try {
    const response = await supportListApi(idToken, query, url);
    return response;
  } catch (error) {
    dispatch(returnErrors("Error Fetching List...", 400));
    return rejectWithValue(error.response.data);
  }
});

export const nestedTableDataReq = createAsyncThunk("support/nestedDataFetch", async ({idToken, url, flag, dispatch}, {rejectWithValue}) => {
  try {
    const response = await nestedTableApi(idToken, url, flag);
    return response;
  } catch (error) {
    dispatch(returnErrors("Error Fetching List", 400));
    return rejectWithValue(error.response.data);
  }
});

const supportLists = createSlice({
  name: "supports",
  initialState: {
    isLoading: false,
    isError: false,
    data: [],
    count: 1,
    stageStatusOptions: [],
    nestedTableData: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(supportListReq.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(supportListReq.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data?.results || action.payload.data?.data?.results;
        state.count = action.payload.data.count || action.payload.data?.data?.count;
        state.stageStatusOptions = action.payload.data?.props?.status_type;
      })
      .addCase(supportListReq.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(nestedTableDataReq.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(nestedTableDataReq.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("action ", action.payload);
        state.nestedTableData = action.payload?.data?.data || action.payload?.data;
      })
      .addCase(nestedTableDataReq.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
    //   .addCase(PURGE, (state) => {
    //     state.isLoading= false;
    //     state.isError= false;
    //     state.payoutData= [];
    // });
  },
});

// Export the async thunk and any reducers if needed
export default supportLists.reducer;

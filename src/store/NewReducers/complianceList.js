import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {baseUrl} from "../../utils/api/apis";
import {returnErrors} from "../reducers/error";

async function getKycListApi(idToken, query) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    let response = await axios(`${baseUrl}v2/get-kyc/${query}`, config);
    return response;
  } catch (error) {
    throw error;
  }
}

export const getKycList = createAsyncThunk("compliance/fetchKycList", async ({idToken, query, dispatch}, {rejectWithValue}) => {
  try {
    const response = await getKycListApi(idToken, query);
    return response;
  } catch (error) {
    dispatch(returnErrors("Error while fetching KYC List!", 400));
    return rejectWithValue(error.response.data);
  }
});

async function getBillingListApi(idToken, query) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    let response = await axios(`${baseUrl}v2/get-billing-data/${query}`, config);
    return response;
  } catch (error) {
    throw error;
  }
}

export const getBillingList = createAsyncThunk("compliance/fetchBillingList", async ({idToken, query, dispatch}, {rejectWithValue}) => {
  try {
    const response = await getBillingListApi(idToken, query);
    return response;
  } catch (error) {
    dispatch(returnErrors("Error while fetching Billing List!", 400));
    return rejectWithValue(error.response.data);
  }
});

const complianceList = createSlice({
  name: "compliance_List",
  initialState: {
    isLoading: false,
    isError: false,
    data: [],
    count: 1,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getKycList.pending, (state) => {
        console.log("pending");
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getKycList.fulfilled, (state, action) => {
        console.log("pending");
        console.log(action.payload);
        state.isLoading = false;
        state.data = action.payload.data?.data?.results;
        state.count = action.payload.data?.data?.count;
      })
      .addCase(getKycList.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(getBillingList.pending, (state) => {
        console.log("pending");
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getBillingList.fulfilled, (state, action) => {
        console.log("pending");
        console.log(action.payload);
        state.isLoading = false;
        state.data = action.payload.data?.data?.results;
        state.count = action.payload.data?.data?.count;
      })
      .addCase(getBillingList.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default complianceList.reducer;

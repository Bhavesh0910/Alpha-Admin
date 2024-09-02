import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {baseUrl} from "../../utils/api/apis";
import {returnErrors} from "../reducers/error";

async function getBillingDetailsApi(idToken, email) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    let response = await axios(`${baseUrl}get/payouts/?email=${email}`, config);
    return response;
  } catch (error) {
    throw error;
  }
}

export const getBillingDetailsReq = createAsyncThunk("compliance/fetchgetBillingDetails", async ({idToken, email, dispatch}, {rejectWithValue}) => {
  try {
    const response = await getBillingDetailsApi(idToken, email);
    return response;
  } catch (error) {
    dispatch(returnErrors(error.response?.data?.detail || "Error while fetching BillingDetails!", 400));
    return rejectWithValue(error.response.data);
  }
});

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
    dispatch(returnErrors(error.response?.data?.detail || "Error while fetching KYC List!", 400));
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
    dispatch(returnErrors(error.response?.data?.detail || "Error while fetching Billing List!", 400));
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
    bilingDetailsData: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getKycList.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getKycList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data?.data?.results;
        state.count = action.payload.data?.data?.count;
      })
      .addCase(getKycList.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(getBillingList.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getBillingList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data?.data?.results;
        state.count = action.payload.data?.data?.count;
      })
      .addCase(getBillingList.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(getBillingDetailsReq.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getBillingDetailsReq.fulfilled, (state, action) => {
        console.log("action : ", action.payload?.data);
        state.isLoading = false;
        state.bilingDetailsData = action.payload?.data;
      })
      .addCase(getBillingDetailsReq.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default complianceList.reducer;

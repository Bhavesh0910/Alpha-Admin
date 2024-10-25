import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {baseUrl} from "../../utils/api/apis";
import axios from "axios";
import {PURGE} from "redux-persist";
import {returnErrors} from "../reducers/error";

async function updatePaymentStatusApi(idToken, body, id) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    const res = axios.patch(`${baseUrl}payments/admin/transaction/${id}/`, body, config);
    return res;
  } catch (error) {
    throw error;
  }
}

async function paymentListApi(idToken, query) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    const res = axios.get(`${baseUrl}v3-payments/${query}`, config);
    // const res = axios.get(`${baseUrl}payments/admin/transactions/list/${query}`, config);
    return res;
  } catch (error) {
    throw error;
  }
}

async function paymentHistoryApi(idToken, pageSize, pageNo, paymentEmail) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    const res = axios.get(`${baseUrl}v3/admin/export-history`, config);
    return res;
  } catch (error) {
    throw error;
  }
}

async function paymentExportsApi(idToken, query) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };

    const res = axios.get(`${baseUrl}export/payments/${query}`, config);
    return res;
  } catch (error) {
    throw error;
  }
}

export const updatePaymentStatusReq = createAsyncThunk("payment/updateStatus", async ({idToken, body, id, dispatch}, {rejectWithValue}) => {
  try {
    console.log(idToken);

    const response = await updatePaymentStatusApi(idToken, body, id);
    return response;
  } catch (error) {
    dispatch(returnErrors(error?.response?.data?.detail || "Error while fetching Payment List!", 400));
    return rejectWithValue(error.response.data);
  }
});

export const paymentListReq = createAsyncThunk("payoutList", async ({idToken, query, dispatch}, {rejectWithValue}) => {
  try {
    const response = await paymentListApi(idToken, query);
    return response;
  } catch (error) {
    dispatch(returnErrors(error?.response?.data?.detail || "Error while fetching Payment List!", 400));
    return rejectWithValue(error.response.data);
  }
});

export const paymentHistoryReq = createAsyncThunk("payoutList/history", async ({idToken, pageSize, pageNo, paymentEmail, dispatch}, {rejectWithValue}) => {
  try {
    const response = await paymentHistoryApi(idToken, pageSize, pageNo, paymentEmail);
    return response;
  } catch (error) {
    dispatch(returnErrors(error?.response?.data?.detail || "Error while fetching Payment List!", 400));
    return rejectWithValue(error.response.data);
  }
});

export const paymentExportsReq = createAsyncThunk("payoutList/exports", async ({idToken, query, dispatch}, {rejectWithValue}) => {
  try {
    const response = await paymentExportsApi(idToken, query);
    // .then((response) => {
    // window.open(response?.data?.s3_file_url, "_blank");
    // });
    return response;
  } catch (error) {
    dispatch(returnErrors(error?.response?.data?.detail || "Error while exporting file!", 400));
    return rejectWithValue(error.response.data);
  }
});

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    isLoading: false,
    isError: false,
    paymentData: [],
    count: 0,
    paymentHistoryData: [],
    paymentHistoryDataCount: 1,
    paymentEmail: "",
    exportHistoryData: [],
    exportLink: "",
    payoutData: [],
    refetch: false,
  },
  reducers: {
    resetPayout: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.paymentData = [];
      state.payoutData = [];
      state.paymentHistoryData = [];
      state.count = 1;
    },
    selectedEmail: (state, action) => {
      state.paymentEmail = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(paymentListReq.pending, (state) => {
        state.count = 0;
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(paymentListReq.fulfilled, (state, action) => {
        state.isLoading = false;
        // console.log(action.payload.data," : action payload")
        state.paymentData = action.payload?.data; // Update state with fetched data
        state.count = action.payload.data?.length; // Update state with fetched data
        state.paymentEmail = action.payload?.data[0]?.email;
      })
      .addCase(paymentListReq.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(paymentHistoryReq.pending, (state) => {
        state.count = 0;
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(paymentHistoryReq.fulfilled, (state, action) => {
        state.isLoading = false;
        // console.log(action.payload.data, " : action payload");
        state.paymentHistoryData = action.payload?.data; // Update state with fetched data
        state.count = action.payload.data?.length; // Update state with fetched data
      })
      .addCase(paymentHistoryReq.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(paymentExportsReq.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(paymentExportsReq.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exportHistoryData = action.payload.data;
        // console.log(action.payload?.data);
        state.exportLink = action.payload?.data; // Update state with fetched data
      })
      .addCase(paymentExportsReq.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(payoutListReq.pending, (state) => {
        state.count = 0;
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(payoutListReq.fulfilled, (state, action) => {
        state.isLoading = false;
        // console.log("Paypout paylaod .. ", action.payload);
        state.payoutData = action.payload?.data?.data; // Update state with fetched data
        state.count = action.payload?.data?.data?.count; // Update state with fetched data
      })
      .addCase(payoutListReq.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(updatePaymentStatusReq.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updatePaymentStatusReq.fulfilled, (state, action) => {
        state.isLoading = false;
        state.refetch = !state.refetch;
      })
      .addCase(updatePaymentStatusReq.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

// Export the async thunk and any reducers if needed
export const {resetPayout, selectedEmail} = paymentSlice.actions;
export default paymentSlice.reducer;

async function payoutListApi(idToken, query) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    const res = axios.get(`${baseUrl}v2/get-payout/${query}`, config);
    return res;
  } catch (error) {
    throw error;
  }
}

export const payoutListReq = createAsyncThunk("payment/payoutList", async ({idToken, query, dispatch}, {rejectWithValue}) => {
  try {
    const response = await payoutListApi(idToken, query);
    return response;
  } catch (error) {
    dispatch(returnErrors(error?.response?.data?.detail || "Error while fetching Payment List!", 400));
    return rejectWithValue(error.response.data);
  }
});

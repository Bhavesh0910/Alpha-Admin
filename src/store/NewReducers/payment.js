import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../utils/api/apis";
import axios from "axios";
import { PURGE } from "redux-persist";
import { returnErrors } from "../reducers/error";

async function paymentListApi(idToken,query) {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        };
        const res = axios.get(`${baseUrl}payments/admin/transactions/list/${query}`, config);
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
        const res = axios.get(`${baseUrl}payment/admin/payment-history/?email=${paymentEmail}&page_size=${pageSize}&page_no=${pageNo}`, config);
        return res;
    } catch (error) {
        throw error;
    }
}
async function paymentExportsApi(idToken, dates) {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        };
        const res = axios.get(`${baseUrl}payment/admin/payment-data-export/?from_date=${dates[0]}&to_date=${dates[1]}`, config);
        return res;
    } catch (error) {
        throw error;
    }
}

export const paymentListReq = createAsyncThunk(
    "payoutList",
    async ({ idToken, query, dispatch }, { rejectWithValue }) => {
        try {
            const response = await paymentListApi(idToken, query);
            return response;
        } catch (error) {
            dispatch(returnErrors(error?.response?.data?.detail || "Error while fetching Payment List!", 400))
            return rejectWithValue(error.response.data);
        }
    }
);

export const paymentHistoryReq = createAsyncThunk(
    "payoutList/history",
    async ({ idToken, pageSize, pageNo, paymentEmail, dispatch }, { rejectWithValue }) => {
        try {
            const response = await paymentHistoryApi(idToken, pageSize, pageNo, paymentEmail);
            return response;
        } catch (error) {
            dispatch(returnErrors(error?.response?.data?.detail || "Error while fetching Payment List!", 400))
            return rejectWithValue(error.response.data);
        }
    }
);

export const paymentExportsReq = createAsyncThunk(
    "payoutList/exports",
    async ({ idToken, dates, dispatch }, { rejectWithValue }) => {
        try {
            const response = await paymentExportsApi(idToken, dates);
            return response;
        } catch (error) {
            dispatch(returnErrors(error?.response?.data?.detail || "Error while exporting file!", 400))
            return rejectWithValue(error.response.data);
        }
    }
);

const paymentSlice = createSlice({
    name: "payment",
    initialState: {
        isLoading: false,
        isError: false,
        paymentData: [],
        count: 1,
        paymentHistoryData: [],
        paymentHistoryDataCount: 1,
        paymentEmail: "",
        exportLink: ""
    },
    reducers: {
        resetPayout: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.paymentData = [];
            state.paymentHistoryData = [];
            state.count = 1;
        },
        selectedEmail: (state, action) => {
            state.paymentEmail = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(paymentListReq.pending, (state) => {
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
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(paymentHistoryReq.fulfilled, (state, action) => {
                state.isLoading = false;
                console.log(action.payload.data, " : action payload")
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
                console.log(action.payload?.data);
                state.exportLink = action.payload?.data; // Update state with fetched data
            })
            .addCase(paymentExportsReq.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            })
        // .addCase(PURGE, (state) => {
        //     state.isLoading= false;
        //     state.isError= false;
        //     state.payoutData= [];
        // });

    },
});

// Export the async thunk and any reducers if needed
export const { resetPayout, selectedEmail } = paymentSlice.actions;
export default paymentSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../utils/api/apis";
import { PURGE } from "redux-persist";

// Define the async thunk for fetching account metrics
export const accountMetrics = createAsyncThunk(
    "accounts/fetchAccountMetrics",
    async ({ id, idToken }, { rejectWithValue }) => {
        // console.log(id, idToken, "fetching account metrics");
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            };

            const response = await axios.get(`${baseUrl}account/admin/metrics/${id}`, config);
            // console.log(response, "response");
            return response.data; // Assuming accountMetricsReq returns a response with data property
        } catch (error) {
            return rejectWithValue(
                error.response ? error.response.data : error.message
            );
        }
    }
);

export const getPlans = createAsyncThunk(
    "account/fundingEvaluationPlans",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${baseUrl}account/funding-evaluation/`);
            return response.data;
        } catch (error) {
            console.error("Error during get plans request:", error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const initialState = {
    isLoading: false,
    isError: false,
    data: [],
    error: null,
    plans: {
        isLoading: false,
        isError: false,
        data: [],
        selected_challenge: null,
        error: null,
        lastPaymentId: null,
    },
};

const accountMetricsSlice = createSlice({
    name: "accountMetrics",
    initialState,
    reducers: {
        resetAccountMetrics: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.data = [];
            state.error = null;
            state.plans = {
                isLoading: false,
                isError: false,
                data: [],
                selected_challenge: null,
                error: null,
                lastPaymentId: null,
            };
        },
        setSelectedChallenge: (state, action) => {
            state.plans.selected_challenge = action.payload;
        },
        setLastPayment: (state, action) => {
            state.plans.lastPaymentId = action.payload;
        },
        removeLastPayment: (state, action) => {
            state.plans.lastPaymentId = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(accountMetrics.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.error = null;
            })
            .addCase(accountMetrics.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(accountMetrics.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.error = action.payload || "Failed to fetch account metrics";
            })
            .addCase(getPlans.pending, (state) => {
                state.plans.isLoading = true;
                state.plans.isError = false;
                state.plans.error = null;
            })
            .addCase(getPlans.fulfilled, (state, action) => {
                state.plans.isLoading = false;
                state.plans.data = action.payload;
            })
            .addCase(getPlans.rejected, (state, action) => {
                state.plans.isLoading = false;
                state.plans.isError = true;
                state.plans.error = action.payload || "Failed to fetch plans";
            })
        // .addCase(PURGE, () => {
        //     return initialState;
        //   });
    },
});

export const {
    resetAccountMetrics,
    removeLastPayment,
    setLastPayment,
    setSelectedChallenge,
} = accountMetricsSlice.actions;

export default accountMetricsSlice.reducer;

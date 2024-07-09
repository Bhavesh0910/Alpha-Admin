import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../utils/api/apis";
import axios from "axios";
import { PURGE } from "redux-persist";
import { returnErrors } from "../reducers/error";

async function payoutListapi(idToken, pageSize, pageNo, searchText, activeTab, dates) {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        };
        const res = axios.get(`${baseUrl}user/admin/payout/?start_date=${dates ? dates[0] : ""}&end_date=${dates ? dates[1] : ""}&search=${searchText ? searchText : ""}&status=${activeTab}&page_size=${pageSize ? pageSize : 20}&page_no=${pageNo ? pageNo : 1}`, config);
        return res;

    } catch (error) {
        throw error;
    }
}

async function payoutListUpdateApi(idToken, id, updatedStatus) {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        };
        // const body = new Form
        const res = axios.put(`${baseUrl}user/admin/payout/${id}/`, updatedStatus, config);
        return res;

    } catch (error) {
        throw error;
    }
}

// Define the async thunk for account list
export const payoutListReq = createAsyncThunk(
    "payoutList",
    async ({ idToken, pageSize, pageNo, searchText, activeTab, dates, dispatch }, { rejectWithValue }) => {
        try {
            const response = await payoutListapi(idToken, pageSize, pageNo, searchText, activeTab, dates);
            return response; // Assuming accountListReq returns an object with data property
        } catch (error) {
            console.log("Error : ", error);
            dispatch(returnErrors(error?.response?.data?.detail || "Error while fetching Payout List!", 400))
            return rejectWithValue(error.response.data); // Return specific error data from API
        }
    }
);

export const payoutListUpdateReq = createAsyncThunk(
    "payoutList/update",
    async ({ idToken, id, updatedStatus, dispatch }, { rejectWithValue }) => {
        console.log(idToken, id, updatedStatus, dispatch, " : idToken, id, updatedStatus, dispatch")
        try {
            const response = await payoutListUpdateApi(idToken, id, updatedStatus);
            return response;
        } catch (error) {
            console.log("Error : ", error);
            dispatch(returnErrors(error?.response?.data?.detail || "Error while fetching Payout List!", 400))
            return rejectWithValue(error.response.data);
        }
    }
);

const payoutSlice = createSlice({
    name: "payout",
    initialState: {
        isLoading: false,
        isError: false,
        payoutData: [],
        count: 1
    },
    reducers: {
        resetPayout: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.payoutData = [];
            state.count = 1;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(payoutListReq.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(payoutListReq.fulfilled, (state, action) => {
                // console.log("Action payload oof payout slice : ", action.payload)
                state.isLoading = false;
                state.payoutData = action.payload?.results; // Update state with fetched data
                state.count = action.payload?.count; // Update state with fetched data
            })
            .addCase(payoutListReq.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            })
            .addCase(payoutListUpdateReq.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(payoutListUpdateReq.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
            })
            .addCase(payoutListUpdateReq.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            })
    },
});

// Export the async thunk and any reducers if needed
export const { resetPayout } = payoutSlice.actions;
export default payoutSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../utils/api/apis";
import axios from "axios";
import { PURGE } from "redux-persist";
import { returnErrors } from "../reducers/error";

async function paymentReq(idToken, pageSize, pageNo, searchText, activeTab, dates) {

    try {
        const config = {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        };
        console.log("Search : ",idToken, pageSize, pageNo, searchText, activeTab, dates)
        const res = axios.get(`${baseUrl}payment/admin/list/?start_date=${dates[0]}&end_date=${dates[1]}&search=${searchText}&status=${activeTab === "all" ? "" : activeTab}&page_size=${pageSize}&page_no=${pageNo}`, config);
        // const res = axios.get(`${baseUrl}payment/admin/list/`, config);
        return res;

    } catch (error) {
        throw error;
    }
}

// Define the async thunk for account list
export const paymentListReq = createAsyncThunk(
    "payoutList",
    async ({ idToken, pageSize, pageNo, searchText, activeTab, dates, dispatch }, { rejectWithValue }) => {
        try {
            const response = await paymentReq(idToken, pageSize, pageNo, searchText, activeTab, dates);
            return response; // Assuming accountListReq returns an object with data property
        } catch (error) {
            console.log("Error : ", error);
            dispatch(returnErrors(error?.response?.data?.detail || "Error while fetching Payment List!", 400))
            return rejectWithValue(error.response.data); // Return specific error data from API
        }
    }
);

const paymentSlice = createSlice({
    name: "payment",
    initialState: {
        isLoading: false,
        isError: false,
        paymentData: [],
        count: 1
    },
    reducers: {
        resetPayout: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.paymentData = [];
            state.count = 1;
        },
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
            })
            .addCase(paymentListReq.rejected, (state) => {
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
export const { resetPayout } = paymentSlice.actions;
export default paymentSlice.reducer;

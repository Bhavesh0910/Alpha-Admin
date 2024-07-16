import { createSlice, createAsyncThunk, isAction } from "@reduxjs/toolkit";
import { baseUrl } from "../../utils/api/apis";
import axios from "axios";
import { PURGE } from "redux-persist";
import { returnErrors } from "../reducers/error";

// Define the async thunk for account list
export const createCoupon = createAsyncThunk(
    "coupon/create",
    async ({ idToken, dispatch }, { rejectWithValue }) => {
        try {
            const response = await createCouponReq(idToken);
            return response; // Assuming accountListReq returns an object with data property
        } catch (error) {
            console.log("Error : ", error);
            dispatch(returnErrors(error?.response?.data?.detail || "Error while fetching Payment List!", 400))
            return rejectWithValue(error.response.data); // Return specific error data from API
        }
    }
);
export const editCoupon = createAsyncThunk(
    "couponsList/edit",
    async ({ idToken, id, body }, { rejectWithValue }) => {
        console.log("ljnjlljklkj ", idToken, id, body)
        try {
            const response = await patchCouponReq(idToken, id, body);
            return response?.data;
        } catch (error) {
            throw error;
        }
    }
);
export const getCoupons = createAsyncThunk(
    "couponsList/fetch",
    async ({ idToken, activeTab, searchText, pageSize, pageNo, dates, dispatch }, { rejectWithValue }) => {
        // async (idToken, { rejectWithValue }) => {
        try {
            // const response = await getCouponsReq(idToken);
            const response = await getCouponsReq(idToken, activeTab, searchText, pageSize, pageNo, dates,);
            return response?.data;
        } catch (error) {
            console.log("Error : ", error);
            dispatch(returnErrors(error?.response?.data?.detail || "Error while fetching Payment List!", 400))
            return rejectWithValue(error.response.data); // Return specific error data from API
        }
    }
);

const couponSlice = createSlice({
    name: "coupon",
    initialState: {
        isLoading: false,
        isError: false,
        couponData: [],
        count: 1,
        editCouponData: {},
        refresh: false
    },
    reducers: {
        resetCoupons: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.couponData = [];
            state.count = 1;
            state.editCouponData = {};
        },
        // setEditCoupon: (state, action) => {
        //     state.editCouponData = action.payload;
        // },
        setCouponRefresh: (state) => {
            state.refresh = !state.refresh;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCoupons.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getCoupons.fulfilled, (state, action) => {
                state.isLoading = false;

                if (action.payload?.length >= 1) {
                    state.couponData = action.payload;
                    state.count = action.payload?.length;

                } else {
                    state.couponData = [action.payload];
                }
            })
            .addCase(getCoupons.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            })

            .addCase(editCoupon.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(editCoupon.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.refresh = !state.refresh;
            })
            .addCase(editCoupon.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            })

            .addCase(createCoupon.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(createCoupon.fulfilled, (state, action) => {
                state.isLoading = false;
                console.log(action.payload, " : action payload coupon");
                // state.couponData = action.payload?.data; // Update state with fetched data
                state.count = action.payload.data?.length; // Update state with fetched data
            })
            .addCase(createCoupon.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            })
    },
});

// Export the async thunk and any reducers if needed
export const { resetCoupons, setCouponRefresh } = couponSlice.actions;
export default couponSlice.reducer;


export async function getCouponsReq(idToken, activeTab, searchText, pageSize = 20, pageNo = 1, dates,) {
    let queries = []
    queries.push(`page=${pageNo}`)
    queries.push(`page_size=${pageSize}`)

    // Search Box
    searchText && queries.push(`search=${searchText}`)
    const query = queries.join('&')
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        };
        // const res = axios.get(`${baseUrl}payment/admin/coupon/?start_date=${dates[0]}&end_date=${dates[1]}&search=${searchText}&status=${activeTab === "all" ? "" : activeTab}&page_size=${pageSize}&page_no=${pageNo}`, config);
        const res = axios.get(`${baseUrl}v2/list/coupon/?${query}`, config);

        return res;

    } catch (error) {
        throw error;
    }
}

export async function patchCouponReq(idToken, id, body) {
    console.log(idToken, id, body)
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        };

        const res = axios.patch(`${baseUrl}v2/create/coupon/`, body, config);
        return res;

    } catch (error) {
        throw error;
    }
}

async function createCouponReq(idToken) {

    try {
        const config = {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        };
        // console.log("Search : ",idToken, pageSize, pageNo, searchText, activeTab, dates)
        // const res = axios.get(`${baseUrl}payment/admin/list/?start_date=${dates[0]}&end_date=${dates[1]}&search=${searchText}&status=${activeTab === "all" ? "" : activeTab}&page_size=${pageSize}&page_no=${pageNo}`, config);
        const res = axios.post(`${baseUrl}v2/create/coupon/`, config);
        return res;

    } catch (error) {
        throw error;
    }
}

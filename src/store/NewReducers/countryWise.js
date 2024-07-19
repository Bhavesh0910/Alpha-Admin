import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { returnErrors } from "../reducers/error";
import { baseUrl } from "../../utils/api/apis";
import axios from "axios";


export const countryWiseList = async (idToken, query) => {

    try {
        const config = {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        };

        let response = await axios.get(`${baseUrl}v2/risk-management/${query && query}`, config);

        return response.data;
    } catch (error) {
        throw error;
    }
}

// Define the async thunk for account list
export const countryWiseListReq = createAsyncThunk(
    "countryWise/countryWiseList",
    async ({ idToken, query, dispatch }, { rejectWithValue }) => {
        try {

            const response = await countryWiseList(idToken, query);
            return response;
        } catch (error) {
            dispatch(returnErrors("Error Fetching List...", 400));
            return rejectWithValue(error.response.data);
        }
    }
);

const countryWiseSlice = createSlice({
    name: "countryWise",
    initialState: {
        isLoading: false,
        isError: false,
        listData: [],
        count: 1,
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(countryWiseListReq.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(countryWiseListReq.fulfilled, (state, action) => {
                console.log("Action payload oof acc slice : ", action.payload)
                state.isLoading = false;
                state.listData = action.payload?.data; // Update state with fetched data
                state.totalItems = action.payload?.data?.length; // Update state with fetched data
            })
            .addCase(countryWiseListReq.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            })
        //   .addCase(PURGE, (state) => {
        //     state.isLoading= false;
        //     state.isError= false;
        //     state.payoutData= [];
        // });
    },
});

// Export the async thunk and any reducers if needed
export default countryWiseSlice.reducer;


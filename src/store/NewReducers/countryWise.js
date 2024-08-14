import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {returnErrors} from "../reducers/error";
import {baseUrl} from "../../utils/api/apis";
import axios from "axios";

export const countryWiseList = async (idToken, query) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };

    let response = await axios.get(`${baseUrl}v2/risk-management/${query && query}`, config);
    // let response = await axios.get(`${baseUrl}v4/country-wise-overview/${query && query}`, config);
    // let response1 = await axios.get(`${baseUrl}v2/payout-percentage/${query && query}`, config);
    // let response2 = await axios.get(`${baseUrl}v2/payment-percentage/${query && query}`, config);

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Define the async thunk for account list
export const countryWiseListReq = createAsyncThunk("countryWise/countryWiseList", async ({idToken, query, dispatch}, {rejectWithValue}) => {
  try {
    const response = await countryWiseList(idToken, query);
    return response;
  } catch (error) {
    dispatch(returnErrors("Error Fetching List...", 400));
    return rejectWithValue(error.response.data);
  }
});

const countryWiseSlice = createSlice({
  name: "countryWise",
  initialState: {
    isLoading: false,
    isError: false,
    listData: [],
    filterListData: [],
    flag: false,
    count: 1,
  },
  reducers: {
    setCountryWiseData: (state, action) => {
      state.listData = action.payload;
      state.count = action.payload.length;
    },
    resetCountryWiseData: (state) => {
      state.listData = state.filterListData;
      state.count = state.filterListData.length;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(countryWiseListReq.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(countryWiseListReq.fulfilled, (state, action) => {
        console.log("Action payload oof acc slice : ", action.payload);
        state.isLoading = false;
        state.listData = action.payload?.data; // Update state with fetched data
        state.filterListData = action.payload?.data; // Update state with fetched data
        state.totalItems = action.payload?.data?.length; // Update state with fetched data
      })
      .addCase(countryWiseListReq.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

// Export the async thunk and any reducers if needed
export const {resetCountryWiseData, setCountryWiseData} = countryWiseSlice.actions;
export default countryWiseSlice.reducer;

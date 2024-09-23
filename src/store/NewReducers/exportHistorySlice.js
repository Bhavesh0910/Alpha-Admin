import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {baseUrl} from "../../utils/api/apis";
import axios from "axios";
import {returnErrors} from "../reducers/error";

export const fetchExportHistoryApi = async (idToken, url, query) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };

    console.log("query", query);
    const response = await axios.get(`${baseUrl}${url}`, config);
    return response.data;
  } catch (error) {
    console.error("Error during fetchExportHistoryApi request:", error);
    throw error;
  }
};

export const fetchExportHistoryReq = createAsyncThunk("exportHistory/fetchExportHistory", async ({idToken, url, query, dispatch}, {rejectWithValue}) => {
  try {
    const response = await fetchExportHistoryApi(idToken, url, query);
    return response;
  } catch (error) {
    dispatch(returnErrors(error?.response?.data?.detail || "Error while fetching export history", 400));
    return rejectWithValue(error.response?.data || "An error occurred");
  }
});

const exportHistorySlice = createSlice({
  name: "exportHistory",
  initialState: {
    isLoading: false,
    isError: false,
    exportHistoryData: null,
    errorMessage: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExportHistoryReq.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(fetchExportHistoryReq.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exportHistoryData = action.payload;
      })
      .addCase(fetchExportHistoryReq.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export default exportHistorySlice.reducer;

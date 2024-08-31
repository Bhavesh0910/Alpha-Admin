import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../utils/api/apis";
import { returnErrors } from "../reducers/error";

const exportDataApi = async (idToken, url) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    const response = await axios.get(`${baseUrl}${url}`, config);
    return response.data;
  } catch (error) {
    console.error("Error during exportDataApi request:", error);
    throw error;
  }
};

export const exportDataReq = createAsyncThunk(
  "export/exportData",
  async ({ idToken, url }, { rejectWithValue }) => {
    try {
      const response = await exportDataApi(idToken, url);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const exportSlice = createSlice({
  name: "export",
  initialState: {
    isLoading: false,
    isError: false,
    exportData: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(exportDataReq.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(exportDataReq.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exportData = action.payload;
      })
      .addCase(exportDataReq.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});


export default exportSlice.reducer;

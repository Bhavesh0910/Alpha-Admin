import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { baseUrl } from '../../utils/api/apis';
import axios from 'axios';



export const fetchExportHistoryApi = async (idToken, url) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    const response = await axios.get(`${baseUrl}${url}`, config);
    return response.data;
  } catch (error) {
    console.error('Error during fetchExportHistoryApi request:', error);
    throw error;
  }
};

export const fetchExportHistoryReq = createAsyncThunk(
    'exportHistory/fetchExportHistory',
    async ({ idToken, url }, { rejectWithValue }) => {
      try {
        const response = await fetchExportHistoryApi(idToken, url);
        return response;
      } catch (error) {
        return rejectWithValue(error.response?.data || 'An error occurred');
      }
    }
  );

const exportHistorySlice = createSlice({
  name: 'exportHistory',
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

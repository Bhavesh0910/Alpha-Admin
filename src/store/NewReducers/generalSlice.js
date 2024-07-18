import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { returnErrors } from '../reducers/error';
import { getGeneralLog } from '../../utils/api/apis';

export const fetchGeneralLog = createAsyncThunk(
  'general/fetchGeneralLog',
  async ({ idToken, pageNo, pageSize, search }, { dispatch, rejectWithValue }) => {
    try {
      const response = await getGeneralLog(idToken, pageNo, pageSize, search);
      return response;
    } catch (error) {
      const msg = error.response?.data?.detail || 'Error fetching general log data';
      dispatch(returnErrors(msg, 400));
      return rejectWithValue(msg);
    }
  }
);

const generalSlice = createSlice({
  name: 'general',
  initialState: {
    generalLogData: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGeneralLog.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGeneralLog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.generalLogData = action.payload;
      })
      .addCase(fetchGeneralLog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default generalSlice.reducer;

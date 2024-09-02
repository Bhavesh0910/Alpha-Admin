import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getUserDetailsReq, updateUserDetailsRequest } from '../../utils/api/apis';
import { returnErrors } from '../reducers/error';

// Thunk to fetch user details
export const fetchUserDetails = createAsyncThunk(
  'user/fetchUserDetails',
  async ({ idToken }, { rejectWithValue, dispatch }) => {
    try {

      const response = await getUserDetailsReq(idToken); // Assuming this function makes the GET request
      return response;
    } catch (error) {
      dispatch(returnErrors(error.response?.data?.detail || "Error Fetching User Details...", 400)); // Dispatch error action if request fails
      return rejectWithValue(error.response.data); // Return error payload to be handled
    }
  }
);

// Thunk to update user details
export const updateUserDetails = createAsyncThunk(
  'user/updateUserDetails',
  async ({ formData, idToken }, { rejectWithValue, dispatch }) => {
    try {
     
      const response = await updateUserDetailsRequest({ formData, idToken }); // Assuming this function makes the PATCH request
      return response;
    } catch (error) {
      dispatch(returnErrors(error.response?.data?.detail || "Error Updating User Details...", 400)); // Dispatch error action if request fails
      return rejectWithValue(error.response.data); // Return error payload to be handled
    }
  }
);

const initialState = {
  userDetails: null,
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userDetails = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateUserDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userDetails = action.payload;
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
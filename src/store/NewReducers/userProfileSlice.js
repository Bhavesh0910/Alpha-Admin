import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl, requestPasswordResetApi } from '../../utils/api/apis'; 
import { returnErrors } from '../reducers/error';  
import { returnMessages } from '../reducers/message';

export const getUserProfileData = createAsyncThunk(
  'fetchUserProfileData',
  async ({ idToken, dispatch }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      };
      const response = await axios(`${baseUrl}v3/user/profile/get/`, config);
      return response.data;
    } catch (error) {
      dispatch(returnErrors(error.response?.data?.detail || 'Error while fetching User Data!', 400));
      return rejectWithValue(error.response.data);
    }
  }
);

export const requestPasswordReset = createAsyncThunk(
  'requestPasswordReset',
  async ({idToken , email, dispatch }, { rejectWithValue }) => {
    try {
      const data = await requestPasswordResetApi(idToken ,email);
      dispatch(returnMessages("Reset password link sent to your email", 200));
      return data;
    } catch (error) {
      dispatch(returnErrors(error.response?.data?.detail || 'Error while requesting password reset!', 400));
      return rejectWithValue(error.response.data);
    }
  }
);

const userProfileData = createSlice({
  name: 'user_profile_data',
  initialState: {
    isLoading: false,
    isError: false,
    isSuccess: false,
    data: [],
    resetLoading: false,
    resetError: false,
    resetSuccess: false,
    resetMessage: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfileData.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getUserProfileData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(getUserProfileData.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(requestPasswordReset.pending, (state) => {
        state.resetLoading = true;
        state.resetError = false;
        state.resetSuccess = false;
        state.resetMessage = '';
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.resetLoading = false;
        state.resetSuccess = true;
        state.resetMessage = 'Password reset email sent successfully!';
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.resetLoading = false;
        state.resetError = true;
        state.resetMessage = action.payload || 'Failed to send password reset email.';
      });
  },
});

export default userProfileData.reducer;

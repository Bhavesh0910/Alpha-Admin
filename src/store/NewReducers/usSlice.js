import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { returnErrors } from "../reducers/error";
import { requestPayout, updateUserEmail } from "../../utils/api/apis";
import { returnMessages } from "../reducers/message";

export const updateUserEmailThunk = createAsyncThunk(
  "user/updateUserEmail",
  async ({ idToken, payload }, { dispatch, rejectWithValue }) => {
    try {
      const response = await updateUserEmail(idToken, payload);
      dispatch(returnMessages("Email Updated Successfully", 200));
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.detail || "Error updating user email";
      dispatch(returnErrors(msg, 400));
      return rejectWithValue(msg);
    }
  }
);

export const requestPayoutThunk = createAsyncThunk(
  "user/requestPayout",
  async ({ idToken, payload }, { dispatch, rejectWithValue }) => {
    try {
      const response = await requestPayout(idToken, payload);
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.detail || "Error requesting payout";
      dispatch(returnErrors(msg, 400));
      return rejectWithValue(msg);
    }
  }
);

const usSlice = createSlice({
  name: "user",
  initialState: {
    emailUpdateData: null,
    payoutRequestData: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateUserEmailThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserEmailThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.emailUpdateData = action.payload;
      })
      .addCase(updateUserEmailThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(requestPayoutThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(requestPayoutThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.payoutRequestData = action.payload;
      })
      .addCase(requestPayoutThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default usSlice.reducer;

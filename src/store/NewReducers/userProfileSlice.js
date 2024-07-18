import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {isError} from "lodash";
import {baseUrl} from "../../utils/api/apis";
import {returnErrors} from "../reducers/error";

async function getUserProfileApi(idToken) {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    };
    let response = await axios(`${baseUrl}v3/user/profile/get/`, config);
    return response;
  } catch (error) {
    throw error;
  }
}

export const getUserProfileData = createAsyncThunk("fetchUserProfileData", async ({idToken, dispatch}, {rejectWithValue}) => {
  try {
    const response = await getUserProfileApi(idToken);
    return response;
  } catch (error) {
    dispatch(returnErrors("Error while fetching User Data!", 400));
    return rejectWithValue(error.response.data);
  }
});

const userProfileData = createSlice({
  name: "user_profile_data",
  initialState: {
    isLoading: false,
    isError: false,
    data: [],
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
        state.data = action.payload.data;
      })
      .addCase(getUserProfileData.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default userProfileData.reducer;

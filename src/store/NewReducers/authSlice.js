import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import dayjs from "dayjs";
import {baseUrl} from "../../utils/api/apis";
import {returnErrors} from "../reducers/error";
import axios from "axios";
import {PURGE} from "redux-persist";

export const refreshTokenReq = createAsyncThunk("auth/refreshToken", async (refreshToken, {dispatch, rejectWithValue}) => {
  try {
    const response = await hitRefreshTokenApi(refreshToken);
    console.log("Refresh Token response : ", response);
    dispatch(setAuthenticationStatus(response));
    return response;
  } catch (error) {
    const msg = error.response?.data?.detail || "Error fetching withdrawals status";
    dispatch(returnErrors(msg, 400));
    return rejectWithValue(msg);
  }
});

export const hitRefreshTokenApi = async (refreshToken) => {
  try {
    const response = await axios.post(`${baseUrl}get/refreshtoken/`, {refresh_token: refreshToken});
    return response;
  } catch (error) {
    throw error;
  }
};

const initialState = {
  isAuthenticated: false,
  idToken: null,
  refreshToken: null,
  isLoading: false,
  searchDates: [dayjs().subtract(7, "day").format("YYYY-MM-DD"), dayjs().format("YYYY-MM-DD")],
  refreshCount: 0,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authenticate: (state, action) => {
      // const payload = action.payload;
      //
    },
    deAuthenticate: (state) => {
      state.isAuthenticated = false;
      state.idToken = null;
      state.refreshToken = null;
      state.isLoading = false;
    },
    incrementRefreshCount: (state, action) => {
      state.refreshCount = action.payload;
    },
    setAuthenticationStatus: (state, action) => {
      //
      if (!action.payload === false) {
        state.isAuthenticated = true;
        state.idToken = action.payload.data.idToken;
        state.refreshToken = action.payload.data.refreshToken;
      } else {
        state.isAuthenticated = action.payload;
        //
      }
    },
    setIsLoading: (state, action) => {
      return {...state, isLoading: action.payload};
    },
    setDatesMethod: (state, action) => {
      state.searchDates = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => {
      return initialState;
    });
  },
});

export const {authenticate, deAuthenticate, incrementRefreshCount, setAuthenticationStatus, setIsLoading, setDatesMethod} = authSlice.actions;
export default authSlice.reducer;

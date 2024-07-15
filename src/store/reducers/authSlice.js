import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";

const initialState = {
  isAuthenticated: false,
  idToken: null,
  refreshToken: null,
  isLoading: false,
  searchDates: [ dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
  dayjs().format('YYYY-MM-DD')],
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
      return { ...state, isLoading: action.payload }
    },
    setDatesMethod: (state, action) => {
      state.searchDates = action.payload;
    }
  },
  // extraReducers: (builder) => {
  //   builder.addCase(PURGE, () => {
  //     return initialState;
  //   });
  // },
});

export const { authenticate, deAuthenticate, setAuthenticationStatus, setIsLoading, setDatesMethod } =
  authSlice.actions;
export default authSlice.reducer;

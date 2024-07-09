import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

const initialState = {
  compData: [],
  isLoading: false,
};

const compSlice = createSlice({
  name: "comp",
  initialState,
  reducers: {
    getCompData: (state) => {
      state.isLoading = true;
    },
    getCompDataSuccess: (state, action) => {
      state.compData = action.payload;
      state.isLoading = false;
    },
    getCompDataFailure: (state) => {
      state.isLoading = false;
    },
    createCompData: (state) => {},
    createCompDataSuccess: (state, action) => {
      // state.compData = action.payload;
    },
    setCompData: (state, action) => {
      //
    },
    setCompDataSuccess: (state, action) => {
      return state
    },
    deleteComp: (state, action) => {
      //
    },
    deleteCompSuccess: (state, action) => {
      state.compData = state.compData.filter(
        (comp) => comp.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => {
      return initialState;
    });
  },
});

export const {
  getCompData,
  getCompDataSuccess,
  getCompDataFailure,
  createCompData,
  createCompDataSuccess,
  setCompData,
  setCompDataSuccess,
  deleteComp,
  deleteCompSuccess,
} = compSlice.actions;
export default compSlice.reducer;

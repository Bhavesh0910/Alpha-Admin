import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

const initialState = {
  support: [],
  isLoading: false,
  error: null,
};

const supportSlice = createSlice({
  name: "support",
  initialState,
  reducers: {
    getSupportData: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getSupportDataSuccess: (state, action) => {
      state.support = action.payload;
      //
      state.isLoading = false;
      state.error = null;
    },
    getSupportFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    createSupportData: () => {},
    createSupportDataSuccess: (state, action) => {
      const createdData = action.payload;
      if (createdData) {
        state.support = [...state.support, createdData];
      }
    },
    setSupport: () => {},
    setSupportSuccess: (state, action) => {
      //
      //
      const newPlan = action.payload;
      if (newPlan && newPlan.id) {
        const existingIndex = state.support.findIndex(
          (plan) => plan.id === newPlan.id
        );
        if (existingIndex !== -1) {
          state.support[existingIndex] = newPlan;
        } else {
          state.support = [...state.support, newPlan];
        }
      }
    },
    setSupportFailure: (state, action) => {},
    deleteSupport: () => {},
      deleteSupportSuccess: (state, action) => {
      //
      // state.support = state.support.filter(
      //   (plan) => plan.id !== action.payload
      // );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => {
      return initialState;
    });
  },
});

export const {
  getSupportData,
  getSupportDataSuccess,
  getSupportFailure,
  createSupportData,
  createSupportDataSuccess,
  setSupport,
  setSupportSuccess,
  setSupportFailure,
  deleteSupport,
  deleteSupportSuccess,
} = supportSlice.actions;

export default supportSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

const initialState = {
  plans: [],
  isLoading: false,
  error: null,
};

const plansSlice = createSlice({
  name: "plans",
  initialState,
  reducers: {
    getPlansData: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getPlansDataSuccess: (state, action) => {
      state.plans = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    getPlansDataFailure: (state, action) => {
      state.error = action.payload;

      state.isLoading = false;
    },
    createPlansData: (state) => {
      state.error = null;
    },
    createPlansDataSuccess: (state, action) => {
      const createdPlan = action.payload;
      if (createdPlan) {
        state.plans = [...state.plans, createdPlan];
        state.error = false;
      }
    },

    createPlansDataFailure: (state, action) => {
      //
      state.error = true;
      state.isLoading = false;
    },
    setPlansData: (state) => {
      //
      state.error = null;
    },
    setPlansDataSuccess: (state, action) => {
      const updatedPlan = action.payload;

      if (updatedPlan) {
        const planIndex = state.plans.findIndex(
          (plan) => plan.id === updatedPlan.id
        );

        if (planIndex !== -1) {
          state.plans[planIndex] = updatedPlan;
          //
          state.error = null;
        }
      }
    },
    deletePlans: (state) => {
      state.error = null;
    },
    deletePlansSuccess: (state, action) => {
      state.plans = state.plans.filter((plan) => plan.id !== action.payload);
      state.error = null;
    },
    deletePlansFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => {
      return initialState;
    });
  },
});

export const {
  getPlansData,
  getPlansDataSuccess,
  getPlansDataFailure,
  createPlansData,
  createPlansDataSuccess,
  createPlansDataFailure,
  setPlansData,
  setPlansDataSuccess,
  deletePlans,
  deletePlansSuccess,
  deletePlansFailure,
} = plansSlice.actions;

export default plansSlice.reducer;

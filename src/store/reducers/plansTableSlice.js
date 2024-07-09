import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

const initialState = {
  plansTable: [],
  isLoading: false,
  error: null
};

const plansTableSlice = createSlice({
  name: "plansTable",
  initialState,
  reducers: {
    getPlansTableData: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getPlansTableDataSuccess: (state, action) => {
      state.plansTable = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    getPlansTableFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    createPlansTableData: () => {},
    createPlansTableDataSuccess: (state, action) => {
      const createdData = action.payload;
      if (createdData) {
        state.plansTable = [...state.plansTable, createdData];
      }
    },
    setPlansTableData: ()=>{},
    setPlansTableDataSuccess: (state, action) => {
      const newPlan = action.payload;
      if (newPlan && newPlan.id) {
        const existingIndex = state.plansTable.findIndex((plan) => plan.id === newPlan.id);
        if (existingIndex !== -1) {
          state.plansTable[existingIndex] = newPlan;
        } else {
          state.plansTable = [...state.plansTable, newPlan];
        }
      }
    },
    deletePlansTable:() => {},
    deletePlansTableSuccess: (state, action) => {
      state.plansTable = state.plansTable.filter((plan) => plan.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => {
      return initialState;
    });
  },
});

export const {
  getPlansTableData,
  getPlansTableDataSuccess,
  getPlansTableFailure,
  createPlansTableData,
  createPlansTableDataSuccess,
  setPlansTableData,
  setPlansTableDataSuccess,
  deletePlansTable,
  deletePlansTableSuccess,
} = plansTableSlice.actions;

export default plansTableSlice.reducer;

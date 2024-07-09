import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

const initialState = {
   affiliateData: [],
   isLoading: false,
};

const affiliateSlice = createSlice({
   name: "affiliate",
   initialState,
   reducers: {
      getAffiliateData: (state) => {
         state.isLoading = true;
      },
      getAffiliateDataSuccess: (state, action) => {
         state.affiliate = action.payload; 
         state.isLoading = false
      },
      getAffiliateDataFailure: (state) => {
         state.isLoading = false
      },
      createAffiliateData:(state) => {

      },
      createAffiliateDataSuccess:(state , action)=>{
        state.affiliateData = action.payload; 

      }
   },
   extraReducers: (builder) => {
      builder.addCase(PURGE, () => {
        return initialState;
      });
    },
});

export const { getAffiliateData , getAffiliateDataSuccess , getAffiliateDataFailure , createAffiliateData , createAffiliateDataSuccess} = affiliateSlice.actions;
export default affiliateSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

const initialState = {
   advData: [],
   isLoading: false,
};

const advSlice = createSlice({
   name: "adv",
   initialState,
   reducers: {
      getAdvData: (state) => {
         state.isLoading = true;
      },
      getAdvDataSuccess: (state, action) => {
         //
         state.advData = action.payload; 
         state.isLoading = false
      },
      getAdvDataFailure: (state) => {
         state.isLoading = false
      },
      createAdvData:(state) => {

      },
      createadvDataSuccess:(state , action)=>{
        state.advData = action.payload; 

      },
      deleteAdv: (state, action) => {
         //
      },
      deleteAdvSuccess: (state, action) => {
         state.advData= state.advData.filter((adv) => adv.id !== action.payload);

      },
      setAdvData:(state , action) => {
      //  
      },
      setAdvDataSuccess:(state , action) => {
         //
         if (action.payload !== null) {
            return {
              ...state,
              advData: action.payload,
            };
          } else {
            return state;
          }
        }
   },
   extraReducers: (builder) => {
      builder.addCase(PURGE, () => {
        return initialState;
      });
    },

});

export const { getAdvData , getAdvDataSuccess , getAdvDataFailure , createAdvData , createAdvDataSuccess , deleteAdv ,deleteAdvSuccess , setAdvData , setAdvDataSuccess} = advSlice.actions;
export default advSlice.reducer;

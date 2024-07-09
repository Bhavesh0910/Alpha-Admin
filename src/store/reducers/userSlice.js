import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

const initialState = {};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      if (action.payload !== null) {
        //
        return  action.payload ;
      } else {
        return null;
      }
    },
    getUser: (action) => {

    },
    patchUser: (state,action) => {
        

    }
    
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => {
      return initialState;
    });
  },
});

export const { setUser, getUser, patchUser } = userSlice.actions;
export default userSlice.reducer;

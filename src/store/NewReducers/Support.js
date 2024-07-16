import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { accountListReq } from "../../utils/apis/accountsApi";
import { returnErrors } from "../reducers/error";
import { returnMessages } from "../reducers/message";
import { PURGE } from "redux-persist";
import axios from "axios";
import { baseUrl } from "../../utils/api/apis";


async function getStage1ListApi(idToken, query){
    try {
        const config = {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          };
      
        const response = await axios(`${baseUrl}support/admin/get/cases/`,config)
        return response;
    } catch (error) {
        throw error;
    }
}

// Define the async thunk for account list
export const getStage1List = createAsyncThunk(
  "support/fetchPhase1List",
  async ({ idToken, query, dispatch }, { rejectWithValue }) => {
    try {
      const response = await getStage1ListApi(idToken, query);
      return response;
    } catch (error) {
      dispatch(returnErrors("Error Fetching List...", 400));
      return rejectWithValue(error.response.data);
    }
  }
);

const supportLists = createSlice({
  name: "supports",
  initialState: {
    isLoading: false,
    isError: false,
    data: [],
    count: 1,
  },
  reducers: {
  
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStage1List.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getStage1List.fulfilled, (state, action) => {
        // console.log("Action payload oof acc slice : ",action.payload)
        state.isLoading = false;
        console.log("Action : ",action);
        console.log("Action ;payload : ",action.payload.data);

        state.data = action.payload.data.results;
        state.count = action.payload.data.count;

        // state.data = action.payload?.results; // Update state with fetched data
        // state.totalItems = action.payload?.count; // Update state with fetched data
      })
      .addCase(getStage1List.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
    //   .addCase(PURGE, (state) => {
    //     state.isLoading= false;
    //     state.isError= false;
    //     state.payoutData= [];
    // });
  },
});

// Export the async thunk and any reducers if needed
export default supportLists.reducer;


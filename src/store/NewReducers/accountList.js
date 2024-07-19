import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { accountListReq } from "../../utils/apis/accountsApi";
import { returnErrors } from "../reducers/error";
import { returnMessages } from "../reducers/message";
import { PURGE } from "redux-persist";

// Define the async thunk for account list
export const accountList = createAsyncThunk(
  "accounts/fetchAccountList",
  async ({ idToken, query, platform, dispatch }, { rejectWithValue }) => {
    try {

      const response = await accountListReq(idToken, query, platform);
      return response;
    } catch (error) {
      dispatch(returnErrors("Error Fetching List...", 400));
      return rejectWithValue(error.response.data);
    }
  }
);

const accountSlice = createSlice({
  name: "accounts",
  initialState: {
    isLoading: false,
    isError: false,
    data: [],
    login_id: null,
    totalItems: 1,
  },
  reducers: {
    resetAccountList: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.data = [];
      state.login_id = null;
    },
    setDefaultLoginId: (state, action) => {
      state.login_id = action.payload;
    },
    setLoginList: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(accountList.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(accountList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload?.results; // Update state with fetched data
        state.totalItems = action.payload?.count; // Update state with fetched data
      })
      .addCase(accountList.rejected, (state) => {
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
export const { resetAccountList, setDefaultLoginId, setLoginList } = accountSlice.actions;
export default accountSlice.reducer;

